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
          <span className="lede-line">It watches the money,</span>
          <span className="lede-line">so you don&apos;t have to.</span>
        </h2>
        <div className="what-we-do-body-wrap">
          <p className="what-we-do-body">
            Reveal connects to your bank, POS, delivery apps, and the
            invoices and contracts you already keep — then checks every
            vendor bill, payout, and renewal against what you actually
            agreed to. Everything in one place for the first time.
          </p>
          <p className="what-we-do-body">
            When something doesn&apos;t line up — a vendor creeps their
            price, an app pays you short, a permit&apos;s about to lapse —
            Reveal catches it and hands you what you need to get the money
            back: the numbers, the proof, the next step. Big chains pay
            someone to do this. Now you don&apos;t have to.
          </p>
        </div>
      </div>
    </section>
  );
}
