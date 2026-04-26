import { WaitlistTrigger } from "./WaitlistTrigger";

const STATS = [
  { num: "100%", label: "Of your books, covered" },
  { num: "24/7", label: "Eyes on the numbers" },
  { num: "Every", label: "Renewal, contract, payout" },
  { num: "2–3", label: "Moves delivered every month" },
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
              There&apos;s only so much you can hold in your head. Let us
              hold the rest.
            </p>
            <WaitlistTrigger>Join the waitlist</WaitlistTrigger>
            <p className="final-cta-closing">
              Started it because my parents own a restaurant. Watched them
              run on instinct for 20 years — sales in their POS, vendors in
              their phones, renewal dates in my mom&apos;s head. Building
              the tool I wish they&apos;d had.
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
