/**
 * Gallery — the dictionary.
 *
 * Reuses the photographs declared in ./photos so there is still one source of
 * truth per image. An entry without a `shot` renders the placeholder frame and
 * states what photograph belongs there.
 */

import type { GalleryItem } from "./types";
import { media } from "./photos";

export const gallery: GalleryItem[] = [
  { shot: media.heroDeployment, group: "Personnel", figure: "Fig. 01", ratio: "1024 / 1536" },
  { shot: media.guarding, group: "Personnel", figure: "Fig. 02", ratio: "1600 / 1038" },
  { shot: media.briefing, group: "Operations", figure: "Fig. 03", ratio: "1600 / 2400" },
  { shot: media.patrol, group: "Operations", figure: "Fig. 04", ratio: "1400 / 1823" },
  { shot: media.records, group: "Operations", figure: "Fig. 05", ratio: "1400 / 2100" },
  { shot: media.corporate, group: "Sites", figure: "Fig. 06", ratio: "1400 / 946" },
  { shot: media.residential, group: "Sites", figure: "Fig. 07", ratio: "1400 / 933" },
  { shot: media.hospitality, group: "Sites", figure: "Fig. 08", ratio: "1400 / 1750" },
  { shot: media.industrial, group: "Sites", figure: "Fig. 09", ratio: "1600 / 2000" },
  { shot: media.event, group: "Sites", figure: "Fig. 10", ratio: "1400 / 933" },
  { shot: media.coast, group: "Goa", figure: "Fig. 11", ratio: "1600 / 1067" },
  { shot: media.goaLandscape, group: "Goa", figure: "Fig. 12", ratio: "1600 / 1200" },
  { shot: media.estate, group: "Sites", figure: "Fig. 13", ratio: "1600 / 1110" },
  { shot: media.night, group: "Operations", figure: "Fig. 14", ratio: "1400 / 1050" },
];

/** The groups, in display order. Used for the gallery filter rail. */
export const galleryGroups = ["Personnel", "Operations", "Sites", "Goa"] as const;
