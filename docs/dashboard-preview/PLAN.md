# Plan — Interactive Dashboard Preview on the Marketing Site

## Context

The Reveal marketing site (`reveallabs-site`) sets up a problem ("a restaurant is loud / the data is quiet") but **never shows the product**. A first-time visitor can't answer the three questions that drive sign-ups:

- *What does this actually look like?*
- *Why does it help me?*
- *What is Reveal even for me?*

We're adding a **scroll-driven, auto-playing phone preview** of the real MVP dashboard, placed right after the Scrollytelling problem-beat — the emotional moment to show the answer. It reuses the real dashboard's card components (copied in, fed anonymized fake data) inside a phone frame, and comes alive as the visitor scrolls: numbers count up, leak cards slide in, and it advances through a short guided tour. A plain-language caption rides alongside each screen so the visitor understands *why* they're seeing it.

### Decisions locked (with Kase, this session)

| Decision | Choice |
|---|---|
| Approach | **Live choreographed components** — copy the real dashboard cards into `reveallabs-site`, feed curated mock data, layer Framer Motion. |
| Repo | **`reveallabs-site`** (separate from `oxygen/dashboard`; copy = snapshot, re-copy on major redesign). |
| Fidelity of story | **Money-shot → short tour.** |
| Device frame | **Phone frame** (app is phone-first / 414px → native width, no recomposition). |
| Placement | **Homepage section, immediately after `<Scrollytelling/>`.** |
| Interactivity | **Scroll-driven, auto-plays** (no clicking required; mirrors existing site motion). |
| Tour screens | **All five**: Home (money-shot) → Flag detail → Capture → Commitments → Pulse. |
| Demo data | **Anonymized** to a generic restaurant; no real customer/vendor exposure. |

### ⚠️ Scope flag (Kase chose ambitious — honoring it, with a de-risking note)
Five choreographed screens is meaningfully more build than 2–3. Recommend shipping in **two passes** so the homepage gets value fast and we don't block on the long tail:
- **Pass 1 (the money-shot):** Home + Flag detail — the hook and the proof. This alone answers all three visitor questions.
- **Pass 2 (the tour):** add Capture, Commitments, Pulse beats.
Both passes share the same scaffold; Pass 2 is purely additive (more beats + more screen components).

---

## Narrative arc (what we show / why we show it / how we explain it)

The phone stays pinned; the caption beside it changes per beat. Each beat = one screen + one plain-language headline.

| Beat | Screen | Why this screen | Caption (plain language) |
|---|---|---|---|
| 1 | **Home — leak inbox** | The hook. The visceral "money is leaking" moment. | "Reveal found **$1,240 leaking** this week — and exactly where." |
| 2 | **Flag detail** | The proof. Shows Reveal *shows its work* (baseline vs actual, line-item drivers) — not just a vague alert. | "It doesn't just flag it. It shows you the receipt." |
| 3 | **Capture** | Lowers the effort objection. "All you do is take a picture." | "Snap a bill. Reveal reads every line for you." |
| 4 | **Commitments** | Scope / Mike's pitch. The ~100 things nobody watches. | "Every contract, vendor, and renewal — watched, so you don't have to." |
| 5 | **Pulse** | Daily-use / retention. Peace of mind every morning. | "A 10-second check every morning. That's the whole job." |

Anonymized data example: restaurant identity → neutral ("Hi there · Your Restaurant"); vendors → generic ("Produce Supplier +$420", "Linen Service +$180").

---

## Architecture

### New directory (all new code, self-contained)
```
reveallabs-site/src/components/dashboard-preview/
├── DashboardPreview.tsx        ← section shell; clones Scrollytelling's pinned-left + scroll-right-beats mechanic
├── PhoneFrame.tsx              ← phone bezel/proportions wrapper (.reveal-app-preview lives here)
├── screens/
│   ├── HomeScreen.tsx          ← StatusBar + count-up hero + staggered LeakCards (real components)
│   ├── FlagDetailScreen.tsx    ← recreated from UI MVP/02-leak-detail.html (presentational)
│   ├── CaptureScreen.tsx       ← recreated from UI MVP/06-capture.html (presentational)
│   ├── CommitmentsScreen.tsx   ← CommitmentRow + category pills (real + recreated)
│   └── PulseScreen.tsx         ← recreated from UI MVP/05-pulse.html (presentational)
├── lib/                        ← copied-in deps from oxygen/dashboard
│   ├── types.ts                ← subset of dashboard src/lib/types.ts (Finding, LineItemDelta, Commitment, …)
│   ├── format-vendor.ts        ← copied verbatim
│   └── why-text-polish.ts      ← copied verbatim (replaceIsoDates)
├── cards/                      ← copied-in real components
│   ├── LeakCard.tsx
│   ├── RecentCaptureItem.tsx
│   └── CommitmentRow.tsx
├── chrome/
│   └── StatusBar.tsx
├── mock.ts                     ← anonymized demo data (adapted from dashboard src/lib/mock-data.ts)
└── preview.css                 ← dashboard tokens + mockup.css class rules, SCOPED under .reveal-app-preview
```

### Token isolation (critical — prevents clobbering the marketing site)
- **Do NOT** merge the dashboard's Tailwind `@theme` into `reveallabs-site/src/app/globals.css`. The marketing site's theme (cream + Space Grotesk) must stay intact.
- Instead, in `preview.css`: declare the dashboard's CSS variables (from `oxygen/dashboard/src/app/globals.css` lines 15–85) and the `mockup.css` class rules **nested under `.reveal-app-preview { … }`**. The dashboard components reference these via class names + `var(--…)`, so scoping the variables + classes is sufficient — no Tailwind utility dependency.
- **Verify** the `var()` names line up: `LeakCard.tsx` references `var(--text-secondary)` while the `@theme` defines `--color-ink-soft`. `mockup.css` likely defines legacy aliases — copy `mockup.css` faithfully and confirm no undefined vars at runtime.
- Load **Inter** scoped to the preview (e.g. `next/font` Inter with a CSS variable applied only inside `.reveal-app-preview`), so the rest of the site keeps Space Grotesk.

### Page wiring
- `reveallabs-site/src/app/page.tsx` — insert `<DashboardPreview />` between `<Scrollytelling />` and `<WhatWeDo />`.

---

## Animation plan

**Section mechanic (cloned from `Scrollytelling.tsx`):**
- Desktop: phone is `position: sticky` on the left/center; 5 caption blocks scroll on the right; a rAF-throttled scroll handler sets `activeBeat` = block nearest viewport-center. `activeBeat` drives which screen renders inside the phone.
- Mobile: no pinning; each beat renders its phone screen inline, revealed on scroll via `IntersectionObserver` (same `is-visible` pattern).

**Screen transitions:** `AnimatePresence` cross-fade/slide as `activeBeat` changes (Framer Motion 12, already installed).

**Per-screen choreography (plays when its beat becomes active):**
- Home: hero number count-up `$0 → $1,240` via `useMotionValue`/`animate`; leak cards stagger slide-in.
- Flag detail: baseline-vs-actual evidence bars grow; drivers fade in.
- Capture: viewfinder → shutter flash → extracted line items populate row-by-row.
- Commitments: category pill bar fills; rows stagger in.
- Pulse: vital cards rise; sparkline path draws.

**Accessibility / robustness:**
- `prefers-reduced-motion`: per Emil's rule — **keep opacity/color transitions for comprehension, remove all transform-based movement**; render count-ups at final value. Section must read correctly with zero motion (mirror existing `WhatWeDo` fallback).
- Respect CLS: reserve the phone's dimensions so nothing shifts as screens swap.
- Caption text is the real semantic content (the phone is `aria-hidden`, like Scrollytelling's `.scrolly-left`).

### Animation craft — Emil Kowalski rules (locked, from `emil-design-eng` skill)
Two animation *contexts* here, governed differently:
- **Narrative/delight beats** (count-up, screen-to-screen tour) = a rare, first-time "can add delight" context → cinematic durations are fine (count-up ~600–900ms, screen cross-fades ~300–400ms). Not bound by the 300ms UI cap.
- **Micro-interactions inside the phone** (button `:active`, hovers, pill states) = product UI → obey Emil's rules strictly.

Concrete, non-negotiable rules:
- **Easing:** entrances use `ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`); on-screen movement uses `ease-in-out` (`cubic-bezier(0.77, 0, 0.175, 1)`). **Never `ease-in`. Never `transition: all`** — name the exact property.
- **Only animate `transform` + `opacity`.** Never `height`/`width`/`margin`/`padding`. Screen swaps and card reveals use transform + opacity (or `clip-path: inset()` for wipe-style reveals).
- **Never animate from `scale(0)`** — start cards at `scale(0.97), opacity:0`.
- **Prefer CSS transitions / WAAPI over keyframes** for anything that can be interrupted mid-scroll (transitions retarget; keyframes restart from zero). Use `@starting-style` for enter animations where supported.
- **Framer Motion caveat:** its shorthand `x`/`y`/`scale` props are NOT hardware-accelerated — use full `transform` strings (`transform: "translateY(24px)"`) so the off-main-thread path is used; matters because this section animates *while the page scrolls*.
- **Stagger** leak/commitment card entries 30–80ms; decorative only, never blocks reading.
- **Buttons** (Fix it / Snooze): `transform: scale(0.97)` on `:active`, ~160ms ease-out.
- **Hover guard:** wrap any hover effect in `@media (hover: hover) and (pointer: fine)` so touch taps don't trigger phantom hovers.
- **QA in slow motion** (2–5× duration) to catch timing misalignment between the count-up, card stagger, and caption reveal.

---

## Execution environment

**Run the implementation rooted in `reveallabs-site`, not `oxygen`.** Every edit lands in `reveallabs-site` (its own git + Vercel deploy + CLAUDE.md); `oxygen` was only open during planning to read the dashboard we copy *from*. This isn't a repo move — it's placing new code in the existing sibling repo and rooting the work session there.
- This plan file (`~/.claude/plans/…`) and all skills (`impeccable`, `emil-design-eng`, `superpowers`) are **global** — nothing is lost by switching sessions.
- Execution still needs **read access** to the `oxygen` sibling dir (absolute paths) to copy components from `oxygen/dashboard/**` and reference `oxygen/UI MVP/*.html`. Reading a sibling directory by absolute path works fine from a `reveallabs-site` session.

## Execution order

0. **Install `emil-design-eng`** from `github.com/emilkowalski/skill` (skill not yet present locally); confirm it loads.
1. **Scaffold** `dashboard-preview/` + `PhoneFrame` + scoped `preview.css` (tokens + `mockup.css` under `.reveal-app-preview`) + scoped Inter. Render an empty phone on the homepage to prove isolation (marketing site theme unaffected).
2. **Copy deps + cards**: `types.ts` (subset), `format-vendor.ts`, `why-text-polish.ts`, `LeakCard.tsx`, `StatusBar.tsx`. Confirm no undefined CSS vars.
3. **Anonymized `mock.ts`**: adapt shapes from `oxygen/dashboard/src/lib/mock-data.ts`; neutral identity + generic vendors.
4. **Pass 1 — money-shot**: build `HomeScreen` (count-up + staggered LeakCards) and `FlagDetailScreen`; wire the 2-beat scroll mechanic + captions. **Ship-able checkpoint.**
5. **Pass 2 — tour**: add `CaptureScreen`, `CommitmentsScreen`, `PulseScreen` + their beats (+ copy `RecentCaptureItem`, `CommitmentRow`).
6. **Polish**: drive the marketing-side composition (caption layout, section rhythm, phone framing, ambitious visual effects) with the **`impeccable` skill**, and hold every animation to the **`emil-design-eng` skill** rules above. Use `UI MVP/0N-*.html` mockups as the pixel reference for recreated screens. Reduced-motion + mobile pass.

**Skills used during execution:**
- **`impeccable`** (local) — marketing-side composition, polish, live browser iteration, ambitious visual effects.
- **`emil-design-eng`** (from `github.com/emilkowalski/skill`) — animation craft authority. **Not yet installed** → first execution step is to install it (clone into the Claude skills dir / add as a plugin), then load it before writing any motion code.
- `frontend-design` (local) — optional fallback for component-level composition.

**On "do we use Claude design?"** — Yes: `impeccable` for the marketing composition, `emil-design-eng` for the motion. The *inside* of the phone is driven by the copied real components + existing HTML mockups, so it stays faithful to the actual product rather than re-invented.

---

## Critical files

**Edit / create (in `reveallabs-site`):**
- `src/app/page.tsx` — insert `<DashboardPreview/>` after `<Scrollytelling/>`
- `src/components/dashboard-preview/**` — all new (see tree above)
- (Inter via `next/font` — wire into layout or local to preview, scoped)

**Copy FROM (read-only source, `oxygen/dashboard`):**
- `src/components/cards/LeakCard.tsx`, `RecentCaptureItem.tsx`, `CommitmentRow.tsx`
- `src/components/chrome/StatusBar.tsx`
- `src/lib/types.ts`, `src/lib/format-vendor.ts`, `src/lib/labels/why-text-polish.ts`
- `src/app/globals.css` (lines 15–85 `@theme` tokens) + `src/styles/mockup.css` (class rules)
- `src/lib/mock-data.ts` (shapes to adapt → anonymize)

**Reference (pixel-perfect, read-only):**
- `oxygen/UI MVP/01-home.html`, `02-leak-detail.html`, `06-capture.html`, `03-commitments.html`, `05-pulse.html`

**Reuse as pattern (in `reveallabs-site`):**
- `src/components/Scrollytelling.tsx` (sticky-left + scroll-right beats + IO fallback)
- `src/components/WhatWeDo.tsx` (reduced-motion fallback reference)

---

## Verification

- `pnpm dev` in `reveallabs-site`; scroll the homepage past Scrollytelling:
  - phone comes alive (count-up runs, cards slide in), and screens advance with scroll.
  - **Isolation check:** rest of the site is visually unchanged — still cream + Space Grotesk; the preview is the only Inter/gray region. Inspect that no dashboard `var()`/reset leaked into `body`.
  - **Reduced-motion:** enable OS "Reduce Motion" → preview renders final states with simple fades, no jank, fully legible.
  - **Mobile (≤768px):** phone screens reveal inline on scroll; no pinning artifacts.
  - **No undefined CSS vars** in console; no layout shift (CLS) as screens swap.
- Build check: `pnpm build` succeeds (copied components are client components; confirm `"use client"` boundaries).
- Eyeball against `UI MVP/0N-*.html` for the recreated screens.
