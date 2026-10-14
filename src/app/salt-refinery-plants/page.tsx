import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import SiteIntro from "@/components/layout/SiteIntro";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";
import CompleteExecutionSection from "@/components/salt-refinery-plants/CompleteExecutionSection";
import MachineryShowcaseSection from "@/components/salt-refinery-plants/MachineryShowcaseSection";
import PlantConfigurationSection from "@/components/salt-refinery-plants/PlantConfigurationSection";
import RawSaltProcessStage from "@/components/salt-refinery-plants/RawSaltProcessStage";
import SaltRefineryHero from "@/components/salt-refinery-plants/SaltRefineryHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createPageMetadata } from "@/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "Salt Refinery Plants & Machinery",
  description: "Explore complete salt refinery plants, process systems and salt-processing machinery engineered for washing, centrifuging, drying, screening, grinding, storage and handling.",
  path: "/salt-refinery-plants",
});

export default function SaltRefineryPlantsPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <BreadcrumbJsonLd currentName="Salt Refinery Plants" currentPath="/salt-refinery-plants" />
      <SiteIntro force mobileOnly />
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main">
        <SaltRefineryHero />
        <RawSaltProcessStage />
        <CompleteExecutionSection />
        <PlantConfigurationSection />
        <MachineryShowcaseSection />
        <TrustedClientsSection standalone />
        <ProjectEnquirySection appearance="light" />
      </main>
    </>
  );
}
