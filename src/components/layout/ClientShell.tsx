"use client";

import { useEffect } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { SearchModal } from "@/components/search/SearchModal";
import { useProgressStore } from "@/stores/progress";

export function ClientShell({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();

  const hasFetched = useProgressStore((s) => s.hasFetched);
  const fetchAll = useProgressStore((s) => s.fetchAll);

  useEffect(() => {
    if (!hasFetched) {
      fetchAll();
    }
  }, [hasFetched, fetchAll]);

  return (
    <>
      {children}
      <SearchModal />
    </>
  );
}
