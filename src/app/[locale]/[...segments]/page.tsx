/** @jsxImportSource @/i18n/react */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AboutPage from "@/app/(english)/about/page";
import ContactPage from "@/app/(english)/contact/page";
import EngineeringPage from "@/app/(english)/engineering/page";
import MachineryPage from "@/app/(english)/machinery/page";
import MachineDetailPage from "@/app/(english)/machinery/[slug]/page";
import ProjectsPage from "@/app/(english)/projects/page";
import ProjectDetailPage from "@/app/(english)/projects/[slug]/page";
import JagdambaProjectPage from "@/app/(english)/projects/jagdamba-salt-15tph/page";
import SaltRefineryPage from "@/app/(english)/salt-refinery-plants/page";
import { machineryCatalog } from "@/data/machinery";
import { machineryDetails } from "@/data/machinery-details";
import { projectArchive } from "@/data/projects";
import { createLocalizedMetadata } from "@/i18n/metadata";
import { getPageCopy } from "@/i18n/page-copy";
import { isTranslatedLocale, translatedLocales } from "@/i18n/config";
import { localizeMachine } from "@/i18n/machinery-content";
import { localizeServerTree } from "@/i18n/server";

type LocalizedRouteProps = { params: Promise<{ locale: string; segments: string[] }> };

const machinerySlugs = [...new Set([...machineryCatalog.map(({ slug }) => slug), ...Object.keys(machineryDetails)])];
const projectSlugs = [...new Set(["jagdamba-salt-15tph", ...projectArchive.map(({ slug }) => slug)])];
const baseSegments = [["about"], ["contact"], ["engineering"], ["machinery"], ["projects"], ["salt-refinery-plants"]];
const allSegments = [
  ...baseSegments,
  ...machinerySlugs.map((slug) => ["machinery", slug]),
  ...projectSlugs.map((slug) => ["projects", slug]),
];

export const dynamicParams = false;

export function generateStaticParams() {
  return translatedLocales.flatMap((locale) => allSegments.map((segments) => ({ locale, segments })));
}

function routeKey(segments: string[]) {
  return segments.join("/");
}

export async function generateMetadata({ params }: LocalizedRouteProps): Promise<Metadata> {
  const { locale, segments } = await params;
  if (!isTranslatedLocale(locale)) notFound();
  const route = routeKey(segments);
  const pathname = `/${route}`;
  const baseKey = route === "about" || route === "contact" || route === "engineering" || route === "machinery" || route === "projects"
    ? route
    : route === "salt-refinery-plants" ? "salt" : null;
  if (baseKey) return createLocalizedMetadata({ locale, pathname, ...getPageCopy(locale, baseKey) });

  if (segments[0] === "machinery" && segments[1]) {
    const machine = machineryDetails[segments[1]] ?? machineryCatalog.find(({ slug }) => slug === segments[1]);
    const machineName = "name" in (machine ?? {}) ? (machine as { name: string }).name : machineryDetails[segments[1]]?.name;
    // A machine with build-time localized copy uses its translated SEO text; others keep the generic template below.
    const detail = machineryDetails[segments[1]];
    const localized = detail && localizeMachine(detail, locale);
    if (localized && localized !== detail) {
      return createLocalizedMetadata({ locale, pathname, title: localized.seo.title, description: localized.seo.description, image: segments[1] === "screw-conveyor" || segments[1] === "portable-belt-conveyor" ? localized.hero?.src : undefined, index: true });
    }
    return createLocalizedMetadata({
      locale,
      pathname,
      title: `${machineName ?? "Machinery"} | ${locale === "hi" ? "औद्योगिक मशीनरी" : "الآلات الصناعية"}`,
      description: locale === "hi"
        ? `${machineName ?? "मशीन"} की अभियांत्रिकी, निर्माण और प्रक्रिया अनुप्रयोग संबंधी जानकारी।`
        : `معلومات عن هندسة وتصنيع وتطبيقات ${machineName ?? "الآلة"}.`,
      index: Boolean(machineryDetails[segments[1]]),
    });
  }

  if (segments[0] === "projects" && segments[1]) {
    const project = projectArchive.find(({ slug }) => slug === segments[1]);
    const name = project?.name ?? "Jagdamba Salt 15 TPH Refinery";
    return createLocalizedMetadata({
      locale,
      pathname,
      title: `${name} | ${locale === "hi" ? "परियोजना रिकॉर्ड" : "سجل المشروع"}`,
      description: locale === "hi" ? `${name} का सत्यापित परियोजना रिकॉर्ड।` : `سجل مشروع موثق لـ ${name}.`,
      image: project?.poster ?? (project?.mediaType === "image" ? project.mediaSrc : undefined),
      index: false,
    });
  }

  notFound();
}

export default async function LocalizedRoutePage({ params }: LocalizedRouteProps) {
  const { locale, segments } = await params;
  if (!isTranslatedLocale(locale)) notFound();
  const route = routeKey(segments);
  let page;
  if (route === "about") page = AboutPage();
  else if (route === "contact") page = ContactPage();
  else if (route === "engineering") page = EngineeringPage();
  else if (route === "machinery") page = MachineryPage();
  else if (route === "projects") page = ProjectsPage();
  else if (route === "salt-refinery-plants") page = SaltRefineryPage({ params: Promise.resolve({ locale }) });
  else if (segments[0] === "machinery" && segments[1]) page = MachineDetailPage({ params: Promise.resolve({ slug: segments[1], locale }) });
  else if (segments[0] === "projects" && segments[1] === "jagdamba-salt-15tph") page = JagdambaProjectPage();
  else if (segments[0] === "projects" && segments[1]) page = ProjectDetailPage({ params: Promise.resolve({ slug: segments[1] }) });
  else notFound();
  return localizeServerTree(await page, locale);
}

