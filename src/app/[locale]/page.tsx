/** @jsxImportSource @/i18n/react */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/app/(english)/page";
import { createLocalizedMetadata } from "@/i18n/metadata";
import { getPageCopy } from "@/i18n/page-copy";
import { isTranslatedLocale } from "@/i18n/config";
import { localizeServerTree } from "@/i18n/server";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isTranslatedLocale(locale)) notFound();
  return createLocalizedMetadata({ locale, pathname: "/", ...getPageCopy(locale, "home") });
}

export default async function LocalizedHomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isTranslatedLocale(locale)) notFound();
  return localizeServerTree(HomePage(), locale);
}

