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

// Glossary term data — used by glossary pages, search, and AI explanations
export interface GlossaryTermData {
  slug: string;
  name: string;
  definition: string;
  formalDefinition?: string;
  formula?: string;
  relatedTerms: string[];
  category: string;
  tags: string[];
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
  | "backprop"
  | "rotate-left"
  | "rotate-right"
  | "hash"
  | "fill-cell"
  | "backtrack"
  | "place"
  | "unplace"
  | "mark-mst"
  | "union"
  | "slide-window"
  | "move-pointer";

export type HighlightColor =
  | "active"
  | "comparing"
  | "swapping"
  | "completed"
  | "selected"
  | "path"
  | "mst-edge"
  | "relaxed"
  | "backtracked"
  | "window";

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

// --- Step data shapes for specific visualization types ---

export interface SortingStepData {
  array: number[];
  highlights: HighlightInfo[];
  positionMap?: number[]; // positionMap[currentIndex] = originalIndex (for bar identity tracking)
  auxiliaryArrays?: { label: string; data: number[] }[];
  subarrays?: { startIndex: number; endIndex: number; level: number; label?: string }[];
  heapSize?: number;
  buckets?: { label: string; items: number[] }[];
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphStepData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeStates: Record<string, "unvisited" | "visiting" | "visited">;
  currentNode: string | null;
  dataStructure: {
    type: "stack" | "queue";
    items: string[];
  };
  visitOrder: string[];
}

export interface SearchStepData {
  array: number[];
  target: number;
  currentIndex: number;
  low?: number;
  mid?: number;
  high?: number;
  eliminated: number[]; // indices that are grayed out
  found: boolean;
  checked: number[]; // indices already checked
}

// --- Phase 3 step data shapes ---

export interface TreeNodeData {
  id: string;
  value: number | string;
  children: string[];
  parent: string | null;
  highlight?: HighlightColor;
  balanceFactor?: number;
}

export interface TreeEdgeData {
  source: string;
  target: string;
  highlight?: HighlightColor;
  label?: string;
}

export interface TreeStepData {
  nodes: TreeNodeData[];
  edges: TreeEdgeData[];
  rootId: string | null;
  currentNodeId: string | null;
  operation: string;
  auxiliaryArray?: number[];
  auxiliaryHighlights?: HighlightInfo[];
}

export interface MatrixStepData {
  matrix: (number | string | null)[][];
  cellHighlights: Record<string, HighlightColor>;
  rowHeaders?: string[];
  colHeaders?: string[];
  arrows?: { from: [number, number]; to: [number, number]; label?: string }[];
  currentCell?: [number, number];
  optimalPath?: [number, number][];
}

export interface LinkedListNodeData {
  id: string;
  value: number | string;
  next: string | null;
  prev?: string | null;
  highlight?: HighlightColor;
}

export interface LinkedListStepData {
  nodes: LinkedListNodeData[];
  headId: string | null;
  tailId: string | null;
  currentId: string | null;
  pointers: Record<string, string>;
}

export interface HashTableBucket {
  index: number;
  items: { key: string; value: string; highlight?: HighlightColor }[];
}

export interface HashTableStepData {
  buckets: HashTableBucket[];
  probeSequence?: number[];
  currentBucket?: number;
  hashComputation?: string;
  loadFactor?: number;
}

export interface WeightedEdge extends GraphEdge {
  weight: number;
  highlight?: HighlightColor;
  inMST?: boolean;
  directed?: boolean;
}

export interface WeightedGraphStepData {
  nodes: GraphNode[];
  edges: WeightedEdge[];
  nodeStates: Record<string, "unvisited" | "visiting" | "visited" | "in-queue">;
  currentNode: string | null;
  distances: Record<string, number>;
  predecessors: Record<string, string | null>;
  visitOrder: string[];
  mstEdges?: { source: string; target: string }[];
  totalWeight?: number;
  priorityQueue?: { node: string; priority: number }[];
}

export interface BacktrackingStepData {
  grid: (number | string | null)[][];
  cellHighlights: Record<string, HighlightColor>;
  placementHistory: { row: number; col: number; value: number | string }[];
  currentCell?: [number, number];
  isBacktracking: boolean;
  solutionFound?: boolean;
}

export interface ArrayWithPointersStepData {
  array: (number | string)[];
  pointers: Record<string, number>;
  windowRange?: [number, number];
  highlights: HighlightInfo[];
  result?: (number | string)[];
  currentValue?: number | string;
}
