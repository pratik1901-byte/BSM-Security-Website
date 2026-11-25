/**
 * Photographs — the dictionary.
 *
 * Every photograph on the site is one entry here, and nowhere else. Files are
 * WebP, filed by what they show:
 *
 *   /media/photos/    general and stand-in photography
 *   /media/services/  one per service category
 *   /media/people/    leadership portraits
 *
 * To change an image, put the master in assets-src/media/<folder>/, run
 * `npm run media`, and point `src` at the .webp it writes. To remove one, set
 * `src` to "" and the frame falls back to the composed placeholder that states
 * on the page what photograph belongs there.
 *
 * `ratio` is optional: give it when the photograph must be shown whole rather
 * than cropped to the frame.
 *
 * Current state: stand-in images under the Unsplash License, free for
 * commercial use. They are NOT photographs of BSM, its personnel or its sites.
 * Replace each `src` with BSM's own photography before launch and rewrite the
 * `alt` text to describe the real image; `brief` records what the shot is
 * meant to show.
 */

import type { Shot } from "./types";

export const media = {
  /**
   * The home page backdrop. Sits on the left of the hero and dissolves into
   * the dark on its right and bottom edges, so a full photograph or a
   * transparent cut-out of a guard both work. `focus` is the CSS
   * object-position that keeps the subject in view at every screen size.
   */
  heroBackdrop: {
    src: "/media/photos/hero-security-officer.webp",
    alt: "BSM security officer in a black suit and tie wearing sunglasses and an earpiece, with a BSM Security lanyard and identification card",
    label: "Personnel on post",
    brief: "Supplied by BSM — officer in uniform, shot in portrait for the hero.",
    focus: "50% 13%",
  },
  /* Points at the personnel folder rather than carrying a second copy of
     the same picture: this is the frame the gallery opens its Personnel
     group with, and one file is one file. */
  briefing: {
    src: "/media/personnel/personnel-airport-terminal.webp",
    alt: "A BSM detail drawn up inside an airport terminal beside the departure doors",
    label: "Personnel on post",
    brief: "Supplied by BSM. A shift on post at the terminal.",
    ratio: "1289 / 806",
  },
  publicSectorSecurity: {
    src: "/media/services/public-sector-security.webp",
    alt: "Two uniformed security officers on post at the gated entrance of a government building, with the national flag flying above the dome behind them",
    label: "Public sector and government premises",
    brief: "Supplied by BSM for the public sector, government and defence service category.",
    ratio: "1122 / 1402",
  },
  industrialCorporateSecurity: {
    src: "/media/services/industrial-corporate-security.webp",
    alt: "Security officer with a radio on post outside an industrial complex, with plant structures behind",
    label: "Industrial and corporate premises",
    brief: "Supplied by BSM for the industrial and corporate service category.",
    ratio: "1122 / 1402",
  },
  securityGuardServices: {
    src: "/media/services/security-guard-services.webp",
    alt: "Uniformed security officer at a corporate office entrance while a visitor passes through the access gate",
    label: "Guarding and visitor management",
    brief: "Supplied by BSM for the security guard services category.",
    ratio: "1122 / 1402",
  },
  bouncerPersonalSecurity: {
    src: "/media/services/bouncer-personal-security.webp",
    alt: "Suited personal security officers managing a roped guest arrival at a venue entrance",
    label: "Bouncer and personal security",
    brief: "Supplied by BSM for the bouncer and personal security category.",
    ratio: "1199 / 1312",
  },
  accessControlSurveillance: {
    src: "/media/services/access-control-surveillance.webp",
    alt: "Security officer on radio beside a monitoring station showing camera feeds, with a dome camera above the entrance",
    label: "Access control and surveillance",
    brief: "Supplied by BSM for the access control and surveillance category.",
    ratio: "1402 / 1122",
  },
  bankingCommercialSecurity: {
    src: "/media/services/banking-commercial-security.webp",
    alt: "Security officers at a bank entrance, one screening a visitor at the walk-through detector",
    label: "Banking and commercial premises",
    brief: "Supplied by BSM for the banking and commercial category.",
    ratio: "1536 / 1024",
  },
  residentialInstitutionalSecurity: {
    src: "/media/services/residential-institutional-security.webp",
    alt: "Security officers at the lit entrance of a residential community, with a vehicle at the boom barrier",
    label: "Residential and institutional premises",
    brief: "Supplied by BSM for the residential and institutional category.",
    ratio: "1122 / 1402",
  },
  weddingEventSecurity: {
    src: "/media/services/wedding-event-security.webp",
    alt: "Event security team on a red-carpet entrance at a decorated wedding venue, with guests screened at the detector",
    label: "Wedding and event security",
    brief: "Supplied by BSM for the wedding, event and specialised category.",
    ratio: "1536 / 1024",
  },
  securityTrainingDevelopment: {
    src: "/media/services/security-training-development.webp",
    alt: "Instructor addressing ranks of security personnel standing to attention on a training ground",
    label: "Training and personnel development",
    brief: "Supplied by BSM for the training and personnel development category.",
    ratio: "1671 / 941",
  },
  housekeepingServices: {
    src: "/media/services/housekeeping-services.webp",
    alt: "Housekeeping staff in BSM uniform wiping down a marble table in a corporate lobby, a colleague machine-cleaning the floor behind and a service trolley alongside",
    label: "Housekeeping services",
    brief: "Supplied by BSM for the housekeeping services category.",
    ratio: "1536 / 1024",
  },
  legalAdvisor: {
    src: "/media/people/legal-advisor.webp",
    alt: "Adv Nihal D Naik, Legal Advisor to BSM Security Agency, in advocate's bands",
    label: "Legal Advisor",
    brief: "Supplied by BSM for the Head Office.",
    focus: "50% 20%",
  },
  branchInCharge: {
    src: "/media/people/branch-in-charge.webp",
    alt: "Mr. Vighnesh Shet, Branch In-Charge of BSM's Panjim operations",
    label: "Branch In-Charge, Panjim",
    brief: "Supplied by BSM for the Branch Office.",
    focus: "50% 22%",
  },
  branchAdmin: {
    src: "/media/people/branch-admin.webp",
    alt: "Mrs. Pranali V Shet, who heads Administration and Billing at BSM's Panjim branch",
    label: "Administration and Billing, Panjim",
    brief: "Supplied by BSM for the Branch Office.",
    focus: "50% 22%",
  },
  leaderPrincipalPartner: {
    src: "/media/people/leader-principal-partner.webp",
    alt: "Mr. Dattatray B. Naik, Principal Partner of BSM Security Agency",
    label: "Mr. Dattatray B. Naik",
    brief: "Supplied by BSM. Master in assets-src/media/people.",
    focus: "50% 25%",
  },
  leaderTrainingPartner: {
    src: "/media/people/leader-training-partner.webp",
    alt: "Lt. Col. Bhupinder Singh Malhi (Retd.), Partner – Military Discipline & Training, BSM Security Agency",
    label: "Lt. Col. Bhupinder Singh Malhi (Retd.)",
    brief: "Supplied by BSM. Master in assets-src/media/people.",
    focus: "50% 22%",
  },
  leaderAdminPartner: {
    src: "/media/people/leader-admin-partner.webp",
    alt: "Mrs. Bhagyashree Dattatray Naik, Partner – Administration & Accounts, BSM Security Agency",
    label: "Mrs. Bhagyashree Dattatray Naik",
    brief: "Supplied by BSM. Master in assets-src/media/people.",
    focus: "50% 20%",
  },
  /* The Head Office at Aquem, Margao. Supplied by BSM; the alt text says
     what is visible and nothing about who the people are. */
  headOffice: {
    src: "/media/offices/head-office-floor.webp",
    alt: "The main room of BSM's Head Office, desks along one wall and a partitioned cabin beyond",
    label: "Head Office — the main room",
    brief: "Supplied by BSM. Aquem, Margao.",
    ratio: "1600 / 900",
  },
  headOfficeCabinWide: {
    src: "/media/offices/head-office-cabin-wide.webp",
    alt: "The cabin at BSM's Head Office, the board of DGR-sponsored agencies on the panelled wall behind the desk",
    label: "Head Office — the cabin",
    brief: "Supplied by BSM. Aquem, Margao. Cropped in on the desk: the frame ran a long way up the panelling, which left the room low and to one side on a wide cover card.",
    ratio: "1600 / 842",
  },
  headOfficeAdminDesks: {
    src: "/media/offices/head-office-admin-desks.webp",
    alt: "Two members of the administration team working at computers beside the office printers",
    label: "Administration desks",
    brief: "Supplied by BSM. Aquem, Margao.",
    ratio: "1600 / 900",
  },
  headOfficeRecords: {
    src: "/media/offices/head-office-records.webp",
    alt: "A manager writing in a register at his desk, the administration desks behind the partition",
    label: "Records at the Head Office",
    brief: "Supplied by BSM. Aquem, Margao.",
    ratio: "900 / 1600",
  },
  headOfficeFrontDesk: {
    src: "/media/offices/head-office-front-desk.webp",
    alt: "A manager taking a call at his desk, with the administration desks across the room",
    label: "Taking a call",
    brief: "Supplied by BSM. Aquem, Margao.",
    ratio: "900 / 1600",
  },
  headOfficeCabin: {
    src: "/media/offices/head-office-cabin.webp",
    alt: "The partner's cabin at the Head Office, panelled in wood behind a glass-topped desk",
    label: "The cabin",
    brief: "Supplied by BSM. Aquem, Margao.",
    ratio: "900 / 1600",
  },
  headOfficeCabinMeeting: {
    src: "/media/offices/head-office-cabin-meeting.webp",
    alt: "A meeting under way across the desk in the cabin at the Head Office",
    label: "A meeting in the cabin",
    brief: "Supplied by BSM. Aquem, Margao.",
    ratio: "900 / 1600",
  },
  /* ---- Personnel on post ------------------------------------------------
     BSM's own photographs of its officers at client sites: gate details,
     flag duty, muster, events. Each ratio below is the file's real shape,
     so the gallery frame never letterboxes or crops one of them. */
  personnelGuardSalute: {
    src: "/media/personnel/personnel-guard-salute.webp",
    alt: "A BSM officer in cap and sunglasses saluting, standing on a kerbed path in front of a clipped hedge",
    label: "Personnel — at the salute",
    brief: "Supplied by BSM. An officer at the salute, full length.",
    ratio: "3 / 4",
  },
  personnelGuardAtEase: {
    src: "/media/personnel/personnel-guard-at-ease.webp",
    alt: "A BSM officer standing at ease in cap, sunglasses and identification card, in front of a clipped hedge",
    label: "Personnel — on parade",
    brief: "Supplied by BSM. An officer standing at ease, full length.",
    ratio: "3 / 4",
  },
  personnelAirportTerminal: {
    src: "/media/personnel/personnel-airport-terminal.webp",
    alt: "A BSM detail drawn up inside an airport terminal beside the departure doors",
    label: "Personnel — airport terminal",
    brief: "Supplied by BSM. A shift on post at the terminal.",
    ratio: "1289 / 806",
  },
  personnelFlagDepot: {
    src: "/media/personnel/personnel-flag-depot.webp",
    alt: "Four BSM officers at attention either side of the flagstaff at a depot, the national flag flying",
    label: "Personnel — flag guard, depot",
    brief: "Supplied by BSM. Flag duty at a client depot.",
    ratio: "836 / 1600",
  },
  personnelMusterHall: {
    src: "/media/personnel/personnel-muster-hall.webp",
    alt: "A shift seated in a hall for muster, in cap and uniform",
    label: "Personnel — muster",
    brief: "Supplied by BSM. Muster before a shift.",
    ratio: "1263 / 655",
  },
  personnelFlagIndependence: {
    src: "/media/personnel/personnel-flag-independence.webp",
    alt: "Four BSM officers at the flagstaff outside an office block on Independence Day, marigolds laid at the base",
    label: "Personnel — Independence Day",
    brief: "Supplied by BSM. Independence Day at a client site.",
    ratio: "1086 / 1448",
  },
  personnelFlagCampus: {
    src: "/media/personnel/personnel-flag-campus.webp",
    alt: "Five BSM officers drawn up at the flagstaff on a client campus",
    label: "Personnel — flag guard, campus",
    brief: "Supplied by BSM. Flag duty on a client campus.",
    ratio: "1289 / 700",
  },
  personnelPowergridCeremony: {
    src: "/media/personnel/personnel-powergrid-ceremony.webp",
    alt: "Two BSM officers at the lectern at a Power Grid Corporation of India ceremony",
    label: "Personnel — Power Grid ceremony",
    brief: "Supplied by BSM. At a Power Grid Corporation of India event.",
    ratio: "1030 / 1527",
  },
  personnelGateLine: {
    src: "/media/personnel/personnel-gate-line.webp",
    alt: "A line of BSM officers on post along the gate of a property",
    label: "Personnel — on the gate",
    brief: "Supplied by BSM. A gate detail at a client property.",
    ratio: "1289 / 949",
  },
  personnelFlagPlant: {
    src: "/media/personnel/personnel-flag-plant.webp",
    alt: "Two BSM officers at the flagstaff inside a plant, the perimeter wall behind them",
    label: "Personnel — flag guard, plant",
    brief: "Supplied by BSM. Flag duty at an industrial site.",
    ratio: "1086 / 1448",
  },
  personnelEventReception: {
    src: "/media/personnel/personnel-event-reception.webp",
    alt: "A BSM detail drawn up across the stage at a wedding reception",
    label: "Personnel — event detail",
    brief: "Supplied by BSM. An event detail on duty.",
    ratio: "1600 / 1108",
  },
  personnelAviationDepot: {
    src: "/media/personnel/personnel-aviation-depot.webp",
    alt: "A BSM detail drawn up for inspection at an aviation fuel depot, a fuel tanker and a patrol vehicle behind them",
    label: "Personnel — aviation fuel depot",
    brief: "Supplied by BSM. A shift inspection at an aviation fuel depot.",
    ratio: "1289 / 689",
  },
  personnelEventHall: {
    src: "/media/personnel/personnel-event-hall.webp",
    alt: "A BSM detail in a function hall, costumed performers at either end of the line",
    label: "Personnel — function hall",
    brief: "Supplied by BSM. An event detail in a function hall.",
    ratio: "1046 / 898",
  },

  /* ---- Branch Office, Chimbel ------------------------------------------
     All four cropped 3:4 from the bottom. The frames run a long way up the
     panelling, so an uncropped one puts the desk in the last quarter and
     three metres of empty wall above it. */
  headOfficeExterior: {
    src: "/media/offices/head-office-exterior.webp",
    alt: "The Head Office frontage: the B.S.M. Security Services board above the shopfront, giving the DGR empanelment number",
    label: "Head Office — Aquem, Margao",
    brief: "Supplied by BSM. Aquem, Margao. Shown whole at the frame it was taken in.",
    ratio: "1297 / 1212",
  },
  branchOfficeExterior: {
    src: "/media/offices/branch-office-exterior.webp",
    alt: "The Branch Office from the road: BSM Security Agency's board on the wall beside the gate, giving the branch and head office addresses",
    label: "Branch Office — Chimbel, Panjim",
    brief: "Supplied by BSM. Kadamba Govt Housing Society, Chimbel, Panjim. The frame as it was taken — uncropped.",
    ratio: "720 / 1280",
  },
  branchOfficeCabin: {
    src: "/media/offices/branch-office-cabin.webp",
    alt: "Two members of the Branch Office team at the desk in the cabin, facing the camera",
    label: "Branch Office — the cabin",
    brief: "Supplied by BSM. Kadamba Govt Housing Society, Chimbel, Panjim.",
    ratio: "3 / 4",
  },
  branchOfficeDesk: {
    src: "/media/offices/branch-office-desk.webp",
    alt: "Paperwork and a laptop under way across the desk in the Branch Office cabin",
    label: "Branch Office — at the desk",
    brief: "Supplied by BSM. Kadamba Govt Housing Society, Chimbel, Panjim.",
    ratio: "3 / 4",
  },
  branchOfficeAdmin: {
    src: "/media/offices/branch-office-admin.webp",
    alt: "A member of the Branch Office administration team working at the desk",
    label: "Branch Office — administration",
    brief: "Supplied by BSM. Kadamba Govt Housing Society, Chimbel, Panjim.",
    ratio: "3 / 4",
  },
  branchOfficeManager: {
    src: "/media/offices/branch-office-manager.webp",
    alt: "Work under way at the laptop on the manager's side of the Branch Office desk",
    label: "Branch Office — the manager's desk",
    brief: "Supplied by BSM. Kadamba Govt Housing Society, Chimbel, Panjim.",
    ratio: "3 / 4",
  },
} satisfies Record<string, Shot>;

export type MediaKey = keyof typeof media;

/**
 * The BSM logo. The only image on the site that is genuinely BSM's own —
 * used at its native square proportions and never stretched or recoloured.
 */
export const logo = {
  src: "/brand/bsm-logo.webp",
  alt: "BSM Security logo",
  width: 720,
  height: 720,
} as const;
