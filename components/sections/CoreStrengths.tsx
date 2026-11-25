import {
  Award,
  BadgeCheck,
  Briefcase,
  Building,
  GraduationCap,
  ShieldHalf,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { coreStrengths } from "@/lib/site";
import { Section, SectionLabel } from "@/components/ui/Section";
import { Marked } from "@/components/ui/Marked";

/** One mark per strength, in the order BSM listed them. */
const icons: Record<string, LucideIcon> = {
  "01": Award,
  "02": ShieldHalf,
  "03": Building,
  "04": Briefcase,
  "05": GraduationCap,
  "06": UsersRound,
  "07": BadgeCheck,
};

/**
 * Our Core Strengths — seven points supplied by BSM, reproduced verbatim.
 * Presentation only: the numbering, headings and wording are not edited here.
 */
export default function CoreStrengths() {
  return (
    <Section id="core-strengths" label="Our core strengths" className="bg-ink">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <SectionLabel index="02">Our Core Strengths</SectionLabel>
            <h2 data-split className="mt-8 text-display font-semibold text-bone">
              What BSM is built <span className="accent-serif text-brass">on</span>.
            </h2>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ol className="grid gap-4 sm:grid-cols-2" data-stagger>
            {coreStrengths.map((item, i) => {
              /* The DGR sponsorship is the one credential BSM has confirmed,
                 so that card carries the brass treatment. Wording unchanged. */
              const featured = item.index === "02";
              const Icon = icons[item.index] ?? Award;
              /* Seven cards in two columns: the last one spans the row. */
              const last = i === coreStrengths.length - 1 && coreStrengths.length % 2 === 1;
              return (
                <li
                  key={item.index}
                  data-stagger-item
                  data-tilt="5"
                  className={`card group flex flex-col p-7 md:p-8 ${
                    featured ? "card-feature" : ""
                  } ${last ? "sm:col-span-2" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="icon-tile">
                      <Icon className="h-5 w-5" strokeWidth={1.4} />
                    </span>
                    <span className="index-chip">{item.index}</span>
                  </div>
                  <h3
                    className={`mt-7 font-display text-lg font-semibold tracking-[-0.01em] ${
                      featured ? "text-brass" : "text-bone"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      featured ? "text-bone/90" : "text-mist"
                    }`}
                  >
                    <Marked
                      text={item.body}
                      marks={["DGR sponsorship", "independently managed private security agency"]}
                    />
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
