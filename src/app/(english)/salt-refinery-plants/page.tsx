/** @jsxImportSource @/i18n/react */
import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";
import CompleteExecutionSection from "@/components/salt-refinery-plants/CompleteExecutionSection";
import MachineryShowcaseSection from "@/components/salt-refinery-plants/MachineryShowcaseSection";
import PlantConfigurationSection from "@/components/salt-refinery-plants/PlantConfigurationSection";
import RawSaltProcessStage from "@/components/salt-refinery-plants/RawSaltProcessStage";
import SaltRefineryHero from "@/components/salt-refinery-plants/SaltRefineryHero";
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/config/site";
import { isTranslatedLocale, localizePathname, type Locale } from "@/i18n/config";
import { getPageCopy } from "@/i18n/page-copy";
import { getPlantCopy } from "@/i18n/plant-content";
import { translateServerText } from "@/i18n/server";
import { breadcrumbStructuredData, serviceStructuredData } from "@/lib/structured-data";

const pagePath = "/salt-refinery-plants";

export const metadata: Metadata = createPageMetadata({
  ...getPageCopy("en", "salt"),
  path: pagePath,
});

// locale is set only when the translated route renders this page.
export default async function SaltRefineryPlantsPage({ params }: { params?: Promise<{ locale?: Locale }> }) {
  const { locale = "en" } = (await params) ?? {};
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/common/brand/sk-logo.png"));
  const copy = getPlantCopy(locale);
  const translate = (value: string) => isTranslatedLocale(locale) ? translateServerText(value, locale) : value;
  const localizedPath = localizePathname(pagePath, locale);

  return (
    <>
      <JsonLd data={breadcrumbStructuredData([
        { name: translate("Home"), path: localizePathname("/", locale) },
        { name: translate("Salt Refinery Plants"), path: localizedPath },
      ])} />
      <JsonLd data={serviceStructuredData({
        name: copy.service.name,
        description: getPageCopy(locale, "salt").description,
        path: localizedPath,
        serviceType: copy.service.serviceType,
      })} />
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main">
        <SaltRefineryHero copy={copy.hero} />
        <RawSaltProcessStage copy={copy.process} />
        <CompleteExecutionSection copy={copy.execution} />
        <PlantConfigurationSection copy={copy.configuration} />
        <MachineryShowcaseSection />
        <TrustedClientsSection standalone />
        <ProjectEnquirySection appearance="light" support={copy.enquiry.support} />
      </main>
    </>
  );
}
