/**
 * Gallery — the dictionary.
 *
 * Reuses the photographs declared in ./photos so there is still one source of
 * truth per image. An entry without a `shot` renders the placeholder frame and
 * states what photograph belongs there.
 *
 * Three groups: the people on post, and the two offices. Every photograph
 * here is BSM's own — its officers at real client sites, and its two real
 * premises. Nothing generic is filed under any of them, because a stock guard
 * or a stock lobby under these labels would be a claim about BSM that is not
 * true. Each entry's ratio is the file's own shape, so the masonry frames it
 * rather than cropping or letterboxing it.
 */

import type { GalleryItem } from "./types";
import { media } from "./photos";

export const gallery: GalleryItem[] = [
  /* Cover first — the rail takes a group's cover from its first frame with a
     photograph. After that wide and tall alternate, so no column of the
     masonry runs away from the others and leaves the last row ragged. */
  { shot: media.personnelAirportTerminal, group: "Personnel", figure: "Fig. 01", ratio: "1289 / 806" },
  { shot: media.personnelFlagDepot, group: "Personnel", figure: "Fig. 02", ratio: "836 / 1600" },
  { shot: media.personnelMusterHall, group: "Personnel", figure: "Fig. 03", ratio: "1263 / 655" },
  { shot: media.personnelFlagIndependence, group: "Personnel", figure: "Fig. 04", ratio: "1086 / 1448" },
  { shot: media.personnelFlagCampus, group: "Personnel", figure: "Fig. 05", ratio: "1289 / 700" },
  { shot: media.personnelPowergridCeremony, group: "Personnel", figure: "Fig. 06", ratio: "1030 / 1527" },
  { shot: media.personnelGateLine, group: "Personnel", figure: "Fig. 07", ratio: "1289 / 949" },
  { shot: media.personnelFlagPlant, group: "Personnel", figure: "Fig. 08", ratio: "1086 / 1448" },
  { shot: media.personnelEventReception, group: "Personnel", figure: "Fig. 09", ratio: "1600 / 1108" },
  { shot: media.personnelEventHall, group: "Personnel", figure: "Fig. 10", ratio: "1046 / 898" },

  { shot: media.headOfficeCabinWide, group: "Head Office", figure: "Fig. 11", ratio: "1600 / 842" },
  { shot: media.headOfficeRecords, group: "Head Office", figure: "Fig. 12", ratio: "900 / 1600" },
  { shot: media.headOffice, group: "Head Office", figure: "Fig. 13", ratio: "1600 / 900" },
  { shot: media.headOfficeFrontDesk, group: "Head Office", figure: "Fig. 14", ratio: "900 / 1600" },
  { shot: media.headOfficeAdminDesks, group: "Head Office", figure: "Fig. 15", ratio: "1600 / 900" },
  { shot: media.headOfficeCabin, group: "Head Office", figure: "Fig. 16", ratio: "900 / 1600" },
  { shot: media.headOfficeCabinMeeting, group: "Head Office", figure: "Fig. 17", ratio: "900 / 1600" },
  { shot: media.branchOfficeCabin, group: "Branch Office", figure: "Fig. 18", ratio: "3 / 4" },
  { shot: media.branchOfficeDesk, group: "Branch Office", figure: "Fig. 19", ratio: "3 / 4" },
  { shot: media.branchOfficeAdmin, group: "Branch Office", figure: "Fig. 20", ratio: "3 / 4" },
  { shot: media.branchOfficeManager, group: "Branch Office", figure: "Fig. 21", ratio: "3 / 4" },
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
