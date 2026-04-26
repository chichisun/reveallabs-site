import {
  INTERMISSION_VIDEO_URL,
  INTERMISSION_POSTER_URL,
} from "../lib/site-config";
import { WaitlistTrigger } from "./WaitlistTrigger";

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
        <h1 id="hero-title">
          We see everything. We find the moves. We hand you the tools.
        </h1>
        <p className="hero-sub">
          Every contract you signed. Every cost you pay. Every dollar your
          restaurant makes. Connected in one place, then turned into the
          moves you can actually make next month.
        </p>
        <div className="hero-ctas">
          <WaitlistTrigger className="btn btn-primary btn-pulse">
            Join the waitlist
          </WaitlistTrigger>
        </div>
      </div>
    </section>
  );
}
