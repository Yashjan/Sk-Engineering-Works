import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbStructuredData } from "@/lib/structured-data";

type BreadcrumbJsonLdProps = {
  currentName: string;
  currentPath: string;
};

export default function BreadcrumbJsonLd({
  currentName,
  currentPath,
}: BreadcrumbJsonLdProps) {
  return (
    <JsonLd
      data={breadcrumbStructuredData([
        { name: "Home", path: "/" },
        { name: currentName, path: currentPath },
      ])}
    />
  );
}
