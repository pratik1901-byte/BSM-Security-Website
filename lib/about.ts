/**
 * About Us content.
 *
 * Supplied by BSM and reproduced verbatim — paragraphs, names, designations,
 * dates and the training list are not edited, shortened or added to here.
 * Presentation lives in app/about/page.tsx.
 */

/** Phrases given the brass treatment wherever the legacy copy is rendered. */
export const legacyMarks = [
  "DGR-sponsored security agency",
  "DGR-sponsored agency",
  "DGR sponsorship tenure",
  /* The whole sentence: longest-first ordering in <Marked> means it wins over
     the shorter DGR phrase inside it, rather than the two splitting it. */
  "Following the completion of its DGR sponsorship tenure upon attaining the prescribed age of 60 years, the agency transitioned into an independent private security agency under a Partnership Deed, with Mr. Dattatray B. Naik as the Principal Partner.",
  "with a focus on providing professional security services to reputed organisations",
  "Public Sector Undertakings (PSUs), government establishments and major industries",
] as const;

export const legacy = {
  heading: "Our Legacy & Experience",
  paragraphs: [
    "BSM Security Agency carries forward a strong legacy built on decades of industry experience, professional leadership and operational expertise. The agency was established and registered with the Directorate General Resettlement (DGR), Ministry of Defence, Government of India, as a DGR-sponsored security agency, with a focus on providing professional security services to reputed organisations, Public Sector Undertakings (PSUs), government establishments and major industries.",
    "During its tenure as a DGR-sponsored agency, BSM developed valuable operational experience through its association with reputed organisations and industrial establishments. Its journey has been shaped by disciplined operations, effective management and a commitment to maintaining high standards of security and professionalism.",
    "Following the completion of its DGR sponsorship tenure upon attaining the prescribed age of 60 years, the agency transitioned into an independent private security agency under a Partnership Deed, with Mr. Dattatray B. Naik as the Principal Partner. Building on its established foundation and extensive industry experience, BSM continues to deliver dependable security services guided by the principles of discipline, integrity, vigilance and professional commitment.",
  ],
};

export const leadershipIntro = {
  heading: "Our Leadership & Management",
  body: "At BSM Security Agency, our strength lies in experienced leadership, professional management and a commitment to maintaining the highest standards of security and discipline. Our leadership brings together extensive security industry experience and distinguished military service, providing a strong foundation for effective operations, personnel management and professional training.",
};

export type LeaderProfile = {
  id: string;
  index: string;
  name: string;
  designation: string;
  paragraphs: string[];
  /** Intro line that precedes the focus list, when there is one. */
  listIntro?: string;
  list?: string[];
  /** Closing paragraph that follows the list. */
  closing?: string;
  /** Phrases within this profile that carry the brass treatment. */
  marks?: readonly string[];
};

export const leaders: LeaderProfile[] = [
  {
    id: "dattatray-b-naik",
    index: "01",
    name: "MR. DATTATRAY B. NAIK",
    designation: "Principal Partner – Security Operations & Management",
    paragraphs: [
      "With over three decades of experience in the security industry, Mr. Dattatray B. Naik has been associated with security operations and agency management since 1996. His extensive professional experience encompasses the establishment, administration and management of security agencies, industrial security operations and large-scale deployment of security personnel.",
      "Throughout his career, he has been actively involved in the establishment, management and operations of D.B Security Consultation Agency and Outsource Services, alongside BSM Security Agency and Hansa Security Agency. He has also provided professional consultancy services to several security agencies, including CNP Security Agency, TA Security Agency, AG Security Agency and AC Security Agency. His professional journey has provided him with substantial exposure to managing security operations for major corporate establishments, industrial facilities and Public Sector Undertakings (PSUs).",
      "As the Principal Partner of BSM Security Agency, he oversees security operations, organisational management and service delivery. His practical industry knowledge, operational expertise and leadership capabilities play a vital role in strengthening the agency’s operational standards and ensuring dependable security services.",
    ],
    marks: [
      "Mr. Dattatray B. Naik has been associated with security operations and agency management since 1996.",
      // Three runs rather than one, so the sentence about consultancy work
      // marks its own agencies. "BSM Security Agency" is deliberately not a
      // mark on its own: it appears again in the closing paragraph, which
      // should stay unmarked.
      "D.B Security Consultation Agency and Outsource Services",
      "BSM Security Agency and Hansa Security Agency",
      "CNP Security Agency, TA Security Agency, AG Security Agency and AC Security Agency",
    ],
  },
  {
    id: "bhupinder-singh-malhi",
    index: "02",
    name: "LT. COL. BHUPINDER SINGH MALHI (RETD.)",
    designation: "Partner – Military Discipline & Training",
    paragraphs: [
      "Bringing distinguished military experience and professional leadership to BSM Security Agency, Lt. Col. Bhupinder Singh Malhi (Retd.) served the Indian Army for 28 years and retired with the distinguished rank of Lieutenant Colonel.",
      "His extensive service in the Indian Army has equipped him with valuable experience in leadership, personnel management, operational planning, discipline and organisational administration. His military background contributes significantly to strengthening the agency’s training standards, professional conduct and operational preparedness.",
    ],
    listIntro:
      "As Partner – Military Discipline & Training, he provides professional guidance and oversees the training and development of security personnel, with particular emphasis on:",
    list: [
      "Military discipline, conduct and professional standards.",
      "Security protocols and operational preparedness.",
      "Industrial security and access control procedures.",
      "Emergency response and crisis management.",
      "Vigilance, patrolling and surveillance techniques.",
      "Fire safety awareness and evacuation procedures.",
      "Supervisory skills and effective personnel management.",
      "Behavioural training, situational awareness and threat response.",
    ],
    closing:
      "Through his guidance and military-inspired training approach, BSM aims to develop security personnel who demonstrate discipline, alertness, confidence, responsibility and professionalism in carrying out their duties.",
    marks: [
      "Lt. Col. Bhupinder Singh Malhi (Retd.) served the Indian Army for 28 years and retired with the distinguished rank of Lieutenant Colonel",
    ],
  },
  {
    id: "bhagyashree-dattatray-naik",
    index: "03",
    name: "MRS. BHAGYASHREE DATTATRAY NAIK",
    designation: "Partner – Administration & Accounts",
    paragraphs: [
      "Mrs. Bhagyashree Dattatray Naik plays an important role in the administrative and financial management of BSM Security Agency. She is responsible for overseeing administrative functions, accounts management, financial records and organisational coordination, ensuring smooth and efficient day-to-day operations.",
      "Her responsibilities include maintaining financial documentation, managing accounts and payment records, coordinating administrative activities, monitoring routine financial transactions and supporting the organisation’s internal management processes.",
      "Her systematic approach, attention to detail and commitment to organisational efficiency contribute to effective administration, financial discipline and the smooth functioning of BSM Security Agency.",
    ],
    marks: ["administrative and financial management of BSM Security Agency"],
  },
];

export const commitment = {
  heading: "Our Commitment",
  paragraphs: [
    "At BSM Security Agency, we believe that effective security is built on experience, discipline, vigilance and responsibility.",
    "We are committed to safeguarding people, property, infrastructure and business operations through reliable security services, professional supervision and a high standard of operational discipline.",
  ],
};

export const brandStatement = {
  name: "BSM SECURITY AGENCY",
  line: "Experience You Can Trust. Discipline You Can Rely On.",
};
