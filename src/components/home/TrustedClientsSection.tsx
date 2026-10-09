"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./about-credibility-section.css";
import "./trusted-clients-section.css";

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

type TrustedClientsSectionProps = {
  animate?: boolean;
  standalone?: boolean;
};

export default function TrustedClientsSection({ animate = true, standalone = false }: TrustedClientsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.to(".about-trust-heading", {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 84%", once: true },
        });
      }, section);
      return () => context.revert();
    });

    return () => media.revert();
  }, [animate]);

  const content = (
    <>
      <div className="about-trust-meta"><span>INDUSTRY TRUST / 05</span><span>CLIENT NETWORK / 12+</span></div>
      <h3 id="about-trust-heading" className="about-trust-heading">TRUSTED BY<br />SALT MANUFACTURERS.</h3>
      <div className="about-marquees" aria-label="S.K. Engineering Works client network">
        <MarqueeRow items={clients.slice(0, 6)} />
        <MarqueeRow items={clients.slice(6)} reverse />
      </div>
    </>
  );

  if (standalone) {
    return (
      <section ref={sectionRef} className="about-trust trusted-clients-standalone" aria-labelledby="about-trust-heading">
        <div className="trusted-clients-shell">{content}</div>
      </section>
    );
  }

  return <section ref={sectionRef} className="about-trust" aria-labelledby="about-trust-heading">{content}</section>;
}
