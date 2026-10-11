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

export const metadata: Metadata = {
  title: "Industrial Machinery | S.K. Engineering Works",
  description: "Industrial machinery and process equipment engineered by S.K. Engineering Works for material handling, processing, air movement, screening and storage applications.",
};

export default function MachineryPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
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
