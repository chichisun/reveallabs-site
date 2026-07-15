"use client";

import { useEffect, useRef } from "react";
import { SiteNav } from "@/components/home-v2/SiteNav";
import { HomeWaitlist } from "@/components/home-v2/HomeWaitlist";

/**
 * Supy visual pass Our Story page, ported 1:1 from
 * design/mockups/supy-visual-pass/our-story.html.
 *
 * The mockup injects the beats from a BEATS array at runtime; here they are
 * rendered directly as JSX. The mockup's <script> block (direction-aware
 * clip-path reveals, spine progress, per-beat photo parallax) lives in the
 * useEffect below with StrictMode-safe cleanup. The dummy waitlist form is
 * replaced by <HomeWaitlist /> (real /api/waitlist submission, identical
 * markup).
 */

const BEATS = [
  {
    year: "1970",
    photo: "/our-story/1970-v2.jpg",
    grade: "bw",
    copy: "In 1970, my grandparents arrived from Thailand with no money, no security, with nothing but a dream.",
  },
  {
    year: "1998",
    photo: "/our-story/1998-v2.jpg",
    grade: "bw",
    copy: "In 1998 that dream became our first restaurant, rooted from a cultural belief in Thailand, where we host, we gather, we eat. They realized there was no place like home, so they built one.",
  },
  {
    year: "2011",
    photo: "/our-story/2011-v2.jpg",
    grade: "bw",
    copy: "My childhood was spent on the dining room floor, where my first job at 8 years old was bussing tables and washing dishes. As my parents took over, I watched my grandparents, now 84 and 89, continue to show up everyday. They didn't just build a business, they built a community for the next three generations of our family to keep alive.",
  },
  {
    year: "2014",
    photo: "/our-story/2014-v2.jpg",
    grade: "bw",
    copy: "But eventually, the home they built grew heavy. As the moving parts of a restaurant became overwhelming, we were forced to close locations. I watched my grandparents and parents sacrifice everything to chase a nickel on every dollar, a cycle they shouldn't have to carry alone. So Reveal was built to be the support they never had.",
  },
  {
    year: "2026",
    photo: "/our-story/2026-v2.jpg",
    grade: "color",
    copy: "Reveal was created to give back to the industry that raised me. We will die with the purpose of making the lives of mom and pop shops easier, because we know exactly whose lives are behind it.",
  },
];

export function StoryV2() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];

    const beats = [...root.querySelectorAll<HTMLElement>(".story-beat")];
    const dots = [...root.querySelectorAll<HTMLElement>(".timeline-dot")];
    const section = root.querySelector<HTMLElement>(".story");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !section) {
      beats.forEach((el) => el.classList.add("is-visible", "is-current"));
      dots.forEach((d) => d.classList.add("is-active"));
      root.style.setProperty("--story-progress", "1");
      return;
    }

    // direction-aware reveal (mirrors the mockup script)
    const current = new Set<number>();
    const setActive = () => {
      const idx = current.size ? Math.max(...current) : 0;
      dots.forEach((d, i) =>
        d.classList.toggle("is-active", i <= idx && (current.size > 0 || i === 0)),
      );
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const idx = +(el.dataset.beat || 0);
          if (entry.isIntersecting) {
            const prev = el.dataset.state === "above" ? "above" : "below";
            if (prev === "below") {
              el.classList.remove("no-anim");
              void el.offsetWidth;
              el.classList.add("is-visible", "is-current");
            } else {
              el.classList.add("no-anim", "is-visible", "is-current");
              requestAnimationFrame(() => el.classList.remove("no-anim"));
            }
            current.add(idx);
          } else {
            const rect = entry.boundingClientRect;
            const beatMid = rect.top + rect.height * 0.5;
            if (beatMid < innerHeight * 0.5) {
              el.dataset.state = "above";
              el.classList.remove("is-current");
            } else {
              el.dataset.state = "below";
              el.classList.remove("is-visible", "is-current");
            }
            current.delete(idx);
          }
        });
        setActive();
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );
    beats.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // spine progress + per-beat photo parallax
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const half = innerHeight * 0.5;
      const travelable = Math.max(1, rect.height - innerHeight);
      const p = Math.max(0, Math.min(1, (half - rect.top) / travelable));
      root.style.setProperty("--story-progress", String(p));
      beats.forEach((el) => {
        const target = el.querySelector<HTMLElement>(".story-beat-photo-parallax");
        if (!target) return;
        const br = el.getBoundingClientRect();
        const center = br.top + br.height * 0.5;
        const norm = Math.max(
          -1,
          Math.min(1, (center - half) / (innerHeight * 0.5 + br.height * 0.5)),
        );
        target.style.setProperty("--parallax-y", `${norm * -28}px`);
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    cleanups.push(() => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    });
    update();

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="storyv2" ref={rootRef}>
      <SiteNav page="story" />

      <header className="story-header">
        <h1>Our story.</h1>
        <div className="story-kicker">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          Three generations, one kitchen
        </div>
      </header>

      <section className="story" aria-label="Reveal's origin story, 1970 to today">
        <div className="timeline-spine" aria-hidden="true">
          <div className="timeline-spine-line">
            <div className="timeline-spine-fill"></div>
          </div>
          <ul className="timeline-spine-dots">
            {BEATS.map((b) => (
              <li key={b.year} className="timeline-dot">
                <span className="timeline-dot-mark"></span>
                <span className="timeline-dot-label">{b.year}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="story-beats">
          {BEATS.map((b, i) => (
            <article
              key={b.year}
              className={`story-beat story-beat--${b.grade}`}
              data-beat={i}
            >
              <div className="story-beat-photo">
                <div className="story-beat-photo-parallax">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.photo} alt="" />
                </div>
              </div>
              <div className="story-beat-text">
                <div className="story-beat-year" aria-label={b.year}>
                  {b.year.split("").map((ch, d) => (
                    <span key={d} className="year-digit">
                      <span className="year-digit-inner">{ch}</span>
                    </span>
                  ))}
                </div>
                <p className="story-beat-copy">{b.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="closer">
        <h2>Stop paying for other people&apos;s mistakes.</h2>
        <p className="sub">Join the waitlist and be first in line when Reveal opens up.</p>
        <HomeWaitlist source="story_closer" />
        <div className="proof-chip">
          <span className="tick">✓</span>
          <span>
            <strong>$1,297.87</strong> caught at one restaurant in month one.
          </span>
        </div>
      </section>
    </div>
  );
}
