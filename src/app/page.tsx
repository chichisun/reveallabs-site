import { Hero } from "../components/Hero";
import { Scrollytelling } from "../components/Scrollytelling";
import { WhatWeDo } from "../components/WhatWeDo";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "../components/Footer";
import { Intro } from "../components/Intro";
import { IntroReplay } from "../components/IntroReplay";
import { WaitlistDialog } from "../components/WaitlistDialog";

export default function Home() {
  return (
    <>
      <Intro />
      <IntroReplay />
      <Hero />
      <Scrollytelling />
      <WhatWeDo />
      <FinalCTA />
      <Footer />
      <WaitlistDialog />
    </>
  );
}
