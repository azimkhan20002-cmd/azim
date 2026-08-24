#!/bin/zsh
# ============================================================
#  NOTHING FOR MAC  -  macOS conversion (Tahoe 26, M4 Air)
#
#  Plain zsh + `defaults` - nothing installed, nothing left
#  running in the background. Everything here is reversible
#  in System Settings.
#
#  First run: right-click > Open (Gatekeeper).
#
#  What it does:
#    1. Dark mode
#    2. Nothing-red accent + matching highlight color
#    3. Dock: smaller, auto-hide, no recents
#    4. Hide desktop icon clutter
#    5. Rings wallpaper from the kit
#
#  Manual steps it can't do for you (printed at the end):
#    - System Settings > Appearance > Icon & widget style >
#      Tinted, saturation to zero  <- the big Nothing move
#    - Ubersicht + the kit's nothing-clock.widget for the
#      dot-matrix clock
# ============================================================
set -u
KIT_DIR="${0:A:h}"

echo
echo "  NOTHING FOR MAC"
echo "  ---------------"
echo

# ---- 1. Dark mode -------------------------------------------------
echo "  [1/5] Dark mode..."
osascript -e 'tell application "System Events" to tell appearance preferences to set dark mode to true'

# ---- 2. Accent + highlight ---------------------------------------
# AppleAccentColor 0 = Red. Highlight tuned toward Nothing red #D71921.
echo "  [2/5] Nothing-red accent..."
defaults write NSGlobalDomain AppleAccentColor -int 0
defaults write NSGlobalDomain AppleHighlightColor -string "1.000000 0.529412 0.541176 Red"

# ---- 3. Dock ------------------------------------------------------
echo "  [3/5] Dock: small, auto-hide, no recents..."
defaults write com.apple.dock tilesize -int 40
defaults write com.apple.dock autohide -bool true
defaults write com.apple.dock show-recents -bool false

# ---- 4. Desktop clutter -------------------------------------------
echo "  [4/5] Hiding desktop icons (files stay in ~/Desktop)..."
defaults write com.apple.finder CreateDesktop -bool false

# ---- 5. Wallpaper -------------------------------------------------
echo "  [5/5] Rings wallpaper..."
WALL="$KIT_DIR/../wallpapers/nothing-rings-mac-2560x1664.png"
[[ -f "$WALL" ]] || WALL="$KIT_DIR/nothing-rings-mac-2560x1664.png"
if [[ -f "$WALL" ]]; then
  osascript -e "tell application \"System Events\" to set picture of every desktop to POSIX file \"${WALL:A}\""
else
  echo "        wallpaper PNG not found next to the kit - skipped"
fi

killall Dock Finder 2>/dev/null

echo
echo "  Done. Two manual finishers:"
echo
echo "  1. TINTED ICONS (the whole Nothing look in one switch):"
echo "     System Settings > Appearance > Icon & widget style > Tinted,"
echo "     drag saturation to zero. Add Battery + Calendar desktop"
echo "     widgets - Tinted paints them mono automatically."
echo
echo "  2. DOT-MATRIX CLOCK:"
echo "     Install Ubersicht (free): https://tracesof.net/uebersicht/"
echo "     then copy nothing-clock.widget from this kit into:"
echo "     ~/Library/Application Support/Übersicht/widgets/"
echo
echo "  Undo any of this in System Settings > Appearance / Desktop & Dock."
echo
