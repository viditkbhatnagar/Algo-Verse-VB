import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const kruskal: AlgorithmMetadata = {
  id: "kruskal",
  name: "Kruskal's Algorithm",
  category: "graph",
  subcategory: "Minimum Spanning Tree",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(E log E)",
    average: "O(E log E)",
    worst: "O(E log E)",
    note: "Dominated by sorting the edges. Union-Find operations are nearly O(1) amortized with path compression and union by rank.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Union-Find data structure stores parent and rank arrays for V vertices.",
  },
  description: `Kruskal's algorithm is a classic greedy algorithm for finding the Minimum Spanning Tree (MST) \
of a connected, undirected, weighted graph. An MST is a subset of edges that connects all vertices \
with the minimum possible total edge weight and without forming any cycles. The algorithm was first \
described by Joseph Kruskal in 1956 and is one of the two most widely taught MST algorithms alongside \
Prim's algorithm.

The algorithm operates by first sorting all edges in the graph by their weight in non-decreasing order. \
It then iterates through the sorted edges, adding each edge to the growing spanning tree if it does \
not create a cycle. Cycle detection is performed efficiently using a Union-Find (Disjoint Set Union) \
data structure, which supports near-constant-time operations for determining whether two vertices \
belong to the same connected component and for merging components.

The time complexity of Kruskal's algorithm is O(E log E), dominated by the initial edge sorting step. \
Since E is at most V^2 for simple graphs, this is equivalent to O(E log V). The Union-Find operations \
with path compression and union by rank add only an inverse Ackermann factor, which is effectively \
constant for all practical input sizes. This makes Kruskal's algorithm particularly efficient for \
sparse graphs where E is much smaller than V^2.

Kruskal's algorithm is preferred over Prim's algorithm when the graph is sparse or when edges are \
already available as a list (rather than an adjacency list). It finds applications in network design \
(telecommunications, electrical grids, water supply), clustering algorithms (single-linkage clustering), \
and approximation algorithms for NP-hard problems like the Traveling Salesman Problem. The algorithm \
is also the foundation of Kruskal's algorithm for maze generation.`,
  shortDescription:
    "Builds a minimum spanning tree by greedily adding the smallest-weight edges that do not form a cycle, using a Union-Find data structure for efficient cycle detection.",
  pseudocode: `function Kruskal(Graph G):
    // Initialize result and Union-Find
    MST = empty set of edges
    sort G.edges by weight in non-decreasing order

    // Initialize Union-Find for each vertex
    for each vertex v in G.vertices:
        MakeSet(v)

    for each edge (u, v, weight) in sorted G.edges:
        if Find(u) != Find(v):
            // u and v are in different components — no cycle
            MST.add((u, v, weight))
            Union(u, v)

        if |MST| == |G.vertices| - 1:
            break   // MST is complete

    return MST

// Union-Find with path compression and union by rank
function MakeSet(x):
    parent[x] = x
    rank[x] = 0

function Find(x):
    if parent[x] != x:
        parent[x] = Find(parent[x])   // path compression
    return parent[x]

function Union(x, y):
    rootX = Find(x)
    rootY = Find(y)
    if rank[rootX] < rank[rootY]:
        parent[rootX] = rootY
    else if rank[rootX] > rank[rootY]:
        parent[rootY] = rootX
    else:
        parent[rootY] = rootX
        rank[rootX] += 1`,
  implementations: {
    python: `from typing import List, Tuple


class UnionFind:
    """Disjoint Set Union with path compression and union by rank."""

    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        """Union two sets. Returns True if they were in different sets."""
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False

        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True


def kruskal(
    num_vertices: int,
    edges: List[Tuple[int, int, float]],
) -> Tuple[List[Tuple[int, int, float]], float]:
    """
    Find the Minimum Spanning Tree using Kruskal's algorithm.

    Args:
        num_vertices: Number of vertices (labeled 0 to n-1)
        edges: List of (u, v, weight) tuples

    Returns:
        mst_edges: Edges in the MST
        total_weight: Sum of MST edge weights
    """
    # Sort edges by weight
    sorted_edges = sorted(edges, key=lambda e: e[2])
    uf = UnionFind(num_vertices)

    mst_edges: List[Tuple[int, int, float]] = []
    total_weight = 0.0

    for u, v, weight in sorted_edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))
            total_weight += weight

            if len(mst_edges) == num_vertices - 1:
                break  # MST is complete

    return mst_edges, total_weight


# Example usage
if __name__ == "__main__":
    #     0
    #    /|\\
    #   1 | 4
    #  /  |  \\
    # 1---2---3
    #   2   3
    edges = [
        (0, 1, 1),
        (0, 2, 4),
        (1, 2, 2),
        (2, 3, 3),
        (0, 3, 4),
    ]
    mst, weight = kruskal(4, edges)
    print("MST edges:", mst)      # [(0,1,1), (1,2,2), (2,3,3)]
    print("Total weight:", weight)  # 6`,
    javascript: `/**
 * Union-Find (Disjoint Set Union) with path compression and union by rank.
 */
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

/**
 * Find the Minimum Spanning Tree using Kruskal's algorithm.
 *
 * @param {number} numVertices - Number of vertices (labeled 0 to n-1)
 * @param {[number, number, number][]} edges - Array of [u, v, weight]
 * @returns {{ mstEdges: [number, number, number][], totalWeight: number }}
 */
function kruskal(numVertices, edges) {
  // Sort edges by weight
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(numVertices);

  const mstEdges = [];
  let totalWeight = 0;

  for (const [u, v, weight] of sorted) {
    if (uf.union(u, v)) {
      mstEdges.push([u, v, weight]);
      totalWeight += weight;

      if (mstEdges.length === numVertices - 1) {
        break; // MST is complete
      }
    }
  }

  return { mstEdges, totalWeight };
}

// Example usage
const edges = [
  [0, 1, 1],
  [0, 2, 4],
  [1, 2, 2],
  [2, 3, 3],
  [0, 3, 4],
];

const { mstEdges, totalWeight } = kruskal(4, edges);
console.log("MST edges:", mstEdges);
// [[0,1,1], [1,2,2], [2,3,3]]
console.log("Total weight:", totalWeight);
// 6`,
  },
  useCases: [
    "Designing minimum-cost network infrastructure (telecommunications, electrical grids, pipelines)",
    "Single-linkage hierarchical clustering in machine learning and data analysis",
    "Approximation algorithms for the Traveling Salesman Problem and Steiner Tree Problem",
    "Maze generation by treating grid cells as vertices and walls as weighted edges",
    "Image segmentation by treating pixels as vertices and intensity differences as edge weights",
  ],
  relatedAlgorithms: [
    "prim",
    "boruvka",
    "dijkstra",
    "union-find",
    "dfs",
  ],
  glossaryTerms: [
    "minimum spanning tree",
    "greedy algorithm",
    "union-find",
    "disjoint set",
    "path compression",
    "union by rank",
    "cycle detection",
    "connected component",
  ],
  tags: [
    "graph",
    "minimum-spanning-tree",
    "greedy",
    "union-find",
    "undirected-graph",
    "weighted-graph",
    "classic",
  ],
};
