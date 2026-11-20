import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt =
  "BSM Security Agency, Goa — Protecting industries. Securing Businesses. Building Trust.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Rendered once at build time — this is a static export. */
export const dynamic = "force-static";

export default function Image() {
  return ogCard({
    eyebrow: "Security Agency · Goa, India",
    title: "Protecting industries. Securing Businesses. Building Trust.",
    lead: "Trained security personnel and managed protection across India.",
    foot: "PSU · Industrial · Banking · Events",
  });
}
