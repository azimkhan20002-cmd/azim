#!/usr/bin/env bash
# One-line install on a Mac:
#   curl -fsSL https://raw.githubusercontent.com/azimkhan20002-cmd/azim/main/airpods-mouse/install.sh | bash
# Downloads the source, builds PodMouse.app, puts it in Applications and opens it.
set -euo pipefail
ref="${PODMOUSE_REF:-main}"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

if [[ "$(uname)" != "Darwin" ]]; then
  echo "PodMouse is a Mac app. Run this on your Mac." >&2
  exit 1
fi
if ! xcrun --find swift >/dev/null 2>&1; then
  echo "First install Apple's command line tools:  xcode-select --install" >&2
  echo "Then run this command again." >&2
  exit 1
fi

echo "▸ Downloading PodMouse ($ref)…"
curl -fsSL "https://github.com/azimkhan20002-cmd/azim/archive/refs/heads/${ref}.tar.gz" | tar -xz -C "$work"
src="$(find "$work" -maxdepth 2 -type d -name airpods-mouse | head -n 1)"
[[ -n "$src" ]] || { echo "Couldn't find airpods-mouse in the download." >&2; exit 1; }
"$src/build-app.sh" --install
