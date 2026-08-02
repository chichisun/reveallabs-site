import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { StoryV2 } from "@/components/story-v2/StoryV2";

export const metadata: Metadata = {
  title: "Our Story — reveal.",
  description:
    "The family story behind Reveal: three generations in one kitchen, and why we built a tool for restaurants like ours.",
};

export default function OurStoryPage() {
  return (
    <>
      <StoryV2 />
      <Footer />
    </>
  );
}
