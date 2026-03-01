import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const dijkstra: AlgorithmMetadata = {
  id: "dijkstra",
  name: "Dijkstra's Algorithm",
  category: "graph",
  subcategory: "Shortest Path",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O((V + E) log V)",
    average: "O((V + E) log V)",
    worst: "O((V + E) log V)",
    note: "Using a binary heap (min-priority queue). With a Fibonacci heap, amortized time is O(V log V + E).",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Stores distance array, predecessor array, and priority queue entries for each vertex.",
  },
  description: `Dijkstra's algorithm is one of the most fundamental graph algorithms in computer science, \
designed to find the shortest path from a single source vertex to all other vertices in a weighted graph \
with non-negative edge weights. Invented by Dutch computer scientist Edsger W. Dijkstra in 1956 and \
published in 1959, it remains the go-to algorithm for shortest-path problems in networks ranging from \
road maps to internet routing protocols.

The algorithm works by maintaining a set of vertices whose shortest distance from the source is already \
known, and repeatedly selecting the unvisited vertex with the smallest tentative distance. For this \
selected vertex, it examines all of its neighbors and updates their tentative distances if a shorter \
path is found through the current vertex. This process is known as "edge relaxation." The algorithm \
terminates when all reachable vertices have been visited or when the priority queue is empty.

The efficiency of Dijkstra's algorithm depends heavily on the priority queue implementation. A naive \
array-based approach yields O(V^2) time, while a binary heap reduces this to O((V + E) log V). For \
very dense graphs, a Fibonacci heap can further improve the amortized complexity to O(V log V + E). \
In practice, binary heaps strike the best balance between implementation simplicity and performance \
for most real-world graphs.

A critical limitation of Dijkstra's algorithm is that it does not work correctly with negative edge \
weights. If a graph contains negative-weight edges, the Bellman-Ford algorithm should be used instead. \
Despite this constraint, Dijkstra's algorithm is widely used in GPS navigation, network routing \
(OSPF protocol), social network analysis, and game AI pathfinding, often in combination with \
heuristics like A* search for improved performance.`,
  shortDescription:
    "Finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights using a greedy approach with a priority queue.",
  pseudocode: `function Dijkstra(Graph G, source s):
    // Initialize distances and predecessor map
    for each vertex v in G.vertices:
        dist[v] = INFINITY
        prev[v] = UNDEFINED
        visited[v] = false
    dist[s] = 0

    // Min-priority queue keyed by distance
    PQ = MinPriorityQueue()
    PQ.insert(s, 0)

    while PQ is not empty:
        u = PQ.extractMin()

        if visited[u]:
            continue
        visited[u] = true

        for each neighbor v of u:
            weight = G.weight(u, v)
            newDist = dist[u] + weight

            if newDist < dist[v]:
                dist[v] = newDist
                prev[v] = u
                PQ.insert(v, newDist)

    return dist, prev`,
  implementations: {
    python: `import heapq
from collections import defaultdict
from typing import Dict, List, Tuple, Optional


def dijkstra(
    graph: Dict[str, List[Tuple[str, float]]],
    source: str
) -> Tuple[Dict[str, float], Dict[str, Optional[str]]]:
    """
    Find shortest paths from source to all reachable vertices.

    Args:
        graph: Adjacency list where graph[u] = [(v, weight), ...]
        source: Starting vertex

    Returns:
        dist: Dictionary mapping each vertex to its shortest distance from source
        prev: Dictionary mapping each vertex to its predecessor on the shortest path
    """
    dist: Dict[str, float] = {v: float('inf') for v in graph}
    prev: Dict[str, Optional[str]] = {v: None for v in graph}
    dist[source] = 0.0

    # Min-heap: (distance, vertex)
    heap: List[Tuple[float, str]] = [(0.0, source)]
    visited: set = set()

    while heap:
        current_dist, u = heapq.heappop(heap)

        if u in visited:
            continue
        visited.add(u)

        for v, weight in graph[u]:
            if v in visited:
                continue
            new_dist = current_dist + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                prev[v] = u
                heapq.heappush(heap, (new_dist, v))

    return dist, prev


def reconstruct_path(
    prev: Dict[str, Optional[str]], target: str
) -> List[str]:
    """Reconstruct shortest path from source to target."""
    path = []
    current: Optional[str] = target
    while current is not None:
        path.append(current)
        current = prev[current]
    path.reverse()
    return path


# Example usage
if __name__ == "__main__":
    graph = {
        "A": [("B", 4), ("C", 1)],
        "B": [("D", 1)],
        "C": [("B", 2), ("D", 5)],
        "D": [],
    }
    distances, predecessors = dijkstra(graph, "A")
    print("Distances:", distances)       # {'A': 0, 'B': 3, 'C': 1, 'D': 4}
    print("Path A->D:", reconstruct_path(predecessors, "D"))  # ['A', 'C', 'B', 'D']`,
    javascript: `/**
 * Dijkstra's Algorithm — finds shortest paths from a source vertex.
 *
 * @param {Map<string, [string, number][]>} graph - Adjacency list
 * @param {string} source - Starting vertex
 * @returns {{ dist: Map<string, number>, prev: Map<string, string|null> }}
 */
function dijkstra(graph, source) {
  const dist = new Map();
  const prev = new Map();
  const visited = new Set();

  for (const vertex of graph.keys()) {
    dist.set(vertex, Infinity);
    prev.set(vertex, null);
  }
  dist.set(source, 0);

  // Simple priority queue using a sorted array (for clarity)
  // Production code should use a binary heap
  const pq = [[0, source]];

  while (pq.length > 0) {
    // Extract minimum distance vertex
    pq.sort((a, b) => a[0] - b[0]);
    const [currentDist, u] = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);

    for (const [v, weight] of graph.get(u) || []) {
      if (visited.has(v)) continue;
      const newDist = currentDist + weight;
      if (newDist < dist.get(v)) {
        dist.set(v, newDist);
        prev.set(v, u);
        pq.push([newDist, v]);
      }
    }
  }

  return { dist, prev };
}

/**
 * Reconstruct the shortest path from source to target.
 */
function reconstructPath(prev, target) {
  const path = [];
  let current = target;
  while (current !== null) {
    path.push(current);
    current = prev.get(current);
  }
  return path.reverse();
}

// Example usage
const graph = new Map([
  ["A", [["B", 4], ["C", 1]]],
  ["B", [["D", 1]]],
  ["C", [["B", 2], ["D", 5]]],
  ["D", []],
]);

const { dist, prev } = dijkstra(graph, "A");
console.log("Distances:", Object.fromEntries(dist));
// { A: 0, B: 3, C: 1, D: 4 }
console.log("Path A->D:", reconstructPath(prev, "D"));
// ['A', 'C', 'B', 'D']`,
  },
  useCases: [
    "GPS navigation systems for computing the fastest route between two locations",
    "Network routing protocols (e.g., OSPF) to determine optimal packet forwarding paths",
    "Social network analysis to find degrees of separation between users",
    "Game AI pathfinding on weighted terrain maps",
    "Airline flight scheduling to find the cheapest or shortest connections",
  ],
  relatedAlgorithms: [
    "bellman-ford",
    "a-star",
    "floyd-warshall",
    "prim",
    "bfs",
  ],
  glossaryTerms: [
    "shortest path",
    "greedy algorithm",
    "priority queue",
    "edge relaxation",
    "adjacency list",
    "non-negative weights",
    "single-source shortest path",
  ],
  tags: [
    "graph",
    "shortest-path",
    "greedy",
    "priority-queue",
    "weighted-graph",
    "single-source",
    "classic",
  ],
};
