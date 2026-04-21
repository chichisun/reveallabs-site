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

      <header className="nav">
        <div className="container nav-inner">
          <a href="#" className="wordmark">
            reveal<span className="dot">.</span>
          </a>
        </div>
      </header>

      <div className="hero-inner">
        <div className="eyebrow"><span>For independent restaurants</span></div>
        <h1 id="hero-title">
          Find the money your restaurant is leaving on the table.
        </h1>
        <p className="hero-sub">
          We give you specific moves every month to better understand and grow
          your restaurant. You run it as we track it.
        </p>
        <div className="hero-ctas">
          <WaitlistTrigger>Join the waitlist</WaitlistTrigger>
        </div>
      </div>
    </section>
  );
}
