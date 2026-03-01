import { CategorySlug } from "@/lib/constants";

// Re-export CategorySlug as the canonical Category type
export type Category = CategorySlug;

// Difficulty levels (lowercase for data, constants.ts has titlecase for display)
export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

// Complexity information for an algorithm
export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  note?: string;
}

// Full algorithm metadata — used by data stubs and detail pages
export interface AlgorithmMetadata {
  id: string;
  name: string;
  category: Category;
  subcategory: string;
  difficulty: Difficulty;
  timeComplexity: ComplexityInfo;
  spaceComplexity: ComplexityInfo;
  description: string;
  shortDescription: string;
  pseudocode: string;
  implementations: {
    python: string;
    javascript: string;
  };
  useCases: string[];
  relatedAlgorithms: string[];
  glossaryTerms: string[];
  tags: string[];
}

// Category metadata — used by sidebar, category pages, home grid
export interface CategoryInfo {
  id: string;
  slug: Category;
  name: string;
  description: string;
  icon: string;
  subcategories: string[];
  algorithmCount: number;
}

// --- Visualization types (used starting Phase 2) ---

export type StepAction =
  | "compare"
  | "swap"
  | "insert"
  | "remove"
  | "visit"
  | "enqueue"
  | "dequeue"
  | "push"
  | "pop"
  | "highlight"
  | "unhighlight"
  | "complete"
  | "select"
  | "merge"
  | "split"
  | "update-weight"
  | "relax-edge"
  | "forward-pass"
  | "backprop";

export type HighlightColor =
  | "active"
  | "comparing"
  | "swapping"
  | "completed"
  | "selected"
  | "path";

export interface HighlightInfo {
  indices: number[];
  color: HighlightColor;
  label?: string;
}

export interface VisualizationStep {
  id: number;
  description: string;
  action: StepAction;
  highlights: HighlightInfo[];
  data: unknown;
  codeLineHighlight?: number;
  variables?: Record<string, unknown>;
}
