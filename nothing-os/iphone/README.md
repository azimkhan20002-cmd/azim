# Nothing for iPhone

The full recipe for pushing an iPhone as close to Nothing OS as Apple
allows — dot-matrix clock, monochrome icon grid, red-accent widgets,
matching lock screen. Written for iOS 18+ (still true on the 26/27 betas),
paid apps allowed, full send.

## 01 · Install the kit

Four downloads do most of the work — grab them first (App Store unless
noted; search the exact names):

| Get | What it is |
|---|---|
| **Everything Widgets** ($1.99) | 110+ widgets in a Nothing OS aesthetic — 44 clocks (the dot-matrix digitals are the stars), weather, battery rings, music controls |
| **Void Widgets** (free + lifetime IAP) | Dot-matrix and morse-code clocks in an NDOT-style pixel face, plus **lock screen** widgets, which Everything Widgets doesn't cover |
| **Nothing IconPack** (free, web) | 3,360+ Nothing-style icons with wallpapers included — the biggest free pack, no jailbreak |
| **NOTHINGISFINISHED** (icon pack) | 260 icons in white / black / orange / concrete, 20+ photo-widgets, wallpapers, PSD templates for odd apps |

Optional: *NothingOS Widgets for iPhone* (~€5) adds transparent-background
widgets that can launch apps — nice for a "widgets as app grid" second page.

## 02 · Kill the color — natively

iOS itself gets you 70% of the way. Since iOS 18 Apple can render every
icon greyscale-on-dark, no third-party anything:

> Long-press wallpaper → **Edit** → **Customize** → Icons → **Tinted**

- **Tinted, saturation to zero.** Drag the color slider's saturation all the
  way down, brightness high — every icon becomes white-glyph-on-dark-grey.
  The single biggest Nothing move on iOS.
- **Icon size: Large.** Large also removes app labels — Nothing's grid
  famously runs label-free.
- **Dark mode, always.** Settings → Display & Brightness → Dark. Tinted
  greyscale beats the Clear look for the Nothing read.
- **Wallpaper: pure black.** `nothing-black-iphone-1290x2796.png` from the
  kit (or either icon pack's own). On OLED, black melts into the bezel like
  a Phone (2a).

## 03 · Swap in the dot-matrix icons

- **Shortcuts route (free, per-app):** Shortcuts → **+** → Open App →
  share-sheet → Add to Home Screen → Choose Photo → pick the pack's icon.
  Since iOS 18+ these launch instantly, no banner.
- **Batch route:** icon-skinning apps (Widgetsmith-style themers) apply a
  whole pack at once; the pack pages link current tutorials.
- **Hide the originals:** long-press → Remove from Home Screen. Only skin
  your daily 8–16 apps — the rest lives in the App Library, which is very
  Nothing anyway.

## 04 · Build the widget stack

- **Top: dot-matrix clock.** Everything Widgets → large digital dot clock,
  white on black — your visual anchor.
- **Row two: battery + weather.** Two small widgets side by side mirror
  Nothing's own pair almost 1:1.
- **Accent discipline.** Pick **one red element per screen** — red digits,
  or a red battery ring, not both. The look dies the moment red stops
  being rare.
- **Page two (optional):** the transparent NothingOS pack lays app-launcher
  widgets over black so the whole page reads as a Nothing drawer.

## 05 · Lock screen & the rest

- **Lock screen clock:** no true NDot font allowed, so pick the narrow
  rounded face in white (or Nothing red at low vibrance) and add Void
  Widgets' dot-matrix lock widgets under it.
- **StandBy:** charging sideways, full-screen clock in red — the closest
  stock iOS gets to Nothing's bedside dot clock; Void and Everything both
  add dot alternatives.
- **Apple Watch:** Modular face, complications tinted mono/red — or a
  dot-matrix custom face via a Clockology-style app. The pair sells the
  whole system.
- **Sounds:** Nothing's ringtones float around fan communities (Nothing
  Playground, r/NothingTech); import any `.m4r` via GarageBand → Share →
  Ringtone.
- **Keyboard:** stock iOS dark keyboard is already close; skip third-party
  themed keyboards — none do NDot well and most want full access.

## 06 · What iOS won't give you

| Nothing feature | iOS status |
|---|---|
| Glyph lights / Glyph Matrix | Hardware — impossible. Closest nod: a Glyph-pattern case or skin |
| System-wide NDot font | Not without jailbreak. Widgets and icons carry the type instead |
| True icon theming | Partial — Tinted mode + Shortcuts covers the visible grid; App Library stays stock |
| Essential Key / Space | Map the Action Button to a screenshot-to-note shortcut for a close clone |
| Always-on dot clock | Pro-model iPhones only (AOD); others get StandBy while charging |
