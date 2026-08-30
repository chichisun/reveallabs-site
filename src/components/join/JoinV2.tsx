import { Suspense } from "react";
import Image from "next/image";
import { SiteNav } from "@/components/home-v2/SiteNav";
import { JoinForm } from "@/components/join/JoinForm";
import { JoinReveals } from "@/components/join/JoinReveals";

/**
 * /join — the permanent careers page.
 *
 * Wears `homev2` so it inherits the site's own type, tokens, nav and button
 * styling straight from home-v2.css rather than restating them. `joinv2` adds
 * only what is specific to this page (see src/styles/join.css). Section class
 * names are all `join-` prefixed so none of the homepage's hero or bento
 * choreography leaks in.
 */
export function JoinV2() {
  return (
    <div className="homev2 joinv2">
      <SiteNav page="join" />

      <header className="join-hero">
        <Image
          className="join-hero-img"
          src="/join-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="join-hero-inner">
          <p className="join-eyebrow">One role open</p>
          <h1>We&apos;re hiring one engineer.</h1>
          <p className="join-sub">
            Unpaid to start. You&apos;d work on software that is already live in two
            restaurants, checking real money every morning.
          </p>
          <a className="btn btn-primary join-cta" href="#apply">
            Apply
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </header>

      <main className="join-wrap">
        <div className="join-block reveal-in">
          <span className="join-chip-glass">
            <span className="dot" aria-hidden="true" />
            What you&apos;d be building
          </span>
          <h2>A restaurant signs about a hundred agreements. Nobody checks them.</h2>
          <div className="join-narrow">
            <p>
              The lease, the linen contract, vendor prices, delivery deals. They all
              live in one place, the owner&apos;s head. Nobody checks that the money
              moving through the bank matches what was signed, so it leaks, and when
              it gets found, it gets found by chance.
            </p>
            <p>
              Big chains pay a person whose whole job is catching this. We&apos;re
              building that person, and that&apos;s the job you&apos;d be doing.
            </p>
          </div>
        </div>

        <section className="join-section join-center">
          <p className="join-eyebrow reveal-in">The role</p>
          <h2 className="reveal-in" style={{ ["--i" as string]: 1 }}>
            Founding engineer
          </h2>
          <div className="join-terms reveal-in" style={{ ["--i" as string]: 2 }}>
            <span className="join-pill">Unpaid to start</span>
            <span className="join-pill join-pill--plain">Denver or remote</span>
            <span className="join-pill join-pill--plain">Start now</span>
          </div>

          <div className="join-narrow">
            <p className="join-straight reveal-in" style={{ ["--i" as string]: 3 }}>
              Let me be straight with you: this is unpaid right now, and I won&apos;t
              dress that up. You&apos;d come in as an intern building a real product
              inside real restaurants. When money starts coming in, you&apos;re first
              in line for the founding engineer job. That&apos;s the risk I&apos;m
              offering.
            </p>

            <ul className="join-doing reveal-in" style={{ ["--i" as string]: 4 }}>
              <li>
                Read a working codebase and start shipping into it. <code>TypeScript</code>,{" "}
                <code>Next.js</code>, <code>Supabase</code>.
              </li>
              <li>
                Write the checks that catch real problems: a vendor price that went up
                without notice, a deposit that never landed, a delivery fee that stopped
                matching the deal.
              </li>
              <li>
                Ship to restaurant owners who will tell you within a day if you got it
                wrong.
              </li>
            </ul>
          </div>
        </section>

        <section className="join-section join-center">
          <p className="join-eyebrow reveal-in">Who you&apos;d work with</p>
          <div className="join-people">
            <div className="join-person reveal-in" style={{ ["--i" as string]: 1 }}>
              <Image src="/team-chayadol.jpg" alt="Chayadol Sundarapura" width={96} height={96} />
              <div className="join-person-name">Chayadol Sundarapura</div>
              <div className="join-person-role">Founder</div>
              <p className="join-person-body">
                A restaurant kid, not an engineer. I built this with the tools we have
                today, and there are 10,371 automated tests on it.
              </p>
            </div>
            <div className="join-person reveal-in" style={{ ["--i" as string]: 2 }}>
              <Image src="/team-mike.jpg" alt="Mike Speck" width={96} height={96} />
              <div className="join-person-name">Mike Speck</div>
              <div className="join-person-role">Design partner</div>
              <p className="join-person-body">
                Former COO of The Halal Guys, CEO of Asian Box, VP at Qdoba. Thirty years
                running restaurants at scale. The product gets built to his standard.
              </p>
            </div>
          </div>
        </section>

        <section className="join-section">
          <div className="join-apply reveal-in" id="apply">
            <div className="join-center join-apply-head">
              <p className="join-eyebrow">Apply</p>
              <h2>Tell me who you are.</h2>
            </div>
            <Suspense fallback={null}>
              <JoinForm />
            </Suspense>
          </div>
        </section>
      </main>

      <JoinReveals />
    </div>
  );
}
