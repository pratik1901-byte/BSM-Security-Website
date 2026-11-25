"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, Phone } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { heroHighlights, site } from "@/lib/site";
import { media } from "@/lib/media";
import { Button } from "@/components/ui/Button";
import { RequestSecurityButton } from "@/components/ui/RequestSecurityButton";

/**
 * Full-height hero. The photograph (media.heroBackdrop) fills the left of the
 * screen and dissolves into the dark towards the copy on the right, so it
 * reads as one scene at any width or browser zoom — a full photograph or a
 * transparent cut-out of a guard both sit correctly.
 *
 * Motion: one calm entrance, a brass light that follows the pointer, and a
 * scroll-out where the photograph drifts slower than the page.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const shot = media.heroBackdrop;

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const el = root.current;
    let offPointer: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });

      // The CSS gate parks the lines at translateY(118%). GSAP reads that
      // computed transform as pixels, so restate the start in GSAP's own
      // units or the headline would stay stuck inside its mask.
      tl.set(".hero-line", { yPercent: 118, y: 0 })
        .set(".hero-chip", { y: 16, scale: 1 })
        .to(".hero-media", { opacity: 1, scale: 1, duration: 2, ease: "power2.out" })
        .to(".hero-vrule", { scaleY: 1, duration: 1.1, ease: "expo.inOut" }, 0.2)
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.8 }, 0.35)
        .to(".hero-line", { yPercent: 0, duration: 1.25, stagger: 0.09 }, 0.4)
        .fromTo(
          ".hero-underline",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.1, ease: "expo.inOut" },
          0.9,
        )
        .to(".hero-sub", { opacity: 1, y: 0, duration: 1 }, 0.75)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, 0.9)
        .to(".hero-chip", { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 1.05)
        .to(".hero-cue", { opacity: 1, duration: 0.6 }, 1.4);

      gsap.to(".hero-cue-arrow", { y: 6, repeat: -1, yoyo: true, duration: 1.4, ease: "sine.inOut" });

      // Scroll-out: the photograph drifts slower than the page, the copy lifts.
      gsap.to(".hero-backdrop", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
      });
      gsap.to(".hero-copy", {
        yPercent: -10,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
      });

      // A soft brass light that follows the pointer across the hero.
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const glow = el.querySelector<HTMLElement>(".hero-glow");
        if (glow) {
          const gx = gsap.quickTo(glow, "x", { duration: 1.2, ease: "power3.out" });
          const gy = gsap.quickTo(glow, "y", { duration: 1.2, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            gx(e.clientX - r.left);
            gy(e.clientY - r.top);
          };
          el.addEventListener("pointermove", onMove);
          offPointer = () => el.removeEventListener("pointermove", onMove);
        }
      }
    }, el);

    return () => {
      offPointer?.();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-void"
      aria-label="Introduction"
    >
      {/* ---- Backdrop ------------------------------------------------------ */}
      {/* Starts below the navbar, so the subject's head never sits under it. */}
      <div
        className="hero-backdrop absolute inset-x-0 bottom-0 top-[calc(var(--nav-h)-1.5rem)] -z-10 lg:right-auto lg:w-[60%]"
        aria-hidden="true"
      >
        <div className="hero-media hero-mask absolute inset-0">
          {shot.src && (
            <img
              src={shot.src}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
              style={{ objectPosition: shot.focus ?? "50% 25%" }}
            />
          )}
        </div>
      </div>
      {/* Phones and tablets: the copy sits over the lower photograph. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,6,10,0.35)_0%,rgba(4,6,10,0.55)_35%,#04060a_72%)] lg:hidden"
        aria-hidden="true"
      />
      {/* Warm light and grain, so the scene reads as night-time. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_12%_8%,rgba(226,196,134,0.16)_0%,transparent_70%),radial-gradient(40%_50%_at_95%_100%,rgba(200,164,92,0.12)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <span className="grain-layer -z-10" aria-hidden="true" />
      <div
        className="hero-glow pointer-events-none absolute left-0 top-0 -z-10 hidden h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,164,92,0.10),transparent)] lg:block"
        aria-hidden="true"
      />
      {/* Brass corner accent */}
      <svg
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-40 w-40 md:h-56 md:w-56"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path d="M200 60 L60 200 H200 Z" fill="url(#heroCorner)" opacity="0.9" />
        <path d="M200 20 L20 200" stroke="#c8a45c" strokeOpacity="0.55" strokeWidth="1.5" />
        <defs>
          <linearGradient id="heroCorner" x1="200" y1="200" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e2c486" />
            <stop offset="1" stopColor="#c8a45c" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* ---- Copy ---------------------------------------------------------- */}
      <div className="shell relative flex flex-1 flex-col">
        <div className="grid flex-1 items-center pb-8 pt-[max(46svh,18rem)] lg:grid-cols-12 lg:pb-[clamp(1rem,3svh,3rem)] short-desktop:lg:pb-2 lg:pt-[calc(var(--nav-h)+clamp(1rem,3svh,3.5rem))]">
          <div className="hero-copy lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
            <div className="hero-eyebrow inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-void/40 py-1.5 pl-1.5 pr-4 backdrop-blur-md">
              <span className="relative grid h-6 w-6 place-items-center rounded-full bg-brass/15">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-brass/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-brass" />
              </span>
              <span className="eyebrow">Security Agency · Goa, India</span>
            </div>

            <div className="relative mt-[clamp(1rem,2.6svh,1.75rem)] short-desktop:mt-2 pl-5 md:pl-7">
              <span
                className="hero-vrule absolute bottom-[0.35em] left-0 top-[0.25em] w-[3px] origin-top rounded-full bg-gradient-to-b from-brass-lit to-brass/30"
                aria-hidden="true"
              />
              {/* Sized by width and height, so the hero always fits one screen. */}
              <h1 className="text-[clamp(2.1rem,min(3.9vw,7.2svh),4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-bone">
                <span className="block overflow-hidden pb-[0.06em]">
                  <span className="hero-line block">Protecting industries.</span>
                </span>
                <span className="block overflow-hidden pb-[0.06em]">
                  <span className="hero-line block">Securing Businesses.</span>
                </span>
                <span className="block overflow-hidden pb-[0.22em]">
                  <span className="hero-line block">
                    Building{" "}
                    <span className="relative inline-block">
                      <span className="accent-serif text-brass">Trust.</span>
                      <svg
                        className="absolute -bottom-[0.12em] left-0 h-[0.22em] w-full overflow-visible text-brass"
                        viewBox="0 0 100 10"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          className="hero-underline"
                          d="M2 7 C 25 2, 55 2, 98 5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          pathLength={1}
                          strokeDasharray="1"
                        />
                      </svg>
                    </span>
                  </span>
                </span>
              </h1>
            </div>

            {/* Recruitment, under the headline and above the descriptive
                paragraph. It carries `hero-sub` so it fades up on the same
                beat as the paragraph rather than needing a tween of its own.
                A brass bar and a brass-tinted ground lift it clear of the
                paragraph below without a second pill competing with the
                eyebrow above. */}
            <p className="hero-sub mt-[clamp(0.85rem,2.2svh,1.35rem)] short-desktop:mt-1.5 flex max-w-xl items-baseline gap-3 rounded-r-md border-l-2 border-brass/70 bg-gradient-to-r from-brass/[0.09] to-transparent py-2 short-desktop:py-1.5 pl-3.5 pr-3 text-[clamp(0.9375rem,min(1.22vw,2.05svh),1.125rem)] leading-[1.5] text-bone">
              <span>
                Pan-India employment opportunities, with{" "}
                <span className="font-semibold text-brass-lit">priority preference</span> for
                candidates from Goa.
              </span>
            </p>

            <p className="hero-sub mt-[clamp(0.9rem,2.6svh,1.75rem)] short-desktop:mt-2 max-w-xl text-justify hyphens-auto sm:hyphens-none text-[clamp(1rem,min(1.3vw,2.3svh),1.25rem)] leading-[1.6] text-mist">
              BSM provides trained security personnel and managed protection across India — from
              beachfront resorts and gated communities to corporate offices, industrial estates
              and events. Local presence, written deployment plans, supervision you can verify.
            </p>

            <div className="mt-[clamp(1.1rem,3.2svh,2.25rem)] short-desktop:mt-3 flex flex-wrap items-center gap-4">
              <span className="hero-cta inline-block">
                <RequestSecurityButton />
              </span>
              <span className="hero-cta inline-block">
                <Button href="/contact#enquiry" variant="outline">
                  Contact Us
                </Button>
              </span>
              <span className="hero-cta hidden h-10 w-px bg-white/15 xl:block" aria-hidden="true" />
              <a
                href={site.contact.phoneHref}
                className="hero-cta group inline-flex items-center gap-3 rounded-full py-2 pr-2 text-sm text-bone transition-colors hover:text-brass"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-brass/40 text-brass transition-colors duration-300 group-hover:bg-brass group-hover:text-void">
                  <Phone className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="font-mono text-[13px] font-semibold tracking-[0.06em]">
                  {site.contact.phone}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ---- Highlights -------------------------------------------------
            Four facts, not links: a hairline between them and nothing behind,
            so they read as a line of type rather than a row of cards. Two
            columns on a phone, four from the small breakpoint up. The two
            long headings wrap to a second line, which is why every cell is
            aligned to its top and the row is not given a fixed height. */}
        <div className="pb-8 lg:grid lg:grid-cols-12 lg:pb-[clamp(1.25rem,3.5svh,2.5rem)] short-desktop:lg:pb-3">
          <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-y-0 lg:col-span-7 lg:col-start-6">
            {heroHighlights.map((item, i) => (
              <li
                key={item.value}
                className={`hero-chip px-4 sm:px-2.5 lg:px-3 ${
                  i % 2 === 1 ? "border-l border-white/[0.09]" : ""
                } ${i === 2 ? "sm:border-l sm:border-white/[0.09]" : ""}`}
              >
                <p className="font-display text-[clamp(0.86rem,0.66rem+0.32vw,1rem)] min-h-[2.4em] font-semibold uppercase leading-[1.2] tracking-[0] text-brass text-balance">
                  {item.value}
                </p>
                <p className="mt-1.5 text-[clamp(10.5px,9px+0.2vw,12px)] leading-snug text-mist text-balance">
                  {item.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hero-cue pointer-events-none absolute bottom-10 left-8 hidden flex-col items-center gap-3 xl:flex">
        <span className="grid h-12 w-7 justify-center rounded-full border border-white/15 pt-2">
          <ArrowDown className="hero-cue-arrow h-3.5 w-3.5 text-brass" strokeWidth={1.5} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">Scroll</span>
      </div>
    </section>
  );
}
