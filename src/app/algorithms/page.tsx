import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AlgorithmGrid } from "@/components/algorithm/AlgorithmGrid";
import { getAllAlgorithms } from "@/data/algorithms";
import { getAllCategories } from "@/data/categories";

export const metadata = {
  title: "All Algorithms — AlgoVerse",
  description: "Browse all algorithms with filtering and sorting.",
};

export default function AlgorithmsPage() {
  const algorithms = getAllAlgorithms();
  const categories = getAllCategories();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold text-foreground mb-2">
        All Algorithms
      </h1>
      <p className="text-muted-foreground mb-6">
        Browse and filter through all available algorithms.
      </p>
      <AlgorithmGrid algorithms={algorithms} categories={categories} />
    </div>
  );
}
