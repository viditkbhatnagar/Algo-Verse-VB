import Fuse, { type IFuseOptions, type FuseResult } from "fuse.js";
import { getAllAlgorithms } from "@/data/algorithms";
import { getAllTerms } from "@/data/glossary";
import { getAllCategories } from "@/data/categories";

export interface SearchDocument {
  type: "algorithm" | "term" | "category";
  id: string;
  name: string;
  category?: string;
  tags?: string[];
  description: string;
  href: string;
}

const fuseOptions: IFuseOptions<SearchDocument> = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "tags", weight: 0.25 },
    { name: "category", weight: 0.15 },
    { name: "description", weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

function buildDocuments(): SearchDocument[] {
  const docs: SearchDocument[] = [];

  for (const algo of getAllAlgorithms()) {
    docs.push({
      type: "algorithm",
      id: algo.id,
      name: algo.name,
      category: algo.category,
      tags: algo.tags,
      description: algo.shortDescription,
      href: `/algorithms/${algo.category}/${algo.id}`,
    });
  }

  for (const term of getAllTerms()) {
    docs.push({
      type: "term",
      id: term.slug,
      name: term.name,
      category: term.category,
      tags: term.tags,
      description: term.definition.slice(0, 200),
      href: `/glossary/${term.slug}`,
    });
  }

  for (const cat of getAllCategories()) {
    docs.push({
      type: "category",
      id: cat.slug,
      name: cat.name,
      tags: [],
      description: cat.description,
      href: `/algorithms/${cat.slug}`,
    });
  }

  return docs;
}

let fuseInstance: Fuse<SearchDocument> | null = null;

function getFuse(): Fuse<SearchDocument> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(buildDocuments(), fuseOptions);
  }
  return fuseInstance;
}

export function searchAll(query: string): FuseResult<SearchDocument>[] {
  return getFuse().search(query, { limit: 20 });
}

export interface GroupedResults {
  algorithms: FuseResult<SearchDocument>[];
  terms: FuseResult<SearchDocument>[];
  categories: FuseResult<SearchDocument>[];
}

export function searchGrouped(query: string): GroupedResults {
  const results = searchAll(query);
  return {
    algorithms: results.filter((r) => r.item.type === "algorithm"),
    terms: results.filter((r) => r.item.type === "term"),
    categories: results.filter((r) => r.item.type === "category"),
  };
}
