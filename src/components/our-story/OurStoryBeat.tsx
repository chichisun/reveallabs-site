"use client";

import Image from "next/image";
import { forwardRef } from "react";

export type BeatGrade = "bw" | "color";

export interface BeatProps {
  year: string;
  photo: string;
  alt: string;
  copy: string;
  grade: BeatGrade;
  index: number;
}

export const OurStoryBeat = forwardRef<HTMLElement, BeatProps>(
  function OurStoryBeat({ year, photo, alt, copy, grade, index }, ref) {
    return (
      <article
        ref={ref}
        className={`story-beat story-beat--${grade}`}
        data-beat={index}
      >
        <div className="story-beat-photo">
          <div className="story-beat-photo-parallax">
            <Image
              src={photo}
              alt={alt}
              fill
              sizes="(min-width: 900px) 500px, 100vw"
              priority={index === 0}
            />
          </div>
        </div>
        <div className="story-beat-text">
          <div className="story-beat-year" aria-label={year}>
            {year.split("").map((ch, i) => (
              <span key={i} className="year-digit" aria-hidden="true">
                <span className="year-digit-inner">{ch}</span>
              </span>
            ))}
          </div>
          <p className="story-beat-copy">{copy}</p>
        </div>
      </article>
    );
  },
);
