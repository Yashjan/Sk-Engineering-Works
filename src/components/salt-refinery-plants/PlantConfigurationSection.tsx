"use client";
/** @jsxImportSource @/i18n/react */

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PlantCopy } from "@/i18n/plant-content/types";
import "./plant-configuration-section.css";

type ConfigurationFactor = {
  number: string;
  title: string;
};

const configurationFactors: ConfigurationFactor[] = [
  {
    number: "01",
    title: "TARGET OUTPUT",
  },
  {
    number: "02",
    title: "RAW SALT CONDITION",
  },
  {
    number: "03",
    title: "PRODUCT SPECIFICATION",
  },
  {
    number: "04",
    title: "AVAILABLE SPACE",
  },
  {
    number: "05",
    title: "MOISTURE & DRYING REQUIREMENT",
  },
  {
    number: "06",
    title: "PACKING REQUIREMENT",
  },
];

export default function PlantConfigurationSection({ copy }: { copy: PlantCopy["configuration"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 76%",
              once: true,
            },
          })
          .fromTo(
            ".configuration-eyebrow",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.4 },
          )
          .fromTo(
            ".configuration-heading-line > span",
            { yPercent: 105 },
            { yPercent: 0, duration: 0.68, stagger: 0.07 },
            "-=0.12",
          )
          .fromTo(
            ".configuration-support, .configuration-statement, .configuration-board",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
            "-=0.34",
          );
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="plant-configuration"
      aria-labelledby="plant-configuration-title"
    >
      <div className="configuration-shell">
        <p className="configuration-eyebrow">PLANT CONFIGURATION / 04</p>

        <div className="configuration-layout">
          <div className="configuration-editorial">
            <h2 id="plant-configuration-title" className="configuration-heading">
              <span className="configuration-heading-line"><span>BUILT AROUND</span></span>
              <span className="configuration-heading-line"><span>YOUR PRODUCTION</span></span>
              <span className="configuration-heading-line"><span>REQUIREMENT.</span></span>
            </h2>

            <p className="configuration-support">
              {copy.support}
            </p>

            <div className="configuration-statement">
              <p className="configuration-statement-title">
                NO TWO REFINERIES<br />
                NEED THE SAME CONFIGURATION.
              </p>
              <p className="configuration-statement-copy">
                {copy.statement}
              </p>

              <p className="configuration-principle">
                CONFIGURED FOR THE PLANT,<br />
                NOT PICKED FROM A CATALOG.
              </p>
            </div>
          </div>

          <div className="configuration-board" aria-label="Plant configuration factors">
            <div className="configuration-board-meta" aria-hidden="true">
              <span>CONFIGURATION FACTORS</span>
              <span>SELECT / 01–06</span>
            </div>

            <div className="configuration-factor-list">
              {configurationFactors.map((factor, index) => {
                const isActive = activeIndex === index;
                const panelId = `configuration-factor-${factor.number}`;

                return (
                  <div
                    className="configuration-factor"
                    data-active={isActive ? "true" : "false"}
                    key={factor.number}
                  >
                    <button
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={panelId}
                      onClick={() => setActiveIndex(index)}
                    >
                      <span className="configuration-factor-number">{factor.number}</span>
                      <span className="configuration-factor-title">{factor.title}</span>
                      <span className="configuration-factor-mark" aria-hidden="true" />
                    </button>

                    <div
                      id={panelId}
                      className="configuration-factor-panel"
                      aria-hidden={!isActive}
                    >
                      <div>
                        <p>{copy.factors[factor.number]}</p>
                      </div>
                    </div>
                    <span className="configuration-factor-line" aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
