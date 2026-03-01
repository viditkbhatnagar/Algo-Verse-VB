"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/ui";

export function useKeyboardShortcuts() {
  const setSearchOpen = useUIStore((state) => state.setSearchOpen);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux) — open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen]);
}
