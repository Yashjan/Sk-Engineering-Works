import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import AboutPageExperience from "@/components/about/AboutPageExperience";
import Navbar from "@/components/layout/Navbar";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";

export const metadata: Metadata = {
  title: "About | S.K. Engineering Works",
  description: "The S.K. Engineering Works journey from mechanical fabrication and agricultural machinery to material handling, industrial equipment and complete salt refinery plants.",
};

export default function AboutPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main">
        <AboutPageExperience />
        <TrustedClientsSection standalone sectionNumber="08" />
        <ProjectEnquirySection appearance="light" sectionNumber="09" showNavigation />
      </main>
    </>
  );
}
