import type {
  VisualizationStep,
  HeatmapStepData,
  HeatmapCell,
  TokenData,
} from "@/lib/visualization/types";

/**
 * Self-Attention mechanism visualization.
 * Tokens: ["The", "cat", "sat", "down"]
 * Steps: show tokens -> compute Q,K,V -> compute QK^T -> softmax -> show attention weights -> multiply by V -> output
 */

const TOKENS = ["The", "cat", "sat", "down"];
const N = TOKENS.length;
const D_K = 3; // key/query dimension for display

// Simulated weight matrices (small scale for visualization)
function randomVec(size: number, seed: number): number[] {
  const vals: number[] = [];
  for (let i = 0; i < size; i++) {
    vals.push(Math.round(((Math.sin(seed * 7 + i * 13) + 1) / 2) * 100) / 100);
  }
  return vals;
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * (b[i] ?? 0), 0);
}

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map((v) => Math.exp(v - max));
  const sum = exps.reduce((s, v) => s + v, 0);
  return exps.map((v) => Math.round((v / sum) * 100) / 100);
}

export interface SelfAttentionStepData {
  tokens: TokenData[];
  heatmap: HeatmapStepData;
  phase: "tokens" | "qkv" | "scores" | "softmax" | "weights" | "output";
  qMatrix?: number[][];
  kMatrix?: number[][];
  vMatrix?: number[][];
  scoreMatrix?: number[][];
  attentionMatrix?: number[][];
  outputMatrix?: number[][];
  currentRow?: number;
}

export function generateSelfAttentionSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Generate Q, K, V matrices for each token
  const Q: number[][] = TOKENS.map((_, i) => randomVec(D_K, i * 3));
  const K: number[][] = TOKENS.map((_, i) => randomVec(D_K, i * 3 + 1));
  const V: number[][] = TOKENS.map((_, i) => randomVec(D_K, i * 3 + 2));

  // Compute raw scores: QK^T
  const rawScores: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    for (let j = 0; j < N; j++) {
      const score = Math.round(dotProduct(Q[i], K[j]) * 100) / 100;
      row.push(score);
    }
    rawScores.push(row);
  }

  // Scale scores by sqrt(d_k)
  const scaleFactor = Math.sqrt(D_K);
  const scaledScores: number[][] = rawScores.map((row) =>
    row.map((v) => Math.round((v / scaleFactor) * 100) / 100)
  );

  // Softmax per row
  const attentionWeights: number[][] = scaledScores.map((row) => softmax(row));

  // Output: attention weights * V
  const outputs: number[][] = [];
  for (let i = 0; i < N; i++) {
    const out: number[] = Array(D_K).fill(0);
    for (let j = 0; j < N; j++) {
      for (let d = 0; d < D_K; d++) {
        out[d] += attentionWeights[i][j] * V[j][d];
      }
    }
    outputs.push(out.map((v) => Math.round(v * 100) / 100));
  }

  // Helper: build empty heatmap
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

  // Helper: build heatmap from matrix
  function matrixToHeatmap(
    matrix: number[][],
    title: string,
    currentRow?: number
  ): HeatmapStepData {
    const cells: HeatmapCell[] = [];
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        cells.push({
          row: r,
          col: c,
          value: matrix[r][c],
          highlight: currentRow === r ? "attention-high" : undefined,
        });
      }
    }
    return {
      cells,
      rows: matrix.length,
      cols: matrix[0]?.length ?? N,
      rowLabels: TOKENS,
      colLabels: TOKENS,
      colorScale: "attention",
      title,
      currentCell: currentRow !== undefined ? [currentRow, 0] : undefined,
    };
  }

  // Helper: build token array
  function buildTokens(highlightIdx?: number, phase?: string): TokenData[] {
    return TOKENS.map((text, i) => ({
      id: `tok-${i}`,
      text,
      position: i,
      highlight: highlightIdx === i ? "attention-high" : phase === "complete" ? "completed" : undefined,
    }));
  }

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description:
      "Self-Attention: Each token attends to every other token (including itself) to compute a context-aware representation. This is the core mechanism of Transformers. We will visualize with 4 tokens: [\"The\", \"cat\", \"sat\", \"down\"].",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: emptyHeatmap("Self-Attention Matrix"),
      phase: "tokens",
    } as SelfAttentionStepData,
  });

  // Step 1: Show tokens
  steps.push({
    id: stepId++,
    description:
      "Input tokens are embedded into vectors. Each token gets a numerical representation (embedding) of dimension d_model.",
    action: "embed",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: emptyHeatmap("Awaiting Q, K, V computation..."),
      phase: "tokens",
    } as SelfAttentionStepData,
  });

  // Step 2: Compute Q matrix
  steps.push({
    id: stepId++,
    description:
      "Compute Query (Q) matrix: Each token embedding is multiplied by weight matrix W_Q to produce query vectors. Q = X * W_Q. Queries represent what each token is \"looking for\".",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: emptyHeatmap("Computing Q = X * W_Q"),
      phase: "qkv",
      qMatrix: Q,
    } as SelfAttentionStepData,
  });

  // Step 3: Compute K matrix
  steps.push({
    id: stepId++,
    description:
      "Compute Key (K) matrix: Each token embedding is multiplied by weight matrix W_K to produce key vectors. K = X * W_K. Keys represent what each token \"contains\" or \"offers\".",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: emptyHeatmap("Computing K = X * W_K"),
      phase: "qkv",
      qMatrix: Q,
      kMatrix: K,
    } as SelfAttentionStepData,
  });

  // Step 4: Compute V matrix
  steps.push({
    id: stepId++,
    description:
      "Compute Value (V) matrix: Each token embedding is multiplied by weight matrix W_V to produce value vectors. V = X * W_V. Values are the actual information that will be aggregated.",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: emptyHeatmap("Computing V = X * W_V"),
      phase: "qkv",
      qMatrix: Q,
      kMatrix: K,
      vMatrix: V,
    } as SelfAttentionStepData,
  });

  // Step 5: Compute QK^T overview
  steps.push({
    id: stepId++,
    description:
      "Compute attention scores: Score = Q * K^T. Each entry (i, j) measures how much token i should attend to token j. Higher score means more relevance.",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(rawScores, "Raw Scores: Q * K^T"),
      phase: "scores",
      scoreMatrix: rawScores,
    } as SelfAttentionStepData,
  });

  // Steps 6-9: Show each row of QK^T
  for (let row = 0; row < N; row++) {
    steps.push({
      id: stepId++,
      description: `Computing scores for "${TOKENS[row]}": dot product of Q[${row}] with each K vector. Score("${TOKENS[row]}", *) = [${rawScores[row].join(", ")}]. This shows how much "${TOKENS[row]}" attends to every token.`,
      action: "attend",
      highlights: [],
      data: {
        tokens: buildTokens(row),
        heatmap: matrixToHeatmap(rawScores, `Scores for "${TOKENS[row]}"`, row),
        phase: "scores",
        scoreMatrix: rawScores,
        currentRow: row,
      } as SelfAttentionStepData,
    });
  }

  // Step 10: Scale scores
  steps.push({
    id: stepId++,
    description: `Scale scores by 1/sqrt(d_k) = 1/sqrt(${D_K}) = ${(1 / scaleFactor).toFixed(3)}. Scaling prevents dot products from growing too large, which would push softmax into regions with tiny gradients. Scaled = Score / sqrt(d_k).`,
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(scaledScores, "Scaled Scores: Score / sqrt(d_k)"),
      phase: "scores",
      scoreMatrix: scaledScores,
    } as SelfAttentionStepData,
  });

  // Step 11: Apply softmax
  steps.push({
    id: stepId++,
    description:
      "Apply softmax row-wise to convert scores into probabilities. Each row sums to 1.0. Softmax(x_i) = exp(x_i) / sum(exp(x_j)). These are the attention weights.",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(attentionWeights, "Attention Weights (after softmax)"),
      phase: "softmax",
      attentionMatrix: attentionWeights,
    } as SelfAttentionStepData,
  });

  // Steps 12-15: Show attention weights per token
  for (let row = 0; row < N; row++) {
    const maxIdx = attentionWeights[row].indexOf(
      Math.max(...attentionWeights[row])
    );
    steps.push({
      id: stepId++,
      description: `Attention weights for "${TOKENS[row]}": [${attentionWeights[row].join(", ")}]. "${TOKENS[row]}" attends most to "${TOKENS[maxIdx]}" (weight = ${attentionWeights[row][maxIdx]}).`,
      action: "attend",
      highlights: [],
      data: {
        tokens: buildTokens(row),
        heatmap: matrixToHeatmap(
          attentionWeights,
          `Attention for "${TOKENS[row]}"`,
          row
        ),
        phase: "weights",
        attentionMatrix: attentionWeights,
        currentRow: row,
      } as SelfAttentionStepData,
    });
  }

  // Step 16: Multiply by V
  steps.push({
    id: stepId++,
    description:
      "Compute output: Output = Attention_Weights * V. Each token's new representation is a weighted sum of all value vectors, where weights come from the attention scores. Tokens with higher attention contribute more.",
    action: "attend",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(attentionWeights, "Attention Weights * V = Output"),
      phase: "output",
      attentionMatrix: attentionWeights,
      outputMatrix: outputs,
    } as SelfAttentionStepData,
  });

  // Step 17: Summary
  steps.push({
    id: stepId++,
    description:
      "Self-Attention complete! Summary: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V. Each token now has a context-aware representation that incorporates information from all other tokens. This is the fundamental building block of the Transformer architecture.",
    action: "complete",
    highlights: [],
    data: {
      tokens: buildTokens(undefined, "complete"),
      heatmap: matrixToHeatmap(attentionWeights, "Final Attention Pattern"),
      phase: "output",
      attentionMatrix: attentionWeights,
      outputMatrix: outputs,
    } as SelfAttentionStepData,
  });

  return steps;
}
