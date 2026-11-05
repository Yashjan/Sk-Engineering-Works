"use client";
/** @jsxImportSource @/i18n/react */

import Image from "@/components/media/ProgressiveImage";
import Link from "@/components/i18n/LocalizedLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/asset-path";
import { localeFromPathname, localeLabels, locales, localizePathname, stripLocale, type Locale } from "@/i18n/config";

const links: Record<Locale, string[]> = {
  en: ["Home", "Salt Refinery Plants", "Machinery", "Projects", "Engineering", "About", "Contact"],
  hi: ["होम", "नमक रिफाइनरी संयंत्र", "मशीनरी", "परियोजनाएँ", "इंजीनियरिंग", "हमारे बारे में", "संपर्क"],
  ar: ["الرئيسية", "مصانع تكرير الملح", "الآلات", "المشاريع", "الهندسة", "من نحن", "اتصل بنا"],
};
const quoteLabels: Record<Locale, string> = { en: "Get a Quote", hi: "कोटेशन प्राप्त करें", ar: "اطلب عرض سعر" };
const compactQuoteLabels: Record<Locale, string> = { en: "Quote", hi: "कोटेशन", ar: "عرض سعر" };
const languageMenuLabels: Record<Locale, string> = { en: "Language", hi: "भाषा", ar: "اللغة" };
const openMenuLabels: Record<Locale, string> = { en: "Open navigation menu", hi: "नेविगेशन मेनू खोलें", ar: "افتح قائمة التنقل" };
const closeMenuLabels: Record<Locale, string> = { en: "Close navigation menu", hi: "नेविगेशन मेनू बंद करें", ar: "أغلق قائمة التنقل" };
const homepageDestinations = ["/", "/salt-refinery-plants", "/machinery", "/projects", "/engineering", "/about", "/contact"];
const innerPageDestinations = ["/", "/salt-refinery-plants", "/machinery", "/projects", "/engineering", "/about", "/contact"];

function GlobeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5" /></svg>;
}

export default function Navbar({ hasLogo }: { hasLogo: boolean }) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const unprefixedPath = stripLocale(pathname);
  const currentPath = unprefixedPath === "/" ? unprefixedPath : unprefixedPath.replace(/\/+$/, "");
  const destinations = currentPath === "/" ? homepageDestinations : innerPageDestinations;
  const localizedDestinations = destinations.map((destination) => localizePathname(destination, locale));
  const quoteDestination = localizePathname("/contact#project-enquiry", locale);
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const languageControl = useRef<HTMLDivElement>(null);
  const languageButton = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!languageOpen) return;
    const close = (event: PointerEvent) => {
      if (!languageControl.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setLanguageOpen(false); languageButton.current?.focus(); }
      const items = Array.from(languageControl.current?.querySelectorAll<HTMLAnchorElement>("[role='menuitemradio']") ?? []);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = currentIndex < 0 ? (direction > 0 ? 0 : items.length - 1) : (currentIndex + direction + items.length) % items.length;
        items[nextIndex]?.focus();
      }
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        items[event.key === "Home" ? 0 : items.length - 1]?.focus();
      }
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", keydown);
    return () => { window.removeEventListener("pointerdown", close); window.removeEventListener("keydown", keydown); };
  }, [languageOpen]);

  const selectLanguage = (nextLocale: Locale) => {
    window.localStorage.setItem("sk-language", nextLocale);
    setLanguageOpen(false);
    setOpen(false);
  };

  return <header className={`navbar ${currentPath === "/" ? "" : "is-inner-page"} ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`} data-navbar>
    <nav className="nav-inner" aria-label={locale === "hi" ? "मुख्य नेविगेशन" : locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
      <Link href={localizePathname("/", locale)} className="logo-link" aria-label="S.K. Engineering Works home">
        {hasLogo ? <Image src={assetPath("/images/common/brand/sk-logo.png")} alt="S.K. Engineering Works" width={160} height={64} className="logo" priority /> : <span className="logo-placeholder" aria-hidden="true" />}
      </Link>
      <div className="desktop-links">{links[locale].map((label, i) => <Link key={destinations[i]} href={localizedDestinations[i]} aria-current={(currentPath === "/" && i === 0) || (currentPath === "/salt-refinery-plants" && i === 1) || (currentPath === "/machinery" && i === 2) || (currentPath === "/projects" && i === 3) || (currentPath === "/engineering" && i === 4) || (currentPath === "/about" && i === 5) || (currentPath === "/contact" && i === 6) ? "page" : undefined}>{label}</Link>)}</div>
      <div ref={languageControl} className={`language-selector${languageOpen ? " is-open" : ""}`}>
        <button ref={languageButton} type="button" className="language-selector-toggle" aria-haspopup="menu" aria-expanded={languageOpen} aria-label={locale === "hi" ? "भाषा चुनें" : locale === "ar" ? "اختر اللغة" : "Select language"} onClick={() => setLanguageOpen((value) => !value)} onKeyDown={(event) => { if (!languageOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) { event.preventDefault(); setLanguageOpen(true); } }}><GlobeIcon /><span>{locale.toUpperCase()}</span><b aria-hidden="true">⌄</b></button>
        <div className="language-selector-menu" role="menu" hidden={!languageOpen} aria-label={languageMenuLabels[locale]} data-no-translate>
          {locales.map((option) => <Link key={option} href={localizePathname(pathname, option)} role="menuitemradio" aria-checked={locale === option} data-locale-switch="true" onClick={() => selectLanguage(option)}><span data-no-translate>{localeLabels[option]}</span>{locale === option ? <b aria-hidden="true">✓</b> : null}</Link>)}
        </div>
      </div>
      <Link className="nav-quote" href={quoteDestination}><span className="nav-quote-full">{quoteLabels[locale]}</span><span className="nav-quote-compact">{compactQuoteLabels[locale]}</span><span className="nav-quote-arrow" aria-hidden="true">→</span></Link>
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? closeMenuLabels[locale] : openMenuLabels[locale]} onClick={() => setOpen(!open)}><span /><span /></button>
      <div ref={panel} id="mobile-navigation" className="mobile-panel" hidden={!open} data-lenis-prevent>
        {links[locale].map((label, i) => <Link key={destinations[i]} href={localizedDestinations[i]} aria-current={(currentPath === "/" && i === 0) || (currentPath === "/salt-refinery-plants" && i === 1) || (currentPath === "/machinery" && i === 2) || (currentPath === "/projects" && i === 3) || (currentPath === "/engineering" && i === 4) || (currentPath === "/about" && i === 5) || (currentPath === "/contact" && i === 6) ? "page" : undefined} onClick={() => { setOpen(false); toggle.current?.focus(); }}><span className="menu-index">0{i + 1}</span>{label}</Link>)}
        <Link href={quoteDestination} className="mobile-quote" onClick={() => setOpen(false)}>{quoteLabels[locale]} →</Link>
      </div>
    </nav>
  </header>;
}
