import { absoluteAssetUrl, absoluteUrl, siteConfig } from "@/config/site";

export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${absoluteUrl()}#organization`,
      name: siteConfig.legalName,
      url: absoluteUrl(),
      logo: absoluteAssetUrl(siteConfig.logo),
      telephone: siteConfig.phone,
      address: {
        "@type": "PostalAddress",
        ...siteConfig.address,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${absoluteUrl()}#website`,
      name: siteConfig.name,
      url: absoluteUrl(),
      publisher: { "@id": `${absoluteUrl()}#organization` },
    },
  ],
} as const;

export function breadcrumbStructuredData(
  items: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
