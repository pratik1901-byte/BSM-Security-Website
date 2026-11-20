"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;

/**
 * Clearance for the floating navbar — and the page's shortcut bar when it has
 * one — so an anchored heading is never hidden behind the chrome. The heights
 * come from the --nav-h / --subnav-h tokens in globals.css.
 */
export function headerOffset() {
  if (typeof window === "undefined") return 0;
  const styles = getComputedStyle(document.documentElement);
  const rem = parseFloat(styles.fontSize) || 16;
  const px = (name: string, fallback: number) => {
    const raw = styles.getPropertyValue(name).trim();
    const n = parseFloat(raw);
    if (!n) return fallback;
    return raw.endsWith("rem") ? n * rem : n;
  };
  const nav = px("--nav-h", 88);
  const sub = document.querySelector("[data-subnav]") ? px("--subnav-h", 52) : 0;
  return nav + sub + 1.5 * rem;
}

/**
 * Shared accessor so other components (Back to Top, anchors) can drive scroll.
 * Anything that moves the page must go through here: Lenis keeps its own
 * scroll target and will pull the page back to it, so a native scrollIntoView
 * gets undone and the visitor lands somewhere else entirely.
 */
export function scrollToTarget(
  target: number | string,
  { offset = 0, immediate = false }: { offset?: number; immediate?: boolean } = {},
) {
  if (lenisInstance) {
    const lenis = lenisInstance;
    lenis.scrollTo(target, {
      duration: 1.2,
      offset,
      immediate,
      // Lazy images and fonts can change the page's height during the
      // glide; re-measure on arrival and settle on the exact spot.
      onComplete: () => {
        if (typeof target !== "string") return;
        const el = document.querySelector(target);
        if (!el) return;
        const miss = el.getBoundingClientRect().top + offset;
        if (Math.abs(miss) > 2) lenis.scrollTo(target, { offset, duration: 0.45 });
      },
    });
    return;
  }
  if (typeof window === "undefined") return;
  const el = typeof target === "string" ? document.querySelector(target) : null;
  const base =
    typeof target === "number" ? target : el ? el.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo({
    top: base + offset,
    behavior: immediate || prefersReducedMotion() ? "auto" : "smooth",
  });
}

/** Freezes scrolling while an overlay (the mobile menu) owns the screen. */
export function setScrollLocked(locked: boolean) {
  if (typeof document === "undefined") return;
  if (locked) {
    lenisInstance?.stop();
    document.body.style.overflow = "hidden";
  } else {
    lenisInstance?.start();
    document.body.style.overflow = "";
  }
}

/** Hard reset to the top, used between page transitions. */
export function jumpToTop() {
  lenisInstance?.scrollTo(0, { immediate: true });
  if (typeof window !== "undefined") window.scrollTo(0, 0);
}

/**
 * Inertial scrolling, wired into the GSAP ticker so ScrollTrigger and Lenis
 * share a single rAF loop. Disabled outright under reduced-motion.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  /**
   * Every page opens at its top.
   *
   * Two things put a visitor back where they left off. The browser restores
   * the old offset itself on a history move, and Safari — on an iPad or a
   * Mac — does so after the new page has painted, so resetting once is not
   * enough. And the reset this site had ran only when the page-transition
   * curtain had covered the screen, which leaves every other route change —
   * back, forward, a restore from the back/forward cache — untouched.
   *
   * So: tell the browser not to restore (scrollRestoration), reset on every
   * change of path rather than only the curtained ones, and reset again on
   * the next frame and shortly after, which is what beats Safari putting the
   * old offset back. A link carrying a hash is left alone — PageTransition
   * lands those on their anchor.
   */
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (window.location.hash) return;

    const toTop = () => {
      if (!window.location.hash) jumpToTop();
    };

    toTop();
    const frame = requestAnimationFrame(toTop);
    const late = window.setTimeout(toTop, 150);

    /* A page restored from the back/forward cache does not re-run the effect
       above; it fires pageshow with persisted set instead. */
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) toTop();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(late);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [pathname]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
