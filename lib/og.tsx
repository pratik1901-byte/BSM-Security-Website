import { ImageResponse } from "next/og";

/**
 * The share card every page is given.
 *
 * One card per route, so a link to Services does not arrive looking like a
 * link to the home page. The layout is fixed — eyebrow, headline, the agency
 * line along the foot — and each page supplies only its own words, which is
 * what keeps fourteen of these consistent and cheap to change.
 *
 * Rendered at build time: this is a static export, so there is no server to
 * draw them on request.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const VOID = "#04060a";
const BONE = "#eceff3";
const MIST = "#98a1b0";
const DIM = "#656e7d";
const BRASS = "#c8a45c";
const LINE = "#1a212c";

export function ogCard({
  eyebrow,
  title,
  lead,
  foot,
}: {
  /** Small brass line at the top — usually the section. */
  eyebrow: string;
  /** The headline, in bone. */
  title: string;
  /** Second line of the headline, in grey. Carries the detail. */
  lead: string;
  /** Right-hand line along the foot. */
  foot: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: VOID,
          padding: 72,
          color: BONE,
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 10, height: 10, background: BRASS }} />
          <div style={{ fontSize: 20, letterSpacing: 6, textTransform: "uppercase", color: BRASS }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ fontSize: 72, lineHeight: 1.04, letterSpacing: -2.5, fontWeight: 700, maxWidth: 980 }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 40,
              lineHeight: 1.18,
              letterSpacing: -1,
              fontWeight: 600,
              color: MIST,
              maxWidth: 980,
              marginTop: 18,
            }}
          >
            {lead}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1.5 }}>
              BSM Security Agency
            </div>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 4,
                color: BRASS,
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              Est. 2013 · DGR-sponsored · 24 × 7
            </div>
          </div>
          <div style={{ fontSize: 17, letterSpacing: 4, color: DIM, textTransform: "uppercase" }}>
            {foot}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
