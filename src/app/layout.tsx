import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../lib/site-config";
import { Nav } from "../components/Nav";
import "./globals.css";

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
      t = 'light';
    }
    document.documentElement.dataset.theme = t;

    // Intro plays once per session on home. Opt-out via ?no-intro=1,
    // force replay via ?intro=1 (or the IntroReplay button). Once seen,
    // client-side nav back to / won't replay because Intro.tsx bails out
    // when sessionStorage 'reveal_intro_seen' is set.
    var params = new URLSearchParams(window.location.search);
    var optOut = params.get('no-intro') === '1';
    var forceReplay = params.get('intro') === '1';
    var isHome = window.location.pathname === '/';
    var seen = false;
    try { seen = sessionStorage.getItem('reveal_intro_seen') === '1'; } catch(e) {}
    if (!optOut && isHome && (!seen || forceReplay)) {
      document.documentElement.classList.add('intro-pending');
    }
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
      className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
