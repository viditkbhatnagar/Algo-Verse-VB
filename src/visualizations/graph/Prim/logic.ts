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

function getNeighbors(
  nodeId: string,
  edges: WeightedEdge[]
): { neighbor: string; weight: number }[] {
  const neighbors: { neighbor: string; weight: number }[] = [];
  for (const edge of edges) {
    if (edge.source === nodeId)
      neighbors.push({ neighbor: edge.target, weight: edge.weight });
    if (edge.target === nodeId)
      neighbors.push({ neighbor: edge.source, weight: edge.weight });
  }
  return neighbors;
}

function cloneEdges(edges: WeightedEdge[]): WeightedEdge[] {
  return edges.map((e) => ({ ...e }));
}

export function generatePrimSteps(
  nodes: GraphNode[] = DEFAULT_NODES,
  edges: WeightedEdge[] = DEFAULT_EDGES,
  startNode: string = "A"
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const nodeStates: Record<string, "unvisited" | "visiting" | "visited" | "in-queue"> = {};
  const distances: Record<string, number> = {}; // key values (min edge weight to MST)
  const predecessors: Record<string, string | null> = {};
  const visitOrder: string[] = [];
  const mstEdges: { source: string; target: string }[] = [];
  let totalWeight = 0;

  // Initialize
  nodes.forEach((n) => {
    nodeStates[n.id] = "unvisited";
    distances[n.id] = Infinity;
    predecessors[n.id] = null;
  });
  distances[startNode] = 0;
  nodeStates[startNode] = "in-queue";

  // Priority queue: [key, node]
  const pq: { node: string; priority: number }[] = [
    { node: startNode, priority: 0 },
  ];

  steps.push({
    id: stepId++,
    description: `Initialize Prim's algorithm from node ${startNode}. Set key[${startNode}] = 0, all others = \u221E. The key value represents the minimum edge weight connecting a node to the MST.`,
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
      priorityQueue: [...pq],
    } satisfies WeightedGraphStepData,
  });

  const inMST = new Set<string>();

  while (pq.length > 0) {
    // Extract minimum
    pq.sort((a, b) => a.priority - b.priority);
    const { node: current, priority: currentKey } = pq.shift()!;

    if (inMST.has(current)) continue;

    // Add to MST
    inMST.add(current);
    nodeStates[current] = "visited";
    visitOrder.push(current);

    // Add the MST edge (except for the start node)
    if (predecessors[current] !== null) {
      mstEdges.push({
        source: predecessors[current]!,
        target: current,
      });
      totalWeight += currentKey;
    }

    // Build edges copy with MST highlighting
    const extractEdges = cloneEdges(edges);
    for (const e of extractEdges) {
      for (const mst of mstEdges) {
        if (
          (e.source === mst.source && e.target === mst.target) ||
          (e.target === mst.source && e.source === mst.target)
        ) {
          e.inMST = true;
        }
      }
    }

    if (predecessors[current] !== null) {
      steps.push({
        id: stepId++,
        description: `Extract node ${current} from PQ (key=${currentKey}). Add edge ${predecessors[current]}-${current} (weight ${currentKey}) to MST. Total weight: ${totalWeight}. MST has ${mstEdges.length}/${nodes.length - 1} edges.`,
        action: "mark-mst",
        highlights: [],
        data: {
          nodes,
          edges: extractEdges,
          nodeStates: { ...nodeStates },
          currentNode: current,
          distances: { ...distances },
          predecessors: { ...predecessors },
          visitOrder: [...visitOrder],
          mstEdges: [...mstEdges],
          totalWeight,
          priorityQueue: pq.map((p) => ({ ...p })),
        } satisfies WeightedGraphStepData,
      });
    } else {
      steps.push({
        id: stepId++,
        description: `Extract starting node ${current} from PQ. This is the root of the MST. Now examine its neighbors to find the cheapest connecting edges.`,
        action: "visit",
        highlights: [],
        data: {
          nodes,
          edges: extractEdges,
          nodeStates: { ...nodeStates },
          currentNode: current,
          distances: { ...distances },
          predecessors: { ...predecessors },
          visitOrder: [...visitOrder],
          mstEdges: [...mstEdges],
          totalWeight,
          priorityQueue: pq.map((p) => ({ ...p })),
        } satisfies WeightedGraphStepData,
      });
    }

    // Examine neighbors
    const neighbors = getNeighbors(current, edges);

    for (const { neighbor, weight } of neighbors) {
      if (inMST.has(neighbor)) continue;

      const edgesCopy = cloneEdges(edges);
      for (const e of edgesCopy) {
        for (const mst of mstEdges) {
          if (
            (e.source === mst.source && e.target === mst.target) ||
            (e.target === mst.source && e.source === mst.target)
          ) {
            e.inMST = true;
          }
        }
        if (
          (e.source === current && e.target === neighbor) ||
          (e.target === current && e.source === neighbor)
        ) {
          e.highlight = "comparing";
        }
      }

      if (weight < distances[neighbor]) {
        const oldKey = distances[neighbor];
        distances[neighbor] = weight;
        predecessors[neighbor] = current;

        pq.push({ node: neighbor, priority: weight });
        nodeStates[neighbor] = "in-queue";

        const relaxedEdges = cloneEdges(edges);
        for (const e of relaxedEdges) {
          for (const mst of mstEdges) {
            if (
              (e.source === mst.source && e.target === mst.target) ||
              (e.target === mst.source && e.source === mst.target)
            ) {
              e.inMST = true;
            }
          }
          if (
            (e.source === current && e.target === neighbor) ||
            (e.target === current && e.source === neighbor)
          ) {
            e.highlight = "relaxed";
          }
        }

        steps.push({
          id: stepId++,
          description: `Edge ${current}-${neighbor} has weight ${weight} < current key[${neighbor}] = ${oldKey === Infinity ? "\u221E" : oldKey}. Update key[${neighbor}] = ${weight} and set predecessor to ${current}.`,
          action: "relax-edge",
          highlights: [],
          data: {
            nodes,
            edges: relaxedEdges,
            nodeStates: { ...nodeStates },
            currentNode: current,
            distances: { ...distances },
            predecessors: { ...predecessors },
            visitOrder: [...visitOrder],
            mstEdges: [...mstEdges],
            totalWeight,
            priorityQueue: pq.map((p) => ({ ...p })),
          } satisfies WeightedGraphStepData,
        });
      } else {
        steps.push({
          id: stepId++,
          description: `Edge ${current}-${neighbor} has weight ${weight} \u2265 current key[${neighbor}] = ${distances[neighbor]}. No update needed.`,
          action: "compare",
          highlights: [],
          data: {
            nodes,
            edges: edgesCopy,
            nodeStates: { ...nodeStates },
            currentNode: current,
            distances: { ...distances },
            predecessors: { ...predecessors },
            visitOrder: [...visitOrder],
            mstEdges: [...mstEdges],
            totalWeight,
            priorityQueue: pq.map((p) => ({ ...p })),
          } satisfies WeightedGraphStepData,
        });
      }
    }
  }

  // Final step
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
    description: `Prim's algorithm complete! MST contains ${mstEdges.length} edges with total weight ${totalWeight}. Edges: ${mstEdges.map((e) => `${e.source}-${e.target}`).join(", ")}.`,
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
      priorityQueue: [],
    } satisfies WeightedGraphStepData,
  });

  return steps;
}
