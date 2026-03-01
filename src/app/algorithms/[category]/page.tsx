import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AlgorithmCard } from "@/components/algorithm/AlgorithmCard";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getAlgorithmsByCategory } from "@/data/algorithms";
import type { Metadata } from "next";

interface PageProps {
  params: { category: string };
}

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getCategoryBySlug(params.category);
  if (!category) return { title: "Not Found — AlgoVerse" };
  return {
    title: `${category.name} — AlgoVerse`,
    description: category.description,
    openGraph: {
      title: `${category.name} — AlgoVerse`,
      description: category.description,
      type: "article",
    },
  };
}

export default function CategoryPage({ params }: PageProps) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const algorithms = getAlgorithmsByCategory(category.slug);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <Breadcrumbs />

      {/* Category header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-md bg-primary/10 shrink-0">
          <CategoryIcon
            category={category.slug}
            className="h-8 w-8 text-primary"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {category.name}
          </h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {/* Subcategories */}
      {category.subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {category.subcategories.map((sub) => (
            <Badge
              key={sub}
              variant="outline"
              className="bg-surface border-border text-muted-foreground"
            >
              {sub}
            </Badge>
          ))}
        </div>
      )}

      {/* Algorithms grid */}
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Algorithms ({algorithms.length})
      </h2>

      {algorithms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {algorithms.map((algo) => (
            <AlgorithmCard key={algo.id} algorithm={algo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Algorithms for this category are coming soon.</p>
        </div>
      )}
    </div>
  );
}
