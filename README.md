# azim — computer use with Claude

[![Python 3.11+](https://img.shields.io/badge/python-3.11%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Model](https://img.shields.io/badge/model-Claude%20Opus%205-orange)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)

> **🧠 New in this repo: [Smarter Than Yesterday](#-smarter-than-yesterday--the-course)** —
> an interactive course, labelled *"Making Azim as smart as humanly possible in all aspects of
> life"*. 6 domains · 29 lessons · 87 quiz questions · spaced-repetition flashcards ·
> British-accent voice lessons · progress tracking. Run it with
> `python3 course_server.py` and open <http://localhost:8000>.

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

---

# 🧠 Smarter Than Yesterday — the course

*"Making Azim as smart as humanly possible — in all aspects of life."*

An interactive, self-contained course that distils what the world's smartest
operators know — learning science, memory, thinking tools, money, energy,
people skills, decision-making, and AI & its future — into 29 short lessons
that genuinely change behaviour, not just fill your head.

| Piece | What it does |
| --- | --- |
| `index.html` | The course app. Single-page, zero build step, zero external requests. |
| `js/data.js` | The curriculum: 6 domains, 29 lessons, 87 quiz questions, voice scripts, real-world actions. |
| `js/app.js` | The engine: router, British-accent voice lessons, quizzes with explanations, spaced-repetition flashcards (1→3→7→16→35 days), XP / streaks / badges, CSV export. |
| `css/styles.css` | The design system: dark aurora glassmorphism, hand-written, no CDNs. |
| `roadmap.html` | Printable 29-week roadmap — one lesson a week. |
| `course_server.py` | One-command local server (Python stdlib only). |

## Run it

```bash
python3 course_server.py          # then open http://localhost:8000
```

Any static server works (`npx serve`, nginx, …), or host the repo root on
GitHub Pages — it's plain static files. No build, no dependencies, no network.

## Your guide — how to actually use it

1. **Start with lesson 1** (`Mind & Learning → How Learning Actually Works`) —
   it teaches the method the whole course is built on.
2. **Read or listen.** Every lesson has a full voice version using **British
   English (en-GB) voices only** — no other accent is ever offered, and
   **nothing ever auto-plays**; you press ▶ Play. If your device has no British
   voice installed, the app tells you how to add one instead of swapping accents.
3. **Take the quiz.** Getting questions wrong is the mechanism, not the failure.
   Every question shows an explanation and becomes a flashcard.
4. **Do the "Do it today" action.** Each lesson ends with one concrete
   real-world action. This is where the course becomes real.
5. **Come back daily for 5 minutes of flashcards.** The scheduler resurfaces
   each card just as you'd forget it — that's what makes learning permanent.
6. **Follow the roadmap.** One lesson per week for 29 weeks (`#/roadmap` or the
   printable `roadmap.html`). Faster is allowed; the daily review is sacred.
7. **Watch Progress.** XP, streaks, domain bars, badges — and export everything
   to CSV. All data lives only in your browser's localStorage: private by design.

## How much smarter will it make you? The honest numbers

No course can promise IQ points — anyone who does is selling something. What the
evidence *does* support, and what this course trains:

| Capacity | Evidence | Realistic gain |
| --- | --- | --- |
| Retention of what you learn | Retrieval practice + spaced repetition roughly **double** long-term retention vs rereading (Dunlosky et al. 2013; Roediger & Karpicke 2006) | ~2× of what you study actually sticks |
| Skill acquisition | Deliberate practice is the strongest known predictor of expertise (Ericsson) | A repeatable method for any skill, forever |
| Decision quality | Pre-mortems, base rates and expected-value thinking measurably reduce judgement errors | A few avoided disasters per decade is life-changing |
| Financial outcomes | Starting investing at 25 vs 35 can ~2× end wealth at identical contributions | Potentially the best £-per-hour you'll ever learn |
| Focus & output | Deep work + attention-residue research | ~2× output on your most important work |
| AI leverage | Large measured productivity gains for professionals who use AI well | A durable top-decile career edge |
| Energy & wellbeing | Sleep consistency, exercise and stress-recovery have among the largest effect sizes in health psychology | More good hours per day — the multiplier on everything |

**The compounding claim you can bank:** 1% more effective per week for 29 weeks
isn't 29% — compounded it's ~33% and accelerating, because every mental model
makes the next one easier to learn. The truthful promise isn't "genius in 29
weeks". It's a permanently better operating system, installed one upgrade at a
time — measured honestly by your quiz scores, flashcard retention and streak,
all visible on the Progress screen.

## The 29-week roadmap at a glance

| Weeks | Domain |
| --- | --- |
| 1–6 | 🧠 Mind & Learning — how learning, memory, focus and thinking actually work |
| 7–10 | 💷 Money & Work — compounding, career capital, negotiation, self-sabotage |
| 11–14 | ⚡ Body & Energy — sleep, exercise, nutrition, stress recovery |
| 15–18 | 🗣️ People & Communication — speaking, listening, hard conversations, influence |
| 19–24 | 🤖 AI & the Future — how AI works, top-1% usage, career strategy, safety, the next decade |
| 25–29 | 🧭 Life Operating System — decisions, habits, systems, relationships, meaning |

Rhythm: 5 min flashcards daily · one 20-min lesson weekly · one real-world
action weekly · one rule above all: **never miss twice**.
