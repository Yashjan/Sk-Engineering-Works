import Link from "next/link";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import ScrewConveyorFabricationGallery from "./ScrewConveyorFabricationGallery";
import { processStages } from "@/data/process";
import "./screw-conveyor-closing.css";

const plantStages = processStages.slice(0, processStages.findIndex((stage) => stage.id === "pin-mill") + 1);

export default function ScrewConveyorClosing() {
  return <>
    <ScrewConveyorFabricationGallery />

    <section className="conveyor-system conveyor-closing-section" aria-labelledby="conveyor-system-title">
      <div className="conveyor-closing-meta"><span>10 / COMPLETE PLANT</span><span>ONE MACHINE / CONNECTED PROCESS</span></div>
      <div className="conveyor-system-heading"><p>THIS IS ONE MACHINE.</p><h2 id="conveyor-system-title">WE ENGINEER<br />THE COMPLETE PROCESS.</h2><span>A screw conveyor connects material transfer to the wider salt refinery process.</span></div>
      <ol className="conveyor-system-flow" aria-label="Salt refinery process sequence">
        {plantStages.map((stage, index) => <li key={stage.id} className={stage.id === "screw-conveyor" ? "is-current" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage.name}</strong>{stage.id === "screw-conveyor" && <small>THIS MACHINE</small>}</li>)}
      </ol>
      <Link className="conveyor-closing-link" href="/salt-refinery-plants">EXPLORE COMPLETE SALT REFINERY PLANTS <span aria-hidden="true">→</span></Link>
    </section>

    <section className="conveyor-engineering conveyor-closing-section" aria-labelledby="conveyor-engineering-title">
      <div className="conveyor-closing-meta"><span>11 / ENGINEERING</span><span>PLAN / ARRANGE / INTEGRATE</span></div>
      <div className="conveyor-engineering-grid"><div><h2 id="conveyor-engineering-title">BEFORE WE<br />FABRICATE,<br /><span>WE ENGINEER.</span></h2><p>Equipment is planned around the complete process, available space and site conditions.</p></div>
        {/* A verified project drawing can replace this neutral typographic register. */}
        <div className="conveyor-engineering-register"><p>ENGINEERING / CAPABILITIES</p><ol>{["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"].map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><span aria-hidden="true">↗</span></li>)}</ol><small>PLANT ENGINEERING / S.K. ENGINEERING WORKS</small></div>
      </div>
    </section>

    <TrustedClientsSection standalone sectionNumber="12" />
    <ProjectEnquirySection appearance="light" sectionNumber="13" showNavigation />
  </>;
}
