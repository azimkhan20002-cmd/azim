import AppKit
import PodMouseCore
import SwiftUI

struct SetupView: View {
    @EnvironmentObject private var engine: Engine

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            HStack(spacing: 12) {
                Image(systemName: symbol("airpodspro.chargingcase.wireless", fallback: "cursorarrow.motionlines"))
                    .font(.system(size: 34))
                VStack(alignment: .leading, spacing: 2) {
                    Text("PodMouse").font(.title2.bold())
                    Text("Your AirPods case is the mouse.").foregroundStyle(.secondary)
                }
            }

            if engine.mode == .calibrating {
                CalibrationPanel()
            } else {
                Checklist()
                if engine.calibration != nil {
                    Divider()
                    Controls()
                }
            }
        }
        .padding(22)
        .frame(width: 460)
        .onAppear { NSApp.activate(ignoringOtherApps: true) }
    }
}

/// SF Symbol names vary by macOS version; fall back if the preferred one is missing.
func symbol(_ preferred: String, fallback: String) -> String {
    NSImage(systemSymbolName: preferred, accessibilityDescription: nil) != nil ? preferred : fallback
}

private struct Checklist: View {
    @EnvironmentObject private var engine: Engine

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Row(done: engine.accessibilityTrusted,
                title: "Let PodMouse move the pointer",
                detail: engine.accessibilityTrusted
                    ? "Accessibility access is on."
                    : "Turn PodMouse on in Privacy & Security → Accessibility. If it's already on, remove it with − and add it again.") {
                if !engine.accessibilityTrusted {
                    Button("Open Settings") { engine.requestAccessibility() }
                }
            }

            Row(done: engine.hasSignal,
                title: "AirPods in the open case",
                detail: signalDetail) {
                if engine.motionDenied {
                    Button("Open Settings") { engine.openPrivacySettings() }
                } else if engine.hasSignal {
                    Text("\(Int(engine.samplesPerSecond.rounded()))/s").monospacedDigit().foregroundStyle(.secondary)
                }
            }

            Row(done: engine.calibration != nil,
                title: "Calibrate",
                detail: engine.calibration == nil
                    ? "Three quick moves teach PodMouse how the buds sit in your case."
                    : "Done. Redo it if the pointer drifts the wrong way.") {
                Button(engine.calibration == nil ? "Start" : "Redo") { engine.startCalibration() }
                    .disabled(!engine.hasSignal)
            }
        }
    }

    private var signalDetail: String {
        if !engine.motionAvailable {
            return "This Mac can't read headphone motion. PodMouse needs macOS 14 or later."
        }
        if engine.motionDenied {
            return "Motion access is off. Allow PodMouse under Privacy & Security → Motion & Fitness."
        }
        if engine.hasSignal { return "Getting motion from your AirPods." }
        if engine.deviceConnected {
            return "Connected, but no motion yet. In Bluetooth → AirPods Pro Settings…, turn off Automatic Ear Detection."
        }
        return "Leave both buds in the case, open the lid, and make sure they're connected to this Mac."
    }
}

private struct Row<Accessory: View>: View {
    let done: Bool
    let title: String
    let detail: String
    @ViewBuilder let accessory: () -> Accessory

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: done ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(done ? Color.green : Color.secondary)
                .font(.title3)
            VStack(alignment: .leading, spacing: 3) {
                Text(title).font(.headline)
                Text(detail).font(.callout).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 8)
            accessory()
        }
    }
}

private struct Controls: View {
    @EnvironmentObject private var engine: Engine

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Toggle("PodMouse is on", isOn: Binding(get: { !engine.paused },
                                                      set: { if $0 == engine.paused { engine.togglePause() } }))
                    .toggleStyle(.switch)
                Spacer()
                if !engine.lastAction.isEmpty {
                    Text(engine.lastAction).foregroundStyle(.secondary)
                }
            }
            Text("Turn the case to aim. Tap it to click, tap twice to double-click, flick your wrist (roll it like a key) to right-click. ⌃⌥M turns it on or off, ⌃⌥S switches to scrolling.")
                .font(.callout)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            LabeledContent("Speed") {
                Slider(value: $engine.sensitivity, in: 0.3...3) {
                    EmptyView()
                } minimumValueLabel: {
                    Text("Slow")
                } maximumValueLabel: {
                    Text("Fast")
                }
            }

            Toggle("Tap the case to click", isOn: $engine.tapsEnabled)
            if engine.tapsEnabled {
                LabeledContent("Tap needed") {
                    VStack(alignment: .leading, spacing: 4) {
                        Slider(value: $engine.tapThreshold, in: 0.15...1.2) {
                            EmptyView()
                        } minimumValueLabel: {
                            Text("Light")
                        } maximumValueLabel: {
                            Text("Firm")
                        }
                        Text(String(format: "Last knock %.2f g · clicks above %.2f g", engine.joltLevel, engine.tapThreshold))
                            .font(.caption)
                            .monospacedDigit()
                            .foregroundStyle(engine.joltLevel > engine.tapThreshold ? Color.accentColor : Color.secondary)
                    }
                }
            }
            Toggle("Flick to right-click", isOn: $engine.twistEnabled)
            Toggle("Click when the pointer rests (if taps don't work for you)", isOn: $engine.dwellEnabled)
        }
    }
}

private struct CalibrationPanel: View {
    @EnvironmentObject private var engine: Engine

    var body: some View {
        VStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 54))
                .foregroundStyle(Color.accentColor)
                .frame(height: 70)
            Text(title).font(.title2.bold())
            Text(detail)
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
            ProgressView(value: engine.calibrationProgress)
            if let hint = engine.calibrationHint {
                Text(hint).foregroundStyle(.orange).multilineTextAlignment(.center)
            } else if !engine.hasSignal {
                Text("Waiting for motion from your AirPods…").foregroundStyle(.orange)
            }
            HStack {
                Text("Step \(min(engine.calibrationStep.rawValue + 1, 3)) of 3").foregroundStyle(.secondary)
                Spacer()
                Button("Cancel") { engine.cancelCalibration() }
            }
        }
        .frame(maxWidth: .infinity)
    }

    private var icon: String {
        switch engine.calibrationStep {
        case .holdStill: return symbol("airpodspro.chargingcase.wireless", fallback: "hand.raised")
        case .turnRight: return "arrow.turn.up.right"
        case .tiltUp: return "arrow.up.circle"
        case .done: return "checkmark.circle"
        }
    }

    private var title: String {
        switch engine.calibrationStep {
        case .holdStill: return "Turn it upright"
        case .turnRight: return "Turn it right"
        case .tiltUp: return "Tilt it up"
        case .done: return "You're set"
        }
    }

    private var detail: String {
        switch engine.calibrationStep {
        case .holdStill: return "Hold the case upright in your hand with the lid open, and keep it still for a second."
        case .turnRight: return "Swivel the case to the right, about 30–45°, as if pointing across your screen. Then hold it there."
        case .tiltUp: return "Now tip the top of the case up toward the ceiling, like nodding. Then hold it there."
        case .done: return "Turn the case to move the pointer."
        }
    }
}
