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
  | "move-pointer"
  // Phase 5: ML/DL/NLP/RL actions
  | "train"
  | "predict"
  | "classify"
  | "cluster"
  | "update-weights"
  | "compute-gradient"
  | "activate"
  | "pool"
  | "convolve"
  | "attend"
  | "encode"
  | "decode"
  | "tokenize"
  | "embed"
  | "explore-state"
  | "exploit"
  | "update-q"
  | "fit-line"
  | "assign-cluster"
  | "update-centroid"
  | "split-node";

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
  | "window"
  // Phase 5: ML/DL/NLP/RL colors
  | "neuron-input"
  | "neuron-hidden"
  | "neuron-output"
  | "positive-weight"
  | "negative-weight"
  | "gradient"
  | "cluster-0"
  | "cluster-1"
  | "cluster-2"
  | "cluster-3"
  | "attention-high"
  | "attention-low"
  | "token"
  | "centroid"
  | "boundary"
  | "reward-positive"
  | "reward-negative";

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

// --- Phase 5: ML/DL/NLP/RL step data shapes ---

export interface ScatterPoint {
  x: number;
  y: number;
  label?: number | string;
  highlight?: HighlightColor;
  id?: string;
}

export interface DecisionBoundary {
  type: "line" | "curve" | "region";
  points: { x: number; y: number }[];
  color?: string;
  label?: string;
}

export interface ScatterStepData {
  points: ScatterPoint[];
  centroids?: ScatterPoint[];
  supportVectors?: number[];
  boundaries?: DecisionBoundary[];
  xLabel?: string;
  yLabel?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  kNearest?: number[];
  queryPoint?: ScatterPoint;
  regressionLine?: { x: number; y: number }[];
  epoch?: number;
  lossValue?: number;
}

export interface NeuronData {
  id: string;
  layer: number;
  index: number;
  value?: number;
  label?: string;
  highlight?: HighlightColor;
  isDropped?: boolean;
  gradient?: number;
}

export interface ConnectionData {
  source: string;
  target: string;
  weight: number;
  highlight?: HighlightColor;
  gradient?: number;
}

export interface NeuralNetStepData {
  layers: { label: string; type: "input" | "hidden" | "output" | "conv" | "pool" | "attention" }[];
  neurons: NeuronData[];
  connections: ConnectionData[];
  currentLayer?: number;
  activationFunction?: string;
  lossValue?: number;
  epoch?: number;
  dataFlowDirection?: "forward" | "backward";
}

export interface TrainingCurvePoint {
  epoch: number;
  trainLoss?: number;
  valLoss?: number;
  trainAccuracy?: number;
  valAccuracy?: number;
  learningRate?: number;
}

export interface LossChartStepData {
  history: TrainingCurvePoint[];
  currentEpoch: number;
  curves: { key: string; label: string; color: string }[];
  annotations?: { epoch: number; label: string }[];
}

export interface TokenData {
  id: string;
  text: string;
  type?: string;
  highlight?: HighlightColor;
  position?: number;
}

export interface TokenConnection {
  source: string;
  target: string;
  weight?: number;
  label?: string;
  highlight?: HighlightColor;
}

export interface TokenStepData {
  tokens: TokenData[];
  connections?: TokenConnection[];
  outputTokens?: TokenData[];
  processingIndex?: number;
  vocabulary?: { token: string; count: number }[];
}

export interface HeatmapCell {
  row: number;
  col: number;
  value: number;
  highlight?: HighlightColor;
}

export interface HeatmapStepData {
  cells: HeatmapCell[];
  rows: number;
  cols: number;
  rowLabels: string[];
  colLabels: string[];
  colorScale?: "attention" | "confusion" | "tfidf" | "generic";
  currentCell?: [number, number];
  title?: string;
}

export interface RLState {
  id: string;
  x: number;
  y: number;
  label: string;
  value?: number;
  reward?: number;
  highlight?: HighlightColor;
  isTerminal?: boolean;
}

export interface RLAction {
  from: string;
  to: string;
  label?: string;
  probability?: number;
  reward?: number;
  highlight?: HighlightColor;
}

export interface RLStepData {
  states: RLState[];
  actions: RLAction[];
  currentState?: string;
  qTable?: Record<string, Record<string, number>>;
  policy?: Record<string, string>;
  epsilon?: number;
  totalReward?: number;
  episode?: number;
}

export interface FunctionPlotPoint {
  x: number;
  y: number;
}

export interface FunctionPlotStepData {
  functions: {
    name: string;
    points: FunctionPlotPoint[];
    color: string;
    active?: boolean;
  }[];
  currentX?: number;
  xLabel?: string;
  yLabel?: string;
  xRange: [number, number];
  yRange: [number, number];
  annotations?: { x: number; y: number; label: string }[];
  gradientArrow?: { x: number; y: number; dx: number; dy: number };
}

export interface ConvolutionStepData {
  input: number[][];
  kernel: number[][];
  output: number[][];
  kernelPosition?: [number, number];
  padding?: number;
  stride?: number;
  currentOutputCell?: [number, number];
  computationDetail?: string;
}
