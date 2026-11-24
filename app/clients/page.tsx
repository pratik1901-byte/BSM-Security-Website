import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Info } from "lucide-react";
import { clients } from "@/lib/site";
import { clientLogos } from "@/lib/media";
import { shortcuts } from "@/lib/navigation";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionLabel } from "@/components/ui/Section";
import SubNav from "@/components/layout/SubNav";
import CallToAction from "@/components/sections/CallToAction";
import RevealEngine from "@/components/layout/RevealEngine";

export const metadata: Metadata = pageMetadata({
  path: "/clients",
  title: "Our Esteemed Clients — PSUs, Defence, Airports & Government",
  description:
    "Organisations BSM Security Agency serves across Goa, including HPCL, Goa Shipyard, CSIR-NIO, Airports Authority of India, Indian Oil, BPCL and INS Hansa.",
  keywords: [
    "security services for PSUs Goa",
    "airport security services Goa",
    "defence establishment security Goa",
    "government security contractor Goa",
  ],
});

export default function ClientsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Clients", path: "/clients" },
        ])}
      />

      <PageHero
        id="overview"
        eyebrow="Clients"
        index="03"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Clients", href: "/clients" },
        ]}
        title={
          <>
            The sites we hold, and the people who{" "}
            <span className="accent-serif text-brass">rely</span> on it.
          </>
        }
      >
        <div
          data-reveal="up"
          className="mt-8 max-w-4xl space-y-5 text-lead text-justify text-mist lg:mt-[clamp(1.5rem,4.5svh,3.25rem)]"
        >
          <p>
            BSM Security Agency&apos;s client portfolio brings together organisations from the
            aviation, energy, maritime, industrial, research, public-sector and logistics sectors.
          </p>
          <p>
            Our engagements span airport facilities, government and defence establishments,
            petroleum operations, shipbuilding, research institutions and logistics
            infrastructure. These associations reflect the diverse operational environments in
            which BSM has provided security services.
          </p>
        </div>
      </PageHero>

      <SubNav items={shortcuts.clients} label="Client page shortcuts" />

      {/* Client roster */}
      <Section id="roster" label="Our esteemed DGR sponsored public sector clients">
        <SectionLabel index="01">Our clients</SectionLabel>
        <h2
          data-split
          className="mt-8 text-display font-semibold uppercase tracking-[-0.01em] text-bone"
        >
          Our Esteemed <span className="text-brass">DGR Sponsored</span> Public Sector{" "}
          <span className="text-brass">Clients</span>
        </h2>

        <p data-reveal="up" className="mt-10 max-w-4xl text-lead text-justify text-mist">
          Explore the organisations associated with BSM Security Agency, along with their
          respective locations and operational details across the public, government, defence,
          aviation and industrial sectors.
        </p>

        {/* Ten cards: five across on a desktop, three on a tablet, one on a
            phone. Each card is an anchor target for the navbar's Clients menu. */}
        <div
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          data-stagger
        >
          {clients.map((client) => {
            /* Artwork comes from the clientLogos dictionary in lib/media —
               a local file or a URL on the organisation's own site. */
            const logo = clientLogos[client.slug];
            return (
              <article
                key={client.slug}
                id={`client-${client.slug}`}
                data-anchor=""
                data-stagger-item
                data-tilt="6"
                className="card card-void group flex h-full flex-col p-3"
              >
                {/* Logos are printed on a light plate: these are the
                    organisations' own marks, in their own colours, and are
                    drawn for white. An empty frame keeps the dark surface. */}
                <div
                  className={`relative flex w-full items-center justify-center overflow-hidden rounded-[1.1rem] ${
                    logo ? "bg-white p-5" : "border border-dashed border-brass/30 bg-surface"
                  }`}
                  style={{ aspectRatio: "3 / 2" }}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={`${client.name} logo`}
                      /* The organisation's own mark — not ours to show larger. */
                      data-no-preview
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                  ) : (
                    <span className="flex flex-col items-center gap-2">
                      {client.abbr && (
                        <span className="font-display text-2xl font-semibold tracking-[-0.02em] text-bone/80">
                          {client.abbr}
                        </span>
                      )}
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brass/80">
                        [Logo]
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                  <h3 className="font-display text-base font-semibold leading-snug text-white">
                    {client.name}
                  </h3>
                  {client.abbr && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
                      {client.abbr}
                    </p>
                  )}

                  <ul className="mt-4 space-y-2 rounded-[0.9rem] border border-brass/20 bg-brass/[0.05] p-3.5">
                    {client.details.map((detail, i) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2.5 text-[13px] leading-relaxed text-bone"
                      >
                        {/* The site numbers its lists rather than bulleting them;
                            these follow suit, in the same brass. */}
                        <span className="mt-[0.15rem] shrink-0 font-mono text-[10px] font-semibold tabular-nums tracking-[0.12em] text-brass">
                          {i + 1}
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* The roster is a selection, and says so. */}
        <div
          className="mt-10 flex items-start gap-4 rounded-2xl border border-brass/25 bg-brass/[0.04] p-5 md:p-6"
          data-reveal="up"
        >
          <span className="icon-tile !h-10 !w-10 !rounded-xl">
            <Info className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <p className="text-sm leading-relaxed text-justify text-mist">
            The organisations named above are BSM&apos;s esteemed clients in the public sector. The
            list is a selection rather than a complete record: BSM serves further Public Sector
            Undertakings, and a number of private sector clients, which are not named on this page.
          </p>
        </div>
      </Section>

      <CallToAction
        id="get-in-touch"
        eyebrow="Become a client"
        title="Start with a site survey."
        body="Tell us where the site is and what the hours look like. We will walk it, then put a written deployment plan in front of you."
      />
      <RevealEngine />
    </>
  );
}
