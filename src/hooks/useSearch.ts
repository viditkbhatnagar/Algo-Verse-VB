"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { searchGrouped, type GroupedResults } from "@/lib/search";

const emptyResults: GroupedResults = {
  algorithms: [],
  terms: [],
  categories: [],
};

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query, 150);
  const [results, setResults] = useState<GroupedResults>(emptyResults);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults(emptyResults);
      return;
    }
    setResults(searchGrouped(debouncedQuery));
  }, [debouncedQuery]);

  const totalResults =
    results.algorithms.length +
    results.terms.length +
    results.categories.length;

  return { results, totalResults, hasResults: totalResults > 0 };
}
