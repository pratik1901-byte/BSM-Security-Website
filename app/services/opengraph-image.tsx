import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "BSM Security Agency, Goa — Security services, matched to the site";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Rendered once at build time — this is a static export. */
export const dynamic = "force-static";

export default function Image() {
  return ogCard({
    eyebrow: "Services · BSM Security Agency",
    title: "Security services, matched to the site.",
    lead: "Ten categories, each beginning with a survey and a written deployment plan.",
    foot: "Guards · Surveillance · Events · Housekeeping",
  });
}
