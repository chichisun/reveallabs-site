import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../lib/site-config";
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

    var seen = localStorage.getItem('reveal_intro_seen') === 'true';
    var params = new URLSearchParams(window.location.search);
    var force = params.get('intro') === '1' || params.has('replay');
    // Opt-out via ?no-intro=1 for anyone who wants to skip (accessibility,
    // slow connection, etc.). Otherwise: if they haven't seen it, play it.
    var optOut = params.get('no-intro') === '1';
    if (force) seen = false;
    if (!seen && !optOut) {
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
