"use client";

/**
 * Dashboard preview — phone screens.
 * Ported verbatim from the approved Claude Design prototype (dash-webv3).
 * Presentational only; the orchestration + timeline live in DashboardPreview.tsx.
 */
import { useEffect, useState } from "react";

type RippleTarget = string | null | undefined;

/* --- icons --- */
const Icon = {
  gear: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  more: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" />
    </svg>
  ),
  home: (color = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  ),
  list: (color = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" />
    </svg>
  ),
  pulse: (color = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </svg>
  ),
  dots: (color = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
      <circle cx="6" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="18" cy="12" r="1.8" />
    </svg>
  ),
  plus: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  dollar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7" />
    </svg>
  ),
  ribbon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
    </svg>
  ),
  chevRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  arrowRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
};

/* --- status bar --- */
function StatusBar() {
  return (
    <div className="status-bar">
      <span>4:25</span>
      <div className="status-icons">
        <svg width="17" height="11" viewBox="0 0 17 11"><g fill="#14171F"><rect x="0" y="6" width="3" height="5" rx="0.7" /><rect x="4.5" y="4" width="3" height="7" rx="0.7" /><rect x="9" y="2" width="3" height="9" rx="0.7" /><rect x="13.5" y="0" width="3" height="11" rx="0.7" /></g></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 10.2c.7 0 1.3-.6 1.3-1.3S8.7 7.6 8 7.6s-1.3.6-1.3 1.3S7.3 10.2 8 10.2zM4.4 6.6l1 1c.8-.8 2-1.3 3.2-1.3a4.4 4.4 0 0 1 3.2 1.3l1-1A5.8 5.8 0 0 0 8 4.9a5.8 5.8 0 0 0-3.6 1.7zM1.8 4l1 1A8.2 8.2 0 0 1 8 2.6c2 0 3.8.8 5.2 2.4l1-1A9.6 9.6 0 0 0 8 1.2 9.6 9.6 0 0 0 1.8 4z" fill="#14171F" /></svg>
        <svg width="26" height="11" viewBox="0 0 26 11" fill="none"><rect x="0.5" y="0.5" width="22" height="10" rx="2.4" stroke="#14171F" opacity="0.4" /><rect x="2" y="2" width="19" height="7" rx="1.2" fill="#14171F" /><rect x="23" y="3.5" width="1.5" height="4" rx="0.6" fill="#14171F" opacity="0.4" /></svg>
      </div>
    </div>
  );
}

/* --- bottom nav --- */
function BottomNav({ active = "home", rippleTarget }: { active?: string; rippleTarget?: RippleTarget }) {
  return (
    <div className="dpv-nav">
      <div className={`nav-item ${active === "home" ? "active" : ""}`}>
        {active === "home" ? Icon.home("#14171F") : Icon.home("#9AA0AA")}
        <span>Home</span>
      </div>
      <div className={`nav-item ${active === "commitments" ? "active" : ""}`} style={{ position: "relative" }}>
        {Icon.list(active === "commitments" ? "#14171F" : "#9AA0AA")}
        <span>Commitments</span>
        {rippleTarget === "commitments" && <Ripple />}
      </div>
      <div className="nav-add" data-tap="plus">
        {Icon.plus}
        {rippleTarget === "plus" && <Ripple light />}
      </div>
      <div className="nav-item">
        {Icon.pulse("#9AA0AA")}
        <span>Pulse</span>
      </div>
      <div className="nav-item">
        {Icon.dots("#9AA0AA")}
        <span>More</span>
      </div>
    </div>
  );
}

function Ripple({ light }: { light?: boolean }) {
  return (
    <div
      className="ripple"
      style={{ left: "50%", top: "50%", background: light ? "rgba(255,255,255,0.5)" : "rgba(20,23,31,0.5)" }}
    />
  );
}

/* --- count-up hook --- */
function useCountUp(target: number, duration = 1100, deps: unknown[] = []) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | undefined;
    let raf = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return val;
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

/* ============ HOME ============ */
export function HomeScreen({ rippleTarget }: { rippleTarget?: RippleTarget }) {
  const amt = useCountUp(1240, 1100, []);
  return (
    <div className="screen-layer-inner">
      <StatusBar />
      <div className="scroll-body">
        <div className="top-bar">
          <div className="icon-btn">{Icon.gear}</div>
          <div className="top-title">
            <div className="top-title-name">Your Restaurant</div>
            <div className="top-title-sub">May 20th, 2026 · Sync now</div>
          </div>
          <div className="icon-btn">{Icon.bell}</div>
        </div>

        <div className="head-amt">
          <span className="head-amt-num">${fmt(amt)}</span>
          <span className="head-amt-lbl">leaking</span>
        </div>
        <div className="head-sub">this month · across 3 things</div>

        <div className="saved-chip">
          <span className="check">✓</span>
          <span>$1,247 saved this month</span>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-lbl">FOOD</div>
            <div className="stat-val green"><span className="pip" /> 28%</div>
          </div>
          <div className="stat">
            <div className="stat-lbl">LABOR</div>
            <div className="stat-val amber"><span className="pip" /> 33%</div>
          </div>
          <div className="stat">
            <div className="stat-lbl">PRIME</div>
            <div className="stat-val red"><span className="pip" /> 61%</div>
          </div>
        </div>

        <div className="sec-label">
          <span>LEAKS THIS MONTH</span>
          <span className="sec-count">3</span>
        </div>

        <div className="stagger">
          <LeakRow amount="−$560" source="Produce Supplier" reason="billed for 5 cases you never got" />
          <LeakRow amount="−$420" source="DoorDash" reason="charging 23.2%, your deal is 22%" tapTarget={rippleTarget === "doordash"} />
          <LeakRow amount="−$260" source="Linen Service" reason="surcharges you didn't agree to" />
        </div>
      </div>

      <BottomNav active="home" rippleTarget={rippleTarget} />
    </div>
  );
}

function LeakRow({ amount, source, reason, tapTarget }: { amount: string; source: string; reason: string; tapTarget?: boolean }) {
  return (
    <div className="leak compact" style={{ position: "relative" }}>
      <div className="leak-row">
        <div className="leak-chip">{amount}</div>
        <div className="leak-vendor">{source}</div>
        <div className="leak-chev">{Icon.chevRight}</div>
      </div>
      <div className="leak-msg">{reason}</div>
      {tapTarget && <div className="ripple" style={{ left: "50%", top: "50%" }} />}
    </div>
  );
}

/* ============ FLAG DETAIL (DoorDash) ============ */
export function FlagScreen({ rippleTarget }: { rippleTarget?: RippleTarget }) {
  return (
    <div className="screen-layer-inner">
      <StatusBar />
      <div className="scroll-body">
        <div className="detail-head">
          <div className="back-btn">{Icon.back}</div>
          <div>
            <div className="detail-title-name">Leak detail</div>
            <div className="detail-title-sub">Open · flagged today</div>
          </div>
          <div className="back-btn">{Icon.more}</div>
        </div>

        <div className="tag-row" style={{ marginTop: 4 }}>
          <span className="tag-red">−$420 · commission overcharge</span>
        </div>

        <div className="detail-vendor">DoorDash</div>

        <div className="panel build">
          <div className="panel-label">THE MATH</div>

          <div className="build-row b1">
            <div className="build-line">
              <span className="build-lbl">Orders this month</span>
              <span className="build-val">$35,000</span>
            </div>
          </div>

          <div className="build-row b2 split">
            <div className="split-cell">
              <div className="split-lbl">They kept</div>
              <div className="split-val red">23.2%</div>
            </div>
            <div className="split-cell">
              <div className="split-lbl">Your deal</div>
              <div className="split-val">22%</div>
            </div>
          </div>

          <div className="build-row b3">
            <div className="over-block">
              <div className="over-lbl">−$420 over</div>
              <div className="over-sub">1.2% more than your contract, on every order.</div>
            </div>
          </div>
        </div>

        <div className="fix-row build-row b4">
          <button className="fix-pill">
            Dispute drafted {Icon.arrowRight}
          </button>
        </div>
      </div>

      <BottomNav active="home" rippleTarget={rippleTarget} />
    </div>
  );
}

/* ============ CAPTURE (camera → shutter → scan → pan to extract) ============ */
export function CaptureScreen({ rippleTarget }: { rippleTarget?: RippleTarget }) {
  return (
    <div className="screen-layer-inner capture-stage">
      <StatusBar />

      <div className="cap-pan">
        <div className="cap-bill-area">
          <div className="scan-bill">
            <div className="bill-head">PRODUCE SUPPLIER</div>
            <div className="bill-meta">INV #87432 · 05/20/26</div>
            <div className="bill-rows">
              <div className="bill-line"><span>Tomatoes 25lb</span><span>$42.00</span></div>
              <div className="bill-line"><span>Chicken case</span><span>$48.00</span></div>
              <div className="bill-line"><span>Onions 50lb</span><span>$18.00</span></div>
            </div>
            <div className="bill-total"><span>TOTAL</span><span>$108.00</span></div>
            <div className="scan-sweep" />
            <div className="scan-glow" />
          </div>
        </div>

        <div className="extract-section">
          <div className="sec-label">
            <span>READING</span>
            <span style={{ color: "var(--green)", fontWeight: 700, letterSpacing: "0.06em", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="live-dot" /> LIVE
            </span>
          </div>
          <div className="extract-list">
            <div className="extract-line ex1">
              <div className="extract-name">Tomatoes</div>
              <div className="extract-amt">$42</div>
            </div>
            <div className="extract-line ex2 flag">
              <div>
                <div className="extract-name">Chicken</div>
                <div className="extract-flag">↑ 23% over usual</div>
              </div>
              <div className="extract-amt">$48</div>
            </div>
            <div className="extract-line ex3">
              <div className="extract-name">Onions</div>
              <div className="extract-amt">$18</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cam-top">
        <div className="cam-x">✕</div>
        <div className="cam-title">Capture bill</div>
        <div style={{ width: 36 }} />
      </div>

      <div className="cam-frame">
        <div className="frame-corner tl" />
        <div className="frame-corner tr" />
        <div className="frame-corner bl" />
        <div className="frame-corner br" />
      </div>

      <div className="cam-bottom">
        <div className="cam-mode">PHOTO</div>
        <div className="shutter cam-shutter">
          <span className="shutter-inner" />
        </div>
        <div className="cam-mode active">SCAN</div>
      </div>

      <div className="cam-flash" />

      <BottomNav active="home" rippleTarget={rippleTarget} />
    </div>
  );
}

/* ============ COMMITMENTS ============ */
export function CommitmentsScreen({ rippleTarget }: { rippleTarget?: RippleTarget }) {
  return (
    <div className="screen-layer-inner">
      <StatusBar />
      <div className="scroll-body">
        <div className="top-bar">
          <div className="icon-btn">{Icon.gear}</div>
          <div className="top-title">
            <div className="top-title-name">Commitments</div>
            <div className="top-title-sub">7 watched</div>
          </div>
          <div className="icon-btn">{Icon.bell}</div>
        </div>

        <div className="com-amt">
          <span className="com-amt-num">$17,400</span>
          <span className="com-amt-unit">/mo</span>
        </div>
        <div className="com-sub">7 RECURRING · MONEY GOING OUT EACH MONTH</div>

        <div className="stacked-bar">
          <div className="bar-seg dark" style={{ flex: 9.1 }}>VEN</div>
          <div className="bar-seg green" style={{ flex: 7.2 }}>RNT</div>
          <div className="bar-seg lt-green" style={{ flex: 1 }} />
          <div className="bar-seg gray" style={{ flex: 0.8 }} />
        </div>

        <div className="legend">
          <div className="lg">
            <div className="lg-left"><span className="lg-dot dark" />VENDORS</div>
            <div className="lg-amt">$9.1k</div>
          </div>
          <div className="lg">
            <div className="lg-left"><span className="lg-dot green" />RENT</div>
            <div className="lg-amt">$7.2k</div>
          </div>
          <div className="lg">
            <div className="lg-left"><span className="lg-dot lt-green" />UTILITIES</div>
            <div className="lg-amt">$155</div>
          </div>
          <div className="lg">
            <div className="lg-left"><span className="lg-dot gray" />OTHER</div>
            <div className="lg-amt">$952</div>
          </div>
        </div>

        <div className="chips">
          <div className="chip active">ALL <span className="chip-n" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>7</span></div>
          <div className="chip">VENDORS <span className="chip-n">2</span></div>
          <div className="chip">RENT <span className="chip-n">1</span></div>
        </div>

        <div className="sec-label" style={{ marginTop: 16 }}>
          <span>COMING UP</span>
          <span style={{ color: "var(--ink-2)", fontWeight: 500, letterSpacing: "0.02em", fontSize: 11 }}>next 14 days</span>
        </div>

        <div className="stagger">
          <div className="row-pill">
            <div className="row-ico green">{Icon.home("#fff")}</div>
            <div className="row-main">
              <div className="row-title">Rent</div>
              <div className="row-sub">due in 4 days</div>
            </div>
            <div className="row-amt">$7,200</div>
          </div>

          <div className="row-pill">
            <div className="row-ico" style={{ background: "#14171F" }}>{Icon.dollar}</div>
            <div className="row-main">
              <div className="row-title">Payroll</div>
              <div className="row-sub">in 8 days</div>
            </div>
            <div className="row-amt">$2,198</div>
          </div>

          <div className="row-pill amber-pulse">
            <div className="row-ico amber-ico">{Icon.ribbon}</div>
            <div className="row-main">
              <div className="row-title">Liquor license</div>
              <div className="row-sub amber-sub">renews in 14 days</div>
            </div>
            <div className="pill-cta amber-cta">renew</div>
          </div>
        </div>
      </div>

      <BottomNav active="commitments" rippleTarget={rippleTarget} />
    </div>
  );
}

/* ============ OUTRO (Beat 5) ============ */
export function OutroScreen() {
  return (
    <div className="screen-layer-inner outro-stage">
      <div className="outro-landscape">
        <div className="outro-bold">F**K dashboards.</div>
        <div className="outro-sub">You need specific actions that actually help.</div>
      </div>
    </div>
  );
}
