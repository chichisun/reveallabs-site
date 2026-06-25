import {
  INTERMISSION_VIDEO_URL,
  INTERMISSION_POSTER_URL,
} from "@/lib/site-config";
import { HeroWaitlist } from "@/components/sections/HeroWaitlist";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={INTERMISSION_POSTER_URL}
        aria-hidden="true"
        id="heroVideo"
      >
        <source src={INTERMISSION_VIDEO_URL} type="video/mp4" />
      </video>
      <div className="hero-wash" aria-hidden="true" />

      <div className="hero-inner">
        <div className="eyebrow"><span>For independent restaurants</span></div>
        <div className="hero-content">
          <h1 id="hero-title">
            Find the money leaking<br />out of your restaurant.
          </h1>
          <p className="hero-sub">
            Reveal connects to your bank, POS, delivery apps, and the
            invoices and contracts you already keep — then checks every
            bill and payout against what you agreed to pay, flags the moment
            you&apos;re overcharged or underpaid, and helps you recover it.
          </p>
          <div className="hero-ctas">
            <HeroWaitlist />
          </div>
        </div>
      </div>
    </section>
  );
}
