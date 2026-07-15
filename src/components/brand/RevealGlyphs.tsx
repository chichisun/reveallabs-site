/* Brand glyph set — the seven icons that morph into r-e-v-e-a-l-.
   Pulled out of Intro.tsx so other surfaces (blog heading morph, etc.)
   can use the same icon→letter pairing without duplicating SVGs. */

import type { FC, SVGProps } from "react";

const SVG_PROPS = {
  width: 64,
  height: 64,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ChefHat: FC<SVGProps<SVGSVGElement>> = (p) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
    <path d="M6 17h12" />
  </svg>
);
const Utensils: FC<SVGProps<SVGSVGElement>> = (p) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);
const UtensilsCrossed: FC<SVGProps<SVGSVGElement>> = (p) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
    <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
    <path d="m2.1 21.8 6.4-6.3" />
    <path d="m19 5-7 7" />
  </svg>
);
const CookingPot: FC<SVGProps<SVGSVGElement>> = (p) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M2 12h20" />
    <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
    <path d="m4 8 16-4" />
    <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
  </svg>
);
const Egg: FC<SVGProps<SVGSVGElement>> = (p) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M12 22c5.523 0 9-3.477 9-8.5S17.523 2 12 2 3 7.977 3 13.5 6.477 22 12 22z" />
  </svg>
);
const Wheat: FC<SVGProps<SVGSVGElement>> = (p) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M2 22 16 8" />
    <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
    <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
    <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
  </svg>
);
const Flame: FC<SVGProps<SVGSVGElement>> = (p) => (
  <svg {...SVG_PROPS} {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

export type GlyphSpec = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  ch: string;
  accent: boolean;
  opticalScale: number;
  strokeWidth?: number;
};

/** The brand mark "reveal." in icon form, in order. Index 6 (Flame) is
 *  the accent glyph and renders in green, matching the wordmark dot. */
export const REVEAL_GLYPHS: GlyphSpec[] = [
  { Icon: ChefHat, ch: "r", accent: false, opticalScale: 1.15 },
  { Icon: Utensils, ch: "e", accent: false, opticalScale: 1.0 },
  { Icon: UtensilsCrossed, ch: "v", accent: false, opticalScale: 1.05 },
  { Icon: CookingPot, ch: "e", accent: false, opticalScale: 1.0 },
  { Icon: Egg, ch: "a", accent: false, opticalScale: 1.15 },
  { Icon: Wheat, ch: "l", accent: false, opticalScale: 1.2, strokeWidth: 1.35 },
  { Icon: Flame, ch: ".", accent: true, opticalScale: 1.2 },
];
