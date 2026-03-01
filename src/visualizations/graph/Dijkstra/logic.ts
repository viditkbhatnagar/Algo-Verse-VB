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

export function generateDijkstraSteps(
  nodes: GraphNode[] = DEFAULT_NODES,
  edges: WeightedEdge[] = DEFAULT_EDGES,
  startNode: string = "A"
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const nodeStates: Record<string, "unvisited" | "visiting" | "visited" | "in-queue"> = {};
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  const visitOrder: string[] = [];

  // Initialize all nodes
  nodes.forEach((n) => {
    nodeStates[n.id] = "unvisited";
    distances[n.id] = Infinity;
    predecessors[n.id] = null;
  });

  distances[startNode] = 0;

  // Priority queue: [distance, node]
  const pq: { node: string; priority: number }[] = [
    { node: startNode, priority: 0 },
  ];
  nodeStates[startNode] = "in-queue";

  // Initial step
  steps.push({
    id: stepId++,
    description: `Initialize Dijkstra's algorithm from source node ${startNode}. Set dist[${startNode}] = 0 and all other distances to infinity. Add ${startNode} to the priority queue.`,
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
      priorityQueue: [...pq],
    } satisfies WeightedGraphStepData,
  });

  const visited = new Set<string>();

  while (pq.length > 0) {
    // Sort PQ to extract minimum
    pq.sort((a, b) => a.priority - b.priority);
    const { node: current, priority: currentDist } = pq.shift()!;

    if (visited.has(current)) {
      continue;
    }

    // Mark as visiting (currently processing)
    nodeStates[current] = "visiting";

    steps.push({
      id: stepId++,
      description: `Extract node ${current} from the priority queue with distance ${currentDist}. This is the unvisited node closest to the source.`,
      action: "visit",
      highlights: [],
      data: {
        nodes,
        edges: cloneEdges(edges),
        nodeStates: { ...nodeStates },
        currentNode: current,
        distances: { ...distances },
        predecessors: { ...predecessors },
        visitOrder: [...visitOrder],
        priorityQueue: pq.map((p) => ({ ...p })),
      } satisfies WeightedGraphStepData,
    });

    visited.add(current);
    nodeStates[current] = "visited";
    visitOrder.push(current);

    // Relax neighbors
    const neighbors = getNeighbors(current, edges);

    for (const { neighbor, weight } of neighbors) {
      if (visited.has(neighbor)) continue;

      const newDist = distances[current] + weight;
      const edgesCopy = cloneEdges(edges);

      // Highlight the edge being considered
      for (const e of edgesCopy) {
        if (
          (e.source === current && e.target === neighbor) ||
          (e.target === current && e.source === neighbor)
        ) {
          e.highlight = "comparing";
        }
      }

      if (newDist < distances[neighbor]) {
        const oldDist = distances[neighbor];
        distances[neighbor] = newDist;
        predecessors[neighbor] = current;

        // Add to PQ (or update)
        pq.push({ node: neighbor, priority: newDist });
        if (nodeStates[neighbor] !== "visited") {
          nodeStates[neighbor] = "in-queue";
        }

        // Highlight the relaxed edge
        for (const e of edgesCopy) {
          if (
            (e.source === current && e.target === neighbor) ||
            (e.target === current && e.source === neighbor)
          ) {
            e.highlight = "relaxed";
          }
        }

        steps.push({
          id: stepId++,
          description: `Relax edge ${current} -> ${neighbor} (weight ${weight}). New distance: dist[${current}] + ${weight} = ${newDist} < ${oldDist === Infinity ? "\u221E" : oldDist}. Update dist[${neighbor}] = ${newDist} and add to PQ.`,
          action: "relax-edge",
          highlights: [],
          data: {
            nodes,
            edges: edgesCopy,
            nodeStates: { ...nodeStates },
            currentNode: current,
            distances: { ...distances },
            predecessors: { ...predecessors },
            visitOrder: [...visitOrder],
            priorityQueue: pq.map((p) => ({ ...p })),
          } satisfies WeightedGraphStepData,
        });
      } else {
        steps.push({
          id: stepId++,
          description: `Consider edge ${current} -> ${neighbor} (weight ${weight}). New distance would be ${newDist}, but current dist[${neighbor}] = ${distances[neighbor]} is already shorter. No update needed.`,
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
            priorityQueue: pq.map((p) => ({ ...p })),
          } satisfies WeightedGraphStepData,
        });
      }
    }

    // Step after processing all neighbors
    steps.push({
      id: stepId++,
      description: `Finished processing all neighbors of node ${current}. Mark ${current} as visited. Visit order: ${visitOrder.join(" \u2192 ")}`,
      action: "complete",
      highlights: [],
      data: {
        nodes,
        edges: cloneEdges(edges),
        nodeStates: { ...nodeStates },
        currentNode: current,
        distances: { ...distances },
        predecessors: { ...predecessors },
        visitOrder: [...visitOrder],
        priorityQueue: pq.map((p) => ({ ...p })),
      } satisfies WeightedGraphStepData,
    });
  }

  // Final step
  steps.push({
    id: stepId++,
    description: `Dijkstra's algorithm complete! Shortest distances from ${startNode}: ${nodes.map((n) => `${n.id}=${distances[n.id] === Infinity ? "\u221E" : distances[n.id]}`).join(", ")}`,
    action: "complete",
    highlights: [],
    data: {
      nodes,
      edges: cloneEdges(edges),
      nodeStates: { ...nodeStates },
      currentNode: null,
      distances: { ...distances },
      predecessors: { ...predecessors },
      visitOrder: [...visitOrder],
      priorityQueue: [],
    } satisfies WeightedGraphStepData,
  });

  return steps;
}
