import type { Metadata } from "next";
import { absoluteAssetUrl, absoluteUrl, siteConfig } from "@/config/site";
import { localizePathname, type Locale } from "./config";

const openGraphLocales: Record<Locale, string> = {
  en: "en_IN",
  hi: "hi_IN",
  ar: "ar_SA",
};

export const languageAlternates = (pathname: string) => ({
  en: absoluteUrl(localizePathname(pathname, "en")),
  hi: absoluteUrl(localizePathname(pathname, "hi")),
  ar: absoluteUrl(localizePathname(pathname, "ar")),
  "x-default": absoluteUrl(localizePathname(pathname, "en")),
});

type LocalizedMetadataOptions = {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  image?: string;
  index?: boolean;
};

export function createLocalizedMetadata({
  locale,
  pathname,
  title,
  description,
  image = siteConfig.socialImage,
  index = true,
}: LocalizedMetadataOptions): Metadata {
  const localizedPath = localizePathname(pathname, locale);
  const canonical = absoluteUrl(localizedPath);
  const socialTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;

  return {
    title: { absolute: socialTitle },
    description,
    alternates: { canonical, languages: languageAlternates(pathname) },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter((value) => value !== openGraphLocales[locale]),
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      url: canonical,
      images: [{
        url: absoluteAssetUrl(image),
        width: 1600,
        height: 900,
        alt: "S.K. Engineering Works industrial engineering and salt refinery plant",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [absoluteAssetUrl(image)],
    },
  };
}

