"""Tool definition and result formatting for the computer use tool."""

from __future__ import annotations

from typing import Any

from .computer import ToolResult, X11Computer

# Tool version for Claude Opus 5, Sonnet 5, Opus 4.8/4.7/4.6, Sonnet 4.6, Opus 4.5.
# Older models (Sonnet 4.5, Haiku 4.5, ...) need `computer_20250124` and the
# `computer-use-2025-01-24` beta header instead.
COMPUTER_TOOL_TYPE = "computer_20251124"
COMPUTER_USE_BETA = "computer-use-2025-11-24"


def computer_tool_definition(
    computer: X11Computer, *, enable_zoom: bool = True
) -> dict[str, Any]:
    """Build the tool block. Dimensions MUST match the screenshots we send back.

    Any mismatch shows up as clicks landing consistently off-target, because
    Claude returns coordinates in the space it was told about.
    """
    definition: dict[str, Any] = {
        "type": COMPUTER_TOOL_TYPE,
        "name": "computer",
        "display_width_px": computer.width,
        "display_height_px": computer.height,
        "display_number": _display_number(computer.display),
    }
    if enable_zoom:
        # Lets Claude re-read a region at full resolution instead of guessing
        # at small text (`computer_20251124` only).
        definition["enable_zoom"] = True
    return definition


def _display_number(display: str) -> int:
    # ":99" / ":99.0" -> 99
    try:
        return int(display.lstrip(":").split(".")[0])
    except ValueError:
        return 0


def tool_result_block(tool_use_id: str, result: ToolResult) -> dict[str, Any]:
    """Turn a ToolResult into the `tool_result` block the API expects."""
    content: list[dict[str, Any]] = []
    if result.output:
        content.append({"type": "text", "text": result.output})
    if result.base64_image:
        content.append(
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": result.base64_image,
                },
            }
        )
    if not content:
        content.append({"type": "text", "text": "(no output)"})

    block: dict[str, Any] = {
        "type": "tool_result",
        "tool_use_id": tool_use_id,
        "content": content,
    }
    if result.is_error:
        block["is_error"] = True
    return block
