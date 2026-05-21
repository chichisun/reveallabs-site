# Design — Interactive Dashboard Preview (marketing homepage)

> Status: approved for mockup phase (2026-05-20). Mockup-first via Claude Design; nothing ships to the live site until the mockup is signed off.
> Supersedes the placement + scope decisions in `docs/dashboard-preview/PLAN.md` where they differ (see "Changes from prior PLAN.md").

## Goal

The marketing site sets up a problem but never shows the product. A first-time visitor can't answer the three questions that drive sign-ups:

- What does this actually look like?
- Why does it help me?
- What is Reveal for me?

We add a **phone preview of the real v3 dashboard** that answers all three by *showing* the product, fed anonymized demo data, with a plain-language caption per screen.

## Placement (product-first)

```
Intro → Hero → ▶ DashboardPreview ◀ → Scrollytelling → WhatWeDo → FinalCTA → Footer
```

The preview sits **after the Hero, before Scrollytelling**. This flips the page from problem-first to product-first:

1. Hero hooks the visitor, then they immediately **see the product**.
2. The anonymized demo (generic restaurant, ~$1,240/week leak) comes first; the real **Tuk Tuk Thai $5,931** case study inside Scrollytelling lands right after as *proof it's real*. Demo → proof.
3. Cost: we show the solution before fully twisting the knife on the problem. Accepted — the Hero carries enough tension.

The Scrollytelling section and its real case study are **not touched**.

## Screens (4)

Hook → proof → "it's easy" → "we watch everything." Pulse was dropped.

| # | Screen | Job | Caption (plain language) |
|---|--------|-----|--------------------------|
| 1 | Home — leak inbox | The hook. Visceral "money is leaking." | "Reveal found about $1,240 leaking this week. And exactly where." |
| 2 | Flag detail | The proof. Reveal shows its work (what you usually pay vs actual). | "It doesn't just flag it. It shows you the receipt." |
| 3 | Capture | Kills the effort objection. | "Snap a bill. Reveal reads every line for you." |
| 4 | Commitments | Scope / breadth (Mike's pitch). | "Every contract, vendor, and renewal, watched so you don't have to." |

Captions follow v3 voice rules: no jargon, no exclamation points, signed numbers with units + context. No em dashes (impeccable copy law).

## Demo data — anonymized, number-matched

Generic restaurant identity ("Your Restaurant"), generic counterparties ("Produce Supplier", "Linen Service", "Rent — Landlord", "Payroll"). Headline figures **echo the case-study scale** (~$1,240/week ≈ the $5,931/month proof below) so the demo feels continuous without exposing any real vendor/customer specifics. Shapes adapted from `oxygen/dashboard/src/lib/mock-data.ts`.

## Interaction — undecided on purpose

Build **three treatments** in the mockup and compare them live; the vertical pinned-scroll mechanic used by Scrollytelling sits directly below, so two of these deliberately use *different* motion to avoid feeling like a repeat:

- **(A) Auto-play reel** — pinned phone, screens auto-advance on a timer with progress dots. Visitor watches. Best fit for product-first placement.
- **(B) Tappable** — visitor taps a leak card → Flag detail, etc. They drive it.
- **(C) Horizontal carousel** — screens slide sideways on scroll. Distinct motion from the Scrollytelling below.

Same 4 screens and same data in all three; only the motion differs.

## Two design systems, one boundary

The section spans both of impeccable's registers, and the `.reveal-app-preview` boundary isolates them — for tokens *and* for register:

| | Marketing wrapper (section, captions, phone framing, scroll) | Phone interior (real v3 dashboard) |
|---|---|---|
| Register (impeccable) | **Brand** — design *is* the product | **Product** — design *serves* the product |
| Motion context (Emil) | Narrative/delight beat, seen once → cinematic durations licensed (count-up 600–900ms, screen cross-fades 300–400ms) | Product micro-interactions → strict <300ms, `scale(0.97)` press, hover gated |
| App/canvas bg | cream `#F2F1ED` | gray `#F1F2F4` |
| Surface | cream-lifted / white | white cards `#FFFFFF` + `--shadow-card` |
| Primary text | charcoal `#2E2E2E` | ink `#14171F` |
| Secondary text | `#797979` | `#6B7280` / faint `#9CA3AF` |
| Font | Space Grotesk | Inter (`tnum` + `cv11` figures) |
| Primary action | site's own | dark pill `#14171F`, white text |
| **Accent (shared)** | **hunter green `#355E3B`** | **hunter green `#355E3B`** |
| Semantics | — | red `#C23B22` leak / amber `#C08532` watch / green good |
| Radius / motion | site's own | 10–24px radii, `cubic-bezier(0.25,1,0.5,1)`, 120/200/320/600ms |

**Bridge:** hunter green `#355E3B` exists in both systems. Use it deliberately so the gray phone belongs on the cream page.

**Source of truth for the interior:** the real v3 code (`oxygen/dashboard/src/app/globals.css`) + the v3 moodboard (`oxygen/.planning/moodboards/moodboard-v3-app-ui.md`). **Do not** use oxygen's `DESIGN.md` — it is the stale v2 (cream + Space Grotesk) doc.

## Architecture (for the live build, after mockup sign-off)

New self-contained dir `src/components/dashboard-preview/` — see `docs/dashboard-preview/PLAN.md` for the file tree. The chosen interaction treatment determines the section shell; everything inside the phone is copied-in real v3 components fed anonymized mock data. Token isolation: declare v3 variables + `mockup.css` rules nested under `.reveal-app-preview`; load Inter scoped to the preview so the rest of the site keeps Space Grotesk.

## Process

1. Generate inputs: this design doc + the Claude Design brief (`docs/dashboard-preview/CLAUDE-DESIGN-BRIEF.md`).
2. Build + compare the 3 treatments in **Claude Design** (point it at `reveallabs-site` for the frame and oxygen v3 for the screens).
3. Pick the winner.
4. Implement live in `reveallabs-site` — hold all motion to Emil's checklist; run impeccable `critique` / `audit` / `polish` before shipping.

Fallback: if Claude Design's weekly limit blocks the comparison, build the mockup in-repo using impeccable `live` (browser variant mode) + `frontend-design`.

## Changes from prior PLAN.md

- **Placement:** moved from *after* Scrollytelling to *before* it (product-first).
- **Scope:** 4 screens (Home, Flag, Capture, Commitments), not 5 — Pulse dropped.
- **Interaction:** was "scroll-driven pinned" (locked); now **undecided**, 3 treatments to compare in mockup.
- **Data:** confirmed anonymized but number-matched to the case study.
- **Tokens corrected:** interior is v3 gray/white/Inter/`#14171F` + hunter green (not the cream that oxygen's stale DESIGN.md implies).
- **Mockup-first:** added an explicit Claude Design mockup + sign-off gate before any live code.

## Open / deferred

- Final interaction treatment — decided after the mockup comparison.
- Caption copy — placeholders above; refine on real pixels.
- Exact headline number and the leak-card line items — finalize against the v3 leak-card anatomy during mock data.
