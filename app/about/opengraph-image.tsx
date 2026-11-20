import { face, ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt =
  "BSM Security Agency, Goa — Our Legacy & Experience, and the three partners behind it";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Rendered once at build time — this is a static export. */
export const dynamic = "force-static";

export default async function Image() {
  /* The three partners, in the order the page profiles them. */
  const people = await Promise.all(
    [
      {
        src: "/media/people/leader-principal-partner.webp",
        name: "Mr. Dattatray B. Naik",
        role: "Principal Partner",
      },
      {
        src: "/media/people/leader-training-partner.webp",
        name: "Lt. Col. B. S. Malhi (Retd.)",
        role: "Partner",
      },
      {
        src: "/media/people/leader-admin-partner.webp",
        name: "Mrs. Bhagyashree D. Naik",
        role: "Partner",
      },
    ].map(async (p) => ({ ...p, src: await face(p.src) })),
  );

  return ogCard({
    eyebrow: "About Us · BSM Security Agency",
    title: "Our Legacy & Experience",
    lead: "Established 2013 and registered with the Directorate General Resettlement, Ministry of Defence.",
    foot: "Leadership · Training · Commitment",
    people,
  });
}
