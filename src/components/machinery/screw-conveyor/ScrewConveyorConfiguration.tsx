"use client";

export const conveyorParameters = [
  { title: "CUSTOM LENGTH", description: "Designed to suit plant layout and material transfer distance.", marker: "LENGTH" },
  { title: "SCREW DIAMETER", description: "Selected according to required material flow and application.", marker: "DIAMETER" },
  { title: "CAPACITY / TPH", description: "Engineered according to required process capacity.", marker: "PROCESS CAPACITY" },
  { title: "MATERIAL OF CONSTRUCTION", description: "MS / SS construction available according to application requirements.", marker: "MS / SS" },
  { title: "INLET CONFIGURATION", description: "Position and arrangement can be adapted to upstream equipment.", marker: "INLET" },
  { title: "DISCHARGE CONFIGURATION", description: "Configured to connect with downstream process equipment.", marker: "DISCHARGE" },
  { title: "MOTOR & GEARBOX", description: "Selected to suit conveyor duty and process requirement.", marker: "DRIVE SELECTION" },
  { title: "SUPPORT ARRANGEMENT", description: "Designed around installation height and site conditions.", marker: "SUPPORT / FRAME" },
  { title: "PLANT-SPECIFIC INTEGRATION", description: "Designed to work as part of the complete process line.", marker: "PROCESS CONNECTION" },
] as const;

export default function ScrewConveyorConfiguration({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const parameter = conveyorParameters[active];
  return <section className="conveyor-config" aria-labelledby="conveyor-config-title">
    <header className="conveyor-config-header">
      <p>08 / CONFIGURATION</p>
      <h2 id="conveyor-config-title">BUILT FOR<br />YOUR REQUIREMENT.</h2>
      <span>Every conveyor is engineered around your process, capacity and plant layout.</span>
    </header>
    <div className="conveyor-config-marker" aria-hidden="true"><span>{parameter.marker}</span><i /></div>
    <div className="conveyor-config-bottom">
      <div className="conveyor-config-copy" aria-live="polite"><p>{String(active + 1).padStart(2, "0")} / 09 <span>ENGINEERING PARAMETER</span></p><h3>{parameter.title}</h3><p>{parameter.description}</p></div>
      <nav className="conveyor-config-nav" aria-label="Conveyor configuration parameters">
        {conveyorParameters.map((item, index) => <button key={item.title} type="button" aria-label={`${String(index + 1).padStart(2, "0")} ${item.title}`} aria-pressed={active === index} onClick={() => onSelect(index)}>{String(index + 1).padStart(2, "0")}</button>)}
      </nav>
    </div>
  </section>;
}
