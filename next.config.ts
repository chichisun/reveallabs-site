import type { NextConfig } from "next";
import shots from "./public/product/SHOT-MANIFEST.json";

const nextConfig: NextConfig = {
  images: {
    // Next 16: a query string on a local image needs an exact `search`. The two product frames are
    // versioned by the shoot's timestamp (no cache can show a stale frame); everything else in /public
    // stays query-free. With localPatterns set, anything not listed is refused.
    localPatterns: [
      { pathname: "/product/**", search: `?v=${encodeURIComponent(shots.shotAt)}` },
      { pathname: "/**", search: "" },
    ],
  },
  async headers() {
    return [
      {
        // Browsers only apply <?xml-stylesheet?> XSL transforms when the
        // stylesheet is served with text/xsl (or application/xslt+xml).
        // Vercel's default for .xsl is application/xml, which falls through
        // to "show raw XML." Override here so /blog/rss.xml renders as a
        // styled subscribe page in browsers.
        source: "/rss.xsl",
        headers: [
          { key: "Content-Type", value: "text/xsl; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
