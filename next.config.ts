import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
