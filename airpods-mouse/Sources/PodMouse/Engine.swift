import AppKit
import Carbon.HIToolbox
import Combine
import CoreMotion
import PodMouseCore

/// Reads AirPods motion and turns it into pointer movement, clicks and scrolling.
///
/// Everything runs on the main thread: motion updates are delivered to `OperationQueue.main`
/// and the 120 Hz movement timer is on the main run loop.
final class Engine: NSObject, ObservableObject, CMHeadphoneMotionManagerDelegate {
    enum Mode: Equatable { case idle, calibrating, running }

    // MARK: Status shown in the UI

    @Published private(set) var mode: Mode = .idle
    @Published private(set) var paused = false
    @Published private(set) var accessibilityTrusted = Accessibility.isTrusted
    @Published private(set) var motionAvailable = false
    @Published private(set) var motionDenied = false
    @Published private(set) var deviceConnected = false
    @Published private(set) var samplesPerSecond = 0.0
    @Published private(set) var joltLevel = 0.0
    @Published private(set) var lastAction = ""
    @Published private(set) var calibration: Calibration?
    @Published private(set) var calibrationStep: CalibrationStep = .holdStill
    @Published private(set) var calibrationProgress = 0.0
    @Published private(set) var calibrationHint: String?

    // MARK: Settings (saved between launches)

    @Published var scrollMode = false {
        didSet { velocity = (0, 0) }
    }
    @Published var sensitivity = 1.0 {
        didSet { mapper?.settings.sensitivity = sensitivity; save() }
    }
    @Published var tapThreshold = GestureSettings().tapThreshold {
        didSet { gestures.settings.tapThreshold = tapThreshold; save() }
    }
    @Published var tapsEnabled = true {
        didSet { gestures.settings.tapsEnabled = tapsEnabled; save() }
    }
    @Published var twistEnabled = true {
        didSet { gestures.settings.twistEnabled = twistEnabled; save() }
    }
    @Published var dwellEnabled = false {
        didSet { save() }
    }

    var isLive: Bool { mode == .running && !paused }
    var hasSignal: Bool { samplesPerSecond > 5 }

    // MARK: Internals

    private let motion = CMHeadphoneMotionManager()
    private let defaults = UserDefaults.standard
    private var calibrator = AxisCalibrator()
    private var mapper: PointerMapper?
    private var gestures = GestureDetector()
    private var dwell = DwellClicker()
    private var history = PositionHistory()
    private var mouse = Mouse()
    private var velocity: (dx: Double, dy: Double) = (0, 0)
    private var lastAttitude: Quaternion?
    private var lastTimestamp: Double?
    private var lastSampleUptime = -Double.infinity
    private var holdUntil = 0.0
    private var sampleCount = 0
    private var joltPeak = 0.0
    private var lastTick: Double?
    private var lastStats = ProcessInfo.processInfo.systemUptime
    private var lastPermissionCheck = 0.0
    private var lastPointer: CGPoint?
    private var timer: Timer?
    private var hotKeys: [HotKey] = []
    private var loading = true

    override init() {
        super.init()
        loadSettings()
        motion.delegate = self
        motionAvailable = motion.isDeviceMotionAvailable
        if let saved = calibration {
            mapper = PointerMapper(calibration: saved, settings: pointerSettings)
            mode = .running
        }
        startMotion()

        let timer = Timer(timeInterval: 1.0 / 120, repeats: true) { [weak self] _ in self?.tick() }
        RunLoop.main.add(timer, forMode: .common)
        self.timer = timer

        hotKeys = [
            HotKey(id: 1, keyCode: kVK_ANSI_M, modifiers: controlKey | optionKey) { [weak self] in self?.togglePause() },
            HotKey(id: 2, keyCode: kVK_ANSI_S, modifiers: controlKey | optionKey) { [weak self] in self?.scrollMode.toggle() },
        ]
    }

    // MARK: Actions

    func startCalibration() {
        calibrator.restart()
        calibrationStep = .holdStill
        calibrationProgress = 0
        calibrationHint = nil
        velocity = (0, 0)
        mode = .calibrating
    }

    func cancelCalibration() {
        mode = calibration == nil ? .idle : .running
    }

    func togglePause() {
        guard mode == .running else { return }
        paused.toggle()
        velocity = (0, 0)
        mapper?.reset()
        lastAction = paused ? "Paused" : "Resumed"
    }

    func requestAccessibility() {
        Accessibility.requestTrust()
        if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility") {
            NSWorkspace.shared.open(url)
        }
    }

    func openPrivacySettings() {
        if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security") {
            NSWorkspace.shared.open(url)
        }
    }

    // MARK: Motion

    private func startMotion() {
        guard motionAvailable else { return }
        motion.startDeviceMotionUpdates(to: .main) { [weak self] data, error in
            guard let self else { return }
            if error != nil {
                self.motionDenied = CMHeadphoneMotionManager.authorizationStatus() == .denied
                return
            }
            if let data { self.handle(data) }
        }
    }

    func headphoneMotionManagerDidConnect(_ manager: CMHeadphoneMotionManager) {
        DispatchQueue.main.async { self.deviceConnected = true }
    }

    func headphoneMotionManagerDidDisconnect(_ manager: CMHeadphoneMotionManager) {
        DispatchQueue.main.async {
            self.deviceConnected = false
            self.velocity = (0, 0)
        }
    }

    private func handle(_ data: CMDeviceMotion) {
        let t = data.timestamp
        let now = ProcessInfo.processInfo.systemUptime
        sampleCount += 1
        lastSampleUptime = now
        if !deviceConnected { deviceConnected = true }

        var rate = Vector3(data.rotationRate.x, data.rotationRate.y, data.rotationRate.z)
        let q = data.attitude.quaternion
        let attitude = Quaternion(w: q.w, x: q.x, y: q.y, z: q.z)
        // Some firmware leaves rotationRate empty; derive it from the attitude change instead.
        if rate.length < 1e-9, let previous = lastAttitude, let previousTime = lastTimestamp {
            rate = Quaternion.bodyRate(from: previous, to: attitude, dt: t - previousTime)
        }
        lastAttitude = attitude
        lastTimestamp = t

        let acceleration = Vector3(data.userAcceleration.x, data.userAcceleration.y, data.userAcceleration.z)
        joltPeak = max(joltPeak, acceleration.length)

        switch mode {
        case .calibrating: calibrate(with: rate, at: t)
        case .running: steer(with: rate, acceleration: acceleration, at: t, now: now)
        case .idle: break
        }
    }

    private func calibrate(with rate: Vector3, at t: Double) {
        switch calibrator.add(rate: rate, at: t) {
        case .progress(let p):
            calibrationProgress = p
        case .advanced(let step):
            calibrationStep = step
            calibrationProgress = 0
            calibrationHint = nil
        case .retry(let message):
            calibrationHint = message
            calibrationProgress = 0
        case .finished(let result):
            calibration = result
            calibrationStep = .done
            calibrationProgress = 1
            calibrationHint = nil
            mapper = PointerMapper(calibration: result, settings: pointerSettings)
            paused = false
            mode = .running
            lastAction = "Calibrated"
            save()
        }
    }

    private func steer(with rate: Vector3, acceleration: Vector3, at t: Double, now: Double) {
        guard var mapper else { return }
        let parts = mapper.calibration.components(of: rate)
        mapper.trackBias(with: rate)
        let v = mapper.velocity(for: rate, at: t)
        self.mapper = mapper
        velocity = now < holdUntil ? (dx: 0, dy: 0) : v

        guard !paused, accessibilityTrusted,
              let gesture = gestures.add(acceleration: acceleration, turn: parts.turn,
                                         tilt: parts.tilt, twist: parts.twist, at: t) else { return }
        perform(gesture, now: now)
    }

    private func perform(_ gesture: Gesture, now: Double) {
        // A knock or flick also jerks the gyro, so click where the pointer was just before it.
        let target = history.position(atOrBefore: now - 0.12).map { CGPoint(x: $0.x, y: $0.y) } ?? mouse.location
        if !scrollMode { mouse.warp(to: target) }
        let point = scrollMode ? mouse.location : target
        velocity = (0, 0)
        holdUntil = now + 0.18
        switch gesture {
        case .tap(let count):
            mouse.click(.left, count: count, at: point)
            lastAction = ["Click", "Double-click", "Triple-click"][min(count, 3) - 1]
        case .twist:
            mouse.click(.right, count: 1, at: point)
            lastAction = "Right-click"
        }
    }

    // MARK: 120 Hz loop

    private func tick() {
        let now = ProcessInfo.processInfo.systemUptime
        let dt = lastTick.map { min(now - $0, 0.05) } ?? 0
        lastTick = now
        if now - lastSampleUptime > 0.2 { velocity = (0, 0) } // lid closed or out of range

        if isLive && accessibilityTrusted {
            if velocity.dx != 0 || velocity.dy != 0 {
                if scrollMode {
                    mouse.scroll(dx: -velocity.dx * dt * 0.4, dy: -velocity.dy * dt * 0.4)
                } else {
                    mouse.move(dx: velocity.dx * dt, dy: velocity.dy * dt)
                }
            }
            let p = mouse.location
            history.record(x: Double(p.x), y: Double(p.y), at: now)
            let moved = lastPointer.map { Double(hypot(p.x - $0.x, p.y - $0.y)) } ?? 0
            lastPointer = p
            if dwellEnabled && !scrollMode && dt > 0,
               dwell.update(speed: moved / dt, moved: moved, at: now) {
                mouse.click(.left, count: 1, at: p)
                lastAction = "Dwell click"
            }
        }

        if now - lastStats >= 0.25 { publishStats(now) }
    }

    private func publishStats(_ now: Double) {
        samplesPerSecond = Double(sampleCount) / (now - lastStats)
        sampleCount = 0
        joltLevel = joltPeak
        joltPeak *= 0.5
        lastStats = now
        if now - lastPermissionCheck >= 1 {
            lastPermissionCheck = now
            let trusted = Accessibility.isTrusted
            if trusted != accessibilityTrusted { accessibilityTrusted = trusted }
            let denied = CMHeadphoneMotionManager.authorizationStatus() == .denied
            if denied != motionDenied { motionDenied = denied }
        }
    }

    // MARK: Persistence

    private var pointerSettings: PointerSettings {
        var s = PointerSettings()
        s.sensitivity = sensitivity
        return s
    }

    private func loadSettings() {
        loading = true
        defer { loading = false }
        if let data = defaults.data(forKey: "calibration") {
            calibration = try? JSONDecoder().decode(Calibration.self, from: data)
        }
        if defaults.object(forKey: "sensitivity") != nil { sensitivity = defaults.double(forKey: "sensitivity") }
        if defaults.object(forKey: "tapThreshold") != nil { tapThreshold = defaults.double(forKey: "tapThreshold") }
        if defaults.object(forKey: "tapsEnabled") != nil { tapsEnabled = defaults.bool(forKey: "tapsEnabled") }
        if defaults.object(forKey: "twistEnabled") != nil { twistEnabled = defaults.bool(forKey: "twistEnabled") }
        dwellEnabled = defaults.bool(forKey: "dwellEnabled")
        gestures.settings.tapThreshold = tapThreshold
        gestures.settings.tapsEnabled = tapsEnabled
        gestures.settings.twistEnabled = twistEnabled
    }

    private func save() {
        guard !loading else { return }
        if let calibration, let data = try? JSONEncoder().encode(calibration) {
            defaults.set(data, forKey: "calibration")
        }
        defaults.set(sensitivity, forKey: "sensitivity")
        defaults.set(tapThreshold, forKey: "tapThreshold")
        defaults.set(tapsEnabled, forKey: "tapsEnabled")
        defaults.set(twistEnabled, forKey: "twistEnabled")
        defaults.set(dwellEnabled, forKey: "dwellEnabled")
    }
}
