"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, Expand, Link2, Phone, X } from "lucide-react";
import { site } from "@/lib/site";
import { jumpToTop } from "./SmoothScroll";

type Spot = { x: number; y: number; img: { src: string; alt: string } | null };

/**
 * The site's own right-click menu, and the image viewer it opens.
 *
 * ContentGuard already suppresses the browser's menu so its Save image,
 * Open image in new tab, View source and Inspect entries never appear. That
 * left a right-click doing nothing at all, which reads as a broken page.
 * This puts something in its place: a short menu of things the site is happy
 * for a visitor to do, and nothing that hands over a file.
 *
 * On a photograph the first entry opens it in the viewer below — larger, on
 * the page, with no address of its own to copy and no menu of its own to
 * save from.
 *
 * What this cannot do, and no web page can: stop a determined visitor. The
 * picture is already on their machine by the time they see it, and the
 * keyboard shortcuts, the browser's own menus and a reader with JavaScript
 * off all remain. This raises the effort and keeps the casual copy out of
 * reach; it is not protection. Watermarking, and serving images no larger
 * than the page needs, are the only real defences.
 *
 * A form field keeps the browser's menu, so a visitor can still paste their
 * number into the enquiry form.
 */
export default function ContextMenu() {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [viewing, setViewing] = useState<{ src: string; alt: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setSpot(null);
    setCopied(false);
  }, []);

  useEffect(() => {
    const inFormField = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("input, textarea, [contenteditable='true']");

    const onContextMenu = (e: MouseEvent) => {
      if (inFormField(e.target)) return;
      e.preventDefault();

      /* The picture under the pointer, if there is one. A CSS background is
         not an <img>, so only real images offer the viewer. */
      const el = e.target instanceof Element ? e.target.closest("img") : null;
      const img =
        el instanceof HTMLImageElement && el.currentSrc
          ? { src: el.currentSrc, alt: el.alt || "Photograph" }
          : null;

      setCopied(false);
      setSpot({ x: e.clientX, y: e.clientY, img });
    };

    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, []);

  /* Anything that moves the page out from under the menu closes it. */
  useEffect(() => {
    if (!spot) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [spot, close]);

  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setViewing(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  if (typeof document === "undefined") return null;

  /* Keep the menu on screen when the click lands near an edge. */
  const W = 232;
  const H = spot?.img ? 188 : 148;
  const left = spot ? Math.min(spot.x, Math.max(8, window.innerWidth - W - 8)) : 0;
  const top = spot ? Math.min(spot.y, Math.max(8, window.innerHeight - H - 8)) : 0;

  const item =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-mist transition-colors duration-200 hover:bg-white/[0.06] hover:text-bone";

  return (
    <>
      {spot &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label="Page actions"
            className="glass fixed z-[200] w-[232px] rounded-2xl border border-white/10 p-1.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,1)]"
            style={{ left, top }}
          >
            {spot.img && (
              <button
                type="button"
                role="menuitem"
                className={item}
                onClick={() => {
                  setViewing(spot.img);
                  close();
                }}
              >
                <Expand className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.6} />
                View image
              </button>
            )}

            <button
              type="button"
              role="menuitem"
              className={item}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              <Link2 className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.6} />
              {copied ? "Link copied" : "Copy link to this page"}
            </button>

            <a role="menuitem" href={site.contact.phoneHref} className={item} onClick={close}>
              <Phone className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.6} />
              Call {site.contact.phone}
            </a>

            <button
              type="button"
              role="menuitem"
              className={item}
              onClick={() => {
                jumpToTop();
                close();
              }}
            >
              <ArrowUp className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.6} />
              Back to top
            </button>
          </div>,
          document.body,
        )}

      {viewing &&
        createPortal(
          <div
            className="fixed inset-0 z-[210] grid place-items-center bg-void/95 p-6 backdrop-blur-sm md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={viewing.alt}
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
            <img
              src={viewing.src}
              alt={viewing.alt}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-[1.5rem] border border-brass/30 object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,1)]"
            />
          </div>,
          document.body,
        )}
    </>
  );
}
