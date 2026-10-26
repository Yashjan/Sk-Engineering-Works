import Link from "next/link";
import { processStages } from "@/data/process";
import type { MachineryConfig } from "@/data/machinery-details";
import "../screw-conveyor/screw-conveyor-closing.css";
export function MachineryProcessIntegration({ config }: { config: MachineryConfig }) {
  const plantStages = processStages;
  const inMainProcess = plantStages.some((stage) => stage.id === config.process.stageId);
  return <>    <section className="conveyor-system conveyor-closing-section" aria-labelledby="conveyor-system-title">
      <div className="conveyor-closing-meta"><span>{config.process.sectionNumber} / COMPLETE PLANT</span><span>ONE MACHINE / CONNECTED PROCESS</span></div>
      <div className="conveyor-system-heading"><p>THIS IS ONE MACHINE.</p><h2 id="conveyor-system-title">WE ENGINEER<br />THE COMPLETE PROCESS.</h2><span>{config.process.description}</span></div>
      <ol className="conveyor-system-flow" aria-label="Salt refinery process sequence">
        {plantStages.map((stage, index) => <li key={stage.id} className={stage.id === config.process.stageId ? "is-current" : undefined} aria-current={stage.id === config.process.stageId ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage.name}</strong>{stage.id === config.process.stageId && <small>THIS MACHINE</small>}</li>)}
      </ol>
      {!inMainProcess && <p className="machine-process-support"><strong>{config.name.toUpperCase()} / SUPPORTING EQUIPMENT</strong><br />{config.process.description}</p>}
      <Link className="conveyor-closing-link" href="/salt-refinery-plants">EXPLORE COMPLETE SALT REFINERY PLANTS <span aria-hidden="true">→</span></Link>
    </section>

</>;
}
export function MachineryEngineering({ config }: { config: MachineryConfig }) {
  return <>    <section className="conveyor-engineering conveyor-closing-section" aria-labelledby="conveyor-engineering-title">
      <div className="conveyor-closing-meta"><span>{config.engineering.sectionNumber} / ENGINEERING</span><span>PLAN / ARRANGE / INTEGRATE</span></div>
      <div className="conveyor-engineering-grid"><div><h2 id="conveyor-engineering-title">BEFORE WE<br />FABRICATE,<br /><span>WE ENGINEER.</span></h2><p>{config.engineering.description}</p></div>
        {/* A verified project drawing can replace this neutral typographic register. */}
        <div className="conveyor-engineering-register"><p>ENGINEERING / CAPABILITIES</p><ol>{config.engineering.capabilities.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><span aria-hidden="true">↗</span></li>)}</ol><small>PLANT ENGINEERING / S.K. ENGINEERING WORKS</small></div>
      </div>
    </section>

</>;
}
