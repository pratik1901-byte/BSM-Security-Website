/**
 * Navigation — the dictionary behind the navbar, its dropdown menus, the
 * mobile menu and the shortcut bar (sub-nav) on each inner page.
 *
 * Everything here is derived from lib/site.ts and lib/about.ts, so adding a
 * service, client or office there adds it to the menus automatically. The only
 * thing written here is the short label each service carries in tight spaces
 * (menus, the shortcut bar): the full headings in lib/site.ts are BSM's own
 * wording and are never shortened in place.
 */

import { clients, offices, site, type ServiceSlug } from "./site";
import { leaders } from "./about";
import { galleryGroups, groupId } from "./media";

export type Shortcut = { id: string; label: string };

/** "LT. COL. BHUPINDER SINGH MALHI (RETD.)" → "Lt. Col. Bhupinder Singh Malhi (Retd.)" */
export function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/(^|[\s(])(\p{L})/gu, (_, lead: string, ch: string) => lead + ch.toUpperCase());
}

/**
 * Longer labels for the homepage service list, which gives each service a
 * row of its own. The short labels below are sized for the menus, the
 * footer, the Hero chips and the shortcut bar, where a longer line wraps or
 * is clipped. A service with no entry here uses its short label.
 */
export const serviceHomeLabels: Partial<Record<ServiceSlug, string>> = {
  "public-sector-government-defence-security": "Public Sector & Defence Ex-Security",
};

/** Short labels for menus and the shortcut bar. Headings stay verbatim. */
export const serviceShortLabels: Record<ServiceSlug, string> = {
  "public-sector-government-defence-security": "Public Sector & Defence",
  "industrial-corporate-security": "Industrial & Corporate",
  "security-guard-services": "Security Guards",
  "bouncer-personal-security-services": "Bouncer & Personal",
  "access-control-surveillance": "Access & Surveillance",
  "banking-commercial-security": "Banking & Commercial",
  "residential-institutional-security": "Residential & Institutional",
  "wedding-event-specialised-security": "Wedding & Events",
  "security-training-personnel-development": "Training & Development",
  "housekeeping-services": "Housekeeping",
};

/** Which dropdown a top-level item opens. `null` is a plain link. */
export type MenuKey = "about" | "branch" | "clients" | "services" | "gallery" | "contact";

export type NavItem = { label: string; href: string; menu: MenuKey | null };

export const navItems: NavItem[] = site.nav.map((item) => ({
  ...item,
  menu: (
    {
      "/about": "about",
      "/branch": "branch",
      "/clients": "clients",
      "/services": "services",
      "/gallery": "gallery",
      "/contact": "contact",
    } as Record<string, MenuKey>
  )[item.href] ?? null,
}));

/* --------------------------------------------------------------------------
   Shortcut bars — one per inner page, in page order. Each id is an element
   on that page carrying `data-anchor`.
   -------------------------------------------------------------------------- */

export const shortcuts = {
  about: [
    { id: "legacy", label: "Our Legacy" },
    { id: "leadership", label: "Leadership" },
    ...leaders.map((l) => ({ id: l.id, label: titleCase(l.name) })),
    { id: "commitment", label: "Commitment" },
  ],
  branch: offices.flatMap((o) => [
    { id: o.id, label: o.kind },
    { id: `${o.id}-leadership`, label: `${o.kind} leadership` },
  ]),
  clients: [
    { id: "overview", label: "Overview" },
    { id: "roster", label: "Our Clients" },
    { id: "get-in-touch", label: "Become a Client" },
  ],
  gallery: galleryGroups.map((g) => ({ id: groupId(g), label: g })),
  contact: [
    { id: "channels", label: "Call & WhatsApp" },
    { id: "enquiry", label: "Enquiry Form" },
    { id: "offices", label: "Our Offices" },
  ],
} satisfies Record<string, Shortcut[]>;

/** Client entries in menu form, in roster order. */
export const clientMenu = clients.map((c) => ({
  slug: c.slug,
  label: c.abbr ?? c.name,
  name: c.name,
  place: c.details[0],
}));
