"use client";

import { useState, useMemo } from "react";
import { getAllTerms, getTermsByCategory, getTermsByLetter } from "@/data/glossary";
import { TermCard } from "@/components/glossary/TermCard";
import { CATEGORY_SLUGS } from "@/lib/constants";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryPage() {
  const allTerms = useMemo(() => getAllTerms(), []);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = useMemo(() => {
    let terms = allTerms;

    if (activeLetter) {
      terms = getTermsByLetter(activeLetter);
    }

    if (activeCategory) {
      terms = terms.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      terms = terms.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      );
    }

    return terms;
  }, [allTerms, activeLetter, activeCategory, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Glossary</h1>
        <p className="text-muted-foreground">
          {allTerms.length} technical terms covering algorithms, data structures,
          machine learning, and more.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter terms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md h-9 px-3 rounded-md border border-border bg-surface/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Letter filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveLetter(null)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              activeLetter === null
                ? "bg-primary text-white"
                : "bg-surface/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {LETTERS.map((letter) => (
            <button
              key={letter}
              onClick={() =>
                setActiveLetter(activeLetter === letter ? null : letter)
              }
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                activeLetter === letter
                  ? "bg-primary text-white"
                  : "bg-surface/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
              activeCategory === null
                ? "bg-accent text-background font-medium"
                : "bg-surface/50 border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All Categories
          </button>
          {CATEGORY_SLUGS.map((slug) => (
            <button
              key={slug}
              onClick={() =>
                setActiveCategory(activeCategory === slug ? null : slug)
              }
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                activeCategory === slug
                  ? "bg-accent text-background font-medium"
                  : "bg-surface/50 border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {slug.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4">
        Showing {filteredTerms.length} of {allTerms.length} terms
      </p>

      {/* Term grid */}
      {filteredTerms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTerms.map((term) => (
            <TermCard key={term.slug} term={term} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No terms match your filters.
        </div>
      )}
    </div>
  );
}
