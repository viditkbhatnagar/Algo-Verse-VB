import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";

export interface MatrixMulStepData {
  matrixA: number[][];
  matrixB: number[][];
  result: (number | null)[][];
  highlightsA: Record<string, HighlightColor>;
  highlightsB: Record<string, HighlightColor>;
  highlightsR: Record<string, HighlightColor>;
  currentResultCell: [number, number] | null;
  dotProductTerms: string[];
  runningSum: number;
  phase: "start" | "select-cell" | "dot-product" | "cell-done" | "done";
}

function cellKey(r: number, c: number): string {
  return `${r}-${c}`;
}

export function generateMatrixMulSteps(
  A: number[][],
  B: number[][]
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const n = A.length; // rows of A
  const m = A[0].length; // cols of A = rows of B
  const p = B[0].length; // cols of B

  // Initialize result as null
  const result: (number | null)[][] = Array.from({ length: n }, () =>
    new Array(p).fill(null)
  );

  // Start
  steps.push({
    id: stepId++,
    description: `Matrix Multiplication: A (${n}x${m}) * B (${m}x${p}) = C (${n}x${p})`,
    action: "highlight",
    highlights: [],
    data: {
      matrixA: A,
      matrixB: B,
      result: result.map((r) => [...r]),
      highlightsA: {},
      highlightsB: {},
      highlightsR: {},
      currentResultCell: null,
      dotProductTerms: [],
      runningSum: 0,
      phase: "start",
    } satisfies MatrixMulStepData,
  });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      // Select cell to compute
      const hlA: Record<string, HighlightColor> = {};
      const hlB: Record<string, HighlightColor> = {};
      const hlR: Record<string, HighlightColor> = {};

      // Highlight row i of A and col j of B
      for (let k = 0; k < m; k++) {
        hlA[cellKey(i, k)] = "active";
        hlB[cellKey(k, j)] = "active";
      }
      hlR[cellKey(i, j)] = "comparing";

      steps.push({
        id: stepId++,
        description: `Computing C[${i}][${j}]: dot product of row ${i} of A and column ${j} of B`,
        action: "select",
        highlights: [{ indices: [i * p + j], color: "active" }],
        data: {
          matrixA: A,
          matrixB: B,
          result: result.map((r) => [...r]),
          highlightsA: { ...hlA },
          highlightsB: { ...hlB },
          highlightsR: { ...hlR },
          currentResultCell: [i, j],
          dotProductTerms: [],
          runningSum: 0,
          phase: "select-cell",
        } satisfies MatrixMulStepData,
      });

      // Compute dot product step by step
      let sum = 0;
      const terms: string[] = [];

      for (let k = 0; k < m; k++) {
        const product = A[i][k] * B[k][j];
        sum += product;
        terms.push(`${A[i][k]}*${B[k][j]}`);

        const hlAk: Record<string, HighlightColor> = {};
        const hlBk: Record<string, HighlightColor> = {};

        // Dim the whole row/col
        for (let kk = 0; kk < m; kk++) {
          hlAk[cellKey(i, kk)] = kk <= k ? "completed" : "active";
          hlBk[cellKey(kk, j)] = kk <= k ? "completed" : "active";
        }
        // Highlight current elements
        hlAk[cellKey(i, k)] = "comparing";
        hlBk[cellKey(k, j)] = "comparing";

        steps.push({
          id: stepId++,
          description: `C[${i}][${j}] += A[${i}][${k}] * B[${k}][${j}] = ${A[i][k]} * ${B[k][j]} = ${product} (sum = ${sum})`,
          action: "compare",
          highlights: [{ indices: [k], color: "comparing" }],
          data: {
            matrixA: A,
            matrixB: B,
            result: result.map((r) => [...r]),
            highlightsA: hlAk,
            highlightsB: hlBk,
            highlightsR: { [cellKey(i, j)]: "comparing" },
            currentResultCell: [i, j],
            dotProductTerms: [...terms],
            runningSum: sum,
            phase: "dot-product",
          } satisfies MatrixMulStepData,
        });
      }

      // Store result
      result[i][j] = sum;

      // Mark previous results as completed
      const hlRDone: Record<string, HighlightColor> = {};
      for (let ri = 0; ri < n; ri++) {
        for (let rj = 0; rj < p; rj++) {
          if (result[ri][rj] !== null) {
            hlRDone[cellKey(ri, rj)] = "completed";
          }
        }
      }

      steps.push({
        id: stepId++,
        description: `C[${i}][${j}] = ${terms.join(" + ")} = ${sum}`,
        action: "fill-cell",
        highlights: [{ indices: [i * p + j], color: "completed" }],
        data: {
          matrixA: A,
          matrixB: B,
          result: result.map((r) => [...r]),
          highlightsA: {},
          highlightsB: {},
          highlightsR: hlRDone,
          currentResultCell: [i, j],
          dotProductTerms: [...terms],
          runningSum: sum,
          phase: "cell-done",
        } satisfies MatrixMulStepData,
      });
    }
  }

  // Final
  const finalHL: Record<string, HighlightColor> = {};
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      finalHL[cellKey(i, j)] = "completed";
    }
  }

  steps.push({
    id: stepId++,
    description: `Matrix multiplication complete!`,
    action: "complete",
    highlights: [],
    data: {
      matrixA: A,
      matrixB: B,
      result: result.map((r) => [...r]),
      highlightsA: {},
      highlightsB: {},
      highlightsR: finalHL,
      currentResultCell: null,
      dotProductTerms: [],
      runningSum: 0,
      phase: "done",
    } satisfies MatrixMulStepData,
  });

  return steps;
}
