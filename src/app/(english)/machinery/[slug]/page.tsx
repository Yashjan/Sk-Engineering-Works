/** @jsxImportSource @/i18n/react */
import type { Metadata } from "next";
import Link from "@/components/i18n/LocalizedLink";
import { notFound } from "next/navigation";
import { getMachineBySlug, machineryCatalog } from "@/data/machinery";
import MachineryDetailPage from "@/components/machinery/detail/MachineryDetailPage";
import { getMachineryDetail, machineryDetails } from "@/data/machinery-details";
import { createPageMetadata } from "@/config/site";
import JsonLd from "@/components/seo/JsonLd";
import { isTranslatedLocale, localizePathname, type Locale } from "@/i18n/config";
import { localizeMachine } from "@/i18n/machinery-content";
import { translateServerText } from "@/i18n/server";
import { breadcrumbStructuredData, productStructuredData } from "@/lib/structured-data";
import "./machine-detail-shell.css";

type MachinePageProps = {
  // locale is set only when the translated route renders this page.
  params: Promise<{ slug: string; locale?: Locale }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set([...machineryCatalog.map(({ slug }) => slug), ...Object.keys(machineryDetails)])].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: MachinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const machine = getMachineBySlug(slug);
  const detail = getMachineryDetail(slug);
  if (detail) {
    return createPageMetadata({
      title: detail.seo.title,
      description: detail.seo.description,
      path: `/machinery/${slug}`,
      image: slug === "screw-conveyor" || slug === "portable-belt-conveyor" ? detail.hero?.src : undefined,
    });
  }
  return createPageMetadata({
    title: machine ? machine.name : "Machinery",
    description: machine
      ? `${machine.name} by S.K. Engineering Works. This machinery detail page is under development.`
      : "Industrial machinery by S.K. Engineering Works.",
    path: `/machinery/${slug}`,
    index: false,
  });
}

export default async function MachinePage({ params }: MachinePageProps) {
  const { slug, locale = "en" } = await params;
  const source = getMachineryDetail(slug);
  const detail = source && localizeMachine(source, locale);
  if (detail?.structuredData) {
    const translate = (value: string) => isTranslatedLocale(locale) ? translateServerText(value, locale) : value;
    const path = `/machinery/${slug}`;
    return <>
      <JsonLd data={breadcrumbStructuredData([
        { name: translate("Home"), path: localizePathname("/", locale) },
        { name: translate("Machinery"), path: localizePathname("/machinery", locale) },
        { name: translate(detail.name), path: localizePathname(path, locale) },
      ])} />
      <JsonLd data={productStructuredData({
        name: translate(detail.name),
        description: translate(detail.seo.description),
        path: localizePathname(path, locale),
        image: detail.hero?.src,
        category: translate(detail.structuredData.category),
      })} />
      <MachineryDetailPage machine={detail} />
    </>;
  }
  if (detail) return <MachineryDetailPage machine={detail} />;
  const machine = getMachineBySlug(slug);
  if (!machine) notFound();

  return (
    <main className="machine-detail-shell">
      <p>{machine.number} / {machine.category.replaceAll("-", " ")}</p>
      <h1>{machine.name}</h1>
      <span>MACHINE EXPERIENCE COMING NEXT</span>
      <Link href={`/machinery#${machine.categorySlug}`}>BACK TO MACHINERY <b aria-hidden="true">&rarr;</b></Link>
    </main>
  );
}
