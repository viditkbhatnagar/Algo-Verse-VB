"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AlgoOption {
  id: string;
  name: string;
  category: string;
}

interface CategoryOption {
  slug: string;
  name: string;
}

interface CompareSelectorProps {
  algorithms: AlgoOption[];
  categories: CategoryOption[];
}

const SUGGESTED_PAIRS: [string, string][] = [
  ["bubble-sort", "quick-sort"],
  ["bfs", "dfs"],
  ["dijkstra", "bellman-ford"],
  ["kruskal", "prim"],
  ["merge-sort", "heap-sort"],
  ["linear-search", "binary-search"],
];

export function CompareSelector({
  algorithms,
  categories,
}: CompareSelectorProps) {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [algo1, setAlgo1] = useState<string>("");
  const [algo2, setAlgo2] = useState<string>("");

  const filteredAlgorithms = useMemo(() => {
    if (categoryFilter === "all") return algorithms;
    return algorithms.filter((a) => a.category === categoryFilter);
  }, [algorithms, categoryFilter]);

  const algoMap = useMemo(
    () => new Map(algorithms.map((a) => [a.id, a])),
    [algorithms]
  );

  function handleCompare() {
    if (algo1 && algo2 && algo1 !== algo2) {
      router.push(`/compare/${algo1}/${algo2}`);
    }
  }

  function handleSuggestedPair(id1: string, id2: string) {
    router.push(`/compare/${id1}/${id2}`);
  }

  return (
    <div className="space-y-8">
      {/* Category filter */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Filter by category (optional)
        </label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Algorithm selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Algorithm A
          </label>
          <Select value={algo1} onValueChange={setAlgo1}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select first algorithm" />
            </SelectTrigger>
            <SelectContent>
              {filteredAlgorithms.map((a) => (
                <SelectItem key={a.id} value={a.id} disabled={a.id === algo2}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Algorithm B
          </label>
          <Select value={algo2} onValueChange={setAlgo2}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select second algorithm" />
            </SelectTrigger>
            <SelectContent>
              {filteredAlgorithms.map((a) => (
                <SelectItem key={a.id} value={a.id} disabled={a.id === algo1}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Compare button */}
      <Button
        onClick={handleCompare}
        disabled={!algo1 || !algo2 || algo1 === algo2}
        className="w-full sm:w-auto"
        size="lg"
      >
        <GitCompareArrows className="h-5 w-5 mr-2" />
        Compare
      </Button>

      {/* Suggested pairs */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Suggested comparisons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTED_PAIRS.map(([id1, id2]) => {
            const a1 = algoMap.get(id1);
            const a2 = algoMap.get(id2);
            if (!a1 || !a2) return null;
            return (
              <button
                key={`${id1}-${id2}`}
                onClick={() => handleSuggestedPair(id1, id2)}
                className="flex items-center gap-2 p-3 rounded-lg border border-border bg-surface/50 hover:bg-surface hover:border-primary/50 transition-colors text-left"
              >
                <span className="text-sm font-medium text-foreground">
                  {a1.name}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  {a2.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
