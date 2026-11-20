import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "BSM Security Agency, Goa — Our Legacy & Experience";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Rendered once at build time — this is a static export. */
export const dynamic = "force-static";

export default function Image() {
  return ogCard({
    eyebrow: "About Us · BSM Security Agency",
    title: "Our Legacy & Experience",
    lead: "Established 2013 and registered with the Directorate General Resettlement, Ministry of Defence.",
    foot: "Leadership · Training · Commitment",
  });
}
