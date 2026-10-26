import type { CSSProperties, ReactNode } from "react";
import { interactiveExperiences } from "./interactive-experiences";
import MachineryMedia from "./MachineryMedia";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import SiteFooter from "@/components/layout/SiteFooter";
import Navbar from "@/components/layout/Navbar";
import type { MachineryConfig } from "@/data/machinery-details";
import { MachineryProcessIntegration, MachineryEngineering } from "./MachineryPlantSections";
import { MachineryComingSoon3D, MachineryCustomization, MachineryFabrication } from "./MachinerySections";
import MachineryEnquiry from "./MachineryEnquiry";
import "./machinery-detail.css";

export default async function MachineryDetailPage({ machine }: { machine: MachineryConfig }) {
  let content: ReactNode;
  const presentationCopy = machine.description === machine.identity.copy ? machine.tagline : machine.description;
  const adapter = machine.has3D ? interactiveExperiences[machine.interactiveExperience] : undefined;
  if (machine.has3D && !adapter) throw new Error(`Unregistered machine experience: ${machine.interactiveExperience}`);
  const interactive = adapter ? await adapter.render() : null;
  if (adapter?.layout === "full-page") {
    content = interactive;
  } else {
    content = <>
      <section className="machine-detail-hero" aria-labelledby="machine-title" style={{ "--machine-title-word-length": Math.max(...machine.name.split(/\s+/).map((word) => word.length)) } as CSSProperties}>
        <div><p className="machine-eyebrow">01 / PROCESS MACHINERY</p><h1 id="machine-title">{machine.name.toUpperCase()}</h1><p>{machine.tagline}</p><div className="machine-hero-actions"><a className="machine-action" href="#machine-enquiry">DISCUSS YOUR REQUIREMENT →</a><Link href="/salt-refinery-plants">VIEW COMPLETE PLANT ↗</Link></div></div>
        <div className="machine-hero-visual"><MachineryMedia media={machine.hero} machineName={machine.name} priority sizes="(max-width: 767px) 88vw, 52vw" /><span>ENGINEERED / FABRICATED / INTEGRATED</span></div>
      </section>
      <section className="machine-section machine-identity" aria-labelledby="machine-identity-title"><p className="machine-eyebrow">02 / WHAT IT DOES</p><div><h2 id="machine-identity-title">{machine.identity.title}</h2><p>{machine.identity.copy}</p></div></section>
      <section className="machine-section machine-presentation" aria-labelledby="machine-presentation-title"><p className="machine-eyebrow">03 / MACHINE PRESENTATION</p><h2 id="machine-presentation-title">BUILT FOR THE<br />PROCESS LINE.</h2><div className="machine-presentation-image"><MachineryMedia media={machine.hero} machineName={machine.name} sizes="88vw" /></div><p>{presentationCopy}</p></section>
      {adapter ? interactive : <MachineryComingSoon3D machine={machine} />}
      <section className="machine-section" aria-labelledby="machine-components-title"><p className="machine-eyebrow">05 / MACHINE CONSTRUCTION</p><h2 id="machine-components-title">THE MACHINE,<br />PART BY PART.</h2><ol className="machine-construction">{machine.components.map((item, index) => <li key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol></section>
      <section className="machine-section machine-how" aria-labelledby="machine-how-title"><p className="machine-eyebrow">06 / HOW IT WORKS</p><h2 id="machine-how-title">A CONTINUOUS<br />PROCESS.</h2><ol style={{ "--machine-how-steps": machine.howItWorks.length } as CSSProperties}>{machine.howItWorks.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></section>
      <MachineryCustomization machine={machine} />
      <MachineryFabrication machine={machine} />
      <MachineryProcessIntegration config={machine} />
      <MachineryEngineering config={machine} />
      <MachineryEnquiry {...machine.enquiry} />
      <SiteFooter />
    </>;
  }
  return <><a className="skip-link" href="#main">Skip to content</a><Navbar hasLogo={existsSync(path.join(process.cwd(), "public/images/sk-logo.png"))} /><main id="main" className={adapter?.layout === "full-page" ? "screw-machine-detail" : "machinery-detail-page"}>{content}</main></>;
}
