# reveal. Landing Page — Execution Plan (v3)

**The single script. Read top to bottom, execute in track order.**

**Goal:** Live at `www.reveallabs.co` by **Monday April 20 2026 EOD** (hard stop: Tuesday April 21 morning before Mike Speck meeting).

**Primary tool:** Claude Design (claude.ai/design).

**Total effort:** 9-13 hr active work, 12-16 hr elapsed with parallelism.

---

## How this doc works

- **Tracks run in parallel.** Track A (setup) must finish first. Then Tracks B, C, D, E run simultaneously. Then Track F joins them. Then G, then H.
- **Steps within a track are sequential.** Don't skip ahead within a track.
- **Across tracks, interleave based on time-of-day and async renders.** Kick off a video render (Track C Step 3), then work on inspiration (Track B) while it renders.
- **Labels:** `[HUMAN]` `[CLAUDE DESIGN]` `[CLAUDE CODE]` `[WAIT]`
- **Check boxes as you go.** This doc is the progress tracker.

---

## Track Map (parallelism overview)

```
Sunday 4/19 — TODAY
│
├── Track A: Setup (20 min) ────────────────────[blocks everything]
│
├── (A done) ───────────┬─── Track B: Inspiration (60-90 min)
│                       ├─── Track C: Video generation (3-4 hr elapsed)
│                       ├─── Track D: Entrance assets (5 min - 1.5 hr)
│                       └─── Track E: Repo prep (30-45 min)
│
├── (B, C, D done) ──── Track F: Claude Design build (4-6 hr)
│                       └── start F late Sunday afternoon, continue into evening
│
Monday 4/20 — SHIP DAY
│
├── (F done) ───────── Track G: Export + implement (2-3 hr)
│                       └── Monday morning/midday
│
└── (G done) ───────── Track H: Deploy + verify (45 min)
                        └── Monday afternoon/evening — live by EOD

Tuesday 4/21 AM — HARD STOP
- Mike Speck meeting. Landing page MUST be live by now.
- If Mon EOD slips, Tue morning is the absolute deadline.
```

**Compressed timeline note:** This is ~1.5 working days, not 2.5. You have Sunday evening + all day Monday. Active work is 9-13 hr, fits comfortably if focused. Slip-risk lands on Monday evening, not Tuesday morning — if you're not in Track G by Monday noon, re-check scope.

---

## Locked Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Design system | Moodboard v2 (cream/hunter green/Space Grotesk/Space Mono/pill buttons) |
| 2 | Deployment | `reveallabs-site` repo → Vercel → www.reveallabs.co |
| 3 | Target ship | Monday 4/20 EOD, hard stop Tuesday 4/21 AM |
| 4 | Primary tool | Claude Design |
| 5 | Video aesthetic | B&W cinematic kitchen + waiters |
| 6 | Brand entrance | Mojang-inspired utensil→letters card flip |
| 7 | Base code source | Migrate scrollytelling from `Restaurant App/landing/` |
| 8 | **CTA target (v1)** | `mailto:chayadol@reveallabs.co?subject=Join%20the%20reveal.%20waitlist` — CTA text = "Join the waitlist" |
| 9 | **Proof numbers** | Real — from Tuk Tuk scan-06. Final CTA grid: $5,931/mo found + $67,140 annualized at pace + 3 specific moves + 30 days to measure. Updated 2026-04-20 after +4.2% was deemed weak. |
| 10 | **Quality bar** | Ship original quality OR slip deadline — no cut criteria |
| 11 | **OG image** | Screenshot of hero → `public/og-image.png` |
| 12 | **Analytics** | Vercel Analytics (one import, free) |
| 13 | **Privacy page** | Stub at `/privacy` — single paragraph |
| 14 | **Preliminary landing/ fate** | Keep as reference, do NOT delete, not migrated to reveallabs-site beyond scrollytelling components |
| 15 | **Target audience** | Non-technical restaurant owners. Minimal aesthetic, imagery-forward, copy-light. Emulate Sweetgreen, not Mercury/Linear. See Track F "Design Principle" block |
| 16 | **Page type** | **LOCKED: Variant B (full-page)** — asymmetric hero + stat card + video intermission + pilot + FAQ + final CTA + footer. Chosen 2026-04-19 after comparing hero renders. Variant A (teaser) archived at https://claude.ai/design/p/df9fdd8c-1d19-41b6-b1b3-e4bb2c55ceb4 as reference. The copy-light / imagery-forward aesthetic still applies within Variant B. Only CTA = email waitlist (mailto). |

## Decisions still TBD (resolved during execution)

| Decision | Resolved in step |
|---|---|
| Hero layout: centered vs asymmetric | F-8 |
| Video placement: intermission vs hero bg | F-11 |
| Motion signature: cursor trail / section morph / count-up / magnetic buttons | F-16 |
| Entrance asset path: Lucide icons vs custom Nano Banana art | D-1 |

---

## Reference Files (persistent — in this repo)

**Primary references (in `reveallabs-site/design/references/` — see `references/README.md` for full index):**
- **Viktor Oddy workflow summary:** `design/references/viktor-oddy/WORKFLOW.md` — the section-by-section pattern we're following
- **Viktor Oddy full transcript:** `design/references/viktor-oddy/transcript.txt` — 18-min tutorial transcribed
- **Viktor Oddy sample frames:** `design/references/viktor-oddy/frames-sample/` — Claude Design UI at different workflow stages
- **Mojang animation analysis:** `design/references/mojang/ANALYSIS.md` — what the rotation trick actually does, how we adapt
- **Mojang video source:** `design/references/mojang/mojang-studios-animation.mp4` — 4.4s reference
- **Mojang keyframes:** `design/references/mojang/frames/` — 17 extracted frames
- **Claude Design usage guide:** `design/references/claude-design-guide.md` — credit management, export formats, known limitations

**External references (absolute paths — outside this repo):**
- **Moodboard (locked design spec):** `/Users/kase/Desktop/Reveal LLC/Restaurant App/FrontEnd/moodboard-v2.0.html`
- **Preliminary landing page (scrollytelling source to migrate):** `/Users/kase/Desktop/Reveal LLC/Restaurant App/landing/app/page.tsx`
- **Locked messaging memory:** `~/.claude/projects/-Users-kase-Desktop-Reveal-LLC-Restaurant-App/memory/project_locked_messaging.md`
- **Project memory (landing page v1):** `~/.claude/projects/-Users-kase-Desktop-Reveal-LLC-Restaurant-App/memory/project_landing_page_v1.md`

**This doc:** `design/LANDING-PAGE-GAMEPLAN.md` (you're reading it)

---

# SESSION STATE (resume marker — 2026-04-19 ~3:30 PM)

**Current position:** Track A done. Track C C-1 done (8 stills generated and renamed in `design/video-stills/`). Paused on C-2 (Higgsfield queue) to install Playwright MCP so Claude can drive the browser.

**Stills ready** (8 total — scenes 1 and 2 have a+b angles as coverage):
- `scene-1a-wok.png`, `scene-1b-wok.png`, `scene-2a-plating.png`, `scene-2b-plating.png`, `scene-3-ticket.png`, `scene-4-waiter.png`, `scene-5-line-cook.png`, `scene-6-closer.png`

**Claude Design project:** https://claude.ai/design/p/df9fdd8c-1d19-41b6-b1b3-e4bb2c55ceb4

**Playwright MCP status:** Installed + registered at user scope. Confirmed `✓ Connected` via `claude mcp list`. Tools become callable only after Claude Code restart.

**To resume:** In the new session paste: *"Continue reveal landing page build. We're at Track C-2 (Higgsfield queue). Playwright MCP should be live now — drive Higgsfield.ai for me using the 8 refined Seedance prompts in this gameplan. Start with scene-1a as the C-2.5 checkpoint clip."*

**Seedance 2.0 motion prompts (v5 — full-speed + long-exposure, use verbatim):**

> **Vibe:** the restaurant feels chaotic and fast-paced. Long-exposure 1/4 second shutter smear sells the rush; the hero stays crisp. **Plays at full live-action speed — NOT slo-mo.**
>
> **Per-clip formula** (applies to 1a, 1b, 2a, 2b, 3, 4, 5): first ~60% of the clip is chaotic long-exposure streaking motion around the hero; the last ~40% catches the hero object crisp with minimal camera motion while background streaks continue. **Scene 6 is the exhale — dreamy closing formula.**
>
> **Full-speed rule (CRITICAL — Higgsfield defaults to slo-mo):** every prompt opens AND closes with explicit full-speed directives. Never use "frozen" (biases toward freeze-frame slo-mo) — use "caught" instead. If Higgsfield has a **negative prompt** field, paste: `slow motion, slo-mo, slow-mo, time dilation, speed ramp, freeze frame, 120fps slow, 60fps slow, slowed down, bullet time`.
>
> **No-face rule:** no identifiable faces in any clip. Background humans appear only as backlit silhouettes or heavy motion blur past recognition. Scene 5's line cook is a fully-backlit silhouette, face entirely in darkness.
>
> **Angles:** 1a is side-angle, **1b is top-down overhead POV** (locked straight down on the wok).
>
> **Pre-flight — stills:** v4+ requires long-exposure baked into the stills themselves (AI video models can't invent streak from clean photos — the still is the ceiling). Regenerate all 8 stills using the updated Nano Banana prompts in C-1 before animating. Also verify scene-5 shows a pure black silhouette with zero facial detail.

1a: `FULL SPEED REAL-TIME ACTION — 24fps normal playback, NO slow motion, NO slo-mo, NO time dilation, NO bullet time. Long-exposure motion continues throughout — flames streak in painterly light trails around the wok rim, smoke smears upward in blurred wisps, a silhouetted cook's arm (no face, pure blurred silhouette) sweeps swiftly through the frame edge in heavy 1/4 second shutter smear. Camera pushes in slowly. The wrist flicks sharply and rapidly; food and flame erupt airborne at full live-action speed, the shot catches the crisp arc of diced food at the peak of the toss in center frame while long-exposure streaks continue smearing around it. No faces at any frame. Full-speed playback throughout, not slow motion. Black and white 35mm film, 1/4 second shutter feel, high contrast, cinematic film grain, no text overlay, no camera shake.`

1b: `FULL SPEED REAL-TIME ACTION — 24fps normal playback, NO slow motion, NO slo-mo, NO time dilation, NO bullet time. Top-down overhead POV locked straight down on the wok throughout. Long-exposure motion continues — flames streak in painterly light trails curling up around the pan rim, smoke smears across frame in blurred 1/4 second shutter wisps, blurred silhouettes of other cooks smear swiftly past the edges of frame (no faces, pure blurred silhouettes). Camera stays locked overhead with minimal forward drift. The wok tilts and the contents crash back down rapidly from the peak of the toss at full live-action speed — vegetables and meat caught crisp in sharp focus as they land in the fire, sharp against the continuing long-exposure streaks. No faces at any frame. Full-speed playback throughout, not slow motion. Black and white 35mm, 1/4 second shutter feel, moody contrast, fine grain, no text overlay, no camera shake.`

2a: `FULL SPEED REAL-TIME ACTION — 24fps normal playback, NO slow motion, NO slo-mo, NO time dilation. Overhead on the plated dish. Long-exposure motion streaks across frame — blurred hands and long trails of steam race swiftly past the plate in heavy 1/4 second shutter smear. Fingers descend quickly into frame holding a pinch of microgreens, hover briefly, release; the greens scatter and settle rapidly at full live-action speed, the shot catches the crisp plated dish with greens in sharp focus, hand already withdrawn, long-exposure streaks still smearing at the edges. No faces, only blurred silhouettes at the edges. Subtle overhead zoom. Full-speed playback throughout, not slow motion. Dramatic rim light from above, black and white 35mm film, shallow depth of field, cinematic grain, no text overlay, no camera shake.`

2b: `FULL SPEED REAL-TIME ACTION — 24fps normal playback, NO slow motion, NO slo-mo, NO time dilation. Foreground blurred with chaotic long-exposure kitchen motion — streaking hands and smeared activity racing past in heavy 1/4 second shutter trails. Tweezers enter quickly from the left carrying a single piece of garnish at full live-action speed; focus racks rapidly from the blurred chaos to crisp sharpness as the tweezers place the garnish precisely on the dish, release, and pull back out of frame while the background stays streaked and smeared. No faces, only smeared silhouettes. Camera holds still. Full-speed playback throughout, not slow motion. Dreamy cinematic quality, black and white 35mm, rim light, fine film grain, no text overlay, no camera shake.`

3: `FULL SPEED REAL-TIME ACTION — 24fps normal playback, NO slow motion, NO slo-mo, NO time dilation. The service rail pulses with chaos — long-exposure streaking steam fills the frame, backlit silhouetted cooks rush swiftly past in the blurred background in heavy 1/4 second shutter smear. A cook's hand darts in rapidly from the right at full live-action speed and snatches the paper ticket off the rail; focus racks from the streaked background to the crisp ticket and gripping hand mid-snatch, everything else still smearing around it. The empty clip sways crisp in the final beat as long-exposure streaks continue. No faces at any frame. Full-speed playback throughout, not slow motion. Black and white 35mm film, high contrast, grain, no text overlay, no camera shake.`

4: `FULL SPEED REAL-TIME ACTION — 24fps normal playback, NO slow motion, NO slo-mo, NO time dilation. Tracking briskly behind the waiter's back at full live-action speed as he shoulders through the swinging kitchen door — the door frame and surroundings streak in heavy long-exposure 1/4 second shutter blur from the camera's forward push. The bright dining room opens up beyond as long-exposure streaks of blurred figures at tables (no crisp faces, all smeared past recognition in painterly motion trails). Shot catches the crisp plated dishes on the tray held steady in center frame, sharp against the still-streaked room around them, door swinging shut behind in the wake. Forward camera motion following at real-time speed. Full-speed playback throughout, not slow motion. Black and white 35mm, cinematic grain, no text overlay, no camera shake.`

5: `FULL SPEED REAL-TIME ACTION — 24fps normal playback, NO slow motion, NO slo-mo, NO time dilation. Fully backlit silhouette of a line cook working a multi-burner line — face entirely in darkness, pure black outline against the fire, zero facial detail visible at any frame. Camera glides slowly right to left. Chaotic long-exposure columns of flame, steam, and smoke streak across frame in painterly 1/4 second shutter trails; blurred silhouettes of other cooks smear swiftly past in the deep background. The shot catches one burner as a pan lifts crisp into frame at full live-action speed, flames curling up sharply around its rim, the cook's silhouette still pitch black and unresolved. No face visible at any frame. Full-speed playback throughout, not slow motion. Black and white 35mm, cinematic grain, no text overlay, no camera shake.`

6: `FULL SPEED REAL-TIME ACTION — 24fps normal playback, NO slow motion, NO slo-mo, NO time dilation. A hand enters briskly from the left at full live-action speed, fingers splay and grip the rim of the plated dish, then lifts the plate cleanly up and out of the top of frame with heavy natural long-exposure 1/4 second shutter motion blur; steam swirls and streaks in the wake in painterly motion trails, the pass surface where the plate sat now empty. Camera pulls back gently. Full-speed playback throughout, not slow motion. Long-exposure dreamy quality, black and white 35mm, soft diffused contrast, atmospheric film grain, no sharpening, no text overlay, no camera shake.`

---

# TRACK A — Setup (20 min, blocks everything)

## A-1 — Create accounts `[HUMAN]` (10 min)
- [ ] **Google AI Studio** (Nano Banana 2): https://aistudio.google.com — sign in with Google
- [ ] **Higgsfield**: https://higgsfield.ai — sign up, pick a plan, confirm credits
- [ ] **Claude Design**: https://claude.ai/design — confirm Max access
- [ ] **Vercel** — confirm `reveallabs-site` project exists and is linked to GitHub
- [ ] **GitHub** — confirm push access to `chichisun/reveallabs-site`

## A-2 — Create working folders `[HUMAN]` (2 min)

**Rationale for folder locations:** All website-related assets live INSIDE the `reveallabs-site` repo under `design/`. Single source of truth — anything that pertains to the site is in the repo.

**Committed to git** (reference-worthy, small):
- `design/inspiration-capture/` — Dribbble/Linear/Mercury screenshots
- `design/video-stills/` — final 6 B&W Nano Banana stills
- `design/video-final/` — final edited `intermission.mp4` (5-8 MB)
- `design/entrance-utensils/` — Path B custom icons if used
- `design/references/` — already committed (Viktor, Mojang, Claude Design guide)

**Gitignored** (large or throwaway — see `.gitignore`):
- `design/video-clips/` — raw Higgsfield MP4s (20-50 MB each)
- `design/claude-design-exports/` — full Claude Design export ZIPs (scratch; we mine code out of them)

What ships to users: final code in `src/app/`, video URL pasted into code (video itself hosted on Vercel Blob CDN, not served from the repo), `public/og-image.png`.

Run in Terminal (already done — left here for reference):
```bash
mkdir -p "/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/inspiration-capture"
mkdir -p "/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/video-stills"
mkdir -p "/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/video-clips"
mkdir -p "/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/video-final"
mkdir -p "/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/entrance-utensils"
mkdir -p "/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/claude-design-exports"
```

## A-3 — Create Claude Design project `[HUMAN + CLAUDE DESIGN]` (3 min)
- [ ] Go to https://claude.ai/design → "+ New project" → "Other" → type "website" → Create
- [ ] Rename project: **`reveal-landing-v1`**
- [ ] DO NOT connect to any repo
- [ ] Paste project URL into ARTIFACTS table at bottom of this doc

## A-4 — Kick off Track C immediately `[HUMAN]` (1 min)
Video generation has the longest elapsed time — start it NOW so it renders while you do Tracks B, D, E. Go to Track C Step C-1. Once the first Nano Banana prompt is running, come back here and proceed to Track B.

**✓ Track A done when:** all accounts verified, folders exist, Claude Design project created, Track C started.

---

# TRACK B — Inspiration scout (60-90 min, parallel to C/D/E)

> Runs while Track C renders async. **Hard cap 90 min** — stop even if incomplete.

## B-1 — 5 MUST-VIEW sites `[HUMAN]` (25 min)
Open each, scroll slowly, screenshot what stops you. Save to `Restaurant App/design/inspiration-capture/`.
- [ ] https://linear.app — section color morph, text reveals, dashboard tilt, cursor follower
- [ ] https://mercury.com — warm fintech, mini-dashboard cards in hero, count-up stats
- [ ] https://vercel.com — bold type + gradient motion, floating card stack
- [ ] https://rauno.me — extreme motion craft, magnetic buttons, cursor trail, marquee
- [ ] https://thebrowser.company — cinematic entrance, storytelling flow

## B-2 — Restaurant-adjacent sites `[HUMAN]` (15 min)
- [ ] https://bento.com — food photography + modern layout
- [ ] https://sevenrooms.com — restaurant SaaS competitor
- [ ] https://sweetgreen.com — premium food brand restraint

## B-3 — Replay Mojang + Browser Company intros `[HUMAN]` (5 min)
- [ ] Read `design/references/mojang/ANALYSIS.md` — understand the rotation trick before watching
- [ ] `open design/references/mojang/mojang-studios-animation.mp4` — note rotation + resolve (shapes are ALWAYS letters, rotation reveals)
- [ ] thebrowser.company in incognito (forces first-load animation)

## B-4 — Dribbble targeted searches `[HUMAN]` (20 min)
Screenshot 2-3 per search:
- [ ] `fintech landing dark`
- [ ] `restaurant saas landing`
- [ ] `editorial landing page`
- [ ] `hero stat card`

## B-5 — STOP `[HUMAN]` (at 60-90 min mark)
- [ ] Count screenshots — should have 10-15 total
- [ ] Pick your top 3 motion patterns you love — write here:
  1. **PATTERN 1: ____**
  2. **PATTERN 2: ____**
  3. **PATTERN 3: ____**

**✓ Track B done when:** 10-15 screenshots saved, 3 patterns picked. These inform Track F Steps F-16 (motion signature choice).

---

# TRACK C — Video generation (3-4 hr elapsed, 1.5 hr active, parallel to B/D/E)

> Start this as early as possible in the day. Renders happen async while you do other tracks.

## C-1 — Generate 7 B&W long-exposure kitchen stills in Nano Banana `[HUMAN]` (50 min active)
Go to https://aistudio.google.com. Model: Gemini with image gen / Nano Banana 2. Aspect: 16:9. Quality: max.

**Key principle (v4):** bake long-exposure 1/4 second shutter motion blur INTO the still itself. Higgsfield can't invent streak from a clean photo — the still is the ceiling. Every prompt below has painterly motion-blur streaks in the surround and the hero crisp in center frame. Scene 1 gets two still variants (1a side-angle, 1b top-down overhead) since we animate both as intercut coverage.

Paste each prompt, save best result to `design/video-stills/` as `scene-1a-wok.png`, `scene-1b-wok.png`, and `scene-2.png` through `scene-6.png`. Expect 2-3 regens per scene.

**Watermark note:** if Gemini adds a "Gemini" watermark, crop it out in Preview (Cmd+K → crop) before using. Watermarks usually sit in a corner; the 16:9 still has tolerance for a small crop without losing composition.

**Prompt 1a — Wok fire, side angle** (`scene-1a-wok.png`):
```
Long-exposure photograph of a wok on a restaurant stove, captured with 1/4 second shutter — flames streak and smear in painterly light trails around the pan rim, thick smoke streaks upward in motion-blurred wisps, a silhouetted cook's arm streaks past the left edge of frame as a long blurred smear (no face, zero facial detail, only a blurred black silhouette). The wok and the diced food inside it stay crisp in sharp focus in center frame, sharply rendered against the streaked fire and smoke. Black and white 35mm film, extreme high contrast, deep blacks, fine film grain, shallow depth of field, moody kitchen lighting, 16:9, photorealistic, documentary cinematography style.
```

**Prompt 1b — Wok fire, top-down overhead POV** (`scene-1b-wok.png`):
```
Overhead top-down long-exposure photograph looking straight down into a wok on a restaurant stove, captured with 1/4 second shutter — flames streak and smear in painterly light trails curling up around the pan rim, thick smoke streaks across frame in motion-blurred wisps, a silhouetted cook's hand and forearm streak past the edge of frame as a long blurred smear (no face visible, zero facial detail, only a blurred black silhouette). The wok and the diced food and meat inside it stay crisp in sharp focus in center frame, sharply rendered against the streaked fire and smoke. Black and white 35mm film, extreme high contrast, deep blacks, fine film grain, overhead top-down angle, moody kitchen lighting, 16:9, photorealistic, documentary cinematography style.
```

**Prompt 2 — Hands plating** (`scene-2.png`):
```
Overhead long-exposure photograph captured with 1/4 second shutter of chef's hands placing microgreens on a plated dish, restaurant fine dining presentation — the hands streak in painterly motion trails as they move, the plate and food stay crisp in sharp focus in center frame, streaked steam and blurred activity at the edges of frame (no crisp faces anywhere, only blurred silhouettes past recognition), black and white, high contrast, dramatic rim light from above, 35mm film grain, shallow depth of field, 16:9, photorealistic, documentary style
```

**Prompt 3 — Service ticket** (`scene-3.png`):
```
Long-exposure photograph captured with 1/4 second shutter of a paper order ticket pinned on a rail at a restaurant service window — the ticket itself held crisp in sharp focus in center frame, painterly motion-blurred streaks of blurred kitchen activity and rushing silhouetted cooks in the background (no crisp faces, all smeared past recognition in long-exposure trails), streaking steam, black and white, high contrast, film grain, cinematic, 16:9, photorealistic
```

**Prompt 4 — Waiter through door** (`scene-4.png`):
```
Long-exposure photograph captured with 1/4 second shutter, behind-the-back shot of a restaurant server pushing through a swinging kitchen door carrying a tray of plated dishes — the tray and dishes held crisp in sharp focus in center frame, painterly motion-blurred streaks surrounding (door frame smeared, blurred diners at tables in the background smeared past recognition, streaking light trails from the dining room), dramatic backlight from dining room, no crisp faces anywhere, black and white, high contrast, cinematic, 16:9, photorealistic, film grain
```

**Prompt 5 — Line cook** (`scene-5.png`):
```
Long-exposure photograph captured with 1/4 second shutter, side profile of a line cook working three stove burners at once, fully backlit so the cook is rendered as a pure black silhouette with ZERO facial detail visible (no eyes, nose, mouth, or skin tone — completely featureless outline against the fire), tall flames streaking and smearing in painterly light trails, thick smoke streaks upward in motion-blurred wisps, steam streaking across frame, black and white, extreme high contrast, film grain, cinematic kitchen photography, 16:9, photorealistic
```

**Prompt 6 — Dish on pass, motion-blurred closer** (`scene-6.png`):
```
Long-exposure photograph captured with 1/4 second shutter, a plated dish at a restaurant service pass under a warming lamp, a waiter's hand and arm sweeping through frame lifting the plate — heavy natural long-exposure motion blur on the hand and arm in painterly streaks, the dish and pass surface held crisp in sharp focus before the lift begins, long-exposure steam streaking across the scene in light trails, dreamy cinematic atmosphere, soft contrast (not harsh), diffused warm top light, black and white, fine 35mm film grain, shallow depth of field, moody tonal gradation, 16:9, photorealistic, atmospheric closing frame
```

Reject stills with weird hands, melting fingers, impossible geometry, or insufficient motion-blur streak in the surround. Regenerate.

## C-2 — Queue 8 Higgsfield animations `[HUMAN]` (25 min active)
Go to https://higgsfield.ai. Upload each still, set preset, submit. Scenes 1 and 2 have two angles each (a/b) — we use both as intercut coverage in the edit.

| Scene | Still | Higgsfield preset | Duration |
|---|---|---|---|
| 1a | scene-1a-wok | Slow Dolly In | 3s |
| 1b | scene-1b-wok | Static + Subtle Push | 2.5s |
| 2a | scene-2a-plating | Overhead Static + Slight Zoom | 2.5s |
| 2b | scene-2b-plating | Focus Pull | 2.5s |
| 3 | scene-3-ticket | Focus Pull | 2.5s |
| 4 | scene-4-waiter | Follow / Tracking | 4s |
| 5 | scene-5-line-cook | Slow Pan Left | 3s |
| 6 | scene-6-closer | Slow Pull Back (subtle, let the motion blur breathe) | 3s |

Append to every prompt: `"black and white, film grain, cinematic, no text overlay, no camera shake"`. For scene-6 specifically: `"preserve natural motion blur, soft contrast, dreamy atmosphere, no sharpening"` (the closer should stay hazy, not crisp).

## C-2.5 — First-render quality checkpoint `[HUMAN]` (5 min, when first clip completes)
**Why:** Don't wait for all 6 renders to discover they all look cheap. Judge after the first.

- [ ] Refresh Higgsfield dashboard periodically
- [ ] When the first clip finishes (usually scene 1 wok fire), watch it
- [ ] Quality verdict: does this look cinematic enough to ship, or does it look AI-generated/glitchy?
- [ ] If usable: continue with all 6
- [ ] If unusable (hands morphing, unnatural motion, low fidelity): STOP the other 5 renders. Options: (a) regenerate the same scene with tweaked prompt, (b) fall back to Pexels stock B&W footage search (`pexels.com`, search "chef cooking black and white", "restaurant kitchen slow motion"), (c) commit to slip deadline and reshoot prompts until quality hits.

Write verdict here: **HIGGSFIELD QUALITY: ____** (ship / regenerate / pivot to Pexels)

## C-3 — `[WAIT]` for remaining renders (1-2 hr elapsed)
Do Tracks B, D, E during this time. Come back when all 6 clips show "complete" in Higgsfield dashboard.

Download all 8 as MP4 to `design/video-clips/` using matching names: `clip-1a.mp4`, `clip-1b.mp4`, `clip-2a.mp4`, `clip-2b.mp4`, `clip-3.mp4`, `clip-4.mp4`, `clip-5.mp4`, `clip-6.mp4`.

## C-4 — Edit cut in CapCut `[HUMAN]` (45 min)

**Design principle:** This is a seamless-loop B&W kitchen montage, not a continuous scene. Cuts are intentional (Chef's Table aesthetic). Rhythm and consistent grade are what make it feel like one film roll.

### Timeline order (energy-paced)
HOT-HOT-HOT → soft-soft-soft → MOTION-out. Approx 18.5s total.

clip-1a (2.5s) → clip-1b (2s) → clip-5 (2.5s) → clip-2a (2s) → clip-2b (2s) → clip-3 (2s) → clip-4 (3s) → clip-6 (2.5s)

### Transition treatment (per cut)
- **1a → 1b:** **hard match-cut** on peak of the toss. Food airborne in both. 0.1s crossfade max. Feels like same moment, new angle.
- **1b → 5:** 0.3s crossfade on flames/smoke texture
- **5 → 2a:** hard cut — energy release from flames peaking → hand descending. 0.2s crossfade
- **2a → 2b:** match-cut on plating hand motion. 0.2s crossfade
- **2b → 3:** 0.3s crossfade on focus-rack tone
- **3 → 4:** **whip-blur wipe** (CapCut: "Blur" transition 0.3s) — nods to the Mojang entrance aesthetic
- **4 → 6:** waiter exits frame left → hand enters 6 from left. Direction match. 0.2s crossfade

### Loop seam bookends (CRITICAL for site embed)
The video will HTML5-loop on the landing page. The last-frame → first-frame seam must be invisible.
- [ ] **Last 0.3s of clip 6: fade to black**
- [ ] **First 0.3s of clip 1a: fade in from black**
- [ ] Black → black at the loop seam = invisible cut, reads as a breath

### Consistent grade (the single biggest seamlessness lever)
- [ ] Add one **adjustment layer** above all 8 clips
- [ ] Crush the blacks (shadows down ~15–20%)
- [ ] Lift shadows slightly for contrast detail
- [ ] Subtle vignette (~20% edge darken)
- [ ] Apply film grain to the adjustment layer (NOT per-clip) so grain density is identical everywhere
- [ ] Speed-ramp ease-in/out (15%) on the start/end of energetic clips (1a, 1b, 4, 5) to mask Seedance first/last-frame artifacts

### Audio
- [ ] **Silent for final export** — mute all tracks
- [ ] (Optional working step: add a low kitchen-ambience bed while editing to feel the rhythm, then mute before export. freesound.org "kitchen ambience" works.)

### Loop test BEFORE export
- [ ] Preview the timeline on loop 4+ cycles in CapCut
- [ ] If the seam is visible, bump fade-to-black / fade-in lengths to 0.5s each side
- [ ] If too pause-y, drop to 0.2s

### Export
- [ ] **H.264 MP4, 1080p, 24fps, target 5–8MB, silent**
- [ ] Save as `design/video-final/intermission.mp4`

### Final loop-in-browser test
- [ ] Open the exported MP4 in Chrome: drag file into a blank tab
- [ ] Right-click video → Loop
- [ ] Watch 4+ cycles. Seam must be invisible. If not, return to CapCut and widen the black-fade bookends.

**Export a poster frame too:**
- [ ] At timeline position 1s, export single frame as `design/video-final/intermission-poster.jpg` (1920x1080, JPEG 85%). This is the fallback image shown before video loads.

### HTML embed requirements (for Track F/G reference)
When wiring the video into the landing page (Track F hero/intermission component), the `<video>` element MUST include ALL of these attributes or autoplay/loop will fail on iOS:
```html
<video autoplay loop muted playsinline poster="/intermission-poster.jpg">
  <source src="{VERCEL_BLOB_URL}" type="video/mp4" />
</video>
```
- `autoplay` + `muted` = required pair for autoplay to fire in Chrome/Safari
- `playsinline` = required on iOS Safari, otherwise video forces fullscreen
- `loop` = native loop, no JS needed
- `poster` = fallback image shown before video loads

## C-5 — Upload to Vercel Blob `[HUMAN]` (10 min)
Option A — dashboard:
- [ ] Vercel dashboard → `reveallabs-site` project → Storage → Blob → Upload `intermission.mp4`
- [ ] Upload `intermission-poster.jpg` too
- [ ] Copy both public URLs

Option B — CLI:
- [ ] `cd "/Users/kase/Desktop/Reveal LLC/reveallabs-site"`
- [ ] `vercel blob put design/video-final/intermission.mp4 --public`
- [ ] `vercel blob put design/video-final/intermission-poster.jpg --public`

Paste both URLs into ARTIFACTS table:
- Video URL: https://mrlkjxt3lsgrbzoh.public.blob.vercel-storage.com/intermission.mp4
- Poster URL: https://mrlkjxt3lsgrbzoh.public.blob.vercel-storage.com/intermission-poster.jpg

- [x] Uploaded 2026-04-20 — both return HTTP 200 with `accept-ranges: bytes` and `access-control-allow-origin: *`.
- Store: `reveal-blob-main` (store_mRLkJxt3LSGRbzoH), linked to all three envs, only store remaining on the project.

**✓ Track C done when:** Both URLs saved in ARTIFACTS and video plays from URL.

---

# TRACK D — Entrance assets (5 min - 1.5 hr, parallel to B/C/E)

## D-1 — Pick path `[HUMAN]` (2 min)

**Path A — Lucide icons in code (5 min total, safe):**
- No external generation
- Use Lucide `Flame`, `UtensilsCrossed`, `ChefHat`, etc.
- Consistent look, flat style

**Path B — Nano Banana custom illustrations (1.5 hr, premium):**
- 7 custom utensil PNGs
- More distinctive

**Decision logged here: PATH = A (Lucide icons in code)** — chosen 2026-04-19 for Monday ship-safety + Nano Banana credit conservation. Track F-11 will reference Lucide icons for the utensil→"reveal." entrance animation.

If Path A → skip to D-3.
If Path B → do D-2.

## D-2 — Nano Banana 7 utensil illustrations `[HUMAN]` (PATH B only, 1.5 hr)
Base prompt (swap `[UTENSIL]`):
```
Minimal black ink illustration of a [UTENSIL], flat monochrome style, geometric, Space Grotesk-adjacent aesthetic, transparent background (white), 1:1 aspect ratio, clean stroke weight, no shading, no text, simple, iconic
```

Generate:
1. `chef's knife` → save as `utensil-1.png` (letter r)
2. `spoon with handle pointing down` → `utensil-2.png` (letter e)
3. `crossed forks forming an X` → `utensil-3.png` (letter v)
4. `small skillet with handle pointing right` → `utensil-4.png` (letter e)
5. `whisk with handle pointing up` → `utensil-5.png` (letter a)
6. `rolling pin standing vertically` → `utensil-6.png` (letter l)
7. `small flame, hunter green color` → `utensil-7.png` (period)

Save to `design/entrance-utensils/`.

## D-3 — Document asset choice `[HUMAN]` (1 min)
- [ ] Write in ARTIFACTS table: "Entrance assets: Path A (Lucide)" OR "Path B (custom Nano Banana at design/entrance-utensils/)"

**✓ Track D done when:** assets decided + ready for Claude Design.

---

# TRACK E — Repo prep (30-45 min, parallel to B/C/D)

> This is everything the reveallabs-site repo needs BEFORE the Claude Design output drops in. Do it while video renders.

Open a Cursor session at `/Users/kase/Desktop/Reveal LLC/reveallabs-site`. Start a fresh Claude Code chat.

## E-1 — Delete Next.js starter assets `[CLAUDE CODE]` (5 min)
Tell Claude Code:
> "Delete these default Next.js starter files from `reveallabs-site`:
> - `public/file.svg`
> - `public/globe.svg`
> - `public/next.svg`
> - `public/vercel.svg`
> - `public/window.svg`
> - Replace the content of `src/app/page.tsx` with an empty functional component (just returns `null` for now)."

Verify with:
```bash
ls "/Users/kase/Desktop/Reveal LLC/reveallabs-site/public/"
```
Only `favicon.ico` should remain (will replace in E-4).

## E-2 — Set up typography + layout `[CLAUDE CODE]` (10 min)
Tell Claude Code:
> "Replace `src/app/layout.tsx` with the moodboard-aligned version. Use `next/font/google` to load Space Grotesk (weights 300, 400, 500, 600, 700) and Space Mono (weights 400, 700). Set CSS variables `--font-space-grotesk` and `--font-space-mono`. Set metadata:
> - title: 'reveal. — We find the money your restaurant is leaving on the table'
> - description: 'Revenue intelligence for independent restaurants. We analyze your POS data and deliver 2-3 specific actions that grow revenue in 30 days.'
> - openGraph: { title, description, images: ['/og-image.png'], url: 'https://www.reveallabs.co', type: 'website', siteName: 'reveal.' }
> - twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] }
>
> Base the structure on `/Users/kase/Desktop/Reveal LLC/Restaurant App/landing/app/layout.tsx` but we'll add NavBar only after we migrate it. For now, layout just renders `{children}` inside a body with the font variables applied."

## E-3 — Replace globals.css with moodboard tokens `[CLAUDE CODE]` (10 min)
Tell Claude Code:
> "Overwrite `src/app/globals.css` with the moodboard token system. Copy and adapt from `/Users/kase/Desktop/Reveal LLC/Restaurant App/landing/app/globals.css`. Use Tailwind v4 `@theme inline` syntax. Include all these tokens:
> - --color-cream: #F2F1ED
> - --color-cream-lifted: #FCFBFA
> - --color-charcoal: #2E2E2E
> - --color-charcoal-soft: #3D3D3D
> - --color-muted: #797979
> - --color-light: #B5AFA6
> - --color-border: rgba(46, 46, 46, 0.1)
> - Green scale 50-900 as in landing/app/globals.css
> - --color-error, --color-warning, --color-info
> - --font-sans: var(--font-space-grotesk)
> - --font-mono: var(--font-space-mono)
>
> Body background: #F2F1ED, color: #2E2E2E, font-family Space Grotesk.
> Add `prefers-reduced-motion` global override (no animations, no scroll-behavior).
> Add `::selection { background: #355E3B; color: #F2F1ED }` and `:focus-visible { outline: 2px solid #355E3B; outline-offset: 2px }`.
> Add `p { max-width: 65ch }` for reading comfort.
> Add `h1, h2, h3 { letter-spacing: -0.03em; line-height: 1.05; text-wrap: balance }`."

## E-4 — Create branded favicon `[CLAUDE CODE]` (5 min)
Tell Claude Code:
> "Create a branded favicon for reveal. Generate a 512x512 SVG and then derive favicon.ico + apple-touch-icon.png + favicon-16.png + favicon-32.png from it.
>
> Design: Cream (#F2F1ED) background, charcoal (#2E2E2E) 'r' letter in Space Grotesk 700 (or closest available), green-700 (#355E3B) period dot to the right of the 'r'. Like 'r.' as a minimal brand mark.
>
> Save SVG source to `public/icon.svg`. Replace `src/app/favicon.ico` with the derived ico (convert via ImageMagick if available: `magick public/icon.svg -define icon:auto-resize=16,32,48,64 src/app/favicon.ico`). Save `public/apple-touch-icon.png` (180x180). Update metadata in layout.tsx to reference these."

If ImageMagick isn't installed, fallback: use https://favicon.io/ or temporarily keep default favicon (not a Monday blocker).

## E-5 — Install dependencies `[CLAUDE CODE]` (3 min)
Tell Claude Code:
> "In `reveallabs-site`, install dependencies we'll need:
> ```
> pnpm add framer-motion @vercel/analytics
> pnpm add -D @types/node
> ```
> Update package.json as needed."

## E-6 — Add Vercel Analytics `[CLAUDE CODE]` (3 min)
Tell Claude Code:
> "In `src/app/layout.tsx`, import `Analytics` from `@vercel/analytics/next` and render `<Analytics />` inside the body, after `{children}`."

## E-7 — Create /privacy stub `[CLAUDE CODE]` (5 min)
Tell Claude Code:
> "Create `src/app/privacy/page.tsx` — a minimal privacy page. Content:
>
> h1: 'Privacy'
>
> p: 'reveal. is a revenue-intelligence tool for restaurants. At this stage (April 2026) we collect no data beyond what you explicitly send us by email. If you click "Join the waitlist," we receive your email address and subject line only. We do not use trackers, cookies, or analytics on your identity. We use Vercel Analytics for aggregate traffic metrics (page views, referrer, country — no personal data).'
>
> p: 'Questions: chayadol@reveallabs.co.'
>
> Style: same cream canvas, Space Grotesk body, 'reveal.' wordmark nav at top (simple, no motion), back-to-home link at bottom. Match the moodboard tokens from globals.css. Page max-width 640px, generous padding."

## E-8 — Create robots.txt + sitemap `[CLAUDE CODE]` (3 min)
Tell Claude Code:
> "Create `src/app/robots.ts` (Next.js metadata API):
> ```ts
> import type { MetadataRoute } from 'next'
> export default function robots(): MetadataRoute.Robots {
>   return {
>     rules: { userAgent: '*', allow: '/' },
>     sitemap: 'https://www.reveallabs.co/sitemap.xml',
>   }
> }
> ```
>
> Create `src/app/sitemap.ts`:
> ```ts
> import type { MetadataRoute } from 'next'
> export default function sitemap(): MetadataRoute.Sitemap {
>   return [
>     { url: 'https://www.reveallabs.co', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
>     { url: 'https://www.reveallabs.co/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
>   ]
> }
> ```"

## E-9 — Commit repo prep `[HUMAN]` (2 min)
- [ ] From Terminal: `cd "/Users/kase/Desktop/Reveal LLC/reveallabs-site"`
- [ ] `git checkout -b landing-v1`
- [ ] `git add -A && git commit -m "chore: repo prep — tokens, fonts, analytics, privacy, robots, sitemap"`
- [ ] Do NOT push yet. Local commit only.

**✓ Track E done when:** Starter artifacts gone, typography + tokens + analytics + privacy + robots + sitemap in place, local dev runs without errors (`pnpm dev` → http://localhost:3000 shows blank cream page with reveal. title).

---

# TRACK F — Claude Design build (4-6 hr active, after B/C/D done)

> Don't start F until B is done (need inspiration refs), C is done (need video URL), D is done (need entrance assets). E can be in progress concurrent with F — no dependency.

## ⚠️ SCOPE — build TWO variants, then A/B to pick the winner

We're building **both** page shapes in Claude Design and comparing at F-17:

### Variant A — Teaser page (recommended default)

**Job:** Show what reveal. is at a high level. Feel aesthetic. Capture an email.

**Structure (5 sections max):**
1. Hero — brand mark (reveal.) + tagline + waitlist CTA
2. B&W kitchen intermission video (loops)
3. One big number (e.g., `$4,032/mo` found) + one line
4. Final CTA — waitlist
5. Footer (privacy link, contact email)

**NOT in teaser scope:**
- Sign-up flow, account creation, pricing
- Feature grid, integration list, testimonials
- Dashboard screenshots, product walkthroughs
- Deep FAQ (more than 3 questions)
- Pilot offer detail

**Reference:** Arc Browser pre-launch, Figma beta page, Airbnb's early teaser.

### Variant B — Full-page (also build)

**Job:** More traditional SaaS landing — still owner-friendly in tone/copy, but includes pilot offer, deeper FAQ, slightly more product surface.

**Structure (8-ish sections):**
1. Hero + waitlist CTA
2. B&W video intermission
3. Stat block
4. Pilot offer section (F-12)
5. FAQ (F-13 full — 6+ questions)
6. Final CTA
7. Footer

### How we decide
At **F-17**, view both versions side-by-side. Ask: which one feels like it was built for a restaurant owner who doesn't have time for a pitch deck? That's the winner. The other gets archived to `design/claude-design-exports/` as a reference.

**Across BOTH variants:** the minimal-aesthetic / copy-light / imagery-forward design principle (below) applies to every section. The teaser is minimal-by-structure; the full-page is minimal-by-craft-within-more-structure.

## ⚠️ DESIGN PRINCIPLE — read this before every F step

**Audience = independent restaurant owners, not tech buyers.** They are operations people under time pressure. They scan, they don't read. A dense SaaS-style page (Linear, Vercel, Stripe) reads as "this isn't for me" and they bounce.

The page must be:
- **Minimal aesthetic** — generous whitespace, few elements per screen, no busy dashboards or dense feature grids
- **Imagery-forward** — B&W kitchen intermission + hero photography do the emotional work, not paragraphs
- **Copy-light** — every block has to earn its word count

**Emulate:** Sweetgreen, premium restaurant/food brands with confident restraint.
**Do NOT emulate:** Mercury (too many cards), Linear (too dense), any feature-grid SaaS page.

### Hard rules for every section
- Headlines ≤ 5 words when possible
- Paragraphs ≤ 2 short sentences. If it's longer, cut.
- Numbers (`$4,032/mo leakage`, `+4.2% lift`, `3 actions/mo`) are **big-type visual heroes**, not buried in prose
- **No jargon:** ban "revenue intelligence", "POS analytics", "data pipeline", "ML-powered". Say what it does in owner language: "find money you're losing", "2-3 specific moves per month"
- FAQ: max 6 questions, one-line answers preferred
- When choosing between two variants in F-6, F-10, F-18: pick the one with **less on screen**

## F-0 — Read reference materials `[HUMAN]` (15 min) — DO NOT SKIP
Before touching Claude Design, internalize these so your prompts and iteration are informed:

- [ ] Read `design/references/viktor-oddy/WORKFLOW.md` — the section-by-section pattern we follow
- [ ] Read `design/references/claude-design-guide.md` — credit management, export formats, lockout risk. Especially the "Critical limitation: credit lockouts" section — PCWorld got locked out in 30 min.
- [ ] Read `design/references/mojang/ANALYSIS.md` — understand the rotation trick before writing the F-11 entrance prompt
- [ ] Skim `design/references/viktor-oddy/transcript.txt` if you want the raw tutorial (otherwise WORKFLOW.md is enough)

**Claude Code session note:** If you're a fresh Claude Code session picking this up, read all three docs before writing any Claude Design prompts. These shape how we compose the page.

## F-1 — Paste master design system `[CLAUDE DESIGN]` (10 min per variant)

Create **two** Claude Design projects and paste the block below into each:
1. `reveal-landing-v1-teaser` (VARIANT A)
2. `reveal-landing-v1-full` (VARIANT B)

The F-1 block is identical for both — it sets up the shared design system, voice, and a blank frame. Variants diverge starting at F-2.

Paste-block (identical for both projects):

```
Build a landing page for "reveal." — a product that helps INDEPENDENT
RESTAURANT OWNERS find money they're leaving on the table. It reads their
POS data and delivers 2-3 specific revenue moves each month.

AUDIENCE CONSTRAINT (critical):
- Restaurant owners, NOT tech buyers. They scan, don't read.
- This is a brand TEASER page. Only CTA is email waitlist.
- NO signup flow, NO pricing, NO feature grid, NO dashboard screenshots,
  NO ML/AI jargon, NO "revenue intelligence" speak. Plain owner language.
- Reference aesthetic: Sweetgreen, Arc Browser pre-launch, Figma beta page.
- Anti-reference: Linear, Vercel, Stripe, Mercury. Avoid feature-dense SaaS.

COPY RULES:
- Headlines ≤ 5 words. Paragraphs ≤ 2 short sentences. If longer, cut.
- Numbers (e.g. $4,032/mo) are big-type visual heroes, not buried in prose.
- When choosing between two variants, pick the one with LESS on screen.

LOCKED DESIGN SYSTEM (use these exact values):

Colors:
- --cream: #F2F1ED (primary canvas — NOT white)
- --cream-lifted: #FCFBFA (surface/card)
- --charcoal: #2E2E2E (primary text)
- --charcoal-soft: #3D3D3D (hover)
- --muted: #797979 (secondary text)
- --light: #B5AFA6 (tertiary)
- --stroke: rgba(46, 46, 46, 0.1) (borders — called "stroke" not "border")
- --green-700: #355E3B (PRIMARY ACCENT — hunter green)
- --green-600: #4A7A52 (hover)
- --green-800: #2A4B30 (pressed)
- --green-100: #E8F0E9 (tag bg)
- --green-50: #F3F8F4 (stat card bg)
- --green-400: #8BAF8F (eyebrows on dark bg)

Typography:
- Display: Space Grotesk weights 400/500/700 (already loaded)
- Mono: Space Mono 400/700 (ONLY for data, eyebrows, monospace moments)
- H1: 72px, weight 700, tracking -3.5px, line-height 1.0
- H2: 44px, weight 600, tracking -1.5px, line-height 1.05
- Body: 16px, weight 400, line-height 1.65
- Eyebrow: Space Mono 500, 11px, tracking 3px, UPPERCASE, green-700

Buttons:
- Pill shape (999px radius), Space Grotesk 500, tracking -0.3px, active scale(0.98)
- Primary: green-700 bg, cream text, green-600 hover
- Secondary: charcoal bg, cream text
- Ghost: transparent, green-700 text + 1px green-700 bottom border

Cards:
- Border-radius 12-16px, 1px --stroke, --cream-lifted bg
- Hover: translateY(-4px) + soft shadow

Brand principles:
1. One font family (Space Grotesk), many weights
2. Cream canvas (NOT white — warmth matters)
3. Hunter green = growth signal
4. Space Mono ONLY for data
5. No emojis, no gradients on text/buttons, no purple/blue
6. Generous whitespace. text-wrap: balance on headings.

Content anchors (we'll iterate copy — these are starting points):
- Brand mark: "reveal." (charcoal "reveal" + green-700 period)
- Short headline options (pick ONE ≤5 words):
    "Find money you're losing."
    "Your POS already knows."
    "We find the money."
- Product one-liner: "We read your POS data and show you where the money is."
- Primary CTA: "Join the waitlist"
    → mailto:chayadol@reveallabs.co?subject=Join%20the%20reveal.%20waitlist
- Proof stat: "$4,032/mo — found at our lab restaurant (Tuk Tuk Thai Grill)"
- Secondary stats available: $1,920 recoverable this month · 3 actions/mo · +4.2% lift
- Trust line: "Works with Clover · Toast · Square"

STEP 1 (do this NOW): set up the page frame ONLY —
- Cream bg (#F2F1ED)
- Space Grotesk loaded
- All tokens above defined as CSS variables
- Top-left wordmark: "reveal." (Space Grotesk 700, charcoal "reveal", green-700 period)
- No hero, no sections, no content yet
- Just the frame. Confirm the frame looks right before I hand you the hero.
```

- [ ] Upload moodboard HTML file as reference attachment to BOTH projects: `/Users/kase/Desktop/Reveal LLC/Restaurant App/FrontEnd/moodboard-v2.0.html`
- [ ] Verify: each project shows cream canvas with "reveal." wordmark top-left.
- [ ] Log both project URLs in the ARTIFACTS table at the bottom of this doc.

## F-2 — Hero for each variant `[CLAUDE DESIGN]` (20 min per variant)

Two different paste blocks. The teaser hero is typography-only, ultra-minimal. The full hero is 55/45 asymmetric with a stat card on the right.

### F-2a — TEASER hero (paste into `reveal-landing-v1-teaser`)

```
Build the hero section. Typography-only, extreme restraint.

Top nav (horizontal, 24px top/side padding, max-width 1200px):
- Left: "reveal." wordmark (already in place from F-1)
- Right: pill CTA "Join the waitlist" (green-700 bg, cream text, pill 999px)
  → mailto:chayadol@reveallabs.co?subject=Join%20the%20reveal.%20waitlist

Hero block — vertically centered in the viewport, 120px top/bottom padding:
- H1 (72px, weight 700, tracking -3.5px, line-height 1.0, max-width 800px, centered):
    "Find the money you're losing."
- Subhead (20px, weight 400, color --muted, max-width 540px, centered, mt 24px):
    "We read your POS data. You get 2-3 moves per month."
- CTA (mt 40px, centered):
    Primary pill only — "Join the waitlist" (same mailto).
    NO secondary button. NO ghost link.

Below hero = empty whitespace (the video section will drop here next).

STRICT RULES:
- No eyebrow. No trust line. No stat card. No secondary CTA.
- Generous whitespace. The hero should feel like it has space to breathe.
- This is a teaser. If you feel tempted to add more, DON'T.
```

- [ ] Iterate in Claude Design with inline comments if the balance feels off
- [ ] Screenshot when good → `design/inspiration-capture/v1-hero-teaser.png`

### F-2b — FULL hero (paste into `reveal-landing-v1-full`)

```
Build the hero section. 55/45 asymmetric layout, left text + right stat card.

Top nav (horizontal, 24px top/side padding, max-width 1200px):
- Left: "reveal." wordmark (already in place from F-1)
- Right: text link "Log in" (color --muted, hover --charcoal) + pill CTA
  "Join the waitlist" (green-700 bg, cream text, pill 999px)
  → mailto:chayadol@reveallabs.co?subject=Join%20the%20reveal.%20waitlist

Hero block — max-width 1200px, 80px top / 100px bottom padding, 60px gap between columns:

LEFT (55%, left-aligned):
- Eyebrow (Space Mono 500, 11px, tracking 3px, UPPERCASE, color green-700):
    "FOR INDEPENDENT RESTAURANTS"
- H1 (64px, weight 700, tracking -2.5px, line-height 1.02, max-width 540px, mt 20px):
    "We find the money."
- Subhead (18px, weight 400, color --muted, max-width 460px, line-height 1.6, mt 20px):
    "Your POS data has the answers. We show you where the gaps are,
     then give you 2-3 specific moves every month to grow revenue."
- CTA row (mt 32px, gap 16px):
    Primary pill "Join the waitlist" +
    Ghost link "See how it works ↓" (scrolls to video section below)
- Trust line (mt 28px, Space Mono 400, 11px, tracking 2px, UPPERCASE, color --light):
    "CLOVER · TOAST · SQUARE"

RIGHT (45%) — mini stat card:
- Card: bg --cream-lifted, radius 16px, 1px --stroke, padding 32px
- Top eyebrow (Space Mono 500, 10px, tracking 3px, UPPERCASE, color green-700):
    "LAB RESTAURANT — APRIL 2026"
- Restaurant name (Space Grotesk 600, 22px, color --charcoal, mt 8px):
    "Tuk Tuk Thai Grill"
- Horizontal divider (1px --stroke, my 20px)
- 2×2 stat grid (gap 12px between cells). Each cell:
    bg --green-50, radius 10px, 1px --stroke, padding 20px
    Value (Space Grotesk 700, 32px, tracking -1px, color green-700)
    Label below (Space Mono 400, 10px, tracking 2px, UPPERCASE, color --muted, mt 8px)
    Cell 1 — "$4,032"  / "FOUND THIS MONTH"
    Cell 2 — "$1,920"  / "RECOVERABLE NOW"
    Cell 3 — "3"       / "SPECIFIC ACTIONS"
    Cell 4 — "+4.2%"   / "PROJECTED LIFT"

Keep the stat card visually clean. The numbers are the hero; labels stay small and quiet.
```

- [ ] Iterate in Claude Design
- [ ] Screenshot when good → `design/inspiration-capture/v1-hero-full.png`

## F-3 — Duplicate project for hero B `[CLAUDE DESIGN]` (3 min)
- [ ] Duplicate project → name `reveal-landing-v1-hero-B`
- [ ] Save new URL to ARTIFACTS

## F-4 — Hero variant B: asymmetric with stat card `[CLAUDE DESIGN]` (30 min)
In the duplicate project, paste:
```
Rebuild hero with ASYMMETRIC 55/45 layout (replace centered hero).

LEFT (55%, left-aligned):
- Same eyebrow, H1, subhead, CTA row, trust line as before
- Max-width of subhead: 480px

RIGHT (45%) — Mini-dashboard stat card:
- Background: cream-lifted, radius 16px, 1px --border, padding 32px
- Top: eyebrow (Space Mono, green-700, 10px, 3px tracking, uppercase): "OUR LAB RESTAURANT — APR 2026"
- Restaurant name (Space Grotesk 600, 20px, charcoal): "Tuk Tuk Thai Grill"
- Horizontal divider (1px)
- 2x2 stat grid (each stat: green-50 bg, 10px radius, 1px border, padding 16px):
  - $4,032 (Space Grotesk 700, 28px, green-700, tracking -1px) / label "MONTHLY LEAKAGE FOUND"
  - $1,920 / "RECOVERABLE THIS MONTH"
  - 3 / "ACTIONS DELIVERED"
  - +4.2% / "LAST MONTH LIFT"
- Bottom: pill tag (green-100 bg, green-700 text): "Live scan result"

Card subtly floats (vertical 6px, 4s ease-in-out infinite). Numbers count up from 0
to final value when card enters viewport.
```
- [ ] Iterate
- [ ] Screenshot → `design/inspiration-capture/v1-hero-b-asymmetric.png`

## F-5 — Dry-run export test `[CLAUDE DESIGN + HUMAN]` (15 min)
**Before building the full page — verify Claude Design's export format is workable.**
- [ ] In the hero-B project, click Export → React / Next.js
- [ ] Save ZIP to `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/claude-design-exports/dry-run-hero-b/`
- [ ] Unzip, open the exported code in VS Code
- [ ] Assess:
  - Is it valid TSX?
  - Does it use Tailwind classes or inline styles?
  - Does it reference our token names (cream, charcoal, green-700)?
  - Is it a single file or broken into components?
- [ ] Write quality verdict here: **EXPORT QUALITY: ____** (clean / workable / messy)

If `messy`: flag to user, consider switching to "Claude Design as visual spec only" mode (write code from scratch in G phase). Adds ~3-4 hrs to Track G.

## F-6 — Pick hero winner `[HUMAN]` (10 min)
- [ ] Open both screenshots side by side
- [ ] Which reads "credible restaurant SaaS" faster?
- [ ] **HERO WINNER: ____** (A centered / B asymmetric)
- [ ] Close the loser's Claude Design tab. Continue only in the winner's project.

## F-7 — Video intermission section `[CLAUDE DESIGN]` (20 min)

> Variant B (Full) locked. Intermission is the chosen placement. Hero-bg variant (F-9) superseded — it would fight the asymmetric hero + stat card. Video runs as its own cinematic break between hero and pilot section.

Paste-block below is **placeholder-aware**. Real video file isn't ready yet (Higgsfield → CapCut → Vercel Blob). Claude Design renders a charcoal 16:9 rectangle now; Track G swaps in the real `<video>` element with `autoplay loop muted playsInline`.

```
Add a cinematic video intermission section below the hero, above the next section.

SECTION POSITIONING:
- Full viewport width (break out of the 1200px content container — edge-to-edge background)
- Section background: --cream (same as page — creates breathing room, not a visual wall)
- 100px top padding / 100px bottom padding

THE VIDEO BLOCK (centered inside the section):
- 16:9 aspect ratio (use aspect-ratio: 16/9)
- Max-width 1400px (slightly wider than content — cinematic feel)
- Margin-inline auto (centered horizontally with side gutters on large screens)
- Border-radius 16px
- Overflow hidden
- PLACEHOLDER for now: solid bg --charcoal (#2E2E2E), no content inside.
  Use a comment in the code: {/* TRACK G: replace with <video autoplay loop muted playsInline poster="..."> */}

SMALL EYEBROW ABOVE THE VIDEO (centered, mb 32px):
- Space Mono 500, 11px, tracking 3px, UPPERCASE, color --muted
- Text: "INSIDE A WORKING KITCHEN"

NO OTHER TEXT:
- No heading above the video. The eyebrow is enough.
- No caption below. The video's atmosphere is the content.
- No overlay text on the video itself. The B&W footage speaks for itself.
- No "watch this" copy. No play button (it autoplays).

DO NOT ADD:
- Browser chrome mockup or decorative frame
- Multiple video thumbnails
- Captions, subtitles, or text overlays
- Any CTA buttons
- A heading like "See it in action" (too salesy)
```

- [ ] Iterate in Claude Design — if the placeholder charcoal feels too stark, try a subtle grain/noise overlay at ~5% opacity
- [ ] Screenshot → `design/inspiration-capture/v1-video-intermission.png`
- [ ] Once the real video URL lands (post C-5), I'll swap the placeholder for the `<video>` element in Track G

## F-8 — ~~Duplicate for video B~~ **SUPERSEDED** (variant lock)
> Hero-background video variant conflicts with asymmetric stat-card hero. Skip.

## F-9 — ~~Video placement B: hero background~~ **SUPERSEDED** (variant lock)
> Skip. See F-7 note.

## F-10 — ~~Pick video placement~~ **RESOLVED** (variant lock → intermission wins by default)
> Video placement = A (intermission). Logged in DECISION LOG.

## F-11 — Brand entrance animation `[CLAUDE DESIGN]` (45-60 min)
Paste:
```
Add a brand entrance animation that plays on first page load (once per session,
localStorage flag 'reveal_intro_seen=true', skippable via small top-right button,
respects prefers-reduced-motion).

Inspired by Mojang Studios logo (shapes resolving into wordmark).

7 kitchen utensil icons in a centered horizontal row. Icons (from left):
1. Chef's knife
2. Spoon (handle left, bowl right)
3. Crossed forks (X shape)
4. Small skillet (bowl left, handle right)
5. Whisk (teardrop, handle down)
6. Rolling pin (horizontal pill)
7. Flame (green-700 tinted)

[If PATH A from D-1]: use Lucide React icons — Flame, UtensilsCrossed, ChefHat, CookingPot, etc. Closest substitutes for each.
[If PATH B from D-1]: I'll upload 7 PNGs separately — use those as the icon faces.

Sequence (2.5-3s total):

0.0-0.5s: Icons fade in at positions, charcoal color (flame is green-700), size 80x80px, 16px spacing between.

0.5-2.0s: Each card flips rotateY 180deg with 120ms stagger. Back face shows the corresponding letter of "reveal." in Space Grotesk 700, 64px, charcoal (green-700 for period), tracking -3px.
- Position 1 → r
- Position 2 → e
- Position 3 → v
- Position 4 → e
- Position 5 → a
- Position 6 → l
- Position 7 → .

2.0-2.5s: Card backgrounds fade to transparent. Only "reveal." wordmark remains.

2.5-3.0s: Wordmark animates up and left to top-nav position. Page content (hero) fades in behind.

Technical:
- Framer Motion
- perspective(1000px) on container
- transform-style: preserve-3d on cards
- backface-visibility: hidden
- Easing [0.16, 1, 0.3, 1]
- Green-700 4px glow on period (".") on arrival
- Skip button top-right: "Skip intro" text, sets localStorage, ends animation
- prefers-reduced-motion:reduce → skip entirely, hero visible immediately

Test: first-load in incognito = plays, refresh = skipped, clear localStorage = plays again.
```
- [ ] Iterate until crisp (no janky flip, stagger timing right, skip works)
- [ ] Test reduced-motion: Chrome DevTools → Rendering → prefers-reduced-motion: reduce → should skip
- [ ] Screenshot → `design/inspiration-capture/v1-entrance.png`

**Quality bar (per Kase's decision D10):** if entrance looks janky, iterate until clean. Do NOT cut to fallback. Slip deadline if needed.

## F-12 — Pilot offer section (VARIANT B: full-page only) `[CLAUDE DESIGN]` (30 min)
> **Variant A (teaser) SKIPS this section** — skip to F-13.
> **Variant B (full-page)** builds it. When both variants are done (F-17), compare and pick winner.

### Variant B content (original full-page version):
Paste:
```
Build "Pilot Offer" section after video section.

- Eyebrow centered (Space Mono, green-700, 3px tracking, uppercase): "THE PILOT PROGRAM"
- H2 (max-width 700px, centered): "Free for the first 5 restaurants. Then $200/mo. No contracts."
- 3 benefit cards in horizontal row (cream-lifted bg, 12px radius, 1px border, padding 32px, 20px gap):

Each card:
- 28px×3px green-700 accent bar at top, margin-bottom 20px
- h3 (Space Grotesk 600, 18px, tracking -0.3px): title
- p (Space Grotesk 400, 14px, muted, line-height 1.6): body

Card 1: "First scan is free" — "We analyze 90 days of POS data and send results within 48 hours. No credit card needed."
Card 2: "Implementation support" — "We don't just deliver findings — we work with you to implement the top 2-3 actions for 30 days."
Card 3: "Cancel anytime" — "Month-to-month after the pilot. No contracts, no annual commitments. Keep us if it works."

Centered CTA below: primary "Claim my pilot spot" → same mailto as other CTAs.
Section padding: 96px top+bottom, max-width 1200px.
```

## F-13 — FAQ section (BOTH variants, different scope) `[CLAUDE DESIGN]` (15-30 min)

### Variant A (teaser): 3 questions max (15 min)
> Teaser page doesn't need a deep FAQ. Max 3 questions, one-line answers. Cut entirely if the hero + video + stat already answer "what is this".
> Candidate questions (pick 2-3 only): (1) "What is reveal.?" (2) "How much does it cost?" (3) "When can I try it?"

### Variant B (full-page): 6+ questions (30 min)
Paste:
```
Build FAQ section.

- Eyebrow centered: "FREQUENTLY ASKED"
- H2 (centered): "Before we start"
- Accordion items (cream-lifted bg, 1px border, 10px radius, 16px gap between items, padding 20-24px)
- Each item: question row (Space Grotesk 500, 18px, left-aligned) + [+] icon right (rotates to [×] when expanded). Click expands answer (Space Grotesk 400, 15px, muted, line-height 1.6, padding-top 12px, animated height 0.3s)

Questions:
1. Q: "Which POS systems do you support?"
   A: "Clover, Toast, Square, and SpotOn today. More coming. If you use something else, email us — we'll tell you when we support it."
2. Q: "How long until I see results?"
   A: "48 hours for your first scan report. 30 days for the first measurable revenue lift."
3. Q: "Do I have to share all my financial data?"
   A: "Read-only POS access only. We never touch your bank accounts, tax info, or employee records."
4. Q: "What happens after the free pilot?"
   A: "If the revenue we find justifies it, you switch to $200/mo. If it doesn't, you keep the findings and walk. No obligations."
5. Q: "Why free for only 5 restaurants?"
   A: "We're building case studies. Early partners get pricing locked for life and direct access to the founder."
6. Q: "Who built this?"
   A: "Kase Sundarapura. His parents own a Thai restaurant in Lakewood, CO. He built reveal. after seeing the revenue they were losing without knowing it."

Padding: 96px top+bottom, max-width 900px centered.

Accessibility: each accordion item has aria-expanded, aria-controls, keyboard-accessible (Enter/Space to toggle).
```

## F-14 — Final CTA section `[CLAUDE DESIGN]` (15 min)
Paste:
```
Build final CTA section (charcoal contrast block).

- Charcoal (#2E2E2E) background, 20px border-radius, full-bleed with horizontal margins (60px mobile, 100px desktop)
- Vertical padding 96px
- Top-right: green-700 radial glow (circular, 320px diameter, 10% opacity, bleeds off edge)

Content (left-aligned, max-width 600px):
- Eyebrow (Space Mono, green-400 #8BAF8F, 3px tracking, uppercase, 10px): "GET STARTED"
- H2 (Space Grotesk 700, 48px, cream color, tracking -2px, line-height 1.05): "Ready to see what you're missing?"
- p (Space Grotesk 400, 16px, --light, line-height 1.55, max-width 480px): "90 days of POS data. 2-3 specific actions. Measurable results within a month."
- Primary pill button "Join the waitlist" → mailto
- Small text below (13px, --light): "We built this for our parents' restaurant first."

Section vertical margin: 96px top+bottom.
```

## F-15 — Footer `[CLAUDE DESIGN]` (15 min)
Paste:
```
Build footer.

- Top border 1px --border
- Padding 48px 60px
- 2 columns (left 40%, right 60%)

LEFT:
- "reveal." wordmark (24px, charcoal, green-700 period)
- Small text below (Space Mono, 11px, --light, 2px tracking, uppercase): "REVEAL LABS LLC — COLORADO"
- Below (margin-top 16px): tagline (Space Grotesk 400, 13px, muted): "Revenue intelligence for independent restaurants."

RIGHT: 3 sub-columns:
- Col 1 header (Space Mono, 10px, green-700, 3px tracking, uppercase): "PRODUCT"
  Links (Space Grotesk 400, 14px, muted, hover charcoal):
  - How it works (anchor #how-it-works)
  - Pricing (anchor #pricing)
  - Pilot program (anchor #pilot)

- Col 2 "COMPANY":
  - About (anchor #about or link to external bio)
  - Contact → mailto:chayadol@reveallabs.co
  - Privacy → /privacy

- Col 3 "CONNECT":
  - LinkedIn → your LinkedIn URL (placeholder for now)
  - Email → mailto

Bottom row (full width, margin-top 48px, border-top 1px, padding-top 24px):
- Left: "© 2026 Reveal Labs LLC." (12px, --light)
- Right: "Built for restaurant owners who want clarity." (12px, --light)
```

## F-16 — Motion signature `[CLAUDE DESIGN]` (60 min)
Pick ONE motion pattern from your top 3 in B-5. Paste the matching prompt:

**Cursor trail:**
```
Add a custom cursor follower. A small 12px circle, green-700 color, 70% opacity, follows the mouse with 400ms spring lag. Pointer-events: none. Hidden on touch devices (detect via matchMedia hover:none). Hidden when cursor is over text inputs or textareas.
```

**Section color morph:**
```
Add scroll-driven background color morph. Between the video section and the FAQ section, smoothly interpolate body background from cream (#F2F1ED) → charcoal (#2E2E2E) based on scroll position. All text colors invert accordingly (charcoal text → cream, muted → light). Use Framer Motion useScroll + useTransform.
```

**Count-up stats:**
```
When any stat card (hero stat, pilot cards if numbered) enters viewport, animate numbers counting up from 0 to final value over 1.2s ease-out. "$4,032" counts up to 4032 in incremental steps. "+4.2%" from 0 to 4.2. Use Framer Motion useInView + animate values.
```

**Magnetic buttons:**
```
All primary CTA buttons have magnetic hover: when cursor is within 40px, button translates 8-12px toward cursor with spring easing. Release returns to origin. Disabled on touch (matchMedia hover:none).
```

- [ ] Paste chosen prompt, iterate, polish
- [ ] Screenshot → `design/inspiration-capture/v1-motion-signature.png`
- [ ] **MOTION SIGNATURE: ____**

## F-17 — Full page review `[HUMAN + CLAUDE DESIGN]` (30 min)
- [ ] Scroll Claude Design preview top-to-bottom
- [ ] Test mobile view in Claude Design's device preview (iPhone, iPad, desktop)
- [ ] Check: typos, wrong numbers, broken links, missing sections
- [ ] Verify entrance animation plays correctly + skip button works
- [ ] Verify motion signature triggers appropriately
- [ ] Last inline-comment fixes

## F-18 — Export final code `[CLAUDE DESIGN]` (15 min)
- [ ] Click Export → React / Next.js → download ZIP
- [ ] Save to `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/claude-design-exports/reveal-landing-v1-final/`
- [ ] Unzip and inspect

**✓ Track F done when:** Complete page exists in Claude Design, exported code is saved locally.

---

# TRACK G — Export + implement (2-3 hr, after F done)

> Continue in the Cursor session from Track E. Same Claude Code chat OR a fresh one — either works.

## G-1 — Dry-run component migration `[CLAUDE CODE]` (15 min)
**Before bulk port — test one component.**

Tell Claude Code:
> "Migrate ONE scrollytelling component to test Next.js 16 compatibility. Copy `/Users/kase/Desktop/Reveal LLC/Restaurant App/landing/app/components/RawDataWall.tsx` to `src/app/components/RawDataWall.tsx` in reveallabs-site. Adjust imports. Build a temporary page at `src/app/test-component/page.tsx` that imports + renders it. Run `pnpm dev` and confirm it renders without errors in browser at http://localhost:3000/test-component."

- [ ] Verify it renders
- [ ] If errors: Next.js 16 compatibility issue. Tell Claude Code to check `node_modules/next/dist/docs/` for breaking changes. Fix.
- [ ] If OK: delete the `test-component` directory.

## G-2 — Bulk migrate scrollytelling components `[CLAUDE CODE]` (20 min)
Tell Claude Code:
> "Migrate these remaining components from `/Users/kase/Desktop/Reveal LLC/Restaurant App/landing/app/components/` to `reveallabs-site/src/app/components/`:
> - JsonPipeline.tsx
> - AgentSwarm.tsx
> - StrategySynthesis.tsx
> - ActionDeliverable.tsx
> - NavBar.tsx
>
> Apply same compatibility adjustments as in G-1. Import NavBar in `src/app/layout.tsx` (fixed nav at top). Don't yet integrate the others — page.tsx will import them in G-3."

## G-3 — Integrate Claude Design export `[CLAUDE CODE]` (60-90 min)
Tell Claude Code:
> "Integrate the Claude Design export from `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/claude-design-exports/reveal-landing-v1-final/` into `reveallabs-site/src/app/page.tsx`.
>
> Target structure:
> 1. BrandEntrance component (from export) — first-load animation
> 2. Hero section (from export — winner from F-6)
> 3. Video section (from export — winner from F-10)
> 4. Scrollytelling section — use migrated RawDataWall, JsonPipeline, AgentSwarm, StrategySynthesis, ActionDeliverable with the 5-step narrative already in the preliminary landing page's `page.tsx` (copy section IDs: #how-it-works)
> 5. PilotOffer section (from export, id='pilot')
> 6. FAQ section (from export, with aria-expanded on items)
> 7. FinalCTA section (from export)
> 8. Footer (from export)
>
> Motion signature (from F-16) goes in a top-level provider or utility.
>
> Wire video URL from ARTIFACTS table into video section.
> Wire poster URL into video section's poster attribute.
> Wire all CTAs to: mailto:chayadol@reveallabs.co?subject=Join%20the%20reveal.%20waitlist
>
> Apply accessibility basics:
> - Skip-to-content link at top (focus visible when focused, cream bg, green-700 text)
> - All images have alt text
> - All buttons have aria-label if text is ambiguous
> - All interactive elements keyboard-accessible
> - Section headings use semantic h1 (hero only), h2 (sections)
>
> Run `pnpm dev` when done, verify http://localhost:3000 renders correctly."

## G-4 — Create OG image `[HUMAN + CLAUDE CODE]` (15 min)
- [ ] Once local dev renders, screenshot the hero at desktop size (1920×1080 viewport)
- [ ] Crop to 1200×630 (OG image standard)
- [ ] Save to `reveallabs-site/public/og-image.png`
- [ ] Tell Claude Code: "Verify `src/app/layout.tsx` references `/og-image.png` in metadata openGraph.images and twitter.images arrays."

## G-5 — Local verification `[HUMAN]` (20 min)
Start dev server: `pnpm dev` in reveallabs-site.

Walk through in Chrome incognito window at http://localhost:3000:
- [ ] Entrance animation plays end-to-end
- [ ] Skip button works (sets localStorage, ends animation)
- [ ] Scroll the full page slowly
- [ ] Click every button / CTA — does mailto fire?
- [ ] Expand/collapse every FAQ item
- [ ] Refresh page — entrance skips (localStorage)
- [ ] Clear localStorage (`localStorage.clear()` in console) → refresh → plays again
- [ ] Keyboard-only navigation: Tab through all interactive elements, focus states visible?
- [ ] Test prefers-reduced-motion (DevTools → Rendering → Emulate CSS): entrance skips, animations disabled

Flag issues to Claude Code as you find them.

## G-6 — Multi-breakpoint mobile test `[HUMAN + CLAUDE CODE]` (30 min)
DevTools → Responsive Design Mode.

Test at: 375px (iPhone SE), 390px (iPhone 14), 414px (iPhone 14 Plus), 768px (iPad), 1024px (iPad landscape), 1440px (laptop), 1920px (desktop).

For each breakpoint, check:
- [ ] No horizontal scroll
- [ ] Text readable (not too small, not overflowing)
- [ ] Buttons tappable (min 44×44px)
- [ ] Images/video scale correctly
- [ ] Stat card (if hero B) stacks properly on mobile
- [ ] Video section height appropriate for mobile
- [ ] Entrance animation works on mobile (reduce size if icons too big)

Fix issues via Claude Code.

## G-7 — Mobile Safari physical test `[HUMAN]` (15 min)
- [ ] Get your iPhone
- [ ] On your Mac: Safari → Develop → Show Web Inspector, enable iOS simulator or connect physical device
- [ ] Navigate iPhone to your Mac's local IP (e.g., http://192.168.x.x:3000) or use ngrok
- [ ] Test the page on actual iPhone Safari
- [ ] Check specifically:
  - [ ] Entrance animation 3D transform works (Safari sometimes glitches)
  - [ ] Video plays (iOS requires `playsInline`)
  - [ ] Backdrop filters work if used
  - [ ] Font rendering looks right
  - [ ] No layout shift on load
  - [ ] Tap targets large enough

Fix issues.

**✓ Track G done when:** Local site looks right at all breakpoints including real iPhone, no console errors, all CTAs work.

---

# TRACK H — Deploy + verify (45 min, after G done)

## H-1 — Commit final changes `[HUMAN + CLAUDE CODE]` (5 min)
Tell Claude Code:
> "In reveallabs-site, stage all changes and commit with message:
> ```
> feat: landing page v1 — moodboard aesthetic, B&W video, brand entrance, scrollytelling, FAQ, waitlist CTA
>
> Sections: entrance → hero → video → how-it-works (scrollytelling) → pilot → FAQ → CTA → footer.
> Design system: moodboard v2 (cream canvas, hunter green 700, Space Grotesk + Space Mono).
> CTA: mailto waitlist (temporary until real signup infra is built).
> Analytics: Vercel Analytics.
> ```"

## H-2 — Push + merge PR `[HUMAN]` (10 min)
- [ ] `git push origin landing-v1`
- [ ] On GitHub: open PR from `landing-v1` → `main`
- [ ] Review diff
- [ ] Merge PR (squash merge recommended)
- [ ] Vercel auto-deploys on main push

## H-3 — Watch Vercel deploy `[HUMAN]` (10 min)
- [ ] Vercel dashboard → reveallabs-site → watch build log
- [ ] If build fails: copy error → tell Claude Code → fix → push again
- [ ] Wait for green checkmark + "Deployment Ready"

## H-4 — Production verification `[HUMAN]` (15 min)
Open `https://www.reveallabs.co` in Chrome incognito.

- [ ] Entrance animation plays on first visit
- [ ] Full scroll — no broken layouts
- [ ] Video loads within 2-3 seconds (check Network tab)
- [ ] All CTAs open mailto with correct prefilled subject
- [ ] FAQ works
- [ ] Footer links work (privacy page loads)
- [ ] /privacy renders

Test on iPhone Safari at `https://www.reveallabs.co`:
- [ ] Entrance works on iOS
- [ ] Video autoplays (mobile Safari sometimes blocks — check console)
- [ ] No layout issues

Test on Safari desktop:
- [ ] Animations work (some Framer Motion features behave differently)
- [ ] Backdrop filters render

## H-5 — Lighthouse audit `[HUMAN]` (10 min)
Chrome DevTools → Lighthouse → Performance + Accessibility + SEO (mobile + desktop).

Targets:
- [ ] Performance > 85 (mobile may be lower due to video — acceptable down to 70)
- [ ] Accessibility > 95
- [ ] Best Practices > 90
- [ ] SEO > 95

Fix anything flagged red. Common fixes:
- Image alt text
- Sufficient color contrast
- `preload="metadata"` on video
- Font preload in layout

Tell Claude Code to fix issues.

## H-6 — Rollback plan verification `[HUMAN]` (2 min)
- [ ] In Vercel dashboard → Deployments → find previous deploy (the starter) → confirm you can click "Promote to Production" if needed
- [ ] This is your rollback if anything breaks after launch. Don't actually promote — just verify the button exists.

## H-7 — First honest reaction test `[HUMAN]` (10 min)
- [ ] Text www.reveallabs.co to one person who is:
  - Not a designer
  - Not invested in Reveal
  - Restaurant owner or hospitality adjacent if possible
- [ ] Ask one question: "What do you think this does?"
- [ ] Listen. Does their answer match your positioning?
- [ ] If they describe it wrong — that's v2 copy work, NOT a v1 blocker.

## H-8 — Mark shipped `[HUMAN]` (1 min)
- [ ] Update ARTIFACTS table with live URL: https://www.reveallabs.co
- [ ] Screenshot live site → `design/inspiration-capture/SHIPPED-v1-final.png`
- [ ] Close this doc

**✓ Track H done when:** Live at www.reveallabs.co, first honest reaction received, Mike Speck meeting tomorrow (Apr 21) has a working landing page.

---

# ARTIFACTS (fill in as you go)

| Artifact | URL / path |
|---|---|
| Claude Design — Variant A (teaser, archived) | https://claude.ai/design/p/df9fdd8c-1d19-41b6-b1b3-e4bb2c55ceb4?file=Reveal+Landing.html |
| Claude Design — Variant X (YOU RUN / WE READ, **archived** 2026-04-20) | https://claude.ai/design/p/8caae151-7392-49c1-9f68-a59adec328eb |
| Claude Design — **Variant Y (LOUD / QUIET) — WINNER** | https://claude.ai/design/p/2f450042-965d-4e13-a82d-7ef3283e85af |
| Video URL (Vercel Blob) | _(C-5)_ |
| Poster image URL (Vercel Blob) | _(C-5)_ |
| Inspiration folder | `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/inspiration-capture/` |
| Video stills | `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/video-stills/` |
| Video clips | `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/video-clips/` |
| Final video | `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/video-final/intermission.mp4` |
| Utensil assets (if Path B) | `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/entrance-utensils/` |
| Claude Design dry-run export | `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/claude-design-exports/dry-run-hero-b/` |
| Claude Design final export | `/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/claude-design-exports/reveal-landing-v1-final/` |
| Production URL | https://www.reveallabs.co |

# DECISION LOG

| Decision | Value | Resolved in |
|---|---|---|
| Entrance asset path (A Lucide / B custom) | _____ | D-1 |
| Export quality verdict (clean / workable / messy) | _____ | F-5 |
| Hero winner (A centered / B asymmetric) | **B asymmetric (full, with stat card)** | F-6 ✓ 2026-04-19 |
| Video placement (A intermission / B hero bg) | **A intermission** | F-10 ✓ 2026-04-19 (by variant lock) |
| Motion signature | _____ | F-16 |

---

# v2 LIST (post-launch)

When ideas surface during execution, write them here. Do NOT add to v1 scope.

- Real waitlist signup (Formspree, ConvertKit, or custom) replacing mailto
- Authentic Tuk Tuk video shoot replacing Higgsfield
- Proper 3D Lottie/Rive entrance animation (studio quality)
- /scan onboarding flow
- /pricing dedicated page
- Case studies page
- Dashboard preview at /product
- Dark mode toggle
- Blog
- Cookie consent banner (if analytics expands)
- Real LinkedIn / social links in footer

---

# TRACK AUDIT (before starting — confirm the plan)

Before you start Track A, walk through this mental checklist:

- [ ] I have Max Claude subscription ready
- [ ] My Vercel account owns reveallabs-site and its domain
- [ ] My GitHub account has push to chichisun/reveallabs-site
- [ ] I know how to install Higgsfield credits (free trial or paid)
- [ ] I have CapCut or DaVinci Resolve installed (or will install)
- [ ] I'm willing to slip into Monday evening if quality isn't there (hard stop Tuesday AM for Mike Speck meeting)
- [ ] I have ~9-13 hours of focused time across Sunday + Monday (today + tomorrow)

If any unchecked: resolve before starting Track A.

---

*Last updated: 2026-04-19.*
*This doc is the script. Execute track-by-track, step-by-step, with parallelism across tracks.*
