import { Compass, Target } from "lucide-react";
import { vision, mission } from "@/lib/site";
import { Section, SectionLabel } from "@/components/ui/Section";

/**
 * Our Vision and Our Mission — supplied by BSM, reproduced verbatim and
 * given equal visual weight.
 */
export default function VisionMission() {
  const items = [
    { title: "Our Vision", body: vision, icon: Compass, n: "V" },
    { title: "Our Mission", body: mission, icon: Target, n: "M" },
  ];
  return (
    <Section id="vision-mission" label="Our vision and mission">
      <SectionLabel index="03">Vision &amp; Mission</SectionLabel>

      <div className="mt-14 grid gap-5 lg:grid-cols-2" data-stagger>
        {items.map((item) => (
          <article
            key={item.title}
            data-stagger-item
            className="card card-void group relative overflow-hidden p-8 md:p-12"
          >
            <span className="dot-field pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            {/* Oversized initial, set in the serif, as a quiet watermark. */}
            <span
              className="accent-serif pointer-events-none absolute -bottom-16 -right-4 select-none text-[16rem] leading-none text-white/[0.03] transition-colors duration-700 group-hover:text-brass/[0.07]"
              aria-hidden="true"
            >
              {item.n}
            </span>
            <div className="relative">
              <span className="icon-tile !h-14 !w-14 !rounded-2xl">
                <item.icon className="h-6 w-6" strokeWidth={1.25} />
              </span>
              <h2 className="mt-8 font-display text-display font-semibold text-bone">{item.title}</h2>
              <span className="mt-6 block h-0.5 w-16 rounded-full bg-brass transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-28" aria-hidden="true" />
              <p className="mt-8 max-w-xl text-lead leading-relaxed text-justify text-mist">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
