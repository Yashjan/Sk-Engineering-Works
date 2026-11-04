import { notFound } from "next/navigation";
import LocaleRuntime from "@/components/i18n/LocaleRuntime";
import ar from "@/i18n/dictionaries/ar.json";
import hi from "@/i18n/dictionaries/hi.json";
import { isTranslatedLocale, localeHtml, translatedLocales } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return translatedLocales.map((locale) => ({ locale }));
}

export default async function LocalizedLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isTranslatedLocale(locale)) notFound();
  const dictionary = locale === "hi" ? hi : ar;
  const html = localeHtml[locale];

  return <LocaleRuntime locale={locale} dictionary={dictionary}>
    <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(html.lang)};document.documentElement.dir=${JSON.stringify(html.dir)};document.documentElement.dataset.locale=${JSON.stringify(locale)};` }} />
    {children}
  </LocaleRuntime>;
}

