import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { categories } from "@/data/categories";
import { getAllAlgorithms } from "@/data/algorithms";
import { AlgorithmCard } from "@/components/algorithm/AlgorithmCard";

export default function Home() {
  const featured = getAllAlgorithms().slice(0, 6);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="text-center py-12 lg:py-16 animate-fade-in">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          <span className="text-primary">Algo</span>
          <span className="text-accent">Verse</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Interactive visual learning platform for algorithms, data structures,
          machine learning, deep learning, and NLP.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="px-4 py-2 rounded-md bg-surface border border-border text-sm text-muted-foreground">
            300+ Algorithms
          </div>
          <div className="px-4 py-2 rounded-md bg-surface border border-border text-sm text-muted-foreground">
            Step-by-Step Visualizations
          </div>
          <div className="px-4 py-2 rounded-md bg-surface border border-border text-sm text-muted-foreground">
            AI-Powered Explanations
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Explore Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/algorithms/${cat.slug}`}>
              <Card className="h-full bg-surface border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <CategoryIcon
                        category={cat.slug}
                        className="h-5 w-5 text-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {cat.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 border-border text-muted-foreground text-xs"
                    >
                      {cat.algorithmCount}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Algorithms */}
      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Featured Algorithms
            </h2>
            <Link
              href="/algorithms"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {featured.map((algo) => (
              <AlgorithmCard key={algo.id} algorithm={algo} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
