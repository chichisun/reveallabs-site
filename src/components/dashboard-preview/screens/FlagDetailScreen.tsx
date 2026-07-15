"use client";

import { Reveal, StatusBar } from "../_shared";
import { FLAG } from "../mock";

export function FlagDetailScreen({ active }: { active: boolean }) {
  return (
    <div className="rap-screen-inner">
      <StatusBar />
      <div className="rap-detail-head">
        <div className="rap-back">‹</div>
        <div className="rap-detail-head__mid">
          <div className="rap-detail-head__title">Leak detail</div>
          <div className="rap-detail-head__sub">Open · flagged today</div>
        </div>
        <div className="rap-iconbtn">⋯</div>
      </div>

      <div className="rap-scroll">
        <div className="rap-tags">
          <span className="rap-tag rap-tag--problem tnum">{FLAG.tags[0]}</span>
          <span className="rap-tag rap-tag--neutral">{FLAG.tags[1]}</span>
        </div>
        <div className="rap-detail-title">{FLAG.title}</div>
        <div className="rap-detail-lede">{FLAG.lede}</div>

        <Reveal active={active} delay={120}>
          <div className="rap-card">
            <div className="rap-mathlabel">THE MATH</div>
            <div className="rap-math">
              <div className="rap-math__cell">
                <div className="rap-math__k">USUAL</div>
                <div className="rap-math__v tnum">{FLAG.usual}</div>
                <div className="rap-math__meta">{FLAG.usualMeta}</div>
              </div>
              <div className="rap-math__cell rap-math__cell--bad">
                <div className="rap-math__k">THIS INVOICE</div>
                <div className="rap-math__v bad tnum">{FLAG.invoice}</div>
                <div className="rap-math__meta">{FLAG.invoiceMeta}</div>
              </div>
            </div>
            <div className="rap-math__eq tnum">
              {FLAG.eq} <strong>{FLAG.eqResult}</strong>
            </div>
          </div>
        </Reveal>

        <Reveal active={active} delay={240}>
          <div className="rap-card">
            <div className="rap-why-title">WHY REVEAL FLAGGED THIS</div>
            <div className="rap-why-body">{FLAG.why}</div>
            <div className="rap-conf">
              <span className="rap-dot rap-dot--good" />
              {FLAG.conf}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
