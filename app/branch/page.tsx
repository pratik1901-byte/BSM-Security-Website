import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  Clock,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { offices, site, type Office } from "@/lib/site";
import { media, type Shot } from "@/lib/media";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { Section, SectionLabel } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { shortcuts } from "@/lib/navigation";
import SubNav from "@/components/layout/SubNav";
import { TransitionLink } from "@/components/layout/PageTransition";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { MapEmbed } from "@/components/ui/MapEmbed";
import RevealEngine from "@/components/layout/RevealEngine";

/**
 * Portraits for the people who have one, keyed by the id in lib/site.ts. An
 * office person with no entry here keeps the icon — which is still everyone
 * at the Head Office.
 */
const portraits: Record<string, Shot> = {
  "dattatray-b-naik": media.leaderPrincipalPartner,
  "bhupinder-singh-malhi": media.leaderTrainingPartner,
  "bhagyashree-dattatray-naik": media.leaderAdminPartner,
  "nihal-d-naik": media.legalAdvisor,
  "vighnesh-shet": media.branchInCharge,
  "pranali-v-shet": media.branchAdmin,
};

export const metadata: Metadata = pageMetadata({
  path: "/branch",
  title: "Our Offices — Head Office Margao & Branch Office Panjim",
  description:
    "BSM Security Agency offices in Goa: Head Office at Kurtarkar Classic, Aquem, Margao and Branch Office at Kadamba Govt Housing Society, Chimbel, Panjim — addresses, phone and WhatsApp numbers, email, maps and office leadership.",
  keywords: [
    "security agency office Margao",
    "security agency Aquem Margao",
    "security agency Chimbel",
    "security agency Old Goa",
    "BSM Security contact address",
  ],
});

/** One photograph per office. Shown only once BSM supplies it. */
const officeShots = {
  "head-office": media.headOffice,
  "branch-office-goa": media.branchOfficeGoa,
} as const;

/** Turn-by-turn directions to an address, in Google Maps. */
const directions = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

export default function BranchPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Branch", path: "/branch" },
        ])}
      />

      <PageHero
        eyebrow="Branch"
        index="02"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Branch", href: "/branch" },
        ]}
        title={
          <>
            Our offices in <span className="accent-serif text-brass">Goa</span>.
          </>
        }
        lead="The Head Office at Aquem, Margao and the Branch Office at Chimbel — addresses, contact numbers, email and the people who lead each one."
      >
        {/* One full contact panel per office. */}
        <div className="mt-10 grid gap-4 lg:mt-[clamp(1.5rem,4.5svh,3.25rem)] md:grid-cols-2" data-stagger>
          {offices.map((office) => (
            <article
              key={office.id}
              data-stagger-item
              className="card card-void card-still flex min-w-0 flex-col p-5 md:p-6 lg:p-[clamp(1.1rem,2.8svh,1.75rem)]"
            >
              <div className="flex items-start gap-4">
                <span className="icon-tile !h-12 !w-12 !rounded-2xl">
                  {office.id === "head-office" ? (
                    <Building2 className="h-5 w-5" strokeWidth={1.25} />
                  ) : (
                    <MapPin className="h-5 w-5" strokeWidth={1.25} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                    {office.index} / {office.kind}
                  </p>
                  <h2 className="mt-1 font-display text-[clamp(1.15rem,min(1.5vw,2.9svh),1.45rem)] font-semibold tracking-[-0.01em] text-bone">
                    {office.name}
                  </h2>
                  <address className="mt-2 text-sm not-italic leading-relaxed text-mist">
                    {office.address}
                  </address>
                </div>
              </div>

              {/* Every way to reach this office, one click each. */}
              <div className="mt-[clamp(1rem,2.6svh,1.5rem)] flex flex-wrap gap-2 border-t border-white/[0.06] pt-[clamp(1rem,2.6svh,1.5rem)]">
                {office.phones.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-[13px] font-medium text-bone transition-colors hover:border-brass hover:text-brass"
                  >
                    <Phone className="h-3.5 w-3.5 text-brass" strokeWidth={1.75} />
                    {p.display}
                  </a>
                ))}
                {office.whatsapps[0] && (
                  <a
                    href={office.whatsapps[0].href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#25d366]/30 bg-[#25d366]/[0.06] px-3.5 py-2 text-[13px] font-medium text-bone transition-colors hover:border-[#25d366]"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 text-[#25d366]" />
                    WhatsApp
                  </a>
                )}
                <a
                  href={office.email.href}
                  className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-[13px] font-medium text-bone transition-colors hover:border-brass hover:text-brass"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-brass" strokeWidth={1.75} />
                  <span className="truncate">{office.email.display}</span>
                </a>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-[clamp(1rem,2.6svh,1.5rem)]">
                <TransitionLink
                  href={`#${office.id}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-brass px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-brass-lit"
                >
                  Office details
                  <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" strokeWidth={2} />
                </TransitionLink>
                <a
                  href={directions(office.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone transition-colors hover:border-brass hover:text-brass"
                >
                  <Navigation className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Directions
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Facts that apply to both offices. */}
        <dl
          className="mt-4 grid gap-px overflow-hidden rounded-[1.25rem] border border-white/[0.06] bg-white/[0.06] sm:grid-cols-3"
          data-reveal="up"
        >
          <div className="flex min-w-0 items-center gap-3 bg-void px-5 py-[clamp(0.85rem,2.2svh,1.25rem)]">
            <Clock className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Office hours</dt>
              <dd className="mt-0.5 text-sm font-medium text-bone">
                {site.contact.hours[0].days}, {site.contact.hours[0].time}
              </dd>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 bg-void px-5 py-[clamp(0.85rem,2.2svh,1.25rem)]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Services available</dt>
              <dd className="mt-0.5 text-sm font-medium text-bone">{site.contact.servicesAvailable}</dd>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 bg-void px-5 py-[clamp(0.85rem,2.2svh,1.25rem)]">
            <Phone className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
            <div className="min-w-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">General enquiries</dt>
              <dd className="mt-0.5 break-words text-sm font-medium text-bone">
                <a href={site.contact.phoneHref} className="hover:text-brass">{site.contact.phone}</a>
                <span className="text-dim"> · </span>
                <a href={site.contact.emailHref} className="hover:text-brass">{site.contact.email}</a>
              </dd>
            </div>
          </div>
        </dl>
      </PageHero>

      <SubNav items={shortcuts.branch} label="Office shortcuts" />

      {offices.map((office, i) => (
        <OfficeBlock key={office.id} office={office} tinted={i % 2 === 1} />
      ))}

      <RevealEngine />
    </>
  );
}

/* -------------------------------------------------------------------------- */

/** A full-width contact row: icon, small label, value — the whole row is the link. */
function ContactRow({
  href,
  external,
  icon,
  label,
  children,
}: {
  href?: string;
  external?: boolean;
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  const body = (
    <>
      <span className="icon-tile !h-10 !w-10 !rounded-xl">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
          {label}
        </span>
        <span className="mt-1 block break-words text-[15px] font-medium leading-snug text-bone transition-colors duration-300 group-hover/row:text-brass-lit">
          {children}
        </span>
      </span>
      {href && (
        <ArrowUpRight
          className="mt-1 h-4 w-4 shrink-0 text-dim transition-[color,translate] duration-300 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-brass"
          strokeWidth={1.75}
        />
      )}
    </>
  );
  const cls =
    "group/row flex items-start gap-4 rounded-xl px-3 py-3.5 transition-colors duration-300";
  return href ? (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`${cls} hover:bg-white/[0.04] focus-visible:bg-white/[0.04]`}
    >
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function OfficeBlock({ office, tinted }: { office: Office; tinted: boolean }) {
  const shot = officeShots[office.id as keyof typeof officeShots];
  const surface = tinted ? "card-void" : "card-ink";
  const primaryPhone = office.phones[0];
  const primaryWhatsApp = office.whatsapps[0];

  return (
    <Section id={office.id} label={office.kind} className={tinted ? "bg-ink" : ""}>
      {/* ---- Header: who, and the four things people come here to do ----- */}
      <div className="flex flex-col gap-6">
        <div>
          <SectionLabel index={office.index}>{office.kind}</SectionLabel>
          <h2 data-reveal="up" className="mt-6 text-display font-semibold text-bone">
            {office.name}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2.5" data-reveal="up" data-delay="0.05">
          {primaryPhone && (
            <a
              href={primaryPhone.href}
              className="inline-flex items-center gap-2 rounded-full bg-brass px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-brass-lit"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              Call
            </a>
          )}
          {primaryWhatsApp && (
            <a
              href={primaryWhatsApp.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#25d366]/40 bg-[#25d366]/[0.08] px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-[#25d366] hover:bg-[#25d366]/20"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25d366]" />
              WhatsApp
            </a>
          )}
          <a
            href={office.email.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-bone transition-colors hover:border-brass hover:text-brass"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} />
            Email
          </a>
          <a
            href={directions(office.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-bone transition-colors hover:border-brass hover:text-brass"
          >
            <Navigation className="h-4 w-4" strokeWidth={1.75} />
            Directions
          </a>
        </div>
      </div>

      {/* ---- Contact details beside a large, readable map ---------------- */}
      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-5" data-reveal="up">
          {shot.src && (
            <MediaFrame
              shot={shot}
              ratio="16 / 10"
              parallax={0}
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          )}

          <div className={`card card-still ${surface} divide-y divide-white/[0.06] p-2.5`}>
            <ContactRow
              href={directions(office.address)}
              external
              icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}
              label={office.addressLabel}
            >
              <address className="not-italic">{office.address}</address>
            </ContactRow>

            {office.additionalAddress && (
              <ContactRow
                icon={<Building2 className="h-4 w-4" strokeWidth={1.5} />}
                label={office.additionalAddressLabel ?? "Address"}
              >
                <address className="not-italic text-mist">{office.additionalAddress}</address>
              </ContactRow>
            )}

            {office.phones.map((line, i) => (
              <ContactRow
                key={line.href}
                href={line.href}
                icon={<Phone className="h-4 w-4" strokeWidth={1.5} />}
                label={office.phones.length > 1 ? `Phone ${i + 1}` : "Phone"}
              >
                {line.display}
              </ContactRow>
            ))}

            {office.whatsapps.map((line, i) => (
              <ContactRow
                key={line.href}
                href={line.href}
                external
                icon={<WhatsAppIcon className="h-4 w-4" />}
                label={office.whatsapps.length > 1 ? `WhatsApp ${i + 1}` : "WhatsApp"}
              >
                {line.display}
              </ContactRow>
            ))}

            <ContactRow
              href={office.email.href}
              icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
              label="Email"
            >
              {office.email.display}
            </ContactRow>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7" data-reveal="fade">
          <MapEmbed
            src={office.mapEmbed}
            title={office.mapTitle}
            address={office.address}
            directionsHref={directions(office.address)}
            openHref={office.mapLink}
            className="h-[26rem] lg:h-full lg:min-h-[32rem]"
          />
        </div>
      </div>

      {/* ---- Leadership -------------------------------------------------- */}
      <div id={`${office.id}-leadership`} data-anchor="" className="mt-16">
        <div className="flex items-center gap-3" data-reveal="up">
          <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden="true" />
          <h3 className="eyebrow">{office.leadershipLabel}</h3>
        </div>

        {/* Two across at every width above a phone. Four across left only
            108px of card between the portrait and the edge, which wrapped a
            name like Mrs. Bhagyashree Dattatray Naik over four lines. */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2" data-stagger>
          {office.leadership.map((person) => {
            const portrait = person.id ? portraits[person.id] : undefined;
            return (
            <article
              key={person.name}
              data-stagger-item
              className={`card card-still ${surface} flex min-w-0 flex-col p-7 ${person.advisory ? "card-feature" : ""}`}
            >
              <div className="flex items-start gap-4">
                {portrait?.src ? (
                  <img
                    src={portrait.src}
                    alt={portrait.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-[5rem] w-[5rem] shrink-0 rounded-2xl border border-brass/25 object-cover"
                    style={{ objectPosition: portrait.focus ?? "50% 25%" }}
                  />
                ) : (
                  <span className="icon-tile !h-[5rem] !w-[5rem] !rounded-2xl">
                    {person.advisory ? (
                      <Scale className="h-5 w-5" strokeWidth={1.25} />
                    ) : (
                      <UserRound className="h-5 w-5" strokeWidth={1.25} />
                    )}
                  </span>
                )}
                <div className="min-w-0">
                  <h4 className="font-display text-lg font-semibold leading-snug tracking-[-0.01em] text-bone">
                    {person.name}
                  </h4>
                  <p
                    className={`mt-1.5 text-[13px] leading-snug ${
                      person.advisory ? "text-brass" : "text-mist"
                    }`}
                  >
                    {person.role}
                    {person.advisory && <span className="block text-dim">To the Head Office</span>}
                  </p>
                  {person.responsibilities && (
                    <p className="mt-2 text-[12.5px] leading-relaxed text-dim">
                      {person.responsibilities}
                    </p>
                  )}
                </div>
              </div>

              {person.phone && (
                <a
                  href={person.phone.href}
                  className="group/row mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4"
                >
                  <span className="inline-flex items-center gap-2.5 text-[15px] font-medium text-bone transition-colors group-hover/row:text-brass-lit">
                    <Phone className="h-4 w-4 text-brass" strokeWidth={1.5} />
                    {person.phone.display}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-dim transition-colors group-hover/row:text-brass"
                    strokeWidth={1.75}
                  />
                </a>
              )}
            </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
