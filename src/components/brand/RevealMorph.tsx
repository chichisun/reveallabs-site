"use client";

/* RevealMorph — inline animated wordmark inside the blog index <h1>.
 *
 * Replicates the homepage Intro choreography exactly, embedded into the
 * heading text flow. Three phases:
 *
 *   1. Arrive (0 → 0.9s, stagger 0.09s)
 *      Glyphs translate up from y=22 with opacity 0 → 1 and scale 0.9 → 1.
 *
 *   2. Tumble + crossfade (start 0.85s, dur 1.1s, stagger 0.16s)
 *      Glyph 3D-tumbles (rotateX 0→180→0, rotateY 0→200→360, rotateZ
 *      0→8→0) while the icon fades out and the letter fades in. Letter
 *      also scales up from 0.85 → 1 across the same window.
 *
 *   3. Scroll-reverse (driven by window scroll)
 *      The tumble runs in reverse with a NEW stagger order — period
 *      first, then "l", "a", "e", "v", "e", "r". Only the tumble phase
 *      reverses; the arrive phase stays committed (glyphs don't fade
 *      back out, they just re-tumble back into icon faces).
 *
 * Timing values match `T` in Intro.tsx so the visual feel is identical.
 * The accent glyph (period → Flame) gets a green drop-shadow glow at the
 * end of the tumble, mirroring the homepage `.is-accent.is-tumbling`. */

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  useReducedMotion,
  animate,
  type MotionValue,
} from "framer-motion";
import { REVEAL_GLYPHS, type GlyphSpec } from "@/components/brand/RevealGlyphs";

const N = REVEAL_GLYPHS.length;

// Mount-tumble timing (seconds). The arrive phase was removed (icons
// are present from initial render); only the lock/tumble runs on mount.
// Numbers tuned for a snappy morph: ~1.4s total from page-ready to
// fully resolved letters.
const T = {
  // Kept for reference; arrive is no longer wired in.
  arriveStart: 0.0,
  arriveDur: 0.9,
  arriveStagger: 0.09,
  lockStart: 0,
  lockDur: 0.65,
  lockStagger: 0.09,
};
const TOTAL_DURATION = T.lockStart + (N - 1) * T.lockStagger + T.lockDur; // ≈ 1.19s
const MOUNT_INITIAL_DELAY = 0.1;

// Reverse-on-scroll: complete before the heading scrolls off-viewport
// (heading clears around ~360px on desktop heights).
const SCROLL_END_PX = 340;
const REVERSE_STAGGER_FRAC = 0.08;
const REVERSE_WINDOW_FRAC = 0.32;

export function RevealMorph() {
  const reduce = useReducedMotion();

  // 0 → 1 over TOTAL_DURATION on mount
  const mountProgress = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, [0, SCROLL_END_PX], [0, 1], {
    clamp: true,
  });

  useEffect(() => {
    if (reduce) {
      mountProgress.set(1);
      return;
    }
    const controls = animate(mountProgress, 1, {
      duration: TOTAL_DURATION,
      delay: MOUNT_INITIAL_DELAY,
      ease: "linear",
    });
    return () => controls.stop();
  }, [reduce, mountProgress]);

  return (
    <span className="reveal-morph" aria-label="reveal.">
      {REVEAL_GLYPHS.map((glyph, i) => (
        <Glyph
          key={i}
          glyph={glyph}
          index={i}
          mountProgress={mountProgress}
          scrollProgress={scrollProgress}
          reduceMotion={!!reduce}
        />
      ))}
    </span>
  );
}

function Glyph({
  glyph,
  index,
  mountProgress,
  scrollProgress,
  reduceMotion,
}: {
  glyph: GlyphSpec;
  index: number;
  mountProgress: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  // ---- Tumble forward ----
  // No arrive phase — icons are present from initial render. Only the
  // morph-to-letter and the scroll-reverse animate. This avoids the
  // "icons fading in" feel; the page just shows the brand mark and then
  // resolves it to letters.
  const tumbleStartN = (T.lockStart + index * T.lockStagger) / TOTAL_DURATION;
  const tumbleEndN = tumbleStartN + T.lockDur / TOTAL_DURATION;
  const tumbleForward = useTransform(
    mountProgress,
    [tumbleStartN, Math.min(tumbleEndN, 1)],
    [0, 1],
    { clamp: true },
  );

  // ---- Tumble reverse (scroll-driven) ----
  // Period (i = 6) un-builds first; "r" last.
  const reverseRank = N - 1 - index;
  const reverseStart = reverseRank * REVERSE_STAGGER_FRAC;
  const reverseEnd = Math.min(reverseStart + REVERSE_WINDOW_FRAC, 1);
  const tumbleReverse = useTransform(
    scrollProgress,
    [reverseStart, reverseEnd],
    [0, 1],
    { clamp: true },
  );

  // Combined tumble: 0 = icon face, 1 = letter face.
  const tumble = useTransform(
    [tumbleForward, tumbleReverse] as MotionValue<number>[],
    (vals) => {
      const [f, r] = vals as number[];
      const v = f - r;
      return v < 0 ? 0 : v > 1 ? 1 : v;
    },
  );

  // ---- Tumbler (3D rotate) — copy of intro-tumble keyframes ----
  const rotateX = useTransform(tumble, [0, 0.55, 1], [0, 180, 0]);
  const rotateY = useTransform(tumble, [0, 0.55, 1], [0, 200, 360]);
  const rotateZ = useTransform(tumble, [0, 0.55, 1], [0, 8, 0]);

  // ---- Crossfade — copy of intro-icon-fade / intro-letter-fade ----
  const iconOpacity = useTransform(tumble, [0, 0.3, 0.65, 1], [1, 1, 0, 0]);
  const letterOpacity = useTransform(tumble, [0, 0.35, 0.7, 1], [0, 0, 1, 1]);
  const letterScale = useTransform(tumble, [0, 1], [0.85, 1]);

  // ---- Accent glow (period → Flame) — peaks during tumble midpoint ----
  const accentGlow = useTransform(
    tumble,
    [0, 0.4, 0.7, 1],
    [
      "drop-shadow(0 0 0 rgba(53,94,59,0))",
      "drop-shadow(0 0 14px rgba(53,94,59,0.55))",
      "drop-shadow(0 0 8px rgba(53,94,59,0.4))",
      "drop-shadow(0 0 5px rgba(53,94,59,0.3))",
    ],
  );

  const { Icon, ch, accent, opticalScale, strokeWidth } = glyph;

  if (reduceMotion) {
    return (
      <span
        className={`reveal-morph-glyph${accent ? " is-accent" : ""}`}
        aria-hidden="true"
      >
        <span className="reveal-morph-letter">{ch}</span>
      </span>
    );
  }

  return (
    <motion.span
      className={`reveal-morph-glyph${accent ? " is-accent" : ""}`}
      aria-hidden="true"
    >
      <motion.span
        className="reveal-morph-tumbler"
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          rotateZ,
          ...(accent ? { filter: accentGlow } : {}),
        }}
      >
        <motion.span
          className="reveal-morph-letter"
          style={{ opacity: letterOpacity, scale: letterScale }}
        >
          {ch}
        </motion.span>
        <motion.span
          className="reveal-morph-icon"
          style={{ opacity: iconOpacity }}
        >
          <Icon
            stroke="currentColor"
            {...(strokeWidth !== undefined ? { strokeWidth } : {})}
            style={{
              transform: `scale(${opticalScale})`,
              transformOrigin: "center",
            }}
          />
        </motion.span>
      </motion.span>
    </motion.span>
  );
}
