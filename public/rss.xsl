<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS</title>
        <style type="text/css">
          :root {
            --cream: #F2F1ED;
            --cream-lifted: #FCFBFA;
            --charcoal: #2E2E2E;
            --charcoal-soft: #3D3D3D;
            --muted: #797979;
            --light: #B5AFA6;
            --green-700: #355E3B;
            --green-50: #F3F8F4;
            --stroke: rgba(46, 46, 46, 0.1);
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--cream);
            color: var(--charcoal);
            font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
            font-size: 16px;
            line-height: 1.65;
          }
          .wrap {
            max-width: 720px;
            margin: 0 auto;
            padding: 80px 24px 96px;
          }
          .eyebrow {
            font-family: 'Space Mono', ui-monospace, monospace;
            font-size: 12px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--green-700);
            margin: 0 0 20px;
          }
          h1 {
            font-size: clamp(32px, 5vw, 48px);
            line-height: 1.05;
            letter-spacing: -0.02em;
            font-weight: 500;
            color: var(--charcoal);
            margin: 0 0 16px;
            max-width: 18ch;
          }
          .lede {
            color: var(--charcoal-soft);
            margin: 0 0 32px;
            max-width: 56ch;
          }
          .reader-note {
            background: var(--cream-lifted);
            border: 1px solid var(--stroke);
            border-radius: 8px;
            padding: 20px 24px;
            margin: 0 0 48px;
            font-size: 14px;
            line-height: 1.55;
            color: var(--charcoal-soft);
          }
          .reader-note code {
            background: var(--green-50);
            border: 1px solid var(--stroke);
            padding: 1px 6px;
            border-radius: 4px;
            font-family: 'Space Mono', ui-monospace, monospace;
            font-size: 13px;
            color: var(--charcoal);
          }
          .reader-note a {
            color: var(--green-700);
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .section-label {
            font-family: 'Space Mono', ui-monospace, monospace;
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--muted);
            margin: 0 0 16px;
          }
          .item {
            border-top: 1px solid var(--stroke);
            padding: 28px 0;
          }
          .item:first-of-type { border-top: none; padding-top: 0; }
          .item-meta {
            font-family: 'Space Mono', ui-monospace, monospace;
            font-size: 12px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--muted);
            margin: 0 0 10px;
          }
          .item-title {
            font-size: clamp(20px, 2.5vw, 26px);
            line-height: 1.2;
            font-weight: 500;
            margin: 0 0 8px;
            letter-spacing: -0.012em;
          }
          .item-title a {
            color: var(--charcoal);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 160ms ease;
          }
          .item-title a:hover { border-bottom-color: var(--charcoal); }
          .item-desc {
            color: var(--charcoal-soft);
            margin: 0;
            font-size: 15px;
            line-height: 1.55;
            max-width: 56ch;
          }
          .footer-link {
            font-family: 'Space Mono', ui-monospace, monospace;
            font-size: 12px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--green-700);
            text-decoration: none;
            border-bottom: 1px solid currentColor;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <p class="eyebrow">RSS feed</p>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="lede"><xsl:value-of select="/rss/channel/description"/></p>

          <div class="reader-note">
            <p style="margin:0 0 8px;"><strong>Subscribe in your reader.</strong> Copy this URL and paste it into NetNewsWire, Feedly, Reeder, Inoreader, or any RSS reader:</p>
            <p style="margin:0;"><code><xsl:value-of select="/rss/channel/atom:link/@href"/></code></p>
            <p style="margin:12px 0 0;">
              Prefer email? <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>Open the blog</a> and join the waitlist instead.
            </p>
          </div>

          <p class="section-label">Latest issues</p>

          <xsl:for-each select="/rss/channel/item">
            <div class="item">
              <p class="item-meta">
                <xsl:value-of select="pubDate"/>
                <xsl:if test="category">
                  <xsl:text> · </xsl:text>
                  <xsl:value-of select="category"/>
                </xsl:if>
              </p>
              <h2 class="item-title">
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <p class="item-desc"><xsl:value-of select="description"/></p>
            </div>
          </xsl:for-each>

          <p style="margin-top:48px;">
            <a class="footer-link"><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>← back to the blog</a>
          </p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
