import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { gallery, galleryGroups, groupId } from "@/lib/media";
import { shortcuts } from "@/lib/navigation";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { PageHero } from "@/components/ui/PageHero";
import { TransitionLink } from "@/components/layout/PageTransition";
import SubNav from "@/components/layout/SubNav";
import GalleryGroups from "@/components/sections/GalleryGroups";
import CallToAction from "@/components/sections/CallToAction";
import RevealEngine from "@/components/layout/RevealEngine";

export const metadata: Metadata = pageMetadata({
  path: "/gallery",
  title: "Gallery — Personnel, Operations & Sites",
  description:
    "Photographs of security personnel on post, shift briefings, patrol rounds and the corporate, residential, hospitality, industrial and event sites BSM Security Agency covers across Goa.",
  keywords: ["security guards photos Goa", "security operations gallery"],
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />

      <PageHero
        eyebrow="Gallery"
        index="05"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Gallery", href: "/gallery" },
        ]}
        title={
          <>
            Personnel, posts and the{" "}
            <span className="accent-serif text-brass">places</span> we hold.
          </>
        }
        lead="Personnel on post, briefings and patrol rounds, and the sites we cover across Goa — filed by what each photograph shows. Select any photograph to see it full screen."
      >
        {/* One cover card per group — three columns for three groups, so the
            row ends where the page does instead of leaving a gap on the
            right. Two across from a tablet up, the last card spanning both.

            One across on a phone. Two across there gave an odd group a row
            of two small cards and then a full-width one twice their size,
            which read as a mistake rather than a layout: three covers of
            one shape, stacked, is the same idea the desktop row states. */}
        <div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-[clamp(1.5rem,4.5svh,3.25rem)] lg:grid-cols-3"
          data-stagger
        >
          {galleryGroups.map((group, i) => {
            const items = gallery.filter((g) => g.group === group);
            const cover = items.find((g) => g.shot?.src)?.shot;
            return (
              <TransitionLink
                key={group}
                href={`#${groupId(group)}`}
                data-stagger-item
                /* 16:10 on a phone, where the card is the full width of the
                   page: close to the shape of the desktop card, and close
                   enough to the covers themselves that little is cropped.
                   The span only applies once there are two columns to
                   span. */
                className={`card card-void group relative block aspect-[16/10] p-0 sm:aspect-[4/3] lg:aspect-auto lg:h-[clamp(9rem,26svh,17rem)] ${
                  i === galleryGroups.length - 1 && galleryGroups.length % 2 === 1
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                {cover && (
                  <img
                    src={cover.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:opacity-100"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <span className="font-display text-xl font-semibold text-bone">{group}</span>
                  <span className="rounded-full bg-brass/15 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-brass">
                    {String(items.length).padStart(2, "0")}
                  </span>
                </span>
              </TransitionLink>
            );
          })}
        </div>
      </PageHero>

      <SubNav items={shortcuts.gallery} label="Gallery shortcuts" />

      <GalleryGroups />

      <CallToAction
        eyebrow="See it in person"
        title="The best photograph is the site itself."
        body="Ask for a site survey and meet the supervisor who would run the deployment. That tells you more than any gallery."
      />
      <RevealEngine />
    </>
  );
}
