import type {
  VisualizationStep,
  WeightedGraphStepData,
  GraphNode,
  WeightedEdge,
} from "@/lib/visualization/types";

export const DEFAULT_NODES: GraphNode[] = [
  { id: "A", x: 80, y: 60, label: "A" },
  { id: "B", x: 220, y: 40, label: "B" },
  { id: "C", x: 350, y: 80, label: "C" },
  { id: "D", x: 100, y: 200, label: "D" },
  { id: "E", x: 250, y: 220, label: "E" },
  { id: "F", x: 370, y: 200, label: "F" },
];

export const DEFAULT_EDGES: WeightedEdge[] = [
  { source: "A", target: "B", weight: 4 },
  { source: "A", target: "D", weight: 2 },
  { source: "B", target: "C", weight: 3 },
  { source: "B", target: "E", weight: 3 },
  { source: "C", target: "F", weight: 2 },
  { source: "D", target: "E", weight: 6 },
  { source: "E", target: "F", weight: 1 },
  { source: "B", target: "D", weight: 5 },
  { source: "A", target: "E", weight: 7 },
];

// --- Union-Find ---
class UnionFind {
  parent: Record<string, string>;
  rank: Record<string, number>;

  constructor(nodes: string[]) {
    this.parent = {};
    this.rank = {};
    for (const n of nodes) {
      this.parent[n] = n;
      this.rank[n] = 0;
    }
  }

  find(x: string): string {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

function cloneEdges(edges: WeightedEdge[]): WeightedEdge[] {
  return edges.map((e) => ({ ...e }));
}

export function generateKruskalSteps(
  nodes: GraphNode[] = DEFAULT_NODES,
  edges: WeightedEdge[] = DEFAULT_EDGES
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const nodeStates: Record<string, "unvisited" | "visiting" | "visited" | "in-queue"> = {};
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  const visitOrder: string[] = [];
  const mstEdges: { source: string; target: string }[] = [];
  let totalWeight = 0;

  nodes.forEach((n) => {
    nodeStates[n.id] = "unvisited";
    distances[n.id] = 0;
    predecessors[n.id] = null;
  });

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  steps.push({
    id: stepId++,
    description: `Initialize Kruskal's algorithm. Sort all ${edges.length} edges by weight. Sorted order: ${sortedEdges.map((e) => `${e.source}-${e.target}(${e.weight})`).join(", ")}. Initialize Union-Find for cycle detection.`,
    action: "highlight",
    highlights: [],
    data: {
      nodes,
      edges: cloneEdges(edges),
      nodeStates: { ...nodeStates },
      currentNode: null,
      distances: { ...distances },
      predecessors: { ...predecessors },
      visitOrder: [],
      mstEdges: [],
      totalWeight: 0,
    } satisfies WeightedGraphStepData,
  });

  const uf = new UnionFind(nodes.map((n) => n.id));
  const neededEdges = nodes.length - 1;

  for (let i = 0; i < sortedEdges.length; i++) {
    if (mstEdges.length >= neededEdges) break;

    const edge = sortedEdges[i];
    const { source, target, weight } = edge;

    // Highlight the edge being considered
    const edgesCopy = cloneEdges(edges);
    for (const e of edgesCopy) {
      if (
        (e.source === source && e.target === target) ||
        (e.target === source && e.source === target)
      ) {
        e.highlight = "comparing";
      }
      // Mark existing MST edges
      for (const mst of mstEdges) {
        if (
          (e.source === mst.source && e.target === mst.target) ||
          (e.target === mst.source && e.source === mst.target)
        ) {
          e.inMST = true;
        }
      }
    }

    nodeStates[source] = "visiting";
    nodeStates[target] = "visiting";

    steps.push({
      id: stepId++,
      description: `Consider edge ${source}-${target} (weight ${weight}) — the next smallest edge. Check if adding it creates a cycle using Union-Find.`,
      action: "compare",
      highlights: [],
      data: {
        nodes,
        edges: edgesCopy,
        nodeStates: { ...nodeStates },
        currentNode: null,
        distances: { ...distances },
        predecessors: { ...predecessors },
        visitOrder: [...visitOrder],
        mstEdges: [...mstEdges],
        totalWeight,
      } satisfies WeightedGraphStepData,
    });

    const merged = uf.union(source, target);

    if (merged) {
      // Add to MST
      mstEdges.push({ source, target });
      totalWeight += weight;

      nodeStates[source] = "visited";
      nodeStates[target] = "visited";
      if (!visitOrder.includes(source)) visitOrder.push(source);
      if (!visitOrder.includes(target)) visitOrder.push(target);

      const mstCopy = cloneEdges(edges);
      for (const e of mstCopy) {
        for (const mst of mstEdges) {
          if (
            (e.source === mst.source && e.target === mst.target) ||
            (e.target === mst.source && e.source === mst.target)
          ) {
            e.inMST = true;
          }
        }
        if (
          (e.source === source && e.target === target) ||
          (e.target === source && e.source === target)
        ) {
          e.highlight = "mst-edge";
          e.inMST = true;
        }
      }

      steps.push({
        id: stepId++,
        description: `${source} and ${target} are in different components. Add edge ${source}-${target} (weight ${weight}) to MST. Total weight: ${totalWeight}. MST has ${mstEdges.length}/${neededEdges} edges.`,
        action: "mark-mst",
        highlights: [],
        data: {
          nodes,
          edges: mstCopy,
          nodeStates: { ...nodeStates },
          currentNode: null,
          distances: { ...distances },
          predecessors: { ...predecessors },
          visitOrder: [...visitOrder],
          mstEdges: [...mstEdges],
          totalWeight,
        } satisfies WeightedGraphStepData,
      });
    } else {
      // Would create a cycle
      nodeStates[source] = "visited";
      nodeStates[target] = "visited";

      const skipCopy = cloneEdges(edges);
      for (const e of skipCopy) {
        if (
          (e.source === source && e.target === target) ||
          (e.target === source && e.source === target)
        ) {
          e.highlight = "backtracked";
        }
        for (const mst of mstEdges) {
          if (
            (e.source === mst.source && e.target === mst.target) ||
            (e.target === mst.source && e.source === mst.target)
          ) {
            e.inMST = true;
          }
        }
      }

      steps.push({
        id: stepId++,
        description: `${source} and ${target} are already in the same component (Find(${source}) = Find(${target})). Adding this edge would create a cycle. Skip.`,
        action: "compare",
        highlights: [],
        data: {
          nodes,
          edges: skipCopy,
          nodeStates: { ...nodeStates },
          currentNode: null,
          distances: { ...distances },
          predecessors: { ...predecessors },
          visitOrder: [...visitOrder],
          mstEdges: [...mstEdges],
          totalWeight,
        } satisfies WeightedGraphStepData,
      });
    }
  }

  // Final step — mark all MST edges
  const finalEdges = cloneEdges(edges);
  for (const e of finalEdges) {
    for (const mst of mstEdges) {
      if (
        (e.source === mst.source && e.target === mst.target) ||
        (e.target === mst.source && e.source === mst.target)
      ) {
        e.inMST = true;
      }
    }
  }
  nodes.forEach((n) => {
    nodeStates[n.id] = "visited";
  });

  steps.push({
    id: stepId++,
    description: `Kruskal's algorithm complete! MST contains ${mstEdges.length} edges with total weight ${totalWeight}. Edges: ${mstEdges.map((e) => `${e.source}-${e.target}`).join(", ")}.`,
    action: "complete",
    highlights: [],
    data: {
      nodes,
      edges: finalEdges,
      nodeStates: { ...nodeStates },
      currentNode: null,
      distances: { ...distances },
      predecessors: { ...predecessors },
      visitOrder: [...visitOrder],
      mstEdges: [...mstEdges],
      totalWeight,
    } satisfies WeightedGraphStepData,
  });

  return steps;
}
