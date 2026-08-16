"""The agent loop: Claude looks at the screen, acts, looks again."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Any, Callable, Iterable

import anthropic

from .computer import X11Computer
from .tools import COMPUTER_USE_BETA, computer_tool_definition, tool_result_block

MODEL = "claude-opus-5"

# Server-side refusal fallback. Claude Opus 5 runs safety classifiers that can
# decline a request (HTTP 200 with stop_reason "refusal"); `fallbacks` re-serves
# it on another model inside the same call. We pin Opus 4.8 rather than using
# `fallbacks: "default"` because the fallback model must also support
# `computer_20251124`, and the "default" router chooses by refusal category.
FALLBACK_BETA = "server-side-fallback-2026-06-01"
FALLBACK_MODEL = "claude-opus-4-8"

SYSTEM_PROMPT = """\
You are operating a Linux desktop through the computer tool. The screen is a \
virtual X11 display; there is no physical user watching it.

Work in a look-act-look loop: take a screenshot to see the current state, take \
one action, then screenshot again to confirm the effect before continuing. Do \
not chain several blind actions and assume they landed.

When text is too small to read confidently, use the zoom action on that region \
rather than guessing at it.

Applications may take a moment to appear after you launch them. If the screen \
looks unchanged, wait briefly and screenshot again before concluding something \
failed.

You are operating autonomously — nobody can answer questions mid-task. For \
reversible actions that follow from the request, proceed without asking. When \
the task is done, state plainly what you did and what the final state is. If \
you genuinely cannot complete it, say what is blocking you.\
"""


@dataclass
class AgentEvents:
    """Optional callbacks so a CLI (or a UI) can render progress."""

    on_text: Callable[[str], None] | None = None
    on_thinking: Callable[[str], None] | None = None
    on_action: Callable[[dict[str, Any]], None] | None = None
    on_result: Callable[[str, bool], None] | None = None


@dataclass
class ComputerUseAgent:
    computer: X11Computer
    client: anthropic.Anthropic = field(default_factory=anthropic.Anthropic)
    model: str = MODEL
    effort: str = "high"
    max_tokens: int = 16000
    max_iterations: int = 40
    keep_screenshots: int = 3
    enable_zoom: bool = True
    use_refusal_fallback: bool = True
    system_prompt: str = SYSTEM_PROMPT
    events: AgentEvents = field(default_factory=AgentEvents)

    def __post_init__(self) -> None:
        self.messages: list[dict[str, Any]] = []

    # -- public API -------------------------------------------------------

    def run(self, goal: str) -> str:
        """Drive the desktop until Claude stops calling tools. Returns final text."""
        self.messages.append({"role": "user", "content": goal})

        for _ in range(self.max_iterations):
            response = self._call_model()

            # Opus 5's classifiers can decline; content is empty or partial, so
            # check stop_reason before reading it.
            if response.stop_reason == "refusal":
                details = getattr(response, "stop_details", None)
                category = getattr(details, "category", None) or "unspecified"
                return f"Request was declined by safety classifiers (category: {category})."

            self.messages.append({"role": "assistant", "content": response.content})

            tool_uses = [b for b in response.content if b.type == "tool_use"]
            if not tool_uses:
                return _final_text(response.content)

            results = []
            for block in tool_uses:
                action = dict(block.input or {})
                if self.events.on_action:
                    self.events.on_action(action)
                result = self.computer.execute(action)
                if self.events.on_result:
                    self.events.on_result(
                        result.output or ("screenshot" if result.png else "ok"),
                        result.is_error,
                    )
                results.append(tool_result_block(block.id, result))

            self.messages.append({"role": "user", "content": results})
            self._prune_screenshots()

        return (
            f"Stopped after {self.max_iterations} iterations without a final answer. "
            "Raise max_iterations or narrow the goal."
        )

    # -- internals --------------------------------------------------------

    def _request_kwargs(self) -> dict[str, Any]:
        betas = [COMPUTER_USE_BETA]
        kwargs: dict[str, Any] = {
            "model": self.model,
            "max_tokens": self.max_tokens,
            "system": self.system_prompt,
            "messages": self.messages,
            "tools": [
                computer_tool_definition(self.computer, enable_zoom=self.enable_zoom)
            ],
            # Thinking is on by default on Opus 5; ask for summaries so the CLI
            # can show progress instead of a long silent pause.
            "thinking": {"type": "adaptive", "display": "summarized"},
            "output_config": {"effort": self.effort},
        }
        if self.use_refusal_fallback:
            betas.append(FALLBACK_BETA)
            kwargs["fallbacks"] = [{"model": FALLBACK_MODEL}]
        kwargs["betas"] = betas
        return kwargs

    def _call_model(self):
        # Stream so a large max_tokens can't hit the request timeout, and so
        # text and thinking can be rendered as they arrive.
        with self.client.beta.messages.stream(**self._request_kwargs()) as stream:
            for event in stream:
                if event.type != "content_block_delta":
                    continue
                if event.delta.type == "text_delta" and self.events.on_text:
                    self.events.on_text(event.delta.text)
                elif event.delta.type == "thinking_delta" and self.events.on_thinking:
                    self.events.on_thinking(event.delta.thinking)
            return stream.get_final_message()

    def _prune_screenshots(self) -> None:
        """Keep only the most recent N screenshots in history.

        Every action returns an image, so an unpruned conversation grows by a
        full screenshot per step and burns context on views Claude has already
        acted on. Older images become a short text placeholder; the tool_result
        blocks themselves stay, so every tool_use keeps its matching result.
        """
        if self.keep_screenshots < 0:
            return
        seen = 0
        for message in reversed(self.messages):
            content = message.get("content")
            if not isinstance(content, list):
                continue
            for block in content:
                if not (isinstance(block, dict) and block.get("type") == "tool_result"):
                    continue
                blocks = block.get("content")
                if not isinstance(blocks, list):
                    continue
                if not any(b.get("type") == "image" for b in blocks):
                    continue
                seen += 1
                if seen > self.keep_screenshots:
                    block["content"] = [
                        b for b in blocks if b.get("type") != "image"
                    ] or [{"type": "text", "text": "[earlier screenshot omitted]"}]


def _final_text(content: Iterable[Any]) -> str:
    return "\n".join(b.text for b in content if b.type == "text").strip() or "(no text)"


def require_credentials() -> None:
    """Fail early with a useful message rather than deep inside the SDK."""
    if os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN"):
        return
    config = os.environ.get("ANTHROPIC_CONFIG_DIR") or os.path.expanduser(
        "~/.config/anthropic"
    )
    if os.path.isdir(os.path.join(config, "credentials")):
        return  # an `ant auth login` profile; the SDK picks it up automatically
    raise SystemExit(
        "No Anthropic credentials found. Set ANTHROPIC_API_KEY, or run `ant auth login`."
    )
