"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { CodeBlock } from "@/components/algorithm/CodeBlock";
import { PseudocodeBlock } from "@/components/algorithm/PseudocodeBlock";
import { ComplexityChart } from "@/components/algorithm/ComplexityChart";
import { RelatedAlgorithms } from "@/components/algorithm/RelatedAlgorithms";
import { UseCases } from "@/components/algorithm/UseCases";
import { Monitor } from "lucide-react";
import type { AlgorithmMetadata } from "@/lib/visualization/types";

interface AlgorithmDetailProps {
  algorithm: AlgorithmMetadata;
}

export function AlgorithmDetail({ algorithm }: AlgorithmDetailProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Link
            href={`/algorithms/${algorithm.category}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <CategoryIcon category={algorithm.category} className="h-4 w-4" />
            <span>{algorithm.subcategory}</span>
          </Link>
          <DifficultyBadge difficulty={algorithm.difficulty} />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {algorithm.name}
        </h1>
        <div className="flex flex-wrap gap-1.5">
          {algorithm.tags.map((tag) => (
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

      {/* Description */}
      <div className="prose prose-invert prose-slate max-w-none">
        {algorithm.description.split("\n\n").map((para, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Visualization Placeholder */}
      <div className="rounded-md border-2 border-dashed border-border bg-surface/30 p-8 text-center">
        <Monitor className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Interactive visualization coming in Phase 2
        </p>
      </div>

      {/* Pseudocode */}
      <PseudocodeBlock pseudocode={algorithm.pseudocode} />

      {/* Code */}
      <CodeBlock implementations={algorithm.implementations} />

      {/* Complexity */}
      <ComplexityChart
        timeComplexity={algorithm.timeComplexity}
        spaceComplexity={algorithm.spaceComplexity}
      />

      {/* Use Cases */}
      <UseCases useCases={algorithm.useCases} />

      {/* Related Algorithms */}
      <RelatedAlgorithms algorithmIds={algorithm.relatedAlgorithms} />
    </div>
  );
}
