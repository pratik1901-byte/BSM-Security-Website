import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { site, offices, services } from "@/lib/site";
import { serviceShortLabels } from "@/lib/navigation";
import { TransitionLink } from "./PageTransition";
import { Copy } from "@/components/ui/Placeholder";
import { Logo } from "@/components/ui/Logo";
import { RequestSecurityTrigger } from "@/components/ui/RequestSecurityButton";

/** A footer link whose arrow slides in on hover. */
function FootLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <TransitionLink
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm text-mist transition-colors duration-300 hover:text-bone"
    >
      <span className="w-0 overflow-hidden text-brass transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-3.5">
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
      {children}
    </TransitionLink>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
      <span className="h-1 w-1 rounded-full bg-brass" aria-hidden="true" />
      {children}
    </h2>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <span className="dot-field pointer-events-none absolute inset-x-0 top-0 h-96 opacity-50" aria-hidden="true" />
      <div className="shell relative py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Identity */}
          <div className="lg:col-span-4">
            <Logo size={84} />
            <span className="sr-only">BSM Security</span>
            <p className="mt-6 max-w-sm text-mist">
              A professional security agency based in Goa, India. Trained personnel, written
              deployment plans and supervision you can verify.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={site.contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline !py-3.5"
              >
                <span className="btn-fill" aria-hidden="true" />
                <WhatsAppIcon className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <RequestSecurityTrigger className="btn btn-primary !py-3.5">
                <span className="btn-fill" aria-hidden="true" />
                Request Security
              </RequestSecurityTrigger>
            </div>
          </div>

          {/* Site */}
          <nav className="lg:col-span-2" aria-label="Footer">
            <Heading>Site</Heading>
            <ul className="mt-6 space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <FootLink href={item.href}>{item.label}</FootLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav className="lg:col-span-3" aria-label="Services">
            <Heading>Services</Heading>
            <ul className="mt-6 grid gap-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <FootLink href={`/services#${s.slug}`}>{serviceShortLabels[s.slug]}</FootLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <Heading>Contact</Heading>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="card card-void card-still flex gap-3 rounded-2xl p-4">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
                {/* Grouped by office, like the addresses below. */}
                <span className="flex min-w-0 flex-col gap-3">
                  {offices.map((office) => (
                    <span key={office.id} className="flex min-w-0 flex-col gap-1">
                      {/* Head Office underlined — the one to try first. */}
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.18em] text-brass${
                          office.id === "head-office"
                            ? " underline decoration-brass/50 decoration-1 underline-offset-[5px]"
                            : ""
                        }`}
                      >
                        {office.kind}
                      </span>
                      {office.phones.map((line) => (
                        <a
                          key={line.href}
                          href={line.href}
                          className="text-mist transition-colors duration-300 hover:text-bone"
                        >
                          {line.display}
                        </a>
                      ))}
                    </span>
                  ))}
                </span>
              </li>
              {/* Three addresses between two offices: say which is which,
                  rather than listing them as one undifferentiated block. */}
              <li className="card card-void card-still flex gap-3 rounded-2xl p-4">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
                <span className="flex min-w-0 flex-col gap-3">
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass underline decoration-brass/50 decoration-1 underline-offset-[5px]">
                      {offices[0].kind}
                    </span>
                    <a href={offices[0].email.href} className="break-all text-mist hover:text-bone">
                      {offices[0].email.display}
                    </a>
                    <a href={site.contact.emailHref} className="break-all text-mist hover:text-bone">
                      {site.contact.email}
                    </a>
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
                      {offices[1].kind}
                    </span>
                    <a href={offices[1].email.href} className="break-all text-mist hover:text-bone">
                      {offices[1].email.display}
                    </a>
                  </span>
                </span>
              </li>
              <li className="card card-void card-still flex gap-3 rounded-2xl p-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
                <span>
                  <address className="not-italic text-mist">
                    <Copy text={site.contact.address.street} />
                    <br />
                    <Copy text={site.contact.address.locality} />, Goa,{" "}
                    <Copy text={site.contact.address.postalCode} />
                  </address>
                  <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {offices.map((office) => (
                      <TransitionLink
                        key={office.id}
                        href={`/branch#${office.id}`}
                        className="link-wipe font-mono text-[10px] uppercase tracking-[0.16em] text-brass"
                      >
                        {office.kind}
                      </TransitionLink>
                    ))}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark: the closing beat of the page.
            The two words are set as explicit lines, and the size is capped
            against the shell's own max width — sized off the viewport alone,
            the last letters of SECURITY ran past the container on wide
            screens and were clipped. */}
        <div className="mt-20 overflow-hidden border-t border-line pt-10">
          <p
            className="select-none bg-gradient-to-b from-white to-white/25 bg-clip-text font-display text-[17.5vw] font-semibold leading-[0.84] tracking-normal text-transparent md:text-[17vw] lg:text-[min(16vw,16.5rem)]"
            /* Archivo kerns the TY pair tightly enough at this size that the Y
               tucks under the T. Kerning off, tracking neutral. */
            style={{ fontKerning: "none", fontFeatureSettings: '"kern" 0' }}
            aria-hidden="true"
          >
            <span className="block">BSM</span>
            <span className="block">SECURITY</span>
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-dim md:flex-row md:items-center md:justify-between">
          <p>© 2013 {site.legalName}. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden="true" />
            India
          </p>
        </div>
      </div>
    </footer>
  );
}
