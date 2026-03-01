import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const dfs: AlgorithmMetadata = {
  id: "dfs",
  name: "Depth-First Search",
  category: "searching",
  subcategory: "Graph Traversals",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    note: "Every vertex and every edge is visited exactly once in the worst case, where V is the number of vertices and E is the number of edges.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Space is dominated by the recursion stack (or explicit stack) and the visited set, both proportional to the number of vertices.",
  },
  description: `Depth-First Search (DFS) is a fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking. Starting from a given source vertex, DFS dives deep into the graph by following edges to unvisited neighbors, going further and further away from the source until it reaches a vertex with no unvisited neighbors. At that point it backtracks to the most recent vertex that still has unexplored edges and continues the process. This explore-then-backtrack behavior gives DFS its characteristic depth-first nature.

DFS can be implemented either recursively or iteratively using an explicit stack. The recursive version is more concise and mirrors the algorithm's natural structure: for each unvisited neighbor, the function calls itself. The iterative version replaces the call stack with a data structure stack, pushing neighbors onto the stack and popping them to process. Both approaches produce the same traversal order (assuming neighbors are processed in the same sequence) and have identical time and space complexities. The iterative version is preferred when the graph is very deep and recursion depth limits might be exceeded.

The algorithm has numerous applications across computer science. DFS is the backbone of topological sorting, which is essential for scheduling tasks with dependencies (e.g., build systems, course prerequisites). It is used to detect cycles in directed and undirected graphs, to find strongly connected components via Tarjan's or Kosaraju's algorithm, and to solve maze and puzzle problems by exhaustively exploring all possible paths. DFS also powers algorithms for finding articulation points and bridges in graphs, which are critical for network reliability analysis.

Understanding DFS is a prerequisite for many advanced graph algorithms. Its traversal produces a DFS tree (or forest) that classifies edges into tree edges, back edges, forward edges, and cross edges — a classification that enables cycle detection and topological sorting. The concepts of discovery time and finish time, assigned during DFS, are central to algorithms for strongly connected components. Mastering DFS, alongside its companion Breadth-First Search, provides the foundational toolkit for virtually all graph-based problem solving.`,
  shortDescription:
    "Traverses a graph by exploring as far as possible along each branch before backtracking.",
  pseudocode: `DFS(graph, start)
  create a set visited
  create a stack S
  push start onto S
  while S is not empty
    vertex = pop from S
    if vertex is not in visited
      add vertex to visited
      process(vertex)
      for each neighbor of vertex in graph
        if neighbor is not in visited
          push neighbor onto S

DFS-RECURSIVE(graph, vertex, visited)
  add vertex to visited
  process(vertex)
  for each neighbor of vertex in graph
    if neighbor is not in visited
      DFS-RECURSIVE(graph, neighbor, visited)`,
  implementations: {
    python: `from collections import defaultdict


def dfs_iterative(graph: dict[str, list[str]], start: str) -> list[str]:
    """
    Perform iterative depth-first search on a graph.

    Args:
        graph: Adjacency list representation of the graph.
        start: The starting vertex.

    Returns:
        A list of vertices in the order they were visited.
    """
    visited = set()
    stack = [start]
    order = []

    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            order.append(vertex)
            # Push neighbors in reverse order so that the first neighbor
            # in the adjacency list is processed first (LIFO behavior).
            for neighbor in reversed(graph.get(vertex, [])):
                if neighbor not in visited:
                    stack.append(neighbor)

    return order


def dfs_recursive(graph: dict[str, list[str]], start: str) -> list[str]:
    """
    Perform recursive depth-first search on a graph.

    Args:
        graph: Adjacency list representation of the graph.
        start: The starting vertex.

    Returns:
        A list of vertices in the order they were visited.
    """
    visited = set()
    order = []

    def _dfs(vertex: str) -> None:
        visited.add(vertex)
        order.append(vertex)
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                _dfs(neighbor)

    _dfs(start)
    return order


# --- Example usage ---
if __name__ == "__main__":
    graph = {
        "A": ["B", "C"],
        "B": ["A", "D", "E"],
        "C": ["A", "F"],
        "D": ["B"],
        "E": ["B", "F"],
        "F": ["C", "E"],
    }
    print("Iterative DFS:", dfs_iterative(graph, "A"))
    print("Recursive DFS:", dfs_recursive(graph, "A"))`,
    javascript: `/**
 * Perform iterative depth-first search on a graph.
 *
 * @param {Object} graph - Adjacency list representation (e.g., { A: ['B','C'], ... }).
 * @param {string} start - The starting vertex.
 * @returns {string[]} Vertices in the order they were visited.
 */
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const order = [];

  while (stack.length > 0) {
    const vertex = stack.pop();
    if (!visited.has(vertex)) {
      visited.add(vertex);
      order.push(vertex);
      // Push neighbors in reverse so the first neighbor is processed first.
      const neighbors = graph[vertex] || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i])) {
          stack.push(neighbors[i]);
        }
      }
    }
  }

  return order;
}

/**
 * Perform recursive depth-first search on a graph.
 *
 * @param {Object} graph - Adjacency list representation.
 * @param {string} start - The starting vertex.
 * @returns {string[]} Vertices in the order they were visited.
 */
function dfsRecursive(graph, start) {
  const visited = new Set();
  const order = [];

  function _dfs(vertex) {
    visited.add(vertex);
    order.push(vertex);
    for (const neighbor of graph[vertex] || []) {
      if (!visited.has(neighbor)) {
        _dfs(neighbor);
      }
    }
  }

  _dfs(start);
  return order;
}

// --- Example usage ---
const graph = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"],
};
console.log("Iterative DFS:", dfsIterative(graph, "A"));
console.log("Recursive DFS:", dfsRecursive(graph, "A"));`,
  },
  useCases: [
    "Topological sorting of directed acyclic graphs for task scheduling and dependency resolution",
    "Detecting cycles in directed and undirected graphs",
    "Finding connected components or strongly connected components in a graph",
    "Solving maze and puzzle problems by exhaustively exploring all paths",
    "Finding articulation points and bridges for network reliability analysis",
  ],
  relatedAlgorithms: [
    "bfs",
    "topological-sort",
    "tarjans-algorithm",
    "kosarajus-algorithm",
    "iterative-deepening-dfs",
  ],
  glossaryTerms: [
    "graph traversal",
    "adjacency list",
    "backtracking",
    "recursion",
    "stack",
    "visited set",
    "DFS tree",
    "back edge",
  ],
  tags: [
    "searching",
    "graph",
    "traversal",
    "depth-first",
    "stack",
    "recursive",
    "intermediate",
    "backtracking",
  ],
};
