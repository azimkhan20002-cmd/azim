"""X11 backend for the computer use tool.

Translates the actions Claude emits (`left_click`, `type`, `scroll`, ...) into
xdotool/scrot calls against an X display, and returns screenshots as PNG bytes.

The tool definition advertises a display size to the API. Claude returns
coordinates in *that* space, so if the real screen is larger than the model's
image limit we advertise a scaled-down size and map coordinates back here. When
the screen already fits (the common case), the mapping is the identity.
"""

from __future__ import annotations

import base64
import io
import os
import shutil
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Any, Sequence

from PIL import Image

# Claude Opus 5 / Sonnet 5 / Opus 4.8 / Opus 4.7 accept up to 2576 px on the
# long edge. Earlier models cap at 1568 px.
MAX_LONG_EDGE_PX = 2576

# Actions that carry a `coordinate` we need to translate into screen space.
_POINT_ACTIONS = {
    "left_click",
    "right_click",
    "middle_click",
    "double_click",
    "triple_click",
    "mouse_move",
    "left_mouse_down",
    "left_mouse_up",
    "left_click_drag",
    "scroll",
}

_CLICK_BUTTONS = {
    "left_click": "1",
    "middle_click": "2",
    "right_click": "3",
}

_SCROLL_BUTTONS = {"up": "4", "down": "5", "left": "6", "right": "7"}

# Claude speaks in generic modifier names; xdotool wants X keysyms.
_KEY_ALIASES = {
    "cmd": "super",
    "command": "super",
    "meta": "super",
    "win": "super",
    "windows": "super",
    "option": "alt",
    "enter": "Return",
    "return": "Return",
    "esc": "Escape",
    "escape": "Escape",
    "tab": "Tab",
    "space": "space",
    "backspace": "BackSpace",
    "delete": "Delete",
    "up": "Up",
    "down": "Down",
    "left": "Left",
    "right": "Right",
    "home": "Home",
    "end": "End",
    "pageup": "Page_Up",
    "pagedown": "Page_Down",
}


class ComputerError(RuntimeError):
    """Raised for malformed actions — surfaced to Claude as an error result."""


@dataclass
class ToolResult:
    """One computer-tool outcome, ready to be turned into API content blocks."""

    output: str | None = None
    png: bytes | None = None
    is_error: bool = False

    @property
    def base64_image(self) -> str | None:
        return base64.b64encode(self.png).decode() if self.png else None


def _translate_key(combo: str) -> str:
    """Normalize a key or chord ('ctrl+s', 'cmd+a') to xdotool keysyms."""
    parts = [p.strip() for p in combo.split("+") if p.strip()]
    if not parts:
        raise ComputerError("Empty key combination.")
    return "+".join(_KEY_ALIASES.get(p.lower(), p) for p in parts)


class X11Computer:
    """Drives a running X display via xdotool and scrot."""

    def __init__(
        self,
        display: str | None = None,
        *,
        screenshot_delay: float = 0.4,
        max_long_edge_px: int = MAX_LONG_EDGE_PX,
    ) -> None:
        self.display = display or os.environ.get("DISPLAY") or ":99"
        self.screenshot_delay = screenshot_delay
        self._tmp = TemporaryDirectory(prefix="computer-use-")

        for binary in ("xdotool", "scrot", "xdpyinfo"):
            if shutil.which(binary) is None:
                raise ComputerError(
                    f"{binary!r} not found on PATH. Run scripts/start_desktop.sh, "
                    "which installs and starts the virtual desktop."
                )

        self.screen_width, self.screen_height = self._probe_display()

        # Dimensions we advertise to the API, downscaled if the screen is huge.
        longest = max(self.screen_width, self.screen_height)
        self.scale = min(1.0, max_long_edge_px / longest) if longest else 1.0
        self.width = round(self.screen_width * self.scale)
        self.height = round(self.screen_height * self.scale)

    # -- plumbing ---------------------------------------------------------

    def _probe_display(self) -> tuple[int, int]:
        out = self._run(["xdpyinfo"], capture=True)
        for line in out.splitlines():
            if "dimensions:" in line:
                dims = line.split()[1]
                w, h = dims.split("x")
                return int(w), int(h)
        raise ComputerError(f"Could not read dimensions from display {self.display}.")

    def _run(self, cmd: Sequence[str], *, capture: bool = False) -> str:
        env = {**os.environ, "DISPLAY": self.display}
        proc = subprocess.run(
            list(cmd), env=env, capture_output=True, text=True, timeout=30
        )
        if proc.returncode != 0:
            raise ComputerError(
                f"{cmd[0]} failed ({proc.returncode}): {proc.stderr.strip() or 'no stderr'}"
            )
        return proc.stdout if capture else ""

    def _xdotool(self, *args: str) -> None:
        self._run(["xdotool", *args])

    def _to_screen(self, coordinate: Any) -> tuple[int, int]:
        """Map a model-space coordinate onto the real screen, with bounds check."""
        if (
            not isinstance(coordinate, (list, tuple))
            or len(coordinate) != 2
            or not all(isinstance(v, (int, float)) for v in coordinate)
        ):
            raise ComputerError(
                f"coordinate must be [x, y] numbers, got {coordinate!r}."
            )
        x, y = coordinate
        if not (0 <= x < self.width and 0 <= y < self.height):
            raise ComputerError(
                f"Coordinates ({x}, {y}) are outside display bounds "
                f"({self.width}x{self.height})."
            )
        return round(x / self.scale), round(y / self.scale)

    # -- screenshots ------------------------------------------------------

    def screenshot(self) -> bytes:
        """Capture the display as PNG, downscaled to the advertised size."""
        time.sleep(self.screenshot_delay)  # let the UI settle after an action
        path = Path(self._tmp.name) / "screen.png"
        self._run(["scrot", "-o", "-F", str(path)])
        with Image.open(path) as img:
            img = img.convert("RGB")
            if self.scale < 1.0:
                img = img.resize((self.width, self.height), Image.LANCZOS)
            return _encode_png(img)

    def _zoom(self, region: Any) -> bytes:
        if (
            not isinstance(region, (list, tuple))
            or len(region) != 4
            or not all(isinstance(v, (int, float)) for v in region)
        ):
            raise ComputerError(
                f"region must be [x1, y1, x2, y2] numbers, got {region!r}."
            )
        x1, y1 = self._to_screen(region[:2])
        x2, y2 = self._to_screen(region[2:])
        if x2 <= x1 or y2 <= y1:
            raise ComputerError(
                f"region {list(region)} is empty; expected x1 < x2 and y1 < y2."
            )
        time.sleep(self.screenshot_delay)
        path = Path(self._tmp.name) / "zoom.png"
        self._run(["scrot", "-o", "-F", str(path)])
        with Image.open(path) as img:
            crop = img.convert("RGB").crop((x1, y1, x2, y2))
            # Upscale small crops so fine text is legible, staying under the limit.
            longest = max(crop.size)
            if longest and longest < MAX_LONG_EDGE_PX:
                factor = min(4.0, MAX_LONG_EDGE_PX / longest)
                crop = crop.resize(
                    (round(crop.width * factor), round(crop.height * factor)),
                    Image.LANCZOS,
                )
            return _encode_png(crop)

    # -- action dispatch --------------------------------------------------

    def execute(self, action_input: dict[str, Any]) -> ToolResult:
        """Run one action from a `computer` tool_use block."""
        try:
            return self._execute(action_input)
        except ComputerError as exc:
            return ToolResult(output=f"Error: {exc}", is_error=True)
        except subprocess.TimeoutExpired:
            return ToolResult(
                output="Error: the action timed out; the display may be unresponsive.",
                is_error=True,
            )

    def _execute(self, action_input: dict[str, Any]) -> ToolResult:
        action = action_input.get("action")
        if not isinstance(action, str):
            raise ComputerError(f"Missing 'action' in {action_input!r}.")

        text = action_input.get("text")
        coordinate = action_input.get("coordinate")

        if action in _POINT_ACTIONS and coordinate is None:
            raise ComputerError(f"{action} requires a 'coordinate'.")

        if action == "screenshot":
            return ToolResult(png=self.screenshot())

        if action == "zoom":
            return ToolResult(png=self._zoom(action_input.get("region")))

        if action == "wait":
            duration = _positive_number(action_input.get("duration"), "duration")
            time.sleep(min(duration, 30.0))
            return ToolResult(output=f"Waited {duration}s.", png=self.screenshot())

        if action == "mouse_move":
            x, y = self._to_screen(coordinate)
            self._xdotool("mousemove", "--sync", str(x), str(y))
            return ToolResult(png=self.screenshot())

        if action in _CLICK_BUTTONS or action in ("double_click", "triple_click"):
            return self._click(action, coordinate, text)

        if action in ("left_mouse_down", "left_mouse_up"):
            x, y = self._to_screen(coordinate)
            self._xdotool("mousemove", "--sync", str(x), str(y))
            self._xdotool("mousedown" if action.endswith("down") else "mouseup", "1")
            return ToolResult(png=self.screenshot())

        if action == "left_click_drag":
            return self._drag(action_input.get("start_coordinate"), coordinate, text)

        if action == "scroll":
            return self._scroll(action_input, coordinate, text)

        if action == "type":
            if not isinstance(text, str) or not text:
                raise ComputerError("type requires a non-empty 'text'.")
            # Chunked so very long strings don't trip the subprocess timeout.
            for chunk in _chunks(text, 200):
                self._xdotool("type", "--delay", "12", "--", chunk)
            return ToolResult(png=self.screenshot())

        if action == "key":
            if not isinstance(text, str) or not text:
                raise ComputerError("key requires a non-empty 'text'.")
            self._xdotool("key", "--clearmodifiers", _translate_key(text))
            return ToolResult(png=self.screenshot())

        if action == "hold_key":
            if not isinstance(text, str) or not text:
                raise ComputerError("hold_key requires a non-empty 'text'.")
            duration = min(_positive_number(action_input.get("duration"), "duration"), 30.0)
            key = _translate_key(text)
            self._xdotool("keydown", key)
            try:
                time.sleep(duration)
            finally:
                self._xdotool("keyup", key)
            return ToolResult(png=self.screenshot())

        raise ComputerError(f"Unsupported action {action!r}.")

    # -- action helpers ---------------------------------------------------

    def _click(self, action: str, coordinate: Any, modifiers: Any) -> ToolResult:
        x, y = self._to_screen(coordinate)
        button = _CLICK_BUTTONS.get(action, "1")
        repeat = {"double_click": 2, "triple_click": 3}.get(action, 1)
        self._xdotool("mousemove", "--sync", str(x), str(y))
        with self._held(modifiers):
            if repeat > 1:
                self._xdotool("click", "--repeat", str(repeat), "--delay", "100", button)
            else:
                self._xdotool("click", button)
        return ToolResult(png=self.screenshot())

    def _drag(self, start: Any, end: Any, modifiers: Any) -> ToolResult:
        # start_coordinate is optional: without it, drag from the current position.
        if start is not None:
            sx, sy = self._to_screen(start)
            self._xdotool("mousemove", "--sync", str(sx), str(sy))
        ex, ey = self._to_screen(end)
        with self._held(modifiers):
            self._xdotool("mousedown", "1")
            try:
                self._xdotool("mousemove", "--sync", str(ex), str(ey))
            finally:
                self._xdotool("mouseup", "1")
        return ToolResult(png=self.screenshot())

    def _scroll(self, action_input: dict[str, Any], coordinate: Any, modifiers: Any):
        direction = action_input.get("scroll_direction")
        if direction not in _SCROLL_BUTTONS:
            raise ComputerError(
                f"scroll_direction must be one of {sorted(_SCROLL_BUTTONS)}, "
                f"got {direction!r}."
            )
        amount = action_input.get("scroll_amount", 3)
        if not isinstance(amount, (int, float)) or amount <= 0:
            raise ComputerError(f"scroll_amount must be a positive number, got {amount!r}.")
        x, y = self._to_screen(coordinate)
        self._xdotool("mousemove", "--sync", str(x), str(y))
        with self._held(modifiers):
            self._xdotool(
                "click", "--repeat", str(int(amount)), _SCROLL_BUTTONS[direction]
            )
        return ToolResult(png=self.screenshot())

    class _HeldKeys:
        def __init__(self, computer: "X11Computer", keys: list[str]) -> None:
            self._computer = computer
            self._keys = keys

        def __enter__(self) -> None:
            for key in self._keys:
                self._computer._xdotool("keydown", key)

        def __exit__(self, *exc_info: object) -> None:
            for key in reversed(self._keys):
                self._computer._xdotool("keyup", key)

    def _held(self, modifiers: Any) -> "X11Computer._HeldKeys":
        """Hold modifier keys (the `text` param on click/scroll) for the duration."""
        if not modifiers:
            return X11Computer._HeldKeys(self, [])
        if not isinstance(modifiers, str):
            raise ComputerError(f"Modifier 'text' must be a string, got {modifiers!r}.")
        return X11Computer._HeldKeys(self, _translate_key(modifiers).split("+"))


def _encode_png(img: Image.Image) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def _positive_number(value: Any, field: str) -> float:
    if not isinstance(value, (int, float)) or value <= 0:
        raise ComputerError(f"{field} must be a positive number, got {value!r}.")
    return float(value)


def _chunks(text: str, size: int):
    for i in range(0, len(text), size):
        yield text[i : i + size]
