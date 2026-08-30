import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { JoinV2 } from "@/components/join/JoinV2";

export const metadata: Metadata = {
  title: "We're hiring one engineer — reveal.",
  description:
    "One founding engineer seat at Reveal. Unpaid to start, on software already live in two restaurants, checking real money every morning.",
};

export default function JoinPage() {
  return (
    <>
      <JoinV2 />
      <Footer />
    </>
  );
}
