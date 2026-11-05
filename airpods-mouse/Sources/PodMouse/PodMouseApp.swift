import AppKit
import SwiftUI

@main
struct PodMouseApp: App {
    @StateObject private var engine = Engine()

    var body: some Scene {
        // First scene, so it opens at launch. Close it and PodMouse keeps running in the menu bar.
        Window("PodMouse", id: "setup") {
            SetupView()
                .environmentObject(engine)
        }
        .windowResizability(.contentSize)
        .defaultPosition(.center)

        MenuBarExtra {
            MenuContent()
                .environmentObject(engine)
        } label: {
            Image(systemName: engine.menuSymbol)
        }
    }
}

extension Engine {
    var menuSymbol: String {
        switch mode {
        case .running where paused: return "pause.circle"
        case .running where hasSignal: return "cursorarrow.motionlines"
        case .calibrating: return "scope"
        default: return "cursorarrow"
        }
    }

    var statusLine: String {
        if !accessibilityTrusted { return "Needs Accessibility permission" }
        if !hasSignal { return "Waiting for AirPods motion…" }
        switch mode {
        case .idle: return "Not calibrated yet"
        case .calibrating: return "Calibrating…"
        case .running: return paused ? "Paused" : (scrollMode ? "On · scroll mode" : "On")
        }
    }
}

struct MenuContent: View {
    @EnvironmentObject private var engine: Engine
    @Environment(\.openWindow) private var openWindow

    var body: some View {
        Text("PodMouse: \(engine.statusLine)")
        Divider()
        Button(engine.paused ? "Turn On  (⌃⌥M)" : "Turn Off  (⌃⌥M)") { engine.togglePause() }
            .disabled(engine.mode != .running)
        Toggle("Scroll Mode  (⌃⌥S)", isOn: $engine.scrollMode)
            .disabled(engine.mode != .running)
        Divider()
        Button("Recalibrate…") {
            engine.startCalibration()
            show()
        }
        Button("Open PodMouse…") { show() }
        Divider()
        Button("Quit PodMouse") { NSApp.terminate(nil) }
    }

    private func show() {
        openWindow(id: "setup")
        NSApp.activate(ignoringOtherApps: true)
    }
}
