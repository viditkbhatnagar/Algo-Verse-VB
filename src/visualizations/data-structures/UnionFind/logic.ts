import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";

/**
 * Step data for Union-Find visualization.
 */
export interface UnionFindStepData {
  elements: {
    id: string;
    parent: string;
    rank: number;
    highlight?: HighlightColor;
  }[];
  sets: string[][];
  currentOperation?: string;
}

/**
 * Generate visualization steps for Union-Find with union by rank and path compression.
 * Starts with 6 elements {0,1,2,3,4,5}. Operations:
 * union(0,1), union(2,3), union(0,2), find(3) with path compression.
 */
export function generateUnionFindSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const n = 6;
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = new Array(n).fill(0);

  function cloneElements(highlights?: Record<number, HighlightColor>): UnionFindStepData["elements"] {
    return parent.map((_, i) => ({
      id: String(i),
      parent: String(parent[i]),
      rank: rank[i],
      highlight: highlights?.[i],
    }));
  }

  function getSets(): string[][] {
    const setMap: Record<number, number[]> = {};
    for (let i = 0; i < n; i++) {
      const root = findRoot(i);
      if (!setMap[root]) setMap[root] = [];
      setMap[root].push(i);
    }
    return Object.values(setMap).map((s) => s.map(String));
  }

  // Non-modifying find for set computation
  function findRoot(x: number): number {
    let r = x;
    while (parent[r] !== r) r = parent[r];
    return r;
  }

  // Step 0: Initialize
  steps.push({
    id: stepId++,
    description: `Initialize Union-Find with ${n} elements {0, 1, 2, 3, 4, 5}. Each element is its own set: parent[i] = i, rank[i] = 0. We have ${n} disjoint sets.`,
    action: "highlight",
    highlights: [],
    data: {
      elements: cloneElements(),
      sets: getSets(),
      currentOperation: "MakeSet(0..5)",
    } satisfies UnionFindStepData,
    variables: { numSets: n },
  });

  // --- UNION(0, 1) ---
  steps.push({
    id: stepId++,
    description: `Union(0, 1): Find root of 0 → root is 0. Find root of 1 → root is 1. Roots are different, so we merge the sets.`,
    action: "visit",
    highlights: [{ indices: [0, 1], color: "comparing" }],
    data: {
      elements: cloneElements({ 0: "comparing", 1: "comparing" }),
      sets: getSets(),
      currentOperation: "Union(0, 1) — finding roots",
    } satisfies UnionFindStepData,
    variables: { rootX: 0, rootY: 1, rankX: 0, rankY: 0 },
  });

  // Both rank 0 → make 1's parent = 0, increment rank[0]
  parent[1] = 0;
  rank[0] = 1;

  steps.push({
    id: stepId++,
    description: `Union(0, 1): Both roots have rank 0, so we pick root 0 as the new parent. Set parent[1] = 0 and increment rank[0] to 1. Now {0, 1} form one set.`,
    action: "union",
    highlights: [{ indices: [0, 1], color: "active" }],
    data: {
      elements: cloneElements({ 0: "active", 1: "active" }),
      sets: getSets(),
      currentOperation: "Union(0, 1) — parent[1] = 0, rank[0]++",
    } satisfies UnionFindStepData,
    variables: { numSets: 5, parent: [...parent], rank: [...rank] },
  });

  // --- UNION(2, 3) ---
  steps.push({
    id: stepId++,
    description: `Union(2, 3): Find root of 2 → root is 2. Find root of 3 → root is 3. Roots differ, so we merge.`,
    action: "visit",
    highlights: [{ indices: [2, 3], color: "comparing" }],
    data: {
      elements: cloneElements({ 2: "comparing", 3: "comparing" }),
      sets: getSets(),
      currentOperation: "Union(2, 3) — finding roots",
    } satisfies UnionFindStepData,
    variables: { rootX: 2, rootY: 3, rankX: 0, rankY: 0 },
  });

  parent[3] = 2;
  rank[2] = 1;

  steps.push({
    id: stepId++,
    description: `Union(2, 3): Both rank 0 — attach 3 under 2. Set parent[3] = 2, increment rank[2] to 1. Now {2, 3} form one set. We have 4 disjoint sets.`,
    action: "union",
    highlights: [{ indices: [2, 3], color: "active" }],
    data: {
      elements: cloneElements({ 2: "active", 3: "active" }),
      sets: getSets(),
      currentOperation: "Union(2, 3) — parent[3] = 2, rank[2]++",
    } satisfies UnionFindStepData,
    variables: { numSets: 4, parent: [...parent], rank: [...rank] },
  });

  // --- UNION(0, 2) ---
  steps.push({
    id: stepId++,
    description: `Union(0, 2): Find root of 0 → root is 0 (rank 1). Find root of 2 → root is 2 (rank 1). Both roots have rank 1.`,
    action: "visit",
    highlights: [{ indices: [0, 1, 2, 3], color: "comparing" }],
    data: {
      elements: cloneElements({ 0: "comparing", 1: "comparing", 2: "comparing", 3: "comparing" }),
      sets: getSets(),
      currentOperation: "Union(0, 2) — finding roots",
    } satisfies UnionFindStepData,
    variables: { rootX: 0, rootY: 2, rankX: 1, rankY: 1 },
  });

  parent[2] = 0;
  rank[0] = 2;

  steps.push({
    id: stepId++,
    description: `Union(0, 2): Equal ranks — attach root 2 under root 0. Set parent[2] = 0, increment rank[0] to 2. Now {0, 1, 2, 3} are all in one set. 3 disjoint sets remain: {0,1,2,3}, {4}, {5}.`,
    action: "union",
    highlights: [{ indices: [0, 1, 2, 3], color: "active" }],
    data: {
      elements: cloneElements({ 0: "active", 1: "active", 2: "active", 3: "active" }),
      sets: getSets(),
      currentOperation: "Union(0, 2) — parent[2] = 0, rank[0]++",
    } satisfies UnionFindStepData,
    variables: { numSets: 3, parent: [...parent], rank: [...rank] },
  });

  // --- FIND(3) with path compression ---
  // Current state: parent = [0, 0, 0, 2, 4, 5], 3 → 2 → 0
  steps.push({
    id: stepId++,
    description: `Find(3): Follow parent pointers: 3 → parent[3] = 2 → parent[2] = 0 → parent[0] = 0 (root found!). The path is 3 → 2 → 0.`,
    action: "visit",
    highlights: [{ indices: [3, 2, 0], color: "comparing" }],
    data: {
      elements: cloneElements({ 3: "comparing", 2: "comparing", 0: "active" }),
      sets: getSets(),
      currentOperation: "Find(3) — traversing path: 3 → 2 → 0",
    } satisfies UnionFindStepData,
    variables: { path: [3, 2, 0], root: 0 },
  });

  // Apply path compression: point 3 directly to root 0
  parent[3] = 0;

  steps.push({
    id: stepId++,
    description: `Find(3) — Path compression: Redirect node 3 to point directly to root 0, bypassing node 2. Now parent[3] = 0 (was 2). Future find(3) calls will be O(1). This is the power of path compression — it flattens the tree.`,
    action: "update-weight",
    highlights: [{ indices: [3, 0], color: "completed" }],
    data: {
      elements: cloneElements({ 3: "completed", 0: "completed" }),
      sets: getSets(),
      currentOperation: "Find(3) — path compression: parent[3] = 0",
    } satisfies UnionFindStepData,
    variables: { compressed: 3, newParent: 0, parent: [...parent] },
  });

  // Final state
  steps.push({
    id: stepId++,
    description: `Union-Find operations complete! Three disjoint sets remain: {0, 1, 2, 3}, {4}, {5}. The tree for the large set is nearly flat thanks to path compression. Union by rank kept trees balanced during merges. Together these optimizations give O(α(n)) amortized time per operation.`,
    action: "complete",
    highlights: [{ indices: [0, 1, 2, 3, 4, 5], color: "completed" }],
    data: {
      elements: cloneElements({ 0: "completed", 1: "completed", 2: "completed", 3: "completed", 4: "completed", 5: "completed" }),
      sets: getSets(),
      currentOperation: "Complete",
    } satisfies UnionFindStepData,
    variables: { numSets: 3, parent: [...parent], rank: [...rank] },
  });

  return steps;
}
