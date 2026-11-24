"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { gallery, galleryGroups, groupId, type GalleryItem } from "@/lib/media";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Section, SectionLabel } from "@/components/ui/Section";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { setScrollLocked } from "@/components/layout/SmoothScroll";

/** Heading for each gallery group. */
const GROUP_TITLES: Record<(typeof galleryGroups)[number], string> = {
  Personnel: "The people on post.",
  "Head Office": "Aquem, Margao.",
  "Branch Office": "Chimbel, Panjim.",
};

/**
 * The column count for a group, capped at how many photographs it holds so
 * no column is left empty. Written as whole class strings rather than built
 * from parts, because Tailwind only ships the classes it can see.
 *
 * One column on a phone, two on a tablet in either orientation, three on a
 * laptop and four once the viewport is very wide — which is also what a
 * desktop reports at 75% or 67% zoom.
 */
function columnsFor(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  /* Four photographs divide evenly into one, two or four columns — never
     three, which leaves 2-1-1 and one column running past the others. Two
     across up to a wide desktop, then four — both fill the row, so nothing
     is left standing empty down the right-hand side. */
  if (count === 4) return "grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4";
  /* Seven is the other count that will not sit in three columns: the Head
     Office group is four 9:16 portraits and three landscapes, and a portrait
     is over three times the height of a landscape. Three columns must give
     one of them two portraits, which leaves its neighbours hundreds of
     pixels short — the staircase of empty space at the foot of the section.
     Four columns take one portrait each and share the landscapes out. */
  if (count === 7) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";
}

/**
 * Masonry that reads across, not down.
 *
 * CSS `columns` fills one column to the bottom before starting the next, so
 * on a two-column tablet Fig. 01 sat beside Fig. 06 and the numbering looked
 * shuffled. A grid lays out across, which is the order people read in — but
 * a grid row is as tall as its tallest tile, which is what used to force
 * every photograph into one shape.
 *
 * So: a grid whose rows are one pixel tall, where each tile is told how many
 * of those rows it covers. Order reads across, and every photograph still
 * keeps its own height.
 *
 * Until the first measurement the grid is left on `auto` rows — a plain,
 * correct grid — so the markup is never broken before hydration.
 */
function useMasonry(count: number) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;

    let busy = false;

    const measure = () => {
      if (busy) return;
      busy = true;

      const kids = Array.from(el.children) as HTMLElement[];
      /* One column: rows are the tiles themselves, so spans would only get
         in the way. Read the computed value rather than the breakpoint, so
         this follows whatever the column classes actually resolved to. */
      const cols = window.getComputedStyle(el).gridTemplateColumns.split(" ").length;

      /* Release every tile so it sizes to its own content. A tile's height
         cannot be read while a span is dictating it, and guessing it from
         the picture plus the gutter is how tiles ended up overlapping: the
         caption line is a few pixels taller than that sum. */
      el.removeAttribute("data-masonry");
      for (const k of kids) k.style.gridRowEnd = "";

      if (cols < 2) {
        busy = false;
        return;
      }

      const heights = kids.map((k) => k.getBoundingClientRect().height);
      el.setAttribute("data-masonry", "on");
      kids.forEach((k, i) => {
        k.style.gridRowEnd = `span ${Math.max(1, Math.ceil(heights[i]))}`;
      });

      busy = false;
    };

    measure();
    /* Watch the pictures, not the tiles: a tile's height is what this hook
       writes, so observing it would chase its own tail. */
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(el);
    for (const k of Array.from(el.children)) {
      if (k.firstElementChild) ro.observe(k.firstElementChild);
    }
    const onOrient = () => window.setTimeout(measure, 200);
    window.addEventListener("orientationchange", onOrient);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", onOrient);
    };
  }, [count]);

  return grid;
}

/** Only frames with a photograph can be opened full screen. */
const viewable = gallery.filter((item) => item.shot?.src);

/**
 * The gallery's groups, each a grid of rounded frames, plus one shared
 * lightbox: click (or Enter on) a photograph to see it full screen, then
 * arrows or swipe-free buttons to move through every photograph on the page.
 */
export default function GalleryGroups() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      {galleryGroups.map((group, groupIndex) => {
        const items = gallery.filter((item) => item.group === group);
        if (!items.length) return null;
        return (
          <Section
            key={group}
            id={groupId(group)}
            label={`Gallery — ${group}`}
            className={groupIndex % 2 === 1 ? "bg-ink" : ""}
          >
            <SectionLabel index={String(groupIndex + 1).padStart(2, "0")}>{group}</SectionLabel>
            <div className="mt-8 flex flex-wrap items-baseline justify-between gap-6">
              <h2 data-split className="text-display font-semibold text-bone">
                {GROUP_TITLES[group]}
              </h2>
              <p
                data-reveal="up"
                className="rounded-full border border-white/[0.07] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim"
              >
                {String(items.length).padStart(2, "0")} frames
              </p>
            </div>

            {/* Never more columns than there are photographs: a group of two
                across three columns leaves the third empty, which is the gap
                down the right-hand side. See useMasonry for the row maths. */}
            <GalleryGrid count={items.length}>
              {items.map((item, i) => (
                <div key={`${group}-${i}`} className="self-start pb-5">
                  <GalleryTile item={item} onOpen={() => setOpen(viewable.indexOf(item))} />
                </div>
              ))}
            </GalleryGrid>
          </Section>
        );
      })}

      {open !== null && open >= 0 && (
        <Lightbox index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

function GalleryGrid({ count, children }: { count: number; children: React.ReactNode }) {
  const grid = useMasonry(count);
  return (
    <div
      ref={grid}
      data-stagger
      /* `dense` is what keeps the columns level: without it the placement
         cursor only moves forward, so a column that frees up early is left
         unused and its neighbour runs hundreds of pixels past it. */
      className={`mt-14 grid gap-x-5 [grid-auto-rows:auto] data-[masonry=on]:[grid-auto-flow:row_dense] data-[masonry=on]:[grid-auto-rows:1px] ${columnsFor(count)}`}
    >
      {children}
    </div>
  );
}

function GalleryTile({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const canOpen = Boolean(item.shot?.src);
  const frame = (
    <MediaFrame
      shot={item.shot}
      label={item.label}
      note={item.brief}
      figure={item.figure}
      captionLabel={false}
      ratio={item.ratio ?? "4 / 5"}
      parallax={0}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );

  return (
    <div data-stagger-item className="relative">
      {canOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View larger: ${item.shot?.label ?? item.label ?? "photograph"}`}
          className="group block w-full cursor-zoom-in rounded-[2rem] text-left"
        >
          {frame}
          {/* Hover affordance: the expand chip alone. The caption that slid
              up over the photograph named it a second time, after the
              figure line below already carried the number — and on these
              frames the name said nothing the group heading had not. */}
          <span className="pointer-events-none absolute right-4 top-4 grid h-10 w-10 scale-75 place-items-center rounded-full bg-brass text-void opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
            <Expand className="h-4 w-4" strokeWidth={1.75} />
          </span>
        </button>
      ) : (
        frame
      )}
    </div>
  );
}

function Lightbox({
  index,
  onIndex,
  onClose,
}: {
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const item = viewable[index];
  const count = viewable.length;

  const go = useCallback(
    (step: number) => onIndex((index + step + count) % count),
    [index, count, onIndex],
  );

  const close = useCallback(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) {
      onClose();
      return;
    }
    gsap.to(el, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  /* Open: lock scroll, focus the close button, and hand focus back after. */
  useEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setScrollLocked(true);
    closeBtn.current?.focus({ preventScroll: true });
    if (root.current && !prefersReducedMotion()) {
      gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    }
    return () => {
      setScrollLocked(false);
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, []);

  /* Keyboard: Escape closes, arrows move, Tab stays inside. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, go]);

  /* Each new photograph settles in. */
  useEffect(() => {
    if (!img.current || prefersReducedMotion()) return;
    gsap.fromTo(
      img.current,
      { opacity: 0, scale: 0.94, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out" },
    );
  }, [index]);

  if (!item?.shot) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[129] flex flex-col bg-void/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph viewer — ${item.shot?.label ?? item.figure}`}
    >
      <div className="shell flex items-center justify-between gap-4 py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          <span className="text-brass">{String(index + 1).padStart(2, "0")}</span> /{" "}
          {String(count).padStart(2, "0")} · {item.group}
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-bone transition-[color,border-color,rotate] duration-500 hover:rotate-90 hover:border-brass hover:text-brass"
        >
          <span className="sr-only">Close viewer</span>
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24">
        {/* The scrim behind the photograph also closes the viewer. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
          className="absolute inset-0 cursor-zoom-out"
        />
        <img
          ref={img}
          key={item.shot.src}
          src={item.shot.src}
          alt={item.shot.alt}
          className="relative max-h-full max-w-full rounded-[1.5rem] border border-brass/30 object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,1)]"
        />
        <button
          type="button"
          onClick={() => go(-1)}
          className="glass absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-bone transition-colors hover:text-brass md:left-8"
        >
          <span className="sr-only">Previous photograph</span>
          <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="glass absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-bone transition-colors hover:text-brass md:right-8"
        >
          <span className="sr-only">Next photograph</span>
          <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      {/* The figure number alone, as on the frame it was opened from. The
          name is still announced to a screen reader through the dialog's
          aria-label; it is only the sighted caption that goes. */}
      <div className="shell py-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{item.figure}</p>
      </div>
    </div>
  );
}
