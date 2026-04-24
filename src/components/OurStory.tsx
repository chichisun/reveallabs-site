"use client";

import { useEffect, useRef, useState } from "react";
import { OurStoryBeat, type BeatGrade } from "./OurStoryBeat";
import { TimelineSpine } from "./TimelineSpine";
import { CropEditor } from "./CropEditor";

interface Beat {
  year: string;
  photo: string;
  alt: string;
  copy: string;
  grade: BeatGrade;
}

const BEATS: Beat[] = [
  {
    year: "1970",
    photo: "/our-story/1970-v2.jpg",
    alt: "Kase's grandparents after arriving from Thailand in 1970.",
    copy:
      "In 1970, my grandparents arrived from Thailand with no money, no security, with nothing but a dream.",
    grade: "bw",
  },
  {
    year: "1998",
    photo: "/our-story/1998-v2.jpg",
    alt: "The first restaurant, opened in 1998.",
    copy:
      "In 1998 that dream became our first restaurant, rooted from a cultural belief in Thailand, where we host, we gather, we eat. They realized there was no place like home, so they built one.",
    grade: "bw",
  },
  {
    year: "2011",
    photo: "/our-story/2011-v2.jpg",
    alt: "Kase with his parents at Tuk Tuk Thai Grill.",
    copy:
      "My childhood was spent on the dining room floor, where my first job at 8 years old was bussing tables and washing dishes. As my parents took over, I watched my grandparents, now 84 and 89, continue to show up everyday. They didn't just build a business, they built a community for the next three generations of our family to keep alive.",
    grade: "bw",
  },
  {
    year: "2014",
    photo: "/our-story/2014-v2.jpg",
    alt: "Kase's parents at Tuk Tuk Thai Grill.",
    copy:
      "But eventually, the home they built grew heavy. As the moving parts of a restaurant became overwhelming, we were forced to close locations. I watched my grandparents and parents sacrifice everything to chase a nickel on every dollar, a cycle they shouldn't have to carry alone. So Reveal was built to be the support they never had.",
    grade: "bw",
  },
  {
    year: "2026",
    photo: "/our-story/2026-v2.jpg",
    alt: "The whole family in front of Tuk Tuk Thai Grill.",
    copy:
      "Reveal was created to give back to the industry that raised me. We will die with the purpose of making the lives of mom and pop shops easier, because we know exactly whose lives are behind it.",
    grade: "color",
  },
];

export function OurStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const beatRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      beatRefs.current.forEach((el) => el?.classList.add("is-visible"));
      setActiveIndex(BEATS.length - 1);
      document.documentElement.style.setProperty("--story-progress", "1");
      return;
    }

    if (!("IntersectionObserver" in window)) {
      beatRefs.current.forEach((el) => el?.classList.add("is-visible"));
      return;
    }

    // Direction-aware reveal:
    //   - Beat enters from below (scroll-down): play full stagger animation.
    //   - Beat re-enters from above (scroll-up through a beat already
    //     scrolled past): snap to visible, skip animation.
    //   - Beat exits top (scrolled past going down): stays is-visible so
    //     it doesn't re-animate unless you later scroll up past it.
    //   - Beat exits bottom (scrolled past going up): is-visible removed
    //     so the next downward entry re-plays the animation.
    //   - is-current toggles with intersection — drives the 2026 color bloom.
    const current = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const idx = Number(el.dataset.beat ?? "0");
          if (entry.isIntersecting) {
            const prev = el.dataset.state === "above" ? "above" : "below";
            if (prev === "below") {
              // Entering from below → animate in.
              el.classList.remove("no-anim");
              // Reflow so re-adding is-visible restarts the transitions.
              void el.offsetWidth;
              el.classList.add("is-visible", "is-current");
            } else {
              // Re-entering from above while scrolling up → snap, no anim.
              el.classList.add("no-anim", "is-visible", "is-current");
              requestAnimationFrame(() => el.classList.remove("no-anim"));
            }
            current.add(idx);
          } else {
            const rect = entry.boundingClientRect;
            const viewH = window.innerHeight;
            const beatMid = rect.top + rect.height * 0.5;
            if (beatMid < viewH * 0.5) {
              // Exited above viewport center → scrolled past going down.
              el.dataset.state = "above";
              el.classList.remove("is-current");
              // Keep is-visible so scrolling back up doesn't make it vanish.
            } else {
              // Exited below viewport center → scrolled past going up.
              el.dataset.state = "below";
              el.classList.remove("is-visible", "is-current");
            }
            current.delete(idx);
          }
        });
        if (current.size === 0) {
          setActiveIndex(0);
        } else {
          setActiveIndex(Math.max(...current));
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );

    beatRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Spine progress: normalized so it reaches 100% when the last
      // beat is centered, not when the section has left the viewport.
      const half = viewH * 0.5;
      const travelable = Math.max(1, rect.height - viewH);
      const p = Math.max(
        0,
        Math.min(1, (half - rect.top) / travelable),
      );
      document.documentElement.style.setProperty(
        "--story-progress",
        String(p),
      );

      // Per-beat parallax: each photo drifts a little slower than its
      // surrounding text as the beat scrolls through the viewport.
      // Offset range: -28px (entering from below) → +28px (leaving at top).
      beatRefs.current.forEach((el) => {
        if (!el) return;
        const parallaxTarget = el.querySelector<HTMLElement>(
          ".story-beat-photo-parallax",
        );
        if (!parallaxTarget) return;
        const br = el.getBoundingClientRect();
        const center = br.top + br.height * 0.5;
        // Normalized position of beat-center vs viewport-center: -1 (above) → 1 (below)
        const norm = Math.max(
          -1,
          Math.min(1, (center - half) / (viewH * 0.5 + br.height * 0.5)),
        );
        parallaxTarget.style.setProperty(
          "--parallax-y",
          `${norm * -28}px`,
        );
      });
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

  return (
    <section
      ref={sectionRef}
      className="story"
      aria-label="Reveal's origin story, 1970 to today"
    >
      <TimelineSpine
        years={BEATS.map((b) => b.year)}
        activeIndex={activeIndex}
      />
      <div className="story-beats">
        {BEATS.map((b, i) => (
          <OurStoryBeat
            key={b.year}
            ref={(el) => {
              beatRefs.current[i] = el;
            }}
            index={i}
            year={b.year}
            photo={b.photo}
            alt={b.alt}
            copy={b.copy}
            grade={b.grade}
          />
        ))}
      </div>
      <CropEditor />
    </section>
  );
}
