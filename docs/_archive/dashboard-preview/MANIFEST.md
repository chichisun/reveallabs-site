# Archived — interactive dashboard preview (design milestone)

The planning material for the scroll-driven phone preview on the homepage.
The milestone is finished: the homepage renders its phone preview today
(`src/components/home-v2/HomeV2.tsx`, the `dash-stage` / `dash-phone`
markup), and none of these documents has been touched since 2026-05-21.

Moved 2026-08-11 by the scheduled Tuesday repo sweep. Moved, not deleted —
this is the record of how the preview was scoped and iterated.

| What | Detail |
|---|---|
| `PLAN.md`, `START-HERE.md`, `CLAUDE-DESIGN-BRIEF.md` | Original scope + design brief, 2026-05-20/21 |
| `design-spec/2026-05-20-dashboard-preview-design.md` | The approved design spec (was `docs/superpowers/specs/`); it supersedes `PLAN.md` where they differ, so it is filed alongside it |
| `v3-screens/`, `v3-screens-current/`, `inplace/` | 24 iteration screenshots, 5.4M |

Verified before the move: no file anywhere in the repo references the path
`docs/dashboard-preview` or `docs/superpowers`, and none of the 24
screenshots is cited by name in `src/` or `design/`.

**Left alone deliberately, and needs a founder yes/no:**
`src/components/dashboard-preview/` (`DashboardPreview.tsx`, `screens.tsx`,
`mock.ts`, `_shared.tsx`, `preview.css`) is *not imported by any page* —
the live homepage renders its own preview markup instead. Two live files
mention `preview.css`, but only in comments explaining where a token came
from. That looks like a superseded implementation, but it is source code,
not planning material or scratch, so the sweep does not touch it.
