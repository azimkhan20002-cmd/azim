"""Exercise the X11 backend without calling the Claude API.

Verifies that screenshots, clicks, typing, scrolling, zoom, and error handling
all behave, so a failure during a real run can be attributed to the model or
the prompt rather than to the plumbing.

    python scripts/selftest.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from computer_use.computer import X11Computer  # noqa: E402
from computer_use.tools import computer_tool_definition, tool_result_block  # noqa: E402

CHECKS: list[tuple[str, dict, bool]] = [
    # (label, action input, expect_error)
    ("screenshot", {"action": "screenshot"}, False),
    ("mouse_move", {"action": "mouse_move", "coordinate": [100, 100]}, False),
    ("left_click", {"action": "left_click", "coordinate": [200, 150]}, False),
    ("double_click", {"action": "double_click", "coordinate": [200, 150]}, False),
    ("right_click", {"action": "right_click", "coordinate": [300, 200]}, False),
    ("shift+click", {"action": "left_click", "coordinate": [210, 160], "text": "shift"}, False),
    ("drag", {"action": "left_click_drag", "start_coordinate": [100, 100], "coordinate": [220, 240]}, False),
    ("type", {"action": "type", "text": "hello world"}, False),
    ("key", {"action": "key", "text": "ctrl+a"}, False),
    ("key alias", {"action": "key", "text": "cmd+c"}, False),
    ("hold_key", {"action": "hold_key", "text": "shift", "duration": 0.2}, False),
    ("scroll", {"action": "scroll", "coordinate": [400, 300], "scroll_direction": "down", "scroll_amount": 2}, False),
    ("wait", {"action": "wait", "duration": 0.2}, False),
    ("zoom", {"action": "zoom", "region": [100, 100, 400, 300]}, False),
    # These must fail cleanly rather than raise.
    ("out-of-bounds click", {"action": "left_click", "coordinate": [99999, 10]}, True),
    ("bad direction", {"action": "scroll", "coordinate": [10, 10], "scroll_direction": "sideways"}, True),
    ("missing coordinate", {"action": "left_click"}, True),
    ("empty region", {"action": "zoom", "region": [10, 10, 10, 10]}, True),
    ("unknown action", {"action": "teleport"}, True),
]


def main() -> int:
    computer = X11Computer()
    print(
        f"display {computer.display}: screen "
        f"{computer.screen_width}x{computer.screen_height}, "
        f"advertised {computer.width}x{computer.height} (scale {computer.scale:.3f})"
    )
    print(f"tool definition: {computer_tool_definition(computer)}\n")

    failures = 0
    for label, action, expect_error in CHECKS:
        result = computer.execute(action)
        ok = result.is_error == expect_error
        # Every successful action should hand back a fresh screenshot.
        if ok and not expect_error and not result.png:
            ok = False
            note = "no screenshot returned"
        else:
            note = (result.output or "").splitlines()[0] if result.output else ""
        if ok:
            size = len(result.png) if result.png else 0
            print(f"  PASS  {label:<22} {note or f'{size} B png'}")
        else:
            failures += 1
            print(f"  FAIL  {label:<22} is_error={result.is_error} {note}")

    # The result block must be shaped the way the API expects.
    block = tool_result_block("toolu_test", computer.execute({"action": "screenshot"}))
    assert block["type"] == "tool_result" and block["tool_use_id"] == "toolu_test"
    assert any(b["type"] == "image" for b in block["content"])
    err = tool_result_block("toolu_err", computer.execute({"action": "nope"}))
    assert err.get("is_error") is True
    print("\n  PASS  tool_result block shape")

    print(f"\n{len(CHECKS)} checks, {failures} failed")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
