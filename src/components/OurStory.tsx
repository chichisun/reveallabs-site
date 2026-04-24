"use client";

import { useRef, useState } from "react";
import { OurStoryBeat, type BeatGrade } from "./OurStoryBeat";
import { TimelineSpine } from "./TimelineSpine";

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
    photo: "/our-story/1970.jpg",
    alt: "Kase's grandparents after arriving from Thailand in 1970.",
    copy:
      "In 1970, my grandparents arrived from Thailand with no money, no security, with nothing but a dream.",
    grade: "bw",
  },
  {
    year: "1998",
    photo: "/our-story/1998.jpg",
    alt: "The first restaurant, opened in 1998.",
    copy:
      "In 1998 that dream became our first restaurant, rooted from a cultural belief in Thailand, where we host, we gather, we eat. They realized there was no place like home, so they built one.",
    grade: "bw",
  },
  {
    year: "2011",
    photo: "/our-story/2011.jpg",
    alt: "Kase with his parents at Tuk Tuk Thai Grill.",
    copy:
      "My childhood was spent on the dining room floor, where my first job at 8 years old was bussing tables and washing dishes. As my parents took over, I watched my grandparents, now 84 and 89, continue to show up everyday. They didn't just build a business, they built a community for the next three generations of our family to keep alive.",
    grade: "bw",
  },
  {
    year: "2014",
    photo: "/our-story/2014.jpg",
    alt: "Kase's parents at Tuk Tuk Thai Grill.",
    copy:
      "But eventually, the home they built grew heavy. As the moving parts of a restaurant became overwhelming, we were forced to close locations. I watched my grandparents and parents sacrifice everything to chase a nickel on every dollar, a cycle they shouldn't have to carry alone. So Reveal was built to be the support they never had.",
    grade: "bw",
  },
  {
    year: "2026",
    photo: "/our-story/2026.jpg",
    alt: "The whole family in front of Tuk Tuk Thai Grill.",
    copy:
      "Reveal was created to give back to the industry that raised me. We will die with the purpose of making the lives of mom and pop shops easier, because we know exactly whose lives are behind it.",
    grade: "color",
  },
];

export function OurStory() {
  const beatRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll + IntersectionObserver motion lands in Task 9.

  return (
    <section className="story" aria-label="Reveal's origin story, 1970 to today">
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
    </section>
  );
}
