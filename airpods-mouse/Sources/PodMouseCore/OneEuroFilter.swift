import Foundation

/// The 1€ filter (Casiez et al., CHI 2012): heavy smoothing when the signal moves slowly
/// (kills hand tremor while aiming), light smoothing when it moves fast (no lag on big sweeps).
public struct OneEuroFilter: Sendable {
    public var minCutoff: Double
    public var beta: Double
    public var derivativeCutoff: Double

    private var lastValue: Double?
    private var lastDerivative: Double = 0
    private var lastTime: Double?

    public init(minCutoff: Double = 1.2, beta: Double = 0.4, derivativeCutoff: Double = 1.0) {
        self.minCutoff = minCutoff
        self.beta = beta
        self.derivativeCutoff = derivativeCutoff
    }

    public mutating func reset() {
        lastValue = nil
        lastDerivative = 0
        lastTime = nil
    }

    public mutating func filter(_ value: Double, at time: Double) -> Double {
        guard let prev = lastValue, let prevTime = lastTime else {
            lastValue = value
            lastTime = time
            return value
        }
        // Samples arrive at roughly 25-50 Hz; guard against duplicate or out-of-order stamps.
        let dt = min(max(time - prevTime, 1.0 / 400), 0.25)
        let derivative = (value - prev) / dt
        let dHat = Self.smooth(derivative, previous: lastDerivative, cutoff: derivativeCutoff, dt: dt)
        let cutoff = minCutoff + beta * abs(dHat)
        let out = Self.smooth(value, previous: prev, cutoff: cutoff, dt: dt)
        lastValue = out
        lastDerivative = dHat
        lastTime = time
        return out
    }

    private static func smooth(_ x: Double, previous: Double, cutoff: Double, dt: Double) -> Double {
        let tau = 1 / (2 * Double.pi * cutoff)
        let alpha = 1 / (1 + tau / dt)
        return previous + alpha * (x - previous)
    }
}
