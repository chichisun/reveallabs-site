# Viktor Oddy's Claude Design Workflow

**Source:** X post / video by @viktoroddy, April 18 2026. 18-minute tutorial titled "Claude Design is insane" on building animated award-winning websites with Claude Design + Opus 4.7.

**Viktor's business:** Founder of motionsites.ai (free hero prompts + backgrounds) and Design Rocket. ~24K X followers, posts regularly hit 50K+ likes. Makes money selling "Hero Prompt" catalogs for AI-built websites.

**Why his method matters:** He's built the first repeatable system for producing premium websites in Claude Design. Our gameplan is built on top of his pattern.

---

## The core principle

**Don't prompt the whole page at once.** Build section-by-section. Each section has its own reference image, its own targeted Claude Design prompt, and its own iteration loop.

Trying to one-shot a landing page in Claude Design produces generic output. Composing it one section at a time with targeted references produces premium output.

---

## The 8-step sequence (Viktor's canonical workflow)

### 1. Seed the project
- Go to claude.ai/design → "Other" → type "website" → Create
- **Don't start from scratch.** Use a pre-built seed prompt. Viktor uses his own motionsites.ai "typography sets." We use our locked moodboard as the seed (stronger because it's real brand tokens, not generic aesthetic).

### 2. Build hero first — static background only
- Prompt Claude Design with the seed. Append: **"build this but do NOT add video elements — I'll replace later"**
- Video is expensive in credits AND hard to iterate on. Stub with solid color or gradient, swap in real video later.

### 3. Generate video background separately
Viktor uses: **Nano Banana 2** (still image) → **Seedance 2.0 or Kling 3.0** (image→video) → video hosting → copy URL → swap into Claude Design.

We use: Nano Banana 2 → **Higgsfield** → Vercel Blob. Same pattern, different animation tool.

The key trick: don't burn Claude Design credits on video. Generate externally, feed URL.

### 4. Add UI elements to hero
- Search Dribbble / Pinterest for specific UI elements (cards, stat displays, navbars)
- Screenshot the elements you want
- Upload screenshots to Claude Design
- Prompt with positioning + treatment: *"add these UI elements under text in hero, position nicely, use the same liquid glass as navbar/buttons, text white"*

### 5. Check mobile via Claude Design's inspect/preview

### 6. Build each next section (repeat per section)
For each section below hero:
1. Find inspiration on Dribbble/Pinterest → screenshot
2. Open **Nano Banana 2** → prompt: *"recreate this in 8k, remove text/buttons/cards, keep layout, plain black background"*. This strips irrelevant content from the reference so Claude Design focuses on layout/composition, not content.
3. (Optional) If the section needs video: Seedance/Kling/Higgsfield → host → URL
4. Back in Claude Design: *"build this section under previous one exactly as shown, use Google Material Icons white, liquid glass cards, same fonts we established, this video as background [URL]"*

### 7. Export
Click Export → Code (HTML/React) / PDF / Canva / Screenshots

### 8. Ship + market
Record page walkthrough in Screen Studio, frame with shots.so device mockups, post on X tagging Claude Design + whichever model you used. Viktor averages 50K likes doing this daily.

---

## What Viktor warns about

> "This website is paid and very expensive, so I recommend going directly to nano banana."

Claude Design credits deplete quickly on video generation. PCWorld reporter got locked out for a week after 30 minutes of use. **Generate media externally, feed URLs into Claude Design as strings.** Don't ask Claude Design to generate video or complex imagery.

---

## His aesthetic signature (what HE builds — we don't have to follow this)

- **Liquid glass** (semi-transparent frosted cards) everywhere — navbar, buttons, hero cards
- **Video backgrounds** per section, not static
- **Dark backgrounds with white text**
- **White Google Material Icons** (no colored icons)
- **Consistent type across all sections** (he uses one typographic set he pre-built)

We're NOT copying his aesthetic. Our moodboard is cream canvas + hunter green + Space Grotesk (warm, grounded, restaurant-appropriate). We're copying his PROCESS — the section-by-section loop.

---

## Tools Viktor uses (for reference)

| Tool | His usage | Our equivalent |
|---|---|---|
| claude.ai/design | Primary build surface | **Same** |
| motionsites.ai | His pre-built seed prompts + free bg videos | We use moodboard v2 as seed |
| nano banana 2 | Image generation (backgrounds + reference cleanup) | **Same** |
| Seedance 2.0 / Kling 3.0 | Image→video | **Higgsfield** (we chose) |
| Marks.com | Video hosting | **Vercel Blob** (already in our stack) |
| Dribbble / Pinterest | Inspiration screenshots | **Same + Savee, Awwwards, Land-book** |
| Screen Studio / CleanShot | Marketing video recording | Post-launch only |
| shots.so | Device frame mockups | Post-launch only |

---

## Full transcript

See `transcript.txt` in this folder for the complete 18-min tutorial transcription (auto-transcribed via whisper.cpp base.en model).
