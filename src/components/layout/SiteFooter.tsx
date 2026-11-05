"use client";
/** @jsxImportSource @/i18n/react */

import Link from "@/components/i18n/LocalizedLink";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { localeFromPathname, localizePathname, stripLocale, type Locale } from "@/i18n/config";
import "./site-footer.css";

const footerLabels: Record<Locale, string[]> = {
  en: ["HOME", "SALT REFINERY PLANTS", "MACHINERY", "PROJECTS", "ABOUT", "CONTACT"],
  hi: ["होम", "नमक रिफाइनरी संयंत्र", "मशीनरी", "परियोजनाएँ", "हमारे बारे में", "संपर्क"],
  ar: ["الرئيسية", "مصانع تكرير الملح", "الآلات", "المشاريع", "من نحن", "اتصل بنا"],
};
const footerDestinations = ["/", "/salt-refinery-plants", "/machinery", "/projects", "/about", "/contact"];

type SocialNetwork = keyof typeof siteConfig.socialLinks;

const socialLabels: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

function SocialIcon({ network }: { network: SocialNetwork }) {
  if (network === "instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.25" /><circle className="social-icon-fill" cx="17.4" cy="6.7" r="1" /></svg>;
  }

  if (network === "youtube") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8.2c-.2-1.5-1.3-2.7-2.8-2.9C16.5 5 14.3 5 12 5s-4.5 0-6.2.3C4.3 5.5 3.2 6.7 3 8.2A27 27 0 0 0 2.8 12c0 1.3 0 2.6.2 3.8.2 1.5 1.3 2.7 2.8 2.9 1.7.3 3.9.3 6.2.3s4.5 0 6.2-.3c1.5-.2 2.6-1.4 2.8-2.9.2-1.2.2-2.5.2-3.8s0-2.6-.2-3.8Z" /><path className="social-icon-fill" d="m10 9 5 3-5 3V9Z" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5v10M6.5 5.5v.1M10.5 18.5v-6c0-2.1 1.4-3.5 3.4-3.5 2.2 0 3.6 1.5 3.6 4v5.5M10.5 9.5v9" /></svg>;
}

export default function SiteFooter({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const unprefixedPath = stripLocale(pathname);
  const currentPath = unprefixedPath === "/" ? unprefixedPath : unprefixedPath.replace(/\/+$/, "");
  const socialLinks = Object.entries(siteConfig.socialLinks).filter(
    (entry): entry is [SocialNetwork, string] => Boolean(entry[1]),
  );

  return <footer className={`enquiry-footer site-footer${className ? ` ${className}` : ""}`}>
    <div className="site-footer-row">
      <nav aria-label="Footer navigation">
        {footerDestinations.map((href, index) => <Link key={href} href={localizePathname(href, locale)} aria-current={currentPath === href ? "page" : undefined}>{footerLabels[locale][index]}</Link>)}
      </nav>
      <nav className="site-footer-socials" aria-label="Social media">
        {socialLinks.map(([network, href]) => (
          <a key={network} href={href} target="_blank" rel="noreferrer" data-social={network} aria-label={`Follow S.K. Engineering Works on ${socialLabels[network]}`} title={socialLabels[network]}>
            <SocialIcon network={network} />
          </a>
        ))}
      </nav>
    </div>
  </footer>;
}
