# START HERE — Interactive Dashboard Preview

This folder is a **handoff** from a planning session (done in the `oxygen` workspace). The plan is finalized and approved. Build it **from this repo** (`reveallabs-site`).

## What we're building
A scroll-driven, auto-playing **phone preview of the real MVP dashboard**, added to the homepage right after `<Scrollytelling/>`. It comes alive as the visitor scrolls (number counts up, leak cards slide in) and walks through a 5-screen tour (Home → Flag detail → Capture → Commitments → Pulse), each with a plain-language caption. Answers the visitor's three questions: *what does it look like / why does it help me / what is Reveal for me*.

**Full spec + decisions + architecture + animation rules → [`PLAN.md`](./PLAN.md). Read it first.**

## Status of prerequisites
- ✅ **`emil-design-eng` skill installed** (global, `~/.claude/skills/emil-design-eng/`) — Emil Kowalski's animation-craft authority. Plan step 0 is done.
- ✅ **`impeccable` skill** available (global) — drives the marketing-side composition/polish.
- ⬜ Everything else = build work, not started.

## How to begin (in a session rooted in this repo)
1. **Branch cleanly.** This repo is currently on `news-friendly-headlines` with *unrelated* uncommitted WIP — do **not** entangle. Branch off a clean base (e.g. `git checkout -b feat/dashboard-preview origin/master` or off `news-friendly-headlines` only if that WIP is intended to ship together — confirm with Kase).
2. Load the skills: `impeccable` (composition) + `emil-design-eng` (motion). Consider `superpowers:executing-plans` to run PLAN.md with checkpoints.
3. Execute `PLAN.md` steps 1 → 6. **Pass 1 (Home + Flag) is a ship-able checkpoint** — get that working before the other three screens.

## Cross-repo note (the one thing to remember)
The real dashboard components live in the **`oxygen` sibling repo** — copy them in by absolute path, don't import:
- Copy FROM: `/Users/kase/Desktop/Reveal LLC/oxygen/dashboard/src/...` (see PLAN.md → "Critical files")
- Pixel reference: `/Users/kase/Desktop/Reveal LLC/oxygen/UI MVP/0N-*.html`

**Token-isolation is the #1 technical risk:** scope the dashboard's gray/Inter tokens under `.reveal-app-preview` (plain CSS in `preview.css`) — never merge them into this site's `@theme` (cream + Space Grotesk). PLAN.md → "Token isolation".
