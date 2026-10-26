"use client";

import { useState, type FormEvent } from "react";
import { companyContact, whatsappUrl } from "@/data/contact";

export default function EngineeringEnquiry() {
  const [draft, setDraft] = useState<string | null>(null);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const phone = form.elements.namedItem("phone") as HTMLInputElement;
    const requirement = form.elements.namedItem("requirement") as HTMLTextAreaElement;
    name.setCustomValidity(value("name") ? "" : "Please enter your name.");
    phone.setCustomValidity(value("phone").replace(/\D/g, "").length >= 7 ? "" : "Please enter a valid phone number.");
    requirement.setCustomValidity(value("requirement") ? "" : "Please describe your requirement.");
    if (!form.reportValidity()) return;
    const lines = ["Hello S.K. Engineering Works,", "I would like to discuss an engineering / plant requirement.", "", `Name: ${value("name")}`, `Phone / WhatsApp: ${value("phone")}`, ...[["Company", "company"], ["Location", "location"], ["Project type", "type"], ["Capacity / TPH", "capacity"]].filter(([, key]) => value(key)).map(([label, key]) => `${label}: ${value(key)}`), `Project requirement: ${value("requirement")}`];
    setDraft(whatsappUrl(lines.join("\n")));
  }
  return <section className="eng-enquiry eng-section" id="engineering-enquiry" aria-labelledby="eng-enquiry-title">
    <div className="eng-enquiry-intro"><p className="eng-kicker">10 / PROJECT ENQUIRY</p><h2 id="eng-enquiry-title">PLANNING A NEW PLANT?<br /><span>UPGRADING AN EXISTING LINE?</span></h2><p className="eng-enquiry-answer">LET&apos;S ENGINEER IT<br />BEFORE WE BUILD IT.</p><p>Tell us about your process, site and equipment requirements.</p><div className="eng-actions"><a className="eng-button eng-button-light" href={whatsappUrl("Hello S.K. Engineering Works, I would like to discuss an engineering / plant requirement.")} target="_blank" rel="noopener noreferrer">WHATSAPP US ↗</a><a href={companyContact.phoneHref}>{companyContact.phoneDisplay}</a></div></div>
    <form onSubmit={prepare} onChange={() => setDraft(null)} onInput={(event) => { if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) event.target.setCustomValidity(""); }}>
      <label>NAME *<input name="name" autoComplete="name" required /></label><label>PHONE / WHATSAPP *<input name="phone" type="tel" autoComplete="tel" required /></label>
      <label>COMPANY<input name="company" autoComplete="organization" /></label><label>LOCATION<input name="location" autoComplete="address-level2" /></label>
      <label>PROJECT TYPE<select name="type" defaultValue=""><option value="">SELECT PROJECT TYPE</option><option>New Salt Refinery Plant</option><option>Plant Expansion</option><option>Existing Line Upgrade</option><option>Machinery Integration</option><option>Plant Layout / Equipment Arrangement</option><option>Other</option></select></label><label>CAPACITY / TPH<input name="capacity" /></label>
      <label className="eng-field-wide">PROJECT REQUIREMENT *<textarea name="requirement" rows={4} required /></label>
      <div className="eng-field-wide eng-form-actions"><button className="eng-button eng-button-light" type="submit">PREPARE ENQUIRY →</button>{draft && <a className="eng-button" href={draft} target="_blank" rel="noopener noreferrer">OPEN WHATSAPP WITH DETAILS ↗</a>}<small>Your details open as a WhatsApp draft. You choose when to send.</small></div>
    </form>
  </section>;
}
