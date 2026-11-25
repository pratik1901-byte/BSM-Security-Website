"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import { site, services } from "@/lib/site";
import { navItems, shortcuts, serviceShortLabels, type MenuKey } from "@/lib/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { TransitionLink } from "./PageTransition";
import { RequestSecurityTrigger } from "@/components/ui/RequestSecurityButton";
import { setScrollLocked } from "./SmoothScroll";
import { NavMenu } from "./NavMenus";

/** How long the pointer may be away from a menu before it closes. */
const CLOSE_DELAY = 160;

const isActive = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

/**
 * Floating navbar.
 *
 *  - A glass bar that tightens once the page moves (its compact height is the
 *    --nav-h token, which anchored scrolling and the sub-nav both read).
 *  - A brass pill that slides between items under the pointer.
 *  - A chevron on every item with a dropdown. Hover opens it; the chevron is a
 *    real button for keyboard and touch, with aria-expanded. The panel morphs
 *    its height between menus instead of snapping.
 *  - On small screens, a full-height sheet with an accordion per section.
 */
export default function Navbar() {
  const pathname = usePathname();

  /**
   * What the bar says beside the mark on a phone or tablet.
   *
   * The agency's name on the home page, and the name of the section you are
   * in on every other — taken from the same `site.nav` list the menu is
   * built from, so a route added there is named here without a second list
   * to keep in step. The longest match wins, which keeps a nested path such
   * as /services/housekeeping under "Services" rather than falling through
   * to the home label.
   */
  const hereLabel =
    pathname === "/"
      ? "BSM Security"
      : (site.nav
          .filter((item) => item.href !== "/" && pathname.startsWith(item.href))
          .sort((a, b) => b.href.length - a.href.length)[0]?.label ?? "BSM Security");

  const [compact, setCompact] = useState(false);
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * The nudge under the menu button on a phone.
   *
   * Shown once a session and then never again, because a hint that keeps
   * reappearing stops being a hint. It waits for the entrance to finish
   * before appearing, and then stays: opening the menu is the one thing
   * that retires it.
   *
   * It used to withdraw on a timer after a few seconds. On a phone that
   * meant a visitor who was reading the page, rather than watching the top
   * of it, missed the nudge entirely — and the menu button is the only way
   * into the site there, so the nudge is worth keeping on screen until it
   * has been answered.
   */
  const [menuHint, setMenuHint] = useState(false);

  const retireHint = useCallback(() => {
    setMenuHint(false);
    try {
      sessionStorage.setItem("bsm-menu-hint", "seen");
    } catch {
      /* private mode: the hint simply shows again next time */
    }
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("bsm-menu-hint") === "seen";
    } catch {
      /* ignore */
    }
    if (seen) return;
    const show = window.setTimeout(() => setMenuHint(true), 2600);
    return () => window.clearTimeout(show);
  }, []);

  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const wasOpen = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const switchTimer = useRef<number | null>(null);
  const focusOnOpen = useRef(false);
  const triggerRefs = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});

  /* ---- Compact once the page has moved -------------------------------- */
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- Menu open / close ---------------------------------------------- */
  const clearClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (switchTimer.current) window.clearTimeout(switchTimer.current);
    },
    [],
  );

  const closeNow = useCallback(() => {
    clearClose();
    setMenu(null);
  }, []);

  const closeAnimated = useCallback(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) {
      setMenu(null);
      return;
    }
    gsap.to(panel, {
      autoAlpha: 0,
      y: -8,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => setMenu(null),
    });
  }, []);

  const scheduleClose = () => {
    clearClose();
    if (switchTimer.current) window.clearTimeout(switchTimer.current);
    switchTimer.current = null;
    closeTimer.current = window.setTimeout(closeAnimated, CLOSE_DELAY);
  };

  /* Hover intent: once a menu is open, moving across the bar only switches
     menus when the pointer settles on an item, so a sweep from one end to the
     other does not flick through every menu on the way. */
  const hoverMenu = (key: MenuKey | null) => {
    /* A tap also fires pointerenter. Without this, touching a nav link on an
       iPad opened the panel over the page the tap was navigating to. */
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (switchTimer.current) window.clearTimeout(switchTimer.current);
    switchTimer.current = null;
    if (menu === null || key === menu) {
      openMenu(key);
      return;
    }
    clearClose();
    switchTimer.current = window.setTimeout(() => openMenu(key), 110);
  };

  const openMenu = (key: MenuKey | null) => {
    clearClose();
    if (!key) {
      scheduleClose();
      return;
    }
    const panel = panelRef.current;
    if (panel) {
      gsap.killTweensOf(panel);
      // Re-entering the same item mid-fade: same state, so no re-render —
      // bring the panel back directly.
      if (key === menu) gsap.to(panel, { autoAlpha: 1, y: 0, duration: 0.3, ease: "expo.out" });
    }
    setMenu(key);
  };

  /* Close everything on navigation. */
  useEffect(() => {
    /* Deliberate: a completed navigation is the event being reacted to. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  /* Escape and outside clicks close the desktop menu. */
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = triggerRefs.current[menu];
      closeNow();
      trigger?.focus({ preventScroll: true });
    };
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-site-header]")) closeNow();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menu, closeNow]);

  /* Panel choreography, kept deliberately calm: the panel fades in once when
     a menu first opens; switching between menus only cross-fades the
     contents. No height morph, no scale, no sliding cascade — each panel is
     exactly as tall as its own contents. */
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!menu || !panel || !content) {
      wasOpen.current = false;
      return;
    }
    if (prefersReducedMotion()) {
      gsap.set(panel, { autoAlpha: 1, y: 0 });
    } else if (!wasOpen.current) {
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: -6 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    } else {
      gsap.set(panel, { autoAlpha: 1, y: 0 });
      gsap.fromTo(
        content,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.28, ease: "power1.out", overwrite: true },
      );
    }
    wasOpen.current = true;

    if (focusOnOpen.current) {
      focusOnOpen.current = false;
      content.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
    }
  }, [menu]);

  /* ---- Sliding hover pill ---------------------------------------------- */
  const movePill = (el: HTMLElement | null) => {
    const pill = pillRef.current;
    if (!pill) return;
    if (!el) {
      gsap.to(pill, { opacity: 0, duration: 0.3, ease: "power2.out" });
      return;
    }
    const props = { x: el.offsetLeft, width: el.offsetWidth, opacity: 1 };
    if (prefersReducedMotion()) gsap.set(pill, props);
    else gsap.to(pill, { ...props, duration: 0.45, ease: "expo.out" });
  };

  /* Park the pill on the current page's item. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const current = list.querySelector<HTMLElement>("[data-current='true']");
    const pill = pillRef.current;
    if (pill && current) gsap.set(pill, { x: current.offsetLeft, width: current.offsetWidth, opacity: 1 });
    else if (pill) gsap.set(pill, { opacity: 0 });
  }, [pathname]);

  const restPill = () => {
    movePill(listRef.current?.querySelector<HTMLElement>("[data-current='true']") ?? null);
  };

  /* ---- Mobile sheet ----------------------------------------------------- */
  const mobileRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<MenuKey | null>(null);

  useEffect(() => {
    setScrollLocked(mobileOpen);
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen || !mobileRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(".m-scrim", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .fromTo(
          ".m-sheet",
          { opacity: 0, y: -12, scale: 0.98, transformOrigin: "top right" },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "expo.out" },
          "<",
        )
        .fromTo(
          ".m-item",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.035, ease: "expo.out" },
          "-=0.35",
        )
        .fromTo(".m-foot", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5");
    }, mobileRef);
    return () => ctx.revert();
  }, [mobileOpen]);

  /* Accordion: animate to the natural height, then release it. */
  useLayoutEffect(() => {
    const root = mobileRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-acc]").forEach((el) => {
      const open = el.dataset.acc === expanded;
      if (prefersReducedMotion()) {
        gsap.set(el, { height: open ? "auto" : 0 });
        return;
      }
      gsap.to(el, {
        height: open ? "auto" : 0,
        duration: 0.5,
        ease: "expo.out",
        overwrite: true,
      });
    });
  }, [expanded, mobileOpen]);

  const solid = compact || menu !== null || mobileOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:rounded-full focus:bg-brass focus:px-5 focus:py-2.5 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-void"
      >
        Skip to content
      </a>

      <header
        data-site-header
        className="fixed inset-x-0 top-0 z-[100] pt-[calc(0.75rem+env(safe-area-inset-top))] md:pt-[calc(1rem+env(safe-area-inset-top))]"
        onPointerLeave={() => menu && scheduleClose()}
      >
        <div className="shell relative">
          <nav
            aria-label="Primary"
            className={`relative flex items-center justify-between gap-4 rounded-[1.4rem] pl-3 pr-2 transition-[height,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:pl-4 md:pr-2.5 ${
              compact ? "h-16 md:h-[4.5rem]" : "h-20 md:h-24"
            } ${
              compact
                ? "glass glass-strong shadow-[0_24px_60px_-30px_rgba(0,0,0,0.95)]"
                : solid
                  ? "glass shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
                  : "border border-transparent bg-transparent"
            }`}
          >
            <TransitionLink
              href="/"
              aria-label="BSM — home"
              className="relative z-10 flex min-w-0 items-center gap-2.5"
            >
              <Logo
                size={96}
                priority
                imgClassName={`shrink-0 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 ${
                  compact ? "w-11 md:w-[3.25rem]" : "w-14 md:w-[4.5rem]"
                }`}
              />
            </TransitionLink>

            {/* Where you are: the agency's name on the home page, the name of
                the section everywhere else. Centred on the bar itself rather
                than sitting against the mark, so it reads as the title of the
                page and not as part of the logo.

                Absolutely placed, because the mark on the left and the call
                and menu buttons on the right are nowhere near the same width
                — centring it in the space between them would leave it
                visibly off-centre. Capped and truncated so a long name never
                reaches either side, and `pointer-events-none` so it cannot
                swallow a tap meant for them.

                Up to the desktop breakpoint only; above it the full menu
                already says where you are. `aria-hidden` because the heading
                of every page names it again straight below. */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-1/2 top-1/2 z-0 max-w-[48%] -translate-x-1/2 -translate-y-1/2 truncate text-center font-display font-semibold tracking-[-0.015em] text-bone transition-[font-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] xl:hidden ${
                compact ? "text-[15px] md:text-[17px]" : "text-[17px] md:text-[19px]"
              }`}
            >
              {hereLabel}
            </span>

            {/* Desktop items */}
            <ul
              ref={listRef}
              className="relative hidden items-center xl:flex"
              onPointerLeave={restPill}
            >
              <span
                ref={pillRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 h-10 -translate-y-1/2 rounded-full border border-white/[0.07] bg-white/[0.05] opacity-0"
              />
              {navItems.map((item) => {
                const active = isActive(item.href, pathname);
                const open = menu === item.menu && item.menu !== null;
                return (
                  <li
                    key={item.href}
                    data-current={active ? "true" : undefined}
                    className="relative flex items-center"
                    onPointerEnter={(e) => {
                      movePill(e.currentTarget);
                      hoverMenu(item.menu);
                    }}
                  >
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onNavigate={closeNow}
                      className={`relative block py-2.5 whitespace-nowrap font-mono text-[0.78rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                        item.menu ? "pl-3.5 pr-1 xl:pl-4" : "px-3.5 xl:px-4"
                      } ${active || open ? "text-bone" : "text-mist hover:text-bone"}`}
                    >
                      {/* The dot is centred on the word itself: the label is
                          its own box, and the trailing letter-spacing after
                          the last letter is trimmed so the box ends where the
                          ink does. */}
                      <span className="relative inline-block mr-[-0.16em]">
                        {item.label}
                        {active && (
                          <span
                            className="absolute -bottom-2 left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-brass shadow-[0_0_8px_rgba(200,164,92,0.8)]"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </TransitionLink>
                    {item.menu && (
                      <button
                        type="button"
                        ref={(el) => {
                          triggerRefs.current[item.menu as MenuKey] = el;
                        }}
                        aria-expanded={open}
                        aria-controls="nav-menu"
                        aria-label={`${item.label} menu`}
                        onClick={() => {
                          if (open) closeNow();
                          else {
                            focusOnOpen.current = true;
                            openMenu(item.menu);
                          }
                        }}
                        className="relative grid h-8 w-6 place-items-center pr-1 text-dim transition-colors duration-300 hover:text-brass pointer-coarse:after:absolute pointer-coarse:after:-inset-2.5 pointer-coarse:after:content-[''] xl:pr-2"
                      >
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            open ? "rotate-180 text-brass" : ""
                          }`}
                          strokeWidth={2}
                        />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              {/* Tablets: the number calls. */}
              <a
                href={site.contact.phoneHref}
                aria-label={`Call BSM on ${site.contact.phone}`}
                className="group hidden items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4 font-mono text-[0.72rem] font-semibold tracking-[0.06em] text-bone transition-colors duration-300 hover:border-brass/60 md:inline-flex xl:hidden"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brass/15 text-brass transition-colors duration-300 group-hover:bg-brass group-hover:text-void">
                  <Phone className="h-[0.95rem] w-[0.95rem]" strokeWidth={1.75} />
                </span>
                {site.contact.phone}
              </a>
              {/* Desktop: the same number opens WhatsApp in a new tab —
                  icon-only where the bar is tight, the full number from xl. */}
              <a
                href={site.contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label={`WhatsApp BSM on ${site.contact.whatsapp} (opens WhatsApp)`}
                className="group hidden items-center gap-2.5 rounded-full border border-[#25d366]/30 bg-[#25d366]/[0.06] p-1.5 font-mono text-[0.72rem] font-semibold tracking-[0.06em] text-bone transition-colors duration-300 hover:border-[#25d366]/70 xl:inline-flex 2xl:py-1.5 2xl:pl-1.5 2xl:pr-4"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25d366]/15 text-[#25d366] transition-colors duration-300 group-hover:bg-[#25d366] group-hover:text-void">
                  <WhatsAppIcon className="h-[0.95rem] w-[0.95rem]" />
                </span>
                <span className="hidden 2xl:inline">{site.contact.whatsapp}</span>
              </a>
              <RequestSecurityTrigger className="btn btn-primary hidden whitespace-nowrap !px-5 !py-3.5 xl:inline-flex">
                <span className="btn-fill" aria-hidden="true" />
                Request Security
              </RequestSecurityTrigger>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => {
                  /* Retired here rather than in an effect watching the open
                     state: opening the menu is the event that answers the
                     hint, and setState belongs in the handler for it. */
                  retireHint();
                  setMobileOpen((v) => !v);
                }}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-bone transition-colors duration-300 hover:border-brass xl:hidden"
              >
                <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>

                {/* The nudge. Decorative and inert: the button is already
                    named for a screen reader, and this must never swallow
                    the tap meant for it. Phones only — from a tablet up the
                    bar has room to explain itself. */}
                {menuHint && !mobileOpen && (
                  <>
                    <span
                      aria-hidden="true"
                      className="menu-hint-halo pointer-events-none absolute inset-0 rounded-full border border-brass/60 md:hidden"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 md:hidden"
                    >
                      <span className="menu-hint block">
                        <span className="relative block whitespace-nowrap rounded-full border border-brass/45 bg-void/95 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-brass shadow-[0_12px_30px_-12px_rgba(0,0,0,0.95)] backdrop-blur-sm">
                          <span
                            className="absolute -top-[5px] left-1/2 block h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-brass/45 bg-void"
                            aria-hidden="true"
                          />
                          Tap for menu
                        </span>
                      </span>
                    </span>
                  </>
                )}

                <span aria-hidden="true" className="relative block h-3 w-5">
                  <span
                    className={`absolute left-0 block h-px w-full bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      mobileOpen ? "top-1.5 rotate-45" : "top-0"
                    }`}
                  />
                  <span
                    className={`absolute right-0 block h-px bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      mobileOpen ? "top-1.5 w-full -rotate-45" : "top-3 w-3"
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>

          {/* Desktop dropdown — one panel, contents swapped per menu */}
          {menu && (
            <div
              ref={panelRef}
              id="nav-menu"
              className="invisible absolute inset-x-5 top-full hidden pt-2.5 opacity-0 md:inset-x-10 xl:block xl:inset-x-16"
              onPointerEnter={clearClose}
              onPointerLeave={scheduleClose}
            >
              <div
                ref={boxRef}
                data-lenis-prevent
                className="glass relative max-h-[min(30rem,calc(100svh-var(--nav-h)-2rem))] overflow-hidden overflow-y-auto rounded-xl px-6 py-5 shadow-[0_40px_120px_-40px_rgba(0,0,0,1)] [--radius-card:0.6rem]"
              >
                <span className="dot-field pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
                <div ref={contentRef} className="relative">
                  <NavMenu menu={menu} onNavigate={closeNow} />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div
          ref={mobileRef}
          id="mobile-menu"
          className="fixed inset-0 z-[99] xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          {/* Scrim: the page stays visible behind the menu, and a tap closes it. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
            className="m-scrim absolute inset-0 w-full cursor-default bg-void/60 backdrop-blur-sm"
          />
          <div className="shell pointer-events-none relative pt-[calc(var(--nav-h)+0.5rem)]">
            <div
              data-lenis-prevent
              className="m-sheet glass pointer-events-auto relative ml-auto flex max-h-[calc(100svh-var(--nav-h)-1.5rem)] w-full max-w-md flex-col overflow-y-auto rounded-xl p-3 shadow-[0_40px_100px_-30px_rgba(0,0,0,1)]"
            >
              <ul className="space-y-1.5">
                {navItems.map((item, i) => {
                  const active = isActive(item.href, pathname);
                  const links = item.menu ? mobileLinks(item.menu, item.href) : [];
                  const isOpen = expanded === item.menu && item.menu !== null;
                  return (
                    <li key={item.href} className="m-item overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02]">
                      <div className="flex items-center">
                        <TransitionLink
                          href={item.href}
                          onNavigate={() => setMobileOpen(false)}
                          className="flex flex-1 items-baseline gap-3 px-4 py-3"
                        >
                          <span className="font-mono text-[11px] text-dim">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={`font-mono text-[0.95rem] font-medium uppercase tracking-[0.16em] ${active ? "text-brass" : "text-bone"}`}>
                            {item.label}
                          </span>
                        </TransitionLink>
                        {item.menu && (
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-label={`${item.label} shortcuts`}
                            onClick={() => setExpanded(isOpen ? null : item.menu)}
                            className="mr-3 grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist transition-colors hover:border-brass hover:text-brass"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-500 ${isOpen ? "rotate-180 text-brass" : ""}`}
                              strokeWidth={2}
                            />
                          </button>
                        )}
                      </div>
                      {item.menu && (
                        <div data-acc={item.menu} className="h-0 overflow-hidden">
                          <ul className="grid gap-0.5 px-2 pb-2">
                            {links.map((link) => (
                              <li key={link.href}>
                                <TransitionLink
                                  href={link.href}
                                  onNavigate={() => setMobileOpen(false)}
                                  tabIndex={isOpen ? 0 : -1}
                                  className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-[14px] text-mist transition-colors hover:bg-white/[0.04] hover:text-bone"
                                >
                                  {link.label}
                                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-brass/70" strokeWidth={1.75} />
                                </TransitionLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="m-foot mt-3 grid grid-cols-2 gap-2">
                <a
                  href={site.contact.phoneHref}
                  className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] p-2.5 font-mono text-[11px] tracking-[0.04em] text-bone"
                >
                  <span className="icon-tile !h-10 !w-10 !rounded-xl">
                    <Phone className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  {site.contact.phone}
                </a>
                <a
                  href={site.contact.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] p-2.5 font-mono text-[11px] tracking-[0.04em] text-bone"
                >
                  <span className="icon-tile !h-10 !w-10 !rounded-xl">
                    <WhatsAppIcon className="h-4 w-4" />
                  </span>
                  WhatsApp
                </a>
                <RequestSecurityTrigger
                  onActivate={() => setMobileOpen(false)}
                  className="btn btn-primary col-span-2 w-full !rounded-lg"
                >
                  <span className="btn-fill" aria-hidden="true" />
                  Request Security
                </RequestSecurityTrigger>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** The links an accordion row reveals on small screens. */
function mobileLinks(menu: MenuKey, base: string) {
  if (menu === "services") {
    return services.map((s) => ({ label: serviceShortLabels[s.slug], href: `${base}#${s.slug}` }));
  }
  return shortcuts[menu].map((s) => ({ label: s.label, href: `${base}#${s.id}` }));
}
