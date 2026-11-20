import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "BSM Security Agency, Goa — Discuss your security requirements";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Rendered once at build time — this is a static export. */
export const dynamic = "force-static";

export default function Image() {
  return ogCard({
    eyebrow: "Contact · BSM Security Agency",
    title: "Discuss your security requirements with our team.",
    lead: "By phone, WhatsApp or the enquiry form — a survey slot and a written plan.",
    foot: "Margao · Panjim · 24 × 7",
  });
}
