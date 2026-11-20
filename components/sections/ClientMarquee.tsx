import { ArrowUpRight } from "lucide-react";
import { clients } from "@/lib/site";
import { clientLogos } from "@/lib/media";
import { TransitionLink } from "@/components/layout/PageTransition";

/**
 * Our Esteemed DGR Sponsored Public Sector Clients — a continuous strip of logos,
 * straight from the roster
 * in lib/site and the logo dictionary in lib/media.
 *
 * Every logo sits centred on an identical white plate (the marks are drawn
 * for white), so marks of very different shapes — wide wordmarks, round
 * crests, tall emblems — read as one even row. A client without a supplied
 * logo gets the same plate with its name set in type, never a substitute.
 *
 * Tiles are not links — "View all clients" below the strip goes to the page.
 *
 * The loop is seamless: the track holds two identical groups, each carrying
 * its own trailing gap, and slides exactly one group's width (-50%). It
 * pauses under the pointer or keyboard focus, and stops for reduced motion.
 */
export default function ClientMarquee() {
  const group = (copy: boolean) => (
    <ul
      className="flex shrink-0 gap-5 pr-5"
      aria-hidden={copy ? true : undefined}
    >
      {clients.map((client) => {
        const logo = clientLogos[client.slug];
        return (
          <li key={client.slug} className="shrink-0">
            <div className="card card-ink group flex w-[15.5rem] flex-col p-2.5">
              <span className="relative grid h-32 w-full place-items-center overflow-hidden rounded-[1rem] bg-white">
                {logo ? (
                  <img
                    src={logo}
                    alt={copy ? "" : `${client.name} logo`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-x-6 inset-y-5 h-[calc(100%-2.5rem)] w-[calc(100%-3rem)] object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                ) : (
                  <span className="flex flex-col items-center gap-1 text-center">
                    <span className="font-display text-3xl font-semibold tracking-[-0.02em] text-[#0b1a33]">
                      {client.abbr ?? client.name.split(" – ")[0]}
                    </span>
                    <span className="h-0.5 w-8 rounded-full bg-brass" aria-hidden="true" />
                  </span>
                )}
              </span>
              <span className="block px-2 pb-1 pt-3">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
                  {client.abbr ?? client.name.split(" – ")[0]}
                </span>
                <span className="mt-0.5 block truncate text-[13px] font-medium text-bone">
                  {client.name}
                </span>
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section aria-label="Our clients" className="relative border-t border-line bg-ink py-20 md:py-24">
      <span className="section-divider pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />
      <span className="dot-field pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60" aria-hidden="true" />

      <div className="shell relative flex flex-col items-center text-center">
        <div
          className="inline-flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2"
          data-reveal="up"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden="true" />
          <span className="eyebrow">
            Our Esteemed <span className="font-semibold text-brass-lit">DGR Sponsored</span> Public
            Sector <span className="font-semibold text-brass-lit">Clients</span>
          </span>
        </div>
        <h2 data-split className="mt-6 max-w-3xl text-title font-semibold text-bone">
          Organisations BSM is engaged with.
        </h2>
        <p data-reveal="up" className="mt-4 max-w-2xl text-mist">
          Public sector undertakings, government establishments, defence facilities and airports
          across Goa.
        </p>
      </div>

      <div className="marquee relative mt-12 overflow-hidden py-4" data-reveal="fade">
        <div className="marquee-track">
          {group(false)}
          {group(true)}
        </div>
      </div>

      <div className="mt-10 flex justify-center" data-reveal="up">
        <TransitionLink
          href="/clients"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mist transition-colors duration-300 hover:border-brass hover:text-brass"
        >
          View all clients
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </TransitionLink>
      </div>
    </section>
  );
}
