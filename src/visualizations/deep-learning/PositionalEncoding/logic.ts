import type {
  VisualizationStep,
  HeatmapCell,
  HeatmapStepData,
  TokenData,
} from "@/lib/visualization/types";

/**
 * Positional Encoding visualization.
 * Shows sinusoidal PE matrix (positions x dimensions).
 * PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
 * PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
 */

const TOKENS = ["The", "cat", "sat", "down"];
const N = TOKENS.length;
const D_MODEL = 8; // small for visualization

function computePE(pos: number, dim: number, dModel: number): number {
  const i = Math.floor(dim / 2);
  const angle = pos / Math.pow(10000, (2 * i) / dModel);
  return dim % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
}

function buildPEMatrix(numPos: number, dModel: number): number[][] {
  const matrix: number[][] = [];
  for (let pos = 0; pos < numPos; pos++) {
    const row: number[] = [];
    for (let dim = 0; dim < dModel; dim++) {
      row.push(Math.round(computePE(pos, dim, dModel) * 100) / 100);
    }
    matrix.push(row);
  }
  return matrix;
}

export interface PositionalEncodingStepData {
  tokens: TokenData[];
  heatmap: HeatmapStepData;
  phase: "intro" | "positions" | "sin-pattern" | "cos-pattern" | "full-matrix" | "added" | "complete";
  peMatrix?: number[][];
  currentDim?: number;
  currentPos?: number;
}

export function generatePositionalEncodingSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const peMatrix = buildPEMatrix(N, D_MODEL);
  const dimLabels = Array.from({ length: D_MODEL }, (_, i) => `d${i}`);

  function buildTokens(highlightIdx?: number): TokenData[] {
    return TOKENS.map((text, i) => ({
      id: `tok-${i}`,
      text,
      position: i,
      highlight: highlightIdx === i ? "attention-high" : undefined,
    }));
  }

  function matrixToHeatmap(
    matrix: number[][],
    title: string,
    currentCell?: [number, number]
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
      cols: matrix[0]?.length ?? D_MODEL,
      rowLabels: TOKENS.map((t, i) => `${t}(${i})`),
      colLabels: dimLabels,
      colorScale: "generic",
      title,
      currentCell,
    };
  }

  function partialMatrix(
    numDims: number,
    title: string
  ): HeatmapStepData {
    const partial = peMatrix.map((row) => row.slice(0, numDims));
    const cells: HeatmapCell[] = [];
    for (let r = 0; r < partial.length; r++) {
      for (let c = 0; c < partial[r].length; c++) {
        cells.push({ row: r, col: c, value: partial[r][c] });
      }
    }
    return {
      cells,
      rows: N,
      cols: numDims,
      rowLabels: TOKENS.map((t, i) => `${t}(${i})`),
      colLabels: dimLabels.slice(0, numDims),
      colorScale: "generic",
      title,
    };
  }

  function emptyHeatmap(title: string): HeatmapStepData {
    return {
      cells: [],
      rows: N,
      cols: D_MODEL,
      rowLabels: TOKENS.map((t, i) => `${t}(${i})`),
      colLabels: dimLabels,
      colorScale: "generic",
      title,
    };
  }

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description:
      "Positional Encoding: Transformers process all tokens in parallel, so they have no inherent notion of token order. Positional encodings are added to input embeddings to inject information about each token's position in the sequence.",
    action: "embed",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: emptyHeatmap("Positional Encoding Matrix"),
      phase: "intro",
    } as PositionalEncodingStepData,
  });

  // Step 1: Show token positions
  steps.push({
    id: stepId++,
    description:
      "Each token is assigned a position index: \"The\"=0, \"cat\"=1, \"sat\"=2, \"down\"=3. The positional encoding for each position is a vector of the same dimension as the embedding (d_model).",
    action: "embed",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: emptyHeatmap("Token positions: 0, 1, 2, 3"),
      phase: "positions",
    } as PositionalEncodingStepData,
  });

  // Steps 2-3: Show position-specific encodings
  for (let pos = 0; pos < 2; pos++) {
    steps.push({
      id: stepId++,
      description: `Position ${pos} ("${TOKENS[pos]}"): PE values = [${peMatrix[pos].map((v) => v.toFixed(2)).join(", ")}]. Each dimension uses a different frequency, creating a unique fingerprint for this position.`,
      action: "embed",
      highlights: [],
      data: {
        tokens: buildTokens(pos),
        heatmap: matrixToHeatmap(peMatrix, `Position ${pos} Encoding`, [pos, 0]),
        phase: "positions",
        peMatrix,
        currentPos: pos,
      } as PositionalEncodingStepData,
    });
  }

  // Step 4: Sin pattern (even dimensions)
  steps.push({
    id: stepId++,
    description:
      "Even dimensions use sine: PE(pos, 2i) = sin(pos / 10000^(2i/d_model)). Low-frequency sines vary slowly across positions (capturing coarse position), while high-frequency sines vary quickly (capturing fine position).",
    action: "embed",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: partialMatrix(D_MODEL, "Sin pattern (even dims: d0, d2, d4, d6)"),
      phase: "sin-pattern",
      peMatrix,
      currentDim: 0,
    } as PositionalEncodingStepData,
  });

  // Step 5: Cos pattern (odd dimensions)
  steps.push({
    id: stepId++,
    description:
      "Odd dimensions use cosine: PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model)). The combination of sin and cos at different frequencies creates a unique encoding for each position and allows the model to learn relative positions.",
    action: "embed",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: partialMatrix(D_MODEL, "Cos pattern (odd dims: d1, d3, d5, d7)"),
      phase: "cos-pattern",
      peMatrix,
      currentDim: 1,
    } as PositionalEncodingStepData,
  });

  // Step 6: Why sinusoidal?
  steps.push({
    id: stepId++,
    description:
      "Why sinusoidal? For any fixed offset k, PE(pos+k) can be represented as a linear function of PE(pos). This means the model can easily learn to attend to relative positions. The wavelengths form a geometric progression from 2pi to 10000*2pi.",
    action: "embed",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(peMatrix, "Full PE Matrix: Geometric frequency progression"),
      phase: "full-matrix",
      peMatrix,
    } as PositionalEncodingStepData,
  });

  // Step 7: Full matrix
  steps.push({
    id: stepId++,
    description:
      "Complete positional encoding matrix for 4 positions and 8 dimensions. Notice how each row (position) has a unique pattern, and the frequencies decrease as dimension index increases. This matrix is fixed (not learned) in the original Transformer.",
    action: "embed",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(peMatrix, "Complete Positional Encoding Matrix"),
      phase: "full-matrix",
      peMatrix,
    } as PositionalEncodingStepData,
  });

  // Step 8: Adding to embeddings
  steps.push({
    id: stepId++,
    description:
      "The positional encoding is ADDED (element-wise) to the input embedding: input = embedding + PE. This allows the model to use both the semantic content (embedding) and the position information (PE) simultaneously.",
    action: "embed",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(peMatrix, "Embedding + Positional Encoding = Input"),
      phase: "added",
      peMatrix,
    } as PositionalEncodingStepData,
  });

  // Step 9: Learned vs fixed
  steps.push({
    id: stepId++,
    description:
      "Alternatives: BERT and GPT use LEARNED positional embeddings instead of sinusoidal. RoPE (Rotary Position Embedding) encodes position through rotation matrices. ALiBi adds position bias directly to attention scores. Each approach has different tradeoffs for generalization to unseen sequence lengths.",
    action: "embed",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(peMatrix, "Sinusoidal PE (Original Transformer)"),
      phase: "full-matrix",
      peMatrix,
    } as PositionalEncodingStepData,
  });

  // Step 10: Summary
  steps.push({
    id: stepId++,
    description:
      "Positional Encoding complete! PE(pos, 2i) = sin(pos / 10000^(2i/d_model)), PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model)). These fixed encodings are added to embeddings to inject positional information into the Transformer, enabling it to distinguish token order.",
    action: "complete",
    highlights: [],
    data: {
      tokens: buildTokens(),
      heatmap: matrixToHeatmap(peMatrix, "Final: Positional Encoding Pattern"),
      phase: "complete",
      peMatrix,
    } as PositionalEncodingStepData,
  });

  return steps;
}
