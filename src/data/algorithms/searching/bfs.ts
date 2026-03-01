import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const bfs: AlgorithmMetadata = {
  id: "bfs",
  name: "Breadth-First Search",
  category: "searching",
  subcategory: "Graph Traversals",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    note: "Every vertex and every edge is examined exactly once, where V is the number of vertices and E is the number of edges.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Space is dominated by the queue and the visited set, both proportional to the number of vertices. In the worst case the queue may hold all vertices at the widest level of the graph.",
  },
  description: `Breadth-First Search (BFS) is a fundamental graph traversal algorithm that explores all vertices at the current depth level before moving on to vertices at the next depth level. Starting from a source vertex, BFS visits all of its immediate neighbors first, then all of their unvisited neighbors, and so on. This layer-by-layer exploration is achieved by using a queue data structure: newly discovered vertices are enqueued at the back, and the next vertex to process is always dequeued from the front.

The algorithm works as follows: the source vertex is marked as visited and enqueued. Then, in a loop, the front vertex is dequeued and each of its unvisited neighbors is marked as visited and enqueued. This process continues until the queue is empty, meaning all reachable vertices have been explored. Because BFS explores vertices in order of their distance from the source, it naturally computes the shortest path (in terms of the number of edges) from the source to every other reachable vertex in an unweighted graph.

The shortest-path property is one of BFS's most important characteristics and distinguishes it from DFS. When BFS first reaches a vertex, the path taken is guaranteed to have the fewest edges possible. This makes BFS the algorithm of choice for unweighted shortest-path problems, social network degree-of-separation queries, and any scenario where you need to find the nearest instance of something. BFS is also used to determine bipartiteness: a graph is bipartite if and only if BFS never discovers an edge connecting two vertices at the same depth level.

BFS serves as the foundation for several advanced algorithms. Dijkstra's shortest-path algorithm generalizes BFS to handle weighted edges by replacing the simple queue with a priority queue. The Edmonds-Karp algorithm for maximum flow uses BFS to find augmenting paths. Level-order traversal of trees is a direct application of BFS. Understanding BFS thoroughly — its queue-based mechanics, its level-by-level expansion, and its shortest-path guarantee — is essential preparation for tackling a wide range of graph problems in both academic and real-world settings.`,
  shortDescription:
    "Traverses a graph level by level, exploring all neighbors at the current depth before moving deeper.",
  pseudocode: `BFS(graph, start)
  create a set visited
  create a queue Q
  add start to visited
  enqueue start into Q
  while Q is not empty
    vertex = dequeue from Q
    process(vertex)
    for each neighbor of vertex in graph
      if neighbor is not in visited
        add neighbor to visited
        enqueue neighbor into Q`,
  implementations: {
    python: `from collections import deque


def bfs(graph: dict[str, list[str]], start: str) -> list[str]:
    """
    Perform breadth-first search on a graph.

    Args:
        graph: Adjacency list representation of the graph.
        start: The starting vertex.

    Returns:
        A list of vertices in the order they were visited.
    """
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order


def bfs_shortest_path(
    graph: dict[str, list[str]], start: str, target: str
) -> list[str] | None:
    """
    Find the shortest path (fewest edges) between start and target using BFS.

    Args:
        graph: Adjacency list representation of the graph.
        start: The starting vertex.
        target: The target vertex.

    Returns:
        A list representing the shortest path, or None if no path exists.
    """
    if start == target:
        return [start]

    visited = {start}
    queue = deque([(start, [start])])

    while queue:
        vertex, path = queue.popleft()
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                new_path = path + [neighbor]
                if neighbor == target:
                    return new_path
                visited.add(neighbor)
                queue.append((neighbor, new_path))

    return None


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
    print("BFS traversal:", bfs(graph, "A"))
    print("Shortest path A -> F:", bfs_shortest_path(graph, "A", "F"))`,
    javascript: `/**
 * Perform breadth-first search on a graph.
 *
 * @param {Object} graph - Adjacency list representation (e.g., { A: ['B','C'], ... }).
 * @param {string} start - The starting vertex.
 * @returns {string[]} Vertices in the order they were visited.
 */
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  let front = 0;

  while (front < queue.length) {
    const vertex = queue[front++];
    order.push(vertex);
    for (const neighbor of graph[vertex] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}

/**
 * Find the shortest path (fewest edges) between start and target using BFS.
 *
 * @param {Object} graph - Adjacency list representation.
 * @param {string} start - The starting vertex.
 * @param {string} target - The target vertex.
 * @returns {string[]|null} The shortest path as an array, or null if no path exists.
 */
function bfsShortestPath(graph, start, target) {
  if (start === target) return [start];

  const visited = new Set([start]);
  const queue = [[start, [start]]];
  let front = 0;

  while (front < queue.length) {
    const [vertex, path] = queue[front++];
    for (const neighbor of graph[vertex] || []) {
      if (!visited.has(neighbor)) {
        const newPath = [...path, neighbor];
        if (neighbor === target) return newPath;
        visited.add(neighbor);
        queue.push([neighbor, newPath]);
      }
    }
  }

  return null;
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
console.log("BFS traversal:", bfs(graph, "A"));
console.log("Shortest path A -> F:", bfsShortestPath(graph, "A", "F"));`,
  },
  useCases: [
    "Finding the shortest path in unweighted graphs (e.g., social network degrees of separation)",
    "Level-order traversal of trees and hierarchical structures",
    "Testing whether a graph is bipartite (two-colorable)",
    "Web crawlers exploring pages layer by layer from a seed URL",
    "Solving puzzles with the fewest moves, such as the 15-puzzle or Rubik's Cube states",
  ],
  relatedAlgorithms: [
    "dfs",
    "dijkstras-algorithm",
    "a-star",
    "bidirectional-bfs",
    "level-order-traversal",
  ],
  glossaryTerms: [
    "graph traversal",
    "adjacency list",
    "queue",
    "shortest path",
    "unweighted graph",
    "bipartite graph",
    "level-order",
  ],
  tags: [
    "searching",
    "graph",
    "traversal",
    "breadth-first",
    "queue",
    "shortest-path",
    "intermediate",
    "unweighted",
  ],
};
