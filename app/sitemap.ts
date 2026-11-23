import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { media, gallery, serviceShots, clientLogos, logo } from "@/lib/media";

/** Written once at build time — this is a static export. */
export const dynamic = "force-static";

const abs = (path: string) => `${site.url}${path}`;
const images = (srcs: (string | undefined)[]) =>
  [...new Set(srcs.filter((s): s is string => Boolean(s)))].map(abs);

/**
 * Every page, with the photographs and logos it shows, so search engines can
 * index the images alongside the pages (image sitemap).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
    images: string[];
  }[] = [
    {
      path: "/",
      priority: 1,
      changeFrequency: "monthly",
      images: images([logo.src, media.heroBackdrop.src, media.briefing.src]),
    },
    {
      path: "/services",
      priority: 0.9,
      changeFrequency: "monthly",
      images: images(Object.values(serviceShots).map((s) => s.src)),
    },
    {
      path: "/clients",
      priority: 0.8,
      changeFrequency: "monthly",
      images: images(Object.values(clientLogos)),
    },
    {
      path: "/contact",
      priority: 0.8,
      changeFrequency: "yearly",
      images: images([logo.src]),
    },
    {
      path: "/about",
      priority: 0.7,
      changeFrequency: "yearly",
      images: images([
        media.leaderPrincipalPartner.src,
        media.leaderTrainingPartner.src,
        media.leaderAdminPartner.src,
      ]),
    },
    {
      path: "/branch",
      priority: 0.7,
      changeFrequency: "yearly",
      images: images([media.headOffice.src, media.branchOfficeCabin.src]),
    },
    {
      path: "/gallery",
      priority: 0.6,
      changeFrequency: "monthly",
      images: images(gallery.map((g) => g.shot?.src)),
    },
  ];

  return routes.map((r) => ({
    // trailingSlash is on, so canonical page URLs end in "/".
    url: abs(r.path === "/" ? "/" : `${r.path}/`),
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    ...(r.images.length ? { images: r.images } : {}),
  }));
}
