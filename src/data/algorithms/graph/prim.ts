import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const prim: AlgorithmMetadata = {
  id: "prim",
  name: "Prim's Algorithm",
  category: "graph",
  subcategory: "Minimum Spanning Tree",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O((V + E) log V)",
    average: "O((V + E) log V)",
    worst: "O((V + E) log V)",
    note: "Using a binary heap. With a Fibonacci heap the complexity improves to O(E + V log V). An adjacency matrix approach runs in O(V^2).",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Stores the key (minimum weight) array, parent array, and priority queue entries for each vertex.",
  },
  description: `Prim's algorithm is a greedy algorithm that finds the Minimum Spanning Tree (MST) of a \
connected, undirected, weighted graph. Originally discovered by Czech mathematician Vojtech Jarnik in \
1930 and independently rediscovered by Robert C. Prim in 1957 and Edsger Dijkstra in 1959, it is \
sometimes referred to as the Jarnik-Prim algorithm. Like Kruskal's algorithm, it produces an MST \
that connects all vertices with the minimum total edge weight without cycles.

Unlike Kruskal's algorithm, which processes edges globally in sorted order, Prim's algorithm grows \
the MST from a single starting vertex by repeatedly adding the cheapest edge that connects a vertex \
already in the tree to a vertex not yet in the tree. This vertex-centric approach makes it \
structurally similar to Dijkstra's shortest-path algorithm, and both can be implemented with nearly \
identical code using a min-priority queue. The key difference is that Dijkstra tracks cumulative \
path distances, while Prim tracks individual edge weights.

The choice of data structure for the priority queue significantly impacts performance. A simple \
array-based scan yields O(V^2) time, which is actually optimal for dense graphs where E is close \
to V^2. A binary heap reduces the time to O((V + E) log V), ideal for sparse graphs. A Fibonacci \
heap achieves the theoretically best O(E + V log V) but is rarely used in practice due to high \
constant factors and implementation complexity.

Prim's algorithm is generally preferred over Kruskal's when the graph is dense (many edges relative \
to vertices) or when the graph is represented as an adjacency matrix. It is used in network design \
for laying cables, roads, or pipelines at minimum cost, in VLSI circuit design for minimizing wire \
length, and as a subroutine in algorithms for computing bottleneck spanning trees and minimum-weight \
perfect matchings.`,
  shortDescription:
    "Builds a minimum spanning tree by starting from an arbitrary vertex and greedily adding the cheapest edge connecting the tree to an unvisited vertex.",
  pseudocode: `function Prim(Graph G, start s):
    // Initialize key values and MST tracking
    for each vertex v in G.vertices:
        key[v] = INFINITY       // minimum weight edge to connect v to MST
        parent[v] = UNDEFINED
        inMST[v] = false
    key[s] = 0

    PQ = MinPriorityQueue()
    PQ.insert(s, 0)

    while PQ is not empty:
        u = PQ.extractMin()

        if inMST[u]:
            continue
        inMST[u] = true

        for each neighbor v of u with weight w:
            if not inMST[v] and w < key[v]:
                key[v] = w
                parent[v] = u
                PQ.insert(v, w)

    // Build MST edge list from parent array
    MST = []
    for each vertex v in G.vertices (v != s):
        if parent[v] is defined:
            MST.add((parent[v], v, key[v]))

    return MST`,
  implementations: {
    python: `import heapq
from typing import Dict, List, Tuple, Optional


def prim(
    graph: Dict[int, List[Tuple[int, float]]],
    start: int = 0,
) -> Tuple[List[Tuple[int, int, float]], float]:
    """
    Find the Minimum Spanning Tree using Prim's algorithm.

    Args:
        graph: Adjacency list where graph[u] = [(v, weight), ...]
        start: Starting vertex (default 0)

    Returns:
        mst_edges: List of (u, v, weight) edges in the MST
        total_weight: Sum of all MST edge weights
    """
    num_vertices = len(graph)
    in_mst = [False] * num_vertices
    key = [float('inf')] * num_vertices
    parent: List[Optional[int]] = [None] * num_vertices

    key[start] = 0.0
    # Min-heap: (weight, vertex)
    heap: List[Tuple[float, int]] = [(0.0, start)]

    vertices_added = 0

    while heap and vertices_added < num_vertices:
        w, u = heapq.heappop(heap)

        if in_mst[u]:
            continue

        in_mst[u] = True
        vertices_added += 1

        for v, weight in graph[u]:
            if not in_mst[v] and weight < key[v]:
                key[v] = weight
                parent[v] = u
                heapq.heappush(heap, (weight, v))

    # Build edge list from parent array
    mst_edges: List[Tuple[int, int, float]] = []
    total_weight = 0.0

    for v in range(num_vertices):
        if parent[v] is not None:
            mst_edges.append((parent[v], v, key[v]))
            total_weight += key[v]

    return mst_edges, total_weight


# Example usage
if __name__ == "__main__":
    # Graph:
    #   0 --1-- 1
    #   |      /|
    #   4    2  3
    #   |  /    |
    #   2 --5-- 3
    graph = {
        0: [(1, 1), (2, 4)],
        1: [(0, 1), (2, 2), (3, 3)],
        2: [(0, 4), (1, 2), (3, 5)],
        3: [(1, 3), (2, 5)],
    }
    mst, weight = prim(graph, start=0)
    print("MST edges:", mst)        # [(None->0 excluded), (0,1,1), (1,2,2), (1,3,3)]
    print("Total weight:", weight)   # 6`,
    javascript: `/**
 * Find the Minimum Spanning Tree using Prim's algorithm.
 *
 * @param {Map<number, [number, number][]>} graph - Adjacency list: vertex -> [(neighbor, weight)]
 * @param {number} start - Starting vertex (default 0)
 * @returns {{ mstEdges: [number, number, number][], totalWeight: number }}
 */
function prim(graph, start = 0) {
  const numVertices = graph.size;
  const inMST = new Array(numVertices).fill(false);
  const key = new Array(numVertices).fill(Infinity);
  const parent = new Array(numVertices).fill(null);

  key[start] = 0;

  // Simple priority queue using a sorted array (for clarity)
  // Production code should use a binary heap
  const pq = [[0, start]]; // [weight, vertex]

  let verticesAdded = 0;

  while (pq.length > 0 && verticesAdded < numVertices) {
    pq.sort((a, b) => a[0] - b[0]);
    const [w, u] = pq.shift();

    if (inMST[u]) continue;
    inMST[u] = true;
    verticesAdded++;

    for (const [v, weight] of graph.get(u) || []) {
      if (!inMST[v] && weight < key[v]) {
        key[v] = weight;
        parent[v] = u;
        pq.push([weight, v]);
      }
    }
  }

  // Build edge list from parent array
  const mstEdges = [];
  let totalWeight = 0;

  for (let v = 0; v < numVertices; v++) {
    if (parent[v] !== null) {
      mstEdges.push([parent[v], v, key[v]]);
      totalWeight += key[v];
    }
  }

  return { mstEdges, totalWeight };
}

// Example usage
const graph = new Map([
  [0, [[1, 1], [2, 4]]],
  [1, [[0, 1], [2, 2], [3, 3]]],
  [2, [[0, 4], [1, 2], [3, 5]]],
  [3, [[1, 3], [2, 5]]],
]);

const { mstEdges, totalWeight } = prim(graph, 0);
console.log("MST edges:", mstEdges);
// [[0,1,1], [1,2,2], [1,3,3]]
console.log("Total weight:", totalWeight);
// 6`,
  },
  useCases: [
    "Network infrastructure design to minimize cabling or piping costs between nodes",
    "VLSI circuit design to minimize total wire length connecting components",
    "Cluster analysis as a step in constructing minimum spanning tree-based clustering",
    "Approximation algorithms for the Traveling Salesman Problem on metric spaces",
  ],
  relatedAlgorithms: [
    "kruskal",
    "dijkstra",
    "boruvka",
    "bfs",
  ],
  glossaryTerms: [
    "minimum spanning tree",
    "greedy algorithm",
    "priority queue",
    "binary heap",
    "adjacency list",
    "cut property",
    "connected graph",
  ],
  tags: [
    "graph",
    "minimum-spanning-tree",
    "greedy",
    "priority-queue",
    "undirected-graph",
    "weighted-graph",
    "classic",
  ],
};
