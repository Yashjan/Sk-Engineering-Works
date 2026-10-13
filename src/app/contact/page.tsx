import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import ContactPageExperience from "@/components/contact/ContactPageExperience";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Contact | S.K. Engineering Works",
  description: "Contact S.K. Engineering Works in Sambhar Lake, Rajasthan for industrial machinery, material handling systems and complete salt refinery plant requirements.",
};

export default function ContactPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));
  return <><a className="skip-link" href="#main">Skip to content</a><Navbar hasLogo={hasLogo} /><main id="main"><ContactPageExperience /></main></>;
}
