import type { Metadata } from "next";
import { companyContact } from "@/data/contact";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const fallbackSiteUrl = process.env.NODE_ENV === "production"
  ? "https://yashjan.github.io/Sk-Engineering-Works"
  : "http://localhost:3000";

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "S.K. Engineering Works",
  legalName: "S.K. Engineering Works",
  description:
    "S.K. Engineering Works manufactures industrial process equipment, material handling systems and salt refinery machinery, with complete salt refinery plant capability from Sambhar Lake, Rajasthan.",
  url: normalizeSiteUrl(configuredSiteUrl || fallbackSiteUrl),
  phone: companyContact.phoneDisplay,
  phoneHref: companyContact.phoneHref,
  address: {
    streetAddress: "Nawa Road",
    addressLocality: "Sambhar Lake",
    addressRegion: "Rajasthan",
    postalCode: "303604",
    addressCountry: "IN",
  },
  logo: "/images/sk-logo.png",
  socialImage: "/images/projects/jagdamba/04_jagdamba_project_cover.jpg",
} as const;

export function absoluteUrl(pathname = "/") {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
  return cleanPath ? `${siteConfig.url}/${cleanPath}/` : `${siteConfig.url}/`;
}

export function absoluteAssetUrl(pathname: string) {
  return `${siteConfig.url}/${pathname.replace(/^\/+/, "")}`;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  index?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = siteConfig.socialImage,
  index = true,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const socialTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  return {
    title: { absolute: socialTitle },
    description,
    alternates: { canonical },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      url: canonical,
      images: [
        {
          url: absoluteAssetUrl(image),
          width: 1600,
          height: 900,
          alt: "S.K. Engineering Works completed salt refinery plant",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [absoluteAssetUrl(image)],
    },
  };
}
