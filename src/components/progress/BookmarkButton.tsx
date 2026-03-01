"use client";

import { Star } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  algorithmId: string;
  size?: "sm" | "md";
}

export function BookmarkButton({ algorithmId, size = "md" }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks(algorithmId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className={cn(
        "transition-colors",
        size === "sm" ? "p-1" : "p-1.5",
        isBookmarked
          ? "text-yellow-400 hover:text-yellow-300"
          : "text-muted-foreground hover:text-yellow-400"
      )}
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Star
        className={cn(
          size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5",
          isBookmarked && "fill-current"
        )}
      />
    </button>
  );
}
