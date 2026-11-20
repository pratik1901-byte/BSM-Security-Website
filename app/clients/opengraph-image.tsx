import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "BSM Security Agency, Goa — Our Esteemed DGR Sponsored Public Sector Clients";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Rendered once at build time — this is a static export. */
export const dynamic = "force-static";

export default function Image() {
  return ogCard({
    eyebrow: "Clients · BSM Security Agency",
    title: "Our Esteemed DGR Sponsored Public Sector Clients",
    lead: "Aviation, energy, maritime, industrial, research, public-sector and logistics.",
    foot: "HPCL · GSL · AAI · IOCL · BPCL · CONCOR",
  });
}
