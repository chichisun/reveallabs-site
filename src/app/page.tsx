import { Hero } from "../components/Hero";
import { Scrollytelling } from "../components/Scrollytelling";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "../components/Footer";
import { Intro } from "../components/Intro";
import { IntroReplay } from "../components/IntroReplay";
import { WaitlistDialog } from "../components/WaitlistDialog";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  return (
    <>
      <Intro />
      <IntroReplay />
      <ThemeToggle />
      <Hero />
      <Scrollytelling />
      <FinalCTA />
      <Footer />
      <WaitlistDialog />
    </>
  );
}
