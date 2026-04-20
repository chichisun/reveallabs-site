import { ImageResponse } from "next/og";

// Pre-render at build time rather than running as a per-request edge function.
// The "r." mark is static — no need for dynamic generation.
export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Brand colors mirror the tokens in globals.css (can't reference CSS vars from ImageResponse).
// --color-cream    : #F2F1ED
// --color-charcoal : #2E2E2E
// --color-green-700: #355E3B
const COLORS = {
  bg: "#F2F1ED",
  fg: "#2E2E2E",
  accent: "#355E3B",
} as const;

// Visually tuned to align the accent dot with the "r" cap height baseline.
const ICON = {
  cornerRadius: 34,
  fontSize: 134,
  letterTopOffset: -4,
  dotSize: 26,
  dotMarginLeft: 4,
  dotMarginBottom: 26,
} as const;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: COLORS.bg,
          color: COLORS.fg,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 700,
          fontSize: ICON.fontSize,
          letterSpacing: "-0.03em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: ICON.cornerRadius,
        }}
      >
        <span style={{ position: "relative", top: ICON.letterTopOffset }}>r</span>
        <span
          style={{
            display: "block",
            width: ICON.dotSize,
            height: ICON.dotSize,
            borderRadius: "50%",
            background: COLORS.accent,
            marginLeft: ICON.dotMarginLeft,
            alignSelf: "flex-end",
            marginBottom: ICON.dotMarginBottom,
          }}
        />
      </div>
    ),
    size,
  );
}
