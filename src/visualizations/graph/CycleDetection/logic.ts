import type {
  VisualizationStep,
  WeightedGraphStepData,
  GraphNode,
  WeightedEdge,
} from "@/lib/visualization/types";

export const DEFAULT_NODES: GraphNode[] = [
  { id: "A", x: 80, y: 80, label: "A" },
  { id: "B", x: 220, y: 50, label: "B" },
  { id: "C", x: 350, y: 80, label: "C" },
  { id: "D", x: 150, y: 200, label: "D" },
  { id: "E", x: 300, y: 200, label: "E" },
];

// Directed edges: A->B, B->C, C->E, E->D, D->A (cycle!), A->D
export const DEFAULT_EDGES: WeightedEdge[] = [
  { source: "A", target: "B", weight: 0, directed: true },
  { source: "B", target: "C", weight: 0, directed: true },
  { source: "C", target: "E", weight: 0, directed: true },
  { source: "E", target: "D", weight: 0, directed: true },
  { source: "D", target: "A", weight: 0, directed: true }, // Creates cycle: A->B->C->E->D->A
  { source: "A", target: "D", weight: 0, directed: true },
];

type Color = "white" | "gray" | "black";

function colorToNodeState(
  color: Color,
  isCycleNode: boolean,
): "unvisited" | "visiting" | "visited" | "in-queue" {
  if (isCycleNode) return "in-queue"; // Will be displayed differently
  switch (color) {
    case "white":
      return "unvisited";
    case "gray":
      return "visiting";
    case "black":
      return "visited";
  }
}

function cloneEdges(edges: WeightedEdge[]): WeightedEdge[] {
  return edges.map((e) => ({ ...e }));
}

function buildNodeStates(
  nodes: GraphNode[],
  colors: Record<string, Color>,
  cycleNodes: Set<string>,
): Record<string, "unvisited" | "visiting" | "visited" | "in-queue"> {
  const states: Record<string, "unvisited" | "visiting" | "visited" | "in-queue"> = {};
  for (const node of nodes) {
    states[node.id] = colorToNodeState(
      colors[node.id],
      cycleNodes.has(node.id),
    );
  }
  return states;
}

function getAdjacencyList(edges: WeightedEdge[]): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const edge of edges) {
    if (!adj[edge.source]) adj[edge.source] = [];
    adj[edge.source].push(edge.target);
  }
  return adj;
}

export function generateCycleDetectionSteps(
  nodes: GraphNode[] = DEFAULT_NODES,
  edges: WeightedEdge[] = DEFAULT_EDGES,
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const colors: Record<string, Color> = {};
  const parent: Record<string, string | null> = {};
  const cycleNodes = new Set<string>();
  const visitOrder: string[] = [];

  // Initialize all nodes as white
  for (const node of nodes) {
    colors[node.id] = "white";
    parent[node.id] = null;
  }

  const adj = getAdjacencyList(edges);

  // Initial step
  steps.push({
    id: stepId++,
    description:
      "Initialize Cycle Detection using DFS coloring. All nodes start as White (unvisited). Colors: White = unvisited, Gray = currently exploring (on recursion stack), Black = fully explored.",
    action: "highlight",
    highlights: [],
    data: {
      nodes,
      edges: cloneEdges(edges),
      nodeStates: buildNodeStates(nodes, colors, cycleNodes),
      currentNode: null,
      distances: Object.fromEntries(
        nodes.map((n) => [n.id, 0]),
      ),
      predecessors: Object.fromEntries(
        nodes.map((n) => [n.id, null]),
      ),
      visitOrder: [],
    } satisfies WeightedGraphStepData,
  });

  let cycleFound = false;
  let cycleEdge: { from: string; to: string } | null = null;

  function dfs(nodeId: string): boolean {
    colors[nodeId] = "gray";
    visitOrder.push(nodeId);

    steps.push({
      id: stepId++,
      description: `Start DFS on node ${nodeId}. Color ${nodeId} GRAY (currently exploring). It is now on the recursion stack.`,
      action: "visit",
      highlights: [],
      data: {
        nodes,
        edges: cloneEdges(edges),
        nodeStates: buildNodeStates(nodes, colors, cycleNodes),
        currentNode: nodeId,
        distances: Object.fromEntries(
          nodes.map((n) => {
            const c = colors[n.id];
            return [n.id, c === "white" ? 0 : c === "gray" ? 1 : 2];
          }),
        ),
        predecessors: { ...parent } as Record<string, string | null>,
        visitOrder: [...visitOrder],
      } satisfies WeightedGraphStepData,
    });

    const neighbors = adj[nodeId] ?? [];

    for (const neighbor of neighbors) {
      // Highlight the edge being explored
      const edgesCopy = cloneEdges(edges);
      for (const e of edgesCopy) {
        if (e.source === nodeId && e.target === neighbor) {
          e.highlight = "comparing";
        }
      }

      if (colors[neighbor] === "gray") {
        // Back edge found! Cycle detected!
        cycleFound = true;
        cycleEdge = { from: nodeId, to: neighbor };

        // Mark the cycle edges
        for (const e of edgesCopy) {
          if (e.source === nodeId && e.target === neighbor) {
            e.highlight = "swapping";
          }
        }

        // Trace cycle
        const cycle: string[] = [neighbor];
        let trace = nodeId;
        while (trace !== neighbor) {
          cycle.push(trace);
          cycleNodes.add(trace);
          trace = parent[trace]!;
        }
        cycle.push(neighbor);
        cycleNodes.add(neighbor);

        // Highlight all cycle edges
        for (const ce of edgesCopy) {
          for (let i = 0; i < cycle.length - 1; i++) {
            if (ce.source === cycle[i + 1] && ce.target === cycle[i]) {
              ce.highlight = "swapping";
            }
          }
          // Also highlight the back edge
          if (ce.source === nodeId && ce.target === neighbor) {
            ce.highlight = "swapping";
          }
        }

        steps.push({
          id: stepId++,
          description: `CYCLE DETECTED! Edge ${nodeId} -> ${neighbor} is a back edge (${neighbor} is GRAY, meaning it's an ancestor on the current DFS path). Cycle: ${cycle.join(" -> ")}`,
          action: "highlight",
          highlights: [],
          data: {
            nodes,
            edges: edgesCopy,
            nodeStates: buildNodeStates(nodes, colors, cycleNodes),
            currentNode: nodeId,
            distances: Object.fromEntries(
              nodes.map((n) => {
                const c = colors[n.id];
                return [n.id, c === "white" ? 0 : c === "gray" ? 1 : 2];
              }),
            ),
            predecessors: { ...parent } as Record<string, string | null>,
            visitOrder: [...visitOrder],
          } satisfies WeightedGraphStepData,
        });

        return true;
      }

      if (colors[neighbor] === "white") {
        steps.push({
          id: stepId++,
          description: `Exploring edge ${nodeId} -> ${neighbor}. Node ${neighbor} is WHITE (unvisited), so we recurse into it.`,
          action: "compare",
          highlights: [],
          data: {
            nodes,
            edges: edgesCopy,
            nodeStates: buildNodeStates(nodes, colors, cycleNodes),
            currentNode: nodeId,
            distances: Object.fromEntries(
              nodes.map((n) => {
                const c = colors[n.id];
                return [n.id, c === "white" ? 0 : c === "gray" ? 1 : 2];
              }),
            ),
            predecessors: { ...parent } as Record<string, string | null>,
            visitOrder: [...visitOrder],
          } satisfies WeightedGraphStepData,
        });

        parent[neighbor] = nodeId;
        if (dfs(neighbor)) return true;
      } else {
        // Black node (cross/forward edge)
        steps.push({
          id: stepId++,
          description: `Edge ${nodeId} -> ${neighbor}: Node ${neighbor} is BLACK (fully explored). This is a cross/forward edge, not a back edge. No cycle through this edge.`,
          action: "compare",
          highlights: [],
          data: {
            nodes,
            edges: edgesCopy,
            nodeStates: buildNodeStates(nodes, colors, cycleNodes),
            currentNode: nodeId,
            distances: Object.fromEntries(
              nodes.map((n) => {
                const c = colors[n.id];
                return [n.id, c === "white" ? 0 : c === "gray" ? 1 : 2];
              }),
            ),
            predecessors: { ...parent } as Record<string, string | null>,
            visitOrder: [...visitOrder],
          } satisfies WeightedGraphStepData,
        });
      }
    }

    // Finish exploring this node
    colors[nodeId] = "black";

    steps.push({
      id: stepId++,
      description: `Finished exploring all neighbors of ${nodeId}. Color ${nodeId} BLACK (fully explored). Remove from recursion stack.`,
      action: "complete",
      highlights: [],
      data: {
        nodes,
        edges: cloneEdges(edges),
        nodeStates: buildNodeStates(nodes, colors, cycleNodes),
        currentNode: nodeId,
        distances: Object.fromEntries(
          nodes.map((n) => {
            const c = colors[n.id];
            return [n.id, c === "white" ? 0 : c === "gray" ? 1 : 2];
          }),
        ),
        predecessors: { ...parent } as Record<string, string | null>,
        visitOrder: [...visitOrder],
      } satisfies WeightedGraphStepData,
    });

    return false;
  }

  // Run DFS from each unvisited node
  for (const node of nodes) {
    if (colors[node.id] === "white" && !cycleFound) {
      dfs(node.id);
    }
  }

  if (!cycleFound) {
    steps.push({
      id: stepId++,
      description:
        "DFS complete. No back edges found. The graph is acyclic (it is a DAG).",
      action: "complete",
      highlights: [],
      data: {
        nodes,
        edges: cloneEdges(edges),
        nodeStates: buildNodeStates(nodes, colors, cycleNodes),
        currentNode: null,
        distances: Object.fromEntries(
          nodes.map((n) => [n.id, 2]),
        ),
        predecessors: Object.fromEntries(
          nodes.map((n) => [n.id, null]),
        ),
        visitOrder: [...visitOrder],
      } satisfies WeightedGraphStepData,
    });
  }

  return steps;
}
