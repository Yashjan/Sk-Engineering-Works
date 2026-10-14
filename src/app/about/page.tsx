import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import AboutPageExperience from "@/components/about/AboutPageExperience";
import Navbar from "@/components/layout/Navbar";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createPageMetadata } from "@/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "About S.K. Engineering Works | Engineering Since the 1990s",
  description: "Discover the journey of S.K. Engineering Works from mechanical fabrication and agricultural equipment to industrial machinery and complete salt refinery systems.",
  path: "/about",
});

export default function AboutPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <BreadcrumbJsonLd currentName="About" currentPath="/about" />
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
