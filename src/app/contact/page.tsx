import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import ContactPageExperience from "@/components/contact/ContactPageExperience";
import Navbar from "@/components/layout/Navbar";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createPageMetadata } from "@/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contact S.K. Engineering Works | Machinery & Plant Enquiries",
  description: "Contact S.K. Engineering Works in Sambhar Lake, Rajasthan for industrial machinery, material handling systems, salt refinery equipment and complete plant enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));
  return <><BreadcrumbJsonLd currentName="Contact" currentPath="/contact" /><a className="skip-link" href="#main">Skip to content</a><Navbar hasLogo={hasLogo} /><main id="main"><ContactPageExperience /></main></>;
}
