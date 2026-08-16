#!/usr/bin/env bash
# Stop the virtual desktop started by start_desktop.sh
set -uo pipefail

RUN_DIR="${RUN_DIR:-/tmp/computer-use}"

for name in chromium openbox xvfb; do
  pidfile="$RUN_DIR/$name.pid"
  [ -f "$pidfile" ] || continue
  pid="$(cat "$pidfile")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null && echo "stopped $name ($pid)"
  fi
  rm -f "$pidfile"
done
