import type { Metadata, Viewport } from "next";
import SiteIntro from "@/components/layout/SiteIntro";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteAssetUrl, absoluteUrl, siteConfig } from "@/config/site";
import { siteStructuredData } from "@/lib/structured-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "S.K. Engineering Works | Industrial Machinery & Salt Refinery Plants",
    template: "%s | S.K. Engineering Works",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: "S.K. Engineering Works | Industrial Machinery & Salt Refinery Plants",
    description: siteConfig.description,
    url: absoluteUrl(),
    images: [{
      url: absoluteAssetUrl(siteConfig.socialImage),
      width: 1600,
      height: 900,
      alt: "S.K. Engineering Works completed salt refinery plant",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "S.K. Engineering Works | Industrial Machinery & Salt Refinery Plants",
    description: siteConfig.description,
    images: [absoluteAssetUrl(siteConfig.socialImage)],
  },
};

export const viewport: Viewport = { themeColor: "#0B0D0E" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const introScript = `(function(){try{document.documentElement.dataset.skIntro='active';}catch(e){}})();`;
  return <html lang="en-IN" data-scroll-behavior="smooth" suppressHydrationWarning><head>
    {/* Activate the global hard-load intro before route content can paint. */}
    <script dangerouslySetInnerHTML={{ __html: introScript }} />
    <JsonLd data={siteStructuredData} />
  </head><body><SiteIntro />{children}</body></html>;
}
