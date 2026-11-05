"use client";
/** @jsxImportSource @/i18n/react */

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProgressiveImage from "@/components/media/ProgressiveImage";
import ProgressiveVideo from "@/components/media/ProgressiveVideo";
import { projectGallery, type ProjectGalleryItem } from "@/data/projects";
import { assetPath } from "@/lib/asset-path";
import "./projects-visual-gallery.css";

const number = (value: number) => String(value).padStart(2, "0");

type ProjectsVisualGalleryProps = {
  items?: ProjectGalleryItem[];
  eyebrow?: string;
  heading?: [string, string];
  headingId?: string;
  ariaLabel?: string;
  footerPrompt?: string;
  finalLines?: [string, string, string];
  finalLabel?: string;
  scrollTriggerId?: string;
};

export default function ProjectsVisualGallery({
  items = projectGallery,
  eyebrow = "VISUAL ARCHIVE / 03",
  heading = ["BUILT IN STEEL.", "PROVEN IN MOTION."],
  headingId = "projects-visual-gallery-heading",
  ariaLabel = "Visual archive",
  footerPrompt = "SCROLL TO MOVE THROUGH THE FIELD",
  finalLines = ["FROM DRAWING.", "TO FABRICATION.", "TO THE FIELD."],
  finalLabel = "ENGINEERED / BUILT / INSTALLED",
  scrollTriggerId = "projects-visual-gallery",
}: ProjectsVisualGalleryProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const refreshFrame = useRef<number | null>(null);

  useLayoutEffect(() => {
    const section = root.current;
    const scene = stage.current;
    const frame = viewport.current;
    const rail = track.current;
    if (!section || !scene || !frame || !rail) return;

    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray<HTMLElement>(".projects-visual-gallery-card", rail);
    const mediaLayers = gsap.utils.toArray<HTMLElement>(".projects-visual-gallery-media-layer", rail);
    const header = scene.querySelector<HTMLElement>(".projects-visual-gallery-header");
    const final = scene.querySelector<HTMLElement>(".projects-visual-gallery-final");
    const current = scene.querySelector<HTMLElement>("[data-gallery-current]");
    const progress = scene.querySelector<HTMLElement>("[data-gallery-progress]");
    const matchMedia = gsap.matchMedia();

    matchMedia.add({
      desktop: "(min-width: 1100px) and (min-height: 650px)",
      motion: "(prefers-reduced-motion: no-preference)",
    }, (context) => {
      if (!context.conditions?.desktop || !context.conditions?.motion) return;

      let travel = 0;
      let activeIndex = -1;
      let resizeFrame = 0;
      const measure = () => { travel = Math.max(0, rail.scrollWidth - frame.clientWidth); };
      const updateActiveCard = () => {
        const center = frame.getBoundingClientRect().left + frame.clientWidth * 0.56;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const bounds = card.getBoundingClientRect();
          const distance = Math.abs(bounds.left + bounds.width / 2 - center);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });
        cards.forEach((card, index) => { card.dataset.active = String(index === nearestIndex); });
        if (nearestIndex !== activeIndex) {
          activeIndex = nearestIndex;
          if (current) current.textContent = number(nearestIndex + 1);
        }
      };

      measure();
      section.classList.add("is-horizontal");

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: "top 92%",
          end: "top top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      if (cards[0]) {
        intro.fromTo(cards[0], {
          xPercent: 62,
          yPercent: 64,
          autoAlpha: 0.18,
        }, {
          xPercent: 0,
          yPercent: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
        }, 0);
      }
      if (cards[1]) {
        intro.fromTo(cards[1], {
          xPercent: 88,
          yPercent: 92,
          autoAlpha: 0,
        }, {
          xPercent: 0,
          yPercent: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
        }, 0.12);
      }
      if (header) {
        intro.fromTo(header, {
          y: 28,
          autoAlpha: 0,
        }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.72,
          ease: "power3.out",
        }, 0.08);
      }

      const story = gsap.timeline({
        scrollTrigger: {
          id: scrollTriggerId,
          trigger: scene,
          start: "top top",
          end: () => {
            measure();
            return `+=${Math.max(window.innerHeight * 2.2, travel * 0.72)}`;
          },
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => { measure(); updateActiveCard(); },
          onUpdate: (self) => {
            updateActiveCard();
            if (progress) progress.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      story
        .to(rail, { x: () => -travel, duration: 1, ease: "none" }, 0)
        .to(header, { autoAlpha: 0, y: -22, duration: 0.13, ease: "none" }, 0.05)
        .to(scene, {
          "--gallery-bg": "#aeb6a9",
          "--gallery-fg": "#111415",
          "--gallery-muted": "rgba(17,20,21,.7)",
          "--gallery-line": "rgba(17,20,21,.14)",
          duration: 0.3,
          ease: "none",
        }, 0.24)
        .to(scene, {
          "--gallery-bg": "#f3f2ed",
          "--gallery-fg": "#111415",
          "--gallery-muted": "rgba(17,20,21,.62)",
          "--gallery-line": "rgba(17,20,21,.13)",
          duration: 0.4,
          ease: "none",
        }, 0.57);

      mediaLayers.forEach((layer, index) => {
        story.fromTo(layer, {
          xPercent: index % 2 === 0 ? -3.5 : 3.5,
          yPercent: index % 3 === 0 ? 2 : -1.5,
          scale: 1.055,
        }, {
          xPercent: index % 2 === 0 ? 3.5 : -3.5,
          yPercent: index % 3 === 0 ? -2 : 1.5,
          scale: 1.015,
          duration: 1,
          ease: "none",
        }, 0);
      });

      const refresh = () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => { measure(); ScrollTrigger.refresh(); });
      };
      window.addEventListener("resize", refresh);
      updateActiveCard();

      return () => {
        cancelAnimationFrame(resizeFrame);
        window.removeEventListener("resize", refresh);
        section.classList.remove("is-horizontal");
        cards.forEach((card) => delete card.dataset.active);
      };
    }, section);

    matchMedia.add({
      editorial: "(max-width: 1099px), (max-height: 649px)",
      mobile: "(max-width: 767px)",
      motion: "(prefers-reduced-motion: no-preference)",
    }, (context) => {
      if (!context.conditions?.editorial || !context.conditions?.motion) return;
      section.classList.add("is-editorial");
      const animations: gsap.core.Animation[] = [];

      if (context.conditions?.mobile) {
        const [firstCard, ...streamCards] = cards;
        if (firstCard) {
          animations.push(gsap.fromTo(firstCard, {
            x: 28,
            y: 58,
            autoAlpha: 0.66,
          }, {
            x: 0,
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: firstCard,
              start: "top 102%",
              end: "bottom 48%",
              scrub: 0.72,
              invalidateOnRefresh: true,
            },
          }));
        }

        streamCards.forEach((card, index) => {
          const direction = [18, -13, 10, -17, 12, -8, 14][index] ?? 0;
          const rise = [48, 42, 56, 44, 52, 42, 48][index] ?? 46;
          animations.push(gsap.fromTo(card, {
            x: direction,
            y: rise,
            autoAlpha: 0.54,
          }, {
            x: 0,
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 97%",
              end: "bottom 28%",
              scrub: 0.68,
              invalidateOnRefresh: true,
            },
          }));
        });

        animations.push(gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.75,
            invalidateOnRefresh: true,
          },
        }).to(scene, {
          "--gallery-bg": "#101614",
          duration: 0.3,
          ease: "none",
        }).to(scene, {
          "--gallery-bg": "#aeb6a9",
          "--gallery-fg": "#111415",
          "--gallery-muted": "rgba(17,20,21,.7)",
          "--gallery-line": "rgba(17,20,21,.12)",
          duration: 0.28,
          ease: "none",
        }).to(scene, {
          "--gallery-bg": "#f3f2ed",
          "--gallery-fg": "#111415",
          "--gallery-muted": "rgba(17,20,21,.62)",
          "--gallery-line": "rgba(17,20,21,.11)",
          duration: 0.42,
          ease: "none",
        }));
      } else {
        cards.forEach((card) => animations.push(gsap.fromTo(card, {
          y: 28,
          autoAlpha: 0,
        }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        })));
      }

      if (final) {
        animations.push(gsap.fromTo(final.querySelectorAll("span"), {
          yPercent: 105,
          autoAlpha: 0,
        }, {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.08,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: { trigger: final, start: "top 82%", once: true },
        }));
      }
      return () => {
        animations.forEach((animation) => animation.revert());
        section.classList.remove("is-editorial");
      };
    }, section);

    return () => matchMedia.revert();
  }, [scrollTriggerId]);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const videos = Array.from(section.querySelectorAll<HTMLVideoElement>("video"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibility = new Map(videos.map((video) => [video, 0]));
    const syncPlayback = () => {
      let activeVideo: HTMLVideoElement | null = null;
      let highestRatio = 0.45;
      if (!document.hidden && !reducedMotion.matches) {
        visibility.forEach((ratio, video) => {
          if (ratio > highestRatio) { activeVideo = video; highestRatio = ratio; }
        });
      }
      videos.forEach((video) => {
        if (video === activeVideo) {
          if (video.paused) void video.play().catch(() => {});
        } else if (!video.paused) video.pause();
      });
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visibility.set(entry.target as HTMLVideoElement, entry.isIntersecting ? entry.intersectionRatio : 0));
      syncPlayback();
    }, { threshold: [0, 0.25, 0.45, 0.65, 0.85], rootMargin: "8%" });
    videos.forEach((video) => observer.observe(video));
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      videos.forEach((video) => video.pause());
    };
  }, [items]);

  useEffect(() => () => {
    if (refreshFrame.current !== null) cancelAnimationFrame(refreshFrame.current);
  }, []);

  const refreshLayout = () => {
    if (refreshFrame.current !== null) cancelAnimationFrame(refreshFrame.current);
    refreshFrame.current = requestAnimationFrame(() => {
      refreshFrame.current = null;
      ScrollTrigger.refresh();
    });
  };

  return <section id={scrollTriggerId} ref={root} className="projects-visual-gallery" aria-label={ariaLabel}>
    <div ref={stage} className="projects-visual-gallery-stage">
      <header className="projects-visual-gallery-header">
        <p>{eyebrow}</p>
        <h2 id={headingId}><span>{heading[0]}</span><span>{heading[1]}</span></h2>
      </header>

      <div ref={viewport} className="projects-visual-gallery-viewport">
        <ol ref={track} className="projects-visual-gallery-track">
          {items.map((item, index) => <li key={item.id} className={`projects-visual-gallery-card is-${item.format} is-${item.level}`} data-active={index === 0 ? "true" : "false"}>
            <figure>
              <div className="projects-visual-gallery-media"><div className="projects-visual-gallery-media-layer">
                {item.type === "video" ? <ProgressiveVideo
                  src={assetPath(item.src)}
                  poster={item.poster ? assetPath(item.poster) : undefined}
                  aria-label={item.alt}
                  muted loop playsInline preload="none"
                  onLoadedMetadata={refreshLayout}
                /> : <ProgressiveImage
                  src={assetPath(item.src)} alt={item.alt} fill
                  sizes="(max-width: 767px) 88vw, (max-width: 1099px) 70vw, 38vw"
                  onLoad={refreshLayout}
                />}
              </div></div>
              <figcaption><span>{number(index + 1)} / {item.label}</span><strong>{item.detail}</strong></figcaption>
            </figure>
          </li>)}
        </ol>
      </div>

      <footer className="projects-visual-gallery-footer">
        <p><span data-gallery-current>01</span> / {number(items.length)}</p>
        <div aria-hidden="true"><span data-gallery-progress /></div>
        <p>{footerPrompt} <span aria-hidden="true">→</span></p>
      </footer>

      <div className="projects-visual-gallery-final">
        {finalLines.map((line) => <p key={line}><span>{line}</span></p>)}
        <small>{finalLabel}</small>
      </div>
    </div>
  </section>;
}
