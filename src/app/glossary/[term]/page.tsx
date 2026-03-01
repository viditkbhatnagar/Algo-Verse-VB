import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { getAllTerms, getTermBySlug } from "@/data/glossary";
import { KaTeXRenderer } from "@/components/shared/KaTeXRenderer";
import { AskAIButton } from "@/components/glossary/AskAIButton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface PageProps {
  params: { term: string };
}

export function generateStaticParams() {
  return getAllTerms().map((t) => ({ term: t.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const term = getTermBySlug(params.term);
  if (!term) return { title: "Term Not Found" };
  return {
    title: `${term.name} — AlgoVerse Glossary`,
    description: term.definition,
  };
}

export default function GlossaryTermPage({ params }: PageProps) {
  const term = getTermBySlug(params.term);
  if (!term) notFound();

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <Breadcrumbs />

      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-xs bg-background border-border text-muted-foreground"
            >
              {term.category}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {term.name}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {term.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-background border-border text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Definition */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
            Definition
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            {term.definition}
          </p>
        </div>

        {/* Formal Definition */}
        {term.formalDefinition && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Formal Definition
            </h2>
            <div className="rounded-lg border border-border bg-surface/30 p-4">
              <p className="text-muted-foreground leading-relaxed">
                {term.formalDefinition}
              </p>
            </div>
          </div>
        )}

        {/* Formula */}
        {term.formula && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Formula
            </h2>
            <div className="rounded-lg border border-border bg-surface/30 p-4 text-lg">
              <KaTeXRenderer
                content={term.formula}
                className="text-foreground"
              />
            </div>
          </div>
        )}

        {/* Related Terms */}
        {term.relatedTerms.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Related Terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {term.relatedTerms.map((slug) => (
                <Link
                  key={slug}
                  href={`/glossary/${slug}`}
                  className="text-sm px-3 py-1.5 rounded-md bg-surface/50 border border-border text-accent hover:bg-surface hover:border-accent/50 transition-colors"
                >
                  {slug.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Ask AI */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
            AI Explanation
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            Get a deeper explanation powered by AI
          </p>
          <AskAIButton term={term.name} context={term.definition} />
        </div>
      </div>
    </div>
  );
}
