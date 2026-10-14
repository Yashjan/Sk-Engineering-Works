import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsFieldArchive from "@/components/projects/ProjectsFieldArchive";
import ProjectsVisualGallery from "@/components/projects/ProjectsVisualGallery";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createPageMetadata } from "@/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "Industrial & Salt Refinery Projects",
  description: "Explore real S.K. Engineering Works projects across salt refinery plants, machinery, material handling and industrial equipment in Rajasthan and Gujarat.",
  path: "/projects",
});

export default function ProjectsPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <BreadcrumbJsonLd currentName="Projects" currentPath="/projects" />
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
