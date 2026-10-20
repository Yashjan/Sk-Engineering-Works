"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./site-footer.css";

const footerLinks = [
  ["HOME", "/"],
  ["SALT REFINERY PLANTS", "/salt-refinery-plants"],
  ["MACHINERY", "/machinery"],
  ["PROJECTS", "/projects"],
  ["ABOUT", "/about"],
  ["CONTACT", "/contact"],
] as const;

export default function SiteFooter({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const currentPath = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");

  return <footer className={`enquiry-footer site-footer${className ? ` ${className}` : ""}`}>
    <nav aria-label="Footer navigation" data-motion="reveal-up">
      {footerLinks.map(([label, href]) => <Link key={href} href={href} aria-current={currentPath === href ? "page" : undefined}>{label}</Link>)}
    </nav>
  </footer>;
}
