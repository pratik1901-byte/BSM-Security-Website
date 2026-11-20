import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "BSM Security Agency, Goa — Our offices in Goa";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Rendered once at build time — this is a static export. */
export const dynamic = "force-static";

export default function Image() {
  return ogCard({
    eyebrow: "Branch · BSM Security Agency",
    title: "Our offices in Goa.",
    lead: "Head Office at Aquem, Margao and the Branch Office at Chimbel, Panjim.",
    foot: "Addresses · Numbers · Leadership",
  });
}
