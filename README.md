# azim — computer use with Claude

Give Claude a screen. This runs a virtual X11 desktop and hands Claude Opus 5 the
[computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool),
so it can take screenshots, move the mouse, click, type, scroll, and zoom its way
through a real GUI.

```
you: "fill in the signup form with Grace Hopper's details and submit it"
       │
       ▼
  agent loop ──► Claude Opus 5 ──► tool_use {action: "left_click", coordinate: [640, 361]}
       │                                    │
       │                                    ▼
       │                            xdotool / scrot on DISPLAY=:99
       │                                    │
       └──────────── tool_result ◄──────────┘  (PNG screenshot of the new state)
```

## Quick start

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...        # or: ant auth login

./scripts/start_desktop.sh                 # virtual desktop + local demo form
export DISPLAY=:99

python -m computer_use "Fill in the signup form for Grace Hopper \
  (grace@navy.mil), choose the Enterprise plan, opt into the newsletter, \
  and submit it. Tell me what the confirmation says."
```

Point it at something else with `./scripts/start_desktop.sh https://example.com`,
or get a bare desktop with `./scripts/start_desktop.sh none`. Shut down with
`./scripts/stop_desktop.sh`.

## What's here

| Path | Role |
| --- | --- |
| `computer_use/computer.py` | X11 backend. Turns actions into `xdotool`/`scrot` calls, returns PNGs. |
| `computer_use/tools.py` | Tool definition (`computer_20251124`) and `tool_result` formatting. |
| `computer_use/agent.py` | The agent loop: call model → run actions → send screenshots back. |
| `computer_use/__main__.py` | CLI. |
| `scripts/start_desktop.sh` | Boots Xvfb + openbox + Chromium. |
| `scripts/selftest.py` | Exercises the backend with no API calls. |
| `scripts/demo_page.html` | Local form to practise on. |

## Using it as a library

```python
from computer_use import ComputerUseAgent, X11Computer

agent = ComputerUseAgent(computer=X11Computer(display=":99"), effort="high")
print(agent.run("Open the Plan dropdown and select Enterprise."))
```

## How it's wired to the API

- **Model** `claude-opus-5`, **tool** `computer_20251124`, **beta header**
  `computer-use-2025-11-24`. Older models (Sonnet 4.5, Haiku 4.5) need
  `computer_20250124` with the `computer-use-2025-01-24` header instead.
- **Thinking** is adaptive with `display: "summarized"`, so `--show-thinking`
  can render progress instead of a long silent pause. Effort defaults to `high`;
  `--effort xhigh` for harder goals, `low`/`medium` to cut cost.
- **`enable_zoom`** is on, letting Claude re-read a region at full resolution
  rather than guessing at small text.
- **Refusal fallback.** Opus 5 runs safety classifiers that can decline a request
  (HTTP 200 with `stop_reason: "refusal"`), so the loop checks `stop_reason`
  before reading content and sets `fallbacks` to re-serve declined requests on
  `claude-opus-4-8`. That model is pinned rather than using `fallbacks: "default"`
  because the fallback must also support `computer_20251124`. Disable with
  `--no-fallback`.
- **Streaming** on every turn, so a large `max_tokens` can't hit the request
  timeout.

### Two details worth knowing if you modify this

**Display size must match the screenshots exactly.** `display_width_px` /
`display_height_px` tell Claude what coordinate space it's working in. If the
screenshots you send don't match, every click lands offset in the same
direction. `X11Computer` downscales screenshots when the screen exceeds the
model's image limit (2576 px on the long edge for Opus 5) and scales Claude's
coordinates back up, so the two stay in sync. At 1280×800 the mapping is 1:1.

**Screenshots are pruned from history.** Every action returns an image, so an
unpruned conversation grows by a full screenshot per step. Only the newest three
are kept (`--keep-screenshots`, `-1` to keep all); older ones become a text
placeholder while their `tool_result` blocks stay in place, so each `tool_use`
keeps a matching result.

## Verifying without spending tokens

```bash
export DISPLAY=:99
python scripts/selftest.py
```

Runs every action against the live display — clicks, drags, modifier-held
clicks, scrolling, zoom — plus the error paths (out-of-bounds coordinates,
unknown actions, malformed regions), and checks the `tool_result` shape. No API
calls, so a failure here is the plumbing rather than the model.

## Requirements

Python 3.11+, and `Xvfb`, `xdotool`, `scrot`, `xdpyinfo`, `openbox` on PATH —
`start_desktop.sh` installs them via apt if it's running as root. Chromium is
optional; the script uses a Playwright-managed build if it finds one.

## Sandboxing

Claude is driving a real desktop with real mouse and keyboard control. Give it a
throwaway display and a container you don't mind losing — not a session with
your credentials logged in. Treat coordinates and typed text as untrusted model
output, and be deliberate about what's reachable from that environment, since
anything on screen is something Claude can click.

Some environments restrict outbound network access, in which case Chromium will
show `ERR_TUNNEL_CONNECTION_FAILED` for external sites while local pages
(`file://`, localhost) work fine. That's the network policy, not the agent.
