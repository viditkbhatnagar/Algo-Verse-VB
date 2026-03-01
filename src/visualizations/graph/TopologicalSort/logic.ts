import type {
  VisualizationStep,
  WeightedGraphStepData,
  GraphNode,
  WeightedEdge,
} from "@/lib/visualization/types";

// DAG layout — left-to-right topological structure
export const DEFAULT_NODES: GraphNode[] = [
  { id: "A", x: 60, y: 160, label: "A" },
  { id: "B", x: 170, y: 80, label: "B" },
  { id: "C", x: 170, y: 240, label: "C" },
  { id: "D", x: 290, y: 60, label: "D" },
  { id: "E", x: 290, y: 160, label: "E" },
  { id: "F", x: 400, y: 160, label: "F" },
];

// All edges are directed (DAG)
export const DEFAULT_EDGES: WeightedEdge[] = [
  { source: "A", target: "B", weight: 1, directed: true },
  { source: "A", target: "C", weight: 1, directed: true },
  { source: "B", target: "D", weight: 1, directed: true },
  { source: "B", target: "E", weight: 1, directed: true },
  { source: "C", target: "E", weight: 1, directed: true },
  { source: "D", target: "F", weight: 1, directed: true },
  { source: "E", target: "F", weight: 1, directed: true },
];

function getOutNeighbors(nodeId: string, edges: WeightedEdge[]): string[] {
  const neighbors: string[] = [];
  for (const edge of edges) {
    if (edge.source === nodeId) {
      neighbors.push(edge.target);
    }
  }
  return neighbors;
}

function cloneEdges(edges: WeightedEdge[]): WeightedEdge[] {
  return edges.map((e) => ({ ...e }));
}

export function generateTopologicalSortSteps(
  nodes: GraphNode[] = DEFAULT_NODES,
  edges: WeightedEdge[] = DEFAULT_EDGES
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const nodeStates: Record<string, "unvisited" | "visiting" | "visited" | "in-queue"> = {};
  const distances: Record<string, number> = {}; // Used to show ordering number
  const predecessors: Record<string, string | null> = {};
  const visitOrder: string[] = [];

  // Compute in-degrees
  const inDegree: Record<string, number> = {};
  nodes.forEach((n) => {
    nodeStates[n.id] = "unvisited";
    distances[n.id] = -1; // -1 = not yet ordered
    predecessors[n.id] = null;
    inDegree[n.id] = 0;
  });

  for (const edge of edges) {
    inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
  }

  steps.push({
    id: stepId++,
    description: `Initialize Kahn's algorithm for topological sort. Compute in-degrees: ${nodes.map((n) => `${n.id}=${inDegree[n.id]}`).join(", ")}. Nodes with in-degree 0 can be processed first.`,
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
      priorityQueue: nodes
        .filter((n) => inDegree[n.id] === 0)
        .map((n) => ({ node: n.id, priority: inDegree[n.id] })),
    } satisfies WeightedGraphStepData,
  });

  // Initialize queue with all zero-in-degree nodes
  const queue: string[] = [];
  for (const n of nodes) {
    if (inDegree[n.id] === 0) {
      queue.push(n.id);
      nodeStates[n.id] = "in-queue";
    }
  }

  steps.push({
    id: stepId++,
    description: `Add all nodes with in-degree 0 to the queue: [${queue.join(", ")}]. These have no prerequisites and can be placed first in the topological order.`,
    action: "enqueue",
    highlights: [],
    data: {
      nodes,
      edges: cloneEdges(edges),
      nodeStates: { ...nodeStates },
      currentNode: null,
      distances: { ...distances },
      predecessors: { ...predecessors },
      visitOrder: [],
      priorityQueue: queue.map((n) => ({ node: n, priority: inDegree[n] })),
    } satisfies WeightedGraphStepData,
  });

  let orderIndex = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    nodeStates[current] = "visiting";

    steps.push({
      id: stepId++,
      description: `Dequeue node ${current}. Assign topological position #${orderIndex + 1}. This node's dependencies are all satisfied.`,
      action: "dequeue",
      highlights: [],
      data: {
        nodes,
        edges: cloneEdges(edges),
        nodeStates: { ...nodeStates },
        currentNode: current,
        distances: { ...distances },
        predecessors: { ...predecessors },
        visitOrder: [...visitOrder],
        priorityQueue: queue.map((n) => ({ node: n, priority: inDegree[n] })),
      } satisfies WeightedGraphStepData,
    });

    // Add to visit order and assign ordering number
    visitOrder.push(current);
    distances[current] = orderIndex;
    orderIndex++;
    nodeStates[current] = "visited";

    // Process outgoing neighbors
    const outNeighbors = getOutNeighbors(current, edges);

    for (const neighbor of outNeighbors) {
      inDegree[neighbor]--;

      const edgesCopy = cloneEdges(edges);
      for (const e of edgesCopy) {
        if (e.source === current && e.target === neighbor) {
          e.highlight = "relaxed";
        }
      }

      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
        nodeStates[neighbor] = "in-queue";

        steps.push({
          id: stepId++,
          description: `Decrement in-degree of ${neighbor} to ${inDegree[neighbor]}. In-degree is now 0, so enqueue ${neighbor} -- all its prerequisites are processed.`,
          action: "enqueue",
          highlights: [],
          data: {
            nodes,
            edges: edgesCopy,
            nodeStates: { ...nodeStates },
            currentNode: current,
            distances: { ...distances },
            predecessors: { ...predecessors },
            visitOrder: [...visitOrder],
            priorityQueue: queue.map((n) => ({ node: n, priority: inDegree[n] })),
          } satisfies WeightedGraphStepData,
        });
      } else {
        steps.push({
          id: stepId++,
          description: `Decrement in-degree of ${neighbor} to ${inDegree[neighbor]}. Still has unprocessed predecessors, so it stays out of the queue.`,
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
            priorityQueue: queue.map((n) => ({ node: n, priority: inDegree[n] })),
          } satisfies WeightedGraphStepData,
        });
      }
    }

    steps.push({
      id: stepId++,
      description: `Finished processing node ${current}. Topological order so far: ${visitOrder.join(" \u2192 ")}`,
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
        priorityQueue: queue.map((n) => ({ node: n, priority: inDegree[n] })),
      } satisfies WeightedGraphStepData,
    });
  }

  // Check if all nodes were processed
  const allProcessed = visitOrder.length === nodes.length;

  nodes.forEach((n) => {
    nodeStates[n.id] = "visited";
  });

  if (allProcessed) {
    steps.push({
      id: stepId++,
      description: `Topological sort complete! All ${nodes.length} nodes processed. Topological order: ${visitOrder.join(" \u2192 ")}. Every directed edge goes from an earlier to a later position.`,
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
  } else {
    steps.push({
      id: stepId++,
      description: `Only ${visitOrder.length} of ${nodes.length} nodes processed. The graph contains a cycle -- no valid topological ordering exists!`,
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
  }

  return steps;
}
