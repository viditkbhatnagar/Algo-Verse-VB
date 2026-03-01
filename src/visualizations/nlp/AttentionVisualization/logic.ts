import type { VisualizationStep, HeatmapStepData, HeatmapCell } from "@/lib/visualization/types";

export function generateAttentionVisualizationSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const sourceTokens = ["The", "cat", "sat", "on", "the", "mat"];
  const targetTokens = sourceTokens; // Self-attention
  const n = sourceTokens.length;

  // Simulated attention weights (self-attention pattern)
  // Rows = query tokens, Cols = key tokens
  const attentionMatrix: number[][] = [
    [0.35, 0.15, 0.10, 0.10, 0.20, 0.10], // "The" attends mostly to itself and "the"
    [0.10, 0.30, 0.15, 0.05, 0.05, 0.35], // "cat" attends to "cat" and "mat"
    [0.05, 0.25, 0.30, 0.20, 0.10, 0.10], // "sat" attends to "sat", "cat", "on"
    [0.05, 0.05, 0.15, 0.30, 0.05, 0.40], // "on" attends to "on" and "mat"
    [0.30, 0.10, 0.05, 0.05, 0.40, 0.10], // "the" attends to "The" and "the"
    [0.05, 0.30, 0.10, 0.20, 0.05, 0.30], // "mat" attends to "cat", "on", "mat"
  ];

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `Self-Attention allows each token to attend to every other token. The attention weight matrix (${n}x${n}) shows how much each query token (row) attends to each key token (column). Weights sum to 1 per row (softmax).`,
    action: "attend",
    highlights: [],
    data: {
      cells: [],
      rows: n,
      cols: n,
      rowLabels: sourceTokens.map((t) => `Q: ${t}`),
      colLabels: targetTokens.map((t) => `K: ${t}`),
      colorScale: "attention",
      title: "Self-Attention Weights (empty)",
    } as HeatmapStepData,
  });

  // Step 1: Q, K, V computation
  steps.push({
    id: stepId++,
    description: "Step 1: Compute Query (Q), Key (K), and Value (V) matrices by multiplying input embeddings with learned weight matrices: Q = X * W_Q, K = X * W_K, V = X * W_V. Each is of dimension (seq_len, d_k).",
    action: "attend",
    highlights: [],
    data: {
      cells: [],
      rows: n,
      cols: n,
      rowLabels: sourceTokens.map((t) => `Q: ${t}`),
      colLabels: targetTokens.map((t) => `K: ${t}`),
      colorScale: "attention",
      title: "Computing Q, K, V matrices...",
    } as HeatmapStepData,
  });

  // Step 2: Attention score computation
  steps.push({
    id: stepId++,
    description: "Step 2: Compute raw attention scores: Score = Q * K^T / sqrt(d_k). The dot product measures compatibility between query and key. Dividing by sqrt(d_k) prevents scores from growing too large, which would push softmax into saturated regions.",
    action: "attend",
    highlights: [],
    data: {
      cells: attentionMatrix.flatMap((row, r) =>
        row.map((val, c) => ({
          row: r,
          col: c,
          value: parseFloat((val * 5 - 1).toFixed(2)), // Raw scores before softmax
        }))
      ),
      rows: n,
      cols: n,
      rowLabels: sourceTokens.map((t) => `Q: ${t}`),
      colLabels: targetTokens.map((t) => `K: ${t}`),
      colorScale: "attention",
      title: "Raw Attention Scores (pre-softmax)",
    } as HeatmapStepData,
  });

  // Steps 3-5: Show attention for each query token one by one
  for (let q = 0; q < Math.min(n, 3); q++) {
    const cells: HeatmapCell[] = [];
    for (let r = 0; r <= q; r++) {
      for (let c = 0; c < n; c++) {
        cells.push({
          row: r,
          col: c,
          value: parseFloat(attentionMatrix[r][c].toFixed(2)),
          highlight: r === q ? "attention-high" : undefined,
        });
      }
    }

    const maxAttnIdx = attentionMatrix[q].indexOf(Math.max(...attentionMatrix[q]));
    steps.push({
      id: stepId++,
      description: `Softmax row ${q + 1}: "${sourceTokens[q]}" attends most strongly to "${targetTokens[maxAttnIdx]}" (weight=${attentionMatrix[q][maxAttnIdx].toFixed(2)}). Attention weights sum to 1.0: ${attentionMatrix[q].map(v => v.toFixed(2)).join(" + ")} = 1.00.`,
      action: "attend",
      highlights: [],
      data: {
        cells,
        rows: n,
        cols: n,
        rowLabels: sourceTokens.map((t) => `Q: ${t}`),
        colLabels: targetTokens.map((t) => `K: ${t}`),
        colorScale: "attention",
        currentCell: [q, maxAttnIdx],
        title: `Attention for "${sourceTokens[q]}"`,
      } as HeatmapStepData,
    });
  }

  // Full attention matrix
  const allCells: HeatmapCell[] = attentionMatrix.flatMap((row, r) =>
    row.map((val, c) => ({
      row: r,
      col: c,
      value: parseFloat(val.toFixed(2)),
    }))
  );

  steps.push({
    id: stepId++,
    description: "Step 4: Apply attention weights to Values: Output = softmax(QK^T / sqrt(d_k)) * V. Each output token is a weighted sum of all value vectors, where weights are the attention scores. This is the core mechanism of Transformers.",
    action: "attend",
    highlights: [],
    data: {
      cells: allCells,
      rows: n,
      cols: n,
      rowLabels: sourceTokens.map((t) => `Q: ${t}`),
      colLabels: targetTokens.map((t) => `K: ${t}`),
      colorScale: "attention",
      title: "Full Self-Attention Matrix (softmax applied)",
    } as HeatmapStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `Attention visualization complete! Key insights: (1) "the" tokens attend to each other (coreference), (2) "cat" and "mat" have high mutual attention (rhyme/semantics), (3) Multi-Head Attention uses multiple such matrices in parallel, capturing different relationship types.`,
    action: "complete",
    highlights: [],
    data: {
      cells: allCells,
      rows: n,
      cols: n,
      rowLabels: sourceTokens.map((t) => `Q: ${t}`),
      colLabels: targetTokens.map((t) => `K: ${t}`),
      colorScale: "attention",
      title: "Self-Attention (complete)",
    } as HeatmapStepData,
  });

  return steps;
}
