import {
  INTERMISSION_VIDEO_URL,
  INTERMISSION_POSTER_URL,
} from "../lib/site-config";
import { HeroWaitlist } from "./HeroWaitlist";

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
            One place for everything<br />your money touches.
          </h1>
          <p className="hero-sub">
            Contracts, costs, and sales — connected, made sense of, and
            turned into the moves to make next month.
          </p>
          <div className="hero-ctas">
            <HeroWaitlist />
          </div>
        </div>
      </div>
    </section>
  );
}
