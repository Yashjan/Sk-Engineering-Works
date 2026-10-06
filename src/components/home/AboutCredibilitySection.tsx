"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./about-credibility-section.css";

type Client = { name: string; logo?: string };

const clients: Client[] = [
  { name: "Goyal Salt Pvt. Ltd." },
  { name: "Rakshak Foods Private Limited" },
  { name: "Adhinath Chemfood Private Limited" },
  { name: "Kasturi Chemfood Private Limited" },
  { name: "Jagdamba Salt Pvt. Ltd." },
  { name: "Pankaj Salt Pvt. Ltd.", logo: "https://www.pankajsalt.com/images/logo_new1.png" },
  { name: "Pragati Salt Pvt. Ltd.", logo: "https://www.pragatisalt.com/images/logo1.png" },
  { name: "Bharat Salt" },
  { name: "Arihant Salt Production" },
  { name: "JK Salt Pvt. Ltd." },
  { name: "Divine Chemfood Pvt. Ltd." },
  { name: "Royal Salt" },
];

function ClientMark({ client, duplicate = false }: { client: Client; duplicate?: boolean }) {
  return (
    <li className={`about-client-mark${client.logo ? " has-logo" : ""}`} aria-hidden={duplicate || undefined}>
      {client.logo ? (
        <>
          <span className="about-client-logo" role="img" aria-label={`${client.name} logo`} style={{ backgroundImage: `url("${client.logo}")` }} />
          <small>{client.name}</small>
        </>
      ) : <strong>{client.name}</strong>}
    </li>
  );
}

function MarqueeRow({ items, reverse = false }: { items: Client[]; reverse?: boolean }) {
  return (
    <div className={`about-marquee-row${reverse ? " is-reverse" : ""}`}>
      <ul className="about-marquee-track">
        {items.map((client) => <ClientMark client={client} key={client.name} />)}
        {items.map((client) => <ClientMark client={client} duplicate key={`duplicate-${client.name}`} />)}
      </ul>
    </div>
  );
}

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
              <p><span>THREE DECADES</span><br />OF ENGINEERING.</p>
              <small>IN SALT<br />SINCE 2003.</small>
            </div>
            <div className="about-narrative">
              <h2 id="about-heading" className="about-statement">
                <span>WE DIDN&apos;T LEARN SALT ENGINEERING<br />FROM A DRAWING.</span>
                <strong>WE LEARNED IT<br />ON THE PLANT FLOOR.</strong>
              </h2>
              <div className="about-story">
                <p>For more than three decades, engineering has been at the core of S.K. Engineering Works.</p>
                <p>Since entering the salt industry in 2003, we have worked alongside manufacturers, solved production challenges, fabricated machinery and helped build complete refinery plants from the ground up.</p>
                <p>From Rajasthan to Gujarat, our experience has been shaped on real plant floors through fabrication, installation and long-term engineering support.</p>
              </div>
            </div>
          </div>
        </header>

        <div className="about-flash" aria-label="Fabricated here. Installed on site. Proven in production.">
          <p className="about-flash-line">FABRICATED HERE.</p>
          <p className="about-flash-line">INSTALLED ON SITE.</p>
          <p className="about-flash-line">PROVEN IN PRODUCTION.</p>
        </div>

        <div className="about-proof">
          <p className="about-proof-number">10+</p>
          <div className="about-proof-copy">
            <p>COMPLETE FACTORIES<br />BUILT FROM<br />THE GROUND UP.</p>
            <small>RAJASTHAN <span>→</span> GUJARAT <span>→</span> GLOBAL NEXT</small>
          </div>
          <p className="about-proof-region">From Sambhar and Nawa to Santalpur and Jambusar, our work has taken us across major salt-producing regions.</p>
        </div>

        <section className="about-trust" aria-labelledby="about-trust-heading">
          <div className="about-trust-meta"><span>INDUSTRY TRUST / 05</span><span>CLIENT NETWORK / 12+</span></div>
          <h3 id="about-trust-heading" className="about-trust-heading">TRUSTED BY<br />SALT MANUFACTURERS.</h3>
          <div className="about-marquees" aria-label="S.K. Engineering Works client network">
            <MarqueeRow items={clients.slice(0, 6)} />
            <MarqueeRow items={clients.slice(6)} reverse />
          </div>
        </section>

        <footer className="about-global-close">
          <h3>BUILT THROUGH EXPERIENCE.<br /><span>READY FOR THE GLOBAL STAGE.</span></h3>
          <p>GLOBAL NEXT <span aria-hidden="true">→</span></p>
        </footer>
      </div>
    </section>
  );
}
