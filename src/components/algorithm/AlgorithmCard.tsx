import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import type { AlgorithmMetadata } from "@/lib/visualization/types";

interface AlgorithmCardProps {
  algorithm: AlgorithmMetadata;
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  return (
    <Link href={`/algorithms/${algorithm.category}/${algorithm.id}`}>
      <Card className="h-full bg-surface border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground leading-tight">
              {algorithm.name}
            </h3>
            <DifficultyBadge difficulty={algorithm.difficulty} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CategoryIcon category={algorithm.category} className="h-3 w-3" />
            <span>{algorithm.subcategory}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {algorithm.shortDescription}
          </p>
          <div className="flex gap-2 text-[10px] font-mono text-muted-foreground/70">
            <span className="px-1.5 py-0.5 rounded bg-background border border-border">
              Time: {algorithm.timeComplexity.worst}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-background border border-border">
              Space: {algorithm.spaceComplexity.worst}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
