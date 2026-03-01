import type {
  VisualizationStep,
  HighlightColor,
} from "@/lib/visualization/types";

export interface AStarStepData {
  grid: (number | string | null)[][];
  cellHighlights: Record<string, HighlightColor>;
  currentCell?: [number, number];
  openSet: [number, number][];
  closedSet: [number, number][];
  path: [number, number][];
  gValues: Record<string, number>;
  fValues: Record<string, number>;
  start: [number, number];
  goal: [number, number];
}

function cellKey(r: number, c: number): string {
  return `${r}-${c}`;
}

function manhattan(a: [number, number], b: [number, number]): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// Default 8x8 grid with obstacles (1 = obstacle, 0 = walkable)
export const DEFAULT_GRID: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
];

export const DEFAULT_START: [number, number] = [0, 0];
export const DEFAULT_GOAL: [number, number] = [7, 7];

const DIRECTIONS: [number, number][] = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
];

function buildHighlights(
  grid: number[][],
  openSet: Map<string, [number, number]>,
  closedSet: Set<string>,
  path: [number, number][],
  start: [number, number],
  goal: [number, number],
): Record<string, HighlightColor> {
  const highlights: Record<string, HighlightColor> = {};
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = cellKey(r, c);
      if (grid[r][c] === 1) {
        highlights[key] = "swapping"; // obstacles in red
      }
    }
  }

  // Closed set (visited)
  closedSet.forEach((key) => {
    if (highlights[key] !== "swapping") {
      highlights[key] = "completed";
    }
  });

  // Open set (frontier)
  openSet.forEach((_pos, key) => {
    if (highlights[key] !== "swapping") {
      highlights[key] = "comparing";
    }
  });

  // Path
  for (const [r, c] of path) {
    const key = cellKey(r, c);
    highlights[key] = "path";
  }

  // Start and goal
  highlights[cellKey(start[0], start[1])] = "active";
  highlights[cellKey(goal[0], goal[1])] = "selected";

  return highlights;
}

function buildGridDisplay(
  grid: number[][],
  fValues: Record<string, number>,
): (number | string | null)[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const display: (number | string | null)[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: (number | string | null)[] = [];
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        row.push("X");
      } else {
        const f = fValues[cellKey(r, c)];
        row.push(f !== undefined && f < Infinity ? f : null);
      }
    }
    display.push(row);
  }

  return display;
}

export function generateAStarSteps(
  grid: number[][] = DEFAULT_GRID,
  start: [number, number] = DEFAULT_START,
  goal: [number, number] = DEFAULT_GOAL,
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const cameFrom: Record<string, string> = {};

  // Initialize
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = cellKey(r, c);
      gScore[key] = Infinity;
      fScore[key] = Infinity;
    }
  }

  const startKey = cellKey(start[0], start[1]);
  gScore[startKey] = 0;
  fScore[startKey] = manhattan(start, goal);

  // Open set: Map<key, [r, c]>
  const openSet = new Map<string, [number, number]>();
  openSet.set(startKey, start);

  const closedSet = new Set<string>();

  // Initial step
  steps.push({
    id: stepId++,
    description: `Initialize A* search from (${start[0]},${start[1]}) to (${goal[0]},${goal[1]}). Set g(start)=0, h(start)=${manhattan(start, goal)}, f(start)=${manhattan(start, goal)}. The heuristic is Manhattan distance.`,
    action: "highlight",
    highlights: [],
    data: {
      grid: buildGridDisplay(grid, fScore),
      cellHighlights: buildHighlights(grid, openSet, closedSet, [], start, goal),
      currentCell: start,
      openSet: Array.from(openSet.values()),
      closedSet: [],
      path: [],
      gValues: { ...gScore },
      fValues: { ...fScore },
      start,
      goal,
    } satisfies AStarStepData,
  });

  let pathFound = false;

  while (openSet.size > 0) {
    // Pick node with lowest f-value from open set
    let currentKey = "";
    let currentPos: [number, number] = [0, 0];
    let lowestF = Infinity;

    openSet.forEach((pos, key) => {
      if (fScore[key] < lowestF) {
        lowestF = fScore[key];
        currentKey = key;
        currentPos = pos;
      }
    });

    // Remove from open set
    openSet.delete(currentKey);

    steps.push({
      id: stepId++,
      description: `Select node (${currentPos[0]},${currentPos[1]}) from the open set with the lowest f-value = ${fScore[currentKey]}  [g=${gScore[currentKey]}, h=${fScore[currentKey] - gScore[currentKey]}]. Move it to the closed set.`,
      action: "visit",
      highlights: [],
      data: {
        grid: buildGridDisplay(grid, fScore),
        cellHighlights: buildHighlights(grid, openSet, closedSet, [], start, goal),
        currentCell: currentPos,
        openSet: Array.from(openSet.values()),
        closedSet: Array.from(closedSet).map((k) => k.split("-").map(Number) as [number, number]),
        path: [],
        gValues: { ...gScore },
        fValues: { ...fScore },
        start,
        goal,
      } satisfies AStarStepData,
    });

    // Check if we reached the goal
    if (currentPos[0] === goal[0] && currentPos[1] === goal[1]) {
      // Reconstruct path
      const path: [number, number][] = [];
      let traceKey = currentKey;
      while (traceKey) {
        const [r, c] = traceKey.split("-").map(Number);
        path.unshift([r, c]);
        traceKey = cameFrom[traceKey];
      }

      steps.push({
        id: stepId++,
        description: `Goal reached at (${goal[0]},${goal[1]})! Reconstructing path. Path length: ${path.length} cells, total cost: ${gScore[currentKey]}.`,
        action: "complete",
        highlights: [],
        data: {
          grid: buildGridDisplay(grid, fScore),
          cellHighlights: buildHighlights(grid, openSet, closedSet, path, start, goal),
          currentCell: goal,
          openSet: [],
          closedSet: Array.from(closedSet).map((k) => k.split("-").map(Number) as [number, number]),
          path,
          gValues: { ...gScore },
          fValues: { ...fScore },
          start,
          goal,
        } satisfies AStarStepData,
      });

      pathFound = true;
      break;
    }

    closedSet.add(currentKey);

    // Expand neighbors
    for (const [dr, dc] of DIRECTIONS) {
      const nr = currentPos[0] + dr;
      const nc = currentPos[1] + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] === 1) continue; // obstacle

      const neighborKey = cellKey(nr, nc);
      if (closedSet.has(neighborKey)) continue;

      const tentativeG = gScore[currentKey] + 1;

      if (tentativeG < gScore[neighborKey]) {
        cameFrom[neighborKey] = currentKey;
        gScore[neighborKey] = tentativeG;
        const h = manhattan([nr, nc], goal);
        fScore[neighborKey] = tentativeG + h;

        if (!openSet.has(neighborKey)) {
          openSet.set(neighborKey, [nr, nc]);
        }

        steps.push({
          id: stepId++,
          description: `Update neighbor (${nr},${nc}): g=${tentativeG}, h=${h}, f=${tentativeG + h}. ${tentativeG < Infinity ? `Improved from f=${fScore[neighborKey] === tentativeG + h ? "new" : "previous"}.` : ""} Added to open set.`,
          action: "relax-edge",
          highlights: [],
          data: {
            grid: buildGridDisplay(grid, fScore),
            cellHighlights: buildHighlights(grid, openSet, closedSet, [], start, goal),
            currentCell: [nr, nc],
            openSet: Array.from(openSet.values()),
            closedSet: Array.from(closedSet).map((k) => k.split("-").map(Number) as [number, number]),
            path: [],
            gValues: { ...gScore },
            fValues: { ...fScore },
            start,
            goal,
          } satisfies AStarStepData,
        });
      }
    }
  }

  if (!pathFound) {
    steps.push({
      id: stepId++,
      description: `No path found from (${start[0]},${start[1]}) to (${goal[0]},${goal[1]}). All reachable nodes have been explored.`,
      action: "complete",
      highlights: [],
      data: {
        grid: buildGridDisplay(grid, fScore),
        cellHighlights: buildHighlights(grid, openSet, closedSet, [], start, goal),
        openSet: [],
        closedSet: Array.from(closedSet).map((k) => k.split("-").map(Number) as [number, number]),
        path: [],
        gValues: { ...gScore },
        fValues: { ...fScore },
        start,
        goal,
      } satisfies AStarStepData,
    });
  }

  return steps;
}
