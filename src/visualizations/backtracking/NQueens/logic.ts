import type { VisualizationStep, BacktrackingStepData, HighlightColor } from "@/lib/visualization/types";

function cellKey(r: number, c: number): string {
  return `${r}-${c}`;
}

export function generateNQueensSteps(n: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Grid: 0 = empty, 1 = queen
  const grid: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const queens: number[] = []; // queens[row] = col
  const cols = new Set<number>();
  const diag1 = new Set<number>(); // row - col
  const diag2 = new Set<number>(); // row + col
  const placementHistory: { row: number; col: number; value: number }[] = [];

  function getAttackedCells(): Record<string, HighlightColor> {
    const highlights: Record<string, HighlightColor> = {};

    for (let qr = 0; qr < queens.length; qr++) {
      const qc = queens[qr];
      highlights[cellKey(qr, qc)] = "completed"; // queen position

      // Mark attacked cells
      for (let i = 0; i < n; i++) {
        // Same row (but queens are 1 per row, so mainly for viz)
        if (i !== qc) {
          const k = cellKey(qr, i);
          if (!highlights[k]) highlights[k] = "window";
        }
        // Same column
        if (i !== qr) {
          const k = cellKey(i, qc);
          if (!highlights[k]) highlights[k] = "window";
        }
      }
      // Diagonals
      for (let d = 1; d < n; d++) {
        const positions = [
          [qr - d, qc - d],
          [qr - d, qc + d],
          [qr + d, qc - d],
          [qr + d, qc + d],
        ];
        for (const [r, c] of positions) {
          if (r >= 0 && r < n && c >= 0 && c < n) {
            const k = cellKey(r, c);
            if (!highlights[k]) highlights[k] = "window";
          }
        }
      }
    }
    return highlights;
  }

  function getGrid(): (number | string | null)[][] {
    return grid.map((row) => row.map((v) => (v === 1 ? 1 : null)));
  }

  // Initial step
  steps.push({
    id: stepId++,
    description: `N-Queens Problem: Place ${n} queens on a ${n}x${n} chessboard with no conflicts.`,
    action: "highlight",
    highlights: [],
    data: {
      grid: getGrid(),
      cellHighlights: {},
      placementHistory: [],
      isBacktracking: false,
    } satisfies BacktrackingStepData,
  });

  let solved = false;

  function solve(row: number): boolean {
    if (row === n) {
      solved = true;
      return true;
    }

    for (let col = 0; col < n; col++) {
      // Try placing queen
      const isConflict =
        cols.has(col) || diag1.has(row - col) || diag2.has(row + col);

      if (isConflict) {
        // Show that this position is attacked
        const hl = getAttackedCells();
        hl[cellKey(row, col)] = "swapping"; // conflict marker

        steps.push({
          id: stepId++,
          description: `Row ${row}, Col ${col}: Conflict detected — position is under attack. Skipping.`,
          action: "compare",
          highlights: [{ indices: [row * n + col], color: "swapping" }],
          data: {
            grid: getGrid(),
            cellHighlights: hl,
            placementHistory: [...placementHistory],
            currentCell: [row, col],
            isBacktracking: false,
          } satisfies BacktrackingStepData,
        });
        continue;
      }

      // Place queen
      grid[row][col] = 1;
      queens.push(col);
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      placementHistory.push({ row, col, value: 1 });

      const hlPlace = getAttackedCells();
      hlPlace[cellKey(row, col)] = "active"; // just placed

      steps.push({
        id: stepId++,
        description: `Row ${row}, Col ${col}: Safe! Placing queen #${queens.length}.`,
        action: "place",
        highlights: [{ indices: [row * n + col], color: "completed" }],
        data: {
          grid: getGrid(),
          cellHighlights: hlPlace,
          placementHistory: [...placementHistory],
          currentCell: [row, col],
          isBacktracking: false,
        } satisfies BacktrackingStepData,
      });

      if (solve(row + 1)) {
        return true;
      }

      // Backtrack
      grid[row][col] = 0;
      queens.pop();
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
      placementHistory.push({ row, col, value: 0 });

      const hlBack = getAttackedCells();
      hlBack[cellKey(row, col)] = "backtracked";

      steps.push({
        id: stepId++,
        description: `Backtracking: Removing queen from row ${row}, col ${col}. No valid column found ahead.`,
        action: "backtrack",
        highlights: [{ indices: [row * n + col], color: "backtracked" }],
        data: {
          grid: getGrid(),
          cellHighlights: hlBack,
          placementHistory: [...placementHistory],
          currentCell: [row, col],
          isBacktracking: true,
        } satisfies BacktrackingStepData,
      });
    }

    return false;
  }

  solve(0);

  // Final step
  if (solved) {
    const finalHL = getAttackedCells();
    // Override: only show queens as completed
    const queenHL: Record<string, HighlightColor> = {};
    for (let r = 0; r < n; r++) {
      queenHL[cellKey(r, queens[r])] = "completed";
    }

    steps.push({
      id: stepId++,
      description: `Solution found! All ${n} queens placed safely. Queens at columns: [${queens.join(", ")}]`,
      action: "complete",
      highlights: [],
      data: {
        grid: getGrid(),
        cellHighlights: queenHL,
        placementHistory: [...placementHistory],
        isBacktracking: false,
        solutionFound: true,
      } satisfies BacktrackingStepData,
    });
  }

  return steps;
}
