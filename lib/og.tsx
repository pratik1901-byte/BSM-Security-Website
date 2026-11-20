import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

/**
 * The share card every page is given.
 *
 * One card per route, so a link to Services does not arrive looking like a
 * link to the home page. The frame is fixed — the mark and the section along
 * the top, the headline, the agency line along the foot — and each page
 * supplies only its own words, which is what keeps seven of these consistent
 * and cheap to change.
 *
 * Rendered at build time: this is a static export, so there is no server to
 * draw them on request, and the logo is read off disk here rather than
 * fetched over the network.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const VOID = "#04060a";
const INK = "#070a10";
const BONE = "#eceff3";
const MIST = "#98a1b0";
const DIM = "#656e7d";
const BRASS = "#c8a45c";
const LINE = "#1a212c";

/* Satori draws from a data URI, not from a path, and PNG is the format it
   reads — which is why this is the icon and not the WebP logo. */
const mark = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), "public", "brand", "icon-192.png"))
  .toString("base64")}`;

/**
 * A square portrait, ready for Satori.
 *
 * The photographs are served as WebP, which Satori does not read, so each is
 * squared and re-encoded as a JPEG here. It happens at build time, on files
 * already on disk, so there is nothing to fetch. Cropped from the top, which
 * is where a head is.
 */
export async function face(src: string, size = 128) {
  const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  const jpeg = await sharp(fs.readFileSync(file))
    .resize(size, size, { fit: "cover", position: "top" })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

export function ogCard({
  eyebrow,
  title,
  lead,
  foot,
  people,
}: {
  /** The section, set small in brass beside the mark. */
  eyebrow: string;
  /** The headline. Kept short enough to hold at 68px. */
  title: string;
  /** The line under it, carrying the detail. */
  lead: string;
  /** The right-hand line along the foot. */
  foot: string;
  /**
   * Faces along the top right — the partners, on the About card. Each src
   * is a data URI from face() above, because Satori cannot read a path.
   */
  people?: { src: string; name: string; role: string }[];
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
          background: `linear-gradient(135deg, ${INK} 0%, ${VOID} 55%, #000 100%)`,
          padding: "64px 72px",
          color: BONE,
          fontFamily: "Helvetica, Arial, sans-serif",
          position: "relative",
        }}
      >
        {/* The brass edge the site carries throughout. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(90deg, ${BRASS} 0%, #e2c486 45%, rgba(200,164,92,0) 100%)`,
          }}
        />

        <div
          style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {/* Square and whole. The mark already carries a border of its own,
                so rounding the corners here clipped it. */}
            <img src={mark} alt="" width={84} height={84} style={{ display: "block" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{ fontSize: 19, letterSpacing: 6, textTransform: "uppercase", color: BRASS }}
              >
                {eyebrow}
              </div>
              <div
                style={{ fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: DIM }}
              >
                bsmsecurityagency.com
              </div>
            </div>
          </div>

          {/* The people, where a card names them. */}
          {people && people.length > 0 && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              {people.map((p) => (
                <div
                  key={p.name}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 142 }}
                >
                  <img
                    src={p.src}
                    alt=""
                    width={64}
                    height={64}
                    style={{ borderRadius: 10, border: `1px solid ${BRASS}` }}
                  />
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: BONE,
                      marginTop: 10,
                      textAlign: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: BRASS,
                      marginTop: 5,
                      textAlign: "center",
                    }}
                  >
                    {p.role}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.05,
              letterSpacing: -2.4,
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              width: 132,
              height: 3,
              background: BRASS,
              margin: "26px 0 22px",
            }}
          />
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.3,
              letterSpacing: -0.5,
              fontWeight: 500,
              color: MIST,
              maxWidth: 1000,
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
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1.3 }}>
              BSM Security Agency
            </div>
            <div
              style={{
                fontSize: 17,
                letterSpacing: 4,
                color: BRASS,
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              Est. 2013 · DGR-sponsored · Goa, India
            </div>
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 3.5,
              color: DIM,
              textTransform: "uppercase",
              textAlign: "right",
              maxWidth: 360,
            }}
          >
            {foot}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
