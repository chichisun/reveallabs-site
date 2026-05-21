"use client";

/**
 * Dashboard preview — the auto-playing phone demo that sits between the Hero
 * and Scrollytelling on the homepage. Ported from the approved Claude Design
 * prototype (dash-webv3). All styles are scoped under `.reveal-dpv` (preview.css)
 * so the gray/Inter app look never leaks into the cream marketing theme.
 */
import { useEffect, useRef, useState } from "react";
import "./preview.css";
import {
  HomeScreen,
  FlagScreen,
  CaptureScreen,
  CommitmentsScreen,
  OutroScreen,
} from "./screens";

const CAPTIONS = [
  "Money slips out of every restaurant, where no one has time to look.",
  "Vendors and apps bet you're too busy to notice. Reveal noticed, and drafted the fix.",
  "There's always something about to expire. Reveal never lets it slip.",
  "All you did was snap a photo of one bill.",
  "", // beat 5 — phone rotates
  "", // beat 5 — phone slides off
];

// Timing per step (ms): 0 home, 1 flag, 2 commitments, 3 capture, 4 outro-rotate, 5 outro-slide-off
const HOLDS = [5200, 5000, 4500, 6400, 2800, 2200];
const RIPPLE_TARGETS_BY_STEP = ["doordash", "commitments", "plus", null, null, null];
const RIPPLE_AT = [4500, 4300, 3700, 99999, 99999, 99999];
const BEAT_COUNT = 4;
const STEP_COUNT = HOLDS.length;

function renderScreen(step: number, ripple: string | null) {
  if (step === 0) return <HomeScreen rippleTarget={ripple} />;
  if (step === 1) return <FlagScreen rippleTarget={ripple} />;
  if (step === 2) return <CommitmentsScreen rippleTarget={ripple} />;
  if (step === 3) return <CaptureScreen rippleTarget={ripple} />;
  if (step === 4) return <OutroScreen />;
  return null;
}

export function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [ripple, setRipple] = useState<string | null>(null);
  const [prev, setPrev] = useState<{ step: number; cycle: number } | null>(null);
  const prevHideRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Start the demo only when it scrolls into view (so the count-up lands on sight).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || started) return;
    if (!("IntersectionObserver" in window)) {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  // Timeline: dwell on each beat, fire its tap-ripple, then advance.
  useEffect(() => {
    if (!started) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const target = RIPPLE_TARGETS_BY_STEP[step];
    if (target) {
      timers.push(setTimeout(() => setRipple(target), RIPPLE_AT[step]));
    }

    timers.push(
      setTimeout(() => {
        setPrev({ step, cycle });
        clearTimeout(prevHideRef.current);
        prevHideRef.current = setTimeout(() => setPrev(null), 560);

        setRipple(null);
        setStep((s) => {
          const next = (s + 1) % STEP_COUNT;
          if (next === 0) setCycle((c) => c + 1);
          return next;
        });
      }, HOLDS[step]),
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, step]);

  const isOutroRotate = step === 4;
  const isOutroSlide = step === 5;
  const isOutro = isOutroRotate || isOutroSlide;

  const visualStep = isOutro ? 4 : step;
  const visualKey = `${visualStep}-${cycle}`;
  const prevVisualStep = prev ? (prev.step === 4 || prev.step === 5 ? 4 : prev.step) : null;
  const prevKey = prev ? `prev-${prevVisualStep}-${prev.cycle}` : null;
  const showPrev = prev && prevVisualStep !== visualStep;

  const captionStep = isOutro ? 3 : step;
  const phaseClass = isOutroSlide
    ? "phase-outro-slide"
    : isOutroRotate
      ? "phase-outro-rotate"
      : "phase-main";

  return (
    <section ref={sectionRef} className="reveal-dpv" aria-label="A look inside Reveal">
      <div className={`stage ${phaseClass} ${isOutro ? "is-outro" : ""}`}>
        <div className="caption-side">
          <div className="caption-eyebrow">
            <span className="eyebrow-dot" />
            Reveal · live demo
          </div>
          <div className="caption-wrap caption-slot">
            <div className="caption caption-fade-enter" key={`cap-${captionStep}-${cycle}`}>
              {CAPTIONS[captionStep]}
            </div>
          </div>
          <div className="progress">
            <span className="progress-label">{captionStep + 1} of {BEAT_COUNT}</span>
            <div className="dots">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`dot ${i === captionStep ? "active" : ""}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="phone-side">
          <div className="phone-slide-wrap">
            <div className={`phone ${isOutro ? "rotated" : ""}`}>
              <div className="notch" />
              <div className="screen">
                <div className="screen-stack">
                  {started && showPrev && (
                    <div className="screen-layer layer-prev" key={prevKey ?? undefined}>
                      {renderScreen(prevVisualStep as number, null)}
                    </div>
                  )}
                  {started && (
                    <div className="screen-layer layer-enter" key={visualKey}>
                      {renderScreen(visualStep, ripple)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
