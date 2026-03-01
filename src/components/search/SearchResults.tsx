"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Code2, FolderOpen, Clock, Trash2 } from "lucide-react";
import type { FuseResult } from "fuse.js";
import type { SearchDocument, GroupedResults } from "@/lib/search";
import { useSearchStore, type RecentSearch } from "@/stores/search";

interface SearchResultsProps {
  results: GroupedResults;
  hasResults: boolean;
  query: string;
  onSelect: () => void;
}

const typeIcons = {
  algorithm: Code2,
  term: BookOpen,
  category: FolderOpen,
};

const typeLabels = {
  algorithm: "Algorithm",
  term: "Term",
  category: "Category",
};

function ResultItem({
  result,
  isActive,
  onSelect,
  onMouseEnter,
}: {
  result: FuseResult<SearchDocument>;
  isActive: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
}) {
  const Icon = typeIcons[result.item.type];

  return (
    <button
      className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
        isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-surface"
      }`}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{result.item.name}</div>
        <div className="text-xs text-muted-foreground truncate">
          {result.item.description}
        </div>
      </div>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted-foreground shrink-0">
        {typeLabels[result.item.type]}
      </span>
    </button>
  );
}

function RecentItem({
  item,
  isActive,
  onSelect,
  onMouseEnter,
}: {
  item: RecentSearch;
  isActive: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
}) {
  const Icon = typeIcons[item.type];

  return (
    <button
      className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
        isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-surface"
      }`}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
    >
      <Clock className="h-4 w-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item.name}</div>
      </div>
      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
    </button>
  );
}

export function SearchResults({
  results,
  hasResults,
  query,
  onSelect,
}: SearchResultsProps) {
  const router = useRouter();
  const { recentSearches, addRecent, clearRecents } = useSearchStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showRecents = query.length < 2 && recentSearches.length > 0;
  const showEmpty = query.length >= 2 && !hasResults;

  // Build flat list of all navigable items
  const allItems: { href: string; name: string; type: "algorithm" | "term" | "category" }[] = [];
  if (showRecents) {
    for (const r of recentSearches) {
      allItems.push({ href: r.href, name: r.name, type: r.type });
    }
  } else {
    const sections = [results.algorithms, results.terms, results.categories];
    for (const section of sections) {
      for (const r of section) {
        allItems.push({
          href: r.item.href,
          name: r.item.name,
          type: r.item.type,
        });
      }
    }
  }

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const navigate = useCallback(
    (index: number) => {
      const item = allItems[index];
      if (!item) return;
      addRecent({ name: item.name, href: item.href, type: item.type });
      router.push(item.href);
      onSelect();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allItems, router, onSelect, addRecent]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        navigate(activeIndex);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, allItems.length, navigate]);

  // Scroll active item into view
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (query.length < 2 && recentSearches.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
        Type to search algorithms, glossary terms, and categories
      </div>
    );
  }

  if (showEmpty) {
    return (
      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
        No results found for &ldquo;{query}&rdquo;
      </div>
    );
  }

  let itemIndex = 0;

  return (
    <div ref={scrollRef} className="max-h-[400px] overflow-y-auto">
      {showRecents && (
        <div>
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent
            </span>
            <button
              onClick={clearRecents}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          </div>
          {recentSearches.map((item) => {
            const idx = itemIndex++;
            return (
              <div key={item.href} data-index={idx}>
                <RecentItem
                  item={item}
                  isActive={activeIndex === idx}
                  onSelect={() => navigate(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                />
              </div>
            );
          })}
        </div>
      )}

      {!showRecents && (
        <>
          {results.algorithms.length > 0 && (
            <div>
              <div className="px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Algorithms
                </span>
              </div>
              {results.algorithms.map((r) => {
                const idx = itemIndex++;
                return (
                  <div key={r.item.id} data-index={idx}>
                    <ResultItem
                      result={r}
                      isActive={activeIndex === idx}
                      onSelect={() => navigate(idx)}
                      onMouseEnter={() => setActiveIndex(idx)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {results.terms.length > 0 && (
            <div>
              <div className="px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Glossary Terms
                </span>
              </div>
              {results.terms.map((r) => {
                const idx = itemIndex++;
                return (
                  <div key={r.item.id} data-index={idx}>
                    <ResultItem
                      result={r}
                      isActive={activeIndex === idx}
                      onSelect={() => navigate(idx)}
                      onMouseEnter={() => setActiveIndex(idx)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {results.categories.length > 0 && (
            <div>
              <div className="px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Categories
                </span>
              </div>
              {results.categories.map((r) => {
                const idx = itemIndex++;
                return (
                  <div key={r.item.id} data-index={idx}>
                    <ResultItem
                      result={r}
                      isActive={activeIndex === idx}
                      onSelect={() => navigate(idx)}
                      onMouseEnter={() => setActiveIndex(idx)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
