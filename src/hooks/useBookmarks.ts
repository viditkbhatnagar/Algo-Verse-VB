"use client";

import { useCallback } from "react";
import { useProgressStore } from "@/stores/progress";

export function useBookmarks(algorithmId: string) {
  const bookmarks = useProgressStore((s) => s.bookmarks);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);

  const isBookmarked = bookmarks.includes(algorithmId);

  const toggle = useCallback(() => {
    toggleBookmark(algorithmId);
  }, [algorithmId, toggleBookmark]);

  return { isBookmarked, toggle };
}
