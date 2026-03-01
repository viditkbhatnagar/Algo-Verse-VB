"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useUIStore } from "@/stores/ui";
import { useSearch } from "@/hooks/useSearch";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
import { cn } from "@/lib/utils";

export function SearchModal() {
  const searchOpen = useUIStore((s) => s.searchOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const [query, setQuery] = useState("");

  function handleClose() {
    setSearchOpen(false);
    setQuery("");
  }

  const { results, hasResults } = useSearch(query);

  return (
    <DialogPrimitive.Root open={searchOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[20%] z-50 w-full max-w-[550px] translate-x-[-50%]",
            "rounded-lg border border-border bg-background shadow-2xl",
            "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          )}
        >
          <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Search algorithms, glossary terms, and categories
          </DialogPrimitive.Description>
          <SearchInput value={query} onChange={setQuery} />
          <SearchResults
            results={results}
            hasResults={hasResults}
            query={query}
            onSelect={handleClose}
          />
          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="rounded border border-border bg-surface px-1 py-0.5">↑↓</kbd> Navigate
              </span>
              <span>
                <kbd className="rounded border border-border bg-surface px-1 py-0.5">↵</kbd> Select
              </span>
              <span>
                <kbd className="rounded border border-border bg-surface px-1 py-0.5">Esc</kbd> Close
              </span>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
