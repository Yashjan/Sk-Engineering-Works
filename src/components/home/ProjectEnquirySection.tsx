"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./project-enquiry-section.css";

const whatsappMessage = encodeURIComponent(
  "Hello S.K. Engineering Works, I would like to discuss a salt refinery / machinery requirement.",
);

type ProjectEnquirySectionProps = {
  appearance?: "dark" | "light";
};

export default function ProjectEnquirySection({ appearance = "dark" }: ProjectEnquirySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        })
          .to(".enquiry-meta", { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" })
          .to(".enquiry-support, .enquiry-actions, .enquiry-cta-note, .enquiry-scope, .enquiry-lower-proof, .enquiry-lower-contact", {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.09,
            ease: "power2.out",
          }, "-=0.16")
          .to(".enquiry-region-line", {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
          }, "-=0.48")
          .fromTo(".enquiry-background", { y: 20, scale: 0.985 }, {
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power2.out",
          }, "-=0.8");
      }, section);
      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className={`project-enquiry${appearance === "light" ? " project-enquiry-light" : ""}`} aria-labelledby="project-enquiry-heading">
      <div className="enquiry-background" aria-hidden="true">LET&apos;S BUILD.</div>
      <div className="enquiry-shell">
        <div className="enquiry-meta">
          <span>PROJECT ENQUIRY / 06</span>
          <a href="tel:+919828460532">START A PROJECT <span aria-hidden="true">→</span></a>
        </div>

        <div className="enquiry-main">
          <div className="enquiry-left">
            <h2 id="project-enquiry-heading" className="enquiry-heading">
              <span className="enquiry-heading-muted">
                <span className="enquiry-heading-line"><span>PLANNING A</span></span>
                <span className="enquiry-heading-line"><span>SALT REFINERY?</span></span>
              </span>
            </h2>
          </div>

          <div className="enquiry-conversion">
            <h3 className="enquiry-answer">
              <span className="enquiry-heading-line"><span>LET&apos;S ENGINEER</span></span>
              <span className="enquiry-heading-line"><span>IT TOGETHER.</span></span>
            </h3>
            <p className="enquiry-support">From individual machinery to complete salt refinery execution, talk to our team about your plant requirement.</p>
            <div className="enquiry-actions">
              <a className="enquiry-primary" href="tel:+919828460532">
                DISCUSS YOUR PROJECT <span aria-hidden="true">→</span>
              </a>
              <a
                className="enquiry-secondary"
                href={`https://wa.me/919828460532?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact S.K. Engineering Works on WhatsApp"
              >
                WHATSAPP US <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p className="enquiry-cta-note">NEW PLANTS / UPGRADES / INDIVIDUAL MACHINERY</p>
          </div>

          <div className="enquiry-left-details">
            <ol className="enquiry-scope" aria-label="Project scope">
              <li><span>01</span><strong>COMPLETE PLANTS</strong></li>
              <li><span>02</span><strong>INDIVIDUAL MACHINERY</strong></li>
              <li><span>03</span><strong>UPGRADES</strong></li>
              <li><span>04</span><strong>INSTALLATION</strong></li>
            </ol>
            <p className="enquiry-scope-compact">COMPLETE PLANTS / MACHINERY / UPGRADES / INSTALLATION</p>
          </div>
        </div>

        <div className="enquiry-lower">
          <div className="enquiry-lower-proof">
            <strong>10 +</strong>
            <div className="enquiry-proof-copy">
              <p>FACTORIES BUILT<br />FROM SCRATCH.</p>
              <small>RAJASTHAN + GUJARAT<br />EXECUTION EXPERIENCE</small>
            </div>
          </div>
          <address className="enquiry-lower-contact">
            <strong>S.K. ENGINEERING WORKS</strong>
            <a className="enquiry-phone" href="tel:+919828460532">+91 98284 60532</a>
            <a
              className="enquiry-maps"
              href="https://www.google.com/maps/search/?api=1&query=S.K.%20Engineering%20Works%2C%20Nawa%20Road%2C%20Sambhar%20Lake%2C%20Rajasthan"
              target="_blank"
              rel="noopener noreferrer"
            >
              OPEN IN MAPS <span aria-hidden="true">↗</span>
            </a>
            <p>NAWA ROAD, SAMBHAR LAKE – 303604<br />DIST. JAIPUR, RAJASTHAN</p>
          </address>
        </div>

        <div className="enquiry-region">
          <span className="enquiry-region-line" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
