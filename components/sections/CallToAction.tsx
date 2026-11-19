import { Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { site, offices } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { RequestSecurityButton } from "@/components/ui/RequestSecurityButton";

/** Email addresses by office, in the order the footer lists them. */
const emailsByOffice = [
  {
    label: offices[0].kind,
    lines: [offices[0].email, { display: site.contact.email, href: site.contact.emailHref }],
  },
  { label: offices[1].kind, lines: [offices[1].email] },
];

/**
 * Closing call to action: one large rounded panel that grows into place as it
 * scrolls in (data-zoom), with the three direct channels as cards beneath.
 */
export default function CallToAction({
  title = "Tell us what you need protected.",
  body = "Send the site, the hours and the concern. We will come back with a survey slot and a written deployment plan — not a quote pulled out of the air.",
  eyebrow = "Get in touch",
  id,
}: {
  title?: string;
  body?: string;
  eyebrow?: string;
  /** Shortcut target (data-anchor). */
  id?: string;
}) {
  return (
    <section
      id={id}
      data-anchor={id ? "" : undefined}
      aria-label="Contact BSM"
      className="relative border-t border-line bg-void section-pad"
    >
      <span
        className="section-divider pointer-events-none absolute inset-x-0 top-0"
        aria-hidden="true"
      />

      <div className="shell">
        <div
          data-zoom
          className="relative overflow-hidden rounded-[2rem] border border-brass/25 bg-ink px-6 py-16 md:px-14 md:py-24"
        >
          <span className="grain-layer" aria-hidden="true" />
          <span className="dot-field pointer-events-none absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_100%,rgba(200,164,92,0.16)_0%,transparent_70%)]"
            aria-hidden="true"
          />
          <img
            src="/patterns/radar.svg"
            alt=""
            aria-hidden="true"
            data-spin="90"
            className="pointer-events-none absolute -bottom-48 -right-48 hidden h-[34rem] w-[34rem] opacity-60 md:block"
          />

          <div className="relative">
            <div
              className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] py-1.5 pl-1.5 pr-4"
              data-reveal="up"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brass/15">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
              </span>
              <span className="eyebrow">{eyebrow}</span>
            </div>

            <h2 data-split className="mt-10 max-w-4xl text-hero font-semibold text-bone">
              {title}
            </h2>

            <p data-reveal="up" className="mt-8 max-w-xl text-lead text-mist">
              {body}
            </p>

            <div className="mt-12 flex flex-wrap gap-4" data-reveal="up" data-delay="0.1">
              <RequestSecurityButton />
              <Button href={site.contact.whatsappHref} variant="outline" external>
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3" data-stagger>
          <div data-stagger-item className="card card-ink group p-7 md:p-8">
            <span className="icon-tile">
              <Phone className="h-5 w-5" strokeWidth={1.4} />
            </span>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Call</p>
            <ul className="mt-3 space-y-3">
              {offices.map((office) => (
                <li key={office.id}>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
                    {office.kind}
                  </span>
                  <span className="mt-1 flex flex-col items-start gap-1">
                    {office.phones.map((line) => (
                      <a
                        key={line.href}
                        href={line.href}
                        className="link-wipe font-display text-lg font-semibold tracking-[-0.01em] text-bone transition-colors duration-300 hover:text-brass"
                      >
                        {line.display}
                      </a>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-stagger-item className="card card-ink group p-7 md:p-8">
            <span className="icon-tile">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
              WhatsApp
            </p>
            <ul className="mt-3 space-y-3">
              {site.contact.whatsappByOffice.map((line) => (
                <li key={line.href}>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
                    {line.label}
                  </span>
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-wipe font-display text-lg font-semibold tracking-[-0.01em] text-bone transition-colors duration-300 hover:text-brass"
                  >
                    {line.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-stagger-item className="card card-ink group block p-7 md:p-8">
            <span className="icon-tile">
              <Mail className="h-5 w-5" strokeWidth={1.4} />
            </span>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Email</p>
            <ul className="mt-3 space-y-3">
              {emailsByOffice.map((group) => (
                <li key={group.label}>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
                    {group.label}
                  </span>
                  <span className="mt-1 flex flex-col items-start gap-1">
                    {group.lines.map((line) => (
                      <a
                        key={line.href}
                        href={line.href}
                        className="link-wipe break-all font-display text-[1.0625rem] font-semibold tracking-[-0.01em] text-bone transition-colors duration-300 hover:text-brass"
                      >
                        {line.display}
                      </a>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
