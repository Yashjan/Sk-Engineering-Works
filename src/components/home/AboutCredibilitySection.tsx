"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TrustedClientsSection from "./TrustedClientsSection";
import { assetPath } from "@/lib/asset-path";
import "./about-credibility-section.css";

export default function AboutCredibilitySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ scrollTrigger: { trigger: ".about-intro", start: "top 84%", once: true } })
          .to(".about-meta", { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" })
          .to(".about-authority, .about-statement, .about-story", { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.1, ease: "power3.out" }, "-=0.2");

        const statements = gsap.utils.toArray<HTMLElement>(".about-flash-line");
        gsap.timeline({ scrollTrigger: { trigger: ".about-flash", start: "top 82%", end: "bottom 30%", scrub: 0.6 } })
          .to(statements[0], { opacity: 1, x: 0, y: 0, duration: 1 })
          .to(statements[0], { opacity: 0.28, duration: 0.45 })
          .to(statements[1], { opacity: 1, x: 0, y: 0, duration: 1 }, "<")
          .to(statements[1], { opacity: 0.28, duration: 0.45 })
          .to(statements[2], { opacity: 1, x: 0, y: 0, duration: 1 }, "<");

        gsap.timeline({ scrollTrigger: { trigger: ".about-proof", start: "top 84%", once: true } })
          .to(".about-proof-number", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" })
          .to(".about-proof-copy, .about-proof-region", { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" }, "-=0.38");

        gsap.to(".about-trust-heading, .about-global-close", {
          autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: ".about-trust", start: "top 84%", once: true },
        });
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-credibility" aria-labelledby="about-heading">
      <div className="about-shell">
        <header className="about-intro">
          <div className="about-meta"><span>ABOUT / 04</span><span>SINCE 2003</span></div>
          <div className="about-intro-grid">
            <div className="about-authority">
              <p><span>THREE DECADES</span><br />OF FABRICATION.</p>
              <small>SALT PROCESSING<br />SINCE 2003.</small>
            </div>
            <div className="about-narrative">
              <h2 id="about-heading" className="about-statement">
                <span>INDUSTRIAL EQUIPMENT.<br />PLANT ENGINEERING.</span>
                <strong>DEEP EXPERTISE<br />IN SALT PROCESSING.</strong>
              </h2>
              <div className="about-story">
                <p>For more than three decades, fabrication and equipment engineering have been at the core of S.K. Engineering Works.</p>
                <p>We manufacture industrial process equipment, material-handling systems and plant machinery. Since entering the salt industry in 2003, we have also helped build complete refinery plants from the ground up.</p>
                <p>From Rajasthan to Gujarat, our experience has been shaped on real workshop and plant floors through fabrication, integration, installation and long-term engineering support.</p>
              </div>
            </div>
            <figure className="about-factory-media">
              <Image
                src={assetPath("/images/projects/jagdamba/04_jagdamba_project_cover.jpg")}
                alt="S.K. Engineering Works salt refinery installation"
                fill
                sizes="(max-width: 479px) 0px, (max-width: 767px) 88vw, 36vw"
              />
              <figcaption><span>PROJECT INSTALLATION / JAGDAMBA</span><span>ENGINEERING IN PRACTICE</span></figcaption>
            </figure>
          </div>
        </header>

        <div className="about-flash" aria-label="Fabricated here. Installed on site. Proven in production.">
          <p className="about-flash-line">FABRICATED HERE.</p>
          <p className="about-flash-line">INSTALLED ON SITE.</p>
          <p className="about-flash-line">PROVEN IN PRODUCTION.</p>
        </div>

        <div className="about-proof">
          <p className="about-proof-number">10 +</p>
          <div className="about-proof-copy">
            <p>COMPLETE FACTORIES<br />BUILT FROM<br />THE GROUND UP.</p>
            <small>RAJASTHAN <span>→</span> GUJARAT <span>→</span> GLOBAL NEXT</small>
          </div>
          <p className="about-proof-region">From Sambhar and Nawa to Santalpur and Jambusar, our work has taken us across major salt-producing regions.</p>
        </div>

        <TrustedClientsSection animate={false} />

        <footer className="about-global-close">
          <h3>BUILT THROUGH EXPERIENCE.<br /><span>READY FOR THE GLOBAL STAGE.</span></h3>
          <p>GLOBAL NEXT <span aria-hidden="true">→</span></p>
        </footer>
      </div>
    </section>
  );
}
