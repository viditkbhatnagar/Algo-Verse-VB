import type { VisualizationStep, MatrixStepData, HighlightColor } from "@/lib/visualization/types";

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export interface LCSConfig {
  str1: string;
  str2: string;
}

export const DEFAULT_LCS_CONFIG: LCSConfig = {
  str1: "ABCBDAB",
  str2: "BDCAB",
};

export function generateLCSSteps(
  str1: string = DEFAULT_LCS_CONFIG.str1,
  str2: string = DEFAULT_LCS_CONFIG.str2
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const m = str1.length;
  const n = str2.length;

  // Build DP table: (m+1) rows x (n+1) cols
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // Direction table for backtracking arrows
  const dir: string[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill("")
  );

  // Row headers: "" (empty), then characters of str1
  const rowHeaders = ["\"\"", ...str1.split("").map((c) => c)];

  // Column headers: "" (empty), then characters of str2
  const colHeaders = ["\"\"", ...str2.split("").map((c) => c)];

  // Helper to snapshot the DP table
  function buildMatrix(): (number | string | null)[][] {
    return dp.map((row) => [...row]);
  }

  // Step 0: Initialize
  steps.push({
    id: stepId++,
    description: `LCS of "${str1}" and "${str2}". Building a ${m + 1} x ${n + 1} DP table. Recurrence: if chars match, dp[i][j] = dp[i-1][j-1] + 1; else dp[i][j] = max(dp[i-1][j], dp[i][j-1]).`,
    action: "highlight",
    highlights: [],
    data: {
      matrix: buildMatrix(),
      cellHighlights: {},
      rowHeaders,
      colHeaders,
    } satisfies MatrixStepData,
  });

  // Step 1: Base cases (row 0 and col 0 are all zeros)
  const baseHighlights: Record<string, HighlightColor> = {};
  for (let i = 0; i <= m; i++) {
    baseHighlights[cellKey(i, 0)] = "completed";
  }
  for (let j = 0; j <= n; j++) {
    baseHighlights[cellKey(0, j)] = "completed";
  }

  steps.push({
    id: stepId++,
    description: `Base cases: Row 0 and Column 0 are all zeros. LCS of any string with an empty string is 0.`,
    action: "fill-cell",
    highlights: [],
    data: {
      matrix: buildMatrix(),
      cellHighlights: baseHighlights,
      rowHeaders,
      colHeaders,
    } satisfies MatrixStepData,
  });

  // Fill the table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = str1[i - 1];
      const char2 = str2[j - 1];
      const isMatch = char1 === char2;

      // Show comparison step
      const compareHighlights: Record<string, HighlightColor> = {};

      // Mark all previously completed cells
      for (let pi = 0; pi <= m; pi++) {
        for (let pj = 0; pj <= n; pj++) {
          if (pi === 0 || pj === 0) {
            compareHighlights[cellKey(pi, pj)] = "completed";
          } else if (pi < i || (pi === i && pj < j)) {
            compareHighlights[cellKey(pi, pj)] = "completed";
          }
        }
      }

      const arrows: { from: [number, number]; to: [number, number]; label?: string }[] = [];

      if (isMatch) {
        // Diagonal dependency
        compareHighlights[cellKey(i - 1, j - 1)] = "comparing";
        arrows.push({
          from: [i - 1, j - 1],
          to: [i, j],
          label: `+1 (match)`,
        });
      } else {
        // Up and left dependencies
        compareHighlights[cellKey(i - 1, j)] = "comparing";
        compareHighlights[cellKey(i, j - 1)] = "comparing";
        arrows.push(
          { from: [i - 1, j], to: [i, j], label: `up=${dp[i - 1][j]}` },
          { from: [i, j - 1], to: [i, j], label: `left=${dp[i][j - 1]}` }
        );
      }

      compareHighlights[cellKey(i, j)] = "active";

      const matchDesc = isMatch
        ? `Characters match: '${char1}' == '${char2}'. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i - 1][j - 1]} + 1.`
        : `No match: '${char1}' != '${char2}'. dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = max(${dp[i - 1][j]}, ${dp[i][j - 1]}).`;

      steps.push({
        id: stepId++,
        description: `Comparing str1[${i - 1}]='${char1}' with str2[${j - 1}]='${char2}'. ${matchDesc}`,
        action: "compare",
        highlights: [],
        data: {
          matrix: buildMatrix(),
          cellHighlights: compareHighlights,
          rowHeaders,
          colHeaders,
          currentCell: [i, j] as [number, number],
          arrows,
        } satisfies MatrixStepData,
      });

      // Fill the cell
      if (isMatch) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        dir[i][j] = "diagonal";
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        dp[i][j] = dp[i - 1][j];
        dir[i][j] = "up";
      } else {
        dp[i][j] = dp[i][j - 1];
        dir[i][j] = "left";
      }

      const fillHighlights: Record<string, HighlightColor> = {};
      for (let pi = 0; pi <= m; pi++) {
        for (let pj = 0; pj <= n; pj++) {
          if (pi === 0 || pj === 0) {
            fillHighlights[cellKey(pi, pj)] = "completed";
          } else if (pi < i || (pi === i && pj <= j)) {
            fillHighlights[cellKey(pi, pj)] = "completed";
          }
        }
      }
      fillHighlights[cellKey(i, j)] = "active";

      const dirLabel = isMatch ? "diagonal (match)" : dir[i][j] === "up" ? "up" : "left";

      steps.push({
        id: stepId++,
        description: `dp[${i}][${j}] = ${dp[i][j]}. Direction: ${dirLabel}.`,
        action: "fill-cell",
        highlights: [],
        data: {
          matrix: buildMatrix(),
          cellHighlights: fillHighlights,
          rowHeaders,
          colHeaders,
          currentCell: [i, j] as [number, number],
        } satisfies MatrixStepData,
      });
    }
  }

  // Backtrack to find the LCS string
  const lcsChars: string[] = [];
  const backtrackPath: [number, number][] = [];
  let bi = m;
  let bj = n;
  backtrackPath.push([bi, bj]);

  while (bi > 0 && bj > 0) {
    if (dir[bi][bj] === "diagonal") {
      lcsChars.push(str1[bi - 1]);
      bi--;
      bj--;
    } else if (dir[bi][bj] === "up") {
      bi--;
    } else {
      bj--;
    }
    backtrackPath.push([bi, bj]);
  }
  lcsChars.reverse();
  backtrackPath.reverse();

  // Show backtracking result
  const backtrackHighlights: Record<string, HighlightColor> = {};
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      backtrackHighlights[cellKey(i, j)] = "completed";
    }
  }

  // Highlight backtrack path
  for (const [r, c] of backtrackPath) {
    backtrackHighlights[cellKey(r, c)] = "path";
  }
  backtrackHighlights[cellKey(m, n)] = "selected";

  // Build backtrack arrows
  const backtrackArrows: { from: [number, number]; to: [number, number]; label?: string }[] = [];
  for (let k = backtrackPath.length - 1; k > 0; k--) {
    const [r1, c1] = backtrackPath[k];
    const [r2, c2] = backtrackPath[k - 1];
    const isDiag = r1 !== r2 && c1 !== c2;
    backtrackArrows.push({
      from: [r1, c1],
      to: [r2, c2],
      label: isDiag ? str1[r1 - 1] : undefined,
    });
  }

  const lcsString = lcsChars.join("");

  steps.push({
    id: stepId++,
    description: `LCS length: ${dp[m][n]}. LCS string: "${lcsString}". Backtrack path shown in purple. Diagonal moves indicate matching characters included in the LCS.`,
    action: "complete",
    highlights: [],
    data: {
      matrix: buildMatrix(),
      cellHighlights: backtrackHighlights,
      rowHeaders,
      colHeaders,
      currentCell: [m, n] as [number, number],
      optimalPath: backtrackPath,
      arrows: backtrackArrows,
    } satisfies MatrixStepData,
  });

  return steps;
}
