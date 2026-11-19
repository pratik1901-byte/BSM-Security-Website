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
    "BSM Security Agency, established in 2013 as a DGR-sponsored agency, provides trained security guards and managed security services across Goa — for PSUs, government and defence establishments, industry, banks, hotels, residential societies and events. Head Office in Margao, branch in Panjim. Available 24 × 7.",
  keywords: [
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
