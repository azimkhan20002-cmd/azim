import Foundation

/// How the earbuds sit inside *your* case, learned from three short moves.
///
/// The AirPods' gyro reports rotation in the earbud's own frame. Inside the case the buds
/// sit stem-down at an angle, so the axes don't line up with the case. Instead of guessing,
/// we ask the user to turn the case right and tilt it up, and keep the measured rotation axes.
public struct Calibration: Codable, Equatable, Sendable {
    /// Gyro reading at rest (rad/s); subtracted from every sample.
    public var bias: Vector3
    /// Unit axis: rotating about it positively = "turn right" (pointer goes right).
    public var right: Vector3
    /// Unit axis, orthogonal to `right`: rotating about it positively = "tilt up" (pointer goes up).
    public var up: Vector3

    public init(bias: Vector3, right: Vector3, up: Vector3) {
        self.bias = bias
        self.right = right
        self.up = up
    }

    /// Third axis: rolling the case like turning a key. Used for the right-click flick.
    public var twist: Vector3 { right.cross(up) }

    /// Split a raw gyro sample into (turn, tilt, twist) rates in rad/s.
    public func components(of rate: Vector3) -> (turn: Double, tilt: Double, twist: Double) {
        let w = rate - bias
        return (w.dot(right), w.dot(up), w.dot(twist))
    }
}

public enum CalibrationStep: Int, Codable, Sendable, CaseIterable {
    case holdStill, turnRight, tiltUp, done
}

public enum CalibrationFeedback: Equatable, Sendable {
    /// 0...1 within the current step.
    case progress(Double)
    case advanced(to: CalibrationStep)
    case retry(String)
    case finished(Calibration)
}

/// Step-by-step calibration: hold still → turn right → tilt up.
public struct AxisCalibrator: Sendable {
    public struct Config: Sendable {
        public var stillDuration = 1.0      // s of stillness to measure gyro bias
        public var stillTolerance = 0.2     // rad/s wobble allowed while "still"
        public var startRate = 0.5          // rad/s that counts as the move starting
        public var stopRate = 0.25          // rad/s that counts as stopped
        public var stopHold = 0.3           // s stopped before the move counts as done
        public var minAngle = 0.35          // rad (~20°) a move must cover
        public var targetAngle = 0.6        // rad (~35°) shown as a full progress bar
        public var maxGesture = 4.0         // s; a move longer than this is closed out
        public var minOrthogonality = 0.5   // tilt must differ from turn by at least ~30°
        public init() {}
    }

    public var config: Config
    public private(set) var step: CalibrationStep = .holdStill

    private var lastTime: Double?
    private var stillStart: Double?
    private var stillSum = Vector3.zero
    private var stillCount = 0
    private var bias = Vector3.zero
    private var right = Vector3.zero
    private var gestureStart: Double?
    private var stoppedSince: Double?
    private var integral = Vector3.zero

    public init(config: Config = Config()) {
        self.config = config
    }

    public mutating func restart() {
        self = AxisCalibrator(config: config)
    }

    public mutating func add(rate: Vector3, at time: Double) -> CalibrationFeedback {
        let dt = lastTime.map { min(max(time - $0, 0), 0.1) } ?? 0
        lastTime = time
        switch step {
        case .holdStill: return addStill(rate, at: time)
        case .turnRight, .tiltUp: return addGesture(rate, dt: dt, at: time)
        case .done: return .progress(1)
        }
    }

    private mutating func addStill(_ rate: Vector3, at time: Double) -> CalibrationFeedback {
        if stillCount >= 3 {
            let mean = stillSum / Double(stillCount)
            if (rate - mean).length > config.stillTolerance {
                stillStart = nil // moved: start the still window over
            }
        }
        guard let start = stillStart else {
            stillStart = time
            stillSum = rate
            stillCount = 1
            return .progress(0)
        }
        stillSum += rate
        stillCount += 1
        let elapsed = time - start
        if elapsed >= config.stillDuration && stillCount >= 5 {
            bias = stillSum / Double(stillCount)
            step = .turnRight
            return .advanced(to: .turnRight)
        }
        return .progress(min(elapsed / config.stillDuration, 1))
    }

    private mutating func addGesture(_ rate: Vector3, dt: Double, at time: Double) -> CalibrationFeedback {
        let w = rate - bias
        guard let start = gestureStart else {
            if w.length > config.startRate {
                gestureStart = time
                integral = w * dt
                stoppedSince = nil
            }
            return .progress(0)
        }
        integral += w * dt
        if w.length < config.stopRate {
            if stoppedSince == nil { stoppedSince = time }
        } else {
            stoppedSince = nil
        }
        if let s = stoppedSince, time - s >= config.stopHold { return finishGesture() }
        if time - start > config.maxGesture { return finishGesture() }
        return .progress(min(integral.length / config.targetAngle, 1))
    }

    private mutating func finishGesture() -> CalibrationFeedback {
        let raw = integral
        gestureStart = nil
        stoppedSince = nil
        integral = .zero
        guard raw.length >= config.minAngle else {
            return .retry("Not quite enough. Move it about 30–45°, then hold it there.")
        }
        switch step {
        case .turnRight:
            right = raw.normalized
            step = .tiltUp
            return .advanced(to: .tiltUp)
        case .tiltUp:
            let orthogonal = raw - right * raw.dot(right)
            guard orthogonal.length >= config.minOrthogonality * raw.length else {
                return .retry("That looked like a turn again. Tip the top of the case up, like nodding.")
            }
            step = .done
            return .finished(Calibration(bias: bias, right: right, up: orthogonal.normalized))
        case .holdStill, .done:
            return .progress(1)
        }
    }
}
