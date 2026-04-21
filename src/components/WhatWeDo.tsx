"use client";

import { useEffect, useRef, useState } from "react";

export function WhatWeDo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`what-we-do${visible ? " is-visible" : ""}`}
      aria-labelledby="what-we-do-title"
    >
      <div className="what-we-do-inner">
        <h2 className="what-we-do-lede" id="what-we-do-title">
          <span className="lede-line">Revenue intelligence</span>
          <span className="lede-line">for independent restaurants.</span>
        </h2>
        <div className="what-we-do-body-wrap">
          <p className="what-we-do-body">
            We watch your sales, find where you&apos;re losing money — bad
            prices, slow days, high delivery fees — and send you 2 or 3 things
            to fix each month.
          </p>
          <p className="what-we-do-body">
            Most restaurants have more data than time. We read it, skip the
            generic advice, and hand you a short list that fits your
            restaurant.
          </p>
        </div>
      </div>
    </section>
  );
}
