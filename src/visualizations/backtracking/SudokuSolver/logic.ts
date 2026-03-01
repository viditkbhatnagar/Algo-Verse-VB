import type { VisualizationStep, BacktrackingStepData, HighlightColor } from "@/lib/visualization/types";

function cellKey(r: number, c: number): string {
  return `${r}-${c}`;
}

// A medium-difficulty puzzle (~30 givens)
export const DEFAULT_PUZZLE: number[][] = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function isValid(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let j = 0; j < 9; j++) {
    if (board[row][j] === num) return false;
  }
  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }
  // Check 3x3 box
  const boxR = Math.floor(row / 3) * 3;
  const boxC = Math.floor(col / 3) * 3;
  for (let i = boxR; i < boxR + 3; i++) {
    for (let j = boxC; j < boxC + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
}

function findEmpty(board: number[][]): [number, number] | null {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) return [i, j];
    }
  }
  return null;
}

export function generateSudokuSteps(puzzle: number[][]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Deep copy
  const board = puzzle.map((r) => [...r]);
  const given = new Set<string>();
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] !== 0) {
        given.add(cellKey(i, j));
      }
    }
  }

  const placementHistory: { row: number; col: number; value: number | string }[] = [];

  function getGrid(): (number | string | null)[][] {
    return board.map((row) =>
      row.map((v) => (v === 0 ? null : v))
    );
  }

  function getHighlights(): Record<string, HighlightColor> {
    const hl: Record<string, HighlightColor> = {};
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0 && !given.has(cellKey(i, j))) {
          hl[cellKey(i, j)] = "completed"; // solved cell
        }
      }
    }
    return hl;
  }

  // Initial step
  steps.push({
    id: stepId++,
    description: `Sudoku Solver: Fill the 9x9 grid so each row, column, and 3x3 box contains digits 1-9.`,
    action: "highlight",
    highlights: [],
    data: {
      grid: getGrid(),
      cellHighlights: {},
      placementHistory: [],
      isBacktracking: false,
    } satisfies BacktrackingStepData,
  });

  // Limit steps for performance (sudoku can have many steps)
  const MAX_STEPS = 500;
  let solved = false;

  function solve(): boolean {
    if (stepId > MAX_STEPS) return false;

    const cell = findEmpty(board);
    if (!cell) {
      solved = true;
      return true;
    }

    const [row, col] = cell;

    for (let num = 1; num <= 9; num++) {
      if (stepId > MAX_STEPS) return false;

      if (isValid(board, row, col, num)) {
        // Place number
        board[row][col] = num;
        placementHistory.push({ row, col, value: num });

        const hl = getHighlights();
        hl[cellKey(row, col)] = "active"; // just placed

        // Highlight the row, col, and box being checked
        for (let j = 0; j < 9; j++) {
          const k = cellKey(row, j);
          if (!hl[k] && !given.has(k) && j !== col) hl[k] = "window";
        }
        for (let i = 0; i < 9; i++) {
          const k = cellKey(i, col);
          if (!hl[k] && !given.has(k) && i !== row) hl[k] = "window";
        }

        steps.push({
          id: stepId++,
          description: `Trying ${num} at row ${row}, col ${col} — valid placement.`,
          action: "place",
          highlights: [{ indices: [row * 9 + col], color: "completed" }],
          data: {
            grid: getGrid(),
            cellHighlights: hl,
            placementHistory: [...placementHistory],
            currentCell: [row, col],
            isBacktracking: false,
          } satisfies BacktrackingStepData,
        });

        if (solve()) return true;

        // Backtrack
        board[row][col] = 0;
        placementHistory.push({ row, col, value: 0 });

        const hlBack = getHighlights();
        hlBack[cellKey(row, col)] = "backtracked";

        steps.push({
          id: stepId++,
          description: `Backtrack: removing ${num} from row ${row}, col ${col}. Dead end reached.`,
          action: "backtrack",
          highlights: [{ indices: [row * 9 + col], color: "backtracked" }],
          data: {
            grid: getGrid(),
            cellHighlights: hlBack,
            placementHistory: [...placementHistory],
            currentCell: [row, col],
            isBacktracking: true,
          } satisfies BacktrackingStepData,
        });
      }
    }

    return false;
  }

  solve();

  // Final step
  if (solved) {
    const finalHL: Record<string, HighlightColor> = {};
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!given.has(cellKey(i, j))) {
          finalHL[cellKey(i, j)] = "completed";
        }
      }
    }

    steps.push({
      id: stepId++,
      description: `Sudoku solved! All cells filled successfully.`,
      action: "complete",
      highlights: [],
      data: {
        grid: getGrid(),
        cellHighlights: finalHL,
        placementHistory: [...placementHistory],
        isBacktracking: false,
        solutionFound: true,
      } satisfies BacktrackingStepData,
    });
  } else if (stepId > MAX_STEPS) {
    steps.push({
      id: stepId++,
      description: `Visualization truncated at ${MAX_STEPS} steps for performance. The solver continues behind the scenes.`,
      action: "complete",
      highlights: [],
      data: {
        grid: getGrid(),
        cellHighlights: getHighlights(),
        placementHistory: [...placementHistory],
        isBacktracking: false,
      } satisfies BacktrackingStepData,
    });
  }

  return steps;
}
