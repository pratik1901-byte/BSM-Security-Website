import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArrowUpRight, Building2, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { site, offices } from "@/lib/site";
import { shortcuts } from "@/lib/navigation";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionLabel } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import SubNav from "@/components/layout/SubNav";
import EnquiryForm from "@/components/sections/EnquiryForm";
import RevealEngine from "@/components/layout/RevealEngine";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact Us — Call, WhatsApp or Send an Enquiry",
  description:
    "Call +91 94212 49677, WhatsApp or email BSM Security Agency, Goa. Office hours Monday to Saturday, 9:00 AM to 5:30 PM. Security available 24 x 7.",
  keywords: [
    "contact security agency Goa",
    "hire security guards Goa",
    "security agency phone number Goa",
    "BSM Security WhatsApp",
  ],
});

/** A fitting mark for each office. */
const officeIcons = {
  "head-office": Building2,
  "branch-office-goa": MapPin,
} as const;

/** The same marks, keyed by the label the WhatsApp and email lines carry. */
const officeLabelIcons = {
  "Head Office": Building2,
  "Branch Office": MapPin,
} as const;

/**
 * The heading over each group of numbers in the call, WhatsApp and email
 * cards. The Head Office carries a brass underline, the mark this site uses
 * everywhere to pick it out as the principal desk; the Branch Office heading
 * is otherwise identical.
 */
const officeLabelCls =
  "font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brass";
const headOfficeLabelCls = `${officeLabelCls} underline decoration-brass decoration-1 underline-offset-[5px]`;

/** True for the Head Office, whose heading is the underlined one. */
const isHeadOffice = (label: string) => label === offices[0].kind;

/**
 * Email addresses by office. The Head Office answers two — its own and the
 * general enquiry address — so this cannot be read straight off offices[].
 * The order matches the footer.
 */
const emailsByOffice = [
  {
    label: offices[0].kind,
    lines: [
      offices[0].email,
      { display: site.contact.email, href: site.contact.emailHref },
    ],
  },
  { label: offices[1].kind, lines: [offices[1].email] },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHero
        id="channels"
        eyebrow="Contact"
        index="06"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
        title={
          <>
            Discuss your <span className="accent-serif text-brass">security</span> requirements
            with our team.
          </>
        }
        lead="Contact our team by phone, WhatsApp or through the enquiry form below for further information and assistance."
      >
        <div className="mt-10 lg:mt-[clamp(1.5rem,4.5svh,3.25rem)] grid gap-4 md:grid-cols-3" data-stagger>
          {/* All three lines, in BSM's order. The first is the primary number. */}
          <div data-stagger-item data-tilt="5" className="card card-void group p-7 lg:p-[clamp(1.25rem,2.8svh,2rem)]">
            <span className="icon-tile">
              <Phone className="h-5 w-5" strokeWidth={1.4} />
            </span>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Call</p>
            {/* Grouped by office, so a caller knows which desk answers. */}
            <ul className="mt-4 space-y-4">
              {offices.map((office) => {
                const Icon = officeIcons[office.id as keyof typeof officeIcons];
                return (
                  <li key={office.id}>
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />}
                      <p className={isHeadOffice(office.kind) ? headOfficeLabelCls : officeLabelCls}>
                        {office.kind}
                      </p>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {office.phones.map((line) => (
                        <li key={line.href}>
                          <a
                            href={line.href}
                            className="link-wipe font-display text-lg font-semibold tracking-[-0.01em] text-bone transition-colors duration-300 hover:text-brass"
                          >
                            {line.display}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-mist">For enquiries and survey bookings.</p>
          </div>

          <div data-stagger-item data-tilt="5" className="card card-void group p-7 lg:p-[clamp(1.25rem,2.8svh,2rem)]">
            <span className="icon-tile">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
              WhatsApp
            </p>
            {/* One line per office, each labelled. */}
            <ul className="mt-4 space-y-4">
              {site.contact.whatsappByOffice.map((line) => {
                const Icon = officeLabelIcons[line.label as keyof typeof officeLabelIcons];
                return (
                  <li key={line.href}>
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />}
                      <p className={isHeadOffice(line.label) ? headOfficeLabelCls : officeLabelCls}>
                        {line.label}
                      </p>
                    </div>
                    <a
                      href={line.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-wipe mt-2 inline-block font-display text-lg font-semibold tracking-[-0.01em] text-bone transition-colors duration-300 hover:text-brass"
                    >
                      {line.display}
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-mist">
              Contact us on WhatsApp for further enquiries and assistance.
            </p>
          </div>

          <div
            data-stagger-item
            data-tilt="5"
            className="card card-void group block p-7 lg:p-[clamp(1.25rem,2.8svh,2rem)]"
          >
            <span className="icon-tile">
              <Mail className="h-5 w-5" strokeWidth={1.4} />
            </span>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Email</p>
            {/* Grouped like the call lines: the Head Office answers two. */}
            <ul className="mt-4 space-y-4">
              {emailsByOffice.map((group) => {
const Icon = officeLabelIcons[group.label as keyof typeof officeLabelIcons];
                return (
                  <li key={group.label}>
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />}
                      <p className={isHeadOffice(group.label) ? headOfficeLabelCls : officeLabelCls}>
                        {group.label}
                      </p>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {group.lines.map((line) => (
                        <li key={line.href}>
                          <a
                            href={line.href}
                            className="link-wipe break-all font-display text-[1.0625rem] font-semibold tracking-[-0.01em] text-bone transition-colors duration-300 hover:text-brass"
                          >
                            {line.display}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-mist">For written scopes, tenders and documentation.</p>
            <a
              href={site.contact.emailHref}
              className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brass transition-colors duration-300 hover:text-brass-lit"
            >
              Write to us
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </PageHero>

      <SubNav items={shortcuts.contact} label="Contact page shortcuts" />

      {/* Form + hours */}
      <Section label="Enquiry form" id="enquiry">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <SectionLabel index="01">Enquiry</SectionLabel>
            <h2 data-split className="mt-8 text-display font-semibold text-bone">
              Request security.
            </h2>
            <p data-reveal="up" className="mt-8 max-w-xl text-mist">
              Leave a contact number and we will call you back. Add a line about the site and the
              hours if you can — it makes our first reply more useful.
            </p>
            <div className="card card-still card-ink mt-12 max-w-2xl p-6 md:p-10" data-reveal="up" data-delay="0.08">
              <EnquiryForm idPrefix="contact" />
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-4 lg:sticky lg:top-[calc(var(--nav-h)+var(--subnav-h)+2.5rem)]">
              <div className="card card-ink group p-8" data-reveal="up">
                <div className="flex items-center gap-4">
                  <span className="icon-tile">
                    <Clock className="h-5 w-5" strokeWidth={1.4} />
                  </span>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                    Office hours
                  </h3>
                </div>
                <dl className="mt-6 space-y-3">
                  {site.contact.hours.map((row) => (
                    <div key={row.days} className="text-sm">
                      <dt className="text-mist">{row.days}</dt>
                      <dd className="mt-1 font-display text-xl font-semibold tracking-[-0.01em] text-bone">
                        {row.time}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="card card-feature card-ink group p-8" data-reveal="up" data-delay="0.06">
                <div className="flex items-center gap-4">
                  <span className="icon-tile">
                    <ShieldCheck className="h-5 w-5" strokeWidth={1.4} />
                  </span>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                    Services available
                  </h3>
                </div>
                <p className="mt-6 font-display text-4xl font-semibold tracking-[-0.02em] text-brass">
                  {site.contact.servicesAvailable}
                </p>
              </div>

              <div className="card card-ink group p-8" data-reveal="up" data-delay="0.12">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  Prefer to talk?
                </p>
                <a
                  href={site.contact.phoneHref}
                  className="link-wipe mt-3 inline-block font-display text-xl font-semibold text-bone hover:text-brass"
                >
                  {site.contact.phone}
                </a>
                <div className="mt-6">
                  <Button href={site.contact.whatsappHref} variant="outline" external>
                    WhatsApp us
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Offices */}
      <Section label="Our offices" id="offices" className="bg-ink">
        <SectionLabel index="02">Offices</SectionLabel>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <h2 data-split className="text-display font-semibold text-bone">
            Two offices in Goa.
          </h2>
          <span data-reveal="up">
            <Button href="/branch" variant="outline">
              Office details
            </Button>
          </span>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2" data-stagger>
          {offices.map((office) => {
            const Icon = officeIcons[office.id as keyof typeof officeIcons] ?? MapPin;
            return (
              <article key={office.id} data-stagger-item className="card card-still group flex flex-col p-3">
                <div className="relative h-[220px] overflow-hidden rounded-[1.25rem] border border-white/[0.06] md:h-[260px]">
                  <iframe
                    src={office.mapEmbed}
                    title={office.mapTitle}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0 grayscale-[0.9] contrast-[1.1] invert-[0.92] hue-rotate-180 transition-[filter] duration-700 group-hover:grayscale-[0.4]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <span className="icon-tile">
                      <Icon className="h-5 w-5" strokeWidth={1.4} />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brass">
                        {office.kind}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold tracking-[-0.01em] text-bone">
                        {office.name}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                    {office.addressLabel}
                  </p>
                  <address className="mt-2 not-italic leading-relaxed text-mist">{office.address}</address>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    {office.phones.map((p) => (
                      <a
                        key={p.href}
                        href={p.href}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 font-mono text-[11px] tracking-[0.06em] text-bone transition-colors hover:border-brass hover:text-brass"
                      >
                        <Phone className="h-3.5 w-3.5 text-brass" strokeWidth={1.75} />
                        {p.display}
                      </a>
                    ))}
                    <a
                      href={office.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-brass px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-void transition-colors hover:bg-brass-lit"
                    >
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <RevealEngine />
    </>
  );
}
