# Archived — the 2026-05-01 site context doc (superseded PRODUCT.md)

`PRODUCT-2026-05-01.md` was `docs/PRODUCT.md`. It is the compiled
source-of-truth context written for reveallabs.co on 2026-05-01. The live
context doc is now `PRODUCT.md` at the repo root (last touched 2026-07-25).

Moved 2026-08-14 by the scheduled Friday repo sweep. Moved, not deleted.

## Why it was archived

| Check | Result |
|---|---|
| Inbound links | **Zero.** Nothing in the repo references `docs/PRODUCT.md`; a repo-wide grep for `PRODUCT.md` returns only the two files' own headings. |
| Last touched | 2026-05-01 — 84 days before the sweep. |
| Its own declared sources | Its header says it was compiled from four files in the marketing repo. **Three are gone:** `prompts/reveal-voice.md` and `marketing-plan-year-1.md` were deleted in the 2026-07-22 video-first pivot cleanup, and `docs/platform-strategy.md` was archived by this same sweep routine on 2026-08-11. Only `CLAUDE.md` survives. |
| Superseded | The root `PRODUCT.md` covers the same ground for the current site. |

## What is still true in it, so nothing is lost

It describes the **pre-Fustat** typography: Space Grotesk for body/headings
plus Space Mono for eyebrows and metadata. That is not wrong — it is the
older half of the site. `src/app/layout.tsx` still loads all three faces, and
its own comment marks Fustat as the *homepage* (home-v2) typeface. So this
file remains the better description of the non-homepage surfaces, which is
exactly why it was archived rather than deleted.

Its palette section and the blog-as-credibility-surface framing also predate
the current root doc.

## The hazard this removes

Two files named `PRODUCT.md`, each calling itself the source of truth, one of
them 84 days stale with three of its four sources deleted. A session that
opened the wrong one would take the stale typography and would go looking for
marketing files that no longer exist.
