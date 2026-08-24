# Nothing, everywhere.

One kit to push all three screens as close to **Nothing OS** as each platform
allows — black, monochrome, dot-matrix type, and **one red accent
(`#D71921`) per screen**. Built from the "Nothing for iPhone" and "Nothing
for Surface and Mac" design canvases.

```
nothing-os/
├── windows/RUN-ME.bat              one-click Surface Pro (Windows 11) conversion
├── mac/nothing-mac-setup.command   one-click MacBook (macOS) conversion
├── mac/nothing-clock.widget/       Übersicht dot-matrix desktop clock
├── wallpapers/                     rings / dot-grid / pure-black, all three screens
│   └── generate_wallpapers.py      regenerate or re-size them
└── iphone/README.md                the full iOS recipe (no script possible there)
```

A zipped copy of the desktop half ships as `nothing-desktop-kit.zip` — that's
the file to drop onto the Surface and the Mac.

## Surface Pro (Windows 11)

Run `windows\RUN-ME.bat` (SmartScreen: *More info → Run anyway*). It sets
dark mode, the Nothing-red accent (kept **off** Start and taskbar), the rings
wallpaper, installs [Rainmeter](https://www.rainmeter.net) via winget, and
downloads the latest [NThing-UI](https://github.com/Runixe786/NThing-UI)
release and opens its installer — you just click Install.

Prefer widgets-only, rock-simple? Skip NThing-UI and install
[NotWidgets](https://github.com/GXX0T/NotWidgets) instead (36 animated
Nothing-style widgets, free, GPL). Pick **one** suite — they overlap; don't
run both. Keep Seelen UI / GlazeWM / Windhawk off this machine's shell:
NThing-UI replaces the same surfaces and they fight over the taskbar.
Optional: TranslucentTB (Microsoft Store) if you stay on the stock taskbar.

## MacBook (macOS)

Run `mac/nothing-mac-setup.command` (first run: right-click → Open). It flips
dark mode, sets the red accent + highlight, shrinks and auto-hides the Dock,
hides desktop clutter, and sets the rings wallpaper. Plain zsh + `defaults` —
nothing installed, nothing running in the background; all reversible in
System Settings.

Then two manual finishers:

1. **Tinted icons — the big one.** System Settings → Appearance → Icon &
   widget style → **Tinted**, saturation to zero. Every app icon and widget
   goes monochrome-on-dark: the whole Nothing look in one switch. Add
   Battery + Calendar desktop widgets — Tinted paints them mono too.
2. **Dot-matrix clock.** Install [Übersicht](https://tracesof.net/uebersicht/)
   (free), copy `mac/nothing-clock.widget` into
   `~/Library/Application Support/Übersicht/widgets/`. No fonts needed — the
   widget draws real 5×7 dot-matrix digits as dots: white digits, faint
   off-dots, red colon. Position is two numbers at the bottom of `index.jsx`.

## iPhone

iOS takes no scripts — the full recipe is in [`iphone/README.md`](iphone/README.md):
Tinted greyscale icons natively, dot-matrix widget apps, icon packs via
Shortcuts, lock screen, StandBy, and the honest list of what iOS won't give
you (Glyph lights, system-wide NDot).

## Wallpapers

`wallpapers/` has three designs at each screen's native size —
Surface 2196×1464, MacBook Air 2560×1664, iPhone 1290×2796:

- **rings** — concentric grey rings, one red dot (the setup scripts set this one)
- **grid** — faint dot grid, one red dot
- **black** — pure black; on OLED it melts into the bezel like a Phone (2a)

Regenerate or add sizes: `python3 wallpapers/generate_wallpapers.py`
(needs Pillow).

## The one rule

Red is rare or it is nothing: **one red element per screen**. Red colon on
the Mac clock, red dot in the wallpaper, red battery ring on the iPhone —
never two at once.

---

*Community projects, not affiliated with Nothing Technology Ltd.*
