/**
 * Search and sharing metadata, in one place.
 *
 * Every page builds its <head> through pageMetadata(), so canonical URLs,
 * Open Graph, Twitter cards and keywords stay consistent and complete. All
 * wording here is drawn from facts already on the site (lib/site, lib/about):
 * nothing is claimed in search results that the pages themselves do not say.
 */

import type { Metadata } from "next";
import { site } from "./site";

export const brand = {
  name: "BSM Security Agency",
  short: "BSM Security",
  /** Shown after every page title: "Services | BSM Security Agency, Goa". */
  suffix: "BSM Security Agency, Goa",
};

/** Search terms the whole site is relevant to. */
export const baseKeywords = [
  "BSM Security Agency",
  "BSM security",
  "security agency in Goa",
  "security services Goa",
  "security guards Goa",
  "security company Goa",
  "private security agency Goa",
  "DGR sponsored security agency",
  "security agency Margao",
  "security agency Panjim",
  "security agency Vasco",
  "manpower security Goa",
];

/**
 * Each route has its own share card, so a link to Services does not arrive
 * looking like a link to the home page. It has to be named here: a page
 * that defines its own openGraph replaces the one Next.js would attach,
 * card included.
 *
 * The URL points at the exported PNG rather than at the generating route.
 * The route emits a file with no extension, which a host serves as
 * application/octet-stream — and WhatsApp, which wants an image type and an
 * image extension, declines to show it. /og-image/<page>.png is the same
 * picture with both.
 */
const CARDS: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/clients": "clients",
  "/branch": "branch",
  "/gallery": "gallery",
  "/contact": "contact",
};

function shareImage(path: string, alt: string) {
  const name = CARDS[path.replace(/\/$/, "") || "/"] ?? "home";
  return { url: `/og-image/${name}.png`, width: 1200, height: 630, type: "image/png", alt };
}

export function pageMetadata({
  path,
  title,
  description,
  keywords = [],
  absoluteTitle = false,
}: {
  /** Route, e.g. "/services". */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  /** Use the title as-is, without the brand suffix (home page). */
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${brand.suffix}`;
  const url = `${site.url}${path === "/" ? "" : path}`;
  const card = shareImage(path, `${fullTitle} — BSM Security Agency, Goa`);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...keywords, ...baseKeywords],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: brand.name,
      title: fullTitle,
      description,
      images: [card],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [card.url],
    },
  };
}
