# Mojang Studios Animation — Visual Reference

**Source:** Mojang Studios logo animation (from Minecraft Dungeons, ~2020). Downloaded Apr 19 2026 from YouTube (https://www.youtube.com/watch?v=lo0nfVEo8LE). 4.4s, 1280x720, 30fps.

**Why this is our reference:** Kase picked this as the aesthetic target for the reveal. brand entrance animation. The trick it uses is what we're adapting for kitchen-utensils-to-letters.

---

## What the animation ACTUALLY does (key insight)

I initially misread this as "shapes fly in and morph into letters." **That's wrong.** Here's what actually happens:

### Frame-by-frame (see `frames/f_001.jpg` through `f_017.jpg`)

- **f_001 (0.0s):** Dark red-black background. Abstract 3D geometric shapes. They look like alien runes or glyphs — NOT recognizable as letters. The shapes have extruded 3D depth.
- **f_005 (1.25s):** Background shifts to bright red. Shapes are clearly white/cream now. Still reading as abstract geometry, still unrecognizable as letters. **But they're moving — rotating in 3D space.**
- **f_009 (2.25s):** Shapes are mid-rotation. Starting to look more letter-like. You can see extrusion/depth.
- **f_013 (3.25s):** Letters resolve. "MOJANG STUDIOS" is now clearly readable. The shapes we saw in f_001 were actually the letters the whole time — just viewed from a sideways/rotated angle that hid their letterness.
- **f_017 (4.25s):** Final static logo. Clean "MOJANG STUDIOS" wordmark.

### The trick

**The letters are ALWAYS there.** They're just rotated in 3D space so the viewer sees them as abstract shapes at the start. As the rotation resolves to a front-facing view, the letters reveal themselves.

This is NOT morphing. It's rotation + perspective + extrusion.

---

## Why this is brilliant (for brand purposes)

1. **Satisfying "aha" moment** — your brain goes from "what is that?" to "oh, it's the logo" in 2-3 seconds. Surprise + recognition.
2. **No fake morphing** — which often looks cheap in web (SVG path morph interpolation artifacts).
3. **3D depth adds premium feel** — the extrusion gives the letters weight, like they're physical objects.
4. **Background color shift adds energy** — red background grabs attention, signals "something is about to happen."
5. **Short and tight** — 4 seconds. No time to get bored.

---

## Adapting to reveal. (what we're building)

**Kase's original idea:** kitchen utensils morph into the word "reveal."

**Applying Mojang's trick:** instead of morphing, we design **7 3D objects that are simultaneously utensils AND letters.** When viewed from one angle they read as utensils (flame, knife, fork, pan, whisk, rolling pin, flame/period). When rotated to front-facing, they read as letters of "reveal."

The letters are always there. Rotation reveals.

This is **significantly harder** to execute than a simple flip animation. It requires:
- 3D objects that genuinely work as both shapes AND letters (design work)
- Real 3D transforms in CSS or Three.js, not 2D card flips
- Camera movement + lighting for the extrusion effect

### Execution tiers (ship Monday vs. premium v2)

**V1 (Monday-shippable, in gameplan):** Card flip in CSS — each card has utensil face + letter face, rotates 180° to flip. Uses Framer Motion rotateY + `backface-visibility: hidden`. Gets the "reveal" feeling without the full 3D-object trick.

**V2 (post-launch, premium):** Commission a Lottie or Rive animation with real 3D utensil-letter hybrids that rotate in true 3D space. Studio work, probably 2-3 days of design + animation.

---

## Key timing (replicate this in our entrance)

Mojang's 4.4s runtime breaks down roughly as:
- 0-1s: Shapes visible but abstract (viewer curiosity)
- 1-3s: Rotation resolves (viewer pattern-matches to letters)
- 3-4s: Clean logo on final background

Our v1 Mojang-inspired version should be **2.5-3s**:
- 0-0.5s: Utensils visible, readable as kitchen tools
- 0.5-2.0s: Cards flip sequentially (120ms stagger, front→back face swap)
- 2.0-2.5s: Clean "reveal." wordmark

Shorter because we're flipping (simpler visually) not rotating in 3D (richer visually). We trade runtime for simpler execution.

---

## Frames to study

Open these for visual reference:
- `frames/f_001.jpg` — the "abstract rune" start
- `frames/f_009.jpg` — mid-resolve moment (shapes becoming letters)
- `frames/f_013.jpg` — fully resolved
- `frames/f_017.jpg` — final static logo

Or play the full video: `open mojang-studios-animation.mp4`
