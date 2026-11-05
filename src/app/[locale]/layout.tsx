import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import LocaleRuntime from "@/components/i18n/LocaleRuntime";
import LanguagePreferenceSync from "@/components/i18n/LanguagePreferenceSync";
import SiteIntro from "@/components/layout/SiteIntro";
import GlobalMotionSystem from "@/components/motion/GlobalMotionSystem";
import RouteTransitionProvider from "@/components/transitions/RouteTransitionProvider";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteAssetUrl, siteConfig } from "@/config/site";
import { siteStructuredData } from "@/lib/structured-data";
import { isTranslatedLocale, localeHtml, translatedLocales } from "@/i18n/config";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  openGraph: { siteName: siteConfig.name, images: [{ url: absoluteAssetUrl(siteConfig.socialImage), width: 1600, height: 900 }] },
};

export const viewport: Viewport = { themeColor: "#0B0D0E" };

export const dynamicParams = false;

export function generateStaticParams() {
  return translatedLocales.map((locale) => ({ locale }));
}

export default async function LocalizedLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isTranslatedLocale(locale)) notFound();
  const html = localeHtml[locale];

  const introScript = `(function(){try{document.documentElement.dataset.skIntro='active';}catch(e){}})();`;
  return <html lang={html.lang} dir={html.dir} data-locale={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: introScript }} /><JsonLd data={siteStructuredData} /></head>
    <body><LanguagePreferenceSync /><SiteIntro /><GlobalMotionSystem /><LocaleRuntime locale={locale}><RouteTransitionProvider>{children}</RouteTransitionProvider></LocaleRuntime></body>
  </html>;
}

