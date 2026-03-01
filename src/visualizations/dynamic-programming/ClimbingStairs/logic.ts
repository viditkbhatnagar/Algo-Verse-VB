import type { VisualizationStep, MatrixStepData, HighlightColor } from "@/lib/visualization/types";

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function generateClimbingStairsSteps(n: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const dp: number[] = new Array(n + 1).fill(0);
  let filledUpTo = -1;

  // Column headers: step indices 0..n
  const colHeaders = Array.from({ length: n + 1 }, (_, i) => String(i));

  // Helper to build the current 1-row matrix from dp state
  function buildMatrix(): (number | string | null)[][] {
    return [dp.map((v, i) => (i <= filledUpTo ? v : null))];
  }

  // Step 0: Initialize
  steps.push({
    id: stepId++,
    description: `Climbing Stairs: How many distinct ways to climb ${n} steps (taking 1 or 2 steps at a time)? Recurrence: dp[i] = dp[i-1] + dp[i-2].`,
    action: "highlight",
    highlights: [],
    data: {
      matrix: [new Array(n + 1).fill(null)],
      cellHighlights: {},
      colHeaders,
    } satisfies MatrixStepData,
  });

  // Base case dp[0] = 1
  dp[0] = 1;
  filledUpTo = 0;
  steps.push({
    id: stepId++,
    description: `Base case: dp[0] = 1. There is exactly 1 way to stand at the ground (do nothing).`,
    action: "fill-cell",
    highlights: [{ indices: [0], color: "active" }],
    data: {
      matrix: buildMatrix(),
      cellHighlights: { [cellKey(0, 0)]: "active" as HighlightColor },
      colHeaders,
      currentCell: [0, 0] as [number, number],
    } satisfies MatrixStepData,
  });

  // Base case dp[1] = 1
  if (n >= 1) {
    dp[1] = 1;
    filledUpTo = 1;
    steps.push({
      id: stepId++,
      description: `Base case: dp[1] = 1. There is exactly 1 way to reach step 1 (take one step from ground).`,
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
    // Show dependencies
    const depHighlights: Record<string, HighlightColor> = {};
    for (let j = 0; j < i - 2; j++) {
      depHighlights[cellKey(0, j)] = "completed";
    }
    depHighlights[cellKey(0, i - 2)] = "comparing";
    depHighlights[cellKey(0, i - 1)] = "comparing";

    steps.push({
      id: stepId++,
      description: `Computing dp[${i}]: Ways to reach step ${i} = ways to reach step ${i - 1} (then take 1 step) + ways to reach step ${i - 2} (then take 2 steps). dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}.`,
      action: "compare",
      highlights: [{ indices: [i - 1, i - 2], color: "comparing" }],
      data: {
        matrix: buildMatrix(),
        cellHighlights: depHighlights,
        colHeaders,
        arrows: [
          { from: [0, i - 1], to: [0, i], label: `+1 step` },
          { from: [0, i - 2], to: [0, i], label: `+2 steps` },
        ],
      } satisfies MatrixStepData,
    });

    // Fill cell
    dp[i] = dp[i - 1] + dp[i - 2];
    filledUpTo = i;

    const fillHighlights: Record<string, HighlightColor> = {};
    for (let j = 0; j < i; j++) {
      fillHighlights[cellKey(0, j)] = "completed";
    }
    fillHighlights[cellKey(0, i)] = "active";

    steps.push({
      id: stepId++,
      description: `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. There are ${dp[i]} distinct ways to reach step ${i}.`,
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

  // Final result
  const finalHighlights: Record<string, HighlightColor> = {};
  for (let j = 0; j <= n; j++) {
    finalHighlights[cellKey(0, j)] = "completed";
  }
  finalHighlights[cellKey(0, n)] = "selected";

  steps.push({
    id: stepId++,
    description: `There are ${dp[n]} distinct ways to climb ${n} stairs. The problem is equivalent to computing the ${n + 1}th Fibonacci number.`,
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
