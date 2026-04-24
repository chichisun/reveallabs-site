import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { OurStory } from "../../components/OurStory";

export const metadata: Metadata = {
  title: "Our Story — reveal.",
  description:
    "Three generations, one kitchen. The family story behind Reveal — why we built a tool for independent restaurants.",
};

export default function OurStoryPage() {
  return (
    <>
      <main className="our-story-main">
        <header className="our-story-header">
          <h1 className="our-story-heading">Our Story</h1>
          <p className="our-story-lede">Three generations, one kitchen.</p>
        </header>
        <OurStory />
      </main>
      <Footer />
    </>
  );
}
