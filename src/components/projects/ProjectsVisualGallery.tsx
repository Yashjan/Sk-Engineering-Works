"use client";

import ProgressiveVideo from "@/components/media/ProgressiveVideo";

import Image from "@/components/media/ProgressiveImage";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  finalLines = ["FROM DRAWING", "TO FABRICATION", "TO THE FIELD."],
  finalLabel = "ENGINEERED / BUILT / INSTALLED",
  scrollTriggerId = "projects-visual-gallery",
}: ProjectsVisualGalleryProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const mobileStory = useRef<HTMLDivElement>(null);
  const refreshFrame = useRef<number | null>(null);

  useLayoutEffect(() => {
    const section = root.current;
    const scene = stage.current;
    const frame = viewport.current;
    const rail = track.current;
    if (!section || !scene || !frame || !rail) return;

    gsap.registerPlugin(ScrollTrigger);
    const cards = Array.from(rail.querySelectorAll<HTMLElement>(".projects-visual-gallery-card"));
    const mediaLayers = Array.from(rail.querySelectorAll<HTMLElement>(".projects-visual-gallery-media-layer"));
    const current = scene.querySelector<HTMLElement>("[data-gallery-current]");
    const progress = scene.querySelector<HTMLElement>("[data-gallery-progress]");
    const media = gsap.matchMedia();

    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 768px)",
    }, (context) => {
      const motion = Boolean(context.conditions?.motion);
      const desktop = Boolean(context.conditions?.desktop);
      if (!desktop) return;
      let travel = 0;
      let active = -1;

      const measure = () => {
        travel = Math.max(0, rail.scrollWidth - frame.clientWidth);
      };

      const render = () => {
        const sceneCenter = scene.getBoundingClientRect().left + scene.clientWidth / 2;
        let nearest = 0;
        let nearestDistance = Infinity;
        cards.forEach((card, index) => {
          const bounds = card.getBoundingClientRect();
          const distance = Math.abs(bounds.left + bounds.width / 2 - sceneCenter);
          if (distance < nearestDistance) {
            nearest = index;
            nearestDistance = distance;
          }
        });
        cards.forEach((card, index) => { card.dataset.active = String(index === nearest); });
        if (nearest !== active) {
          active = nearest;
          if (current) current.textContent = number(nearest + 1);
        }
      };

      measure();
      if (!motion || travel <= 0) {
        section.classList.add("is-static");
        render();
        return () => section.classList.remove("is-static");
      }

      section.classList.add("is-animated");
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: "top 92%",
          end: "top top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      intro
        .fromTo(cards[0], { xPercent: 62, yPercent: 64, autoAlpha: 0.18 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, ease: "power3.out", duration: 1 }, 0)
        .fromTo(cards[1], { xPercent: 88, yPercent: 92, autoAlpha: 0 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, ease: "power3.out", duration: 1 }, 0.12)
        .fromTo(".projects-visual-gallery-header", { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.72 }, 0.08);

      const story = gsap.timeline({
        scrollTrigger: {
          id: scrollTriggerId,
          trigger: scene,
          start: "top top",
          end: () => {
            measure();
            const minimum = window.innerHeight * 1.8;
            return `+=${Math.max(minimum, travel * 0.62)}`;
          },
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            render();
          },
        },
      });
      story
        .to(rail, { x: () => -travel, duration: 1, ease: "none" }, 0)
        .to(scene, {
          "--gallery-bg": "#aeb6a9",
          "--gallery-fg": "#111415",
          "--gallery-muted": "rgba(17,20,21,.56)",
          "--gallery-line": "rgba(17,20,21,.12)",
          duration: 0.38,
          ease: "none",
        }, 0.18)
        .to(scene, {
          "--gallery-bg": "#f3f2ed",
          "--gallery-fg": "#111415",
          "--gallery-muted": "rgba(17,20,21,.52)",
          "--gallery-line": "rgba(17,20,21,.11)",
          duration: 0.46,
          ease: "none",
        }, 0.54);

      mediaLayers.forEach((layer, index) => {
        story.fromTo(layer, {
          xPercent: index % 2 === 0 ? -5 : 5,
          yPercent: index % 3 === 0 ? 3 : -2,
          scale: 1.08,
        }, {
          xPercent: index % 2 === 0 ? 5 : -5,
          yPercent: index % 3 === 0 ? -3 : 2,
          scale: 1.02,
          duration: 1,
          ease: "none",
        }, 0);
      });
      story.eventCallback("onUpdate", () => {
        render();
        if (progress) progress.style.transform = `scaleX(${story.progress()})`;
      });

      let resizeFrame = 0;
      const refresh = () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          measure();
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
      };
      refresh();
      window.addEventListener("resize", refresh);
      render();

      return () => {
        cancelAnimationFrame(resizeFrame);
        window.removeEventListener("resize", refresh);
        section.classList.remove("is-animated");
        cards.forEach((card) => delete card.dataset.active);
      };
    }, section);

    return () => media.revert();
  }, [scrollTriggerId]);

  useLayoutEffect(() => {
    const story = mobileStory.current;
    if (!story) return;

    gsap.registerPlugin(ScrollTrigger);
    const firstCard = story.querySelector<HTMLElement>(".projects-visual-gallery-mobile-first");
    const streamCards = Array.from(story.querySelectorAll<HTMLElement>(".projects-visual-gallery-mobile-card"));
    const final = story.querySelector<HTMLElement>(".projects-visual-gallery-mobile-final");
    const media = gsap.matchMedia();

    media.add({
      mobile: "(max-width: 767px)",
      motion: "(prefers-reduced-motion: no-preference)",
    }, (context) => {
      const mobile = Boolean(context.conditions?.mobile);
      const motion = Boolean(context.conditions?.motion);
      if (!mobile) return;
      if (!motion) {
        story.classList.add("is-static");
        return () => story.classList.remove("is-static");
      }

      story.classList.add("is-animated");
      const animations: gsap.core.Animation[] = [];
      if (firstCard) {
        animations.push(gsap.fromTo(firstCard, {
          x: 28,
          y: 104,
          autoAlpha: 0.66,
        }, {
          x: 0,
          y: -18,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: firstCard,
            start: "top 98%",
            end: "bottom 42%",
            scrub: 0.72,
            invalidateOnRefresh: true,
          },
        }));
      }

      streamCards.forEach((card, index) => {
        const direction = [18, -13, 10, -17, 12, -8][index] ?? 0;
        const rise = [88, 72, 104, 78, 96, 74][index] ?? 84;
        animations.push(gsap.fromTo(card, {
          x: direction,
          y: rise,
          autoAlpha: 0.54,
        }, {
          x: 0,
          y: index % 2 === 0 ? -24 : -14,
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

      const palette = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      palette
        .to(story, { "--gallery-bg": "#101614", duration: 0.3, ease: "none" })
        .to(story, {
          "--gallery-bg": "#aeb6a9",
          "--gallery-fg": "#111415",
          "--gallery-muted": "rgba(17,20,21,.56)",
          "--gallery-line": "rgba(17,20,21,.12)",
          duration: 0.28,
          ease: "none",
        })
        .to(story, {
          "--gallery-bg": "#f3f2ed",
          "--gallery-fg": "#111415",
          "--gallery-muted": "rgba(17,20,21,.52)",
          "--gallery-line": "rgba(17,20,21,.11)",
          duration: 0.42,
          ease: "none",
        });
      animations.push(palette);

      if (final) {
        animations.push(gsap.fromTo(final.querySelectorAll("span"), {
          yPercent: 108,
          autoAlpha: 0,
        }, {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: final, start: "top 78%", once: true },
        }));
      }

      const refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      return () => {
        cancelAnimationFrame(refreshFrame);
        animations.forEach((animation) => animation.revert());
        story.classList.remove("is-animated");
      };
    }, story);

    return () => media.revert();
  }, []);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const videos = Array.from(section.querySelectorAll<HTMLVideoElement>("video"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibility = new Map(videos.map((video) => [video, 0]));
    const syncPlayback = () => {
      let active: HTMLVideoElement | null = null;
      let highestVisibility = 0.18;

      if (!reducedMotion.matches && !document.hidden) {
        visibility.forEach((ratio, video) => {
          if (ratio > highestVisibility) {
            active = video;
            highestVisibility = ratio;
          }
        });
      }

      videos.forEach((video) => {
        if (video === active) void video.play().catch(() => {});
        else video.pause();
      });
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        visibility.set(video, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      syncPlayback();
    }, { threshold: [0, 0.18, 0.35, 0.5, 0.75], rootMargin: "12%" });
    videos.forEach((video) => observer.observe(video));
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      videos.forEach((video) => video.pause());
    };
  }, []);

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

  return (
    <section ref={root} className="projects-visual-gallery" aria-label={ariaLabel}>
      <div ref={stage} className="projects-visual-gallery-stage">
        <header className="projects-visual-gallery-header">
          <p>{eyebrow}</p>
          <h2 id={headingId}>
            <span>{heading[0]}</span>
            <span>{heading[1]}</span>
          </h2>
        </header>

        <div ref={viewport} className="projects-visual-gallery-viewport">
          <ol ref={track} className="projects-visual-gallery-track">
            {items.map((item, index) => (
              <li
                key={item.id}
                className={`projects-visual-gallery-card is-${item.format} is-${item.level}`}
                data-active={index === 0 ? "true" : "false"}
              >
                <figure>
                  <div className="projects-visual-gallery-media">
                    <div className="projects-visual-gallery-media-layer">
                      {item.type === "video" ? (
                        <ProgressiveVideo
                          src={assetPath(item.src)}
                          poster={item.poster ? assetPath(item.poster) : undefined}
                          aria-label={item.alt}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onLoadedMetadata={refreshLayout}
                        />
                      ) : (
                        <Image
                          src={assetPath(item.src)}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 767px) 78vw, (max-width: 1199px) 46vw, 36vw"
                          onLoad={refreshLayout}
                        />
                      )}
                    </div>
                  </div>
                  <figcaption>
                    <span>{number(index + 1)} / {item.label}</span>
                    <strong>{item.detail}</strong>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>

        <footer className="projects-visual-gallery-footer">
          <p><span data-gallery-current>01</span> / {number(items.length)}</p>
          <div aria-hidden="true"><span data-gallery-progress /></div>
          <p>{footerPrompt} <span aria-hidden="true">→</span></p>
        </footer>
      </div>

      <div ref={mobileStory} className="projects-visual-gallery-mobile">
        <div className="projects-visual-gallery-mobile-intro">
          <header className="projects-visual-gallery-mobile-header">
            <p>{eyebrow}</p>
            <h2>
              <span>{heading[0]}</span>
              <span>{heading[1]}</span>
            </h2>
          </header>
          <article className={`projects-visual-gallery-mobile-first is-${items[0].format}`}>
            <figure>
              <div className="projects-visual-gallery-mobile-media">
                {items[0].type === "video" ? (
                  <ProgressiveVideo
                    src={assetPath(items[0].src)}
                    poster={items[0].poster ? assetPath(items[0].poster) : undefined}
                    aria-label={items[0].alt}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={refreshLayout}
                  />
                ) : (
                  <Image src={assetPath(items[0].src)} alt={items[0].alt} fill sizes="82vw" onLoad={refreshLayout} />
                )}
              </div>
              <figcaption><span>01 / {items[0].label}</span><strong>{items[0].detail}</strong></figcaption>
            </figure>
          </article>
        </div>

        <ol className="projects-visual-gallery-mobile-stream">
          {items.slice(1).map((item, index) => (
            <li key={item.id} className={`projects-visual-gallery-mobile-card is-${item.format}`}>
              <figure>
                <div className="projects-visual-gallery-mobile-media">
                  {item.type === "video" ? (
                    <ProgressiveVideo
                      src={assetPath(item.src)}
                      poster={item.poster ? assetPath(item.poster) : undefined}
                      aria-label={item.alt}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={refreshLayout}
                    />
                  ) : (
                    <Image src={assetPath(item.src)} alt={item.alt} fill sizes="(max-width: 767px) 84vw, 1px" onLoad={refreshLayout} />
                  )}
                </div>
                <figcaption><span>{number(index + 2)} / {item.label}</span><strong>{item.detail}</strong></figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <div className="projects-visual-gallery-mobile-final">
          <p><span>{finalLines[0]}</span></p>
          <p><span>{finalLines[1]}</span></p>
          <p><span>{finalLines[2]}</span></p>
          <small>{finalLabel}</small>
        </div>
      </div>
    </section>
  );
}
