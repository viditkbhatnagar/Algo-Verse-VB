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

export function generateBFSSteps(
  nodes: GraphNode[] = DEFAULT_GRAPH_NODES,
  edges: GraphEdge[] = DEFAULT_GRAPH_EDGES,
  startNode: string = "A"
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const nodeStates: Record<string, "unvisited" | "visiting" | "visited"> = {};
  nodes.forEach((n) => (nodeStates[n.id] = "unvisited"));

  const queue: string[] = [];
  const visitOrder: string[] = [];

  steps.push({
    id: stepId++,
    description: `Starting BFS from node ${startNode}`,
    action: "highlight",
    highlights: [],
    data: {
      nodes,
      edges,
      nodeStates: { ...nodeStates },
      currentNode: null,
      dataStructure: { type: "queue", items: [] },
      visitOrder: [],
    } satisfies GraphStepData,
  });

  queue.push(startNode);
  nodeStates[startNode] = "visiting";

  steps.push({
    id: stepId++,
    description: `Enqueue ${startNode}`,
    action: "enqueue",
    highlights: [],
    data: {
      nodes,
      edges,
      nodeStates: { ...nodeStates },
      currentNode: null,
      dataStructure: { type: "queue", items: [...queue] },
      visitOrder: [...visitOrder],
    } satisfies GraphStepData,
  });

  while (queue.length > 0) {
    const current = queue.shift()!;

    steps.push({
      id: stepId++,
      description: `Dequeue ${current} — visiting`,
      action: "dequeue",
      highlights: [],
      data: {
        nodes,
        edges,
        nodeStates: { ...nodeStates },
        currentNode: current,
        dataStructure: { type: "queue", items: [...queue] },
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
        dataStructure: { type: "queue", items: [...queue] },
        visitOrder: [...visitOrder],
      } satisfies GraphStepData,
    });

    const neighbors = getNeighbors(current, edges);
    for (const neighbor of neighbors) {
      if (nodeStates[neighbor] === "unvisited") {
        nodeStates[neighbor] = "visiting";
        queue.push(neighbor);

        steps.push({
          id: stepId++,
          description: `Enqueue unvisited neighbor ${neighbor}`,
          action: "enqueue",
          highlights: [],
          data: {
            nodes,
            edges,
            nodeStates: { ...nodeStates },
            currentNode: current,
            dataStructure: { type: "queue", items: [...queue] },
            visitOrder: [...visitOrder],
          } satisfies GraphStepData,
        });
      }
    }
  }

  steps.push({
    id: stepId++,
    description: `BFS complete! Visit order: ${visitOrder.join(" → ")}`,
    action: "complete",
    highlights: [],
    data: {
      nodes,
      edges,
      nodeStates: { ...nodeStates },
      currentNode: null,
      dataStructure: { type: "queue", items: [] },
      visitOrder: [...visitOrder],
    } satisfies GraphStepData,
  });

  return steps;
}
