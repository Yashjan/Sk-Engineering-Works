import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import SiteIntro from "@/components/layout/SiteIntro";
import CompleteExecutionSection from "@/components/salt-refinery-plants/CompleteExecutionSection";
import RawSaltProcessStage from "@/components/salt-refinery-plants/RawSaltProcessStage";
import SaltRefineryHero from "@/components/salt-refinery-plants/SaltRefineryHero";

export const metadata: Metadata = {
  title: "Salt Refinery Plants | S.K. Engineering Works",
  description: "Salt refinery plant engineering, machinery fabrication and installation by S.K. Engineering Works for salt manufacturers in Rajasthan, Gujarat and beyond.",
};

export default function SaltRefineryPlantsPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <SiteIntro force mobileOnly />
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main">
        <SaltRefineryHero />
        <RawSaltProcessStage />
        <CompleteExecutionSection />
      </main>
    </>
  );
}
