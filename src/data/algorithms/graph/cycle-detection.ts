import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const cycleDetection: AlgorithmMetadata = {
  id: "cycle-detection",
  name: "Cycle Detection (DFS Coloring)",
  category: "graph",
  subcategory: "Graph Traversal",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    note: "Each vertex and edge is visited exactly once during the DFS traversal. The coloring approach processes each node once.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Stores the color (state) array for all vertices and the DFS recursion stack, which can be at most V deep.",
  },
  description: `Cycle detection in directed graphs is a fundamental problem in computer science with applications ranging from deadlock detection in operating systems to dependency resolution in build tools. The DFS coloring method is the most elegant and widely-used approach for detecting cycles in directed graphs.

The algorithm assigns one of three colors (or states) to each vertex during DFS traversal: White (unvisited), Gray (currently being explored — on the recursion stack), and Black (fully processed — all descendants explored). A cycle exists if and only if during the DFS, we encounter a neighbor that is currently Gray, meaning we've found a "back edge" that points to an ancestor in the current DFS path.

The intuition is straightforward: if we're exploring a node and we find an edge leading to a Gray node, that Gray node is an ancestor in the current exploration path. This creates a cycle because we can go from the ancestor to the current node (via the DFS path) and back to the ancestor (via the back edge). Black nodes, on the other hand, are safe because they and all their descendants have already been fully explored without creating a cycle through the current path.

This approach works only for directed graphs. For undirected graphs, a simpler approach using parent tracking during DFS is sufficient. The DFS coloring method handles directed graphs correctly because it distinguishes between back edges (to Gray ancestors, indicating cycles) and cross edges (to Black nodes in other branches, which are harmless).

Applications include: detecting circular dependencies in package managers (npm, pip), deadlock detection in databases and operating systems, validating DAGs (directed acyclic graphs) for topological sorting, and cycle detection in state machines and finite automata.`,
  shortDescription:
    "Detects cycles in a directed graph using DFS with three-color marking: White (unvisited), Gray (in progress), and Black (completed). A back edge to a Gray node indicates a cycle.",
  pseudocode: `function hasCycle(Graph G):
    color = { v: WHITE for each v in G.vertices }

    for each vertex v in G.vertices:
        if color[v] == WHITE:
            if dfs(v, G, color):
                return true
    return false

function dfs(u, G, color):
    color[u] = GRAY   // Start exploring u

    for each neighbor v of u:
        if color[v] == GRAY:
            // Back edge found — cycle detected!
            return true
        if color[v] == WHITE:
            if dfs(v, G, color):
                return true

    color[u] = BLACK   // Fully explored u
    return false`,
  implementations: {
    python: `from typing import Dict, List, Optional, Set, Tuple


def detect_cycle(graph: Dict[str, List[str]]) -> Optional[List[str]]:
    """
    Detect a cycle in a directed graph using DFS coloring.

    Args:
        graph: Adjacency list { node: [neighbors] }

    Returns:
        List of nodes forming the cycle, or None if no cycle exists
    """
    WHITE, GRAY, BLACK = 0, 1, 2
    color: Dict[str, int] = {v: WHITE for v in graph}
    parent: Dict[str, Optional[str]] = {v: None for v in graph}

    def dfs(u: str) -> Optional[List[str]]:
        color[u] = GRAY

        for v in graph.get(u, []):
            if color[v] == GRAY:
                # Back edge found — reconstruct cycle
                cycle = [v, u]
                node = u
                while node != v:
                    node = parent[node]
                    if node is None:
                        break
                    cycle.append(node)
                cycle.reverse()
                return cycle

            if color[v] == WHITE:
                parent[v] = u
                result = dfs(v)
                if result is not None:
                    return result

        color[u] = BLACK
        return None

    for vertex in graph:
        if color[vertex] == WHITE:
            result = dfs(vertex)
            if result is not None:
                return result

    return None


# Example usage
if __name__ == "__main__":
    graph = {
        "A": ["B", "D"],
        "B": ["C"],
        "C": ["E"],
        "D": [],
        "E": ["D", "A"],  # E -> A creates a cycle
    }
    cycle = detect_cycle(graph)
    print("Cycle:", cycle)  # ['A', 'B', 'C', 'E', 'A']`,
    javascript: `/**
 * Detect a cycle in a directed graph using DFS coloring.
 *
 * @param {Map<string, string[]>} graph - Adjacency list
 * @returns {string[] | null} Nodes forming the cycle, or null
 */
function detectCycle(graph) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  const parent = new Map();

  for (const v of graph.keys()) {
    color.set(v, WHITE);
    parent.set(v, null);
  }

  function dfs(u) {
    color.set(u, GRAY);

    for (const v of graph.get(u) || []) {
      if (color.get(v) === GRAY) {
        // Back edge — reconstruct cycle
        const cycle = [v, u];
        let node = u;
        while (node !== v) {
          node = parent.get(node);
          if (node === null) break;
          cycle.push(node);
        }
        cycle.reverse();
        return cycle;
      }

      if (color.get(v) === WHITE) {
        parent.set(v, u);
        const result = dfs(v);
        if (result !== null) return result;
      }
    }

    color.set(u, BLACK);
    return null;
  }

  for (const vertex of graph.keys()) {
    if (color.get(vertex) === WHITE) {
      const result = dfs(vertex);
      if (result !== null) return result;
    }
  }

  return null;
}

// Example usage
const graph = new Map([
  ["A", ["B", "D"]],
  ["B", ["C"]],
  ["C", ["E"]],
  ["D", []],
  ["E", ["D", "A"]],  // E -> A creates a cycle
]);
console.log("Cycle:", detectCycle(graph)); // ['A', 'B', 'C', 'E', 'A']`,
  },
  useCases: [
    "Deadlock detection in operating systems — cycles in resource-allocation graphs indicate deadlocks",
    "Dependency resolution — detecting circular dependencies in package managers and build systems",
    "Compiler analysis — detecting infinite loops or circular type definitions",
    "Database transactions — cycle detection in wait-for graphs to resolve deadlocks",
    "Topological sorting validation — ensuring a DAG has no cycles before performing topological sort",
  ],
  relatedAlgorithms: [
    "dfs",
    "topological-sort",
    "strongly-connected-components",
    "bfs",
  ],
  glossaryTerms: [
    "back edge",
    "DFS tree",
    "directed acyclic graph (DAG)",
    "topological sort",
    "strongly connected component",
    "recursion stack",
  ],
  tags: [
    "graph",
    "dfs",
    "cycle-detection",
    "directed-graph",
    "back-edge",
    "coloring",
    "intermediate",
  ],
};
