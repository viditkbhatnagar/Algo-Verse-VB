import type {
  VisualizationStep,
  HeatmapCell,
  HeatmapStepData,
  TokenData,
} from "@/lib/visualization/types";

/**
 * Masked Self-Attention visualization.
 * Shows causal mask (upper triangle = -inf/0) applied to attention scores.
 * Steps: compute raw scores -> show mask -> apply mask -> softmax
 */

const TOKENS = ["The", "cat", "sat", "down"];
const N = TOKENS.length;
const D_K = 3;

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr.filter((v) => v > -1e8));
  const exps = arr.map((v) => (v < -1e8 ? 0 : Math.exp(v - max)));
  const sum = exps.reduce((s, v) => s + v, 0);
  return exps.map((v) => (sum > 0 ? Math.round((v / sum) * 100) / 100 : 0));
}

function randomVec(size: number, seed: number): number[] {
  return Array.from({ length: size }, (_, i) =>
    Math.round(((Math.sin(seed * 7 + i * 13) + 1) / 2) * 100) / 100
  );
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * (b[i] ?? 0), 0);
}

export interface MaskedAttentionStepData {
  tokens: TokenData[];
  heatmap: HeatmapStepData;
  phase: "intro" | "scores" | "mask" | "masked-scores" | "softmax" | "output" | "complete";
  rawScores?: number[][];
  mask?: number[][];
  maskedScores?: number[][];
  attentionWeights?: number[][];
  currentRow?: number;
}

export function generateMaskedSelfAttentionSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Generate Q, K vectors
  const Q: number[][] = TOKENS.map((_, i) => randomVec(D_K, i * 3));
  const K: number[][] = TOKENS.map((_, i) => randomVec(D_K, i * 3 + 1));

  // Compute raw scores: QK^T / sqrt(d_k)
  const scaleFactor = Math.sqrt(D_K);
  const rawScores: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    for (let j = 0; j < N; j++) {
      row.push(Math.round((dotProduct(Q[i], K[j]) / scaleFactor) * 100) / 100);
    }
    rawScores.push(row);
  }

  // Causal mask: -inf for j > i (upper triangle)
  const mask: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    for (let j = 0; j < N; j++) {
      row.push(j > i ? -Infinity : 0);
    }
    mask.push(row);
  }

  // Display mask (for heatmap: use 0 and -10 instead of -inf)
  const displayMask: number[][] = mask.map((row) =>
    row.map((v) => (v === -Infinity ? -10 : 0))
  );

  // Apply mask to scores
  const maskedScores: number[][] = rawScores.map((row, i) =>
    row.map((v, j) => (j > i ? -Infinity : v))
  );

  // Display masked scores (clamp -inf to -10)
  const displayMaskedScores: number[][] = maskedScores.map((row) =>
    row.map((v) => (v === -Infinity ? -10 : Math.round(v * 100) / 100))
  );

  // Softmax per row (ignoring -inf)
  const attentionWeights: number[][] = maskedScores.map((row) => softmax(row));

  function buildTokens(highlightIdx?: number, complete?: boolean): TokenData[] {
    return TOKENS.map((text, i) => ({
      id: `tok-${i}`,
      text,
      position: i,
      highlight: highlightIdx === i ? "attention-high" : complete ? "completed" : undefined,
    }));
  }

  function matrixToHeatmap(
    matrix: number[][],
    title: string,
    colorScale: "attention" | "generic" = "attention",
    currentRow?: number
  ): HeatmapStepData {
    const cells: HeatmapCell[] = [];
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        cells.push({ row: r, col: c, value: matrix[r][c] });
      }
    }
    return {
      cells,
      rows: matrix.length,
      cols: matrix[0]?.length ?? N,
      rowLabels: TOKENS,
      colLabels: TOKENS,
      colorScale,
      title,
      currentCell: currentRow !== undefined ? [currentRow, 0] : undefined,
    };
  }

  function emptyHeatmap(title: string): HeatmapStepData {
    return {
      cells: [],
      rows: N,
      cols: N,
      rowLabels: TOKENS,
      colLabels: TOKENS,
      colorScale: "attention",
      title,
    };
  }

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description:
      "Masked Self-Attention (Causal Attention): Used in the Transformer decoder to prevent tokens from attending to future positions. When predicting token t, the model can only see tokens 0..t-1. This is essential for autoregressive generation (GPT, LLaMA, etc.).",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: emptyHeatmap("Masked Self-Attention"),
      phase: "intro",
    } as MaskedAttentionStepData,
  });

  // Step 1: Compute raw scores
  steps.push({
    id: stepId++,
    description:
      "First, compute raw attention scores: Score = QK^T / sqrt(d_k). These are the same as in standard self-attention -- every token attends to every other token at this stage.",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(rawScores, "Raw Scores: QK^T / sqrt(d_k)"),
      phase: "scores",
      rawScores,
    } as MaskedAttentionStepData,
  });

  // Step 2: Show the causal mask
  steps.push({
    id: stepId++,
    description:
      "The causal mask: a lower-triangular matrix where positions above the diagonal are set to -infinity (shown as -10). Position (i, j) with j > i means token i would attend to future token j -- this must be blocked. Mask[i][j] = 0 if j <= i, -inf if j > i.",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(displayMask, "Causal Mask (0 = allowed, -10 = blocked)", "generic"),
      phase: "mask",
      mask: displayMask,
    } as MaskedAttentionStepData,
  });

  // Step 3: Explain mask row by row
  for (let row = 0; row < N; row++) {
    const canSee = TOKENS.slice(0, row + 1).join(", ");
    const blocked = row < N - 1 ? TOKENS.slice(row + 1).join(", ") : "none";
    steps.push({
      id: stepId++,
      description: `Token "${TOKENS[row]}" (pos ${row}): can attend to [${canSee}] (positions 0..${row}). Blocked: [${blocked}]. The mask ensures causality -- each token only sees the past and itself.`,
      action: "attend",
      highlights: [],
      data: {
        tokens: buildTokens(row),
        heatmap: matrixToHeatmap(displayMask, `Mask for "${TOKENS[row]}"`, "generic", row),
        phase: "mask",
        mask: displayMask,
        currentRow: row,
      } as MaskedAttentionStepData,
    });
  }

  // Step 7: Apply mask to scores
  steps.push({
    id: stepId++,
    description:
      "Apply mask: MaskedScores = Scores + Mask. Adding -infinity to blocked positions ensures they become 0 after softmax (e^(-inf) = 0). Allowed positions retain their original scores.",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(displayMaskedScores, "Masked Scores: Scores + Mask"),
      phase: "masked-scores",
      rawScores,
      maskedScores: displayMaskedScores,
    } as MaskedAttentionStepData,
  });

  // Step 8: Softmax
  steps.push({
    id: stepId++,
    description:
      "Apply softmax row-wise. Masked positions (with -infinity scores) become exactly 0 in the attention weights, while allowed positions share the probability mass. Each row sums to 1.0 over the visible tokens only.",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(attentionWeights, "Attention Weights (after softmax)"),
      phase: "softmax",
      attentionWeights,
    } as MaskedAttentionStepData,
  });

  // Steps 9-12: Show attention per token
  for (let row = 0; row < N; row++) {
    const nonZero = attentionWeights[row]
      .map((w, j) => (w > 0 ? `"${TOKENS[j]}"=${w}` : null))
      .filter(Boolean)
      .join(", ");
    steps.push({
      id: stepId++,
      description: `Attention for "${TOKENS[row]}": only attends to positions 0..${row}. Weights: [${nonZero}]. Future tokens receive exactly 0 attention weight.`,
      action: "attend",
      highlights: [],
      data: {
        tokens: buildTokens(row),
        heatmap: matrixToHeatmap(attentionWeights, `Masked Attention for "${TOKENS[row]}"`, "attention", row),
        phase: "softmax",
        attentionWeights,
        currentRow: row,
      } as MaskedAttentionStepData,
    });
  }

  // Step 13: Complete
  steps.push({
    id: stepId++,
    description:
      "Masked Self-Attention complete! By adding a causal mask before softmax, we enforce the autoregressive property: each position can only attend to earlier positions. This is used in every decoder layer of the Transformer and is the foundation of all GPT-style language models. The lower-triangular attention pattern is why these models generate text one token at a time, left to right.",
    action: "complete",
    highlights: [],
    data: {
      tokens: buildTokens(undefined, true),
      heatmap: matrixToHeatmap(attentionWeights, "Final: Causal Attention Pattern"),
      phase: "complete",
      attentionWeights,
    } as MaskedAttentionStepData,
  });

  return steps;
}
