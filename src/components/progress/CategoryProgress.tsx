"use client";

import { useProgressStore } from "@/stores/progress";
import { getAlgorithmsByCategory } from "@/data/algorithms";
import { cn } from "@/lib/utils";

interface CategoryProgressProps {
  categorySlug: string;
  className?: string;
}

export function CategoryProgress({ categorySlug, className }: CategoryProgressProps) {
  const progressMap = useProgressStore((s) => s.progressMap);
  const algorithms = getAlgorithmsByCategory(categorySlug);

  const studied = algorithms.filter(
    (a) => progressMap[a.id]?.status && progressMap[a.id].status !== "not_started"
  ).length;

  if (studied === 0) return null;

  return (
    <span
      className={cn(
        "text-[10px] font-medium text-emerald-400/80",
        className
      )}
    >
      {studied}/{algorithms.length}
    </span>
  );
}
