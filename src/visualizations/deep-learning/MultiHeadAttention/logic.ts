import type {
  VisualizationStep,
  HeatmapCell,
  HeatmapStepData,
} from "@/lib/visualization/types";

/**
 * Multi-Head Attention visualization.
 * Shows multiple attention heads side by side, then concatenation + linear projection.
 * Tokens: ["The", "cat", "sat", "down"], Heads: 3
 */

const TOKENS = ["The", "cat", "sat", "down"];
const N = TOKENS.length;
const NUM_HEADS = 3;

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map((v) => Math.exp(v - max));
  const sum = exps.reduce((s, v) => s + v, 0);
  return exps.map((v) => Math.round((v / sum) * 100) / 100);
}

function generateHeadWeights(seed: number): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < N; i++) {
    const raw: number[] = [];
    for (let j = 0; j < N; j++) {
      raw.push(Math.sin(seed * 7 + i * 13 + j * 11) * 2);
    }
    matrix.push(softmax(raw));
  }
  return matrix;
}

export interface MultiHeadStepData {
  heads: {
    id: number;
    label: string;
    weights: number[][];
    active: boolean;
    color: string;
  }[];
  tokens: string[];
  phase: "overview" | "single-head" | "multi-head" | "concat" | "projection" | "complete";
  activeHead?: number;
  concatenated?: number[][];
  projected?: number[][];
  heatmap: HeatmapStepData;
}

const HEAD_COLORS = ["#3b82f6", "#f59e0b", "#ec4899"];

export function generateMultiHeadAttentionSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Generate attention weights for each head
  const headWeights = Array.from({ length: NUM_HEADS }, (_, i) =>
    generateHeadWeights(i + 1)
  );

  const heads = headWeights.map((weights, i) => ({
    id: i,
    label: `Head ${i + 1}`,
    weights,
    active: false,
    color: HEAD_COLORS[i],
  }));

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
      "Multi-Head Attention: Instead of performing a single attention function, we run multiple attention heads in parallel. Each head learns different relationships (e.g., syntactic vs. semantic). Results are concatenated and linearly projected.",
    action: "attend",
    highlights: [],
    data: {
      heads: heads.map((h) => ({ ...h, active: false })),
      tokens: TOKENS,
      phase: "overview",
      heatmap: emptyHeatmap("Multi-Head Attention"),
    } as MultiHeadStepData,
  });

  // Step 1: Explain single head
  steps.push({
    id: stepId++,
    description:
      "Recall single-head attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V. A single head can only capture one type of relationship at a time.",
    action: "attend",
    highlights: [],
    data: {
      heads: heads.map((h, i) => ({ ...h, active: i === 0 })),
      tokens: TOKENS,
      phase: "single-head",
      activeHead: 0,
      heatmap: matrixToHeatmap(headWeights[0], "Head 1: Attention Weights"),
    } as MultiHeadStepData,
  });

  // Steps 2-4: Show each head
  for (let h = 0; h < NUM_HEADS; h++) {
    const headNames = [
      "syntactic structure (subject-verb)",
      "semantic similarity (related concepts)",
      "positional proximity (nearby tokens)",
    ];

    steps.push({
      id: stepId++,
      description: `Head ${h + 1} computes its own Q, K, V using separate weight matrices W_Q^${h + 1}, W_K^${h + 1}, W_V^${h + 1}. This head focuses on ${headNames[h]}. Each head has dimension d_k = d_model / num_heads.`,
      action: "attend",
      highlights: [],
      data: {
        heads: heads.map((hd, i) => ({ ...hd, active: i === h })),
        tokens: TOKENS,
        phase: "multi-head",
        activeHead: h,
        heatmap: matrixToHeatmap(headWeights[h], `Head ${h + 1}: ${headNames[h]}`),
      } as MultiHeadStepData,
    });
  }

  // Step 5: Show all heads side by side
  steps.push({
    id: stepId++,
    description:
      "All 3 heads computed in parallel. Notice how each head learned different attention patterns: Head 1 focuses on syntactic structure, Head 2 on semantics, Head 3 on proximity. Multi-head attention captures richer relationships than any single head.",
    action: "attend",
    highlights: [],
    data: {
      heads: heads.map((h) => ({ ...h, active: true })),
      tokens: TOKENS,
      phase: "multi-head",
      heatmap: matrixToHeatmap(headWeights[0], "All Heads (see colored matrices above)"),
    } as MultiHeadStepData,
  });

  // Steps 6-8: Individual head output details
  for (let h = 0; h < NUM_HEADS; h++) {
    const maxAttns = headWeights[h].map((row, ri) => {
      const maxIdx = row.indexOf(Math.max(...row));
      return `"${TOKENS[ri]}" attends most to "${TOKENS[maxIdx]}" (${row[maxIdx]})`;
    });

    steps.push({
      id: stepId++,
      description: `Head ${h + 1} output: ${maxAttns.join("; ")}. Each head_output = softmax(Q_h * K_h^T / sqrt(d_k)) * V_h.`,
      action: "attend",
      highlights: [],
      data: {
        heads: heads.map((hd, i) => ({ ...hd, active: i === h })),
        tokens: TOKENS,
        phase: "multi-head",
        activeHead: h,
        heatmap: matrixToHeatmap(headWeights[h], `Head ${h + 1}: Output Details`),
      } as MultiHeadStepData,
    });
  }

  // Step 9: Concatenation
  // Simulate concatenated output (each head produces d_k-dim vectors, concat = d_model)
  const concatenated = TOKENS.map((_, i) => {
    const row: number[] = [];
    for (let h = 0; h < NUM_HEADS; h++) {
      // Use attention weights as proxy for output values
      row.push(...headWeights[h][i]);
    }
    return row.map((v) => Math.round(v * 100) / 100);
  });

  steps.push({
    id: stepId++,
    description:
      "Concatenate all head outputs: Concat(head_1, head_2, head_3). Each token now has a representation of dimension num_heads * d_k = d_model. This concatenation combines the different perspectives from each head.",
    action: "attend",
    highlights: [],
    data: {
      heads: heads.map((h) => ({ ...h, active: true })),
      tokens: TOKENS,
      phase: "concat",
      concatenated,
      heatmap: emptyHeatmap("Concatenating head outputs..."),
    } as MultiHeadStepData,
  });

  // Step 10: Linear projection
  const projected = concatenated.map((row) =>
    row.slice(0, N).map((v) => Math.round(v * 0.8 * 100) / 100)
  );

  steps.push({
    id: stepId++,
    description:
      "Apply linear projection: Output = Concat(heads) * W_O. The projection matrix W_O (d_model x d_model) mixes the information from all heads. MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O.",
    action: "attend",
    highlights: [],
    data: {
      heads: heads.map((h) => ({ ...h, active: true })),
      tokens: TOKENS,
      phase: "projection",
      concatenated,
      projected,
      heatmap: emptyHeatmap("Linear projection: Concat * W_O"),
    } as MultiHeadStepData,
  });

  // Step 11: Comparison
  steps.push({
    id: stepId++,
    description:
      "Why multi-head? With h heads and d_model = h * d_k, computational cost is similar to single-head attention with full dimension. But multi-head allows the model to jointly attend to information from different representation subspaces at different positions.",
    action: "attend",
    highlights: [],
    data: {
      heads: heads.map((h) => ({ ...h, active: true })),
      tokens: TOKENS,
      phase: "projection",
      projected,
      heatmap: matrixToHeatmap(headWeights[0], "Multi-head vs single-head comparison"),
    } as MultiHeadStepData,
  });

  // Step 12: Summary
  steps.push({
    id: stepId++,
    description:
      "Multi-Head Attention complete! Formula: MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O where head_i = Attention(Q * W_Q^i, K * W_K^i, V * W_V^i). In the original Transformer, h=8 heads with d_k = d_model/h = 64.",
    action: "complete",
    highlights: [],
    data: {
      heads: heads.map((h) => ({ ...h, active: true })),
      tokens: TOKENS,
      phase: "complete",
      projected,
      heatmap: matrixToHeatmap(headWeights[0], "Final: Multi-Head Attention"),
    } as MultiHeadStepData,
  });

  return steps;
}
