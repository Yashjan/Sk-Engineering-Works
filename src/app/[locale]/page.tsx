import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/app/page";
import { createLocalizedMetadata } from "@/i18n/metadata";
import { getPageCopy } from "@/i18n/page-copy";
import { isTranslatedLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isTranslatedLocale(locale)) notFound();
  return createLocalizedMetadata({ locale, pathname: "/", ...getPageCopy(locale, "home") });
}

export default function LocalizedHomePage() {
  return <HomePage />;
}

