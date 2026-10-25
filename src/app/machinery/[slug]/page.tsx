import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ScrewConveyorExperience from "@/components/machinery/screw-conveyor/ScrewConveyorExperience";
import { screwConveyorModelUrl } from "@/components/machinery/screw-conveyor/screw-conveyor-assets";
import { getMachineBySlug, machineryCatalog } from "@/data/machinery";
import { createPageMetadata } from "@/config/site";
import "./machine-detail-shell.css";

type MachinePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return machineryCatalog.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: MachinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const machine = getMachineBySlug(slug);
  if (slug === "screw-conveyor") {
    return createPageMetadata({
      title: "Screw Conveyor",
      description: "Industrial screw conveyor for controlled material transfer, manufactured by S.K. Engineering Works.",
      path: "/machinery/screw-conveyor",
    });
  }
  return createPageMetadata({
    title: machine ? machine.name : "Machinery",
    description: machine
      ? `${machine.name} by S.K. Engineering Works. This machinery detail page is under development.`
      : "Industrial machinery by S.K. Engineering Works.",
    path: `/machinery/${slug}`,
    index: false,
  });
}

export default async function MachinePage({ params }: MachinePageProps) {
  const machine = getMachineBySlug((await params).slug);
  if (!machine) notFound();

  if (machine.slug === "screw-conveyor") {
    const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));
    return (
      <>
        <link
          rel="preload"
          href={screwConveyorModelUrl}
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar hasLogo={hasLogo} />
        <main id="main" className="screw-machine-detail">
          <ScrewConveyorExperience />
        </main>
      </>
    );
  }

  return (
    <main className="machine-detail-shell">
      <p>{machine.number} / {machine.category.replaceAll("-", " ")}</p>
      <h1>{machine.name}</h1>
      <span>MACHINE EXPERIENCE COMING NEXT</span>
      <Link href={`/machinery#${machine.categorySlug}`}>BACK TO MACHINERY <b aria-hidden="true">&rarr;</b></Link>
    </main>
  );
}
