import type { VisualizationStep, HighlightColor, GraphNode, GraphEdge } from "@/lib/visualization/types";

/**
 * Step data for Adjacency Matrix / List visualization.
 */
export interface AdjacencyMatrixStepData {
  matrix: (0 | 1)[][];
  cellHighlights: Record<string, HighlightColor>;
  rowHeaders: string[];
  colHeaders: string[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  adjacencyList: Record<string, string[]>;
  currentEdge?: { source: string; target: string };
}

/**
 * Generate visualization steps for building an adjacency matrix + adjacency list.
 * Graph: 5 nodes (A-E), 6 undirected edges, added one by one.
 */
export function generateAdjacencyMatrixSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const nodeLabels = ["A", "B", "C", "D", "E"];
  const n = nodeLabels.length;

  // Node positions for the graph visualization (pentagon layout)
  const cx = 150, cy = 130, r = 90;
  const graphNodes: GraphNode[] = nodeLabels.map((label, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return {
      id: label,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      label,
    };
  });

  const edges: [string, string][] = [
    ["A", "B"],
    ["A", "C"],
    ["B", "C"],
    ["B", "D"],
    ["C", "E"],
    ["D", "E"],
  ];

  // Adjacency matrix (start all zeros)
  const matrix: (0 | 1)[][] = Array.from({ length: n }, () => new Array(n).fill(0) as (0 | 1)[]);
  const addedEdges: GraphEdge[] = [];
  const adjList: Record<string, string[]> = {};
  for (const label of nodeLabels) adjList[label] = [];

  function cloneMatrix(): (0 | 1)[][] {
    return matrix.map((row) => [...row]);
  }

  function cloneAdjList(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(adjList)) result[k] = [...v];
    return result;
  }

  function idx(label: string): number {
    return nodeLabels.indexOf(label);
  }

  function cellKey(row: number, col: number): string {
    return `${row}-${col}`;
  }

  // Step 0: Empty graph and matrix
  steps.push({
    id: stepId++,
    description: `Initialize a graph with ${n} vertices (${nodeLabels.join(", ")}) and no edges. The adjacency matrix is a ${n}x${n} grid of zeros. The adjacency list has an empty list for each vertex. We will add ${edges.length} undirected edges one by one.`,
    action: "highlight",
    highlights: [],
    data: {
      matrix: cloneMatrix(),
      cellHighlights: {},
      rowHeaders: [...nodeLabels],
      colHeaders: [...nodeLabels],
      graph: { nodes: graphNodes, edges: [] },
      adjacencyList: cloneAdjList(),
    } satisfies AdjacencyMatrixStepData,
    variables: { vertices: n, edgeCount: 0 },
  });

  // Add each edge
  for (let e = 0; e < edges.length; e++) {
    const [u, v] = edges[e];
    const ui = idx(u);
    const vi = idx(v);

    // Step: Highlight the edge we're about to add
    steps.push({
      id: stepId++,
      description: `Add edge (${u}, ${v}): This is an undirected edge, so we update two cells in the matrix — matrix[${u}][${v}] and matrix[${v}][${u}] — and add each vertex to the other's adjacency list.`,
      action: "visit",
      highlights: [{ indices: [ui, vi], color: "comparing" }],
      data: {
        matrix: cloneMatrix(),
        cellHighlights: {
          [cellKey(ui, vi)]: "comparing",
          [cellKey(vi, ui)]: "comparing",
        },
        rowHeaders: [...nodeLabels],
        colHeaders: [...nodeLabels],
        graph: { nodes: graphNodes, edges: [...addedEdges] },
        adjacencyList: cloneAdjList(),
        currentEdge: { source: u, target: v },
      } satisfies AdjacencyMatrixStepData,
      variables: { edge: `${u}-${v}`, edgeNum: e + 1 },
    });

    // Update matrix
    matrix[ui][vi] = 1;
    matrix[vi][ui] = 1;

    // Update adjacency list
    adjList[u].push(v);
    adjList[v].push(u);

    // Update edge list for graph
    addedEdges.push({ source: u, target: v });

    // Step: Show the updated state
    steps.push({
      id: stepId++,
      description: `Edge (${u}, ${v}) added. Matrix updated: matrix[${u}][${v}] = 1, matrix[${v}][${u}] = 1. Adjacency list: ${u} -> [${adjList[u].join(", ")}], ${v} -> [${adjList[v].join(", ")}]. Total edges: ${addedEdges.length}/${edges.length}.`,
      action: "insert",
      highlights: [{ indices: [ui, vi], color: "active" }],
      data: {
        matrix: cloneMatrix(),
        cellHighlights: {
          [cellKey(ui, vi)]: "active",
          [cellKey(vi, ui)]: "active",
        },
        rowHeaders: [...nodeLabels],
        colHeaders: [...nodeLabels],
        graph: { nodes: graphNodes, edges: [...addedEdges] },
        adjacencyList: cloneAdjList(),
        currentEdge: { source: u, target: v },
      } satisfies AdjacencyMatrixStepData,
      variables: { edge: `${u}-${v}`, totalEdges: addedEdges.length },
    });
  }

  // Final state: all cells with value 1 highlighted as completed
  const finalHighlights: Record<string, HighlightColor> = {};
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 1) {
        finalHighlights[cellKey(i, j)] = "completed";
      }
    }
  }

  steps.push({
    id: stepId++,
    description: `Graph construction complete! ${n} vertices and ${edges.length} undirected edges. The adjacency matrix is symmetric (matrix[i][j] = matrix[j][i]) with 12 non-zero entries (each undirected edge appears twice). The adjacency list stores each neighbor once per direction. Matrix uses O(V^2) = O(25) space; list uses O(V + 2E) = O(${n + 2 * edges.length}) space.`,
    action: "complete",
    highlights: [],
    data: {
      matrix: cloneMatrix(),
      cellHighlights: finalHighlights,
      rowHeaders: [...nodeLabels],
      colHeaders: [...nodeLabels],
      graph: { nodes: graphNodes, edges: [...addedEdges] },
      adjacencyList: cloneAdjList(),
    } satisfies AdjacencyMatrixStepData,
    variables: { vertices: n, edges: edges.length, matrixSpace: n * n, listSpace: n + 2 * edges.length },
  });

  return steps;
}
