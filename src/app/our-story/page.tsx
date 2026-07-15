import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { StoryV2 } from "@/components/story-v2/StoryV2";

export const metadata: Metadata = {
  title: "Our Story — reveal.",
  description:
    "Three generations, one kitchen. The family story behind Reveal — why we built a tool for independent restaurants.",
};

export default function OurStoryPage() {
  return (
    <>
      <StoryV2 />
      <Footer />
    </>
  );
}
