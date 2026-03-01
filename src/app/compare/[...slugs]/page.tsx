import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAlgorithmById } from "@/data/algorithms";
import { ComparisonView } from "@/components/compare/ComparisonView";

interface PageProps {
  params: { slugs: string[] };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const [id1, id2] = params.slugs;
  const algo1 = getAlgorithmById(id1);
  const algo2 = getAlgorithmById(id2);
  if (!algo1 || !algo2) return { title: "Not Found" };
  return {
    title: `${algo1.name} vs ${algo2.name}`,
    description: `Compare ${algo1.name} and ${algo2.name} side-by-side with animated visualizations.`,
    openGraph: {
      title: `${algo1.name} vs ${algo2.name} | AlgoVerse`,
      description: `Compare ${algo1.name} and ${algo2.name} side-by-side.`,
      type: "article",
    },
  };
}

export default function ComparisonPage({ params }: PageProps) {
  const [id1, id2] = params.slugs;
  if (!id1 || !id2) notFound();

  const algo1 = getAlgorithmById(id1);
  const algo2 = getAlgorithmById(id2);
  if (!algo1 || !algo2) notFound();

  return (
    <ComparisonView
      algorithm1={{
        id: algo1.id,
        name: algo1.name,
        category: algo1.category,
        timeComplexity: algo1.timeComplexity,
        spaceComplexity: algo1.spaceComplexity,
      }}
      algorithm2={{
        id: algo2.id,
        name: algo2.name,
        category: algo2.category,
        timeComplexity: algo2.timeComplexity,
        spaceComplexity: algo2.spaceComplexity,
      }}
    />
  );
}
