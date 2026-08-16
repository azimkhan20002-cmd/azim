"""CLI entrypoint: `python -m computer_use "<goal>"`."""

from __future__ import annotations

import argparse
import json
import sys

from .agent import AgentEvents, ComputerUseAgent, require_credentials
from .computer import ComputerError, X11Computer


def _describe(action: dict) -> str:
    name = action.get("action", "?")
    detail = {k: v for k, v in action.items() if k != "action"}
    if "text" in detail and isinstance(detail["text"], str) and len(detail["text"]) > 60:
        detail["text"] = detail["text"][:57] + "..."
    return f"{name} {json.dumps(detail)}" if detail else name


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="computer_use",
        description="Let Claude drive a virtual X11 desktop.",
    )
    parser.add_argument("goal", help="What Claude should accomplish on the desktop.")
    parser.add_argument("--display", default=None, help="X display (default: $DISPLAY or :99)")
    parser.add_argument(
        "--effort",
        default="high",
        choices=["low", "medium", "high", "xhigh", "max"],
        help="Reasoning effort. high/xhigh suit agentic work; low/medium are cheaper.",
    )
    parser.add_argument("--max-iterations", type=int, default=40)
    parser.add_argument(
        "--keep-screenshots",
        type=int,
        default=3,
        help="How many recent screenshots stay in context (-1 keeps all).",
    )
    parser.add_argument("--no-zoom", action="store_true", help="Disable the zoom action.")
    parser.add_argument(
        "--no-fallback",
        action="store_true",
        help="Disable the server-side refusal fallback to claude-opus-4-8.",
    )
    parser.add_argument("--show-thinking", action="store_true")
    args = parser.parse_args(argv)

    require_credentials()

    try:
        computer = X11Computer(display=args.display)
    except ComputerError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    print(
        f"display {computer.display} — screen {computer.screen_width}x{computer.screen_height}, "
        f"sent to Claude as {computer.width}x{computer.height}",
        file=sys.stderr,
    )

    events = AgentEvents(
        on_text=lambda t: (sys.stdout.write(t), sys.stdout.flush()),
        on_thinking=(
            (lambda t: (sys.stderr.write(t), sys.stderr.flush()))
            if args.show_thinking
            else None
        ),
        on_action=lambda a: print(f"\n  -> {_describe(a)}", file=sys.stderr),
        on_result=lambda summary, is_error: (
            print(f"  <- {'ERROR: ' if is_error else ''}{summary}", file=sys.stderr)
        ),
    )

    agent = ComputerUseAgent(
        computer=computer,
        effort=args.effort,
        max_iterations=args.max_iterations,
        keep_screenshots=args.keep_screenshots,
        enable_zoom=not args.no_zoom,
        use_refusal_fallback=not args.no_fallback,
        events=events,
    )

    try:
        final = agent.run(args.goal)
    except KeyboardInterrupt:
        print("\ninterrupted", file=sys.stderr)
        return 130

    print(f"\n\n--- done ---\n{final}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
