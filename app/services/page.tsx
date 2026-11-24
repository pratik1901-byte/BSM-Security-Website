import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArrowDown, Check } from "lucide-react";
import { services } from "@/lib/site";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { serviceShots } from "@/lib/media";
import { serviceShortLabels } from "@/lib/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Copy } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/layout/PageTransition";
import CallToAction from "@/components/sections/CallToAction";
import RevealEngine from "@/components/layout/RevealEngine";

export const metadata: Metadata = pageMetadata({
  path: "/services",
  title: "Security Services — Guards, Industrial, Banking, Event & Bouncer Services",
  description:
    "Ten services from BSM Security Agency, Goa: guards, industrial, banking, bouncer and personal, access control, CCTV, event, training and housekeeping.",
  keywords: [
    "security guard services Goa",
    "bouncer services Goa",
    "wedding security Goa",
    "event security Goa",
    "bank security guards Goa",
    "ATM security Goa",
    "CCTV surveillance Goa",
    "access control services Goa",
    "industrial security Goa",
    "housekeeping services Goa",
    "security training Goa",
  ],
});

/*
 * Photographs come from the serviceShots dictionary in lib/media. Most are the
 * category images BSM supplied; replace a `src` there to change one.
 */

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <PageHero
        id="overview"
        eyebrow="Services"
        index="04"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
        title={
          <>
            Deployments planned for the{" "}
            <span className="accent-serif text-brass">site</span>.
          </>
        }
        lead="Our services are designed to address a wide range of security requirements across different sectors and establishments."
      >
        {/* Contents: ten rounded cards, each with its photograph. */}
        <ul className="mt-10 lg:mt-[clamp(1.5rem,4.5svh,3.25rem)] grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:gap-4" data-stagger>
          {services.map((service) => (
            <li key={service.slug} data-stagger-item>
              <TransitionLink
                href={`#${service.slug}`}
                className={`card group flex h-full items-center gap-4 p-4 lg:py-[clamp(0.85rem,2.2svh,1.25rem)] ${
                  service.highlight ? "card-feature" : "card-void"
                }`}
              >
                <span className="index-chip shrink-0">{service.index}</span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block font-display text-[15px] font-semibold leading-snug ${
                      service.highlight ? "text-brass" : "text-bone"
                    }`}
                  >
                    {serviceShortLabels[service.slug]}
                  </span>
                  <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.16em] text-dim">
                    {service.points.length ? `${service.points.length} services` : "Additional service"}
                  </span>
                </span>
                <ArrowDown
                  className="h-4 w-4 shrink-0 text-dim transition-[color,translate] duration-500 group-hover:translate-y-0.5 group-hover:text-brass"
                  strokeWidth={1.75}
                />
              </TransitionLink>
            </li>
          ))}
        </ul>
      </PageHero>


      {/* Service detail blocks */}
      {services.map((service, i) => {
        const shot = serviceShots[service.slug];
        const flipped = i % 2 === 1;
        return (
          <Section
            key={service.slug}
            id={service.slug}
            label={service.title}
            className={i % 2 === 1 ? "bg-ink" : ""}
          >
            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
              <div className={`lg:col-span-6 ${flipped ? "lg:order-2 lg:col-start-7" : ""}`}>
                <div
                  className="inline-flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.025] py-1.5 pl-1.5 pr-4"
                  data-reveal="up"
                >
                  <span className="index-chip !h-7">{service.index}</span>
                  <span className="eyebrow">
                    {service.highlight ? "Additional service" : "Service"}
                  </span>
                </div>

                <h2
                  data-split
                  className={`mt-8 text-title font-semibold tracking-[-0.01em] ${
                    service.highlight ? "text-brass" : "text-bone"
                  }`}
                >
                  {service.title}
                </h2>
                <span
                  className="mt-6 block h-0.5 w-28 origin-left rounded-full bg-gradient-to-r from-brass to-brass/0"
                  data-rule
                  aria-hidden="true"
                />

                {/* A category whose points BSM has not supplied yet carries the
                    heading and its frame only — nothing is written in for it. */}
                {service.points.length > 0 && (
                  <>
                    <ul className="mt-10 grid gap-2.5" data-stagger>
                      {service.points.map((point) => (
                        <li
                          key={point}
                          data-stagger-item
                          className="card card-still group flex items-start gap-4 rounded-2xl px-5 py-4"
                          style={{ ["--card-bg" as string]: i % 2 === 1 ? "var(--color-void)" : "var(--color-surface)" }}
                        >
                          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brass/15 text-brass transition-colors duration-500 group-hover:bg-brass group-hover:text-void">
                            <Check className="h-3.5 w-3.5" strokeWidth={2} />
                          </span>
                          <span className="text-sm leading-relaxed text-bone/90">
                            <Copy text={point} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3" data-reveal="up">
                  <Button href={`/contact?service=${service.slug}#enquiry`} variant="outline">
                    Enquire about this service
                  </Button>
                </div>
              </div>

              <div
                className={`lg:sticky lg:top-[calc(var(--nav-h)+var(--subnav-h)+2.5rem)] lg:col-span-5 ${
                  flipped ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"
                }`}
                data-tilt="4"
              >
                <MediaFrame
                  shot={shot}
                  figure={`Fig. ${service.index}`}
                  label={serviceShortLabels[service.slug]}
                  parallax={0}
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
              </div>
            </div>
          </Section>
        );
      })}

      <CallToAction
        eyebrow="Plan a deployment"
        title="Start with a site survey."
        body="Tell us where the site is, what the hours look like and which of these services you need. We will walk it, then put a written deployment plan in front of you."
      />
      <RevealEngine />
    </>
  );
}
