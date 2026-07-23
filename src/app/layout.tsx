import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Inter, Fustat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site-config";
import { Nav } from "@/components/layout/Nav";
import { AnalyticsBoot } from "@/components/layout/AnalyticsBoot";
import "./globals.css";
import "@/styles/home-v2.css";
import "@/styles/story-v2.css";
import "@/styles/blog-v2.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Inter is loaded only so the dashboard preview's phone interior can use the
// real product font. Exposed as a CSS variable and applied ONLY inside
// `.reveal-app-preview` (see dashboard-preview/preview.css) — the rest of the
// site keeps Space Grotesk.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Fustat is the homepage (home-v2) typeface — a variable font, loaded across
// its full 200..800 weight range and exposed as --font-fustat. Applied only
// inside `.homev2` (see src/styles/home-v2.css).
const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// Inline script that runs before first paint. Does two things:
//   1. Sets theme (light/dark) from localStorage or prefers-color-scheme
//      so the correct palette paints on first frame — no theme flash.
//   2. If the brand intro will play, adds `intro-pending` class to <html>
//      so CSS hides page content until the overlay mounts — no content flash.
const bootScript = `
(function(){
  try {
    var t = localStorage.getItem('reveal_theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    document.documentElement.dataset.theme = t;

    // Intro plays on FIRST arrival in a tab session, only if the
    // user's first landing is /. If the first landing is any other
    // route (/our-story, /privacy), the intro is marked already-seen
    // so that clicking the wordmark back to / later in this session
    // doesn't play the animation.
    //
    // ?no-intro=1 opts out, ?intro=1 forces a replay.
    var params = new URLSearchParams(window.location.search);
    var optOut = params.get('no-intro') === '1';
    var forceReplay = params.get('intro') === '1';
    var isHome = window.location.pathname === '/';
    var seen = false;
    try { seen = sessionStorage.getItem('reveal_intro_seen') === '1'; } catch(e) {}
    if (!optOut && isHome && (!seen || forceReplay)) {
      document.documentElement.classList.add('intro-pending');
    }
    // Mark the session seen on EVERY page load so any client-side
    // navigation back to / later in this session skips the intro.
    try { sessionStorage.setItem('reveal_intro_seen', '1'); } catch(e) {}
  } catch(e) {}
})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${inter.variable} ${fustat.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        {children}
        <Analytics />
        <SpeedInsights />
        <AnalyticsBoot />
      </body>
    </html>
  );
}
