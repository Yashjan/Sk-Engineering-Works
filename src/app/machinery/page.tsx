import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import MachineryHero from "@/components/machinery/MachineryHero";

export const metadata: Metadata = {
  title: "Industrial Machinery | S.K. Engineering Works",
  description: "Industrial machinery and process equipment engineered by S.K. Engineering Works for material handling, processing, air movement, screening and storage applications.",
};

export default function MachineryPage() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main">
        <MachineryHero />
      </main>
    </>
  );
}
