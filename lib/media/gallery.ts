/**
 * Gallery — the dictionary.
 *
 * Reuses the photographs declared in ./photos so there is still one source of
 * truth per image. An entry without a `shot` renders the placeholder frame and
 * states what photograph belongs there.
 *
 * Three groups: the people on post, and the two offices. The Head Office
 * photographs are BSM's own. The Branch Office has none yet, so it stands as
 * a single placeholder frame saying so — nothing generic is filed under it,
 * because a stock lobby labelled "Branch Office" would be a claim about
 * BSM's premises that is not true.
 */

import type { GalleryItem } from "./types";
import { media } from "./photos";

export const gallery: GalleryItem[] = [
  { shot: media.heroDeployment, group: "Personnel", figure: "Fig. 01", ratio: "1024 / 1536" },
  { shot: media.guarding, group: "Personnel", figure: "Fig. 02", ratio: "1600 / 1038" },
  { shot: media.briefing, group: "Personnel", figure: "Fig. 03", ratio: "1600 / 2400" },
  { shot: media.patrol, group: "Personnel", figure: "Fig. 04", ratio: "1400 / 1823" },
  { shot: media.records, group: "Personnel", figure: "Fig. 05", ratio: "1400 / 2100" },
  { shot: media.night, group: "Personnel", figure: "Fig. 06", ratio: "1400 / 1050" },

  /* Wide and tall alternate so no column of the masonry runs away from the
     others and leaves the row short. */
  { shot: media.headOffice, group: "Head Office", figure: "Fig. 07", ratio: "1600 / 900" },
  { shot: media.headOfficeRecords, group: "Head Office", figure: "Fig. 08", ratio: "900 / 1600" },
  { shot: media.headOfficeAdminDesks, group: "Head Office", figure: "Fig. 09", ratio: "1600 / 900" },
  { shot: media.headOfficeFrontDesk, group: "Head Office", figure: "Fig. 10", ratio: "900 / 1600" },
  { shot: media.headOfficeCabin, group: "Head Office", figure: "Fig. 11", ratio: "900 / 1600" },
  { shot: media.headOfficeCabinMeeting, group: "Head Office", figure: "Fig. 12", ratio: "900 / 1600" },
  {
    group: "Branch Office",
    figure: "Fig. 13",
    label: "Branch Office — Chimbel, Panjim",
    brief:
      "Awaiting BSM's photograph of the Branch Office at Kadamba Govt Housing Society, Chimbel.",
    ratio: "16 / 10",
  },
];

/** The groups, in display order. Used for the gallery filter rail. */
export const galleryGroups = ["Personnel", "Head Office", "Branch Office"] as const;

/**
 * The anchor a group is reached by. A group name now has a space in it, and
 * an id cannot, so this is not `toLowerCase()` any more — the shortcut bar,
 * the Gallery menu and the section itself all have to agree on the same
 * string or every link lands nowhere.
 */
export function groupId(group: string) {
  return group.toLowerCase().replace(/\s+/g, "-");
}
