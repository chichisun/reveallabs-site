"use client";

import { useEffect, useRef, useState } from "react";

/** Respects prefers-reduced-motion (reactive). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Count a number up from 0 → target when `active` flips true. */
export function useCountUp(target: number, active: boolean, duration = 850): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduced]);
  return value;
}

/** Staggered reveal wrapper. Plays a translate+fade when `active`, after `delay`. */
export function Reveal({
  active,
  delay = 0,
  className = "",
  children,
}: {
  active: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    timer.current = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(timer.current);
  }, [active, delay]);
  return (
    <div className={`rap-reveal ${shown ? "is-in" : ""} ${className}`}>{children}</div>
  );
}

export function StatusBar() {
  return (
    <div className="rap-status">
      <span>9:41</span>
      <span className="dots">●●● ⏚ ▮</span>
    </div>
  );
}

export function BottomNav({ active = "home" }: { active?: "home" | "commitments" | "pulse" | "more" }) {
  const item = (key: string, glyph: string, label: string) => (
    <div className={`rap-nav__item ${active === key ? "is-active" : ""}`}>
      <span className="rap-nav__glyph">{glyph}</span>
      <span>{label}</span>
    </div>
  );
  return (
    <div className="rap-nav">
      {item("home", "⌂", "Home")}
      {item("commitments", "≣", "Commitments")}
      <div className="rap-nav__fab-slot">
        <div className="rap-fab">+</div>
      </div>
      {item("pulse", "✦", "Pulse")}
      {item("more", "⋯", "More")}
    </div>
  );
}
