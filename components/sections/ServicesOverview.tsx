"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { services } from "@/lib/site";
import { serviceShots } from "@/lib/media";
import { serviceHomeLabels, serviceShortLabels } from "@/lib/navigation";
import { Section, SectionLabel } from "@/components/ui/Section";
import { Button, ArrowSwap } from "@/components/ui/Button";
import { TransitionLink } from "@/components/layout/PageTransition";

/**
 * The services index reads as a contents page. On desktop a rounded preview
 * of each service's photograph follows the pointer down the list, tilting
 * with the direction of travel; on touch it is simply a list, which is what a
 * list should be.
 */
export default function ServicesOverview() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  /* The preview is portalled to <body>: as a child of the page, any transform
     on an ancestor would become its containing block and push it off-screen. */
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = preview.current;
    const list = root.current;
    if (!el || !list || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches)
      return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX + 36);
      yTo(e.clientY - 150);
      rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    list.addEventListener("pointermove", onMove);
    return () => {
      list.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(el);
    };
  }, [mounted]);

  useEffect(() => {
    const el = preview.current;
    if (!el || prefersReducedMotion()) return;
    gsap.to(el, {
      opacity: active === null ? 0 : 1,
      scale: active === null ? 0.85 : 1,
      duration: 0.5,
      ease: "expo.out",
    });
  }, [active, mounted]);

  return (
    <Section id="services" label="Services">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="04">What we do</SectionLabel>
          <h2 data-split className="mt-8 text-display font-semibold text-bone">
            Security services, matched to the site.
          </h2>
        </div>
        <div className="flex items-end lg:col-span-6 lg:col-start-7">
          <p data-reveal="up" className="text-lead text-justify text-mist">
            Ten service categories. Each one starts from the same place — a survey of your site
            and a written plan — and ends with personnel who know that specific gate, lobby or
            perimeter.
          </p>
        </div>
      </div>

      <div
        ref={root}
        data-stagger
        className="mt-16 grid gap-2"
        onMouseLeave={() => setActive(null)}
      >
        {services.map((service, i) => (
          <TransitionLink
            key={service.slug}
            href={`/services#${service.slug}`}
            data-stagger-item
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className={`card group grid grid-cols-12 items-center gap-4 px-5 py-6 md:px-7 md:py-7 ${
              service.highlight ? "card-feature" : "card-void"
            }`}
          >
            <span className="col-span-2 md:col-span-1">
              <span className="index-chip">{service.index}</span>
            </span>
            <span className="col-span-10 md:col-span-5">
              <span
                className={`block font-display text-xl font-semibold tracking-[-0.02em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-2xl ${
                  service.highlight ? "text-brass" : "text-bone"
                }`}
              >
                {serviceHomeLabels[service.slug] ?? serviceShortLabels[service.slug]}
              </span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                {service.points.length
                  ? `${service.points.length} services`
                  : "Additional service"}
              </span>
            </span>
            <span className="col-span-10 col-start-3 text-sm leading-relaxed text-mist md:col-span-5 md:col-start-7">
              {service.points[0] ?? ""}
            </span>
            <span className="col-span-1 hidden justify-end md:flex">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-bone transition-colors duration-500 group-hover:border-brass group-hover:bg-brass group-hover:text-void">
                <ArrowSwap />
              </span>
            </span>
          </TransitionLink>
        ))}
      </div>

      <div className="mt-14" data-reveal="up">
        <Button href="/services" variant="outline">
          All services
        </Button>
      </div>

      {/* Pointer-tracked preview: the service's photograph in a framed card,
          with its index, title and count — follows the pointer down the list. */}
      {mounted &&
        createPortal(
          <div
            ref={preview}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-[340px] w-[264px] scale-90 opacity-0 lg:block"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] border border-brass/45 bg-[radial-gradient(120%_90%_at_50%_0%,#131b27_0%,#070a10_70%)] shadow-[0_40px_90px_-30px_rgba(0,0,0,1)]">
              {services.map((s, i) => {
                const shot = serviceShots[s.slug];
                return shot.src ? (
                  <img
                    key={s.slug}
                    src={shot.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
                    }`}
                  />
                ) : null;
              })}
              {/* The original card's grid, laid over the photograph. */}
              <svg className="absolute inset-0 h-full w-full text-white/10" aria-hidden="true">
                <defs>
                  <pattern id="preview-grid" width="26" height="26" patternUnits="userSpaceOnUse">
                    <path d="M26 0H0V26" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#preview-grid)" />
              </svg>
              <span className="absolute inset-0 bg-gradient-to-t from-void via-void/45 to-void/10" />

              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brass/40 bg-void/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brass backdrop-blur-sm">
                  <span className="h-1 w-1 rounded-full bg-brass" aria-hidden="true" />
                  {active !== null ? services[active].index : "00"}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold leading-tight tracking-[-0.01em] text-bone">
                    {active !== null ? services[active].title : ""}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-brass/80">
                    {active !== null
                      ? services[active].points.length > 0
                        ? `${services[active].points.length} services`
                        : "Additional service"
                      : ""}
                  </p>
                </div>
              </div>

              {/* Brass corner brackets, as on the original card. */}
              <span className="absolute left-3 top-3 h-4 w-4 rounded-tl-md border-l-2 border-t-2 border-brass" />
              <span className="absolute bottom-3 right-3 h-4 w-4 rounded-br-md border-b-2 border-r-2 border-brass" />
            </div>
          </div>,
          document.body,
        )}
    </Section>
  );
}
