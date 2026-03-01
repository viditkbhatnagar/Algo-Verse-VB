import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const topologicalSort: AlgorithmMetadata = {
  id: "topological-sort",
  name: "Topological Sort",
  category: "graph",
  subcategory: "Graph Ordering",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    note: "Both Kahn's (BFS-based) and DFS-based approaches run in linear time. Each vertex and edge is processed exactly once.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Stores the in-degree array, the queue/stack, and the resulting sorted order.",
  },
  description: `Topological sort is a linear ordering of the vertices of a directed acyclic graph (DAG) such that \
for every directed edge (u, v), vertex u comes before vertex v in the ordering. This ordering is not \
necessarily unique: a DAG may have multiple valid topological orderings. Topological sorting is only \
possible for DAGs; if the graph contains a cycle, no valid topological ordering exists.

The most intuitive approach is Kahn's algorithm, a BFS-based method published by Arthur B. Kahn in 1962. \
It works by repeatedly finding vertices with no incoming edges (in-degree of zero), removing them from \
the graph, and adding them to the sorted output. When a vertex is removed, the in-degrees of all its \
neighbors are decremented, potentially creating new zero-in-degree vertices. The algorithm uses a queue \
to track vertices that are ready to be processed. If the resulting sorted order contains fewer vertices \
than the graph, a cycle exists.

An alternative approach uses depth-first search (DFS). Starting from each unvisited vertex, the DFS \
explores as deep as possible and adds each vertex to a stack upon completion (post-order). The topological \
order is the reverse of the DFS post-order. This approach is elegant but slightly less intuitive for \
understanding the dependency structure.

Topological sorting is fundamental in computer science and appears in numerous applications: build \
systems (Make, Gradle) use it to determine compilation order, operating systems use it for process \
scheduling, package managers use it to resolve dependency chains, and it is essential in course \
scheduling problems where prerequisites define a partial order. It is also a key step in algorithms \
for critical path analysis, shortest paths in DAGs, and data serialization.`,
  shortDescription:
    "Produces a linear ordering of vertices in a directed acyclic graph (DAG) such that every edge goes from an earlier vertex to a later one, using Kahn's BFS-based algorithm.",
  pseudocode: `function TopologicalSort(Graph G):
    // Kahn's Algorithm (BFS-based)
    // Compute in-degree for each vertex
    inDegree = array of size |V|, initialized to 0
    for each edge (u, v) in G.edges:
        inDegree[v] += 1

    // Enqueue all vertices with in-degree 0
    queue = empty queue
    for each vertex v in G.vertices:
        if inDegree[v] == 0:
            queue.enqueue(v)

    order = []

    while queue is not empty:
        u = queue.dequeue()
        order.append(u)

        for each neighbor v of u:
            inDegree[v] -= 1
            if inDegree[v] == 0:
                queue.enqueue(v)

    if |order| != |V|:
        report "Graph has a cycle — no topological ordering exists"

    return order`,
  implementations: {
    python: `from collections import deque, defaultdict
from typing import List, Tuple, Optional


def topological_sort(
    vertices: List[str],
    edges: List[Tuple[str, str]],
) -> Optional[List[str]]:
    """
    Kahn's algorithm for topological sorting.

    Args:
        vertices: List of vertex labels
        edges: List of (source, target) directed edges

    Returns:
        Topological ordering, or None if a cycle exists
    """
    # Build adjacency list and compute in-degrees
    adj = defaultdict(list)
    in_degree = {v: 0 for v in vertices}

    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1

    # Start with all zero-in-degree vertices
    queue = deque(v for v in vertices if in_degree[v] == 0)
    order: List[str] = []

    while queue:
        u = queue.popleft()
        order.append(u)

        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    if len(order) != len(vertices):
        return None  # Cycle detected

    return order


# Example usage
if __name__ == "__main__":
    vertices = ["A", "B", "C", "D", "E", "F"]
    edges = [
        ("A", "B"), ("A", "C"),
        ("B", "D"), ("B", "E"),
        ("C", "E"),
        ("D", "F"), ("E", "F"),
    ]
    result = topological_sort(vertices, edges)
    print("Topological order:", result)
    # e.g., ['A', 'B', 'C', 'D', 'E', 'F']`,
    javascript: `/**
 * Kahn's algorithm for topological sorting.
 *
 * @param {string[]} vertices - List of vertex labels
 * @param {[string, string][]} edges - Array of [source, target] directed edges
 * @returns {string[] | null} Topological ordering, or null if a cycle exists
 */
function topologicalSort(vertices, edges) {
  const adj = new Map();
  const inDegree = new Map();

  for (const v of vertices) {
    adj.set(v, []);
    inDegree.set(v, 0);
  }

  for (const [u, v] of edges) {
    adj.get(u).push(v);
    inDegree.set(v, inDegree.get(v) + 1);
  }

  // Start with all zero-in-degree vertices
  const queue = vertices.filter((v) => inDegree.get(v) === 0);
  const order = [];

  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);

    for (const v of adj.get(u)) {
      inDegree.set(v, inDegree.get(v) - 1);
      if (inDegree.get(v) === 0) {
        queue.push(v);
      }
    }
  }

  if (order.length !== vertices.length) {
    return null; // Cycle detected
  }

  return order;
}

// Example usage
const vertices = ["A", "B", "C", "D", "E", "F"];
const edges = [
  ["A", "B"], ["A", "C"],
  ["B", "D"], ["B", "E"],
  ["C", "E"],
  ["D", "F"], ["E", "F"],
];
const result = topologicalSort(vertices, edges);
console.log("Topological order:", result);
// e.g., ['A', 'B', 'C', 'D', 'E', 'F']`,
  },
  useCases: [
    "Build systems (Make, Gradle, Bazel) to determine correct compilation order of modules",
    "Package managers (npm, apt, pip) to resolve dependency installation order",
    "Course scheduling where prerequisites define a dependency ordering",
    "Task scheduling in project management (critical path analysis)",
    "Data serialization and deserialization where object dependencies must be resolved",
  ],
  relatedAlgorithms: [
    "dfs",
    "bfs",
    "kruskal",
    "dijkstra",
  ],
  glossaryTerms: [
    "directed acyclic graph",
    "in-degree",
    "topological ordering",
    "partial order",
    "cycle detection",
    "BFS",
    "dependency resolution",
  ],
  tags: [
    "graph",
    "ordering",
    "dag",
    "bfs",
    "directed-graph",
    "dependency",
    "classic",
  ],
};
