import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const aStar: AlgorithmMetadata = {
  id: "a-star",
  name: "A* Search",
  category: "graph",
  subcategory: "Shortest Path",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(E)",
    average: "O(E log V)",
    worst: "O(V^2)",
    note: "With a consistent heuristic and binary heap, A* expands O(V) nodes in the worst case. The effective performance depends heavily on the quality of the heuristic function.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Stores the open set (priority queue), closed set, and g/f values for each explored node.",
  },
  description: `A* (pronounced "A-star") is a best-first graph search algorithm that finds the shortest path between a start node and a goal node. It was first described in 1968 by Peter Hart, Nils Nilsson, and Bertram Raphael. A* is widely regarded as the gold standard for pathfinding in games, robotics, and AI planning because it is both complete (it always finds a solution if one exists) and optimal (it finds the shortest path) when given an admissible heuristic.

The key insight behind A* is the evaluation function f(n) = g(n) + h(n), where g(n) is the actual cost from the start to node n, and h(n) is a heuristic estimate of the cost from n to the goal. The heuristic must be admissible, meaning it never overestimates the true cost. Common heuristics include Manhattan distance for grid-based pathfinding and Euclidean distance for geometric spaces.

A* maintains two sets: an open set of nodes to be evaluated (implemented as a priority queue ordered by f-value) and a closed set of already-evaluated nodes. At each step, the node with the lowest f-value is selected from the open set, its neighbors are examined, and their g-values are updated if a shorter path is found. When the goal node is extracted from the open set, the algorithm terminates with the optimal path.

Compared to Dijkstra's algorithm, A* is more efficient because the heuristic guides the search toward the goal, reducing the number of nodes that need to be explored. If h(n) = 0 for all nodes, A* degenerates to Dijkstra's algorithm. If h(n) is the exact cost, only nodes on the optimal path are expanded. A* is used extensively in video game pathfinding, robotic navigation, route planning in maps, and puzzle solving (like the 15-puzzle or Rubik's Cube).`,
  shortDescription:
    "An informed search algorithm that uses a heuristic function f(n) = g(n) + h(n) to efficiently find the shortest path from a start node to a goal node.",
  pseudocode: `function AStar(start, goal, heuristic):
    openSet = MinPriorityQueue()   // ordered by f-value
    openSet.insert(start, 0)

    cameFrom = {}                  // predecessor map
    gScore = { start: 0 }         // cost from start to node
    fScore = { start: h(start) }  // estimated total cost

    closedSet = {}

    while openSet is not empty:
        current = openSet.extractMin()

        if current == goal:
            return reconstructPath(cameFrom, current)

        closedSet.add(current)

        for each neighbor of current:
            if neighbor in closedSet:
                continue

            tentative_g = gScore[current] + cost(current, neighbor)

            if tentative_g < gScore[neighbor]:
                cameFrom[neighbor] = current
                gScore[neighbor] = tentative_g
                fScore[neighbor] = tentative_g + heuristic(neighbor, goal)

                if neighbor not in openSet:
                    openSet.insert(neighbor, fScore[neighbor])

    return FAILURE   // no path found`,
  implementations: {
    python: `import heapq
from typing import Dict, List, Tuple, Optional, Callable


def a_star(
    grid: List[List[int]],
    start: Tuple[int, int],
    goal: Tuple[int, int],
    heuristic: Callable[[Tuple[int, int], Tuple[int, int]], float] = None,
) -> Optional[List[Tuple[int, int]]]:
    """
    A* pathfinding on a 2D grid.

    Args:
        grid: 2D grid where 0 = walkable, 1 = obstacle
        start: (row, col) start position
        goal: (row, col) goal position
        heuristic: h(a, b) function; defaults to Manhattan distance

    Returns:
        List of (row, col) positions forming the shortest path, or None
    """
    if heuristic is None:
        heuristic = lambda a, b: abs(a[0] - b[0]) + abs(a[1] - b[1])

    rows, cols = len(grid), len(grid[0])

    open_set: List[Tuple[float, Tuple[int, int]]] = [(0, start)]
    came_from: Dict[Tuple[int, int], Tuple[int, int]] = {}
    g_score: Dict[Tuple[int, int], float] = {start: 0}
    closed_set: set = set()

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]

        if current in closed_set:
            continue
        closed_set.add(current)

        for dr, dc in directions:
            nr, nc = current[0] + dr, current[1] + dc
            neighbor = (nr, nc)

            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                if neighbor in closed_set:
                    continue

                tentative_g = g_score[current] + 1

                if tentative_g < g_score.get(neighbor, float('inf')):
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f_score, neighbor))

    return None  # No path found


# Example usage
if __name__ == "__main__":
    grid = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
    ]
    path = a_star(grid, (0, 0), (4, 4))
    print("Path:", path)`,
    javascript: `/**
 * A* Search on a 2D grid.
 *
 * @param {number[][]} grid - 2D grid (0 = walkable, 1 = obstacle)
 * @param {[number, number]} start - [row, col] start
 * @param {[number, number]} goal - [row, col] goal
 * @returns {[number, number][] | null} Shortest path or null
 */
function aStar(grid, start, goal) {
  const rows = grid.length;
  const cols = grid[0].length;
  const heuristic = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  const key = (r, c) => \`\${r},\${c}\`;

  const gScore = new Map();
  const fScore = new Map();
  const cameFrom = new Map();
  const closedSet = new Set();

  gScore.set(key(...start), 0);
  fScore.set(key(...start), heuristic(start, goal));

  // Simple priority queue (sorted array)
  const openSet = [{ pos: start, f: heuristic(start, goal) }];

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const { pos: current } = openSet.shift();
    const ck = key(...current);

    if (current[0] === goal[0] && current[1] === goal[1]) {
      const path = [current];
      let cur = ck;
      while (cameFrom.has(cur)) {
        cur = cameFrom.get(cur);
        path.push(cur.split(",").map(Number));
      }
      return path.reverse();
    }

    if (closedSet.has(ck)) continue;
    closedSet.add(ck);

    for (const [dr, dc] of directions) {
      const nr = current[0] + dr;
      const nc = current[1] + dc;
      const nk = key(nr, nc);

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] === 1 || closedSet.has(nk)) continue;

      const tentativeG = (gScore.get(ck) ?? Infinity) + 1;

      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, ck);
        gScore.set(nk, tentativeG);
        const f = tentativeG + heuristic([nr, nc], goal);
        fScore.set(nk, f);
        openSet.push({ pos: [nr, nc], f });
      }
    }
  }

  return null; // No path found
}

// Example usage
const grid = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0],
];
console.log(aStar(grid, [0, 0], [4, 4]));`,
  },
  useCases: [
    "Video game pathfinding — finding optimal paths for characters on tile-based maps",
    "Robotic navigation — planning collision-free paths through physical environments",
    "GPS and map routing — computing shortest driving or walking routes",
    "Puzzle solving — finding optimal solutions for sliding puzzles, Rubik's Cube, etc.",
    "Network routing — finding low-cost paths through communication networks",
  ],
  relatedAlgorithms: [
    "dijkstra",
    "bfs",
    "bellman-ford",
    "greedy-best-first",
  ],
  glossaryTerms: [
    "heuristic",
    "admissible heuristic",
    "f-value",
    "g-value",
    "h-value",
    "open set",
    "closed set",
    "Manhattan distance",
    "pathfinding",
  ],
  tags: [
    "graph",
    "shortest-path",
    "heuristic",
    "pathfinding",
    "informed-search",
    "priority-queue",
    "grid",
    "advanced",
  ],
};
