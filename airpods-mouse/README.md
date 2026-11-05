# PodMouse: your AirPods case is the mouse

Hold the AirPods case with the buds inside and the lid open, then point it at the screen.
Turn it to move the pointer, tap it to click. No extra hardware: the earbuds already have a
gyroscope and accelerometer (that's how Spatial Audio follows your head), and macOS lets apps
read them through `CMHeadphoneMotionManager`. PodMouse is a small menu bar app that turns
that motion into pointer movement.

| Do this with the case | You get |
| --- | --- |
| Turn it left / right | Pointer moves left / right |
| Tilt the top up / down | Pointer moves up / down |
| Tap it once | Click |
| Tap it twice | Double-click (three times: triple-click) |
| Flick your wrist, rolling it like a key | Right-click |
| <kbd>⌃⌥S</kbd>, then tilt | Scroll |
| <kbd>⌃⌥M</kbd> | Turn PodMouse on/off |

Works with AirPods Pro (all generations), AirPods 3 and later, AirPods Max and Beats Fit Pro,
on macOS 14 Sonoma or later.

## Install

**One line in Terminal** (builds it from source, puts it in Applications, opens it):

```bash
curl -fsSL https://raw.githubusercontent.com/azimkhan20002-cmd/azim/main/airpods-mouse/install.sh | bash
```

If it says Swift isn't installed, run `xcode-select --install`, click Install, then run the line
again. That's Apple's free command line tools, not the full Xcode.

**Or download a ready-made build:** open the repo's **Actions** tab → **PodMouse** → the latest
run → download the **PodMouse** artifact. Unzip it, drag `PodMouse.app` into Applications,
then right-click it → **Open** the first time (it isn't notarized, so a plain double-click
gets blocked).

**Or build from a clone:** `cd airpods-mouse && ./build-app.sh --install`.

## First run (about one minute)

The PodMouse window opens with three checks:

1. **Let PodMouse move the pointer.** Click **Open Settings** and switch PodMouse on under
   Privacy & Security → Accessibility.
2. **AirPods in the open case.** Leave both buds in the case, open the lid, and keep them
   connected to the Mac. Click **OK** when macOS asks about motion access. The row turns
   green and shows how many readings per second are coming in.
3. **Calibrate.** The buds sit tilted inside the case, so PodMouse learns which way is
   which from three quick moves:
   - **Turn it upright:** hold the case upright and still for a second.
   - **Turn it right:** swivel it about 30–45° to the right, then hold.
   - **Tilt it up:** tip the top toward the ceiling, then hold.

Then turn the case and the pointer follows. Close the window; PodMouse stays in the menu bar.

## If something's off

- **"Connected, but no motion yet".** Open System Settings → Bluetooth → ⓘ next to your
  AirPods → **AirPods Pro Settings…** and turn off **Automatic Ear Detection**. Some firmware
  only streams motion while the buds think they're in your ears. Playing any audio through
  the AirPods for a moment can also wake the stream.
- **Taps don't click, or click by themselves.** Move the **Tap needed** slider. The line
  under it shows how hard your last knock was, so you can set the line just below a
  deliberate tap. Or turn on **Click when the pointer rests**.
- **Pointer moves the wrong way or diagonally.** Click **Redo** to calibrate again, and make
  each move clean: a pure turn, then a pure tilt.
- **Pointer drifts slowly.** Set the case down for a few seconds. PodMouse re-learns the
  gyro's resting value whenever the case is still.
- **Permission is on but nothing moves after a rebuild.** The ad-hoc signature changes on
  every build. Remove PodMouse from the Accessibility list with **−** and add it again.

## How it works

```
AirPods IMU ──► CMHeadphoneMotionManager (≈25–50 Hz)
                  │ rotationRate, userAcceleration
                  ▼
   Calibration: subtract gyro bias, project onto learned "turn" and "tilt" axes
                  │
        1€ filter → deadzone → speed curve → pointer velocity (px/s)
                  │
   120 Hz timer moves the pointer smoothly between sensor samples (CGEvent)

   accel spike, little rotation → tap   → rewind pointer 120 ms → click
   fast roll about the third axis → twist → rewind → right-click
```

- **Calibration** (`Sources/PodMouseCore/Calibration.swift`): averages the gyro while the
  case is still (bias), integrates the "turn right" move to get that rotation axis, then
  takes the "tilt up" move and removes any turn component (Gram-Schmidt) to get the second
  axis. The cross product is the twist axis.
- **Pointer** (`PointerMapper.swift`): a 1€ filter (heavy smoothing when slow, light when
  fast), a small deadzone for hand tremor, and mild acceleration so a flick crosses the
  screen while slow moves stay precise.
- **Clicks** (`Gestures.swift`): knocking the case jolts the gyro too, so before clicking,
  the pointer jumps back to where it was 120 ms earlier.
- **App** (`Sources/PodMouse/`): SwiftUI menu bar app, CoreMotion, CGEvent, and a Carbon
  global hotkey.

Run the tests with `swift test`.
