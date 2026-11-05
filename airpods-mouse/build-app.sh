#!/usr/bin/env bash
# Build PodMouse.app from source.
#   ./build-app.sh            → dist/PodMouse.app
#   ./build-app.sh --install  → also copies it to /Applications and opens it
#   UNIVERSAL=1 ./build-app.sh  → Apple Silicon + Intel binary (needs full Xcode)
set -euo pipefail
cd "$(dirname "$0")"

if [[ "$(uname)" != "Darwin" ]]; then
  echo "PodMouse is a Mac app. Run this on your Mac." >&2
  exit 1
fi
if ! xcrun --find swift >/dev/null 2>&1; then
  echo "Swift isn't installed. Run:  xcode-select --install   then run this again." >&2
  exit 1
fi

arch_flags=()
if [[ "${UNIVERSAL:-0}" == "1" ]]; then
  arch_flags=(--arch arm64 --arch x86_64)
fi

echo "▸ Compiling…"
swift build -c release ${arch_flags[@]+"${arch_flags[@]}"}
bin_dir="$(swift build -c release ${arch_flags[@]+"${arch_flags[@]}"} --show-bin-path)"

app="dist/PodMouse.app"
echo "▸ Packaging $app"
rm -rf "$app"
mkdir -p "$app/Contents/MacOS" "$app/Contents/Resources"
cp "$bin_dir/PodMouse" "$app/Contents/MacOS/PodMouse"
cp Support/Info.plist "$app/Contents/Info.plist"
printf 'APPL????' > "$app/Contents/PkgInfo"
# Ad-hoc signature: enough for macOS to remember the permissions you grant.
codesign --force --sign - --identifier com.azim.podmouse "$app"

if [[ "${1:-}" == "--install" ]]; then
  dest="/Applications"
  [[ -w "$dest" ]] || dest="$HOME/Applications"
  mkdir -p "$dest"
  pkill -x PodMouse 2>/dev/null || true
  rm -rf "$dest/PodMouse.app"
  cp -R "$app" "$dest/"
  xattr -dr com.apple.quarantine "$dest/PodMouse.app" 2>/dev/null || true
  echo "▸ Installed to $dest/PodMouse.app"
  open "$dest/PodMouse.app"
else
  echo "▸ Done. Open it with:  open $app"
fi
