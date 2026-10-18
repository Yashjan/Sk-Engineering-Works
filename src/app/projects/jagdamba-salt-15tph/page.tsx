import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import JagdambaProjectHero from "@/components/projects/JagdambaProjectHero";
import ProjectMediaStory from "@/components/projects/ProjectMediaStory";
import ProjectOverview from "@/components/projects/ProjectOverview";
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
      </main>
    </>
  );
}
