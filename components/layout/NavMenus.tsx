"use client";

import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Building2,
  Clock,
  FileText,
  Images,
  Landmark,
  LayoutGrid,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { services, site, offices, clients } from "@/lib/site";
import { leaders, legacy } from "@/lib/about";
import { gallery, galleryGroups, groupId, serviceShots, media } from "@/lib/media";
import { titleCase, type MenuKey } from "@/lib/navigation";
import { TransitionLink } from "./PageTransition";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { RequestSecurityTrigger } from "@/components/ui/RequestSecurityButton";

type MenuProps = { onNavigate: () => void };

/** Lets a long address wrap before the "@" instead of mid-word. */
const wrapAt = (email: string) => {
  const [user, domain] = email.split("@");
  return (
    <>
      {user}
      <wbr />@{domain}
    </>
  );
};

/**
 * The contents of each navbar dropdown. Every menu is laid out as a short,
 * wide band — an intro column on the left, one or two rows of links on the
 * right — so it spans the bar without running down the screen.
 *
 * Every link is derived from lib/site, lib/about and lib/media, so the menus
 * never drift from the pages. Elements marked `menu-anim` are cascaded in by
 * the navbar when a menu opens.
 */
export function NavMenu({ menu, onNavigate }: { menu: MenuKey } & MenuProps) {
  switch (menu) {
    case "services":
      return <ServicesMenu onNavigate={onNavigate} />;
    case "clients":
      return <ClientsMenu onNavigate={onNavigate} />;
    case "contact":
      return <ContactMenu onNavigate={onNavigate} />;
    case "about":
      return <AboutMenu onNavigate={onNavigate} />;
    case "branch":
      return <BranchMenu onNavigate={onNavigate} />;
    case "gallery":
      return <GalleryMenu onNavigate={onNavigate} />;
  }
}

/* -------------------------------------------------------------------------- */

/** Left column shared by every menu: what this is, and the full-page link. */
function Band({
  eyebrow,
  title,
  note,
  href,
  cta,
  onNavigate,
  children,
}: {
  eyebrow: string;
  title: string;
  note: string;
  href: string;
  cta: string;
  children: ReactNode;
} & MenuProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="menu-anim col-span-3 flex flex-col border-r border-white/[0.06] pr-6">
        <p className="eyebrow">{eyebrow}</p>
        <p className="mt-2 font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-bone">
          {title}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-dim">{note}</p>
        <TransitionLink
          href={href}
          onNavigate={onNavigate}
          className="group mt-auto inline-flex w-fit items-center gap-2 rounded-md bg-brass px-4 py-2.5 pt-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-void transition-colors duration-300 hover:bg-brass-lit"
        >
          {cta}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
        </TransitionLink>
      </div>
      <div className="col-span-9">{children}</div>
    </div>
  );
}

function Tile({ children }: { children: ReactNode }) {
  return <span className="icon-tile !h-9 !w-9 !rounded-lg">{children}</span>;
}

/** A compact link card: icon, label and one line of note. */
function LinkCard({
  href,
  onNavigate,
  icon,
  label,
  note,
}: { href: string; icon: ReactNode; label: string; note?: string } & MenuProps) {
  return (
    <TransitionLink
      href={href}
      onNavigate={onNavigate}
      className="menu-anim card card-ink group flex items-center gap-3 p-3"
    >
      <Tile>{icon}</Tile>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-bone transition-colors group-hover:text-brass-lit">
          {label}
        </span>
        {note && <span className="block truncate text-[12px] text-dim">{note}</span>}
      </span>
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 text-brass opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        strokeWidth={1.75}
      />
    </TransitionLink>
  );
}

/* -------------------------------------------------------------------------- */

function ServicesMenu({ onNavigate }: MenuProps) {
  const links = [
    { href: "/services#overview", label: "All service categories", note: `${services.length} categories, one page`, icon: LayoutGrid },
    { href: "/contact#enquiry", label: "Enquire about a service", note: "We call you back", icon: FileText },
  ];
  /* A collage of the supplied category photographs. */
  const covers = services.map((s) => serviceShots[s.slug].src).filter(Boolean).slice(0, 3);

  return (
    <Band
      eyebrow="Services"
      title="Security services, matched to the site"
      note="Each one starts with a site survey and a written deployment plan."
      href="/services"
      cta="View all services"
      onNavigate={onNavigate}
    >
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-7 grid grid-cols-2 gap-2">
          {links.map((l) => (
            <LinkCard
              key={l.href}
              href={l.href}
              onNavigate={onNavigate}
              icon={<l.icon className="h-4 w-4" strokeWidth={1.5} />}
              label={l.label}
              note={l.note}
            />
          ))}
        </div>
        <TransitionLink
          href="/services"
          onNavigate={onNavigate}
          className="menu-anim card card-ink group relative col-span-5 block min-h-[9.5rem] p-0"
        >
          <span className="absolute inset-0 grid grid-cols-3 gap-px">
            {covers.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-70 transition-[opacity,scale] duration-700 group-hover:scale-105 group-hover:opacity-100"
              />
            ))}
          </span>
          <span className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                {String(services.length).padStart(2, "0")} categories
              </span>
              <span className="mt-1 block font-display text-[15px] font-semibold text-bone">
                Explore every service
              </span>
            </span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brass text-void transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </span>
          </span>
        </TransitionLink>
      </div>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */

/** Clients: shortcuts into the page only — the roster itself lives there. */
function ClientsMenu({ onNavigate }: MenuProps) {
  const sections = [
    { id: "roster", label: "Our Esteemed Clients", note: `${clients.length} organisations, with their locations as supplied.`, icon: Landmark },
    { id: "get-in-touch", label: "Become a client", note: "Start with a site survey and a written plan.", icon: ShieldCheck },
  ];
  return (
    <Band
      eyebrow="Clients"
      title="Organisations BSM is engaged with"
      note="Public sector undertakings, government establishments, defence facilities and airports."
      href="/clients"
      cta="View all clients"
      onNavigate={onNavigate}
    >
      {/* The blocks fill the band edge to edge and top to bottom, however
          many there are — the column count follows the list rather than
          assuming four, which left half a row empty once two of the page's
          sections were removed. */}
      <div
        className="grid h-full gap-2"
        style={{ gridTemplateColumns: `repeat(${sections.length}, minmax(0, 1fr))` }}
      >
        {sections.map((s, i) => {
          const feature = i === sections.length - 1;
          return (
            <TransitionLink
              key={s.id}
              href={`/clients#${s.id}`}
              onNavigate={onNavigate}
              className={`menu-anim card group flex h-full min-h-[11rem] flex-col p-4 ${
                feature ? "card-feature" : "card-ink"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="icon-tile !h-11 !w-11 !rounded-lg">
                  <s.icon className="h-5 w-5" strokeWidth={1.4} />
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <span
                className={`mt-5 block font-display text-[15px] font-semibold leading-snug transition-colors group-hover:text-brass-lit ${
                  feature ? "text-brass" : "text-bone"
                }`}
              >
                {s.label}
              </span>
              <span className="mt-1.5 block text-[12.5px] leading-relaxed text-dim">{s.note}</span>
              <span className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-mist transition-colors group-hover:text-brass">
                View
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </span>
            </TransitionLink>
          );
        })}
      </div>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */

function ContactMenu({ onNavigate }: MenuProps) {
  const head = offices[0];
  return (
    <Band
      eyebrow="Contact"
      title="Talk to BSM"
      note={`By phone, WhatsApp or email. ${site.contact.hours[0].days}, ${site.contact.hours[0].time}.`}
      href="/contact"
      cta="Contact page"
      onNavigate={onNavigate}
    >
      <div className="grid grid-cols-4 gap-2">
        <div className="menu-anim card card-ink card-still p-4">
          <div className="flex items-center gap-2.5">
            <Tile>
              <Phone className="h-4 w-4" strokeWidth={1.5} />
            </Tile>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Call</p>
          </div>
          <ul className="mt-3 space-y-1">
            {site.contact.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="link-wipe text-[14px] font-semibold text-bone hover:text-brass">
                  {p.display}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="menu-anim card card-ink card-still p-4">
          <div className="flex items-center gap-2.5">
            <Tile>
              <WhatsAppIcon className="h-4 w-4" />
            </Tile>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">WhatsApp</p>
          </div>
          <ul className="mt-3 space-y-1.5">
            {site.contact.whatsappByOffice.map((w) => (
              <li key={w.href}>
                <a href={w.href} target="_blank" rel="noreferrer" className="group/w block">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-brass">{w.label}</span>
                  <span className="link-wipe text-[14px] font-semibold text-bone group-hover/w:text-brass">{w.display}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="menu-anim card card-ink card-still p-4">
          <div className="flex items-center gap-2.5">
            <Tile>
              <Mail className="h-4 w-4" strokeWidth={1.5} />
            </Tile>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Email</p>
          </div>
          <a href={site.contact.emailHref} className="link-wipe mt-3 inline-block text-[13px] font-semibold text-bone hover:text-brass">
            {wrapAt(site.contact.email)}
          </a>
          <a href={head.email.href} className="link-wipe mt-1.5 inline-block text-[12px] text-mist hover:text-brass">
            {wrapAt(head.email.display)}
          </a>
        </div>

        <div className="menu-anim flex flex-col gap-2">
          <div className="card card-ink card-still flex items-center gap-3 p-3">
            <Tile>
              <Clock className="h-4 w-4" strokeWidth={1.5} />
            </Tile>
            <span>
              <span className="block text-[11px] text-dim">Services available</span>
              <span className="block text-[14px] font-semibold text-bone">{site.contact.servicesAvailable}</span>
            </span>
          </div>
          <LinkCard
            href="/contact#enquiry"
            onNavigate={onNavigate}
            icon={<FileText className="h-4 w-4" strokeWidth={1.5} />}
            label="Enquiry form"
          />
          <RequestSecurityTrigger onActivate={onNavigate} className="btn btn-primary mt-auto w-full !rounded-md !py-3">
            <span className="btn-fill" aria-hidden="true" />
            Request Security
          </RequestSecurityTrigger>
        </div>
      </div>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */

function AboutMenu({ onNavigate }: MenuProps) {
  const sections = [
    { id: "legacy", label: legacy.heading, note: "Where BSM comes from", icon: Landmark },
    { id: "leadership", label: "Our Leadership & Management", note: "The partners behind BSM", icon: Users },
    { id: "commitment", label: "Our Commitment", note: "What we hold ourselves to", icon: ShieldCheck },
  ];
  const portraits: Record<string, { src: string; focus?: string }> = {
    "dattatray-b-naik": media.leaderPrincipalPartner,
    "bhupinder-singh-malhi": media.leaderTrainingPartner,
    "bhagyashree-dattatray-naik": media.leaderAdminPartner,
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-5 flex flex-col">
        <div className="menu-anim mb-4 flex items-end justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div>
            <p className="eyebrow">About Us</p>
            <p className="mt-2 font-display text-lg font-semibold tracking-[-0.02em] text-bone">
              BSM Security Agency
            </p>
          </div>
          <TransitionLink
            href="/about"
            onNavigate={onNavigate}
            className="group inline-flex shrink-0 items-center gap-2 rounded-md bg-brass px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-void transition-colors hover:bg-brass-lit"
          >
            About us
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </TransitionLink>
        </div>
        <div className="space-y-2">
          {sections.map((s) => (
            <LinkCard
              key={s.id}
              href={`/about#${s.id}`}
              onNavigate={onNavigate}
              icon={<s.icon className="h-4 w-4" strokeWidth={1.5} />}
              label={s.label}
              note={s.note}
            />
          ))}
        </div>
      </div>

      <div className="col-span-7">
        <p className="menu-anim eyebrow mb-3">Leadership</p>
        <div className="grid grid-cols-3 gap-2">
          {leaders.map((l) => {
            const { src, focus } = portraits[l.id];
            return (
              <TransitionLink
                key={l.id}
                href={`/about#${l.id}`}
                onNavigate={onNavigate}
                className="menu-anim card card-ink group flex flex-col p-2"
              >
                <span className="relative block aspect-square overflow-hidden rounded-[0.4rem] bg-surface">
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: focus ?? "50% 20%" }}
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="dot-field absolute inset-0" aria-hidden="true" />
                      <UserRound className="relative h-7 w-7 text-brass/60" strokeWidth={1} />
                    </span>
                  )}
                </span>
                <span className="mt-2.5 block px-1 text-[13px] font-semibold leading-snug text-bone transition-colors group-hover:text-brass-lit">
                  {titleCase(l.name)}
                </span>
                <span className="mt-0.5 block px-1 pb-1 text-[11px] leading-snug text-dim">
                  {l.designation}
                </span>
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function BranchMenu({ onNavigate }: MenuProps) {
  return (
    <Band
      eyebrow="Branch"
      title="Two offices in Goa"
      note="Addresses, numbers and the people who lead each office."
      href="/branch"
      cta="Both offices"
      onNavigate={onNavigate}
    >
      <div className="grid grid-cols-2 gap-2">
        {offices.map((o) => (
          <div key={o.id} className="menu-anim card card-ink group flex items-start gap-4 p-4">
            <Tile>
              {o.id === "head-office" ? <Building2 className="h-4 w-4" strokeWidth={1.5} /> : <MapPin className="h-4 w-4" strokeWidth={1.5} />}
            </Tile>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">{o.kind}</p>
              <p className="mt-0.5 font-display text-[15px] font-semibold text-bone">{o.name}</p>
              <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-mist">{o.address}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <TransitionLink
                  href={`/branch#${o.id}`}
                  onNavigate={onNavigate}
                  className="rounded-md bg-brass px-3 py-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-brass-lit"
                >
                  Details
                </TransitionLink>
                <a
                  href={o.phones[0].href}
                  className="rounded-md border border-white/10 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-mist transition-colors hover:border-brass hover:text-brass"
                >
                  {o.phones[0].display}
                </a>
                <a
                  href={o.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-white/10 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-mist transition-colors hover:border-brass hover:text-brass"
                >
                  Maps
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */

function GalleryMenu({ onNavigate }: MenuProps) {
  return (
    <Band
      eyebrow="Gallery"
      title="Filed by what the photograph shows"
      note="Personnel, operations, sites and Goa."
      href="/gallery"
      cta="Full gallery"
      onNavigate={onNavigate}
    >
      <div className="grid grid-cols-4 gap-2">
        {galleryGroups.map((group) => {
          const items = gallery.filter((g) => g.group === group);
          const cover = items.find((g) => g.shot?.src)?.shot;
          return (
            <TransitionLink
              key={group}
              href={`/gallery#${groupId(group)}`}
              onNavigate={onNavigate}
              className="menu-anim card card-ink group relative block aspect-[16/10] p-0"
            >
              {cover ? (
                <img src={cover.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-75 transition-[opacity,scale] duration-700 group-hover:scale-105 group-hover:opacity-100" />
              ) : (
                <Images className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-brass/50" />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/20 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                <span className="font-display text-[15px] font-semibold text-bone">{group}</span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-brass">
                  {String(items.length).padStart(2, "0")}
                </span>
              </span>
            </TransitionLink>
          );
        })}
      </div>
    </Band>
  );
}
