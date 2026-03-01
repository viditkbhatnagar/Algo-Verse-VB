import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const bellmanFord: AlgorithmMetadata = {
  id: "bellman-ford",
  name: "Bellman-Ford Algorithm",
  category: "graph",
  subcategory: "Shortest Path",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(E)",
    average: "O(V * E)",
    worst: "O(V * E)",
    note: "Best case occurs when no relaxation happens after the first pass. Worst case requires V-1 full passes over all E edges.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Stores distance and predecessor arrays for each vertex.",
  },
  description: `The Bellman-Ford algorithm computes the shortest paths from a single source vertex to all other \
vertices in a weighted directed graph. Unlike Dijkstra's algorithm, Bellman-Ford can handle graphs with \
negative-weight edges, making it more versatile at the cost of higher time complexity. The algorithm was \
independently developed by Alfonso Shimbel (1955), Richard Bellman (1958), and Lester Ford Jr. (1956).

The algorithm works by performing V-1 iterations over all edges in the graph, where V is the number of \
vertices. In each iteration, it attempts to "relax" every edge: for an edge (u, v) with weight w, if \
dist[u] + w < dist[v], then dist[v] is updated to dist[u] + w and the predecessor of v is set to u. \
After V-1 iterations, all shortest paths of at most V-1 edges have been found, which covers all possible \
shortest paths in a graph without negative cycles (since a shortest path visits each vertex at most once).

A key feature of Bellman-Ford is its ability to detect negative-weight cycles. After the V-1 relaxation \
passes, the algorithm performs one additional pass over all edges. If any edge can still be relaxed, it \
means a negative-weight cycle exists that is reachable from the source, and no finite shortest path exists \
for the affected vertices. This makes Bellman-Ford essential in financial arbitrage detection, where \
negative cycles in currency exchange graphs represent profitable trading loops.

While slower than Dijkstra's algorithm for graphs with non-negative weights, Bellman-Ford is simpler to \
implement and is the foundation for the SPFA (Shortest Path Faster Algorithm) optimization and the \
distance-vector routing protocol used in networks like RIP (Routing Information Protocol).`,
  shortDescription:
    "Finds shortest paths from a single source in a weighted directed graph, handling negative edge weights and detecting negative cycles through V-1 relaxation passes.",
  pseudocode: `function BellmanFord(Graph G, source s):
    // Initialize distances
    for each vertex v in G.vertices:
        dist[v] = INFINITY
        prev[v] = UNDEFINED
    dist[s] = 0

    // Relax all edges V-1 times
    for i = 1 to |G.vertices| - 1:
        for each edge (u, v, weight) in G.edges:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                prev[v] = u

    // Check for negative-weight cycles
    for each edge (u, v, weight) in G.edges:
        if dist[u] + weight < dist[v]:
            report "Negative cycle detected"

    return dist, prev`,
  implementations: {
    python: `from typing import Dict, List, Tuple, Optional


def bellman_ford(
    vertices: List[str],
    edges: List[Tuple[str, str, float]],
    source: str,
) -> Tuple[Dict[str, float], Dict[str, Optional[str]], bool]:
    """
    Bellman-Ford shortest path algorithm.

    Args:
        vertices: List of vertex labels
        edges: List of (source, target, weight) tuples
        source: Starting vertex

    Returns:
        dist: Shortest distances from source
        prev: Predecessor map for path reconstruction
        has_negative_cycle: True if a negative cycle is reachable from source
    """
    dist: Dict[str, float] = {v: float('inf') for v in vertices}
    prev: Dict[str, Optional[str]] = {v: None for v in vertices}
    dist[source] = 0.0

    # V-1 relaxation passes
    for i in range(len(vertices) - 1):
        updated = False
        for u, v, weight in edges:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                prev[v] = u
                updated = True
        if not updated:
            break  # Early termination — no relaxation occurred

    # Check for negative cycles
    for u, v, weight in edges:
        if dist[u] + weight < dist[v]:
            return dist, prev, True

    return dist, prev, False


# Example usage
if __name__ == "__main__":
    vertices = ["A", "B", "C", "D"]
    edges = [
        ("A", "B", 4),
        ("A", "C", 2),
        ("C", "B", -3),
        ("B", "D", 2),
        ("C", "D", 5),
    ]
    dist, prev, neg_cycle = bellman_ford(vertices, edges, "A")
    print("Distances:", dist)
    print("Negative cycle:", neg_cycle)`,
    javascript: `/**
 * Bellman-Ford shortest path algorithm.
 *
 * @param {string[]} vertices - List of vertex labels
 * @param {[string, string, number][]} edges - Array of [source, target, weight]
 * @param {string} source - Starting vertex
 * @returns {{ dist: Map, prev: Map, hasNegativeCycle: boolean }}
 */
function bellmanFord(vertices, edges, source) {
  const dist = new Map();
  const prev = new Map();

  for (const v of vertices) {
    dist.set(v, Infinity);
    prev.set(v, null);
  }
  dist.set(source, 0);

  // V-1 relaxation passes
  for (let i = 0; i < vertices.length - 1; i++) {
    let updated = false;
    for (const [u, v, weight] of edges) {
      if (dist.get(u) + weight < dist.get(v)) {
        dist.set(v, dist.get(u) + weight);
        prev.set(v, u);
        updated = true;
      }
    }
    if (!updated) break;
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  for (const [u, v, weight] of edges) {
    if (dist.get(u) + weight < dist.get(v)) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { dist, prev, hasNegativeCycle };
}

// Example usage
const vertices = ["A", "B", "C", "D"];
const edges = [
  ["A", "B", 4],
  ["A", "C", 2],
  ["C", "B", -3],
  ["B", "D", 2],
  ["C", "D", 5],
];
const result = bellmanFord(vertices, edges, "A");
console.log("Distances:", Object.fromEntries(result.dist));
console.log("Negative cycle:", result.hasNegativeCycle);`,
  },
  useCases: [
    "Detecting negative-weight cycles in financial arbitrage (currency exchange rate graphs)",
    "Distance-vector routing protocols such as RIP (Routing Information Protocol)",
    "Network flow algorithms that require handling negative edge weights",
    "Verifying shortest path solutions from other algorithms",
    "Computing shortest paths in graphs where edge weights may be negative",
  ],
  relatedAlgorithms: [
    "dijkstra",
    "floyd-warshall",
    "bfs",
    "a-star",
  ],
  glossaryTerms: [
    "shortest path",
    "edge relaxation",
    "negative cycle",
    "dynamic programming",
    "single-source shortest path",
    "directed graph",
  ],
  tags: [
    "graph",
    "shortest-path",
    "dynamic-programming",
    "negative-weights",
    "directed-graph",
    "weighted-graph",
    "classic",
  ],
};
