"use client";

import { Star } from "lucide-react";
import { AlgorithmCard } from "@/components/algorithm/AlgorithmCard";
import { useProgressStore } from "@/stores/progress";
import { getAlgorithmById } from "@/data/algorithms";

export default function BookmarksPage() {
  const bookmarks = useProgressStore((s) => s.bookmarks);

  const bookmarkedAlgorithms = bookmarks
    .map((id) => getAlgorithmById(id))
    .filter(Boolean);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bookmarks</h1>
        <p className="text-muted-foreground mt-1">
          Your saved algorithms for quick access
        </p>
      </div>

      {bookmarkedAlgorithms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {bookmarkedAlgorithms.map((algo) => (
            <AlgorithmCard key={algo!.id} algorithm={algo!} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Star className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No bookmarks yet
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Star algorithms to save them here for quick access.
            Click the star icon on any algorithm card or detail page.
          </p>
        </div>
      )}
    </div>
  );
}
