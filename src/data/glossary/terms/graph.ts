import type { GlossaryTermData } from "@/lib/visualization/types";

export const graphTerms: GlossaryTermData[] = [
  {
    slug: "vertex",
    name: "Vertex",
    definition:
      "A vertex (also called a node) is a fundamental unit of a graph. It represents an entity such as a city, a person, or a state in a problem. Vertices are connected to each other by edges.",
    relatedTerms: ["edge", "degree", "graph-traversal"],
    category: "graph",
    tags: ["graph", "basics", "node"],
  },
  {
    slug: "edge",
    name: "Edge",
    definition:
      "An edge is a connection between two vertices in a graph. Edges can be directed (one-way) or undirected (two-way), and they may carry a weight representing cost, distance, or capacity.",
    relatedTerms: ["vertex", "back-edge", "cross-edge", "tree-edge", "forward-edge", "bridge"],
    category: "graph",
    tags: ["graph", "basics", "connection"],
  },
  {
    slug: "path",
    name: "Path",
    definition:
      "A path is a sequence of vertices connected by edges, where no vertex is repeated. The length of a path is the number of edges it contains (or the sum of edge weights in a weighted graph).",
    relatedTerms: ["shortest-path", "cycle", "euler-path", "hamiltonian-path"],
    category: "graph",
    tags: ["graph", "basics", "traversal"],
  },
  {
    slug: "cycle",
    name: "Cycle",
    definition:
      "A cycle is a path that starts and ends at the same vertex, with at least one edge. A graph with no cycles is called acyclic. Detecting cycles is important in dependency resolution and deadlock detection.",
    relatedTerms: ["dag-directed-acyclic-graph", "cycle-detection", "negative-cycle", "back-edge"],
    category: "graph",
    tags: ["graph", "basics", "cycle"],
  },
  {
    slug: "connected-component",
    name: "Connected Component",
    definition:
      "A connected component is a maximal set of vertices in an undirected graph such that there is a path between every pair of vertices in the set. A graph is connected if it has exactly one connected component.",
    relatedTerms: ["strongly-connected-component", "graph-traversal", "vertex"],
    category: "graph",
    tags: ["graph", "connectivity", "component"],
  },
  {
    slug: "strongly-connected-component",
    name: "Strongly Connected Component",
    definition:
      "A strongly connected component (SCC) is a maximal set of vertices in a directed graph such that there is a directed path from every vertex to every other vertex in the set. Tarjan's and Kosaraju's algorithms can find all SCCs efficiently.",
    relatedTerms: ["connected-component", "dag-directed-acyclic-graph", "graph-traversal"],
    category: "graph",
    tags: ["graph", "connectivity", "directed"],
  },
  {
    slug: "topological-sort",
    name: "Topological Sort",
    definition:
      "Topological sort is a linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge (u, v), vertex u comes before vertex v. It is commonly used for task scheduling, build systems, and course prerequisite ordering.",
    relatedTerms: ["dag-directed-acyclic-graph", "graph-traversal", "cycle-detection"],
    category: "graph",
    tags: ["graph", "dag", "ordering", "sorting"],
  },
  {
    slug: "shortest-path",
    name: "Shortest Path",
    definition:
      "The shortest path between two vertices is the path with the minimum total edge weight (or fewest edges in an unweighted graph). Finding shortest paths is one of the most fundamental problems in graph theory, with applications in navigation, networking, and logistics.",
    relatedTerms: ["dijkstras-algorithm", "bellman-ford-algorithm", "floyd-warshall", "relaxation"],
    category: "graph",
    tags: ["graph", "optimization", "pathfinding"],
  },
  {
    slug: "minimum-spanning-tree",
    name: "Minimum Spanning Tree",
    definition:
      "A minimum spanning tree (MST) of a weighted, connected, undirected graph is a spanning tree whose total edge weight is minimized. It connects all vertices with the least total cost and is used in network design and clustering.",
    formula: "$\\text{MST weight} = \\sum_{e \\in T} w(e)$, where $T$ has exactly $|V| - 1$ edges",
    relatedTerms: ["kruskals-algorithm", "prims-algorithm", "spanning-tree"],
    category: "graph",
    tags: ["graph", "optimization", "tree", "mst"],
  },
  {
    slug: "dijkstras-algorithm",
    name: "Dijkstra's Algorithm",
    definition:
      "Dijkstra's algorithm finds the shortest path from a single source vertex to all other vertices in a graph with non-negative edge weights. It works by greedily selecting the unvisited vertex with the smallest known distance and relaxing its neighbors.",
    formula: "$O((V + E) \\log V)$ with a binary heap priority queue",
    relatedTerms: ["shortest-path", "relaxation", "bellman-ford-algorithm", "a-star-search"],
    category: "graph",
    tags: ["graph", "shortest-path", "greedy", "algorithm"],
  },
  {
    slug: "bellman-ford-algorithm",
    name: "Bellman-Ford Algorithm",
    definition:
      "The Bellman-Ford algorithm computes shortest paths from a single source vertex to all other vertices, even when edge weights are negative. It relaxes all edges $|V| - 1$ times and can detect negative-weight cycles.",
    formula: "$O(V \\cdot E)$ time complexity",
    relatedTerms: ["shortest-path", "relaxation", "negative-cycle", "dijkstras-algorithm"],
    category: "graph",
    tags: ["graph", "shortest-path", "negative-weights", "algorithm"],
  },
  {
    slug: "floyd-warshall",
    name: "Floyd-Warshall",
    definition:
      "The Floyd-Warshall algorithm computes the shortest paths between all pairs of vertices in a weighted graph. It uses dynamic programming, iteratively considering each vertex as an intermediate node. It works with negative weights but not negative cycles.",
    formula: "$d[i][j] = \\min(d[i][j],\\; d[i][k] + d[k][j])$ with $O(V^3)$ time complexity",
    relatedTerms: ["shortest-path", "dijkstras-algorithm", "bellman-ford-algorithm", "negative-cycle"],
    category: "graph",
    tags: ["graph", "shortest-path", "all-pairs", "dynamic-programming"],
  },
  {
    slug: "kruskals-algorithm",
    name: "Kruskal's Algorithm",
    definition:
      "Kruskal's algorithm builds a minimum spanning tree by sorting all edges by weight and adding them one by one, skipping any edge that would create a cycle. It uses a Union-Find data structure for efficient cycle detection.",
    formula: "$O(E \\log E)$ time complexity",
    relatedTerms: ["minimum-spanning-tree", "prims-algorithm", "spanning-tree"],
    category: "graph",
    tags: ["graph", "mst", "greedy", "algorithm"],
  },
  {
    slug: "prims-algorithm",
    name: "Prim's Algorithm",
    definition:
      "Prim's algorithm builds a minimum spanning tree by starting from an arbitrary vertex and repeatedly adding the cheapest edge that connects a vertex in the tree to a vertex outside the tree. It is similar in spirit to Dijkstra's algorithm.",
    formula: "$O((V + E) \\log V)$ with a binary heap",
    relatedTerms: ["minimum-spanning-tree", "kruskals-algorithm", "spanning-tree", "dijkstras-algorithm"],
    category: "graph",
    tags: ["graph", "mst", "greedy", "algorithm"],
  },
  {
    slug: "a-star-search",
    name: "A* Search",
    definition:
      "A* (A-star) is a best-first search algorithm that finds the shortest path from a start node to a goal node. It uses a heuristic function to estimate the remaining distance, combining it with the actual cost so far to prioritize the most promising paths.",
    formula: "$f(n) = g(n) + h(n)$, where $g(n)$ is the cost so far and $h(n)$ is the heuristic estimate",
    relatedTerms: ["dijkstras-algorithm", "shortest-path", "graph-traversal"],
    category: "graph",
    tags: ["graph", "pathfinding", "heuristic", "algorithm"],
  },
  {
    slug: "bipartite-graph",
    name: "Bipartite Graph",
    definition:
      "A bipartite graph is a graph whose vertices can be divided into two disjoint sets such that every edge connects a vertex in one set to a vertex in the other set. A graph is bipartite if and only if it contains no odd-length cycles.",
    relatedTerms: ["graph-coloring", "vertex", "edge", "cycle"],
    category: "graph",
    tags: ["graph", "coloring", "matching"],
  },
  {
    slug: "euler-path",
    name: "Euler Path",
    definition:
      "An Euler path (or Eulerian trail) is a path in a graph that visits every edge exactly once. An Euler path exists in an undirected graph if and only if the graph is connected and has exactly zero or two vertices of odd degree.",
    relatedTerms: ["hamiltonian-path", "path", "degree", "graph-traversal"],
    category: "graph",
    tags: ["graph", "path", "traversal"],
  },
  {
    slug: "hamiltonian-path",
    name: "Hamiltonian Path",
    definition:
      "A Hamiltonian path is a path in a graph that visits every vertex exactly once. Unlike Euler paths, determining whether a Hamiltonian path exists is an NP-complete problem, meaning no efficient algorithm is known for all cases.",
    relatedTerms: ["euler-path", "path", "cycle", "vertex"],
    category: "graph",
    tags: ["graph", "path", "np-complete"],
  },
  {
    slug: "graph-coloring",
    name: "Graph Coloring",
    definition:
      "Graph coloring assigns colors to vertices of a graph such that no two adjacent vertices share the same color. The minimum number of colors needed is called the chromatic number. It is used in scheduling, register allocation, and map coloring.",
    relatedTerms: ["bipartite-graph", "vertex", "degree"],
    category: "graph",
    tags: ["graph", "coloring", "np-hard"],
  },
  {
    slug: "degree",
    name: "Degree",
    definition:
      "The degree of a vertex is the number of edges incident to it. In a directed graph, degree is split into in-degree (incoming edges) and out-degree (outgoing edges). The sum of all vertex degrees equals twice the number of edges.",
    formula: "$\\sum_{v \\in V} \\deg(v) = 2|E|$",
    relatedTerms: ["in-degree", "out-degree", "vertex", "edge"],
    category: "graph",
    tags: ["graph", "basics", "vertex-property"],
  },
  {
    slug: "in-degree",
    name: "In-Degree",
    definition:
      "The in-degree of a vertex in a directed graph is the number of edges pointing into that vertex. A vertex with in-degree zero has no predecessors and is often a starting point in topological sort.",
    relatedTerms: ["out-degree", "degree", "topological-sort", "vertex"],
    category: "graph",
    tags: ["graph", "directed", "vertex-property"],
  },
  {
    slug: "out-degree",
    name: "Out-Degree",
    definition:
      "The out-degree of a vertex in a directed graph is the number of edges going out from that vertex. A vertex with out-degree zero has no successors and is often a terminal node.",
    relatedTerms: ["in-degree", "degree", "vertex"],
    category: "graph",
    tags: ["graph", "directed", "vertex-property"],
  },
  {
    slug: "dag-directed-acyclic-graph",
    name: "DAG (Directed Acyclic Graph)",
    definition:
      "A directed acyclic graph (DAG) is a directed graph with no cycles. DAGs are used to model dependencies, and they always admit a topological ordering. Many scheduling and compilation problems are modeled as DAGs.",
    relatedTerms: ["topological-sort", "cycle", "strongly-connected-component"],
    category: "graph",
    tags: ["graph", "dag", "directed", "acyclic"],
  },
  {
    slug: "spanning-tree",
    name: "Spanning Tree",
    definition:
      "A spanning tree of a connected graph is a subgraph that is a tree and includes all vertices of the graph. It has exactly $|V| - 1$ edges. Every connected graph has at least one spanning tree.",
    formula: "A spanning tree has exactly $|V| - 1$ edges",
    relatedTerms: ["minimum-spanning-tree", "kruskals-algorithm", "prims-algorithm"],
    category: "graph",
    tags: ["graph", "tree", "subgraph"],
  },
  {
    slug: "cut-vertex",
    name: "Cut Vertex",
    definition:
      "A cut vertex (also called an articulation point) is a vertex whose removal disconnects the graph or increases the number of connected components. Finding cut vertices is important for analyzing network reliability.",
    relatedTerms: ["articulation-point", "bridge", "connected-component"],
    category: "graph",
    tags: ["graph", "connectivity", "critical-point"],
  },
  {
    slug: "bridge",
    name: "Bridge",
    definition:
      "A bridge is an edge in a graph whose removal disconnects the graph (or increases the number of connected components). Bridges represent critical connections in a network and can be found efficiently using Tarjan's algorithm.",
    relatedTerms: ["cut-vertex", "articulation-point", "connected-component", "edge"],
    category: "graph",
    tags: ["graph", "connectivity", "critical-edge"],
  },
  {
    slug: "articulation-point",
    name: "Articulation Point",
    definition:
      "An articulation point is another name for a cut vertex \u2014 a vertex whose removal increases the number of connected components in the graph. Tarjan's algorithm finds all articulation points in linear time using DFS and low-link values.",
    relatedTerms: ["cut-vertex", "bridge", "connected-component", "graph-traversal"],
    category: "graph",
    tags: ["graph", "connectivity", "dfs"],
  },
  {
    slug: "graph-traversal",
    name: "Graph Traversal",
    definition:
      "Graph traversal is the process of visiting all vertices (and/or edges) in a graph systematically. The two main strategies are Breadth-First Search (BFS), which explores neighbors level by level, and Depth-First Search (DFS), which explores as deep as possible before backtracking.",
    relatedTerms: ["vertex", "edge", "connected-component", "topological-sort"],
    category: "graph",
    tags: ["graph", "bfs", "dfs", "traversal"],
  },
  {
    slug: "relaxation",
    name: "Relaxation",
    definition:
      "Relaxation is the process of updating the shortest known distance to a vertex when a shorter path is found through another vertex. It is the core operation in shortest-path algorithms like Dijkstra's and Bellman-Ford.",
    formula: "If $d[v] > d[u] + w(u, v)$, then set $d[v] = d[u] + w(u, v)$",
    relatedTerms: ["shortest-path", "dijkstras-algorithm", "bellman-ford-algorithm"],
    category: "graph",
    tags: ["graph", "shortest-path", "operation"],
  },
  {
    slug: "negative-cycle",
    name: "Negative Cycle",
    definition:
      "A negative cycle is a cycle in a weighted directed graph whose edge weights sum to a negative value. When a negative cycle is reachable from the source, shortest paths are undefined because you can keep looping to reduce the total cost infinitely.",
    relatedTerms: ["bellman-ford-algorithm", "cycle", "shortest-path", "relaxation"],
    category: "graph",
    tags: ["graph", "shortest-path", "negative-weights"],
  },
  {
    slug: "back-edge",
    name: "Back Edge",
    definition:
      "A back edge is an edge in a DFS traversal that connects a vertex to one of its ancestors in the DFS tree. The presence of a back edge indicates a cycle in the graph. Back edges are key to cycle detection algorithms.",
    relatedTerms: ["cycle-detection", "tree-edge", "cross-edge", "forward-edge", "graph-traversal"],
    category: "graph",
    tags: ["graph", "dfs", "edge-classification"],
  },
  {
    slug: "cross-edge",
    name: "Cross Edge",
    definition:
      "A cross edge is an edge in a DFS traversal that connects a vertex to another vertex that is neither an ancestor nor a descendant in the DFS tree. Cross edges appear in directed graphs and connect vertices in different DFS subtrees.",
    relatedTerms: ["back-edge", "tree-edge", "forward-edge", "graph-traversal"],
    category: "graph",
    tags: ["graph", "dfs", "edge-classification"],
  },
  {
    slug: "tree-edge",
    name: "Tree Edge",
    definition:
      "A tree edge is an edge in the DFS tree that connects a vertex to a newly discovered (unvisited) vertex. Together, all tree edges form the DFS spanning tree of the graph.",
    relatedTerms: ["back-edge", "cross-edge", "forward-edge", "graph-traversal", "spanning-tree"],
    category: "graph",
    tags: ["graph", "dfs", "edge-classification"],
  },
  {
    slug: "forward-edge",
    name: "Forward Edge",
    definition:
      "A forward edge is an edge in a DFS traversal that connects a vertex to a descendant that has already been visited. Forward edges only appear in directed graphs and are redundant paths to already-reachable vertices.",
    relatedTerms: ["back-edge", "cross-edge", "tree-edge", "graph-traversal"],
    category: "graph",
    tags: ["graph", "dfs", "edge-classification"],
  },
  {
    slug: "cycle-detection",
    name: "Cycle Detection",
    definition:
      "Cycle detection determines whether a graph contains a cycle. In undirected graphs, DFS or Union-Find can detect cycles. In directed graphs, DFS with coloring (white/gray/black) detects cycles by finding back edges.",
    relatedTerms: ["cycle", "back-edge", "dag-directed-acyclic-graph", "topological-sort"],
    category: "graph",
    tags: ["graph", "cycle", "dfs", "algorithm"],
  },
];
