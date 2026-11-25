import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import {
  legacy,
  legacyMarks,
  leadershipIntro,
  leaders,
  commitment,
  brandStatement,
  type LeaderProfile,
} from "@/lib/about";
import { media } from "@/lib/media";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionLabel } from "@/components/ui/Section";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { shortcuts } from "@/lib/navigation";
import SubNav from "@/components/layout/SubNav";
import { Marked } from "@/components/ui/Marked";
import { ArrowDown, Quote, UserRound } from "lucide-react";
import { TransitionLink } from "@/components/layout/PageTransition";
import { titleCase } from "@/lib/navigation";
import RevealEngine from "@/components/layout/RevealEngine";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About Us — Legacy, Leadership & Commitment",
  description:
    "DGR-sponsored and registered with the Ministry of Defence. Led by Principal Partner Dattatray B. Naik, with training under a retired Lt. Col.",
  keywords: [
    "about BSM Security Agency",
    "Dattatray B Naik",
    "Lt Col Bhupinder Singh Malhi",
    "DGR security agency Goa",
    "military trained security guards Goa",
  ],
});

/**
 * Body copy on this page is justified. Hyphenation is deliberately off:
 * broken words (pro-fessional, independ-ent) read as cheap in a column this
 * wide, and the measure is generous enough to justify cleanly without it.
 */
const prose = "text-justify hyphens-auto sm:hyphens-none";

/** One frame per leader, in profile order. */
const leaderShots = {
  "dattatray-b-naik": media.leaderPrincipalPartner,
  "bhupinder-singh-malhi": media.leaderTrainingPartner,
  "bhagyashree-dattatray-naik": media.leaderAdminPartner,
} as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      {/* 01 — Our Legacy & Experience */}
      <PageHero
        id="legacy"
        eyebrow="About Us"
        index="01"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
        ]}
        title={
          <>
            Our Legacy &amp; <span className="accent-serif text-brass">Experience</span>
          </>
        }
      >
        {/* One full-width column: the account runs straight down the card
            at every width. No scroll-reveal here — this block is above the
            fold, and a reveal whose ScrollTrigger has not fired would leave
            it invisible. */}
        <div className="card card-still card-ink relative mt-10 lg:mt-[clamp(1.5rem,4.5svh,3.25rem)] w-full overflow-hidden p-7 md:p-10 lg:p-[clamp(1.5rem,4svh,3rem)]">
          <span className="dot-field pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <span
            className="accent-serif pointer-events-none absolute -right-2 -top-10 select-none text-[14rem] leading-none text-brass/[0.06]"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <div className="relative space-y-6">
            {legacy.paragraphs.map((paragraph, i) => (
              <p key={i} className={`text-[clamp(0.95rem,min(1.05vw,2.05svh),1.0625rem)] leading-[1.75] text-mist ${prose}`}>
                <Marked text={paragraph} marks={legacyMarks} />
              </p>
            ))}
          </div>
        </div>
      </PageHero>

      <SubNav items={shortcuts.about} label="About page shortcuts" />

      {/* 02 — Our Leadership & Management: the introduction, with a way into
          each profile. */}
      <Section id="leadership" label={leadershipIntro.heading} className="bg-ink" fill>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-6">
            <SectionLabel index="02">Leadership</SectionLabel>
            <h2 data-split className="mt-6 text-display font-semibold text-bone">
              {leadershipIntro.heading}
            </h2>
          </div>
          <p
            data-reveal="up"
            className={`text-lead leading-relaxed text-mist lg:col-span-6 lg:pb-[0.3em] ${prose}`}
          >
            {leadershipIntro.body}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-[clamp(1.5rem,5svh,3.5rem)]" data-stagger>
          {leaders.map((leader) => {
            const shot = leaderShots[leader.id as keyof typeof leaderShots];
            return (
              <TransitionLink
                key={leader.id}
                href={`#${leader.id}`}
                data-stagger-item
                className="card card-void group flex items-center gap-4 p-3 pr-5"
              >
                <span className="relative grid aspect-square w-[clamp(4rem,11svh,6.5rem)] shrink-0 place-items-center overflow-hidden rounded-[0.9rem] bg-surface">
                  {shot.src ? (
                    <img
                      src={shot.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: shot.focus ?? "50% 20%" }}
                    />
                  ) : (
                    <UserRound className="h-7 w-7 text-brass/60" strokeWidth={1} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] tracking-[0.18em] text-brass">
                    {leader.index}
                  </span>
                  <span className="mt-1 block font-display text-[1.05rem] font-semibold leading-snug text-bone transition-colors group-hover:text-brass-lit">
                    {titleCase(leader.name)}
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug text-mist">
                    {leader.designation}
                  </span>
                </span>
                <ArrowDown
                  className="h-4 w-4 shrink-0 text-dim transition-[color,translate] duration-500 group-hover:translate-y-0.5 group-hover:text-brass"
                  strokeWidth={1.75}
                />
              </TransitionLink>
            );
          })}
        </div>
      </Section>

      {/* One full-screen section per leader. */}
      {leaders.map((leader, i) => (
        <Section
          key={leader.id}
          id={leader.id}
          label={leader.name}
          className={i % 2 === 0 ? "" : "bg-ink"}
          fill
        >
          <LeaderBlock leader={leader} />
        </Section>
      ))}

      {/* 03 — Our Commitment */}
      <Section id="commitment" label={commitment.heading} className="bg-ink" fill>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionLabel index="03">Commitment</SectionLabel>
            <h2 data-split className="mt-6 text-display font-semibold text-bone">
              {commitment.heading}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <div className="space-y-4" data-stagger>
              {commitment.paragraphs.map((paragraph, n) => (
                <div key={n} data-stagger-item className="card card-void group flex gap-5 p-7 md:p-8">
                  <span className="index-chip shrink-0">{String(n + 1).padStart(2, "0")}</span>
                  <p className={`text-lead leading-relaxed text-mist ${prose}`}>{paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 04 — Closing brand statement */}
      <section
        aria-label="BSM Security Agency"
        className="relative overflow-hidden border-t border-line bg-ink section-pad"
      >
        <span
          className="section-divider pointer-events-none absolute inset-x-0 top-0"
          aria-hidden="true"
        />
        <span className="grain-layer" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(200,164,92,0.10)_0%,transparent_70%)]"
          aria-hidden="true"
        />

        <div className="shell relative text-center">
          <span className="icon-tile mx-auto !h-14 !w-14 !rounded-2xl" data-reveal="pop">
            <Quote className="h-6 w-6" strokeWidth={1.25} />
          </span>
          <p
            data-reveal="up"
            className="mt-8 font-display text-display font-semibold tracking-[-0.02em] text-bone"
          >
            {brandStatement.name}
          </p>
          <span
            className="mx-auto mt-8 block h-0.5 w-24 rounded-full bg-brass"
            data-rule
            aria-hidden="true"
          />
          <p
            data-reveal="up"
            data-delay="0.08"
            className="accent-serif mx-auto mt-8 max-w-3xl text-title text-brass"
          >
            {brandStatement.line}
          </p>
        </div>
      </section>

      <RevealEngine />
    </>
  );
}

/**
 * One leadership profile, sized to fill one screen on desktop.
 *
 * The portrait is still — no parallax drift, no tilt — and square, its size
 * tied to the screen height so it never pushes the profile past the fold.
 * Text is set a step smaller on short screens for the same reason. The frame
 * falls back to the composed placeholder until BSM supplies a photograph —
 * no stock or generated portraits.
 */
function LeaderBlock({ leader }: { leader: LeaderProfile }) {
  const shot = leaderShots[leader.id as keyof typeof leaderShots];
  const body = `text-[clamp(0.92rem,min(1.05vw,2.05svh),1.0625rem)] leading-[1.7] text-mist ${prose}`;

  return (
    <article className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
      <div className="lg:col-span-4">
        <div className="mx-auto w-full max-w-md lg:max-w-[min(100%,calc(100svh-var(--nav-h)-var(--subnav-h)-12rem))]">
          <MediaFrame
            shot={shot}
            ratio="1 / 1"
            parallax={0}
            sizes="(max-width: 1024px) 100vw, 30vw"
          />
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="flex flex-wrap items-center gap-3" data-reveal="up">
          <span className="index-chip">{leader.index}</span>
          <p className="inline-block rounded-full border border-brass/40 bg-brass/[0.08] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-lit">
            {leader.designation}
          </p>
        </div>
        <h3
          data-reveal="up"
          className="mt-4 font-display text-title font-semibold tracking-[-0.02em] text-bone"
        >
          {leader.name}
        </h3>

        {leader.paragraphs.length > 0 && (
          <div className="mt-[clamp(1rem,2.6svh,1.75rem)] space-y-[clamp(0.6rem,1.6svh,1rem)]">
            {leader.paragraphs.map((paragraph, n) => (
              <p key={n} data-reveal="up" className={body}>
                <Marked text={paragraph} marks={leader.marks} />
              </p>
            ))}
          </div>
        )}

        {leader.listIntro && (
          <p data-reveal="up" className={`mt-[clamp(0.6rem,1.6svh,1rem)] ${body}`}>
            {leader.listIntro}
          </p>
        )}

        {leader.list && (
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2" data-stagger>
            {leader.list.map((item) => (
              <li
                key={item}
                data-stagger-item
                className="flex items-baseline gap-3 text-[clamp(0.88rem,min(0.98vw,1.9svh),0.98rem)] leading-snug text-bone/85"
              >
                <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {leader.closing && (
          <p data-reveal="up" className={`mt-[clamp(0.6rem,1.6svh,1rem)] ${body}`}>
            {leader.closing}
          </p>
        )}
      </div>
    </article>
  );
}
