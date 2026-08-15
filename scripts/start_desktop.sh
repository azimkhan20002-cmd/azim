#!/usr/bin/env bash
# Start a virtual X11 desktop for Claude to drive.
#
#   ./scripts/start_desktop.sh              # desktop + the local demo form
#   ./scripts/start_desktop.sh https://...  # desktop + Chromium on that URL
#   ./scripts/start_desktop.sh none         # bare desktop, no browser
#
# Stop it again with ./scripts/stop_desktop.sh
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DISPLAY_NUM="${DISPLAY_NUM:-99}"
WIDTH="${WIDTH:-1280}"
HEIGHT="${HEIGHT:-800}"
DISPLAY_ID=":${DISPLAY_NUM}"
RUN_DIR="${RUN_DIR:-/tmp/computer-use}"
START_URL="${1:-file://$HERE/demo_page.html}"

mkdir -p "$RUN_DIR"

missing=()
for bin in Xvfb xdotool scrot xdpyinfo openbox; do
  command -v "$bin" >/dev/null 2>&1 || missing+=("$bin")
done
if [ ${#missing[@]} -gt 0 ]; then
  echo "Installing: ${missing[*]}" >&2
  if [ "$(id -u)" -ne 0 ]; then
    echo "Need root to install ${missing[*]}. Re-run with sudo, or install them yourself." >&2
    exit 1
  fi
  apt-get update -qq
  apt-get install -y -qq xvfb xdotool scrot x11-utils x11-xserver-utils openbox
fi

if xdpyinfo -display "$DISPLAY_ID" >/dev/null 2>&1; then
  echo "Display $DISPLAY_ID is already running." >&2
else
  Xvfb "$DISPLAY_ID" -screen 0 "${WIDTH}x${HEIGHT}x24" -nolisten tcp \
    >"$RUN_DIR/xvfb.log" 2>&1 &
  echo $! >"$RUN_DIR/xvfb.pid"

  for _ in $(seq 1 25); do
    xdpyinfo -display "$DISPLAY_ID" >/dev/null 2>&1 && break
    sleep 0.2
  done
  if ! xdpyinfo -display "$DISPLAY_ID" >/dev/null 2>&1; then
    echo "Xvfb failed to start; see $RUN_DIR/xvfb.log" >&2
    exit 1
  fi

  # A window manager gives windows focus and decorations, which Claude needs in
  # order to click, drag, and switch between them.
  DISPLAY="$DISPLAY_ID" openbox >"$RUN_DIR/openbox.log" 2>&1 &
  echo $! >"$RUN_DIR/openbox.pid"
  sleep 1
fi

if [ "$START_URL" != "none" ]; then
  CHROME="$(ls -d /opt/pw-browsers/chromium*/chrome-linux/chrome 2>/dev/null | head -n1 || true)"
  [ -n "$CHROME" ] || CHROME="$(command -v chromium || command -v chromium-browser || command -v google-chrome || true)"
  if [ -z "$CHROME" ]; then
    echo "No Chromium binary found; skipping browser launch." >&2
  else
    # Chromium doesn't reliably honor an uppercase-only HTTPS_PROXY, so pass it
    # through explicitly when the environment sets one.
    proxy_args=()
    if [ -n "${HTTPS_PROXY:-${https_proxy:-}}" ]; then
      proxy_args=(--proxy-server="${HTTPS_PROXY:-$https_proxy}"
                  --proxy-bypass-list="localhost;127.0.0.1")
    fi

    DISPLAY="$DISPLAY_ID" nohup "$CHROME" \
      --no-sandbox --no-first-run --no-default-browser-check \
      --disable-dev-shm-usage --disable-features=Translate \
      "${proxy_args[@]}" \
      --window-position=0,0 --window-size="${WIDTH},${HEIGHT}" \
      "$START_URL" >"$RUN_DIR/chromium.log" 2>&1 &
    echo $! >"$RUN_DIR/chromium.pid"

    # Wait for the window to actually map, then focus it. Screenshotting before
    # this point returns an empty desktop and Claude opens on a blank screen.
    win=""
    for _ in $(seq 1 40); do
      win="$(DISPLAY="$DISPLAY_ID" xdotool search --name 'Chromium' 2>/dev/null | tail -n1 || true)"
      [ -n "$win" ] && break
      sleep 0.5
    done
    if [ -n "$win" ]; then
      DISPLAY="$DISPLAY_ID" xdotool windowactivate "$win" >/dev/null 2>&1 || true
      DISPLAY="$DISPLAY_ID" xdotool windowsize "$win" "$WIDTH" "$HEIGHT" >/dev/null 2>&1 || true
      sleep 2
    else
      echo "Chromium window never appeared; see $RUN_DIR/chromium.log" >&2
    fi
  fi
fi

echo "Desktop ready on $DISPLAY_ID (${WIDTH}x${HEIGHT})."
echo "  export DISPLAY=$DISPLAY_ID"
