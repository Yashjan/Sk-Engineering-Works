import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import SiteIntro from "@/components/layout/SiteIntro";
import Hero from "@/components/home/Hero";
import ProcessJourney from "@/components/home/ProcessJourney";
import MachineryGateway from "@/components/home/MachineryGateway";
import ProjectsSection from "@/components/home/ProjectsSection";
import ManufacturingSection from "@/components/home/ManufacturingSection";
import AboutCredibilitySection from "@/components/home/AboutCredibilitySection";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import { processStages } from "@/data/process";
import { projects } from "@/data/projects";
import { assetPath } from "@/lib/asset-path";

export default function Home() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));
  const hasHeroImage = existsSync(path.join(process.cwd(), "public/images/Golden Hour Salt Processing Plant.png"));
  const stages = processStages.map((stage) => ({
    ...stage,
    hasImage: existsSync(path.join(process.cwd(), "public", stage.image)),
    image: assetPath(stage.image),
  }));
  const projectRecords = projects.map((project) => ({
    ...project,
    hasImage: existsSync(path.join(process.cwd(), "public", project.coverImage)),
    coverImage: assetPath(project.coverImage),
    media: project.media.map((item) => ({ ...item, src: assetPath(item.src) })),
  }));
  return <><SiteIntro /><a className="skip-link" href="#main">Skip to content</a><Navbar hasLogo={hasLogo} /><main id="main"><Hero hasImage={hasHeroImage} /><ProcessJourney stages={stages} /><MachineryGateway /><ProjectsSection projects={projectRecords} /><ManufacturingSection /><AboutCredibilitySection /><ProjectEnquirySection /></main></>;
}
