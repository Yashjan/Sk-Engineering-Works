"use client";

import Image from "@/components/media/ProgressiveImage";
import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SiteFooter from "@/components/layout/SiteFooter";
import { companyContact, whatsappUrl } from "@/data/contact";
import { assetPath } from "@/lib/asset-path";
import "./contact-page.css";

const requirementOptions = [
  "Complete Salt Refinery Plant",
  "Individual Machinery",
  "Material Handling System",
  "Air & Dust Handling",
  "Plant Modification / Maintenance",
  "Agricultural Equipment",
  "Other",
];

type RequiredField = "name" | "phone" | "requirement" | "details" | "email";
type Errors = Partial<Record<RequiredField, string>>;

function value(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

export default function ContactPageExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".contact-hero-meta", { autoAlpha: 0, y: 12, duration: 0.45 })
          .from(".contact-hero-line > span", { yPercent: 108, duration: 0.82, stagger: 0.08 }, "-=0.16")
          .from(".contact-hero-support, .contact-hero-actions", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.09 }, "-=0.42")
          .from(".contact-hero-media", { clipPath: "inset(0 0 100% 0)", duration: 1 }, "-=0.68");

        gsap.utils.toArray<HTMLElement>(".contact-reveal").forEach((section) => {
          const targets = section.querySelectorAll<HTMLElement>("[data-reveal]");
          gsap.from(targets, { autoAlpha: 0, y: 20, duration: 0.65, stagger: 0.065, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 81%", once: true } });
        });
        gsap.fromTo(".contact-direct-divider", { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.09, ease: "power2.out", scrollTrigger: { trigger: ".contact-direct-list", start: "top 82%", once: true } });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Errors = {};
    const name = value(data, "name");
    const phone = value(data, "phone");
    const email = value(data, "email");
    const requirement = value(data, "requirement");
    const details = value(data, "details");

    if (!name) nextErrors.name = "Please enter your name.";
    if (!phone) nextErrors.phone = "Please enter a phone or WhatsApp number.";
    else if (phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Please enter a valid phone number.";
    if (!requirement) nextErrors.requirement = "Please select a requirement type.";
    if (!details) nextErrors.details = "Please describe your project requirement.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Please enter a valid email address.";

    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      requestAnimationFrame(() => form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus());
      return;
    }

    const company = value(data, "company");
    const location = value(data, "location");
    const capacity = value(data, "capacity");
    const lines = [
      "Hello S.K. Engineering Works,",
      "",
      `Name: ${name}`,
      ...(company ? [`Company: ${company}`] : []),
      `Phone / WhatsApp: ${phone}`,
      ...(email ? [`Email: ${email}`] : []),
      ...(location ? [`City / State: ${location}`] : []),
      `Requirement: ${requirement}`,
      ...(capacity ? [`Capacity / TPH: ${capacity}`] : []),
      `Project Details: ${details}`,
      "",
      "I would like to discuss this requirement.",
    ];
    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return <div ref={rootRef} className="contact-page">
    <section className="contact-hero" aria-labelledby="contact-page-title">
      <div className="contact-hero-grid">
        <header className="contact-hero-copy">
          <p className="contact-hero-meta">CONTACT / S.K. ENGINEERING WORKS</p>
          <h1 id="contact-page-title"><span className="contact-hero-line"><span>LET&apos;S BUILD</span></span><span className="contact-hero-line"><span>YOUR NEXT</span></span><span className="contact-hero-line"><span>SYSTEM.</span></span></h1>
          <p className="contact-hero-support">Whether you need an individual machine, material-handling system, plant modification or complete salt refinery setup, share your requirement with our team.</p>
          <div className="contact-hero-actions">
            <a href={companyContact.phoneHref}>CALL US <span aria-hidden="true">→</span></a>
            <a href={whatsappUrl("Hello S.K. Engineering Works, I would like to discuss a project requirement.")} target="_blank" rel="noopener noreferrer" aria-label="Contact S.K. Engineering Works on WhatsApp">WHATSAPP <span aria-hidden="true">↗</span></a>
          </div>
        </header>
        <figure className="contact-hero-media"><Image src={assetPath("/images/salt-refinery/execution/fabricated-equipment.jpeg")} alt="Industrial process equipment inside the S.K. Engineering Works workshop" fill priority sizes="(max-width: 767px) 88vw, 45vw" /><figcaption><span>WORKSHOP / SAMBHAR LAKE</span><span>PROJECT DISCUSSIONS START HERE</span></figcaption></figure>
      </div>
    </section>

    <section className="contact-direct contact-reveal" aria-labelledby="contact-direct-title">
      <div className="contact-direct-grid">
        <header className="contact-direct-heading">
          <p className="contact-direct-eyebrow" data-reveal>DIRECT CONTACT / 02</p>
          <h2 id="contact-direct-title" data-reveal>TALK DIRECTLY<br />WITH THE TEAM.</h2>
          <p data-reveal>Have a machine requirement, plant enquiry or existing system issue?<br />Speak with us directly.</p>
        </header>
        <dl className="contact-direct-list">
          <div className="contact-direct-row" data-reveal>
            <dt><span>01</span><strong>PHONE</strong></dt>
            <dd><a className="contact-direct-value" href={companyContact.phoneHref}>{companyContact.phoneDisplay}</a><a className="contact-direct-cta" href={companyContact.phoneHref}>CALL NOW <span aria-hidden="true">↗</span></a></dd>
            <span className="contact-direct-divider" aria-hidden="true" />
          </div>
          <div className="contact-direct-row" data-reveal>
            <dt><span>02</span><strong>WHATSAPP</strong></dt>
            <dd><a className="contact-direct-value" href={whatsappUrl("Hello S.K. Engineering Works, I would like to discuss a project requirement.")} target="_blank" rel="noopener noreferrer" aria-label={`Chat with S.K. Engineering Works on WhatsApp at ${companyContact.phoneDisplay}`}>WHATSAPP NOW</a><a className="contact-direct-cta" href={whatsappUrl("Hello S.K. Engineering Works, I would like to discuss a project requirement.")} target="_blank" rel="noopener noreferrer">CHAT ON WHATSAPP <span aria-hidden="true">↗</span></a></dd>
            <span className="contact-direct-divider" aria-hidden="true" />
          </div>
          <div className="contact-direct-row contact-direct-location-row" data-reveal>
            <dt><span>03</span><strong>LOCATION</strong></dt>
            <dd><a className="contact-direct-value" href={companyContact.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Open S.K. Engineering Works location in Google Maps"><address><strong>S.K. ENGINEERING WORKS</strong>{companyContact.addressLines[0].toUpperCase()}<br />{companyContact.addressLines[1].toUpperCase()}</address></a><a className="contact-direct-cta" href={companyContact.mapsUrl} target="_blank" rel="noopener noreferrer">OPEN IN MAPS <span aria-hidden="true">↗</span></a></dd>
            <span className="contact-direct-divider" aria-hidden="true" />
          </div>
        </dl>
      </div>
    </section>

    <section id="project-enquiry" className="contact-form-section contact-reveal" aria-labelledby="contact-form-title">
      <div className="contact-section-meta" data-reveal><span>PROJECT ENQUIRY / 03</span><span>DETAILS CREATE BETTER ANSWERS</span></div>
      <div className="contact-form-layout">
        <header className="contact-form-heading"><h2 id="contact-form-title" data-reveal>TELL US<br />WHAT YOU NEED.</h2><p data-reveal>Share your project requirement and our team can review the application, capacity and equipment needs.</p><small data-reveal>SUBMISSION OPENS WHATSAPP.<br />THE WEBSITE DOES NOT STORE YOUR DETAILS.</small></header>
        <form className="contact-form" noValidate onSubmit={submitEnquiry} data-reveal>
          <div className="contact-field"><label htmlFor="contact-name">NAME <b aria-hidden="true">*</b></label><input id="contact-name" name="name" type="text" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} onChange={() => setErrors((current) => ({ ...current, name: undefined }))} />{errors.name ? <p id="contact-name-error" role="alert">{errors.name}</p> : null}</div>
          <div className="contact-field"><label htmlFor="contact-company">COMPANY NAME</label><input id="contact-company" name="company" type="text" autoComplete="organization" /></div>
          <div className="contact-field"><label htmlFor="contact-phone">PHONE / WHATSAPP <b aria-hidden="true">*</b></label><input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "contact-phone-error" : undefined} onChange={() => setErrors((current) => ({ ...current, phone: undefined }))} />{errors.phone ? <p id="contact-phone-error" role="alert">{errors.phone}</p> : null}</div>
          <div className="contact-field"><label htmlFor="contact-email">EMAIL</label><input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} onChange={() => setErrors((current) => ({ ...current, email: undefined }))} />{errors.email ? <p id="contact-email-error" role="alert">{errors.email}</p> : null}</div>
          <div className="contact-field"><label htmlFor="contact-location">CITY / STATE</label><input id="contact-location" name="location" type="text" autoComplete="address-level2" /></div>
          <div className="contact-field"><label htmlFor="contact-requirement">REQUIREMENT TYPE <b aria-hidden="true">*</b></label><select id="contact-requirement" name="requirement" defaultValue="" required aria-invalid={Boolean(errors.requirement)} aria-describedby={errors.requirement ? "contact-requirement-error" : undefined} onChange={() => setErrors((current) => ({ ...current, requirement: undefined }))}><option value="" disabled>SELECT REQUIREMENT</option>{requirementOptions.map((option) => <option key={option}>{option}</option>)}</select>{errors.requirement ? <p id="contact-requirement-error" role="alert">{errors.requirement}</p> : null}</div>
          <div className="contact-field"><label htmlFor="contact-capacity">CAPACITY / TPH</label><input id="contact-capacity" name="capacity" type="text" inputMode="decimal" placeholder="e.g. 15 TPH" /></div>
          <div className="contact-field contact-field-spacer" aria-hidden="true" />
          <div className="contact-field contact-field-wide"><label htmlFor="contact-details">PROJECT DETAILS <b aria-hidden="true">*</b></label><textarea id="contact-details" name="details" rows={6} required placeholder="Tell us about your requirement, application, existing plant, material, capacity or any issue you want to solve." aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? "contact-details-error" : undefined} onChange={() => setErrors((current) => ({ ...current, details: undefined }))} />{errors.details ? <p id="contact-details-error" role="alert">{errors.details}</p> : null}</div>
          <div className="contact-form-submit contact-field-wide"><button type="submit">SEND ENQUIRY ON WHATSAPP <span aria-hidden="true">↗</span></button><p>Required fields are marked with <b>*</b>.</p></div>
        </form>
      </div>
    </section>

    <section className="contact-location contact-reveal" aria-labelledby="contact-location-title">
      <div className="contact-section-meta" data-reveal><span>FACTORY / LOCATION / 04</span><span>SAMBHAR LAKE, RAJASTHAN</span></div>
      <div className="contact-location-grid"><div className="contact-location-copy"><h2 id="contact-location-title" data-reveal>COME SEE<br />WHERE WE BUILD.</h2><address data-reveal><strong>S.K. Engineering Works</strong>{companyContact.addressLines[0]}<br />{companyContact.addressLines[1]}</address><a data-reveal href={companyContact.mapsUrl} target="_blank" rel="noopener noreferrer">OPEN IN GOOGLE MAPS <span aria-hidden="true">↗</span></a></div><figure data-reveal><Image src={assetPath("/images/salt-refinery/execution/fabrication-blower.jpeg")} alt="S.K. Engineering Works industrial fabrication workshop in Sambhar Lake, Rajasthan" fill sizes="(max-width: 767px) 88vw, 52vw" /><figcaption>REAL WORKSHOP / NAWA ROAD</figcaption></figure></div>
    </section>

    <section className="contact-quick contact-reveal" aria-labelledby="contact-quick-title">
      <div className="contact-quick-grid"><h2 id="contact-quick-title" data-reveal>HAVE A DRAWING,<br />REQUIREMENT<br />OR PLANT PROBLEM?</h2><div className="contact-quick-copy" data-reveal><p>Send it to us and let&apos;s discuss the right solution.</p><div><a href={whatsappUrl("Hello S.K. Engineering Works, I have a drawing or project requirement to discuss.")} target="_blank" rel="noopener noreferrer">WHATSAPP US <span aria-hidden="true">↗</span></a><a href={companyContact.phoneHref}>CALL NOW <span aria-hidden="true">↗</span></a></div></div></div>
      <SiteFooter />
    </section>
  </div>;
}
