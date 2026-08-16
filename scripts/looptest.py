"""Drive the agent loop with a scripted model, no API calls.

`selftest.py` proves the X11 backend works. This proves the loop around it:
that tool_use blocks are dispatched to the real display, results are threaded
back as correctly-shaped tool_result blocks, screenshots are pruned, refusals
short-circuit, and the loop terminates.

Everything runs except the network call to Claude.

    python scripts/looptest.py
"""

from __future__ import annotations

import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from computer_use.agent import ComputerUseAgent  # noqa: E402
from computer_use.computer import X11Computer  # noqa: E402


# -- a stand-in for the pieces of the SDK the agent touches ----------------


@dataclass
class FakeBlock:
    type: str
    text: str = ""
    id: str = ""
    input: dict[str, Any] = field(default_factory=dict)


@dataclass
class FakeMessage:
    content: list[FakeBlock]
    stop_reason: str = "tool_use"
    stop_details: Any = None


class FakeStream:
    def __init__(self, message: FakeMessage) -> None:
        self._message = message

    def __enter__(self):
        return self

    def __exit__(self, *exc: object) -> None:
        return None

    def __iter__(self):
        return iter(())  # no deltas; the agent only needs the final message

    def get_final_message(self) -> FakeMessage:
        return self._message


class FakeMessages:
    def __init__(self, script: list[FakeMessage]) -> None:
        self._script = list(script)
        self.requests: list[dict[str, Any]] = []

    def stream(self, **kwargs: Any) -> FakeStream:
        self.requests.append(kwargs)
        if not self._script:
            raise AssertionError("agent called the model more times than scripted")
        return FakeStream(self._script.pop(0))


class FakeClient:
    def __init__(self, script: list[FakeMessage]) -> None:
        self.messages = FakeMessages(script)
        self.beta = type("Beta", (), {"messages": self.messages})()


def build(script: list[FakeMessage], **kw: Any) -> ComputerUseAgent:
    return ComputerUseAgent(
        computer=X11Computer(), client=FakeClient(script), **kw
    )


# -- checks ---------------------------------------------------------------


def test_tool_loop() -> None:
    """A tool turn is executed against the display, then the loop finishes."""
    agent = build([
        FakeMessage(
            [
                FakeBlock("text", text="Taking a look."),
                FakeBlock("tool_use", id="toolu_1", input={"action": "screenshot"}),
            ],
            stop_reason="tool_use",
        ),
        FakeMessage(
            [FakeBlock("text", text="The desktop is empty.")], stop_reason="end_turn"
        ),
    ])

    final = agent.run("What's on screen?")
    assert final == "The desktop is empty.", final

    # user goal, assistant turn, tool results, assistant turn
    assert len(agent.messages) == 4, [m["role"] for m in agent.messages]
    results = agent.messages[2]["content"]
    assert results[0]["type"] == "tool_result"
    assert results[0]["tool_use_id"] == "toolu_1"
    assert any(b["type"] == "image" for b in results[0]["content"])
    assert "is_error" not in results[0]
    print("  PASS  tool turn dispatched, result threaded back")


def test_parallel_tool_uses() -> None:
    """Several tool_use blocks in one turn produce one result each, in order."""
    agent = build([
        FakeMessage(
            [
                FakeBlock("tool_use", id="toolu_a", input={"action": "screenshot"}),
                FakeBlock(
                    "tool_use",
                    id="toolu_b",
                    input={"action": "mouse_move", "coordinate": [10, 10]},
                ),
            ],
            stop_reason="tool_use",
        ),
        FakeMessage([FakeBlock("text", text="Done.")], stop_reason="end_turn"),
    ])
    agent.run("go")
    results = agent.messages[2]["content"]
    assert [r["tool_use_id"] for r in results] == ["toolu_a", "toolu_b"], results
    print("  PASS  parallel tool_use blocks each get a result")


def test_tool_error_is_flagged() -> None:
    """A bad action comes back as is_error rather than crashing the loop."""
    agent = build([
        FakeMessage(
            [FakeBlock("tool_use", id="toolu_bad", input={"action": "teleport"})],
            stop_reason="tool_use",
        ),
        FakeMessage([FakeBlock("text", text="Recovered.")], stop_reason="end_turn"),
    ])
    assert agent.run("go") == "Recovered."
    result = agent.messages[2]["content"][0]
    assert result["is_error"] is True
    assert "Unsupported action" in result["content"][0]["text"]
    print("  PASS  tool error surfaces as is_error, loop continues")


def test_refusal_short_circuits() -> None:
    """A refusal returns without touching content or the display."""
    agent = build([
        FakeMessage(
            [],
            stop_reason="refusal",
            stop_details=type("D", (), {"category": "cyber"})(),
        )
    ])
    final = agent.run("something declined")
    assert "declined" in final and "cyber" in final, final
    print("  PASS  refusal short-circuits before reading content")


def test_pruning_across_turns() -> None:
    """Long runs keep only the newest screenshots, but every result survives."""
    turns = 6
    script = [
        FakeMessage(
            [FakeBlock("tool_use", id=f"toolu_{i}", input={"action": "screenshot"})],
            stop_reason="tool_use",
        )
        for i in range(turns)
    ]
    script.append(FakeMessage([FakeBlock("text", text="ok")], stop_reason="end_turn"))

    agent = build(script, keep_screenshots=2)
    agent.run("keep going")

    blocks = [
        b
        for m in agent.messages
        if isinstance(m["content"], list)
        for b in m["content"]
        if isinstance(b, dict) and b.get("type") == "tool_result"
    ]
    images = sum(1 for b in blocks if any(x["type"] == "image" for x in b["content"]))
    assert len(blocks) == turns, len(blocks)
    assert images == 2, images
    print(f"  PASS  pruning kept 2 of {turns} screenshots, all results intact")


def test_iteration_cap() -> None:
    """A model that never stops calling tools is bounded, not infinite."""
    agent = build(
        [
            FakeMessage(
                [FakeBlock("tool_use", id=f"t{i}", input={"action": "screenshot"})],
                stop_reason="tool_use",
            )
            for i in range(3)
        ],
        max_iterations=3,
    )
    final = agent.run("loop forever")
    assert "Stopped after 3 iterations" in final, final
    print("  PASS  max_iterations bounds a runaway loop")


def test_request_shape() -> None:
    """Every request carries the computer tool and the required beta header."""
    agent = build([FakeMessage([FakeBlock("text", text="hi")], stop_reason="end_turn")])
    agent.run("hello")
    req = agent.client.messages.requests[0]
    tool = req["tools"][0]
    assert tool["type"] == "computer_20251124" and tool["name"] == "computer"
    assert tool["display_width_px"] == agent.computer.width
    assert tool["display_height_px"] == agent.computer.height
    assert "computer-use-2025-11-24" in req["betas"]
    assert req["model"] == "claude-opus-5"
    assert req["thinking"]["type"] == "adaptive"
    print("  PASS  request carries tool, betas, model, thinking")


CHECKS = [
    test_tool_loop,
    test_parallel_tool_uses,
    test_tool_error_is_flagged,
    test_refusal_short_circuits,
    test_pruning_across_turns,
    test_iteration_cap,
    test_request_shape,
]


def main() -> int:
    failures = 0
    for check in CHECKS:
        try:
            check()
        except AssertionError as exc:
            failures += 1
            print(f"  FAIL  {check.__name__}: {exc}")
    print(f"\n{len(CHECKS)} checks, {failures} failed")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
