"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Logo } from "@/components/ui/Logo";

/**
 * The entrance, shown once per browsing session.
 *
 * It is in the server's HTML and covers the page from the first paint. That
 * is the whole point of the arrangement: deciding in an effect whether to
 * show it meant the page had to hydrate first, and the site behind it was
 * visible for those few frames — the flash this replaces.
 *
 * So the decision is made before anything is painted, by the short script in
 * the document head: on the first view of a session, and when the visitor
 * has not asked for reduced motion, it marks the document and the CSS shows
 * this screen straight away. On a repeat view the mark is never set and the
 * screen never appears — not even for a frame, because `display: none` is
 * its resting state rather than something script has to apply.
 *
 * This component only animates it away; dropping the mark is what hides it.
 */
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute("data-intro") !== "on") return;
    if (prefersReducedMotion()) {
      html.removeAttribute("data-intro");
      return;
    }

    const el = root.current;
    if (!el) return;

    document.body.style.overflow = "hidden";
    const finish = () => {
      document.body.style.overflow = "";
      /* Dropping the mark is what hides the screen: the CSS rests it at
         display:none and only shows it while the mark is set. */
      html.removeAttribute("data-intro");
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });

      tl.fromTo(
        ".intro-mark",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "expo.out" },
      )
        .fromTo(
          ".intro-meter-fill",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.95, ease: "power2.inOut" },
          "-=0.3",
        )
        .to(".intro-mark, .intro-meter", { opacity: 0, duration: 0.28, ease: "power2.in" }, "+=0.05")
        .to(el, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.05");
    }, el);

    /* If the timeline is ever interrupted — a navigation mid-entrance, a
       thrown error inside GSAP — the page must not be left locked. */
    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="intro-screen">
      {/* A faint brass wash, so the screen is not a flat black rectangle. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_42%,rgba(200,164,92,0.10)_0%,transparent_70%)]"
      />
      <span className="dot-field pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative flex w-[min(26rem,78vw)] flex-col items-center text-center">
        <span className="intro-mark block">
          <Logo size={176} priority />
        </span>
        <p className="intro-mark mt-8 font-display text-6xl font-semibold tracking-[-0.03em] text-bone md:text-7xl">
          BSM
        </p>
        <p className="intro-mark mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-dim">
          Security · Goa
        </p>

        {/* The rule doubles as the progress of the entrance. */}
        <div className="intro-meter mt-8 h-px w-full overflow-hidden bg-white/10">
          <div className="intro-meter-fill h-full w-full origin-left bg-gradient-to-r from-brass/40 via-brass to-brass-lit" />
        </div>
      </div>
    </div>
  );
}
