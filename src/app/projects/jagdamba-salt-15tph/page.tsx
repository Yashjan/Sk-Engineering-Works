import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import { createPageMetadata } from "@/config/site";
import "./project-detail-shell.css";

export const metadata: Metadata = createPageMetadata({
  title: "Jagdamba Salt 15 TPH Refinery",
  description: "Jagdamba Salt Pvt. Ltd. 15 TPH salt refinery project in Phalodi, Rajasthan.",
  path: "/projects/jagdamba-salt-15tph",
  index: false,
});

export default function JagdambaProjectPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main" className="project-detail-shell">
        <p className="project-detail-record">FIELD RECORD / 001</p>
        <p className="project-detail-client">JAGDAMBA SALT PVT. LTD.</p>
        <h1><span>15 TPH</span><span>SALT REFINERY.</span></h1>
        <p className="project-detail-location">PHALODI, RAJASTHAN</p>
        <p className="project-detail-status">PROJECT EXPERIENCE COMING NEXT</p>
        <Link href="/projects#field-records">BACK TO PROJECTS <span aria-hidden="true">&rarr;</span></Link>
      </main>
    </>
  );
}
