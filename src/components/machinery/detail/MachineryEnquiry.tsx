"use client";
import { useState, type FormEvent } from "react";
import { companyContact, whatsappUrl } from "@/data/contact";
import type { MachineryConfig } from "@/data/machinery-details/types";
export default function MachineryEnquiry({ machineName, sectionNumber = "11", heading, description }: MachineryConfig["enquiry"]) {
  const [draft, setDraft] = useState<string | null>(null);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = ["Name", "Phone / WhatsApp", "Company", "Location", "Capacity / TPH", "Material", "Requirement"]
      .map((key) => `${key}: ${String(data.get(key) || "Not specified").trim()}`);
    lines.unshift(`Machine: ${machineName}`);
    setDraft(whatsappUrl(`Hello S.K. Engineering Works,\nI would like to discuss a ${machineName} requirement.\n\n${lines.join("\n")}`));
  }
  return <section className="machine-enquiry machine-section" id="machine-enquiry" aria-labelledby="machine-enquiry-title">
    <p className="machine-eyebrow">{sectionNumber} / PROJECT ENQUIRY</p>
    <h2 id="machine-enquiry-title">{heading ? <>{heading.firstLine}<br />{heading.secondLine}</> : <>LET’S ENGINEER<br />YOUR {machineName.toUpperCase()}.</>}</h2>
    <div className="machine-enquiry-grid"><div><p>{description ?? "Tell us about your process and the equipment you need."}</p>
      <a className="machine-action" href={whatsappUrl(`Hello S.K. Engineering Works, I would like to discuss a ${machineName} requirement.`)} target="_blank" rel="noopener noreferrer">DISCUSS ON WHATSAPP ↗</a>
      <a className="machine-phone" href={companyContact.phoneHref}>{companyContact.phoneDisplay}</a>
    </div><form onSubmit={prepare} onChange={() => setDraft(null)}>
      <label className="machine-field-wide">Machine<input value={machineName} readOnly name="Machine" /></label>
      {["Name", "Phone / WhatsApp", "Company", "Location", "Capacity / TPH", "Material"].map((label) => <label key={label}>{label}{label === "Name" || label === "Phone / WhatsApp" ? " (required)" : ""}<input name={label} required={label === "Name" || label === "Phone / WhatsApp"} type={label === "Phone / WhatsApp" ? "tel" : "text"} autoComplete={label === "Name" ? "name" : label === "Phone / WhatsApp" ? "tel" : label === "Company" ? "organization" : undefined} /></label>)}
      <label className="machine-field-wide">Requirement<textarea name="Requirement" rows={3} /></label>
      <button className="machine-action" type="submit">PREPARE ENQUIRY →</button>
      {draft && <a className="machine-action" href={draft} target="_blank" rel="noopener noreferrer">OPEN WHATSAPP WITH DETAILS ↗</a>}
      <small className="machine-field-wide">Your details open as a WhatsApp draft. You choose when to send.</small>
    </form></div>
  </section>;
}
