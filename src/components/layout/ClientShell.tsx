"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { SearchModal } from "@/components/search/SearchModal";

export function ClientShell({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return (
    <>
      {children}
      <SearchModal />
    </>
  );
}
