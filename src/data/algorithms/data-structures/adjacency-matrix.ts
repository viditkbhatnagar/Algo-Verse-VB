import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const adjacencyMatrix: AlgorithmMetadata = {
  id: "adjacency-matrix",
  name: "Adjacency Matrix / List",
  category: "data-structures",
  subcategory: "Graph Representations",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Matrix: O(1) to check if an edge exists between two vertices. Adding/removing an edge is also O(1). However, iterating over all neighbors of a vertex takes O(V). Adjacency list: O(degree(v)) to check an edge, O(1) to add an edge, O(V+E) to traverse the entire graph.",
  },
  spaceComplexity: {
    best: "O(V^2)",
    average: "O(V^2)",
    worst: "O(V^2)",
    note: "Adjacency matrix always requires O(V^2) space regardless of the number of edges. Adjacency list uses O(V + E) space, which is more efficient for sparse graphs where E << V^2.",
  },
  description: `An adjacency matrix is a V x V boolean (or integer) matrix where entry [i][j] is 1 (or the edge weight) if there is an edge from vertex i to vertex j, and 0 otherwise. For undirected graphs, the matrix is symmetric: matrix[i][j] = matrix[j][i]. This representation provides O(1) edge lookup time but requires O(V^2) space, making it ideal for dense graphs where most vertex pairs are connected.

An adjacency list represents a graph as an array of V lists. The i-th list contains all vertices adjacent to vertex i. For weighted graphs, each entry in the list stores both the neighbor vertex and the edge weight. This representation uses O(V + E) space, making it far more efficient for sparse graphs. However, checking whether a specific edge exists requires scanning the list, taking O(degree(v)) time in the worst case.

The choice between these representations depends on the graph density and the operations needed. Dense graphs (E close to V^2) favor the adjacency matrix for its O(1) edge queries and simpler implementation. Sparse graphs (E << V^2) favor the adjacency list for its memory efficiency and faster neighbor iteration. Most real-world graphs are sparse — social networks, road networks, and the web graph all have far fewer edges than the maximum V^2. Many graph algorithms (BFS, DFS, Dijkstra) primarily need to iterate over neighbors, making adjacency lists the default choice in practice.

Additional representations include the edge list (simply a list of all edges, useful for Kruskal's algorithm), the incidence matrix (V x E matrix), and compressed sparse row (CSR) format used in high-performance computing. Modern graph databases use variants of adjacency lists with hash-based neighbor lookups for O(1) edge queries while maintaining O(V + E) space efficiency.`,
  shortDescription:
    "Two fundamental graph representations: a V x V matrix for O(1) edge lookup, and vertex-indexed lists for space-efficient neighbor traversal.",
  pseudocode: `// Adjacency Matrix Representation

class AdjacencyMatrix:
    V = number of vertices
    matrix = V x V array of zeros

    addEdge(u, v):
        matrix[u][v] = 1
        matrix[v][u] = 1  // undirected

    removeEdge(u, v):
        matrix[u][v] = 0
        matrix[v][u] = 0

    hasEdge(u, v):
        return matrix[u][v] == 1

    neighbors(v):
        result = []
        for u = 0 to V-1:
            if matrix[v][u] == 1:
                result.append(u)
        return result


// Adjacency List Representation

class AdjacencyList:
    V = number of vertices
    adj = array of V empty lists

    addEdge(u, v):
        adj[u].append(v)
        adj[v].append(u)  // undirected

    removeEdge(u, v):
        adj[u].remove(v)
        adj[v].remove(u)

    hasEdge(u, v):
        return v in adj[u]

    neighbors(v):
        return adj[v]`,
  implementations: {
    python: `class AdjacencyMatrix:
    """Graph representation using a V x V matrix."""

    def __init__(self, num_vertices: int):
        self.V = num_vertices
        self.matrix = [[0] * num_vertices for _ in range(num_vertices)]

    def add_edge(self, u: int, v: int, undirected: bool = True) -> None:
        """Add an edge between u and v. O(1)."""
        self.matrix[u][v] = 1
        if undirected:
            self.matrix[v][u] = 1

    def remove_edge(self, u: int, v: int, undirected: bool = True) -> None:
        """Remove edge between u and v. O(1)."""
        self.matrix[u][v] = 0
        if undirected:
            self.matrix[v][u] = 0

    def has_edge(self, u: int, v: int) -> bool:
        """Check if edge exists. O(1)."""
        return self.matrix[u][v] == 1

    def neighbors(self, v: int) -> list[int]:
        """Get all neighbors of v. O(V)."""
        return [u for u in range(self.V) if self.matrix[v][u] == 1]

    def edge_count(self) -> int:
        """Count total edges. O(V^2)."""
        count = sum(self.matrix[i][j] for i in range(self.V) for j in range(self.V))
        return count // 2  # Undirected: each edge counted twice

    def __repr__(self) -> str:
        rows = ["  ".join(map(str, row)) for row in self.matrix]
        return "\\n".join(rows)


class AdjacencyList:
    """Graph representation using vertex-indexed lists."""

    def __init__(self, num_vertices: int):
        self.V = num_vertices
        self.adj: list[list[int]] = [[] for _ in range(num_vertices)]

    def add_edge(self, u: int, v: int, undirected: bool = True) -> None:
        """Add edge between u and v. O(1)."""
        self.adj[u].append(v)
        if undirected:
            self.adj[v].append(u)

    def has_edge(self, u: int, v: int) -> bool:
        """Check if edge exists. O(degree(u))."""
        return v in self.adj[u]

    def neighbors(self, v: int) -> list[int]:
        """Get all neighbors of v. O(1)."""
        return self.adj[v]

    def __repr__(self) -> str:
        lines = [f"{v}: {self.adj[v]}" for v in range(self.V)]
        return "\\n".join(lines)


# Example
g = AdjacencyMatrix(5)
for u, v in [(0,1), (0,2), (1,2), (1,3), (2,4), (3,4)]:
    g.add_edge(u, v)
print(g)
print(f"Neighbors of 1: {g.neighbors(1)}")  # [0, 2, 3]
print(f"Has edge 2-4? {g.has_edge(2, 4)}")  # True`,
    javascript: `class AdjacencyMatrix {
  /** Graph representation using a V x V matrix. */

  constructor(numVertices) {
    this.V = numVertices;
    this.matrix = Array.from({ length: numVertices }, () =>
      new Array(numVertices).fill(0)
    );
  }

  /** Add an edge between u and v. O(1). */
  addEdge(u, v, undirected = true) {
    this.matrix[u][v] = 1;
    if (undirected) this.matrix[v][u] = 1;
  }

  /** Remove edge between u and v. O(1). */
  removeEdge(u, v, undirected = true) {
    this.matrix[u][v] = 0;
    if (undirected) this.matrix[v][u] = 0;
  }

  /** Check if edge exists. O(1). */
  hasEdge(u, v) {
    return this.matrix[u][v] === 1;
  }

  /** Get all neighbors of v. O(V). */
  neighbors(v) {
    const result = [];
    for (let u = 0; u < this.V; u++) {
      if (this.matrix[v][u] === 1) result.push(u);
    }
    return result;
  }

  toString() {
    return this.matrix.map((row) => row.join("  ")).join("\\n");
  }
}

class AdjacencyList {
  /** Graph representation using vertex-indexed lists. */

  constructor(numVertices) {
    this.V = numVertices;
    this.adj = Array.from({ length: numVertices }, () => []);
  }

  addEdge(u, v, undirected = true) {
    this.adj[u].push(v);
    if (undirected) this.adj[v].push(u);
  }

  hasEdge(u, v) {
    return this.adj[u].includes(v);
  }

  neighbors(v) {
    return this.adj[v];
  }

  toString() {
    return this.adj.map((list, v) => \`\${v}: [\${list.join(", ")}]\`).join("\\n");
  }
}

// Example
const g = new AdjacencyMatrix(5);
[[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]].forEach(([u,v]) => g.addEdge(u, v));
console.log(g.toString());
console.log("Neighbors of 1:", g.neighbors(1)); // [0, 2, 3]
console.log("Has edge 2-4?", g.hasEdge(2, 4)); // true`,
  },
  useCases: [
    "Social network analysis — adjacency lists efficiently represent sparse friend/follower graphs with billions of nodes",
    "Navigation and routing — road networks stored as adjacency lists with weighted edges for shortest-path queries",
    "Dense graph algorithms — adjacency matrices enable O(1) edge lookups for Floyd-Warshall all-pairs shortest paths",
    "Image processing — pixel adjacency grids are naturally represented as implicit adjacency matrices",
    "Compiler optimization — control flow graphs and dependency graphs use adjacency lists for efficient traversal",
  ],
  relatedAlgorithms: ["dfs", "bfs", "dijkstra", "kruskal", "prim"],
  glossaryTerms: [
    "Adjacency Matrix",
    "Adjacency List",
    "Sparse Graph",
    "Dense Graph",
    "Vertex",
    "Edge",
    "Degree",
    "Undirected Graph",
    "Directed Graph",
    "Edge List",
  ],
  tags: [
    "adjacency matrix",
    "adjacency list",
    "graph representation",
    "data structure",
    "graph",
    "intermediate",
    "sparse",
    "dense",
  ],
};
