import Foundation

public enum Gesture: Equatable, Sendable {
    /// Tap on the case. `count` is 1 for a click, 2 for a double-click, 3 for a triple-click.
    case tap(count: Int)
    /// Quick wrist flick (roll the case like turning a key): right-click.
    case twist
}

public struct GestureSettings: Codable, Equatable, Sendable {
    /// Acceleration spike (in g, gravity removed) that counts as a tap. Lower = more sensitive.
    public var tapThreshold: Double = 0.45
    /// A spike while the case is swinging faster than this (rad/s) is movement, not a tap.
    public var tapMaxRotation: Double = 3.0
    public var tapRefractory: Double = 0.15
    public var multiTapWindow: Double = 0.45
    /// Roll speed (rad/s) that counts as a twist.
    public var twistThreshold: Double = 6.0
    /// The roll must beat the turn/tilt rate by this factor, so a fast diagonal swing isn't a twist.
    public var twistDominance: Double = 1.5
    public var twistRefractory: Double = 0.6
    public var tapsEnabled = true
    public var twistEnabled = true

    public init() {}
}

public struct GestureDetector: Sendable {
    public var settings: GestureSettings

    private var armed = true
    private var lastTapTime = -Double.infinity
    private var tapCount = 0
    private var lastTwistTime = -Double.infinity

    public init(settings: GestureSettings = GestureSettings()) {
        self.settings = settings
    }

    /// - Parameters:
    ///   - acceleration: user acceleration in g, gravity removed.
    ///   - turn, tilt, twist: calibrated rotation rates in rad/s.
    public mutating func add(acceleration: Vector3, turn: Double, tilt: Double, twist: Double,
                             at time: Double) -> Gesture? {
        let planar = (turn * turn + tilt * tilt).squareRoot()

        if settings.twistEnabled,
           abs(twist) > settings.twistThreshold,
           abs(twist) > settings.twistDominance * planar,
           time - lastTwistTime > settings.twistRefractory {
            lastTwistTime = time
            armed = false
            return .twist
        }

        let jolt = acceleration.length
        // Re-arm once the spike has died down, so one knock can't fire twice.
        if jolt < settings.tapThreshold * 0.5 { armed = true }

        guard settings.tapsEnabled,
              armed,
              jolt > settings.tapThreshold,
              planar < settings.tapMaxRotation,
              time - lastTwistTime > settings.twistRefractory,
              time - lastTapTime > settings.tapRefractory else { return nil }

        armed = false
        tapCount = time - lastTapTime <= settings.multiTapWindow ? min(tapCount + 1, 3) : 1
        lastTapTime = time
        return .tap(count: tapCount)
    }
}

/// Fallback for when taps don't register well: rest the pointer and it clicks.
public struct DwellClicker: Sendable {
    public var dwellTime = 0.9          // s the pointer must rest
    public var stillSpeed = 25.0        // px/s that still counts as resting
    public var rearmDistance = 40.0     // px of travel needed before the next dwell click

    private var stillSince: Double?
    private var travelSinceClick = Double.infinity

    public init() {}

    /// Feed the pointer's speed (px/s) and distance moved this tick (px). Returns true to click.
    public mutating func update(speed: Double, moved: Double, at time: Double) -> Bool {
        travelSinceClick += moved
        guard speed < stillSpeed else {
            stillSince = nil
            return false
        }
        if stillSince == nil { stillSince = time }
        guard let since = stillSince, time - since >= dwellTime, travelSinceClick >= rearmDistance else {
            return false
        }
        travelSinceClick = 0
        stillSince = nil
        return true
    }
}

/// Recent pointer positions, so a click can land where the pointer was *before*
/// the tap jolted the case.
public struct PositionHistory: Sendable {
    private var entries: [(time: Double, x: Double, y: Double)] = []
    public var span: Double = 0.5

    public init() {}

    public mutating func record(x: Double, y: Double, at time: Double) {
        entries.append((time, x, y))
        while let first = entries.first, time - first.time > span { entries.removeFirst() }
    }

    /// The newest recorded position at or before `time`, or the oldest one kept.
    public func position(atOrBefore time: Double) -> (x: Double, y: Double)? {
        guard let match = entries.last(where: { $0.time <= time }) ?? entries.first else { return nil }
        return (match.x, match.y)
    }

    public mutating func removeAll() { entries.removeAll() }
}
