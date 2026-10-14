import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import MachineryHero from "@/components/machinery/MachineryHero";
import MaterialHandlingTheatre from "@/components/machinery/MaterialHandlingTheatre";
import MillingTheatre from "@/components/machinery/MillingTheatre";
import AirDustTheatre from "@/components/machinery/AirDustTheatre";
import ScreeningTheatre from "@/components/machinery/ScreeningTheatre";
import StorageTheatre from "@/components/machinery/StorageTheatre";
import ManufacturingProof from "@/components/machinery/ManufacturingProof";
import CompletePlantBridge from "@/components/machinery/CompletePlantBridge";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import GlobalMachinerySearch from "@/components/machinery/GlobalMachinerySearch";
import { MachineryDirectory } from "@/components/machinery/MachineryDirectory";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createPageMetadata } from "@/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "Industrial Machinery & Process Equipment",
  description: "Explore industrial machinery for material handling, milling, air and dust handling, screening, separation and process applications from S.K. Engineering Works.",
  path: "/machinery",
});

export default function MachineryPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <BreadcrumbJsonLd currentName="Machinery" currentPath="/machinery" />
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main">
        <MachineryHero />
        <MachineryDirectory>
          <GlobalMachinerySearch />
          <MaterialHandlingTheatre />
          <MillingTheatre />
          <AirDustTheatre />
          <ScreeningTheatre />
          <StorageTheatre />
        </MachineryDirectory>
        <ManufacturingProof />
        <CompletePlantBridge />
        <TrustedClientsSection standalone sectionNumber="09" />
        <ProjectEnquirySection appearance="light" sectionNumber="10" showNavigation />
      </main>
    </>
  );
}
