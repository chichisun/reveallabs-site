import { Hero } from "@/components/sections/Hero";
import { DashboardPreview } from "@/components/dashboard-preview/DashboardPreview";
import { Scrollytelling } from "@/components/sections/Scrollytelling";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/layout/Footer";
import { Intro } from "@/components/sections/Intro";
import { IntroReplay } from "@/components/sections/IntroReplay";
import { WaitlistDialog } from "@/components/waitlist/WaitlistDialog";

export default function Home() {
  return (
    <>
      <Intro />
      <IntroReplay />
      <Hero />
      <DashboardPreview />
      <Scrollytelling />
      <WhatWeDo />
      <FinalCTA />
      <Footer />
      <WaitlistDialog />
    </>
  );
}
