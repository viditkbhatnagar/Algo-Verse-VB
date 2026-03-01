import type { VisualizationStep, MatrixStepData, HighlightColor } from "@/lib/visualization/types";

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

interface KnapsackItem {
  name: string;
  weight: number;
  value: number;
}

export interface KnapsackConfig {
  items: KnapsackItem[];
  capacity: number;
}

export const DEFAULT_KNAPSACK_CONFIG: KnapsackConfig = {
  items: [
    { name: "A", weight: 2, value: 3 },
    { name: "B", weight: 3, value: 4 },
    { name: "C", weight: 4, value: 5 },
    { name: "D", weight: 5, value: 6 },
  ],
  capacity: 7,
};

export function generateKnapsackSteps(
  config: KnapsackConfig = DEFAULT_KNAPSACK_CONFIG
): VisualizationStep[] {
  const { items, capacity } = config;
  const n = items.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Build the DP table: (n+1) rows x (capacity+1) cols
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  // Row headers: "0" (no items), then item names with weight/value
  const rowHeaders = ["0 (none)"];
  for (let i = 0; i < n; i++) {
    rowHeaders.push(`${items[i].name} (w=${items[i].weight},v=${items[i].value})`);
  }

  // Column headers: capacities 0..W
  const colHeaders = Array.from({ length: capacity + 1 }, (_, w) => `w=${w}`);

  // Helper to snapshot the current DP table
  function buildMatrix(): (number | string | null)[][] {
    return dp.map((row) => [...row]);
  }

  // Step 0: Initialize
  steps.push({
    id: stepId++,
    description: `0/1 Knapsack: ${n} items, capacity ${capacity}. Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i]] + value[i]). Building a ${n + 1} x ${capacity + 1} table.`,
    action: "highlight",
    highlights: [],
    data: {
      matrix: buildMatrix(),
      cellHighlights: {},
      rowHeaders,
      colHeaders,
    } satisfies MatrixStepData,
  });

  // Step 1: Show base case (row 0 is all zeros)
  const baseHighlights: Record<string, HighlightColor> = {};
  for (let w = 0; w <= capacity; w++) {
    baseHighlights[cellKey(0, w)] = "completed";
  }

  steps.push({
    id: stepId++,
    description: `Base case: Row 0 is all zeros. With 0 items, maximum value is always 0 regardless of capacity.`,
    action: "fill-cell",
    highlights: [],
    data: {
      matrix: buildMatrix(),
      cellHighlights: baseHighlights,
      rowHeaders,
      colHeaders,
    } satisfies MatrixStepData,
  });

  // Fill the table row by row
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];

    for (let w = 0; w <= capacity; w++) {
      // Option 1: exclude item i
      const excludeVal = dp[i - 1][w];

      // Option 2: include item i (if it fits)
      let includeVal = -1;
      const canInclude = item.weight <= w;
      if (canInclude) {
        includeVal = dp[i - 1][w - item.weight] + item.value;
      }

      // Show the comparison
      const compareHighlights: Record<string, HighlightColor> = {};
      // Mark previously completed cells
      for (let pi = 0; pi < i; pi++) {
        for (let pw = 0; pw <= capacity; pw++) {
          compareHighlights[cellKey(pi, pw)] = "completed";
        }
      }
      // Already filled cells in current row
      for (let pw = 0; pw < w; pw++) {
        compareHighlights[cellKey(i, pw)] = "completed";
      }

      // Highlight the cell above (exclude option)
      compareHighlights[cellKey(i - 1, w)] = "comparing";

      const arrows: { from: [number, number]; to: [number, number]; label?: string }[] = [
        { from: [i - 1, w], to: [i, w], label: `excl=${excludeVal}` },
      ];

      if (canInclude) {
        compareHighlights[cellKey(i - 1, w - item.weight)] = "comparing";
        arrows.push({
          from: [i - 1, w - item.weight],
          to: [i, w],
          label: `incl=${includeVal}`,
        });
      }

      // Mark current cell
      compareHighlights[cellKey(i, w)] = "active";

      const includeDesc = canInclude
        ? `Include ${item.name}: dp[${i - 1}][${w - item.weight}] + ${item.value} = ${includeVal}.`
        : `Cannot include ${item.name} (weight ${item.weight} > capacity ${w}).`;

      steps.push({
        id: stepId++,
        description: `Item ${item.name} (w=${item.weight}, v=${item.value}), capacity ${w}: Exclude: dp[${i - 1}][${w}] = ${excludeVal}. ${includeDesc}`,
        action: "compare",
        highlights: [],
        data: {
          matrix: buildMatrix(),
          cellHighlights: compareHighlights,
          rowHeaders,
          colHeaders,
          currentCell: [i, w] as [number, number],
          arrows,
        } satisfies MatrixStepData,
      });

      // Fill the cell
      dp[i][w] = canInclude ? Math.max(excludeVal, includeVal) : excludeVal;

      const fillHighlights: Record<string, HighlightColor> = {};
      for (let pi = 0; pi < i; pi++) {
        for (let pw = 0; pw <= capacity; pw++) {
          fillHighlights[cellKey(pi, pw)] = "completed";
        }
      }
      for (let pw = 0; pw <= w; pw++) {
        fillHighlights[cellKey(i, pw)] = pw === w ? "active" : "completed";
      }

      const decision = canInclude && includeVal > excludeVal
        ? `Include ${item.name} (${includeVal} > ${excludeVal})`
        : `Exclude ${item.name}`;

      steps.push({
        id: stepId++,
        description: `dp[${i}][${w}] = ${dp[i][w]}. Decision: ${decision}.`,
        action: "fill-cell",
        highlights: [],
        data: {
          matrix: buildMatrix(),
          cellHighlights: fillHighlights,
          rowHeaders,
          colHeaders,
          currentCell: [i, w] as [number, number],
        } satisfies MatrixStepData,
      });
    }
  }

  // Backtrack to find selected items
  const selectedItems: number[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(i - 1);
      w -= items[i - 1].weight;
    }
  }
  selectedItems.reverse();

  // Show backtracking path
  const backtrackHighlights: Record<string, HighlightColor> = {};
  for (let i = 0; i <= n; i++) {
    for (let ww = 0; ww <= capacity; ww++) {
      backtrackHighlights[cellKey(i, ww)] = "completed";
    }
  }

  // Highlight the optimal path
  const optimalPath: [number, number][] = [];
  w = capacity;
  optimalPath.push([n, w]);
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      w -= items[i - 1].weight;
    }
    optimalPath.push([i - 1, w]);
  }
  optimalPath.reverse();

  for (const [r, c] of optimalPath) {
    backtrackHighlights[cellKey(r, c)] = "path";
  }
  backtrackHighlights[cellKey(n, capacity)] = "selected";

  const selectedNames = selectedItems.map((i) => items[i].name).join(", ");
  const totalWeight = selectedItems.reduce((sum, i) => sum + items[i].weight, 0);
  const totalValue = dp[n][capacity];

  steps.push({
    id: stepId++,
    description: `Optimal value: ${totalValue}. Selected items: [${selectedNames}] with total weight ${totalWeight}/${capacity}. Backtrack path highlighted in purple.`,
    action: "complete",
    highlights: [],
    data: {
      matrix: buildMatrix(),
      cellHighlights: backtrackHighlights,
      rowHeaders,
      colHeaders,
      currentCell: [n, capacity] as [number, number],
      optimalPath,
    } satisfies MatrixStepData,
  });

  return steps;
}
