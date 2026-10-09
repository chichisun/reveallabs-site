# Archived — the landing page v1 execution plan

Moved 2026-10-09 by the scheduled Friday repo sweep. Moved, not deleted.

## What this was

`LANDING-PAGE-GAMEPLAN.md` (81,040 bytes, the largest markdown file in the
repo) was a one-shot, dated execution script: ship `www.reveallabs.co` by
Monday 2026-04-20 EOD, hard stop Tuesday morning before the Mike Speck
meeting. Eight parallel tracks, A through H, with checkboxes used as the
progress tracker.

## Why it was archived

| Check | Result |
|---|---|
| Last touched | 2026-04-20, **171 days**. Its only commit is `5d4c262` "feat: landing page v1 — launch (#1)" — the plan was committed by the very launch it planned. |
| Did it ship? | Yes. The site is live and the repo has moved two generations past this plan: `src/components/home-v2/`, `story-v2/`, `blog-v2/` are the current surfaces, built from a later mockup pass. |
| Inbound links | **One, and it is inside the plan's own cluster**: `design/references/README.md:5`. Nothing outside `design/` references the file, the stem, or the prose forms "gameplan" / "game plan" anywhere in the tracked tree. |
| All branches | Checked all six remote branches (`main`, `copy/hero-audit-insight`, `feat/dashboard-preview`, `feat/join-page`, `claude/animation-smoothing-mtxw93`, `vercel/install-and-configure-vercel-s-morv6g`). Zero references from outside `design/` on every one. |
| Read by the build? | No. `design/` appears in `.gitignore` only, and only for three untracked subdirectories (`video-clips/`, `claude-design-exports/`, `video-final/`). No build config, script or CI job reads it. |

`design/references/README.md:5` was updated in this commit to point at the new
path, so the reference does not dangle.

## What was deliberately left in place

This plan was the **only live document** naming three asset directories. They
stay where they are, and the plan stays greppable here, which is why this was a
move and not a delete.

- **`design/video-stills/` (18MB) — alive, and proved by bytes, not by prose.**
  `design/video-stills/2b.png` is md5-identical (`29f2a04624b2a5e96ad1cd3b5718cad7`)
  to `public/blog-images/this-week-in-restaurant-operations-hero.png`, which is
  the `heroImage` **and** `ogImage` of the published post
  `src/content/blog/this-week-in-restaurant-operations.mdx:13-14`. This folder is
  the source art for a shipping image.
- **`design/references/` (808K) — left by judgement, not by proof.** Its own
  README calls it "persistent reference materials" and invites future sessions to
  add to it. Its only citer was this plan, so a stricter reading would have
  archived it too. It was kept because a document asking to be kept for reuse is
  evidence, and the Mojang rotation and Viktor Oddy workflow notes are generic
  technique, not landing-page-v1 specifics. Flagged in the sweep receipt as the
  judgement call in this sweep.
- **`design/inspiration-capture/` (2.4MB)** — three screenshots, zero references
  from anywhere once this plan moved. Left with `references/` for the same reason.

## What was never a candidate

`design/mockups/supy-visual-pass/` is **emphatically live**: four production
components cite it as their source mockup — `src/components/home-v2/HomeV2.tsx:14`,
`blog-v2/BlogV2Shell.tsx:8`, `story-v2/StoryV2.tsx:9`, `home-v2/SiteNav.tsx:6`.
