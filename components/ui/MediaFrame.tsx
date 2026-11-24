import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { Shot } from "@/lib/media";

type MediaFrameProps = {
  /** A shot from lib/media — fills src, alt, label and note in one go. */
  shot?: Shot;
  /** Drop a real photograph in /public/media and pass its path here. */
  src?: string;
  alt?: string;
  /** What belongs in this frame, shown while no photograph is supplied. */
  label?: string;
  note?: string;
  figure?: string;
  ratio?: string;
  className?: string;
  parallax?: number;
  /** Above-the-fold image: preloaded instead of lazy-loaded. */
  priority?: boolean;
  sizes?: string;
  /** Show the label as a glass chip over the photograph. */
  chip?: boolean;
  /**
   * Whether the caption names the photograph beside its figure number. The
   * gallery sets this false: every frame there is already a photograph of
   * the thing the group is named after, so the caption only repeated it.
   */
  captionLabel?: boolean;
  /**
   * Size the frame by its height instead of its width, from `lg` up.
   *
   * A frame normally fills the column and takes whatever height its ratio
   * gives it, which for a 9:16 photograph in a wide column is most of the
   * screen. With this set the frame takes the height of whatever box it is
   * in and works out its own width from the ratio, so a tall photograph
   * comes out narrow rather than long — still whole, still uncropped.
   */
  fillHeight?: boolean;
};

/**
 * Every image on the site goes through this frame, so art direction stays
 * consistent whether or not BSM's own photography has been supplied yet.
 *
 * Layers, outside in:
 *   .frame          rounded keyline, soft fade-in reveal (data-clip)
 *   parallax        drifts against the scroll (data-parallax)
 *   .frame-zoom     slow CSS zoom on hover (the `scale` property)
 *   <img>           scaled down into place by GSAP on reveal (data-clip-img)
 *
 * Each layer owns a different property, so the scroll reveal, the parallax and
 * the hover zoom never overwrite one another.
 *
 * With no `src` it renders a composed placeholder that states plainly what
 * photograph belongs there — never a stock image standing in for BSM's work.
 */
export function MediaFrame({
  shot,
  src: srcProp,
  alt: altProp,
  label: labelProp,
  note: noteProp,
  figure,
  ratio = "4 / 5",
  className = "",
  parallax = 0.08,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  chip = false,
  captionLabel = true,
  fillHeight = false,
}: MediaFrameProps) {
  const src = srcProp ?? shot?.src;
  const alt = altProp ?? shot?.alt;
  const label = labelProp ?? shot?.label ?? "Image";
  const note = noteProp ?? shot?.brief;
  /* A shot that declares its own ratio is shown whole, never cropped. */
  const frameRatio = shot?.ratio ?? ratio;
  /* The parallax drift needs the image oversized; without it the frame
     would crop ~10% off every edge for no reason. */
  const drifts = parallax > 0 && !shot?.ratio;

  return (
    <figure className={`group relative ${className}`} data-parallax-scope>
      <div
        data-clip
        className={`frame w-full ${fillHeight ? "lg:h-full lg:w-auto" : ""}`}
        style={{ aspectRatio: frameRatio }}
      >
        {src ? (
          <div
            className={drifts ? "absolute inset-[-10%]" : "absolute inset-0"}
            data-parallax={drifts ? parallax : undefined}
          >
            <div className="frame-zoom">
              <Image
                src={src}
                alt={alt ?? label}
                fill
                preload={priority}
                sizes={sizes}
                data-clip-img
                data-name={shot?.label ?? label}
                className={shot?.ratio ? "object-contain" : "object-cover"}
                /* Which part of a cropped photograph stays in view. */
                style={shot?.focus ? { objectPosition: shot.focus } : undefined}
              />
            </div>
          </div>
        ) : (
          <PlaceholderArt label={label} note={note} />
        )}
        {src && <span className="frame-shade" aria-hidden="true" />}
        {chip && src && (
          <span className="glass absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden="true" />
            {label}
          </span>
        )}
      </div>
      {figure && (
        <figcaption className="mt-4 flex items-baseline justify-between gap-4 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          <span className="text-brass/80">{figure}</span>
          {captionLabel && <span className="truncate text-right text-dim/80">{label}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/** The composed empty state: dot field, crosshair and a plain-language brief. */
function PlaceholderArt({ label, note }: { label: string; note?: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_90%_at_50%_0%,#111925_0%,#070a10_60%,#04060a_100%)]">
      <span className="dot-field absolute inset-0" aria-hidden="true" />
      <svg
        className="absolute inset-0 h-full w-full text-line"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
      </svg>
      <div className="relative z-10 flex max-w-[80%] flex-col items-center text-center">
        <span className="icon-tile">
          <ImageIcon className="h-5 w-5" strokeWidth={1.25} />
        </span>
        <span className="mt-5 inline-block rounded-full border border-brass/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-brass">
          [Image]
        </span>
        <p className="mt-4 font-display text-sm uppercase tracking-[0.14em] text-bone/80">{label}</p>
        {note && (
          <p className="mt-2 font-mono text-[10px] leading-relaxed tracking-[0.06em] text-dim">{note}</p>
        )}
      </div>
    </div>
  );
}
