import { site, services, offices, coreStrengths } from "./site";
import { brand } from "./seo";
import { logo } from "./media";

/**
 * Structured data (schema.org JSON-LD) for search engines.
 *
 * Only facts BSM has supplied are published here — names, addresses, numbers,
 * hours, services and the 2013 founding. Search engines surface this data
 * directly in results, so nothing unverified (ratings, headcount, licence
 * numbers) is ever added.
 */

const abs = (path: string) => `${site.url}${path}`;
const orgId = abs("/#organization");

/** "+91 94212 49677" → "+919421249677" */
const e164 = (display: string) => display.replace(/[^\d+]/g, "");

/** "Established in Goa in 2013 with DGR sponsorship…" → "2013" */
const foundingYear = coreStrengths
  .map((s) => s.body.match(/\b(19|20)\d{2}\b/)?.[0])
  .find(Boolean);

const openingHours = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  opens: "09:00",
  closes: "17:30",
};

const areaServed = [
  { "@type": "State", name: "Goa" },
  { "@type": "Country", name: "India" },
];

/** The ten service categories as an offer catalogue. */
const catalogue = {
  "@type": "OfferCatalog",
  name: "Security services",
  itemListElement: services.map((s) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      "@id": abs(`/services#${s.slug}`),
      name: s.title,
      url: abs(`/services#${s.slug}`),
      ...(s.points.length ? { description: s.points.join(" ") } : {}),
      serviceType: s.title,
      provider: { "@id": orgId },
      areaServed,
    },
  })),
};

/** Each office as its own place, with its own address and lines. */
const officePlaces = offices.map((o) => ({
  "@type": ["LocalBusiness", "SecurityService"],
  "@id": abs(`/branch#${o.id}`),
  name: `${brand.name} — ${o.kind}`,
  url: abs(`/branch#${o.id}`),
  address: { "@type": "PostalAddress", streetAddress: o.address, addressRegion: "Goa", addressCountry: "IN" },
  telephone: o.phones.map((p) => e164(p.display)),
  email: o.email.display,
  hasMap: o.mapLink,
  openingHoursSpecification: openingHours,
  parentOrganization: { "@id": orgId },
}));

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "SecurityService"],
  "@id": orgId,
  name: brand.name,
  alternateName: ["BSM", brand.short],
  legalName: site.legalName,
  description: site.description,
  slogan: site.tagline,
  url: site.url,
  logo: { "@type": "ImageObject", url: abs(logo.src), width: logo.width, height: logo.height },
  image: abs(logo.src),
  ...(foundingYear ? { foundingDate: foundingYear } : {}),
  telephone: e164(site.contact.phone),
  email: site.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.address.street,
    addressLocality: site.contact.address.locality,
    addressRegion: site.contact.address.region,
    postalCode: site.contact.address.postalCode,
    addressCountry: "IN",
  },
  hasMap: site.contact.mapsLink,
  openingHoursSpecification: openingHours,
  areaServed,
  knowsLanguage: ["en-IN", "hi-IN", "kok"],
  knowsAbout: services.map((s) => s.title),
  contactPoint: [
    ...site.contact.phones.map((p) => ({
      "@type": "ContactPoint",
      telephone: e164(p.display),
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Konkani"],
    })),
    {
      "@type": "ContactPoint",
      email: site.contact.email,
      contactType: "sales",
      areaServed: "IN",
    },
  ],
  hasOfferCatalog: catalogue,
  department: officePlaces,
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#website"),
  url: site.url,
  name: brand.name,
  alternateName: brand.short,
  description: site.description,
  publisher: { "@id": orgId },
  inLanguage: "en-IN",
} as const;

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path === "/" ? "/" : item.path),
    })),
  };
}

/** Small helper so pages can drop a schema block without repeating boilerplate. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
