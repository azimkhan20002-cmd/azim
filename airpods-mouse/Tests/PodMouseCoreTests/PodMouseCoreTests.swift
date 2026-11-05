import XCTest
@testable import PodMouseCore

/// Feeds synthetic gyro data at 25 Hz, the rate AirPods report at.
private struct Feed {
    var time = 0.0
    let dt = 1.0 / 25

    mutating func run(_ calibrator: inout AxisCalibrator, rate: Vector3, seconds: Double) -> [CalibrationFeedback] {
        var out: [CalibrationFeedback] = []
        for _ in 0..<Int((seconds / dt).rounded()) {
            time += dt
            out.append(calibrator.add(rate: rate, at: time))
        }
        return out
    }
}

private func finished(_ events: [CalibrationFeedback]) -> Calibration? {
    for case .finished(let c) in events { return c }
    return nil
}

private func assertClose(_ a: Vector3, _ b: Vector3, accuracy: Double = 0.05, file: StaticString = #filePath, line: UInt = #line) {
    XCTAssertEqual(a.x, b.x, accuracy: accuracy, file: file, line: line)
    XCTAssertEqual(a.y, b.y, accuracy: accuracy, file: file, line: line)
    XCTAssertEqual(a.z, b.z, accuracy: accuracy, file: file, line: line)
}

final class CalibrationTests: XCTestCase {
    // Buds sit tilted in the case, so "turn right" and "tilt up" land on arbitrary sensor axes.
    let bias = Vector3(0.02, -0.01, 0.015)
    let rightAxis = Vector3(0.3, 0.9, -0.2).normalized
    let upAxis = Vector3(0.9, -0.3, 0.1).normalized

    func testLearnsAxesAndBias() {
        var c = AxisCalibrator()
        var feed = Feed()
        _ = feed.run(&c, rate: bias, seconds: 1.2)
        XCTAssertEqual(c.step, .turnRight)
        _ = feed.run(&c, rate: bias + rightAxis * 1.2, seconds: 0.6) // ~41°
        _ = feed.run(&c, rate: bias, seconds: 0.5)
        XCTAssertEqual(c.step, .tiltUp)
        _ = feed.run(&c, rate: bias + upAxis * 1.0, seconds: 0.6)
        let cal = finished(feed.run(&c, rate: bias, seconds: 0.5))

        XCTAssertEqual(c.step, .done)
        let result = try! XCTUnwrap(cal)
        assertClose(result.bias, bias, accuracy: 1e-9)
        assertClose(result.right, rightAxis)
        XCTAssertEqual(result.up.dot(result.right), 0, accuracy: 1e-9)
        XCTAssertGreaterThan(result.up.dot(upAxis), 0.9)
    }

    func testFidgetingRestartsStillWindow() {
        var c = AxisCalibrator()
        var feed = Feed()
        _ = feed.run(&c, rate: .zero, seconds: 0.6)
        _ = feed.run(&c, rate: Vector3(1, 0, 0), seconds: 0.1)
        _ = feed.run(&c, rate: .zero, seconds: 0.6)
        XCTAssertEqual(c.step, .holdStill, "a wobble should restart the one-second still window")
        _ = feed.run(&c, rate: .zero, seconds: 0.6)
        XCTAssertEqual(c.step, .turnRight)
    }

    func testSmallMoveAsksToRetry() {
        var c = AxisCalibrator()
        var feed = Feed()
        _ = feed.run(&c, rate: .zero, seconds: 1.2)
        let events = feed.run(&c, rate: rightAxis * 0.8, seconds: 0.2) + feed.run(&c, rate: .zero, seconds: 0.5)
        XCTAssertTrue(events.contains { if case .retry = $0 { return true } else { return false } })
        XCTAssertEqual(c.step, .turnRight)
    }

    func testTiltThatRepeatsTheTurnIsRejected() {
        var c = AxisCalibrator()
        var feed = Feed()
        _ = feed.run(&c, rate: .zero, seconds: 1.2)
        _ = feed.run(&c, rate: rightAxis * 1.2, seconds: 0.6)
        _ = feed.run(&c, rate: .zero, seconds: 0.5)
        let events = feed.run(&c, rate: rightAxis * 1.2, seconds: 0.6) + feed.run(&c, rate: .zero, seconds: 0.5)
        XCTAssertNil(finished(events))
        XCTAssertEqual(c.step, .tiltUp)
    }
}

final class PointerMapperTests: XCTestCase {
    let cal = Calibration(bias: .zero, right: Vector3(0, 1, 0), up: Vector3(1, 0, 0))

    private func settle(_ m: inout PointerMapper, _ rate: Vector3) -> (dx: Double, dy: Double) {
        var v = (dx: 0.0, dy: 0.0)
        for i in 0..<50 { v = m.velocity(for: rate, at: Double(i) / 25) }
        return v
    }

    func testTurnRightMovesRightAndTiltUpMovesUp() {
        var m = PointerMapper(calibration: cal)
        let right = settle(&m, Vector3(0, 1, 0))
        XCTAssertGreaterThan(right.dx, 100)
        XCTAssertEqual(right.dy, 0, accuracy: 1e-6)

        m = PointerMapper(calibration: cal)
        let up = settle(&m, Vector3(1, 0, 0))
        XCTAssertLessThan(up.dy, -100, "screen y grows downward, so up is negative")
        XCTAssertEqual(up.dx, 0, accuracy: 1e-6)
    }

    func testTremorIsIgnored() {
        var m = PointerMapper(calibration: cal)
        let v = settle(&m, Vector3(0.02, 0.02, 0))
        XCTAssertEqual(v.dx, 0)
        XCTAssertEqual(v.dy, 0)
    }

    func testFastMovesAccelerate() {
        let m = PointerMapper(calibration: cal)
        XCTAssertGreaterThan(m.gain(2.0) / m.gain(0.5), 4.0)
        XCTAssertEqual(m.gain(-1.0), -m.gain(1.0))
    }

    func testBiasTrackingFollowsSlowDrift() {
        var m = PointerMapper(calibration: cal)
        let drift = Vector3(0.01, 0.01, 0)
        for _ in 0..<1000 { m.trackBias(with: drift) }
        assertClose(m.calibration.bias, drift, accuracy: 1e-3)
        m.trackBias(with: Vector3(2, 0, 0)) // real movement must not be absorbed
        assertClose(m.calibration.bias, drift, accuracy: 1e-3)
    }
}

final class GestureTests: XCTestCase {
    func testTapDoubleTapAndRearm() {
        var g = GestureDetector()
        let knock = Vector3(0, 0, 0.9)
        XCTAssertEqual(g.add(acceleration: knock, turn: 0, tilt: 0, twist: 0, at: 1.00), .tap(count: 1))
        XCTAssertNil(g.add(acceleration: knock, turn: 0, tilt: 0, twist: 0, at: 1.04), "one knock, one click")
        XCTAssertNil(g.add(acceleration: .zero, turn: 0, tilt: 0, twist: 0, at: 1.08))
        XCTAssertEqual(g.add(acceleration: knock, turn: 0, tilt: 0, twist: 0, at: 1.30), .tap(count: 2))
        XCTAssertNil(g.add(acceleration: .zero, turn: 0, tilt: 0, twist: 0, at: 1.34))
        XCTAssertEqual(g.add(acceleration: knock, turn: 0, tilt: 0, twist: 0, at: 3.00), .tap(count: 1))
    }

    func testSwingIsNotATap() {
        var g = GestureDetector()
        XCTAssertNil(g.add(acceleration: Vector3(0.8, 0, 0), turn: 4, tilt: 1, twist: 0, at: 1))
    }

    func testTwistRightClicksButFastDiagonalDoesNot() {
        var g = GestureDetector()
        XCTAssertNil(g.add(acceleration: .zero, turn: 6, tilt: 6, twist: 7, at: 1))
        XCTAssertEqual(g.add(acceleration: Vector3(0.6, 0, 0), turn: 1, tilt: 0, twist: -8, at: 2), .twist)
        XCTAssertNil(g.add(acceleration: Vector3(0.6, 0, 0), turn: 0, tilt: 0, twist: 0, at: 2.1),
                     "the jolt from a flick must not also click")
    }

    func testDisabledGesturesStayQuiet() {
        var s = GestureSettings()
        s.tapsEnabled = false
        s.twistEnabled = false
        var g = GestureDetector(settings: s)
        XCTAssertNil(g.add(acceleration: Vector3(0, 0, 2), turn: 0, tilt: 0, twist: 0, at: 1))
        XCTAssertNil(g.add(acceleration: .zero, turn: 0, tilt: 0, twist: 9, at: 2))
    }
}

final class SupportTests: XCTestCase {
    func testDwellClicksOnceAfterRestingThenRearms() {
        var d = DwellClicker()
        var clicks = 0
        var t = 0.0
        func step(_ speed: Double, _ moved: Double) {
            t += 1.0 / 120
            if d.update(speed: speed, moved: moved, at: t) { clicks += 1 }
        }
        for _ in 0..<60 { step(500, 4) }   // move ~240 px
        for _ in 0..<240 { step(0, 0) }    // rest 2 s
        XCTAssertEqual(clicks, 1)
        for _ in 0..<5 { step(500, 4) }    // 20 px: not enough to re-arm
        for _ in 0..<240 { step(0, 0) }
        XCTAssertEqual(clicks, 1)
    }

    func testHistoryRewinds() {
        var h = PositionHistory()
        h.record(x: 10, y: 10, at: 1.0)
        h.record(x: 50, y: 60, at: 1.1)
        h.record(x: 90, y: 90, at: 1.2)
        XCTAssertEqual(h.position(atOrBefore: 1.15)?.x, 50)
        XCTAssertEqual(h.position(atOrBefore: 0.5)?.x, 10, "falls back to the oldest kept")
    }

    func testOneEuroSmoothsJitterButTracksSteps() {
        var f = OneEuroFilter()
        var out = 0.0
        for i in 0..<100 { out = f.filter(i.isMultiple(of: 2) ? 0.1 : -0.1, at: Double(i) / 25) }
        XCTAssertLessThan(abs(out), 0.1)
        for i in 100..<150 { out = f.filter(5, at: Double(i) / 25) }
        XCTAssertEqual(out, 5, accuracy: 0.05)
    }

    func testQuaternionBodyRate() {
        let axis = Vector3(0, 0, 1)
        let a = Quaternion(axis: axis, angle: 0.3)
        let b = a * Quaternion(axis: axis, angle: 0.05)
        assertClose(Quaternion.bodyRate(from: a, to: b, dt: 0.04), axis * 1.25, accuracy: 1e-9)
    }
}
