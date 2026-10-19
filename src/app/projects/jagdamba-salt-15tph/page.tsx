import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import JagdambaProjectHero from "@/components/projects/JagdambaProjectHero";
import ProjectMediaStory from "@/components/projects/ProjectMediaStory";
import ProjectOverview from "@/components/projects/ProjectOverview";
import ProjectChallenges from "@/components/projects/ProjectChallenges";
import ProjectEngineeringApproach from "@/components/projects/ProjectEngineeringApproach";
import ProjectPlantSystem from "@/components/projects/ProjectPlantSystem";
import ProjectExecutionJourney from "@/components/projects/ProjectExecutionJourney";
import { jagdambaProjectChallenges } from "@/data/project-challenges";
import { engineeringExecutionStages } from "@/data/engineering-approach";
import { jagdambaPlantLayout, jagdambaPlantSystem } from "@/data/project-plant-system";
import { jagdambaExecutionStages } from "@/data/project-execution";
import { createPageMetadata } from "@/config/site";
import "./project-detail-shell.css";

export const metadata: Metadata = createPageMetadata({
  title: "Jagdamba Salt 15 TPH Refinery",
  description: "Jagdamba Salt Pvt. Ltd. 15 TPH salt refinery project in Phalodi, Rajasthan.",
  path: "/projects/jagdamba-salt-15tph",
  image: "/images/projects/jagdamba/hero/jagdamba-cover-1600.webp",
  index: false,
});

export default function JagdambaProjectPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main" className="project-detail-shell">
        <JagdambaProjectHero />
        <ProjectOverview
          recordNumber="001"
          client="JAGDAMBA SALT PVT. LTD."
          location="PHALODI, RAJASTHAN"
          capacity="15 TPH"
          projectType="SALT REFINERY"
          statement={["A 15 TPH", "SALT REFINERY", "FOR JAGDAMBA SALT."]}
          summary="A 15 TPH salt refinery project for Jagdamba Salt Pvt. Ltd. in Phalodi, Rajasthan, forming part of S.K. Engineering Works' salt refinery project portfolio."
        />
        <ProjectMediaStory />
        <ProjectChallenges
          sectionNumber="04"
          heading={["EVERY SITE", "SETS ITS OWN", "CONSTRAINTS."]}
          intro="Industrial plant projects often require engineering decisions to respond to real site conditions, equipment integration and execution constraints."
          items={jagdambaProjectChallenges}
        />
        <ProjectEngineeringApproach
          sectionNumber="05"
          heading={["FROM PLAN", "TO PLANT."]}
          intro="A general execution framework for salt refinery projects, from equipment planning to coordinated installation."
          stages={engineeringExecutionStages}
        />
        <ProjectPlantSystem
          sectionNumber="06"
          heading={["ONE PROCESS.", "MULTIPLE CONNECTED", "MACHINES."]}
          intro="Each stage performs a specific role in refining raw salt into a finished product. Material handling, wet processing, drying, screening, grinding and air management are integrated into one continuous system."
          system={jagdambaPlantSystem}
          layout={jagdambaPlantLayout}
        />
        <ProjectExecutionJourney
          sectionNumber="07"
          heading={["FROM", "FABRICATION", "TO INSTALLATION."]}
          intro="A field record of fabrication and site execution using verified media from the Jagdamba Salt refinery project."
          stages={jagdambaExecutionStages}
        />
      </main>
    </>
  );
}
