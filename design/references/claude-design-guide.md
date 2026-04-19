# Claude Design — Usage Guide

**Launched:** April 17 2026 by Anthropic Labs. Research preview product.
**Access:** Pro, Max, Team, Enterprise plans. Kase has Max — verified access at claude.ai/design.
**Underlying model:** Claude Opus 4.7 (Anthropic's most capable vision model).

---

## What it is

Browser-based visual design surface. Describe what you want → Opus 4.7 generates a first version → refine via:
- Inline comments on specific elements (click element, add comment, Claude updates it)
- Direct text/style edits (edit text in place like a doc)
- Adjustment controls (spacing, color, layout sliders)
- Follow-up chat turns (full conversation with Claude about the design)

---

## What it produces

- Interactive prototypes
- Product wireframes and mockups
- Pitch decks, slides, one-pagers
- Marketing collateral (including our landing page)
- Code-powered prototypes with video, 3D, shaders

---

## How to access

- Open https://claude.ai/design in a browser
- Click "+ New project" → choose a type ("Website", "Slide deck", "Other") → Create
- Project has a URL like `https://claude.ai/design/p/[uuid]?file=index.html`
- Projects persist in your Claude account
- Can duplicate projects (important for A/B testing variants — see gameplan Steps F-3, F-8)

---

## Inputs Claude Design accepts

- **Text prompts** (primary — what we've been writing)
- **Document uploads:** DOCX, PPTX, XLSX
- **Codebase pointer:** reads your GitHub repo for design system tokens (WE ARE NOT USING THIS for v1 — would pull in default Next.js starter tokens which we don't want)
- **Web capture tool:** screenshot elements from any live site and paste
- **Image uploads:** reference screenshots from Dribbble, etc.

---

## Outputs / exports

- **URL** (shareable, read-only link to the design)
- **PDF** (flattened visual export)
- **PPTX** (for slides)
- **Canva** (send to Canva, editable there)
- **HTML** (standalone static HTML file)
- **React / Next.js code** (most important for us — this is what we'll import into reveallabs-site)
- **Claude Code handoff bundle** (single instruction that hands everything to Claude Code for implementation)

---

## Critical limitation: credit lockouts

**This bites hard.** PCWorld reporter published an article titled "I tried Claude Design for half an hour. I'm already locked out for a week" (April 17-18 2026). Credits deplete faster than users expect, especially on:
- Video generation attempts (just use external tools)
- Complex imagery
- Regenerating entire projects instead of iterating

**Mitigation tactics (follow these during Track F):**

1. **Don't regenerate the whole page.** Use inline comments and targeted edits. "Make the headline bigger" > "rebuild the hero."
2. **Iterate section by section** (Viktor's pattern). Build one section, approve it, move to the next. Don't rebuild approved sections.
3. **Don't generate video/imagery in Claude Design.** Use Nano Banana + Higgsfield externally, feed URLs as text strings.
4. **Take screenshots every 30 min.** If you get locked out, you have your work visually saved to reconstruct in code.
5. **Export incrementally.** Export code after hero done, after sections done, after motion done. Don't wait until the very end.
6. **Have a fallback plan.** If locked out mid-execution, the gameplan can pivot to "Claude Design as visual-only reference" — we use the screenshots as the spec and write the code directly.

---

## Codebase integration feature (research preview)

Claude Design can read your codebase during onboarding to build a design system from it. **We are deliberately NOT using this for v1** because our reveallabs-site repo is a fresh Next.js starter with default Geist tokens — Claude Design would inherit those and constrain our output.

When to USE codebase integration (future):
- After we ship v1 and commit our moodboard tokens to `globals.css`
- When iterating on subsequent pages (pricing, case studies, etc.) that should match v1's style
- At that point Claude Design reads our tokens and maintains consistency automatically

---

## Partners / integrations

- **Canva** — export designs, keep editing there collaboratively
- **Brilliant** — integration mentioned in launch materials
- **Claude Code** — the handoff bundle lets Code implement the design directly

---

## What it can't do (yet)

- Native video rendering (you need external tools)
- Real backend logic / forms / auth (it's design-only)
- Perfect responsive tuning (Claude Design's mobile preview helps but local dev testing is still required)
- Animation preview at native smoothness (some Framer Motion animations look different in Claude Design preview vs. production browser)

---

## Our Claude Design project URL (if still valid)

`https://claude.ai/design/p/8da96eb2-4065-4d75-9d17-ec04f407ebc0?file=index.html`

This was Kase's earlier attempt before the gameplan locked. Per Gameplan Step A-3 we create a fresh project — `reveal-landing-v1` — rather than iterating on this one (cleaner context, cleaner history).

---

## Reference URLs

- Official Anthropic launch: https://www.anthropic.com/news/claude-design-anthropic-labs
- Help center: https://support.claude.com/en/articles/14604416-get-started-with-claude-design
- TechCrunch coverage: https://techcrunch.com/2026/04/17/anthropic-launches-claude-design-a-new-product-for-creating-quick-visuals/
