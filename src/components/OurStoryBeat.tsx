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
        <div className="beat-bg">
          <Image
            src={photo}
            alt={alt}
            fill
            sizes="100vw"
            priority={index === 0}
            className="beat-photo"
          />
          <div className="beat-scrim" aria-hidden="true" />
        </div>
        <div className="beat-content">
          <div className="beat-year" aria-hidden="true">
            {year}
          </div>
          <p className="beat-copy">
            <span className="sr-only">{year}. </span>
            {copy}
          </p>
        </div>
      </article>
    );
  },
);
