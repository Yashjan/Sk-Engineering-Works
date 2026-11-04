export const locales = ["en", "hi", "ar"] as const;
export const translatedLocales = ["hi", "ar"] as const;

export type Locale = (typeof locales)[number];
export type TranslatedLocale = (typeof translatedLocales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  ar: "العربية",
};

export const localeHtml: Record<Locale, { lang: string; dir: "ltr" | "rtl" }> = {
  en: { lang: "en-IN", dir: "ltr" },
  hi: { lang: "hi-IN", dir: "ltr" },
  ar: { lang: "ar", dir: "rtl" },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isTranslatedLocale(value: string): value is TranslatedLocale {
  return translatedLocales.includes(value as TranslatedLocale);
}

export function localeFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  return isTranslatedLocale(firstSegment) ? firstSegment : defaultLocale;
}

export function stripLocale(pathname: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = normalized.split("/").filter(Boolean);
  if (parts[0] && isTranslatedLocale(parts[0])) parts.shift();
  return parts.length ? `/${parts.join("/")}` : "/";
}

export function localizePathname(pathname: string, locale: Locale) {
  const [pathWithQuery, hash = ""] = pathname.split("#", 2);
  const [rawPath, query = ""] = pathWithQuery.split("?", 2);
  const cleanPath = stripLocale(rawPath || "/");
  const localized = locale === defaultLocale
    ? cleanPath
    : cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
  return `${localized}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

