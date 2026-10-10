import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMachineBySlug, machineryCatalog } from "@/data/machinery";
import "./machine-detail-shell.css";

type MachinePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return machineryCatalog.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: MachinePageProps): Promise<Metadata> {
  const machine = getMachineBySlug((await params).slug);
  return {
    title: machine ? `${machine.name} | S.K. Engineering Works` : "Machinery | S.K. Engineering Works",
  };
}

export default async function MachinePage({ params }: MachinePageProps) {
  const machine = getMachineBySlug((await params).slug);
  if (!machine) notFound();

  return (
    <main className="machine-detail-shell">
      <p>{machine.number} / {machine.category.replaceAll("-", " ")}</p>
      <h1>{machine.name}</h1>
      <span>MACHINE EXPERIENCE COMING NEXT</span>
      <Link href="/machinery#material-handling">BACK TO MACHINERY <b aria-hidden="true">&rarr;</b></Link>
    </main>
  );
}
