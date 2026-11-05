import ApplicationServices
import CoreGraphics

/// Posts synthetic pointer events. Needs the Accessibility permission.
struct Mouse {
    private let source = CGEventSource(stateID: .hidSystemState)
    private var remainder = CGPoint.zero
    private var scrollRemainder = CGPoint.zero

    /// Pointer position in global CoreGraphics coordinates (origin top-left of the main display).
    var location: CGPoint { CGEvent(source: nil)?.location ?? .zero }

    /// Move by a sub-pixel delta; fractions carry over to the next call.
    @discardableResult
    mutating func move(dx: Double, dy: Double) -> CGPoint {
        let current = location
        let wantX = Double(current.x) + dx + Double(remainder.x)
        let wantY = Double(current.y) + dy + Double(remainder.y)
        let target = CGPoint(x: wantX.rounded(), y: wantY.rounded())
        remainder = CGPoint(x: wantX - Double(target.x), y: wantY - Double(target.y))
        let clamped = Self.clampToDisplays(target, near: current)
        if clamped != target { remainder = .zero }
        if clamped != current { post(.mouseMoved, at: clamped, button: .left) }
        return clamped
    }

    func warp(to point: CGPoint) {
        post(.mouseMoved, at: Self.clampToDisplays(point, near: location), button: .left)
    }

    func click(_ button: CGMouseButton, count: Int, at point: CGPoint) {
        let (down, up): (CGEventType, CGEventType) = button == .right
            ? (.rightMouseDown, .rightMouseUp)
            : (.leftMouseDown, .leftMouseUp)
        for type in [down, up] {
            guard let event = CGEvent(mouseEventSource: source, mouseType: type,
                                      mouseCursorPosition: point, mouseButton: button) else { continue }
            event.setIntegerValueField(.mouseEventClickState, value: Int64(max(1, count)))
            event.post(tap: .cghidEventTap)
        }
    }

    /// Pixel-precise scroll. Positive `dy` scrolls content up (like moving fingers down).
    mutating func scroll(dx: Double, dy: Double) {
        let wantX = dx + Double(scrollRemainder.x)
        let wantY = dy + Double(scrollRemainder.y)
        let x = Int32(wantX.rounded(.towardZero))
        let y = Int32(wantY.rounded(.towardZero))
        scrollRemainder = CGPoint(x: wantX - Double(x), y: wantY - Double(y))
        guard x != 0 || y != 0,
              let event = CGEvent(scrollWheelEvent2Source: source, units: .pixel,
                                  wheelCount: 2, wheel1: y, wheel2: x, wheel3: 0) else { return }
        event.post(tap: .cghidEventTap)
    }

    private func post(_ type: CGEventType, at point: CGPoint, button: CGMouseButton) {
        CGEvent(mouseEventSource: source, mouseType: type, mouseCursorPosition: point, mouseButton: button)?
            .post(tap: .cghidEventTap)
    }

    /// Keep the pointer on a connected display (handles multi-monitor gaps).
    static func clampToDisplays(_ p: CGPoint, near fallback: CGPoint) -> CGPoint {
        var count: UInt32 = 0
        guard CGGetActiveDisplayList(0, nil, &count) == .success, count > 0 else { return p }
        var ids = [CGDirectDisplayID](repeating: 0, count: Int(count))
        guard CGGetActiveDisplayList(count, &ids, &count) == .success else { return p }
        let rects = ids.prefix(Int(count)).map { CGDisplayBounds($0) }
        if rects.contains(where: { $0.contains(p) }) { return p }
        var best = fallback
        var bestDistance = CGFloat.infinity
        for r in rects {
            let c = CGPoint(x: min(max(p.x, r.minX), r.maxX - 1), y: min(max(p.y, r.minY), r.maxY - 1))
            let d = hypot(c.x - p.x, c.y - p.y)
            if d < bestDistance {
                bestDistance = d
                best = c
            }
        }
        return best
    }
}

enum Accessibility {
    static var isTrusted: Bool { AXIsProcessTrusted() }

    /// Shows the system prompt that deep-links to Privacy & Security → Accessibility.
    static func requestTrust() {
        // Value of kAXTrustedCheckOptionPrompt; spelled out because SDKs disagree on its Swift type.
        _ = AXIsProcessTrustedWithOptions(["AXTrustedCheckOptionPrompt": true] as CFDictionary)
    }
}
