"use client";

import { BottomNav, Reveal, StatusBar, useCountUp } from "../_shared";
import { HOME } from "../mock";

export function HomeScreen({ active }: { active: boolean }) {
  const amount = useCountUp(HOME.leakTotal, active, 900);
  return (
    <div className="rap-screen-inner">
      <StatusBar />
      <div className="rap-chrome">
        <div className="rap-iconbtn">⚙</div>
        <div className="rap-chrome__mid">
          <div className="rap-chrome__title">
            {HOME.greeting} · {HOME.place}
          </div>
          <div className="rap-chrome__sub">{HOME.date}</div>
        </div>
        <div className="rap-iconbtn">◔</div>
      </div>

      <div className="rap-scroll">
        <div className="rap-hero">
          <div className="rap-hero__amount tnum">
            ${amount.toLocaleString()}
            <span className="unit">leaking</span>
          </div>
          <div className="rap-hero__sub">
            across {HOME.leakCount} things this week
          </div>
          <div className="rap-saved">✓ ${HOME.saved.toLocaleString()} saved this month</div>
        </div>

        <Reveal active={active} delay={120}>
          <div className="rap-card rap-kpi">
            {HOME.kpis.map((k) => (
              <div className="rap-kpi__col" key={k.label}>
                <div className="rap-kpi__label">{k.label}</div>
                <div className="rap-kpi__val tnum">
                  <span className={`rap-dot rap-dot--${k.state}`} />
                  {k.value}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="rap-section-label">
          <span>OPEN LEAKS · THIS WEEK</span>
          <span className="count">{HOME.leakCount} OPEN</span>
        </div>

        {HOME.leaks.map((leak, i) => (
          <Reveal active={active} delay={220 + i * 90} key={leak.name}>
            <div className="rap-card">
              <div className="rap-leak__top">
                <span className="rap-pill-amt tnum">{leak.amount}</span>
                <span className="rap-leak__name">{leak.name}</span>
                <span className="rap-leak__time">· {leak.time}</span>
              </div>
              <div className="rap-leak__why">{leak.why}</div>
              <div className="rap-actions">
                <button className="rap-btn rap-btn--primary">Fix it</button>
                <button className="rap-btn rap-btn--secondary">Snooze</button>
                <button className="rap-btn rap-btn--ghost">Mute</button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
