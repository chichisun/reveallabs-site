# Archived — the /join page build plan and its 09-02 copy amendment

Both files sat at the repo root. Both are finished plans: the page they
describe is live at `reveallabs.co/join` and every file they name ships.

Moved 2026-10-06 by the scheduled Tuesday repo sweep. Moved, not deleted.

## Why they were archived

| Check | `JOIN-PAGE-BUILD-PLAN.md` | `JOIN-PAGE-COPY-AMENDMENT-2026-09-02.md` |
|---|---|---|
| Last touched | 2026-08-30 — 37 days | 2026-09-02 — 34 days |
| Inbound links | **Zero.** Filename, stem, and the prose forms "join page", "join-page", "join plan", "build plan", "copy amendment" all return nothing outside the two files themselves. | **Zero**, same checks. |
| Shipped? | Every file it names exists: `src/app/join/page.tsx`, `src/components/join/JoinForm.tsx`, `src/styles/join.css`, `src/app/api/apply/route.ts`. Both one-line edits landed too — `SiteNav.tsx:86,107` and `Footer.tsx:16` carry the `/join` link, `layout.tsx:16` imports `join.css`. | Option A is live **verbatim**: `JoinV2.tsx:35` "No salary yet, an ownership stake that vests", `:79` the pill "Equity, no salary yet", `:87-88` the straight-talk paragraph, and `page.tsx:8` the meta description. |
| Its own proof command | — | Its Proof #1 is `grep -rniE 'unpaid\|\bintern' src/`. Run 10-06: the only hits are "Internal cutter mechanism", "International users" and "Internalize them" — a comment, the privacy page and a blog post. No hiring copy. The proof passes. |

## The two stale title lines, so nobody is misled

Both files open by saying they await Kase's yes. **Both got it.** The build
plan's line is from the morning it was written, before the page was built.
The amendment's "awaiting Kase's yes" is contradicted by the very commit that
added it — `f6ff51e`, which applied Option A to three source files in the same
commit and whose message reads "Plan and Kase's yes".

This is why they were archived rather than deleted: read literally, they claim
two decisions are still open that were in fact made and shipped.

## Why it waited until today

The 2026-10-02 sweep found both files archivable and deliberately left them.
Kase was working on `feat/join-page` with uncommitted changes of his own that
morning, and archiving a plan he might have had open would have been rude.
`origin/feat/join-page` is now **0 ahead, 0 behind** `main` — the branch is
merged and done, so the deferral has expired.

## One thing this move does NOT lose

`JOIN-PAGE-BUILD-PLAN.md:134` is the only live document that calls the
`dashboard-preview` work unfinished and warns against merging its branch. That
sentence is the evidence base for the standing `src/components/dashboard-preview/`
question (fourteenth sighting as of this sweep). The file stays in the repo and
stays greppable — which is exactly why this was a move and not a delete.
