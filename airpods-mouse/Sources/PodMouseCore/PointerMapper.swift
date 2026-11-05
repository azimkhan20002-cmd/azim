import Foundation

public struct PointerSettings: Codable, Equatable, Sendable {
    /// Overall speed multiplier (the Sensitivity slider).
    public var sensitivity: Double = 1.0
    /// How much faster quick flicks travel than slow, precise moves.
    public var acceleration: Double = 0.6
    /// Rotation below this (rad/s) is treated as hand tremor and ignored.
    public var deadzone: Double = 0.035
    /// Pixels per radian of rotation at sensitivity 1, before acceleration.
    public var pixelsPerRadian: Double = 750

    public init() {}
}

/// Turns gyro samples into pointer velocity, like an air mouse:
/// turn the case right → pointer moves right; tilt it up → pointer moves up.
public struct PointerMapper: Sendable {
    public var settings: PointerSettings
    public private(set) var calibration: Calibration

    private var turnFilter = OneEuroFilter()
    private var tiltFilter = OneEuroFilter()

    public init(calibration: Calibration, settings: PointerSettings = PointerSettings()) {
        self.calibration = calibration
        self.settings = settings
    }

    public mutating func reset() {
        turnFilter.reset()
        tiltFilter.reset()
    }

    /// Pointer velocity in screen pixels per second. Screen y grows downward (CoreGraphics).
    public mutating func velocity(for rate: Vector3, at time: Double) -> (dx: Double, dy: Double) {
        let c = calibration.components(of: rate)
        let turn = turnFilter.filter(c.turn, at: time)
        let tilt = tiltFilter.filter(c.tilt, at: time)
        return (gain(turn), -gain(tilt))
    }

    /// Soft deadzone, then a gentle speed curve.
    func gain(_ rate: Double) -> Double {
        let magnitude = max(0, abs(rate) - settings.deadzone)
        guard magnitude > 0 else { return 0 }
        let pixels = magnitude * settings.pixelsPerRadian * settings.sensitivity * (1 + settings.acceleration * magnitude)
        return rate < 0 ? -pixels : pixels
    }

    /// Gyro bias wanders as the sensor warms up. While the case is clearly at rest,
    /// let the stored bias drift slowly toward the current reading.
    public mutating func trackBias(with rate: Vector3) {
        let residual = rate - calibration.bias
        guard residual.length < settings.deadzone else { return }
        calibration.bias = calibration.bias + residual * 0.01
    }
}
