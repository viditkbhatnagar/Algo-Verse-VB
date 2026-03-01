"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlgorithmCard } from "@/components/algorithm/AlgorithmCard";
import type { AlgorithmMetadata, CategoryInfo } from "@/lib/visualization/types";

interface AlgorithmGridProps {
  algorithms: AlgorithmMetadata[];
  categories: CategoryInfo[];
}

export function AlgorithmGrid({ algorithms, categories }: AlgorithmGridProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "difficulty">("name");

  const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };

  const filtered = useMemo(() => {
    let result = [...algorithms];

    if (categoryFilter !== "all") {
      result = result.filter((a) => a.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

    return result;
  }, [algorithms, categoryFilter, sortBy]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-surface border-border">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-border">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as "name" | "difficulty")}>
          <SelectTrigger className="w-full sm:w-[160px] bg-surface border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-surface border-border">
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="difficulty">Sort by Difficulty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} algorithm{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((algo) => (
          <AlgorithmCard key={algo.id} algorithm={algo} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No algorithms found for the selected filters.
        </p>
      )}
    </div>
  );
}
