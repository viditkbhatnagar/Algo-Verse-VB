import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const unionFind: AlgorithmMetadata = {
  id: "union-find",
  name: "Union-Find (Disjoint Set)",
  category: "data-structures",
  subcategory: "Advanced",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1)",
    average: "O(α(n))",
    worst: "O(α(n))",
    note: "With both union by rank and path compression, each operation runs in amortized O(α(n)) time, where α is the inverse Ackermann function — effectively constant (α(n) ≤ 4 for all practical input sizes up to 2^65536).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Requires two arrays of size n: one for parent pointers and one for rank (or size). No additional memory is needed beyond the element storage.",
  },
  description: `Union-Find (also called Disjoint Set Union or DSU) is a data structure that maintains a collection of disjoint (non-overlapping) sets. It supports two primary operations: Find, which determines which set an element belongs to (by returning a canonical representative or "root"), and Union, which merges two sets into one. These operations enable efficient tracking of connected components and equivalence classes.

The naive implementation uses a forest of trees, where each element points to a parent. The root of each tree is the representative of the set. Find follows parent pointers to the root, and Union links one root to another. Without optimizations, trees can become tall chains, making Find run in O(n) time. Two key optimizations bring the amortized cost down to nearly constant.

Union by rank (or union by size) is the first optimization. Each root maintains a rank — an upper bound on the height of its subtree. When unioning two sets, the root with the smaller rank becomes a child of the root with the larger rank. This keeps trees shallow, guaranteeing a maximum height of O(log n). Path compression is the second optimization: during a Find operation, every node along the path from the queried element to the root is repointed directly to the root. This flattens the tree structure, making subsequent finds nearly O(1).

Together, union by rank and path compression yield an amortized time complexity of O(α(n)) per operation, where α is the inverse Ackermann function. This function grows so slowly that α(n) ≤ 4 for any practically conceivable input, making the operations effectively constant time. Union-Find is used in Kruskal's minimum spanning tree algorithm (to detect cycles), network connectivity queries, image processing (connected component labeling), least common ancestor algorithms, and percolation theory. It is a fundamental building block in graph algorithms and computational geometry.`,
  shortDescription:
    "A data structure that tracks disjoint sets with near-constant-time union and find operations using path compression and union by rank.",
  pseudocode: `// Union-Find (Disjoint Set Union) with Rank + Path Compression

class UnionFind:
    parent = array[0..n-1]   // parent[i] = i initially
    rank = array[0..n-1]     // rank[i] = 0 initially

    makeSet(n):
        for i = 0 to n-1:
            parent[i] = i
            rank[i] = 0

    find(x):
        // Path compression: make every node point to root
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    union(x, y):
        rootX = find(x)
        rootY = find(y)
        if rootX == rootY:
            return  // Already in same set

        // Union by rank
        if rank[rootX] < rank[rootY]:
            parent[rootX] = rootY
        else if rank[rootX] > rank[rootY]:
            parent[rootY] = rootX
        else:
            parent[rootY] = rootX
            rank[rootX]++

    connected(x, y):
        return find(x) == find(y)`,
  implementations: {
    python: `class UnionFind:
    """Disjoint Set Union with union by rank and path compression."""

    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.num_sets = n

    def find(self, x: int) -> int:
        """Find the root of x with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        """Union sets containing x and y. Returns True if merged."""
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False  # Already in same set

        # Union by rank: attach smaller tree under larger
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        self.num_sets -= 1
        return True

    def connected(self, x: int, y: int) -> bool:
        """Check if x and y are in the same set."""
        return self.find(x) == self.find(y)

    def get_sets(self) -> dict[int, list[int]]:
        """Return all sets grouped by root."""
        from collections import defaultdict
        sets = defaultdict(list)
        for i in range(len(self.parent)):
            sets[self.find(i)].append(i)
        return dict(sets)


# Example
uf = UnionFind(6)
uf.union(0, 1)
uf.union(2, 3)
uf.union(0, 2)
print(uf.connected(1, 3))  # True  — they're in the same set
print(uf.connected(0, 4))  # False — different sets
print(uf.get_sets())        # {0: [0, 1, 2, 3], 4: [4], 5: [5]}
print(uf.find(3))           # 0    — root after path compression`,
    javascript: `class UnionFind {
  /**
   * Disjoint Set Union with union by rank and path compression.
   * Amortized O(α(n)) per operation.
   */

  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.numSets = n;
  }

  /** Find the root of x with path compression. */
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  /** Union sets containing x and y. Returns true if merged. */
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

    this.numSets--;
    return true;
  }

  /** Check if x and y are in the same set. */
  connected(x, y) {
    return this.find(x) === this.find(y);
  }

  /** Return all sets grouped by root. */
  getSets() {
    const sets = new Map();
    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      if (!sets.has(root)) sets.set(root, []);
      sets.get(root).push(i);
    }
    return Object.fromEntries(sets);
  }
}

// Example
const uf = new UnionFind(6);
uf.union(0, 1);
uf.union(2, 3);
uf.union(0, 2);
console.log(uf.connected(1, 3)); // true
console.log(uf.connected(0, 4)); // false
console.log(uf.getSets());        // { 0: [0,1,2,3], 4: [4], 5: [5] }
console.log(uf.find(3));          // 0`,
  },
  useCases: [
    "Kruskal's MST algorithm — uses Union-Find to detect cycles when adding edges to the spanning tree",
    "Network connectivity — determining if two nodes are in the same connected component in dynamic graphs",
    "Image processing — connected component labeling to identify distinct regions in binary images",
    "Percolation theory — modeling fluid flow through porous materials by tracking connected open sites",
    "Least common ancestor — offline LCA algorithms use Union-Find to efficiently answer ancestry queries",
  ],
  relatedAlgorithms: ["kruskal", "prim", "dfs", "bfs"],
  glossaryTerms: [
    "Disjoint Set",
    "Union by Rank",
    "Path Compression",
    "Representative",
    "Connected Component",
    "Inverse Ackermann",
    "Forest",
    "Root",
    "Amortized Analysis",
    "Equivalence Class",
  ],
  tags: [
    "union-find",
    "disjoint set",
    "DSU",
    "data structure",
    "path compression",
    "union by rank",
    "intermediate",
    "graph",
    "connectivity",
  ],
};
