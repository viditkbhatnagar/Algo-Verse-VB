import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { getAlgorithmById } from "@/data/algorithms";

interface RelatedAlgorithmsProps {
  algorithmIds: string[];
}

export function RelatedAlgorithms({ algorithmIds }: RelatedAlgorithmsProps) {
  const related = algorithmIds
    .map((id) => getAlgorithmById(id))
    .filter(Boolean);

  if (related.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">
        Related Algorithms
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map((algo) => (
          <Link
            key={algo!.id}
            href={`/algorithms/${algo!.category}/${algo!.id}`}
          >
            <Card className="p-3 bg-surface border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <CategoryIcon
                  category={algo!.category}
                  className="h-3.5 w-3.5 text-muted-foreground"
                />
                <span className="text-sm font-medium text-foreground truncate">
                  {algo!.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DifficultyBadge difficulty={algo!.difficulty} className="text-[10px] h-5" />
                <span className="text-[10px] font-mono text-muted-foreground">
                  {algo!.timeComplexity.worst}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
