import type { VisualizationStep, MatrixStepData, HighlightColor } from "@/lib/visualization/types";

export function generateEditDistanceSteps(
  word1: string,
  word2: string
): VisualizationStep[] {
  const m = word1.length;
  const n = word2.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Initialize the DP table with nulls
  const dp: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(null)
  );

  const rowHeaders = ["", ...word1.split("")];
  const colHeaders = ["", ...word2.split("")];

  // Helper to snapshot the matrix as (number | string | null)[][]
  function snapshotMatrix(): (number | string | null)[][] {
    return dp.map((row) => row.map((v) => v));
  }

  // Initial step
  steps.push({
    id: stepId++,
    description: `Computing Edit Distance between "${word1}" and "${word2}". Building a ${m + 1}x${n + 1} DP table.`,
    action: "highlight",
    highlights: [],
    data: {
      matrix: snapshotMatrix(),
      cellHighlights: {},
      rowHeaders,
      colHeaders,
    } satisfies MatrixStepData,
  });

  // Fill base case: first column dp[i][0] = i (i deletions)
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
    const highlights: Record<string, HighlightColor> = {};
    highlights[`${i}-0`] = "active";
    // Mark previously filled base cells as completed
    for (let k = 0; k < i; k++) {
      highlights[`${k}-0`] = "completed";
    }

    steps.push({
      id: stepId++,
      description: `Base case: dp[${i}][0] = ${i}. Transforming "${word1.slice(0, i)}" to "" requires ${i} deletion${i !== 1 ? "s" : ""}.`,
      action: "fill-cell",
      highlights: [{ indices: [i, 0], color: "active" }],
      data: {
        matrix: snapshotMatrix(),
        cellHighlights: highlights,
        rowHeaders,
        colHeaders,
        currentCell: [i, 0] as [number, number],
      } satisfies MatrixStepData,
      variables: { i, j: 0, value: i },
    });
  }

  // Fill base case: first row dp[0][j] = j (j insertions)
  for (let j = 1; j <= n; j++) {
    dp[0][j] = j;
    const highlights: Record<string, HighlightColor> = {};
    highlights[`0-${j}`] = "active";
    // Mark first column as completed
    for (let k = 0; k <= m; k++) {
      highlights[`${k}-0`] = "completed";
    }
    // Mark previously filled first row cells as completed
    for (let k = 1; k < j; k++) {
      highlights[`0-${k}`] = "completed";
    }

    steps.push({
      id: stepId++,
      description: `Base case: dp[0][${j}] = ${j}. Transforming "" to "${word2.slice(0, j)}" requires ${j} insertion${j !== 1 ? "s" : ""}.`,
      action: "fill-cell",
      highlights: [{ indices: [0, j], color: "active" }],
      data: {
        matrix: snapshotMatrix(),
        cellHighlights: highlights,
        rowHeaders,
        colHeaders,
        currentCell: [0, j] as [number, number],
      } satisfies MatrixStepData,
      variables: { i: 0, j, value: j },
    });
  }

  // Fill the rest of the table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = word1[i - 1];
      const char2 = word2[j - 1];

      // Build highlights for cells we're referencing
      const refHighlights: Record<string, HighlightColor> = {};
      // Mark all previously completed cells
      for (let r = 0; r <= m; r++) {
        for (let c = 0; c <= n; c++) {
          if (dp[r][c] !== null && !(r === i && c === j)) {
            refHighlights[`${r}-${c}`] = "completed";
          }
        }
      }

      if (char1 === char2) {
        // Match: dp[i][j] = dp[i-1][j-1]
        dp[i][j] = dp[i - 1][j - 1]!;
        refHighlights[`${i}-${j}`] = "active";
        refHighlights[`${i - 1}-${j - 1}`] = "comparing";

        steps.push({
          id: stepId++,
          description: `Match! '${char1}' == '${char2}'. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]} (no operation needed).`,
          action: "fill-cell",
          highlights: [{ indices: [i, j], color: "active" }],
          data: {
            matrix: snapshotMatrix(),
            cellHighlights: refHighlights,
            rowHeaders,
            colHeaders,
            currentCell: [i, j] as [number, number],
            arrows: [{ from: [i - 1, j - 1], to: [i, j], label: "match" }],
          } satisfies MatrixStepData,
          variables: { i, j, char1, char2, operation: "match", value: dp[i][j] },
        });
      } else {
        // Mismatch: 1 + min(delete, insert, replace)
        const deleteCost = dp[i - 1][j]!;
        const insertCost = dp[i][j - 1]!;
        const replaceCost = dp[i - 1][j - 1]!;
        const minCost = Math.min(deleteCost, insertCost, replaceCost);
        dp[i][j] = 1 + minCost;

        // Determine which operation was chosen
        let operation: string;
        let arrow: { from: [number, number]; to: [number, number]; label?: string };
        if (minCost === replaceCost) {
          operation = "replace";
          arrow = { from: [i - 1, j - 1], to: [i, j], label: "replace" };
          refHighlights[`${i - 1}-${j - 1}`] = "swapping";
        } else if (minCost === deleteCost) {
          operation = "delete";
          arrow = { from: [i - 1, j], to: [i, j], label: "delete" };
          refHighlights[`${i - 1}-${j}`] = "swapping";
        } else {
          operation = "insert";
          arrow = { from: [i, j - 1], to: [i, j], label: "insert" };
          refHighlights[`${i}-${j - 1}`] = "swapping";
        }

        // Highlight all three source cells with comparing
        refHighlights[`${i - 1}-${j}`] = refHighlights[`${i - 1}-${j}`] === "swapping" ? "swapping" : "comparing";
        refHighlights[`${i}-${j - 1}`] = refHighlights[`${i}-${j - 1}`] === "swapping" ? "swapping" : "comparing";
        refHighlights[`${i - 1}-${j - 1}`] = refHighlights[`${i - 1}-${j - 1}`] === "swapping" ? "swapping" : "comparing";
        refHighlights[`${i}-${j}`] = "active";

        steps.push({
          id: stepId++,
          description: `Mismatch: '${char1}' != '${char2}'. dp[${i}][${j}] = 1 + min(del=${deleteCost}, ins=${insertCost}, rep=${replaceCost}) = ${dp[i][j]}. Best: ${operation}.`,
          action: "fill-cell",
          highlights: [{ indices: [i, j], color: "active" }],
          data: {
            matrix: snapshotMatrix(),
            cellHighlights: refHighlights,
            rowHeaders,
            colHeaders,
            currentCell: [i, j] as [number, number],
            arrows: [arrow],
          } satisfies MatrixStepData,
          variables: { i, j, char1, char2, operation, deleteCost, insertCost, replaceCost, value: dp[i][j] },
        });
      }
    }
  }

  // Backtrack to show optimal edit sequence
  const optimalPath: [number, number][] = [];
  const editOps: string[] = [];
  let bi = m;
  let bj = n;

  while (bi > 0 || bj > 0) {
    optimalPath.push([bi, bj]);
    if (bi > 0 && bj > 0 && word1[bi - 1] === word2[bj - 1]) {
      editOps.push(`Match '${word1[bi - 1]}'`);
      bi--;
      bj--;
    } else if (bi > 0 && bj > 0 && dp[bi][bj] === dp[bi - 1][bj - 1]! + 1) {
      editOps.push(`Replace '${word1[bi - 1]}' with '${word2[bj - 1]}'`);
      bi--;
      bj--;
    } else if (bj > 0 && dp[bi][bj] === dp[bi][bj - 1]! + 1) {
      editOps.push(`Insert '${word2[bj - 1]}'`);
      bj--;
    } else {
      editOps.push(`Delete '${word1[bi - 1]}'`);
      bi--;
    }
  }
  optimalPath.push([0, 0]);
  optimalPath.reverse();
  editOps.reverse();

  // Highlight the optimal path
  const pathHighlights: Record<string, HighlightColor> = {};
  for (let r = 0; r <= m; r++) {
    for (let c = 0; c <= n; c++) {
      pathHighlights[`${r}-${c}`] = "completed";
    }
  }
  for (const [r, c] of optimalPath) {
    pathHighlights[`${r}-${c}`] = "path";
  }

  steps.push({
    id: stepId++,
    description: `Edit Distance = ${dp[m][n]}. Optimal operations: ${editOps.join(" -> ")}.`,
    action: "backtrack",
    highlights: [],
    data: {
      matrix: snapshotMatrix(),
      cellHighlights: pathHighlights,
      rowHeaders,
      colHeaders,
      optimalPath,
    } satisfies MatrixStepData,
    variables: { editDistance: dp[m][n], operations: editOps },
  });

  return steps;
}
