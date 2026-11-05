import Foundation

/// A 3-D vector in the AirPods' sensor frame (radians/s for rates, g for acceleration).
public struct Vector3: Equatable, Codable, Sendable {
    public var x: Double
    public var y: Double
    public var z: Double

    public init(_ x: Double, _ y: Double, _ z: Double) {
        self.x = x
        self.y = y
        self.z = z
    }

    public static let zero = Vector3(0, 0, 0)

    public var length: Double { (x * x + y * y + z * z).squareRoot() }

    /// Unit vector in the same direction, or `.zero` if this vector is (almost) zero.
    public var normalized: Vector3 {
        let l = length
        return l < 1e-12 ? .zero : self / l
    }

    public func dot(_ o: Vector3) -> Double { x * o.x + y * o.y + z * o.z }

    public func cross(_ o: Vector3) -> Vector3 {
        Vector3(y * o.z - z * o.y, z * o.x - x * o.z, x * o.y - y * o.x)
    }

    public static func + (a: Vector3, b: Vector3) -> Vector3 { Vector3(a.x + b.x, a.y + b.y, a.z + b.z) }
    public static func - (a: Vector3, b: Vector3) -> Vector3 { Vector3(a.x - b.x, a.y - b.y, a.z - b.z) }
    public static func * (a: Vector3, s: Double) -> Vector3 { Vector3(a.x * s, a.y * s, a.z * s) }
    public static func / (a: Vector3, s: Double) -> Vector3 { Vector3(a.x / s, a.y / s, a.z / s) }
    public static func += (a: inout Vector3, b: Vector3) { a = a + b }
}

/// Unit quaternion (w + xi + yj + zk), used to recover angular velocity from attitude
/// when a headset reports attitude but leaves `rotationRate` empty.
public struct Quaternion: Equatable, Sendable {
    public var w: Double, x: Double, y: Double, z: Double

    public init(w: Double, x: Double, y: Double, z: Double) {
        self.w = w
        self.x = x
        self.y = y
        self.z = z
    }

    public var conjugate: Quaternion { Quaternion(w: w, x: -x, y: -y, z: -z) }

    public static func * (a: Quaternion, b: Quaternion) -> Quaternion {
        Quaternion(
            w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
            x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
            y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
            z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
        )
    }

    /// Rotation of `angle` radians about `axis`.
    public init(axis: Vector3, angle: Double) {
        let n = axis.normalized
        let s = sin(angle / 2)
        self.init(w: cos(angle / 2), x: n.x * s, y: n.y * s, z: n.z * s)
    }

    /// Body-frame angular velocity (rad/s) that turns `previous` into `current` over `dt` seconds.
    public static func bodyRate(from previous: Quaternion, to current: Quaternion, dt: Double) -> Vector3 {
        guard dt > 0 else { return .zero }
        var d = previous.conjugate * current
        if d.w < 0 { d = Quaternion(w: -d.w, x: -d.x, y: -d.y, z: -d.z) } // shortest path
        let v = Vector3(d.x, d.y, d.z)
        let s = v.length
        guard s > 1e-12 else { return .zero }
        let angle = 2 * atan2(s, d.w)
        return v / s * (angle / dt)
    }
}
