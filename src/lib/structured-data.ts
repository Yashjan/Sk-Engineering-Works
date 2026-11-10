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

// Product markup carries only what the page states. Offers, prices, availability
// and ratings are deliberately absent until they are real, verified values.
export function productStructuredData({ name, description, path, image, category }: {
  name: string;
  description: string;
  path: string;
  image?: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    category,
    url: absoluteUrl(path),
    ...(image ? { image: absoluteAssetUrl(image) } : {}),
    brand: { "@type": "Brand", name: siteConfig.name },
  };
}

// Service markup describes the offering in the page's own words: no offers, prices, ratings or service areas.
export function serviceStructuredData({ name, description, path, serviceType }: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: absoluteUrl(path),
    provider: { "@id": `${absoluteUrl()}#organization` },
  };
}

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
