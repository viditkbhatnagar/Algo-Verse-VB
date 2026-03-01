import type {
  VisualizationStep,
  GraphStepData,
  GraphNode,
  GraphEdge,
} from "@/lib/visualization/types";

export const DEFAULT_GRAPH_NODES: GraphNode[] = [
  { id: "A", x: 200, y: 40, label: "A" },
  { id: "B", x: 100, y: 130, label: "B" },
  { id: "C", x: 300, y: 130, label: "C" },
  { id: "D", x: 50, y: 230, label: "D" },
  { id: "E", x: 170, y: 230, label: "E" },
  { id: "F", x: 280, y: 230, label: "F" },
];

export const DEFAULT_GRAPH_EDGES: GraphEdge[] = [
  { source: "A", target: "B" },
  { source: "A", target: "C" },
  { source: "B", target: "D" },
  { source: "B", target: "E" },
  { source: "C", target: "F" },
  { source: "E", target: "F" },
];

function getNeighbors(nodeId: string, edges: GraphEdge[]): string[] {
  const neighbors: string[] = [];
  for (const edge of edges) {
    if (edge.source === nodeId) neighbors.push(edge.target);
    if (edge.target === nodeId) neighbors.push(edge.source);
  }
  return neighbors;
}

export function generateDFSSteps(
  nodes: GraphNode[] = DEFAULT_GRAPH_NODES,
  edges: GraphEdge[] = DEFAULT_GRAPH_EDGES,
  startNode: string = "A"
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const nodeStates: Record<string, "unvisited" | "visiting" | "visited"> = {};
  nodes.forEach((n) => (nodeStates[n.id] = "unvisited"));

  const stack: string[] = [];
  const visitOrder: string[] = [];

  steps.push({
    id: stepId++,
    description: `Starting DFS from node ${startNode}`,
    action: "highlight",
    highlights: [],
    data: {
      nodes,
      edges,
      nodeStates: { ...nodeStates },
      currentNode: null,
      dataStructure: { type: "stack", items: [] },
      visitOrder: [],
    } satisfies GraphStepData,
  });

  stack.push(startNode);
  steps.push({
    id: stepId++,
    description: `Push ${startNode} onto stack`,
    action: "push",
    highlights: [],
    data: {
      nodes,
      edges,
      nodeStates: { ...nodeStates },
      currentNode: null,
      dataStructure: { type: "stack", items: [...stack] },
      visitOrder: [...visitOrder],
    } satisfies GraphStepData,
  });

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (nodeStates[current] === "visited") {
      steps.push({
        id: stepId++,
        description: `Pop ${current} from stack — already visited, skipping`,
        action: "pop",
        highlights: [],
        data: {
          nodes,
          edges,
          nodeStates: { ...nodeStates },
          currentNode: null,
          dataStructure: { type: "stack", items: [...stack] },
          visitOrder: [...visitOrder],
        } satisfies GraphStepData,
      });
      continue;
    }

    nodeStates[current] = "visiting";

    steps.push({
      id: stepId++,
      description: `Pop ${current} from stack — visiting`,
      action: "visit",
      highlights: [{ indices: [], color: "active" }],
      data: {
        nodes,
        edges,
        nodeStates: { ...nodeStates },
        currentNode: current,
        dataStructure: { type: "stack", items: [...stack] },
        visitOrder: [...visitOrder],
      } satisfies GraphStepData,
    });

    nodeStates[current] = "visited";
    visitOrder.push(current);

    steps.push({
      id: stepId++,
      description: `Marked ${current} as visited. Visit order: ${visitOrder.join(" → ")}`,
      action: "complete",
      highlights: [],
      data: {
        nodes,
        edges,
        nodeStates: { ...nodeStates },
        currentNode: current,
        dataStructure: { type: "stack", items: [...stack] },
        visitOrder: [...visitOrder],
      } satisfies GraphStepData,
    });

    const neighbors = getNeighbors(current, edges).reverse(); // reverse for correct DFS order
    for (const neighbor of neighbors) {
      if (nodeStates[neighbor] !== "visited") {
        stack.push(neighbor);
        steps.push({
          id: stepId++,
          description: `Push unvisited neighbor ${neighbor} onto stack`,
          action: "push",
          highlights: [],
          data: {
            nodes,
            edges,
            nodeStates: { ...nodeStates },
            currentNode: current,
            dataStructure: { type: "stack", items: [...stack] },
            visitOrder: [...visitOrder],
          } satisfies GraphStepData,
        });
      }
    }
  }

  steps.push({
    id: stepId++,
    description: `DFS complete! Visit order: ${visitOrder.join(" → ")}`,
    action: "complete",
    highlights: [],
    data: {
      nodes,
      edges,
      nodeStates: { ...nodeStates },
      currentNode: null,
      dataStructure: { type: "stack", items: [] },
      visitOrder: [...visitOrder],
    } satisfies GraphStepData,
  });

  return steps;
}
