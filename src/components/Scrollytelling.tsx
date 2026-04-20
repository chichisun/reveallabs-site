"use client";

import { useEffect, useRef, useState } from "react";

const BEATS = [
  {
    kind: "voice" as const,
    heading: "A RESTAURANT IS LOUD",
    body: "Employees, customers, problems. Something is always pulling your attention.",
  },
  {
    kind: "voice" as const,
    heading: "THE DATA IS QUIET",
    body: "It doesn't tell you when something is wrong. We Will.",
  },
  {
    kind: "case-study" as const,
    body: "Real Data. Real Restaurants. Every Month.",
  },
];

export function Scrollytelling() {
  const [activeBeat, setActiveBeat] = useState(0);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);

  // Desktop: sticky-left swaps based on which scroll-right block is closest to viewport center.
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const viewCenter = window.innerHeight * 0.5;
      let bestIdx = 0;
      let bestDist = Infinity;
      blocksRef.current.forEach((block, i) => {
        if (!block) return;
        const r = block.getBoundingClientRect();
        const c = r.top + r.height * 0.5;
        const d = Math.abs(c - viewCenter);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
      setActiveBeat(bestIdx);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mobile: fire-and-forget reveal when a block enters view. Permanent once visible.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.2 },
    );
    blocksRef.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  const renderBeat = (i: number) => {
    const beat = BEATS[i];
    if (beat.kind === "voice") {
      return <div className="beat-voice">{beat.heading}</div>;
    }
    return (
      <>
        <div className="beat-eyebrow">Case study — Tuk Tuk Thai Grill</div>
        <div className="beat-primary">$5,931</div>
        <div className="beat-label">Found last month</div>
        <hr className="beat-divider" />
        <div className="beat-secondary">32%</div>
        <div className="beat-label">Recovered in 30 days</div>
      </>
    );
  };

  return (
    <section className="scrolly" aria-label="The problem in three beats">
      <div className="scrolly-left" aria-hidden="true">
        <div className="scrolly-stage">
          {BEATS.map((_, i) => (
            <div
              key={i}
              className={`beat-slide${activeBeat === i ? " is-active" : ""}`}
              data-beat={i}
            >
              {renderBeat(i)}
            </div>
          ))}
        </div>
      </div>

      <div className="scrolly-right">
        {BEATS.map((beat, i) => (
          <div
            key={i}
            className="scrolly-block"
            data-beat={i}
            ref={(el) => {
              blocksRef.current[i] = el;
            }}
          >
            <div className="mobile-beat">{renderBeat(i)}</div>
            <p>{beat.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
