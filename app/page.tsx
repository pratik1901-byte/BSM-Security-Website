import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import ClientMarquee from "@/components/sections/ClientMarquee";
import Statement from "@/components/sections/Statement";
import CoreStrengths from "@/components/sections/CoreStrengths";
import VisionMission from "@/components/sections/VisionMission";
import ServicesOverview from "@/components/sections/ServicesOverview";
import CallToAction from "@/components/sections/CallToAction";
import RevealEngine from "@/components/layout/RevealEngine";
import { JsonLd, websiteSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/",
  absoluteTitle: true,
  title: "BSM Security Agency, Goa — Security Guards & Security Services in Goa",
  description:
    /* 149 characters. Google shows about 155 on a desktop result and cuts
       the rest, so the sentence is kept inside that: at BSM's own fuller
       wording it broke mid-clause and lost "since 2026" — the part the
       line exists to say. */
    "BSM Security Agency was DGR-empanelled, Ministry of Defence, from 2013 to 2025 and has operated as an independent private security agency since 2026.",
  keywords: [
    "private security services",
    "security guard services Goa",
    "industrial security Goa",
    "corporate security Goa",
    "event security Goa",
    "bouncer services Goa",
    "PSU security services",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteSchema} />
      <Hero />
      <ClientMarquee />
      <Statement />
      <CoreStrengths />
      <VisionMission />
      <ServicesOverview />
      <CallToAction />
      <RevealEngine />
    </>
  );
}
