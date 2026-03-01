import type { VisualizationStep, MatrixStepData, HighlightColor } from "@/lib/visualization/types";

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function generateFibonacciSteps(n: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const dp: number[] = new Array(n + 1).fill(0);

  // Helper to build the current 1-row matrix from dp state
  function buildMatrix(): (number | string | null)[][] {
    return [dp.map((v, i) => (i <= filledUpTo ? v : null))];
  }

  let filledUpTo = -1;

  // Column headers: indices 0..n
  const colHeaders = Array.from({ length: n + 1 }, (_, i) => String(i));

  // Step 0: Initialize empty table
  steps.push({
    id: stepId++,
    description: `Initialize DP table of size ${n + 1} for computing Fibonacci(${n}). Recurrence: dp[i] = dp[i-1] + dp[i-2].`,
    action: "highlight",
    highlights: [],
    data: {
      matrix: [new Array(n + 1).fill(null)],
      cellHighlights: {},
      colHeaders,
    } satisfies MatrixStepData,
  });

  // Step 1: Set base case dp[0] = 0
  dp[0] = 0;
  filledUpTo = 0;
  steps.push({
    id: stepId++,
    description: `Base case: dp[0] = 0. The 0th Fibonacci number is 0.`,
    action: "fill-cell",
    highlights: [{ indices: [0], color: "active" }],
    data: {
      matrix: buildMatrix(),
      cellHighlights: { [cellKey(0, 0)]: "active" as HighlightColor },
      colHeaders,
      currentCell: [0, 0] as [number, number],
    } satisfies MatrixStepData,
  });

  // Step 2: Set base case dp[1] = 1
  if (n >= 1) {
    dp[1] = 1;
    filledUpTo = 1;
    steps.push({
      id: stepId++,
      description: `Base case: dp[1] = 1. The 1st Fibonacci number is 1.`,
      action: "fill-cell",
      highlights: [{ indices: [1], color: "active" }],
      data: {
        matrix: buildMatrix(),
        cellHighlights: {
          [cellKey(0, 0)]: "completed" as HighlightColor,
          [cellKey(0, 1)]: "active" as HighlightColor,
        },
        colHeaders,
        currentCell: [0, 1] as [number, number],
      } satisfies MatrixStepData,
    });
  }

  // Fill dp[2] through dp[n]
  for (let i = 2; i <= n; i++) {
    // Show which cells we're reading (dependencies)
    const depHighlights: Record<string, HighlightColor> = {};
    // Mark completed cells
    for (let j = 0; j < i - 2; j++) {
      depHighlights[cellKey(0, j)] = "completed";
    }
    // Mark the two dependency cells
    depHighlights[cellKey(0, i - 2)] = "comparing";
    depHighlights[cellKey(0, i - 1)] = "comparing";

    steps.push({
      id: stepId++,
      description: `Computing dp[${i}]: Reading dp[${i - 1}] = ${dp[i - 1]} and dp[${i - 2}] = ${dp[i - 2]}. Applying recurrence: dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}.`,
      action: "compare",
      highlights: [{ indices: [i - 1, i - 2], color: "comparing" }],
      data: {
        matrix: buildMatrix(),
        cellHighlights: depHighlights,
        colHeaders,
        arrows: [
          { from: [0, i - 1], to: [0, i], label: `${dp[i - 1]}` },
          { from: [0, i - 2], to: [0, i], label: `${dp[i - 2]}` },
        ],
      } satisfies MatrixStepData,
    });

    // Fill the cell
    dp[i] = dp[i - 1] + dp[i - 2];
    filledUpTo = i;

    const fillHighlights: Record<string, HighlightColor> = {};
    for (let j = 0; j < i; j++) {
      fillHighlights[cellKey(0, j)] = "completed";
    }
    fillHighlights[cellKey(0, i)] = "active";

    steps.push({
      id: stepId++,
      description: `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. Fibonacci(${i}) = ${dp[i]}.`,
      action: "fill-cell",
      highlights: [{ indices: [i], color: "active" }],
      data: {
        matrix: buildMatrix(),
        cellHighlights: fillHighlights,
        colHeaders,
        currentCell: [0, i] as [number, number],
      } satisfies MatrixStepData,
    });
  }

  // Final step: highlight the answer
  const finalHighlights: Record<string, HighlightColor> = {};
  for (let j = 0; j <= n; j++) {
    finalHighlights[cellKey(0, j)] = "completed";
  }
  finalHighlights[cellKey(0, n)] = "selected";

  steps.push({
    id: stepId++,
    description: `Fibonacci(${n}) = ${dp[n]}. The entire DP table has been filled using bottom-up tabulation in O(n) time.`,
    action: "complete",
    highlights: [{ indices: [n], color: "selected" }],
    data: {
      matrix: buildMatrix(),
      cellHighlights: finalHighlights,
      colHeaders,
      currentCell: [0, n] as [number, number],
    } satisfies MatrixStepData,
  });

  return steps;
}
