import type { VisualizationStep, ScatterStepData, ScatterPoint } from "@/lib/visualization/types";

export function generateCosineSimilaritySteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Word pairs with their 2D vector representations
  const pairs = [
    { wordA: "king", vecA: [4, 5], wordB: "queen", vecB: [3.8, 5.5], expected: "high" },
    { wordA: "king", vecA: [4, 5], wordB: "apple", vecB: [6, 1], expected: "low" },
    { wordA: "cat", vecA: [2, 3], wordB: "dog", vecB: [2.5, 3.2], expected: "high" },
  ];

  function cosineSim(a: number[], b: number[]): number {
    const dot = a[0] * b[0] + a[1] * b[1];
    const magA = Math.sqrt(a[0] ** 2 + a[1] ** 2);
    const magB = Math.sqrt(b[0] ** 2 + b[1] ** 2);
    return dot / (magA * magB);
  }

  function angleDeg(a: number[], b: number[]): number {
    return (Math.acos(Math.min(1, cosineSim(a, b))) * 180) / Math.PI;
  }

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `Cosine similarity measures the angle between two vectors, ignoring magnitude. cos(theta) = (A . B) / (|A| * |B|). Range: [-1, 1]. Value of 1 means identical direction, 0 means orthogonal, -1 means opposite.`,
    action: "embed",
    highlights: [],
    data: {
      points: [],
      xLabel: "Dimension 1",
      yLabel: "Dimension 2",
      xRange: [0, 8],
      yRange: [0, 8],
    } as ScatterStepData,
  });

  // Show each pair
  for (let p = 0; p < pairs.length; p++) {
    const pair = pairs[p];
    const sim = cosineSim(pair.vecA, pair.vecB);
    const angle = angleDeg(pair.vecA, pair.vecB);

    const points: ScatterPoint[] = [
      { x: pair.vecA[0], y: pair.vecA[1], label: 0, id: pair.wordA },
      { x: pair.vecB[0], y: pair.vecB[1], label: 1, id: pair.wordB },
    ];

    // Show vectors from origin
    steps.push({
      id: stepId++,
      description: `Comparing "${pair.wordA}" and "${pair.wordB}": vectors = [${pair.vecA}] and [${pair.vecB}]. The angle between them is ${angle.toFixed(1)} degrees.`,
      action: "embed",
      highlights: [],
      data: {
        points,
        boundaries: [
          {
            type: "line" as const,
            points: [{ x: 0, y: 0 }, { x: pair.vecA[0], y: pair.vecA[1] }],
            color: "#6366f1",
            label: pair.wordA,
          },
          {
            type: "line" as const,
            points: [{ x: 0, y: 0 }, { x: pair.vecB[0], y: pair.vecB[1] }],
            color: "#f59e0b",
            label: pair.wordB,
          },
        ],
        xLabel: "Dimension 1",
        yLabel: "Dimension 2",
        xRange: [0, 8],
        yRange: [0, 8],
      } as ScatterStepData,
    });

    // Show computation
    const dot = pair.vecA[0] * pair.vecB[0] + pair.vecA[1] * pair.vecB[1];
    const magA = Math.sqrt(pair.vecA[0] ** 2 + pair.vecA[1] ** 2);
    const magB = Math.sqrt(pair.vecB[0] ** 2 + pair.vecB[1] ** 2);

    steps.push({
      id: stepId++,
      description: `cos("${pair.wordA}", "${pair.wordB}") = (${pair.vecA[0]}*${pair.vecB[0]} + ${pair.vecA[1]}*${pair.vecB[1]}) / (${magA.toFixed(2)} * ${magB.toFixed(2)}) = ${dot.toFixed(2)} / ${(magA * magB).toFixed(2)} = ${sim.toFixed(4)}. Similarity is ${pair.expected} (${sim > 0.9 ? "very similar" : sim > 0.5 ? "somewhat similar" : "quite different"}).`,
      action: "embed",
      highlights: [],
      data: {
        points,
        boundaries: [
          {
            type: "line" as const,
            points: [{ x: 0, y: 0 }, { x: pair.vecA[0], y: pair.vecA[1] }],
            color: "#6366f1",
          },
          {
            type: "line" as const,
            points: [{ x: 0, y: 0 }, { x: pair.vecB[0], y: pair.vecB[1] }],
            color: "#f59e0b",
          },
        ],
        xLabel: "Dimension 1",
        yLabel: "Dimension 2",
        xRange: [0, 8],
        yRange: [0, 8],
      } as ScatterStepData,
    });
  }

  // Summary with all vectors
  const allPoints: ScatterPoint[] = [];
  const allBoundaries = [];
  const colors = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#a855f7", "#22d3ee"];
  let colorIdx = 0;
  for (const pair of pairs) {
    allPoints.push(
      { x: pair.vecA[0], y: pair.vecA[1], label: colorIdx, id: pair.wordA },
    );
    allBoundaries.push({
      type: "line" as const,
      points: [{ x: 0, y: 0 }, { x: pair.vecA[0], y: pair.vecA[1] }],
      color: colors[colorIdx % colors.length],
    });
    colorIdx++;
    allPoints.push(
      { x: pair.vecB[0], y: pair.vecB[1], label: colorIdx, id: pair.wordB },
    );
    allBoundaries.push({
      type: "line" as const,
      points: [{ x: 0, y: 0 }, { x: pair.vecB[0], y: pair.vecB[1] }],
      color: colors[colorIdx % colors.length],
    });
    colorIdx++;
  }

  steps.push({
    id: stepId++,
    description: `Cosine similarity complete! Key insight: it measures direction, not magnitude. Two vectors with the same direction but different lengths have cosine similarity = 1. This makes it ideal for comparing word embeddings, document vectors, and sentence representations regardless of their length.`,
    action: "complete",
    highlights: [],
    data: {
      points: allPoints,
      boundaries: allBoundaries,
      xLabel: "Dimension 1",
      yLabel: "Dimension 2",
      xRange: [0, 8],
      yRange: [0, 8],
    } as ScatterStepData,
  });

  return steps;
}
