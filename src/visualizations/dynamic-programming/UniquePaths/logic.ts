import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";

export interface UniquePathsStepData {
  grid: (number | string | null)[][];
  cellHighlights: Record<string, HighlightColor>;
  currentCell?: [number, number];
  rows: number;
  cols: number;
}

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function generateUniquePathsSteps(
  rows: number,
  cols: number
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Initialize grid with nulls
  const grid: (number | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  // Helper to snapshot grid
  function snapshotGrid(): (number | string | null)[][] {
    return grid.map((row) => row.map((v) => v));
  }

  // Initial step
  steps.push({
    id: stepId++,
    description: `Computing Unique Paths in a ${rows}x${cols} grid. Movement allowed: right or down only. Goal: count paths from top-left to bottom-right.`,
    action: "highlight",
    highlights: [],
    data: {
      grid: snapshotGrid(),
      cellHighlights: {},
      rows,
      cols,
    } as UniquePathsStepData,
  });

  // Fill first row (base case)
  for (let j = 0; j < cols; j++) {
    grid[0][j] = 1;
    const highlights: Record<string, HighlightColor> = {};
    highlights[cellKey(0, j)] = "active";
    // Mark previously filled first row cells as completed
    for (let k = 0; k < j; k++) {
      highlights[cellKey(0, k)] = "completed";
    }

    steps.push({
      id: stepId++,
      description: `Base case: dp[0][${j}] = 1. Only one way to reach any cell in the first row (move right repeatedly).`,
      action: "fill-cell",
      highlights: [{ indices: [0, j], color: "active" }],
      data: {
        grid: snapshotGrid(),
        cellHighlights: highlights,
        currentCell: [0, j] as [number, number],
        rows,
        cols,
      } as UniquePathsStepData,
      variables: { i: 0, j, value: 1 },
    });
  }

  // Fill first column (base case)
  for (let i = 1; i < rows; i++) {
    grid[i][0] = 1;
    const highlights: Record<string, HighlightColor> = {};
    highlights[cellKey(i, 0)] = "active";
    // Mark first row as completed
    for (let k = 0; k < cols; k++) {
      highlights[cellKey(0, k)] = "completed";
    }
    // Mark previously filled first column cells as completed
    for (let k = 1; k < i; k++) {
      highlights[cellKey(k, 0)] = "completed";
    }

    steps.push({
      id: stepId++,
      description: `Base case: dp[${i}][0] = 1. Only one way to reach any cell in the first column (move down repeatedly).`,
      action: "fill-cell",
      highlights: [{ indices: [i, 0], color: "active" }],
      data: {
        grid: snapshotGrid(),
        cellHighlights: highlights,
        currentCell: [i, 0] as [number, number],
        rows,
        cols,
      } as UniquePathsStepData,
      variables: { i, j: 0, value: 1 },
    });
  }

  // Fill the rest of the grid
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const fromAbove = grid[i - 1][j]!;
      const fromLeft = grid[i][j - 1]!;
      grid[i][j] = fromAbove + fromLeft;

      const highlights: Record<string, HighlightColor> = {};
      // Mark all previously filled cells as completed
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] !== null && !(r === i && c === j)) {
            highlights[cellKey(r, c)] = "completed";
          }
        }
      }
      // Highlight the two source cells
      highlights[cellKey(i - 1, j)] = "comparing";
      highlights[cellKey(i, j - 1)] = "comparing";
      // Highlight the current cell
      highlights[cellKey(i, j)] = "active";

      steps.push({
        id: stepId++,
        description: `dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i}][${j - 1}] = ${fromAbove} + ${fromLeft} = ${grid[i][j]}. Paths from above + paths from left.`,
        action: "fill-cell",
        highlights: [{ indices: [i, j], color: "active" }],
        data: {
          grid: snapshotGrid(),
          cellHighlights: highlights,
          currentCell: [i, j] as [number, number],
          rows,
          cols,
        } as UniquePathsStepData,
        variables: { i, j, fromAbove, fromLeft, value: grid[i][j] },
      });
    }
  }

  // Final result
  const finalHighlights: Record<string, HighlightColor> = {};
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      finalHighlights[cellKey(r, c)] = "completed";
    }
  }
  // Highlight the result cell
  finalHighlights[cellKey(rows - 1, cols - 1)] = "path";
  // Highlight the start cell
  finalHighlights[cellKey(0, 0)] = "path";

  steps.push({
    id: stepId++,
    description: `Unique Paths complete! There are ${grid[rows - 1][cols - 1]} unique paths from (0,0) to (${rows - 1},${cols - 1}) in a ${rows}x${cols} grid.`,
    action: "complete",
    highlights: [],
    data: {
      grid: snapshotGrid(),
      cellHighlights: finalHighlights,
      rows,
      cols,
    } as UniquePathsStepData,
    variables: { answer: grid[rows - 1][cols - 1] },
  });

  return steps;
}
