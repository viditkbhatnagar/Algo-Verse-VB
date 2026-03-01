import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AlgorithmDetail } from "@/components/algorithm/AlgorithmDetail";
import { getAllAlgorithms, getAlgorithmById } from "@/data/algorithms";
import type { Metadata } from "next";

interface PageProps {
  params: { category: string; algorithm: string };
}

export function generateStaticParams() {
  return getAllAlgorithms().map((algo) => ({
    category: algo.category,
    algorithm: algo.id,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const algorithm = getAlgorithmById(params.algorithm);
  if (!algorithm) return { title: "Not Found — AlgoVerse" };
  return {
    title: `${algorithm.name} — AlgoVerse`,
    description: algorithm.shortDescription,
  };
}

export default function AlgorithmPage({ params }: PageProps) {
  const algorithm = getAlgorithmById(params.algorithm);
  if (!algorithm || algorithm.category !== params.category) notFound();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <Breadcrumbs />
      <AlgorithmDetail algorithm={algorithm} />
    </div>
  );
}
