import { CompareSelector } from "@/components/compare/CompareSelector";
import { getAllAlgorithms } from "@/data/algorithms";
import { getAllCategories } from "@/data/categories";

export default function ComparePage() {
  const algorithms = getAllAlgorithms();
  const categories = getAllCategories();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Compare Algorithms
      </h1>
      <p className="text-muted-foreground mb-8">
        Select two algorithms to compare their visualizations, time complexity,
        and space complexity side-by-side.
      </p>
      <CompareSelector
        algorithms={algorithms.map((a) => ({
          id: a.id,
          name: a.name,
          category: a.category,
        }))}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}
