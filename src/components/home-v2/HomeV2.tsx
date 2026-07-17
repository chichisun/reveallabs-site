"use client";

import { useEffect, useRef } from "react";
import { HomeWaitlist } from "./HomeWaitlist";
import { SiteNav } from "./SiteNav";

/**
 * Supy visual pass homepage, ported 1:1 from
 * design/mockups/supy-visual-pass/index.html.
 *
 * Markup mirrors the mockup <body> exactly (wrapped in .homev2 for style
 * scoping); the mockup's <script> blocks live in the useEffect below.
 * The two dummy waitlist forms are replaced by <HomeWaitlist /> (real
 * /api/waitlist submission, identical pill markup).
 */

const ICN_CHECK = '<svg class="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICN_WARN = '<svg class="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 20h16a2 2 0 0 0 1.73-2z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';

/* stroke icons: replace raw emoji glyphs so badges read as designed UI, not chat text */
function IcCheck() {
  return (
    <svg className="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IcWarn() {
  return (
    <svg className="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 20h16a2 2 0 0 0 1.73-2z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
function IcLock() {
  return (
    <svg className="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="11" width="17" height="10" rx="2.5" />
      <path d="M7.5 11V7a4.5 4.5 0 0 1 9 0v4" />
    </svg>
  );
}

export function HomeV2() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const docEl = document.documentElement;
    const cleanups: Array<() => void> = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* nav burger + scrolled state now live in <SiteNav /> */

    /* ---------- how-it-works scroll takeover (mockup IIFE #2) ---------- */
    (() => {
      const el = (id: string) => document.getElementById(id);
      const track = el("audTrack");
      const stage = el("audStage");
      const anchor = el("audAnchor");
      if (!track || !stage || !anchor) return;
      const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
      const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const bell = (t: number) => Math.sin(Math.PI * clamp(t, 0, 1));
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const intro = el("audIntro")!;
      const beats = [el("audB0")!, el("audB1")!, el("audB2")!];
      const chips = [el("audD0")!, el("audD1")!, el("audD2")!, el("audD3")!];
      const hub = el("audHub")!;
      const ring = el("audRing")!;
      const lock = el("audLock")!;
      const srcs = [el("audS0")!, el("audS1")!, el("audS2")!, el("audS3")!];
      const wires = [el("audW0")!, el("audW1")!, el("audW2")!, el("audW3")!];
      const scraps = [...track.querySelectorAll<HTMLElement>(".aud-scrap")];
      const pairbs = [...track.querySelectorAll<HTMLElement>(".aud-pairb")];
      const proof = el("audProof")!;
      const disp = el("audDisp")!;
      const sentpill = el("audSent")!;
      const money = el("audMoney")!;
      const dockEl = el("audDock")!;
      // hoisted refs: these were re-queried every frame inside update()
      const wiresEl = root.querySelector<SVGSVGElement>(".aud-wires");
      const hint = el("audHint")!;

      const T = {
        inflate: [0, 0.045],
        introOut: [0.055, 0.085],
        p1: [0.065, 0.165],
        p1out: [0.17, 0.22],
        scatter: [0.23, 0.3],
        organize: [0.31, 0.435],
        check: [0.455, 0.65],
        merge: [0.66, 0.71],
        p3: [0.71, 0.935],
        exhale: [0.95, 1],
      };

      const start = [
        { x: -0.55, y: -0.44 },
        { x: 0.55, y: -0.4 },
        { x: -0.55, y: 0.42 },
        { x: 0.55, y: 0.46 },
      ];
      const dockPos = [
        { x: -380, y: -172 },
        { x: 392, y: -128 },
        { x: -356, y: 152 },
        { x: 404, y: 196 },
      ];
      const scatter = [
        { x: -0.34, y: -0.2, r: -7 },
        { x: 0.26, y: -0.24, r: 5 },
        { x: -0.12, y: -0.05, r: 4 },
        { x: 0.38, y: -0.03, r: -4 },
        { x: -0.31, y: 0.14, r: 6 },
        { x: 0.09, y: 0.08, r: -6 },
        { x: -0.04, y: 0.26, r: -3 },
        { x: 0.29, y: 0.24, r: 7 },
      ];
      const COLX = 200;
      const ROWY = [-138, -46, 46, 138];
      const slot = (i: number) => ({ x: i % 2 === 0 ? -COLX : COLX, y: ROWY[i >> 1] });
      const chipAt = (i: number) => {
        const a = anchor.getBoundingClientRect();
        const c = chips[i].getBoundingClientRect();
        return { x: c.left + c.width / 2 - a.left, y: c.top + c.height / 2 - a.top };
      };

      const update = () => {
        const r = track.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - innerHeight), 0, 1);

        // the inset breathes: inflates to full screen, exhales back at the end
        const inflT = ease(seg(p, T.inflate[0], T.inflate[1]));
        const exhT = ease(seg(p, T.exhale[0], T.exhale[1]));
        const sizeT = Math.min(inflT, 1 - exhT);
        const w0 = Math.min(1360, innerWidth - 32);
        const h0 = innerHeight * 0.78;
        stage.style.width = lerp(w0, innerWidth, sizeT) + "px";
        stage.style.height = lerp(h0, innerHeight, sizeT) + "px";
        stage.style.borderRadius = lerp(44, 0, sizeT) + "px";
        // everything inside quiets down before the exhale
        const endFade = 1 - seg(p, 0.935, 0.955);

        // the title opens the takeover and returns to close it (never an empty card)
        const ioIn = 1 - seg(p, T.introOut[0], T.introOut[1]);
        const ioOut = ease(seg(p, 0.94, 0.965));
        const io = Math.max(ioIn, ioOut);
        intro.style.opacity = String(io);
        intro.style.transform = `translateY(${ioOut > 0 ? (1 - ioOut) * 20 : (1 - ioIn) * -26}px)`;

        const c0 = seg(p, T.introOut[0] + 0.01, T.introOut[1] + 0.01) * (1 - seg(p, T.p1out[0], T.p1out[1]));
        const c1 = seg(p, T.p1out[0] + 0.01, T.scatter[0]) * (1 - seg(p, T.merge[0], T.merge[1]));
        const c2 = seg(p, T.merge[0] + 0.01, T.p3[0] + 0.01) * endFade;
        [c0, c1, c2].forEach((o2, i) => {
          beats[i].style.opacity = String(o2);
          beats[i].style.transform = `translateY(${(1 - o2) * 8}px)`;
        });
        dockEl.style.opacity = endFade === 1 ? "" : String(endFade);

        // ---- beat 1 ----
        const mob = innerWidth <= 900;
        const K = mob ? Math.max(0.34, innerWidth / 1100) : 1; // geometry scale for small screens
        if (wiresEl) wiresEl.style.transform = `translate(-50%, -50%) scale(${K})`;
        const t1 = seg(p, T.p1[0], T.p1[1]);
        const o = seg(p, T.p1out[0], T.p1out[1]);
        const ht = ease(seg(t1, 0, 0.18));
        const hubFade = seg(o, 0.2, 0.75);
        hub.style.opacity = String(ht * (1 - hubFade));
        hub.style.filter = hubFade > 0 ? `blur(${8 * hubFade}px)` : "";
        hub.style.transform = `translate(-50%, -50%) scale(${(0.82 + 0.18 * ht) * (1 - 0.3 * hubFade)})`;
        const b1fade = 1 - seg(o, 0.2, 0.75);
        srcs.forEach((s, i) => {
          const t = ease(seg(t1, 0.06 + i * 0.1, 0.46 + i * 0.1));
          const sx = start[i].x * innerWidth;
          const sy = start[i].y * innerHeight;
          let tx = dockPos[i].x * K;
          const ty = dockPos[i].y * K;
          if (mob) tx = Math.sign(tx) * Math.min(Math.abs(tx), innerWidth / 2 - 96);
          const px = sx + (tx - sx) * t;
          const py = sy + (ty - sy) * t;
          s.style.opacity = String(t * b1fade);
          s.style.transform = `translate(${px}px, ${py}px)`;
          chips[i].style.opacity = String(seg(o, 0.8, 1));
        });
        let pulse = 0;
        wires.forEach((wl, i) => {
          const wt = ease(seg(t1, 0.44 + i * 0.1, 0.58 + i * 0.1)) * (1 - ease(o));
          wl.style.strokeDashoffset = String(1 - wt);
          wl.style.opacity = String(1 - ease(o));
          pulse += bell(seg(t1, 0.56 + i * 0.1, 0.7 + i * 0.1));
        });
        const lt = ease(seg(t1, 0.88, 1));
        lock.style.opacity = String(lt * (1 - seg(o, 0, 0.35)));
        lock.style.transform = `translateX(-50%) translateY(${8 - 8 * lt}px)`;
        pulse = Math.min(1, pulse) * (1 - ease(o));
        ring.style.opacity = String(0.6 * pulse);
        ring.style.transform = `translate(-50%, -50%) scale(${(0.82 + 0.18 * ht) * (1 + 0.35 * pulse)})`;

        // ---- beat 2 ----
        const tScatter = seg(p, T.scatter[0], T.scatter[1]);
        const tOrg = seg(p, T.organize[0], T.organize[1]);
        const tChk = seg(p, T.check[0], T.check[1]);
        const mT = ease(seg(p, T.merge[0], T.merge[1]));
        const inB2 = p >= T.scatter[0] && p < T.p3[0];

        // mobile: no room for two columns — each pair plays as its own stacked scene
        const M_A = T.scatter[0];
        const M_B = T.check[1];
        const M_SP = (M_B - M_A) / 4;
        const mIdx = Math.min(3, Math.max(0, Math.floor((p - M_A) / M_SP)));
        const mt = clamp((p - M_A - mIdx * M_SP) / M_SP, 0, 1);
        scraps.forEach((s, i) => {
          const pair = i >> 1;
          const warn = pair !== 2;
          let x: number,
            y: number,
            rot = 0,
            op: number,
            scale = 1,
            blur = 0,
            cT: number,
            focus: number;
          if (mob) {
            // stacked pair: reality above, agreement below, one pair at a time
            const active = p >= M_A && pair === mIdx;
            const inT = easeIO(seg(mt, 0, 0.3));
            const last = pair === 3;
            const outT = last ? 0 : ease(seg(mt, 0.88, 1));
            cT = active ? ease(seg(mt, 0.44, 0.6)) : pair < mIdx || p >= T.merge[0] ? 1 : 0;
            focus = active ? bell(seg(mt, 0.42, 0.72)) : 0;
            const fromX = (i % 2 === 0 ? -1 : 1) * innerWidth * 0.65;
            x = lerp(fromX, 0, inT);
            y = i % 2 === 0 ? -58 : 58;
            op = active ? Math.min(1, inT * 2.5) * (1 - outT) : 0;
            if (p >= T.merge[0] && pair === 3) {
              y = lerp(y, -52, mT);
              op = 1 - seg(mT, 0.45, 0.85);
              scale = lerp(1, 0.9, mT);
              blur = 6 * seg(mT, 0.3, 1);
            }
          } else {
            const eT = ease(seg(tScatter, i * 0.09, 0.55 + i * 0.05));
            const oT = ease(seg(tOrg, pair * 0.16, pair * 0.16 + 0.4));
            const sx = scatter[i].x * innerWidth;
            const sy = scatter[i].y * innerHeight;
            const sl = slot(i);
            x = lerp(sx, sl.x, oT);
            y = lerp(sy, sl.y, oT);
            rot = lerp(scatter[i].r, 0, oT);
            op = eT;
            cT = ease(seg(tChk, pair * 0.22, pair * 0.22 + 0.16));
            focus = bell(seg(tChk, pair * 0.22 - 0.02, pair * 0.22 + 0.26));
            if (!warn) op *= lerp(1, 0.45, ease(seg(cT, 0.5, 1)));
            if (p >= T.merge[0]) {
              if (pair === 3) {
                x = lerp(sl.x, i % 2 === 0 ? -30 : 30, mT);
                y = lerp(sl.y, -52, mT);
                op = eT * (1 - seg(mT, 0.45, 0.85));
                scale = lerp(1, 0.9, mT);
                blur = 6 * seg(mT, 0.3, 1);
              } else {
                op = eT * (1 - seg(mT, 0, 0.5));
              }
            }
          }
          s.classList.toggle("flag", warn && i % 2 === 0 && cT > 0.5);
          s.classList.toggle("dim", !warn && cT > 0.5 && !mob);
          s.classList.toggle("ref", warn && i % 2 === 1 && cT > 0.5);
          const dT = warn ? ease(seg(cT, 0.55, 1)) : 0;
          const delta = s.querySelector<HTMLElement>(".aud-delta");
          if (delta) {
            delta.style.opacity = String(dT);
            delta.style.transform = `scale(${0.8 + 0.2 * dT})`;
          }
          s.style.opacity = inB2 || p >= T.p3[0] ? String(op) : "0";
          s.style.filter = blur > 0 ? `blur(${blur}px)` : "";
          s.style.zIndex = focus > 0.05 ? "4" : "3";
          s.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg) scale(${scale * (1 + 0.06 * focus)})`;
        });
        pairbs.forEach((b, pair) => {
          let cT: number, focus: number, by: number;
          if (mob) {
            const active = p >= M_A && pair === mIdx;
            cT = active ? ease(seg(mt, 0.44, 0.6)) : 0;
            focus = active ? bell(seg(mt, 0.42, 0.72)) : 0;
            by = 0;
          } else {
            cT = ease(seg(tChk, pair * 0.22, pair * 0.22 + 0.16));
            focus = bell(seg(tChk, pair * 0.22 - 0.02, pair * 0.22 + 0.26));
            by = ROWY[pair];
          }
          const hide = p >= T.merge[0] ? 1 - seg(mT, 0, 0.5) : 1;
          b.style.opacity = String((inB2 ? cT : 0) * hide);
          b.style.transform = `translate(-50%, -50%) translateY(${by}px) scale(${(0.7 + 0.3 * cT) * (1 + 0.1 * focus)})`;
          const onNow = mob
            ? inB2 && p >= M_A && pair === mIdx
            : inB2 && tChk > pair * 0.22 && tChk < pair * 0.22 + 0.22;
          const doneNow = mob
            ? (inB2 && (pair < mIdx || (pair === mIdx && mt > 0.6))) || p >= T.merge[1]
            : (inB2 && cT > 0.6) || p >= T.merge[1];
          chips[pair].classList.toggle("on", onNow);
          chips[pair].classList.toggle("done", doneNow);
        });

        // ---- beat 3 ----
        const t3 = seg(p, T.p3[0], T.p3[1]);
        const pT = ease(seg(mT, 0.55, 1));
        proof.style.opacity = String(pT * endFade);
        proof.style.filter = pT < 1 ? `blur(${(1 - pT) * 6}px)` : "";
        proof.style.transform = `translate(-50%, -50%) translateY(-52px) scale(${0.9 + 0.1 * pT})`;
        const dT2 = ease(seg(t3, 0.14, 0.3));
        const wT = seg(t3, 0.38, 0.56);
        const wE = easeIO(wT);
        disp.style.opacity = String(dT2 * (1 - seg(wT, 0.82, 1)));
        disp.style.transform = `translate(calc(-50% + ${wE * innerWidth * 0.7}px), ${118 * dT2 - wE * 60}px) rotate(${-9 * wE}deg) scale(${1 - 0.15 * wE})`;
        const sT = ease(seg(t3, 0.58, 0.66));
        sentpill.style.opacity = String(sT * (1 - seg(t3, 0.8, 0.88)));
        sentpill.style.transform = `translate(-50%, -50%) translateY(150px) scale(${0.9 + 0.1 * sT})`;
        const mfT = seg(t3, 0.72, 0.92);
        if (mfT > 0 && mfT < 1) {
          const from = { x: innerWidth * 0.6, y: 60 };
          const to = chipAt(3);
          const e = easeIO(mfT);
          money.style.opacity = "1";
          money.style.transform = `translate(calc(-50% + ${lerp(from.x, to.x, e)}px), calc(-50% + ${lerp(from.y, to.y, e)}px)) scale(${lerp(1, 0.6, e)})`;
        } else {
          money.style.opacity = "0";
        }
        const resolved = t3 > 0.93;
        chips[3].classList.toggle("recv", resolved);
        const fbBadge = chips[3].querySelector("i");
        if (fbBadge) fbBadge.innerHTML = resolved ? ICN_CHECK : ICN_WARN;

        hint.style.opacity = String((p > 0.9 ? 0 : 1) * (p > 0.02 ? 1 : 0));
      };
      // Coalesce scroll/resize into a single update per animation frame. Without
      // this, update() — heavy layout reads + hundreds of style writes — ran
      // synchronously on every scroll event, which is what made the takeover
      // choppy on mobile. (The hero transition below already does this.)
      let auTick = false;
      const onAudScroll = () => {
        if (auTick) return;
        auTick = true;
        requestAnimationFrame(() => {
          auTick = false;
          update();
        });
      };
      addEventListener("scroll", onAudScroll, { passive: true });
      addEventListener("resize", onAudScroll);
      cleanups.push(() => {
        removeEventListener("scroll", onAudScroll);
        removeEventListener("resize", onAudScroll);
      });
      update();
    })();

    /* ---------- bottom script block ---------- */

    // scroll-entry reveals
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    root.querySelectorAll(".reveal-in").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // count-up numbers (Supy's grow-on-scroll stats, money edition)
    const fmt = (el: HTMLElement, v: number) => {
      const d = +(el.dataset.decimals || 0);
      let s = v.toFixed(d);
      if (el.dataset.commas) {
        const [i, f] = s.split(".");
        s = (+i).toLocaleString("en-US") + (f ? "." + f : "");
      }
      el.textContent = (el.dataset.prefix || "") + s + (el.dataset.suffix || "");
    };
    const runCount = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.count || "0");
      if (reduce) {
        fmt(el, target);
        return;
      }
      const t0 = performance.now();
      const dur = 1300;
      const step = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        fmt(el, target * (1 - Math.pow(1 - p, 4))); /* ease-out quart */
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          countIO.unobserve(e.target);
          runCount(e.target as HTMLElement);
        });
      },
      { threshold: 0.6 },
    );
    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      if (!el.closest(".dash-stage")) countIO.observe(el); /* dash counters fire with the boot */
    });
    cleanups.push(() => countIO.disconnect());

    // dashboard boot: cascade the app to life once it scrolls into view
    (function () {
      const stage = root.querySelector<HTMLElement>(".dash-stage");
      if (!stage) return;
      const order = [
        ".dash-side .dlogo",
        ".dash-side .dnav",
        ".workspace",
        ".dash-head",
        ".kpi",
        ".panel-title",
        ".leak",
        ".p-status",
        ".p-head",
        ".p-hero",
        ".p-listhead",
        ".p-leak",
        ".p-nav",
      ];
      // StrictMode guard: only assign boot indices once
      if (!reduce && !stage.dataset.bootPrepped) {
        stage.dataset.bootPrepped = "1";
        let b = 0;
        order.forEach((sel) =>
          stage.querySelectorAll<HTMLElement>(sel).forEach((el) => {
            el.classList.add("boot-el");
            el.style.setProperty("--b", String(b++));
          }),
        );
      }
      const timers: number[] = [];
      const bootIO = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            bootIO.unobserve(stage);
            timers.push(window.setTimeout(() => stage.classList.add("booted"), 150));
            timers.push(
              window.setTimeout(
                () => stage.querySelectorAll<HTMLElement>("[data-count]").forEach(runCount),
                550,
              ),
            );
          });
        },
        { threshold: 0.25 },
      );
      // hold the boot until the intro has handed off and the glass panel has
      // risen with the hero (dash-stage rise: 720ms delay + 950ms duration) —
      // otherwise the cascade plays hidden behind the intro scrim.
      const armBoot = () => timers.push(window.setTimeout(() => bootIO.observe(stage), 1200));
      if (docEl.classList.contains("intro-pending")) {
        addEventListener("reveal:introdone", armBoot, { once: true });
        cleanups.push(() => removeEventListener("reveal:introdone", armBoot));
      } else {
        armBoot();
      }
      cleanups.push(() => {
        timers.forEach(clearTimeout);
        bootIO.disconnect();
      });
    })();

    // duplicate ticker content for a seamless -50% loop
    const tickerTrack = document.getElementById("tickerTrack");
    if (tickerTrack && !tickerTrack.dataset.duped) {
      tickerTrack.dataset.duped = "1";
      tickerTrack.innerHTML += tickerTrack.innerHTML;
    }

    // ---------- brand intro: food icons arrive, tumble into "reveal.", dock to the nav ----------
    (function () {
      const logo = root.querySelector<HTMLElement>("nav .logo");
      // The root layout's pre-paint boot script decides whether the intro
      // should play this load (first arrival / ?intro=1 / ?no-intro=1) and
      // sets html.intro-pending accordingly. Gate on that class instead of
      // re-reading sessionStorage here (the boot script has already marked
      // the session as seen by the time this effect runs).
      const pending = docEl.classList.contains("intro-pending");
      if (reduce || !logo || !pending) {
        docEl.classList.remove("intro-pending");
        dispatchEvent(new Event("reveal:introdone"));
        return;
      }
      try {
        sessionStorage.setItem("reveal_intro_seen", "1");
      } catch {}
      const svg = (paths: string, sw?: number) =>
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.75}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
      const GLYPHS = [
        { ch: "r", accent: false, os: 1.15, icon: svg('<path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/>') },
        { ch: "e", accent: false, os: 1.0, icon: svg('<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>') },
        { ch: "v", accent: false, os: 1.05, icon: svg('<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/>') },
        { ch: "e", accent: false, os: 1.0, icon: svg('<path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/>') },
        { ch: "a", accent: false, os: 1.15, icon: svg('<path d="M12 22c5.523 0 9-3.477 9-8.5S17.523 2 12 2 3 7.977 3 13.5 6.477 22 12 22z"/>') },
        { ch: "l", accent: false, os: 1.2, icon: svg('<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/>', 1.35) },
        { ch: ".", accent: true, os: 1.2, icon: svg('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>') },
      ];

      const overlay = document.createElement("div");
      overlay.className = "intro-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-label", "Brand intro");
      overlay.innerHTML =
        '<div class="intro-scrim"></div>' +
        '<div class="intro-row">' +
        GLYPHS.map(
          (g, i) =>
            `<div class="intro-glyph" style="animation-delay: ${i * 55}ms">
          <div class="intro-breathe">
            <div class="intro-tumbler${g.accent ? " is-accent" : ""}" style="--tumble-dur: 800ms">
              <div class="intro-content intro-icon" style="transform: scale(${g.os})">${g.icon}</div>
              <div class="intro-content intro-letter${g.accent ? " accent" : ""}">${g.ch}</div>
            </div>
          </div>
        </div>`,
        ).join("") +
        "</div>" +
        '<button type="button" class="intro-skip">Skip intro</button>';
      // appended inside .homev2 (not document.body) so the scoped styles apply;
      // the overlay is position:fixed, so placement in the DOM is invisible.
      root.appendChild(overlay);

      const row = overlay.querySelector<HTMLElement>(".intro-row")!;
      const glyphs = [...overlay.querySelectorAll<HTMLElement>(".intro-glyph")];
      const skip = overlay.querySelector<HTMLElement>(".intro-skip")!;
      logo.style.visibility = "hidden";

      const timers: number[] = [];
      const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

      const finish = () => {
        timers.forEach(clearTimeout);
        docEl.classList.remove("intro-pending");
        logo.style.visibility = "";
        overlay.remove();
        dispatchEvent(new Event("reveal:introdone"));
      };
      skip.addEventListener("click", finish);

      // arrive (staggered via inline animation-delay)
      glyphs.forEach((g) => g.classList.add("arrive"));
      // breathe once each glyph has landed
      glyphs.forEach((g, i) =>
        at(400 + i * 55, () => g.querySelector(".intro-breathe")!.classList.add("is-breathing")),
      );
      // tumble + dissolve into letters
      glyphs.forEach((g, i) =>
        at(700 + i * 80, () => g.querySelector(".intro-tumbler")!.classList.add("is-tumbling")),
      );
      // settle: stop breathing, compact each glyph box to its letter's true width
      at(2020, () => {
        glyphs.forEach((g) => g.querySelector(".intro-breathe")!.classList.remove("is-breathing"));
        const letterEl = overlay.querySelector(".intro-letter")!;
        const cs = getComputedStyle(letterEl);
        const probe = document.createElement("span");
        probe.style.cssText = `position:absolute;visibility:hidden;white-space:pre;top:-9999px;font-family:${cs.fontFamily};font-size:${cs.fontSize};font-weight:${cs.fontWeight};letter-spacing:${cs.letterSpacing};`;
        probe.innerHTML = GLYPHS.map((g) => `<span>${g.ch}</span>`).join("");
        document.body.appendChild(probe);
        const widths = [...probe.querySelectorAll("span")].map((s) => s.getBoundingClientRect().width);
        document.body.removeChild(probe);
        row.style.gap = "0px";
        glyphs.forEach((g, i) => {
          g.style.width = widths[i] + "px";
        });
      });
      // dock: fly the compacted word to the nav logo slot
      at(2380, () => {
        const rr = row.getBoundingClientRect();
        // the nav-drop entrance is paused at translateY(-18px) while the intro
        // runs — measure the logo where it will actually land, not where it is
        const navHost = logo.closest("nav") as HTMLElement;
        const prevAnim = navHost.style.animation;
        navHost.style.animation = "none";
        const lr = logo.getBoundingClientRect();
        navHost.style.animation = prevAnim;
        const introFS =
          parseFloat(getComputedStyle(overlay.querySelector(".intro-letter")!).fontSize) || 72;
        const logoFS = parseFloat(getComputedStyle(logo).fontSize) || 24;
        const s = logoFS / introFS;
        const dx = lr.left + lr.width / 2 - (rr.left + rr.width / 2);
        const dy = lr.top + lr.height / 2 - (rr.top + rr.height / 2);
        row.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
        skip.style.opacity = "0";
      });
      // hand off: page rises behind the docking word, scrim dissolves
      at(2620, () => {
        docEl.classList.remove("intro-pending");
        overlay.classList.add("is-leaving");
        dispatchEvent(new Event("reveal:introdone"));
      });
      at(3080, () => {
        row.style.opacity = "0";
        logo.style.visibility = "";
      });
      at(3220, () => overlay.remove());

      cleanups.push(() => {
        timers.forEach(clearTimeout);
        skip.removeEventListener("click", finish);
        overlay.remove();
        logo.style.visibility = "";
      });
    })();

    // ---------- hero → page transition: video recedes into a rounded card ----------
    (function () {
      const video = root.querySelector<HTMLElement>(".hero-video");
      const wash = root.querySelector<HTMLElement>(".hero-wash");
      const heroTop = root.querySelector<HTMLElement>(".hero-top");
      if (reduce || !video || !wash || !heroTop) return;
      let tick = false;
      const update = () => {
        tick = false;
        const p = Math.min(1, Math.max(0, scrollY / (innerHeight * 0.85)));
        const r = (p * 40).toFixed(1) + "px";
        const s = (1 - p * 0.045).toFixed(4);
        video.style.borderRadius = r;
        video.style.transform = `scale(${s})`;
        wash.style.borderRadius = r;
        wash.style.transform = `scale(${s})`;
        heroTop.style.transform = `translateY(${(-44 * p).toFixed(1)}px)`;
        heroTop.style.opacity = String(1 - 0.55 * p);
      };
      const onScroll = () => {
        if (!tick) {
          tick = true;
          requestAnimationFrame(update);
        }
      };
      addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => removeEventListener("scroll", onScroll));
      update();
    })();

    // how-it-works pinned walkthrough: the step crossing the viewport's
    // center band becomes active — text lights up, stage card swaps,
    // progress dot stretches. (No .hiw markup on this page; kept for parity.)
    const hiwSteps = [...root.querySelectorAll<HTMLElement>(".hiw-step")];
    const hiwCards = [...root.querySelectorAll<HTMLElement>(".hiw-card")];
    const hiwDots = [...root.querySelectorAll<HTMLElement>(".hiw-dots i")];
    if (hiwSteps.length && !reduce) {
      const setStep = (idx: number) => {
        hiwSteps.forEach((s, i) => s.classList.toggle("active", i === idx));
        hiwCards.forEach((c, i) => c.classList.toggle("active", i === idx));
        hiwDots.forEach((d, i) => d.classList.toggle("active", i === idx));
      };
      const stepIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setStep(+(e.target as HTMLElement).dataset.step!);
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      hiwSteps.forEach((s) => stepIO.observe(s));
      setStep(0);
      cleanups.push(() => stepIO.disconnect());
    }

    // mobile hero: keep the desktop dashboard, scaled to fit (Supy-style)
    (() => {
      const desk = root.querySelector<HTMLElement>(".dash-desk");
      const glass = root.querySelector<HTMLElement>(".dash-glass");
      if (!desk || !glass) return;
      const DESKW = 920;
      const scaleDash = () => {
        if (innerWidth > 900) {
          desk.style.width = "";
          desk.style.transform = "";
          glass.style.height = "";
          return;
        }
        desk.style.width = DESKW + "px";
        const s = (glass.clientWidth - 24) / DESKW;
        desk.style.transformOrigin = "top left";
        desk.style.transform = `scale(${s})`;
        glass.style.height = desk.offsetHeight * s + 24 + "px";
      };
      addEventListener("resize", scaleDash);
      addEventListener("load", scaleDash);
      scaleDash();
      const t = window.setTimeout(scaleDash, 300);
      cleanups.push(() => {
        removeEventListener("resize", scaleDash);
        removeEventListener("load", scaleDash);
        clearTimeout(t);
      });
    })();

    // screenshot/debug aid: ?static reveals all scroll-triggered content instantly
    if (location.search.includes("static")) {
      docEl.classList.remove("intro-pending");
      root.querySelectorAll(".reveal-in").forEach((e) => e.classList.add("vis"));
      root.querySelectorAll(".dash-stage").forEach((e) => e.classList.add("booted"));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="homev2" ref={rootRef}>
      <SiteNav page="home" />

      {/* ================= HERO ================= */}
      <header className="hero">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="https://mrlkjxt3lsgrbzoh.public.blob.vercel-storage.com/intermission-poster.jpg"
          aria-hidden="true"
        >
          <source src="https://mrlkjxt3lsgrbzoh.public.blob.vercel-storage.com/intermission.mp4" type="video/mp4" />
        </video>
        <div className="hero-wash" aria-hidden="true"></div>
        <div className="hero-top">
          <h1>
            The auditing system <br />
            for independent restaurants.
          </h1>
          <p className="sub">
            AI that checks every payment in and out of your restaurant, and recovers the ones that are wrong.
          </p>
          <HomeWaitlist source="hero_inline" />
          <div className="proof-chip">
            <span className="tick"><IcCheck /></span>
            <span>
              <strong>$1,297.87</strong> caught at Tuk Tuk Thai Grill in month one.
            </span>
          </div>
        </div>

        <div className="dash-stage dash-app" role="img" aria-label="Preview of the Reveal dashboard on desktop and mobile">
          <div className="dash-glass">
            <div className="dash-desk">
              <aside className="dash-side">
                <div className="dlogo">
                  reveal<em>.</em>
                </div>
                <div className="dnav active">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  Home
                </div>
                <div className="dnav">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                  </svg>
                  Leaks
                  <span className="badge">4</span>
                </div>
                <div className="dnav">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  Commitments
                </div>
                <div className="dnav">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  Pulse
                </div>
                <div className="spacer"></div>
                <div className="workspace">
                  <div className="wmark">TT</div>
                  <div>
                    <div className="wname">Tuk Tuk Thai Grill</div>
                    <div className="wplan">Denver, CO</div>
                  </div>
                </div>
              </aside>

              <div className="dash-main">
                <div className="dash-head">
                  <span className="ht">Home</span>
                  <div className="head-tools">
                    <span className="sync">
                      <i></i>Synced 2 min ago
                    </span>
                    <span className="search">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      Search<kbd>⌘K</kbd>
                    </span>
                    <span className="bell">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                      <i className="nub"></i>
                    </span>
                    <span className="dash-avatar">K</span>
                  </div>
                </div>

                <div className="kpis">
                  <div className="kpi">
                    <div className="label">
                      <span className="live" aria-hidden="true"></span>Leaking now
                    </div>
                    <div className="value red" data-count="1240" data-prefix="$" data-commas="1">
                      $1,240
                    </div>
                    <div className="meta">4 open · this week</div>
                  </div>
                  <div className="kpi">
                    <div className="label">Recovered</div>
                    <div className="value green" data-count="1247" data-prefix="$" data-commas="1">
                      $1,247
                    </div>
                    <div className="meta">this month</div>
                    <svg className="spark" viewBox="0 0 64 26" aria-hidden="true">
                      <defs>
                        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#355E3B" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#355E3B" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path className="fill" fill="url(#sparkfill)" d="M2,21 L14,19 L26,19.5 L38,13 L50,10 L60,4 L60,26 L2,26 Z" />
                      <polyline points="2,21 14,19 26,19.5 38,13 50,10 60,4" />
                      <circle className="tip" cx="60" cy="4" r="2" />
                    </svg>
                  </div>
                  <div className="kpi">
                    <div className="label">Checked</div>
                    <div className="value" data-count="217">
                      217
                    </div>
                    <div className="meta">payments · this week</div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-title">
                    <span className="pt-left">
                      Open leaks<span className="count tnum">4 open</span>
                    </span>
                    <span className="viewall">
                      View all
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  </div>
                  <div className="leak is-new">
                    <span className="mono">PS</span>
                    <div className="what">
                      <b>Produce Supplier</b>
                      <span>Case price crept up: $48 vs the $39 you usually pay</span>
                    </div>
                    <span className="amt tnum">
                      −$184<small>today</small>
                    </span>
                    <button className="act" type="button">
                      Fix it
                    </button>
                  </div>
                  <div className="leak">
                    <span className="mono dp">DP</span>
                    <div className="what">
                      <b>Delivery Platform</b>
                      <span>Payout was $4,210. Your orders say $4,552</span>
                    </div>
                    <span className="amt tnum">
                      −$342<small>May 15</small>
                    </span>
                    <button className="act" type="button">
                      Fix it
                    </button>
                  </div>
                  <div className="leak">
                    <span className="mono">PS</span>
                    <div className="what">
                      <b>Produce Supplier · credit</b>
                      <span>Recovered · vendor issued a credit memo</span>
                    </div>
                    <span className="amt ok tnum">
                      +$214<small>May 12</small>
                    </span>
                    <button className="act ghost" type="button">
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-phone" aria-hidden="true">
            <div className="phone-screen">
              <div className="p-status">
                <span className="p-time tnum">9:41</span>
                <span className="p-isl" aria-hidden="true"></span>
                <span className="p-glyphs">
                  <svg viewBox="0 0 18 12" fill="currentColor">
                    <rect x="0" y="8" width="3" height="4" rx="0.8" />
                    <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
                    <rect x="10" y="3" width="3" height="9" rx="0.8" />
                    <rect x="15" y="0.5" width="3" height="11.5" rx="0.8" />
                  </svg>
                  <svg viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M1.5 4.5a10 10 0 0 1 13 0" />
                    <path d="M4 7.5a6.5 6.5 0 0 1 8 0" />
                    <circle cx="8" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                  <svg viewBox="0 0 25 12" fill="none">
                    <rect x="0.7" y="0.7" width="21" height="10.6" rx="3" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
                    <rect x="2.5" y="2.5" width="14" height="7" rx="1.6" fill="currentColor" />
                    <path d="M23.5 4v4a2.2 2.2 0 0 0 0-4z" fill="currentColor" opacity="0.5" />
                  </svg>
                </span>
              </div>
              <div className="p-head">Hi there · Your Restaurant</div>
              <div className="p-sub">
                <i></i>Watching · updated just now
              </div>
              <div className="p-hero">
                <div className="amt tnum">
                  $1,240<span className="unit">leaking</span>
                </div>
                <div className="recovered tnum"><IcCheck /> $1,247 recovered</div>
              </div>
              <div className="p-listhead">
                <span>OPEN LEAKS</span>
                <span className="tnum">4</span>
              </div>
              <div className="p-leak">
                <div className="l1">
                  <b>Produce Supplier</b>
                  <span className="amt tnum">−$184</span>
                </div>
                <div className="l2">
                  <span>$48 vs usual $39</span>
                  <button className="p-fix" type="button">
                    Fix
                  </button>
                </div>
              </div>
              <div className="p-leak">
                <div className="l1">
                  <b>Delivery Platform</b>
                  <span className="amt tnum">−$342</span>
                </div>
                <div className="l2">
                  <span>Payout short 4 orders</span>
                  <button className="p-fix" type="button">
                    Fix
                  </button>
                </div>
              </div>
              <div className="p-nav">
                <span className="it on">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                </span>
                <span className="it">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </span>
                <span className="plus">+</span>
                <span className="it">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </span>
                <span className="it">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= PAIN (inset container) ================= */}
      <section className="inset" style={{ paddingTop: "210px" }}>
        <div className="ticker-band" aria-hidden="true" style={{ marginBottom: "70px" }}>
          <div className="ticker-track" id="tickerTrack">
            <span className="tick-item">
              <span className="ok"><IcCheck /></span> Produce invoice #48211 <small>checked against your price list</small>
            </span>
            <span className="tick-item">
              <span className="warn-i"><IcWarn /></span> Onion, 50 lb <small>+72% vs last three invoices</small>
            </span>
            <span className="tick-item">
              <span className="ok"><IcCheck /></span> Delivery payout, Mar 12 <small>matched POS sales</small>
            </span>
            <span className="tick-item">
              <span className="warn-i"><IcWarn /></span> Delivery payout, Mar 14 <small>$312.40 short</small>
            </span>
            <span className="tick-item">
              <span className="ok"><IcCheck /></span> Linen service invoice <small>matched your contract</small>
            </span>
            <span className="tick-item">
              <span className="ok"><IcCheck /></span> Card processing fees, Feb <small>matched your agreement</small>
            </span>
            <span className="tick-item">
              <span className="warn-i"><IcWarn /></span> Lease CAM charge, Q1 <small>escalation math off by $89.12/mo</small>
            </span>
            <span className="tick-item">
              <span className="ok"><IcCheck /></span> Dairy invoice #4471 <small>checked against your price list</small>
            </span>
          </div>
        </div>
        <div className="sect-head reveal-in">
          <div className="chip chip--amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Where it hides
          </div>
          <h2>You&apos;re paying for other people&apos;s mistakes.</h2>
          <p className="sub" style={{ margin: "18px auto 0" }}>
            A vendor&apos;s price creeps. A payout comes in short. A lease charge doesn&apos;t match the lease. Real findings from Tuk Tuk Thai Grill in Denver, month one:
          </p>
        </div>
        <div className="pain-grid">
          <div className="pain-card reveal-in" style={{ "--i": 0 } as React.CSSProperties}>
            <div className="pc-top">
              <span className="pc-id">Finding 03 · Vendor</span>
              <span className="pc-real"><IcCheck /> Real</span>
            </div>
            <div className="num" data-count="72" data-prefix="+" data-suffix="%">
              +72%
            </div>
            <h4>A vendor slips the price</h4>
            <p>Onion prices crept up 72% across three invoices. No notice, no renegotiation. Just a bigger number each week.</p>
            <div className="pc-math">
              Same onions. <b>$0.62/lb → $1.07/lb</b> in three invoices.
            </div>
          </div>
          <div className="pain-card reveal-in" style={{ "--i": 1 } as React.CSSProperties}>
            <div className="pc-top">
              <span className="pc-id">Finding 11 · Payout</span>
              <span className="pc-real"><IcCheck /> Real</span>
            </div>
            <div className="num" data-count="312.40" data-prefix="$" data-decimals="2">
              $312.40
            </div>
            <h4>A payout comes up short</h4>
            <p>The delivery app&apos;s deposit didn&apos;t match what you actually sold. It rarely does, and nobody checks the math.</p>
            <div className="pc-math">
              Orders say <b>$4,552</b>. Deposit was <b>$4,239.60</b>.
            </div>
          </div>
          <div className="pain-card reveal-in" style={{ "--i": 2 } as React.CSSProperties}>
            <div className="pc-top">
              <span className="pc-id">Finding 17 · Lease</span>
              <span className="pc-real"><IcCheck /> Real</span>
            </div>
            <div className="num" data-count="89.12" data-prefix="$" data-decimals="2" data-suffix="/mo">
              $89.12/mo
            </div>
            <h4>The lease escalates wrong</h4>
            <p>Your rent escalation kicked in with arithmetic that doesn&apos;t match the lease you signed. Every month, forever.</p>
            <div className="pc-math">
              Lease math says <b>$2,215/mo</b>. Billed <b>$2,304.12</b>.
            </div>
          </div>
        </div>
      </section>

      {/* ================= DALE BEAT ================= */}
      <section className="plain">
        <div className="dale reveal-in">
          <h2>
            Big chains have audit teams checking every invoice and payout. Independents have nobody. <b>Reveal is that team, automated.</b>
          </h2>
          <div className="byline">
            <img className="avatar" src="/founder-chayadol.png" alt="Chayadol Sundarapura" />
            <div className="who">
              <b>Chayadol Sundarapura</b>
              <span>Founder, building Reveal inside a working restaurant</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (breathing-inset scroll takeover) ================= */}
      <div className="aud-track" id="audTrack">
        <span id="how" style={{ position: "absolute", top: 0 }}></span>
        <div className="aud-pin">
          <div className="aud-stage" id="audStage">
            <div className="aud-intro" id="audIntro">
              <div className="aud-chip">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 14, height: 14, flex: "none" }}
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                How it works
              </div>
              <h2>You run the restaurant. Reveal runs the audit.</h2>
            </div>
            <div className="aud-caption">
              <div className="aud-beat" id="audB0">
                <div className="aud-kicker">01 · Connect</div>
                <h3>Connect once. Read-only.</h3>
              </div>
              <div className="aud-beat" id="audB1">
                <div className="aud-kicker">02 · Audit</div>
                <h3>Everything, reconciled.</h3>
              </div>
              <div className="aud-beat" id="audB2">
                <div className="aud-kicker">03 · Catch</div>
                <h3>Caught with proof. Ready to send.</h3>
              </div>
            </div>
            <div className="aud-dock" id="audDock">
              <span className="aud-dchip" id="audD0">
                Delivery payouts<i className="w"><IcWarn /></i>
              </span>
              <span className="aud-dchip" id="audD1">
                Lease &amp; rent<i className="w"><IcWarn /></i>
              </span>
              <span className="aud-dchip" id="audD2">
                Deadlines &amp; renewals<i className="k"><IcCheck /></i>
              </span>
              <span className="aud-dchip" id="audD3">
                F&amp;B invoices<i className="w"><IcWarn /></i>
              </span>
            </div>
            <div className="aud-scene">
              <div className="aud-anchor" id="audAnchor">
                <svg className="aud-wires" viewBox="-550 -350 1100 700" aria-hidden="true">
                  <line id="audW0" pathLength={1} x1="-72" y1="-33" x2="-380" y2="-172" />
                  <line id="audW1" pathLength={1} x1="74" y1="-24" x2="392" y2="-128" />
                  <line id="audW2" pathLength={1} x1="-71" y1="30" x2="-356" y2="152" />
                  <line id="audW3" pathLength={1} x1="69" y1="34" x2="404" y2="196" />
                </svg>
                <div className="aud-ring" id="audRing"></div>
                <div className="aud-hub" id="audHub">
                  <img src="/reveal-logo.png" alt="Reveal" />
                </div>
                <span className="aud-src" id="audS0">
                  <span className="aud-fl">Bank</span>
                </span>
                <span className="aud-src" id="audS1">
                  <span className="aud-fl" style={{ animationDelay: "-1.4s" }}>
                    Point of sale
                  </span>
                </span>
                <span className="aud-src" id="audS2">
                  <span className="aud-fl" style={{ animationDelay: "-2.7s" }}>
                    Delivery apps
                  </span>
                </span>
                <span className="aud-src" id="audS3">
                  <span className="aud-fl" style={{ animationDelay: "-3.9s" }}>
                    Invoices &amp; contracts
                  </span>
                </span>
                <span className="aud-rolock" id="audLock">
                  <IcLock /> Read-only. Reveal can look, never touch.
                </span>
                <div className="aud-scrap" data-i="0">
                  <span className="aud-k">
                    DoorDash payout<small>Mar 14 · bank</small>
                  </span>
                  <b className="aud-n">
                    $8,099.50<span className="aud-delta">−$312.40</span>
                  </b>
                </div>
                <div className="aud-scrap" data-i="1">
                  <span className="aud-k">
                    Delivery sales<small>Mar 8–14 · POS</small>
                  </span>
                  <b className="aud-n">$8,411.90</b>
                </div>
                <div className="aud-scrap" data-i="2">
                  <span className="aud-k">
                    Rent charge<small>Mar 1 · Propco LLC</small>
                  </span>
                  <b className="aud-n">
                    $2,199.12<span className="aud-delta">+$89.12</span>
                  </b>
                </div>
                <div className="aud-scrap" data-i="3">
                  <span className="aud-k">
                    Lease, §4.2<small>Q1 monthly rent</small>
                  </span>
                  <b className="aud-n">$2,110.00</b>
                </div>
                <div className="aud-scrap" data-i="4">
                  <span className="aud-k">
                    Liquor license<small>City of Denver</small>
                  </span>
                  <b className="aud-n">Aug 30</b>
                </div>
                <div className="aud-scrap" data-i="5">
                  <span className="aud-k">
                    Reveal reminder<small>45 days ahead</small>
                  </span>
                  <b className="aud-n">Jul 16</b>
                </div>
                <div className="aud-scrap" data-i="6">
                  <span className="aud-k">
                    Onion, 50 lb<small>Invoice #48211</small>
                  </span>
                  <b className="aud-n">
                    $1.82/lb<span className="aud-delta">+72%</span>
                  </b>
                </div>
                <div className="aud-scrap" data-i="7">
                  <span className="aud-k">
                    Agreed price<small>Nov · price list</small>
                  </span>
                  <b className="aud-n">$1.06/lb</b>
                </div>
                <span className="aud-pairb w" data-p="0">
                  <IcWarn />
                </span>
                <span className="aud-pairb w" data-p="1">
                  <IcWarn />
                </span>
                <span className="aud-pairb k" data-p="2">
                  <IcCheck />
                </span>
                <span className="aud-pairb w" data-p="3">
                  <IcWarn />
                </span>
                <div className="aud-proof" id="audProof">
                  <div className="aud-rlabel">Finding · onion 50 lb, invoice #48211</div>
                  <div className="aud-rrow">
                    <span>You agreed</span>
                    <span className="aud-rval" style={{ color: "var(--muted)" }}>
                      $1.06/lb
                    </span>
                  </div>
                  <div className="aud-rrow">
                    <span>You were charged</span>
                    <span className="aud-rval" style={{ color: "var(--error)" }}>
                      $1.82/lb
                    </span>
                  </div>
                  <div className="aud-rrow">
                    <span>
                      <b>Overpaid, 3 invoices</b>
                    </span>
                    <span className="aud-rval" style={{ color: "var(--error)" }}>
                      $214.60
                    </span>
                  </div>
                </div>
                <div className="aud-disp" id="audDisp">
                  <div className="aud-nhead">Dispute · invoice #48211</div>
                  <div className="aud-nline" style={{ width: "92%" }}></div>
                  <div className="aud-nline" style={{ width: "74%" }}></div>
                  <div className="aud-nline" style={{ width: "40%" }}></div>
                </div>
                <span className="aud-sent" id="audSent">
                  <IcCheck /> Sent
                </span>
                <span className="aud-money" id="audMoney">
                  $214.60
                </span>
              </div>
              <div className="aud-hint" id="audHint">
                Scroll ↓
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="inset aud-fallback" id="how-fallback">
        <div className="sect-head">
          <div className="chip chip--slate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            How it works
          </div>
          <h2>You run the restaurant. Reveal runs the audit.</h2>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="aud-fstep">
            <div className="aud-fk">01 · Connect</div>
            <h3>Connect once. Read-only.</h3>
            <p>Bank, POS, delivery apps, and the paperwork you already keep. Reveal can look. It can never touch.</p>
          </div>
          <div className="aud-fstep">
            <div className="aud-fk">02 · Audit</div>
            <h3>Everything, reconciled.</h3>
            <p>
              Reveal&apos;s AI reads your invoices, contracts, and payouts, and compares every number against what you agreed to pay and the sales you actually made.
            </p>
          </div>
          <div className="aud-fstep">
            <div className="aud-fk">03 · Catch</div>
            <h3>Caught with proof. Ready to send.</h3>
            <p>The wrong number, the right number, and the note that gets your money back. You press send.</p>
          </div>
        </div>
      </section>

      {/* ================= WHY REVEAL (bento grid, stat as hero cell) ================= */}
      <section className="inset" id="why">
        <div className="sect-head reveal-in" style={{ maxWidth: 1200 }}>
          <div className="chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 6v12" />
            </svg>
            Why Reveal
          </div>
          <h2 className="one-line">It pays for itself. Then it keeps paying.</h2>
        </div>
        <div className="bento">
          <div className="bento-cell bento-hero reveal-in" style={{ "--i": 0 } as React.CSSProperties}>
            <h4>Get your money back</h4>
            <p>Money you were owed, found and returned to your account.</p>
            <div className="big" data-count="1297.87" data-prefix="$" data-decimals="2" data-commas="1">
              $1,297.87
            </div>
            <div className="biglabel">Recovered in month one, single location. The owner thought his numbers were fine.</div>
            <div className="vig vig-recover" aria-hidden="true">
              <div className="vrow2">
                <span>
                  <b>Delivery payout, Mar 14</b>
                  <br />
                  <small>$312.40 short vs POS sales</small>
                </span>
                <span className="pill-stack">
                  <span className="pill flag">Flagged</span>
                  <span className="pill rec">Recovered</span>
                </span>
              </div>
              <div className="vrow2">
                <span>
                  <b>Lease CAM charge, Q1</b>
                  <br />
                  <small>$89.12/mo over the lease terms</small>
                </span>
                <span className="pill rec">Recovered</span>
              </div>
              <div className="vrow2">
                <span>
                  <b>Produce Supplier · credit</b>
                  <br />
                  <small>+$214 credit memo issued</small>
                </span>
                <span className="pill rec">Recovered</span>
              </div>
            </div>
          </div>
          <div className="bento-cell bento-card reveal-in" style={{ "--i": 1 } as React.CSSProperties}>
            <h4>Fix it, not just find it</h4>
            <p>The proof is assembled, the note is written. You press send.</p>
            <div className="vig vig-note" aria-hidden="true">
              <b style={{ fontSize: 12 }}>Dispute note, invoice #48211</b>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <span className="send">Send →</span>
            </div>
          </div>
          <div className="bento-cell bento-card reveal-in" style={{ "--i": 2 } as React.CSSProperties}>
            <h4>Know where every dollar goes</h4>
            <p>Every payment in and out, checked in one place.</p>
            <div className="vig vig-feed" aria-hidden="true">
              <div className="vrow2">
                <span>Produce invoice #48211</span>
                <span className="tick"><IcCheck /></span>
              </div>
              <div className="vrow2">
                <span>Delivery payout, Mar 12</span>
                <span className="tick"><IcCheck /></span>
              </div>
              <div className="vrow2">
                <span>Card processing fees, Feb</span>
                <span className="tick"><IcCheck /></span>
              </div>
            </div>
          </div>
          <div className="bento-cell bento-wide reveal-in" style={{ "--i": 3 } as React.CSSProperties}>
            <div>
              <h4>No new work for you</h4>
              <p>Nothing to learn, nothing to reconcile. A few plain-English alerts a week.</p>
            </div>
            <div className="vig vig-alert" aria-hidden="true">
              <div className="bubble">Onion price crept up 72% on today&apos;s invoice. Want it disputed?</div>
              <div className="bubble">
                <b>Yes, send it.</b>
              </div>
            </div>
          </div>
        </div>
        <p className="bento-foot reveal-in">
          Read-only. Fifteen minutes to connect. <b>If Reveal finds nothing, you&apos;ve lost nothing.</b>
        </p>
      </section>

      {/* ================= CLOSER (dark bookend) ================= */}
      <section className="closer" id="closer">
        <div className="reveal-in">
          <h2>Stop paying for other people&apos;s mistakes.</h2>
          <p className="sub">Join the waitlist and be first in line when Reveal opens up.</p>
          <HomeWaitlist source="closer_inline" />
          <p className="closer-note">
            Started it because my parents own a restaurant. Watched them run on instinct for 20 years: sales in their POS, vendors in their phones, renewal dates in my mom&apos;s head. Building the tool I wish they&apos;d had.
          </p>
        </div>
      </section>

      <footer>
        <a className="logo" href="#" style={{ fontSize: 20 }}>
          reveal<em>.</em>
        </a>
        <div>
          <a href="/our-story">Our story</a>
          <a href="/blog">Blog</a>
          <a href="/privacy">Privacy</a>
          <span style={{ marginLeft: 22 }}>© 2026 Reveal Labs</span>
        </div>
      </footer>
    </div>
  );
}
