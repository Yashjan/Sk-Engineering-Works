import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import { localeHtml } from "@/i18n/config";
import "./globals.css";
import "./(english)/not-found.css";

// Served for every unmatched URL (exported as out/404.html). The app has two root
// layouts, so this page brings its own <html>, global styles and navigation.
export const metadata: Metadata = {
  title: "Page Not Found | S.K. Engineering Works",
  description: "The requested page could not be found.",
};

export const viewport: Viewport = { themeColor: "#0B0D0E" };

export default function GlobalNotFound() {
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/common/brand/sk-logo.png"));
  return (
    <html lang={localeHtml.en.lang} dir={localeHtml.en.dir} data-locale="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar hasLogo={hasLogo} />
        <main id="main" className="not-found-page">
          <p>ERROR / 404</p>
          <h1><span>PAGE NOT</span><span>FOUND.</span></h1>
          {/* next/link adds the basePath, so this resolves to /Sk-Engineering-Works/ in production. */}
          <Link href="/">BACK TO HOME <span aria-hidden="true">↗</span></Link>
        </main>
      </body>
    </html>
  );
}
