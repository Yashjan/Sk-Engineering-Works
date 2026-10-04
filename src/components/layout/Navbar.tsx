"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = ["Home", "Salt Refinery Plants", "Machinery", "Projects", "About", "Contact"];
// Routes can be assigned as the corresponding pages are built.
const destinations = ["/", "#process", "#process", "#process", "#process", "#process"];

export default function Navbar({ hasLogo }: { hasLogo: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const elements = [toggle.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const resize = () => { if (window.innerWidth >= 1100) setOpen(false); };
    window.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", keydown); window.removeEventListener("resize", resize); };
  }, [open]);

  return <header className={`navbar ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`} data-navbar>
    <nav className="nav-inner" aria-label="Main navigation">
      <Link href="/" className="logo-link" aria-label="S.K. Engineering Works home">
        {hasLogo ? <Image src="/images/sk-logo.png" alt="S.K. Engineering Works" width={160} height={64} className="logo" priority /> : <span className="logo-placeholder" aria-hidden="true" />}
      </Link>
      <div className="desktop-links">{links.map((label, i) => <Link key={label} href={destinations[i]} aria-current={i === 0 ? "page" : undefined}>{label}</Link>)}</div>
      <a className="nav-quote" href="#process">Get a Quote <span aria-hidden="true">→</span></a>
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen(!open)}><span /><span /></button>
      <div ref={panel} id="mobile-navigation" className="mobile-panel" hidden={!open}>
        {links.map((label, i) => <Link key={label} href={destinations[i]} aria-current={i === 0 ? "page" : undefined} onClick={() => { setOpen(false); toggle.current?.focus(); }}><span className="menu-index">0{i + 1}</span>{label}</Link>)}
        <a href="#process" className="mobile-quote" onClick={() => setOpen(false)}>Get a Quote →</a>
      </div>
    </nav>
  </header>;
}
