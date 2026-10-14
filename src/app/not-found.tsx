import Link from "next/link";
import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import "./not-found.css";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | S.K. Engineering Works" },
  description: "The requested page could not be found.",
};

export default function NotFound() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main" className="not-found-page">
        <p>ERROR / 404</p>
        <h1><span>PAGE NOT</span><span>FOUND.</span></h1>
        <Link href="/">BACK TO HOME <span aria-hidden="true">↗</span></Link>
      </main>
    </>
  );
}
