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

// Directed edges for Bellman-Ford (includes some edges with lower weights to
// show relaxation across multiple passes)
export const DEFAULT_EDGES: WeightedEdge[] = [
  { source: "A", target: "B", weight: 4, directed: true },
  { source: "A", target: "D", weight: 5, directed: true },
  { source: "B", target: "C", weight: 3, directed: true },
  { source: "B", target: "E", weight: 1, directed: true },
  { source: "C", target: "F", weight: 2, directed: true },
  { source: "D", target: "B", weight: -2, directed: true },
  { source: "D", target: "E", weight: 6, directed: true },
  { source: "E", target: "F", weight: 1, directed: true },
];

function cloneEdges(edges: WeightedEdge[]): WeightedEdge[] {
  return edges.map((e) => ({ ...e }));
}

export function generateBellmanFordSteps(
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

  // Initialize
  nodes.forEach((n) => {
    nodeStates[n.id] = "unvisited";
    distances[n.id] = Infinity;
    predecessors[n.id] = null;
  });
  distances[startNode] = 0;
  nodeStates[startNode] = "visiting";

  steps.push({
    id: stepId++,
    description: `Initialize Bellman-Ford from source ${startNode}. Set dist[${startNode}] = 0, all others = \u221E. We will perform ${nodes.length - 1} passes over all ${edges.length} edges.`,
    action: "highlight",
    highlights: [],
    data: {
      nodes,
      edges: cloneEdges(edges),
      nodeStates: { ...nodeStates },
      currentNode: startNode,
      distances: { ...distances },
      predecessors: { ...predecessors },
      visitOrder: [],
    } satisfies WeightedGraphStepData,
  });

  const V = nodes.length;

  // V-1 relaxation passes
  for (let pass = 1; pass <= V - 1; pass++) {
    let anyUpdate = false;

    steps.push({
      id: stepId++,
      description: `--- Pass ${pass} of ${V - 1} --- Iterate over all ${edges.length} edges and attempt to relax each one.`,
      action: "highlight",
      highlights: [],
      data: {
        nodes,
        edges: cloneEdges(edges),
        nodeStates: { ...nodeStates },
        currentNode: null,
        distances: { ...distances },
        predecessors: { ...predecessors },
        visitOrder: [...visitOrder],
      } satisfies WeightedGraphStepData,
    });

    for (let eIdx = 0; eIdx < edges.length; eIdx++) {
      const edge = edges[eIdx];
      const u = edge.source;
      const v = edge.target;
      const w = edge.weight;

      const edgesCopy = cloneEdges(edges);
      edgesCopy[eIdx].highlight = "comparing";

      if (distances[u] === Infinity) {
        steps.push({
          id: stepId++,
          description: `Pass ${pass}: Edge ${u} \u2192 ${v} (weight ${w}). dist[${u}] = \u221E, so cannot relax. Skip.`,
          action: "compare",
          highlights: [],
          data: {
            nodes,
            edges: edgesCopy,
            nodeStates: { ...nodeStates },
            currentNode: u,
            distances: { ...distances },
            predecessors: { ...predecessors },
            visitOrder: [...visitOrder],
          } satisfies WeightedGraphStepData,
        });
        continue;
      }

      const newDist = distances[u] + w;

      if (newDist < distances[v]) {
        const oldDist = distances[v];
        distances[v] = newDist;
        predecessors[v] = u;
        anyUpdate = true;

        if (nodeStates[v] === "unvisited") {
          nodeStates[v] = "visiting";
        }
        if (!visitOrder.includes(v)) {
          visitOrder.push(v);
        }

        const relaxedEdges = cloneEdges(edges);
        relaxedEdges[eIdx].highlight = "relaxed";

        steps.push({
          id: stepId++,
          description: `Pass ${pass}: Relax edge ${u} \u2192 ${v} (weight ${w}). dist[${u}] + ${w} = ${newDist} < ${oldDist === Infinity ? "\u221E" : oldDist} = dist[${v}]. Update dist[${v}] = ${newDist}.`,
          action: "relax-edge",
          highlights: [],
          data: {
            nodes,
            edges: relaxedEdges,
            nodeStates: { ...nodeStates },
            currentNode: v,
            distances: { ...distances },
            predecessors: { ...predecessors },
            visitOrder: [...visitOrder],
          } satisfies WeightedGraphStepData,
        });
      } else {
        steps.push({
          id: stepId++,
          description: `Pass ${pass}: Edge ${u} \u2192 ${v} (weight ${w}). dist[${u}] + ${w} = ${newDist} \u2265 ${distances[v]} = dist[${v}]. No improvement.`,
          action: "compare",
          highlights: [],
          data: {
            nodes,
            edges: edgesCopy,
            nodeStates: { ...nodeStates },
            currentNode: u,
            distances: { ...distances },
            predecessors: { ...predecessors },
            visitOrder: [...visitOrder],
          } satisfies WeightedGraphStepData,
        });
      }
    }

    if (!anyUpdate) {
      steps.push({
        id: stepId++,
        description: `Pass ${pass} complete with no updates. Early termination: all shortest paths are finalized.`,
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
        } satisfies WeightedGraphStepData,
      });
      break;
    }

    steps.push({
      id: stepId++,
      description: `Pass ${pass} complete. Distances updated during this pass.`,
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
      } satisfies WeightedGraphStepData,
    });
  }

  // Negative cycle detection pass
  let negCycleFound = false;

  steps.push({
    id: stepId++,
    description: `Running negative cycle detection pass (pass ${V}). If any edge can still be relaxed, a negative cycle exists.`,
    action: "highlight",
    highlights: [],
    data: {
      nodes,
      edges: cloneEdges(edges),
      nodeStates: { ...nodeStates },
      currentNode: null,
      distances: { ...distances },
      predecessors: { ...predecessors },
      visitOrder: [...visitOrder],
    } satisfies WeightedGraphStepData,
  });

  for (const edge of edges) {
    const u = edge.source;
    const v = edge.target;
    const w = edge.weight;

    if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
      negCycleFound = true;
      break;
    }
  }

  // Mark all nodes as visited
  nodes.forEach((n) => {
    if (nodeStates[n.id] !== "unvisited") {
      nodeStates[n.id] = "visited";
    }
  });

  if (negCycleFound) {
    steps.push({
      id: stepId++,
      description: `Negative cycle detected! Some shortest paths are undefined (can be made arbitrarily small).`,
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
      } satisfies WeightedGraphStepData,
    });
  } else {
    steps.push({
      id: stepId++,
      description: `No negative cycle detected. Bellman-Ford complete! Shortest distances from ${startNode}: ${nodes.map((n) => `${n.id}=${distances[n.id] === Infinity ? "\u221E" : distances[n.id]}`).join(", ")}`,
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
      } satisfies WeightedGraphStepData,
    });
  }

  return steps;
}
