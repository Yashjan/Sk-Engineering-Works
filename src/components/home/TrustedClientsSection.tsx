"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "@/components/media/ProgressiveImage";
import { assetPath } from "@/lib/asset-path";
import "./about-credibility-section.css";
import "./trusted-clients-section.css";

type Client = { name: string; logo?: string };

const clients: Client[] = [
  { name: "Goyal Salt Pvt. Ltd." },
  { name: "Rakshak Foods Private Limited" },
  { name: "Adhinath Chemfood Private Limited" },
  { name: "Jagdamba Salt Pvt. Ltd." },
  { name: "Pankaj Salt Pvt. Ltd.", logo: assetPath("/images/clients/pankaj-salt.png") },
  { name: "Pragati Salt Pvt. Ltd.", logo: assetPath("/images/clients/pragati-salt.png") },
  { name: "Bharat Salt" },
  { name: "Arihant Salt Production" },
  { name: "JK Salt Pvt. Ltd.", logo: assetPath("/images/clients/jk-salt.png") },
  { name: "Divine Chemfood Pvt. Ltd." },
  { name: "Royal Salt" },
  { name: "Baba Ramdev", logo: assetPath("/images/clients/babaRamdev.png") },
];

const clientRowSplit = Math.ceil(clients.length / 2);

function ClientMark({ client, duplicate = false }: { client: Client; duplicate?: boolean }) {
  return (
    <li className={`about-client-mark${client.logo ? " has-logo" : ""}`} aria-hidden={duplicate || undefined}>
      {client.logo ? (
        <>
          <Image className="about-client-logo" src={client.logo} alt={`${client.name} logo`} width={160} height={42} sizes="160px" />
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
  sectionNumber?: string;
};

export default function TrustedClientsSection({ animate = true, standalone = false, sectionNumber = "05" }: TrustedClientsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ scrollTrigger: { trigger: section, start: "top 84%", toggleActions: "play none none none" } }).to(".about-trust-heading", {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
        });
      }, section);
      return () => context.revert();
    });

    return () => media.revert();
  }, [animate]);

  const content = (
    <>
      <div className="about-trust-meta"><span>INDUSTRY TRUST / {sectionNumber}</span><span>CLIENT NETWORK / {clients.length}+</span></div>
      <h3 id="about-trust-heading" className="about-trust-heading">TRUSTED BY<br />SALT MANUFACTURERS.</h3>
      <div className="about-marquees" aria-label="S.K. Engineering Works client network">
        <MarqueeRow items={clients.slice(0, clientRowSplit)} />
        <MarqueeRow items={clients.slice(clientRowSplit)} reverse />
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
