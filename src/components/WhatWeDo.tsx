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
          <span className="lede-line">Everything connected.</span>
          <span className="lede-line">Nothing missed.</span>
        </h2>
        <div className="what-we-do-body-wrap">
          <p className="what-we-do-body">
            We watch everything your restaurant runs on — every contract
            you signed, every cost you pay, every sale you make. Vendors,
            leases, payouts, renewals, the whole picture. For the first
            time, your restaurant lives in one connected place.
          </p>
          <p className="what-we-do-body">
            Then we find the gaps and opportunities hiding in your data,
            and build you a strategy. 2 or 3 specific moves to grow next
            month — with everything you need to execute them. Scripts,
            menu changes, marketing assets, tracking. Not generic advice.
            A plan you can actually run.
          </p>
        </div>
      </div>
    </section>
  );
}
