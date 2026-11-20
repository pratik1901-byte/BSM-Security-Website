import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "BSM Security Agency, Goa — Personnel, operations and sites";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Rendered once at build time — this is a static export. */
export const dynamic = "force-static";

export default function Image() {
  return ogCard({
    eyebrow: "Gallery · BSM Security Agency",
    title: "Personnel, operations and sites.",
    lead: "Photographs of the people on post and the places they hold.",
    foot: "Personnel · Operations · Sites · Goa",
  });
}
