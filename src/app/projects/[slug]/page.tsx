import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import { projectArchive } from "@/data/projects";
import { createPageMetadata } from "@/config/site";
import "./project-placeholder.css";

type ProjectPlaceholderPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projectArchive.filter((project) => !project.isFeatured).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPlaceholderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectArchive.find((item) => !item.isFeatured && item.slug === slug);

  return createPageMetadata({
    title: project ? `${project.name} | Projects` : "Project",
    description: project
      ? `${project.name}${project.location ? `, ${project.location}` : ""}. Project case study coming next.`
      : "S.K. Engineering Works project case study.",
    path: `/projects/${slug}`,
    index: false,
  });
}

export default async function ProjectPlaceholderPage({ params }: ProjectPlaceholderPageProps) {
  const { slug } = await params;
  const projectIndex = projectArchive.findIndex((item) => !item.isFeatured && item.slug === slug);
  const project = projectArchive[projectIndex];

  if (!project) notFound();

  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));
  const field = String(projectIndex + 1).padStart(3, "0");

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main" className="project-placeholder">
        <section className="project-placeholder-shell" aria-labelledby="project-placeholder-title">
          <p className="project-placeholder-field">FIELD / {field}</p>
          <div className="project-placeholder-main">
            <h1 id="project-placeholder-title">{project.name}</h1>
            <div className="project-placeholder-copy">
              <p>PROJECT CASE STUDY<br />COMING NEXT.</p>
              {project.location && <span>{project.location}</span>}
              <Link href="/projects">BACK TO PROJECTS <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
