import { WaitlistTrigger } from "./WaitlistTrigger";

const STATS = [
  { num: "$5,931", label: "Found last month" },
  { num: "$67,140", label: "Annualized at pace" },
  { num: "3", label: "Specific moves" },
  { num: "30 days", label: "To measure" },
] as const;

export function FinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta-inner">
        <div className="final-cta-grid">
          <div className="final-cta-content">
            <div className="final-cta-eyebrow">Get started</div>
            <h2 id="final-cta-title">Want us watching your numbers?</h2>
            <p className="final-cta-sub">
              Running a restaurant is hard. Making the decisions that keep it
              alive is harder. Let us help with the second part.
            </p>
            <WaitlistTrigger>Join the waitlist</WaitlistTrigger>
            <p className="final-cta-closing">
              We built this for our parents&apos; restaurant first.
            </p>
          </div>
          <div
            className="final-cta-stats"
            aria-label="Lab restaurant results"
          >
            {STATS.map((s, i) => (
              <div key={i} className="fc-stat">
                <div className="num">{s.num}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
