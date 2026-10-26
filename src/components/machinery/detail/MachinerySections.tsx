import Image from "next/image";
import type { MachineryConfig } from "@/data/machinery-details";
import { assetPath } from "@/lib/asset-path";
export function MachineryComingSoon3D({ machine }: { machine: MachineryConfig }) {
  return <section className="machine-coming machine-section" aria-labelledby="machine-3d-title"><p className="machine-eyebrow">04 / DIGITAL INSPECTION</p><div className="machine-coming-grid"><h2 id="machine-3d-title">SEE IT FROM<br />EVERY ANGLE.</h2><div><p className="machine-coming-status">INTERACTIVE 3D EXPERIENCE<br /><strong>COMING SOON</strong></p><p>Explore the {machine.name}, its components and how it works in a future interactive 3D experience.</p></div></div></section>;
}
export function MachineryCustomization({ machine }: { machine: MachineryConfig }) {
  return <section className="machine-section" aria-labelledby="machine-custom-title"><p className="machine-eyebrow">07 / CONFIGURATION</p><h2 id="machine-custom-title">BUILT FOR<br />YOUR REQUIREMENT.</h2><div className="machine-editorial-list">{machine.customization.map((item, index) => <details key={item.title}><summary><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</summary><p>{item.description}</p></details>)}</div></section>;
}
export function MachineryFabrication({ machine }: { machine: MachineryConfig }) {
  return <section className="machine-section machine-fabrication" aria-labelledby="machine-fabrication-title"><p className="machine-eyebrow">08 / REAL FABRICATION</p><h2 id="machine-fabrication-title">REAL MACHINE.<br />REAL FABRICATION.</h2>{machine.realMedia.length ? <div className="machine-media-grid">{machine.realMedia.map((media) => <figure key={media.src}>{media.type === "image" ? <Image src={assetPath(media.src)} alt={media.alt} width={1200} height={800} sizes="(max-width: 767px) 88vw, 45vw" /> : <video controls playsInline preload="none" poster={media.poster ? assetPath(media.poster) : undefined} aria-label={media.alt}><source src={assetPath(media.src)} /></video>}<figcaption>{media.caption}</figcaption></figure>)}</div> : <div className="machine-asset-note"><span>WORKSHOP / {machine.name.toUpperCase()}</span><p>Dedicated {machine.name} fabrication photography is not yet available in this project archive.</p><a href="#machine-enquiry">ASK ABOUT FABRICATION & INSTALLATION →</a></div>}</section>;
}
