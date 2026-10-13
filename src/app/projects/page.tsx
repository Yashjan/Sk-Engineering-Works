import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsFieldArchive from "@/components/projects/ProjectsFieldArchive";
import ProjectsVisualGallery from "@/components/projects/ProjectsVisualGallery";

export const metadata: Metadata = {
  title: "Projects | S.K. Engineering Works",
  description: "Real salt refinery projects, industrial equipment and on-site execution by S.K. Engineering Works.",
};

export default function ProjectsPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main">
        <ProjectsHero />
        <ProjectsFieldArchive />
        <ProjectsVisualGallery />
        <TrustedClientsSection standalone sectionNumber="04" />
        <ProjectEnquirySection sectionNumber="05" showNavigation />
      </main>
    </>
  );
}
