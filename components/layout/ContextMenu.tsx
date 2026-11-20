"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, Copy, Expand, Link2, Mail, Phone, ShieldCheck, X } from "lucide-react";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useEnquiry } from "./EnquiryModal";
import { jumpToTop } from "./SmoothScroll";

type Picture = { src: string; name: string; alt: string };

/** What sat under the pointer, and so what the menu offers. */
type Spot = {
  x: number;
  y: number;
  img: Picture | null;
  /** A telephone number or an email address, ready to copy. */
  contact: { kind: "phone" | "email"; value: string; href: string } | null;
  /** Text the visitor had selected. */
  selection: string;
  scrolled: boolean;
};

/**
 * The site's own right-click menu, and the viewer it opens.
 *
 * ContentGuard suppresses the browser's menu, so Save image, Open image in
 * new tab, View source and Inspect never appear on it. That left a
 * right-click doing nothing, which reads as a broken page. This puts
 * something useful there instead: the things the site is glad for a visitor
 * to do, and nothing that hands over a file.
 *
 * It is built for a mouse. A touch screen has no right-click — a long press
 * is a selection gesture, and a menu pinned to a fingertip covers what it
 * describes — so on a coarse pointer the browser is left to itself.
 *
 * The menu reads its surroundings: View image appears only over a
 * photograph, Back to top only once the page has been scrolled. The rest —
 * request security, WhatsApp, call, copy the link — are there throughout,
 * because they are what someone right-clicking a security agency's site is
 * most likely to want.
 *
 * What this cannot do, and no web page can: stop a determined visitor. The
 * picture is on their machine already by the time they see it, and the
 * keyboard shortcuts, the browser's own menus and a reader with JavaScript
 * off all remain. It raises the effort and keeps the casual copy out of
 * reach; it is not protection. Watermarking, and serving images no larger
 * than the page needs, are the only real defences.
 *
 * A form field keeps the browser's menu, so a visitor can still paste.
 */
export default function ContextMenu() {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [viewing, setViewing] = useState<Picture | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { open: openEnquiry } = useEnquiry();

  const close = useCallback(() => {
    setSpot(null);
    setCopied(null);
  }, []);

  useEffect(() => {
    const inFormField = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("input, textarea, [contenteditable='true']");

    const onContextMenu = (e: MouseEvent) => {
      /* Mouse only. ContentGuard still suppresses the native menu elsewhere. */
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      if (inFormField(e.target)) return;
      e.preventDefault();

      /*
       * What may be enlarged: BSM's own photography. Not a client's logo,
       * which is their artwork rather than ours, and not a portrait of a
       * member of staff — a face is not an exhibit, and the About and
       * Branch pages are full of them. Either can also opt out by carrying
       * data-no-preview.
       */
      const el = e.target instanceof Element ? e.target.closest("img") : null;
      const src = el instanceof HTMLImageElement ? el.currentSrc : "";
      /* Nor the thumbnails inside the chrome: those are navigation, and a
         viewer opening over the menu that launched it is nonsense. */
      const inChrome = !!el?.closest("header, nav, [data-subnav], [data-site-header]");
      const offers =
        el instanceof HTMLImageElement &&
        !!src &&
        !inChrome &&
        !el.hasAttribute("data-no-preview") &&
        !src.includes("/media/clients/") &&
        !src.includes("/media/people/") &&
        !src.includes("/brand/");
      const img = offers
        ? {
            src: el.currentSrc,
            /* The photograph's own name where it has one, the alt text
               otherwise, so the viewer is never captioned "Photograph". */
            name: el.dataset.name || el.alt || "Photograph",
            alt: el.alt || "",
          }
        : null;

      /* A number or an address under the pointer is the thing most worth
         offering, so read the link it sits in. */
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      const href = link?.getAttribute("href") ?? "";
      const contact = href.startsWith("tel:")
        ? { kind: "phone" as const, value: href.slice(4), href }
        : href.startsWith("mailto:")
          ? { kind: "email" as const, value: href.slice(7), href }
          : null;

      const selection = (window.getSelection()?.toString() ?? "").trim();

      setCopied(null);
      setSpot({
        x: e.clientX,
        y: e.clientY,
        img,
        contact,
        selection: selection.length > 1 ? selection : "",
        scrolled: window.scrollY > 400,
      });
    };

    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, []);

  /* Anything that moves the page out from under the menu closes it. */
  useEffect(() => {
    if (!spot) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("blur", close);
    };
  }, [spot, close]);

  /* Escape closes whichever is open; the arrows walk the menu. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewing) setViewing(null);
        else if (spot) close();
        return;
      }
      if (!spot || !menuRef.current) return;
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const items = [...menuRef.current.querySelectorAll<HTMLElement>("[data-menuitem]")];
      if (!items.length) return;
      const at = items.indexOf(document.activeElement as HTMLElement);
      const step = e.key === "ArrowDown" ? 1 : -1;
      items[(at + step + items.length) % items.length].focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spot, viewing, close]);

  const copy = useCallback(async (what: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* Clipboard refused — fall back to a selection the visitor can copy. */
      const field = document.createElement("textarea");
      field.value = text;
      field.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing more to try */
      }
      field.remove();
    }
    setCopied(what);
    window.setTimeout(close, 900);
  }, [close]);

  /* Placed so the menu never hangs off an edge. */
  const place = useMemo(() => {
    if (!spot) return { left: 0, top: 0 };
    const w = 248;
    const rows =
      4 + (spot.img ? 1 : 0) + (spot.contact ? 1 : 0) + (spot.selection ? 1 : 0) + (spot.scrolled ? 1 : 0);
    const h = 92 + rows * 44;
    return {
      left: Math.max(8, Math.min(spot.x, window.innerWidth - w - 8)),
      top: Math.max(8, Math.min(spot.y, window.innerHeight - h - 8)),
    };
  }, [spot]);

  if (typeof document === "undefined") return null;

  const row =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-mist outline-none transition-colors duration-200 hover:bg-white/[0.06] hover:text-bone focus-visible:bg-white/[0.08] focus-visible:text-bone";
  const icon = "h-4 w-4 shrink-0 text-brass";

  return (
    <>
      {spot &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label="Page actions"
            className="glass fixed z-[200] w-[248px] rounded-2xl border border-white/10 p-1.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,1)]"
            style={place}
          >
            <p className="px-3 pb-1.5 pt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
              BSM Security
            </p>

            {spot.img && (
              <button
                type="button"
                role="menuitem"
                data-menuitem
                className={row}
                onClick={() => {
                  setViewing(spot.img);
                  close();
                }}
              >
                <Expand className={icon} strokeWidth={1.6} />
                <span className="truncate">View “{spot.img.name}”</span>
              </button>
            )}

            {spot.contact && (
              <button
                type="button"
                role="menuitem"
                data-menuitem
                className={row}
                onClick={() => copy("contact", spot.contact!.value)}
              >
                {spot.contact.kind === "phone" ? (
                  <Phone className={icon} strokeWidth={1.6} />
                ) : (
                  <Mail className={icon} strokeWidth={1.6} />
                )}
                {copied === "contact"
                  ? "Copied"
                  : spot.contact.kind === "phone"
                    ? `Copy ${spot.contact.value}`
                    : "Copy email address"}
              </button>
            )}

            {spot.selection && (
              <button
                type="button"
                role="menuitem"
                data-menuitem
                className={row}
                onClick={() => copy("selection", spot.selection)}
              >
                <Copy className={icon} strokeWidth={1.6} />
                {copied === "selection" ? "Copied" : "Copy selected text"}
              </button>
            )}

            <div className="my-1 h-px bg-white/[0.07]" />

            <button
              type="button"
              role="menuitem"
              data-menuitem
              className={row}
              onClick={() => {
                openEnquiry();
                close();
              }}
            >
              <ShieldCheck className={icon} strokeWidth={1.6} />
              Request security
            </button>

            <a
              role="menuitem"
              data-menuitem
              href={site.contact.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className={row}
              onClick={close}
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25d366]" />
              WhatsApp us
            </a>

            <a
              role="menuitem"
              data-menuitem
              href={site.contact.phoneHref}
              className={row}
              onClick={close}
            >
              <Phone className={icon} strokeWidth={1.6} />
              Call {site.contact.phone}
            </a>

            <div className="my-1 h-px bg-white/[0.07]" />

            <button
              type="button"
              role="menuitem"
              data-menuitem
              className={row}
              onClick={() => copy("page", window.location.href)}
            >
              <Link2 className={icon} strokeWidth={1.6} />
              {copied === "page" ? "Link copied" : "Copy link to this page"}
            </button>

            {spot.scrolled && (
              <button
                type="button"
                role="menuitem"
                data-menuitem
                className={row}
                onClick={() => {
                  jumpToTop();
                  close();
                }}
              >
                <ArrowUp className={icon} strokeWidth={1.6} />
                Back to top
              </button>
            )}
          </div>,
          document.body,
        )}

      {viewing &&
        createPortal(
          <figure
            className="fixed inset-0 z-[210] m-0 flex flex-col items-center justify-center gap-4 bg-void/95 p-6 backdrop-blur-sm md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={viewing.name}
            onClick={() => setViewing(null)}
          >
            <button
              type="button"
              onClick={() => setViewing(null)}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-bone transition-[color,border-color,rotate] duration-500 hover:rotate-90 hover:border-brass hover:text-brass"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/*
              Held to the window rather than the picture's own size: these are
              up to 2400px tall, and at full height the viewer ran off the
              screen with no way to see the foot of it.
            */}
            <img
              src={viewing.src}
              alt={viewing.alt}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[78vh] w-auto max-w-[min(1100px,90vw)] rounded-[1.25rem] border border-brass/30 object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,1)]"
            />

            {/* The picture's name, then what is in it. */}
            <figcaption className="flex max-w-[min(1100px,90vw)] flex-col items-center gap-1.5 text-center">
              <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-bone">
                {viewing.name}
              </span>
              {viewing.alt && viewing.alt !== viewing.name && (
                <span className="max-w-[72ch] text-[13px] leading-relaxed text-mist">
                  {viewing.alt}
                </span>
              )}
              <span className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.2em] text-dim">
                BSM Security Agency · Goa
              </span>
            </figcaption>
          </figure>,
          document.body,
        )}
    </>
  );
}
