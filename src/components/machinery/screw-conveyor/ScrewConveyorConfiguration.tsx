"use client";
/** @jsxImportSource @/i18n/react */

export const conveyorParameters = [
  { title: "CUSTOM LENGTH", description: "Length and route are planned between the actual feed and discharge points.", marker: "LENGTH" },
  { title: "SCREW DIAMETER", description: "Diameter and flight geometry are selected with the material and required flow.", marker: "DIAMETER" },
  { title: "CAPACITY / TPH", description: "Assessment uses material condition, bulk density, particle size, required TPH and duty.", marker: "PROCESS CAPACITY" },
  { title: "MATERIAL OF CONSTRUCTION", description: "Material and surface protection are reviewed for corrosion, wear and cleaning needs.", marker: "MATERIAL" },
  { title: "INLET CONFIGURATION", description: "The inlet is coordinated with the hopper or upstream equipment feeding the conveyor.", marker: "INLET" },
  { title: "DISCHARGE CONFIGURATION", description: "The outlet position and level are coordinated with the downstream equipment.", marker: "DISCHARGE" },
  { title: "MOTOR & GEARBOX", description: "Drive and operating speed are selected around the conveying load and duty.", marker: "DRIVE SELECTION" },
  { title: "SUPPORT ARRANGEMENT", description: "Supports and service clearances are planned around site levels and access.", marker: "SUPPORT / FRAME" },
  { title: "PLANT-SPECIFIC INTEGRATION", description: "Connections, clearances and access are coordinated with the complete process layout.", marker: "PROCESS CONNECTION" },
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
