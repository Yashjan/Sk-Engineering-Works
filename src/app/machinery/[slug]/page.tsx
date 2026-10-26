import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMachineBySlug, machineryCatalog } from "@/data/machinery";
import MachineryDetailPage from "@/components/machinery/detail/MachineryDetailPage";
import { getMachineryDetail, machineryDetails } from "@/data/machinery-details";
import { createPageMetadata } from "@/config/site";
import "./machine-detail-shell.css";

type MachinePageProps = {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const detail = getMachineryDetail(slug);
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
