import { Compass, MapPin, ScrollText } from "lucide-react";
import { Section, SectionLabel } from "@/components/ui/Section";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Button } from "@/components/ui/Button";
import { media } from "@/lib/media";

const facts = [
  { k: "Based in", v: "Goa", note: "Local teams, local knowledge, local response.", icon: MapPin },
  { k: "Operating across", v: "India", note: "Coastal, urban and industrial sites.", icon: Compass },
  { k: "Built on", v: "Procedure", note: "Written plans, documented rounds, reporting.", icon: ScrollText },
];

export default function Statement() {
  return (
    <Section id="about" label="About BSM">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionLabel index="01">Who we are</SectionLabel>
          {/* Shown on a phone too. It used to be `hidden lg:block`, so the
              one photograph in this section simply was not there on the
              device most people arrive on. The frame takes the photograph's
              own ratio, which is landscape, and that is the right shape for
              a full-width card on a phone — the tilt is pointer-driven and
              stays out of the way on touch. */}
          <div className="mt-8 lg:mt-10" data-tilt="4">
            <MediaFrame
              shot={media.briefing}
              figure="Fig. 02 / On post"
              ratio="3 / 4"
              chip
              sizes="(max-width: 1024px) 100vw, 28vw"
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          {/* Set as two lines rather than left to wrap. Allowed to find its
              own break it read "…Driven by / Excellence." at every width —
              the last word stranded on a line of its own. Breaking at the
              comma gives two clauses of nearly equal length instead, and
              `text-balance` keeps each one tidy if a narrow screen has to
              wrap inside a clause. */}
          <h2 data-scrub-words className="text-display font-semibold text-bone text-balance">
            <span className="block">
              Committed to <span className="accent-serif text-brass">Safety</span>,
            </span>
            <span className="block">Driven by Excellence.</span>
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <p data-reveal="up" className="text-lead text-justify hyphens-auto sm:hyphens-none text-mist">
              At BSM Security Agency, we believe that good security begins with the right people,
              proper planning and responsible management. We understand that every client and
              property has different security needs. That is why we take the time to understand
              each site and provide security arrangements suited to its requirements. We serve
              residential communities, commercial establishments, hotels, industries and other
              organisations.
            </p>
            <p data-reveal="up" data-delay="0.08" className="text-lead text-justify hyphens-auto sm:hyphens-none text-mist">
              Our responsibility goes beyond providing security personnel. We focus on proper
              training, clear duties, regular supervision and professional conduct. We believe in
              being accountable for our work, maintaining consistent service standards and
              building long-term relationships with our clients. At BSM, we don&rsquo;t just
              provide services; we build confidence, create safer environments and deliver peace
              of mind.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3" data-stagger>
            {facts.map((item) => (
              <div key={item.k} data-stagger-item className="card card-void group p-6 md:p-7">
                <span className="icon-tile">
                  <item.icon className="h-5 w-5" strokeWidth={1.4} />
                </span>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{item.k}</p>
                <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-bone">
                  {item.v}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mist">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-12" data-reveal="up">
            <Button href="/about" variant="outline">
              About BSM
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
