"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Brand intro — icons arrive tilted in 3D, breathe, tumble through a 3D
   rotation, and morph into the letters of "reveal." mid-tumble. Lands as
   the wordmark and docks to the nav position. */

const SVG_PROPS = {
  width: 64,
  height: 64,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ChefHat = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
    <path d="M6 17h12" />
  </svg>
);
const Utensils = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);
const UtensilsCrossed = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
    <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
    <path d="m2.1 21.8 6.4-6.3" />
    <path d="m19 5-7 7" />
  </svg>
);
const CookingPot = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M2 12h20" />
    <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
    <path d="m4 8 16-4" />
    <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
  </svg>
);
const Egg = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M12 22c5.523 0 9-3.477 9-8.5S17.523 2 12 2 3 7.977 3 13.5 6.477 22 12 22z" />
  </svg>
);
const Wheat = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M2 22 16 8" />
    <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
    <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
    <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
  </svg>
);
const Flame = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

type GlyphSpec = {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  ch: string;
  accent: boolean;
  opticalScale: number;
  // Optional per-icon stroke-width override. Some Lucide icons (Wheat
  // especially) have dense overlapping paths that read visually thicker
  // than others at the default stroke width.
  strokeWidth?: number;
};

// Per-icon visual-weight normalizers. Lucide icons fill their 24-unit
// viewBox differently: ChefHat is tall/narrow, Egg is a small centered
// oval, Wheat/Flame use thin strokes in wide bounding boxes. These
// scale values compensate so all 7 icons read as the same visual size.
// Transforms don't affect layout (row width is unchanged), so a scale
// of 1.6-1.9 here doesn't break the mobile row fit — only changes how
// the icon looks inside its 36px container.
const GLYPHS: GlyphSpec[] = [
  { Icon: ChefHat, ch: "r", accent: false, opticalScale: 1.15 },
  { Icon: Utensils, ch: "e", accent: false, opticalScale: 1.0 },
  { Icon: UtensilsCrossed, ch: "v", accent: false, opticalScale: 1.05 },
  { Icon: CookingPot, ch: "e", accent: false, opticalScale: 1.0 },
  { Icon: Egg, ch: "a", accent: false, opticalScale: 1.15 },
  { Icon: Wheat, ch: "l", accent: false, opticalScale: 1.2, strokeWidth: 1.35 },
  { Icon: Flame, ch: ".", accent: true, opticalScale: 1.2 },
];

// Measure each letter's width at the INTRO LETTER'S current font-size
// (which varies by viewport via CSS media queries). Using the intro size
// means the compactWidth values shrink the glyph boxes correctly on mobile
// so the docked row matches the nav wordmark's visual width.
function measureLetterWidths(introFontSize: number): number[] {
  const target = document.querySelector(".nav .wordmark");
  // Fallback widths scaled to the current intro font-size
  if (!target) {
    return [40, 42, 40, 42, 42, 20, 16].map(
      (w) => (w * introFontSize) / 72,
    );
  }
  const chars = ["r", "e", "v", "e", "a", "l", "."];
  const cs = getComputedStyle(target);
  const probe = document.createElement("span");
  probe.style.cssText = `
    position:absolute; visibility:hidden; white-space:pre; top:-9999px;
    font-family:${cs.fontFamily};
    font-size:${introFontSize}px;
    font-weight:${cs.fontWeight};
    letter-spacing:${cs.letterSpacing};
  `;
  document.body.appendChild(probe);
  const widths = chars.map((c) => {
    probe.textContent = c;
    return probe.getBoundingClientRect().width;
  });
  document.body.removeChild(probe);
  return widths;
}

const T = {
  arriveStart: 0.0,
  arriveDur: 0.9,
  arriveStagger: 0.09,
  lockStart: 0.85,
  lockDur: 1.1,
  lockStagger: 0.16,
  // Dock waits until after the last glyph (Flame → ".") finishes morphing
  // at T.lockStart + 6*T.lockStagger + T.lockDur ≈ 2.91s. A small buffer
  // lets the formed word breathe for a beat before flying to the nav.
  dockStart: 3.0,
  dockDur: 1.15,
  heroStart: 3.1,
  total: 4.25,
};

type FlyTo = { dx: number; dy: number; scale: number };

// Compute per-letter center X offsets (from wordmark left edge) at the
// wordmark's computed font. Returns cumulative center-x for each of
// "r","e","v","e","a","l",".".
//
// We render the full string in-context with each letter wrapped in its
// own <span> and measure each span's rect. Measuring letters in isolation
// and summing introduces cumulative letter-spacing error (~1-2px across
// 7 letters); in-context measurement matches the actual rendered layout
// of the nav wordmark 1:1.
function measureNavLetterCenters(navWordmark: HTMLElement): number[] {
  const chars = ["r", "e", "v", "e", "a", "l", "."];
  const cs = getComputedStyle(navWordmark);
  const probe = document.createElement("span");
  probe.style.cssText = `
    position:absolute; visibility:hidden; white-space:pre; top:-9999px;
    font-family:${cs.fontFamily};
    font-size:${cs.fontSize};
    font-weight:${cs.fontWeight};
    letter-spacing:${cs.letterSpacing};
  `;
  probe.innerHTML = chars.map((c) => `<span>${c}</span>`).join("");
  document.body.appendChild(probe);
  const probeLeft = probe.getBoundingClientRect().left;
  const centers: number[] = [];
  probe.querySelectorAll("span").forEach((s) => {
    const r = s.getBoundingClientRect();
    centers.push((r.left + r.right) / 2 - probeLeft);
  });
  document.body.removeChild(probe);
  return centers;
}

function IntroOverlay({ onDone }: { onDone: () => void }) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [flyTos, setFlyTos] = useState<FlyTo[] | null>(null);
  const [widths, setWidths] = useState<number[] | null>(null);
  const [overlayGone, setOverlayGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const row = rowRef.current;
      const target = document.querySelector(".nav .wordmark") as HTMLElement | null;
      const introLetter = document.querySelector(".intro-letter") as HTMLElement | null;
      if (!row || !target || !introLetter) {
        raf = window.requestAnimationFrame(measure);
        return;
      }
      const rt = target.getBoundingClientRect();
      const targetFS = parseFloat(getComputedStyle(target).fontSize) || 24;
      // Use the actual intro-letter font-size (72px desktop, smaller on
      // mobile per media queries) so the dock scale matches the true
      // ratio between intro and nav wordmark sizes.
      const introFS =
        parseFloat(getComputedStyle(introLetter).fontSize) || 72;
      const scale = targetFS / introFS;

      // Each intro glyph flies to its OWN target — the exact slot its
      // letter will occupy inside the docked wordmark. This means the
      // letters don't translate as a row and collapse at the end; they
      // converge directly to their final positions, appearing to pull
      // into the word from wherever they happen to be standing.
      // Measure the OUTER .intro-glyph-flight wrapper, not .intro-glyph.
      // The inner .intro-glyph has an `initial={{ y: 26 }}` arrive offset
      // applied at mount time, so its rect is 26px low when we measure.
      // The outer wrapper is not transformed at t≈0, so its rect equals
      // the resting layout position of the glyph — which is what we need
      // for the dock target math.
      const glyphEls = row.querySelectorAll(".intro-glyph-flight");
      const navCenters = measureNavLetterCenters(target);
      const navCy = rt.top + rt.height / 2;

      const perGlyph: FlyTo[] = [];
      glyphEls.forEach((el, i) => {
        const gr = (el as HTMLElement).getBoundingClientRect();
        const glyphCx = gr.left + gr.width / 2;
        const glyphCy = gr.top + gr.height / 2;
        const targetCx = rt.left + navCenters[i];
        perGlyph.push({
          dx: targetCx - glyphCx,
          dy: navCy - glyphCy,
          scale,
        });
      });
      setFlyTos(perGlyph);
      setWidths(measureLetterWidths(introFS));
    };
    raf = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  // Reveal page content behind the docking wordmark, keep the real nav
  // wordmark hidden until just before dock ends to prevent a visual jump.
  useEffect(() => {
    const id = window.setTimeout(() => {
      document.documentElement.classList.remove("intro-pending");
      const navWord = document.querySelector(".nav .wordmark") as HTMLElement | null;
      if (navWord) navWord.style.visibility = "hidden";
    }, T.heroStart * 1000);
    return () => window.clearTimeout(id);
  }, []);

  const handoffT = T.dockStart + T.dockDur - 0.12;
  useEffect(() => {
    const id = window.setTimeout(() => {
      const navWord = document.querySelector(".nav .wordmark") as HTMLElement | null;
      if (navWord) navWord.style.visibility = "";
    }, handoffT * 1000);
    return () => window.clearTimeout(id);
  }, [handoffT]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem("reveal_intro_seen", "true");
      } catch {}
      setOverlayGone(true);
      window.setTimeout(() => onDone(), 40);
    }, T.total * 1000);
    return () => window.clearTimeout(id);
  }, [onDone]);

  const handleSkip = () => {
    try {
      localStorage.setItem("reveal_intro_seen", "true");
    } catch {}
    document.documentElement.classList.remove("intro-pending");
    setOverlayGone(true);
    window.setTimeout(() => onDone(), 180);
  };

  return (
    <AnimatePresence>
      {!overlayGone && (
        <motion.div
          key="intro"
          className="intro-overlay"
          role="dialog"
          aria-label="Brand intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          style={{ pointerEvents: flyTos ? "none" : "auto" }}
        >
          <motion.div
            className="intro-scrim"
            initial={{ opacity: 1 }}
            animate={{
              opacity: 0,
              transition: {
                duration: 0.65,
                delay: T.dockStart + 0.15,
                ease: [0.4, 0, 0.2, 1] as const,
              },
            }}
          />

          <motion.div
            ref={rowRef}
            className="intro-row"
            initial={{ opacity: 1 }}
            animate={
              flyTos
                ? { opacity: [1, 1, 0] }
                : {}
            }
            transition={
              flyTos
                ? {
                    opacity: {
                      duration: 0.12,
                      delay: handoffT,
                      ease: "linear",
                      times: [0, 0.001, 1],
                    },
                  }
                : undefined
            }
          >
            {GLYPHS.map((g, i) => (
              <Glyph
                key={i}
                index={i}
                {...g}
                flyTo={flyTos ? flyTos[i] : null}
              />
            ))}
          </motion.div>

          <motion.button
            type="button"
            className="intro-skip"
            onClick={handleSkip}
            aria-label="Skip brand intro"
            initial={{ opacity: 1 }}
            animate={{
              opacity: 0,
              transition: { duration: 0.25, delay: T.dockStart - 0.3 },
            }}
          >
            Skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Glyph({
  index,
  Icon,
  ch,
  accent,
  opticalScale = 1,
  strokeWidth,
  flyTo,
}: GlyphSpec & {
  index: number;
  flyTo: FlyTo | null;
}) {
  const arriveDelay = T.arriveStart + index * T.arriveStagger;
  const lockDelay = T.lockStart + index * T.lockStagger;

  const [breathing, setBreathing] = useState(false);
  const [tumbling, setTumbling] = useState(false);

  useEffect(() => {
    const breatheAt = (arriveDelay + T.arriveDur * 0.6) * 1000;
    const tumbleAt = lockDelay * 1000;
    // Stop the breathe oscillation just before the dock fires so the
    // glyph isn't ±3px off-center while flying to its final slot.
    const stopBreatheAt = (T.dockStart - 0.05) * 1000;
    const t1 = window.setTimeout(() => setBreathing(true), breatheAt);
    const t2 = window.setTimeout(() => setTumbling(true), tumbleAt);
    const t3 = window.setTimeout(() => setBreathing(false), stopBreatheAt);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [arriveDelay, lockDelay]);

  const glowDelay = accent ? `${T.lockDur * 0.65}s` : "0s";

  // Two-layer motion: an outer flight wrapper handles the per-glyph dock
  // (x/y/scale to the letter's final nav slot), and the inner glyph
  // handles the initial arrive entrance. Each letter plots its own path
  // to its target — so when the dock fires, letters converge directly on
  // their final positions instead of flying as a row that collapses at
  // the end.
  return (
    <motion.div
      className="intro-glyph-flight"
      style={{ display: "inline-block" }}
      initial={{ x: 0, y: 0, scale: 1 }}
      animate={
        flyTo
          ? { x: flyTo.dx, y: flyTo.dy, scale: flyTo.scale }
          : { x: 0, y: 0, scale: 1 }
      }
      transition={
        flyTo
          ? {
              duration: T.dockDur,
              delay: T.dockStart,
              ease: [0.23, 1, 0.32, 1] as const,
            }
          : undefined
      }
    >
      <motion.div
        className="intro-glyph"
        initial={{ opacity: 0, y: 26, scale: 0.9 }}
        animate={{
          opacity: [0, 1],
          y: [26, 0],
          scale: [0.9, 1],
        }}
        transition={{
          duration: T.arriveDur,
          delay: arriveDelay,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      >
        <div className={`intro-breathe${breathing ? " is-breathing" : ""}`}>
          <div
            className={`intro-tumbler${accent ? " is-accent" : ""}${
              tumbling ? " is-tumbling" : ""
            }`}
            style={
              {
                "--tumble-dur": `${T.lockDur}s`,
                "--glow-delay": glowDelay,
              } as React.CSSProperties
            }
          >
            <div className="intro-content intro-icon">
              <Icon
                stroke="currentColor"
                {...(strokeWidth !== undefined ? { strokeWidth } : {})}
                style={{
                  transform: `scale(${opticalScale})`,
                  transformOrigin: "center",
                }}
              />
            </div>
            <div className="intro-content intro-letter">{ch}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Intro() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const optOut = params.get("no-intro") === "1";
    const forceReplay = params.get("intro") === "1";
    let seen = false;
    try {
      seen = sessionStorage.getItem("reveal_intro_seen") === "1";
    } catch {
      /* ignore */
    }
    // Skip intro if opted out, or already seen this session
    // (unless explicitly replayed via ?intro=1).
    if (optOut || (seen && !forceReplay)) {
      document.documentElement.classList.remove("intro-pending");
      setShow(false);
    } else {
      setShow(true);
    }
  }, []);

  const handleDone = () => {
    setShow(false);
    try {
      sessionStorage.setItem("reveal_intro_seen", "1");
    } catch {
      /* ignore */
    }
    const btn = document.getElementById("introReplay");
    if (btn) btn.classList.add("is-ready");
  };

  if (show !== true) return null;
  return <IntroOverlay onDone={handleDone} />;
}
