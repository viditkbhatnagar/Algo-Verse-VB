import type {
  VisualizationStep,
  ScatterStepData,
  ScatterPoint,
  DecisionBoundary,
} from "@/lib/visualization/types";

interface SVMParams {
  numPoints: number;
  marginSize: number;
  seed?: number;
}

/** Seeded pseudo-random number generator */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/** Generate two linearly separable classes with a controlled gap */
function generateData(
  numPoints: number,
  marginSize: number,
  rand: () => number
): ScatterPoint[] {
  const points: ScatterPoint[] = [];
  const half = Math.floor(numPoints / 2);
  const gap = marginSize * 0.8;

  // Class 0: below the line y = x - gap
  for (let i = 0; i < half; i++) {
    const x = 1 + rand() * 6;
    const y = x - gap - 0.5 - rand() * 2.5;
    points.push({
      x: Math.max(0.5, Math.min(7.5, x)),
      y: Math.max(0.5, Math.min(7.5, y)),
      label: 0,
      id: `p${i}`,
    });
  }

  // Class 1: above the line y = x + gap
  for (let i = half; i < numPoints; i++) {
    const x = 1 + rand() * 6;
    const y = x + gap + 0.5 + rand() * 2.5;
    points.push({
      x: Math.max(0.5, Math.min(7.5, x)),
      y: Math.max(0.5, Math.min(7.5, y)),
      label: 1,
      id: `p${i}`,
    });
  }

  return points;
}

/** Find the optimal separating hyperplane using a simplified SVM approach.
 *  For visualization purposes we find the midpoint separating line y = x + b.
 *  The decision boundary is y = x + b_mid, with margins at b_mid +/- margin.
 */
function findSVMSolution(points: ScatterPoint[]) {
  // For y = x + b form, compute b = y - x for each point
  const class0 = points.filter((p) => p.label === 0);
  const class1 = points.filter((p) => p.label === 1);

  // Class 0 has small b values (below the line), class 1 has large b values
  const b0 = class0.map((p) => p.y - p.x);
  const b1 = class1.map((p) => p.y - p.x);

  const maxB0 = Math.max(...b0); // closest class 0 point to boundary
  const minB1 = Math.min(...b1); // closest class 1 point to boundary

  const bMid = (maxB0 + minB1) / 2;
  const margin = (minB1 - maxB0) / 2;

  // Find support vector indices (points closest to the boundary)
  const svIndices: number[] = [];
  const threshold = margin * 0.3;

  points.forEach((p, idx) => {
    const b = p.y - p.x;
    if (Math.abs(b - maxB0) < threshold && p.label === 0) {
      svIndices.push(idx);
    }
    if (Math.abs(b - minB1) < threshold && p.label === 1) {
      svIndices.push(idx);
    }
  });

  // Ensure at least one SV from each class
  if (!svIndices.some((i) => points[i].label === 0)) {
    const closest0 = class0.reduce(
      (best, p, i) =>
        Math.abs(p.y - p.x - maxB0) < Math.abs(best.p.y - best.p.x - maxB0)
          ? { p, origIdx: points.indexOf(p) }
          : best,
      { p: class0[0], origIdx: points.indexOf(class0[0]) }
    );
    svIndices.push(closest0.origIdx);
  }
  if (!svIndices.some((i) => points[i].label === 1)) {
    const closest1 = class1.reduce(
      (best, p, i) =>
        Math.abs(p.y - p.x - minB1) < Math.abs(best.p.y - best.p.x - minB1)
          ? { p, origIdx: points.indexOf(p) }
          : best,
      { p: class1[0], origIdx: points.indexOf(class1[0]) }
    );
    svIndices.push(closest1.origIdx);
  }

  return { bMid, margin, svIndices: Array.from(new Set(svIndices)) };
}

/** Create a boundary line (y = x + b) as a set of 2 points spanning the plot */
function makeBoundaryLine(
  b: number,
  color?: string,
  label?: string
): DecisionBoundary {
  // Line: y = x + b => two points at x=0 and x=8
  return {
    type: "line",
    points: [
      { x: 0, y: 0 + b },
      { x: 8, y: 8 + b },
    ],
    color,
    label,
  };
}

export function generateSVMSteps(params: SVMParams): VisualizationStep[] {
  const { numPoints, marginSize, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const points = generateData(numPoints, marginSize, rand);
  const { bMid, margin, svIndices } = findSVMSolution(points);

  const xRange: [number, number] = [0, 8];
  const yRange: [number, number] = [0, 8];
  const baseData = {
    xLabel: "Feature 1",
    yLabel: "Feature 2",
    xRange,
    yRange,
  };

  // ---- Step 1: Show initial data ----
  steps.push({
    id: stepId++,
    description: `Training data loaded: ${numPoints} points from 2 classes. Goal: find the optimal separating hyperplane.`,
    action: "train",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p })),
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 2: Describe the problem ----
  steps.push({
    id: stepId++,
    description:
      "SVM seeks a linear decision boundary that maximizes the margin between the two classes. The margin is the distance between the boundary and the nearest points of each class.",
    action: "train",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p })),
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 3: Show a bad candidate boundary (too close to class 0) ----
  const badB1 = bMid - margin * 0.7;
  steps.push({
    id: stepId++,
    description:
      "Candidate hyperplane 1: biased toward Class 0. The margin to Class 0 is small, making it fragile.",
    action: "train",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p })),
      boundaries: [makeBoundaryLine(badB1, "#ef4444", "Candidate 1")],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 4: Show another bad candidate (too close to class 1) ----
  const badB2 = bMid + margin * 0.7;
  steps.push({
    id: stepId++,
    description:
      "Candidate hyperplane 2: biased toward Class 1. Again, the margin is not maximized.",
    action: "train",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p })),
      boundaries: [
        makeBoundaryLine(badB1, "#ef444480", "Candidate 1"),
        makeBoundaryLine(badB2, "#f59e0b", "Candidate 2"),
      ],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 5: Show the optimal boundary ----
  steps.push({
    id: stepId++,
    description:
      "Optimal hyperplane found at the midpoint between classes. This boundary maximizes the margin.",
    action: "train",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p })),
      boundaries: [
        makeBoundaryLine(badB1, "#ef444440", "Candidate 1"),
        makeBoundaryLine(badB2, "#f59e0b40", "Candidate 2"),
        makeBoundaryLine(bMid, "#22d3ee", "Optimal"),
      ],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 6: Remove bad candidates, keep optimal ----
  steps.push({
    id: stepId++,
    description:
      "The optimal decision boundary is centered between the two classes, equidistant from the nearest points.",
    action: "train",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p })),
      boundaries: [makeBoundaryLine(bMid, "#22d3ee", "Decision boundary")],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 7: Highlight support vector candidates ----
  const pointsWithSVHighlight = points.map((p, idx) => {
    if (svIndices.includes(idx)) {
      return { ...p, highlight: "selected" as const };
    }
    return { ...p };
  });

  steps.push({
    id: stepId++,
    description: `Identifying support vectors: the ${svIndices.length} training points closest to the decision boundary. These define the margin.`,
    action: "classify",
    highlights: [
      {
        indices: svIndices,
        color: "selected",
        label: "Support vectors",
      },
    ],
    data: {
      points: pointsWithSVHighlight,
      boundaries: [makeBoundaryLine(bMid, "#22d3ee", "Decision boundary")],
      supportVectors: [...svIndices],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 8: Show support vectors with rings ----
  steps.push({
    id: stepId++,
    description:
      "Support vectors are circled. Only these points influence the position of the hyperplane -- removing any other point would not change the boundary.",
    action: "classify",
    highlights: [
      {
        indices: svIndices,
        color: "selected",
        label: "Support vectors",
      },
    ],
    data: {
      points: pointsWithSVHighlight,
      boundaries: [makeBoundaryLine(bMid, "#22d3ee", "Decision boundary")],
      supportVectors: [...svIndices],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 9: Add positive margin line ----
  steps.push({
    id: stepId++,
    description: `Adding the positive margin boundary (margin width = ${(margin * 2).toFixed(2)}). Points on this line are support vectors of Class 1.`,
    action: "train",
    highlights: [
      {
        indices: svIndices,
        color: "selected",
        label: "Support vectors",
      },
    ],
    data: {
      points: pointsWithSVHighlight,
      boundaries: [
        makeBoundaryLine(bMid, "#22d3ee", "Decision boundary"),
        makeBoundaryLine(bMid + margin, "#22c55e80", "Positive margin"),
      ],
      supportVectors: [...svIndices],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 10: Add negative margin line ----
  steps.push({
    id: stepId++,
    description:
      "Adding the negative margin boundary. The zone between the two margin lines is the maximum-margin band.",
    action: "train",
    highlights: [
      {
        indices: svIndices,
        color: "selected",
        label: "Support vectors",
      },
    ],
    data: {
      points: pointsWithSVHighlight,
      boundaries: [
        makeBoundaryLine(bMid, "#22d3ee", "Decision boundary"),
        makeBoundaryLine(bMid + margin, "#22c55e80", "Positive margin"),
        makeBoundaryLine(bMid - margin, "#22c55e80", "Negative margin"),
      ],
      supportVectors: [...svIndices],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 11: Margin maximization explanation ----
  steps.push({
    id: stepId++,
    description: `The margin width is ${(margin * 2).toFixed(2)} units. SVM maximizes this margin to improve generalization on unseen data.`,
    action: "train",
    highlights: [
      {
        indices: svIndices,
        color: "selected",
        label: "Support vectors",
      },
    ],
    data: {
      points: pointsWithSVHighlight,
      boundaries: [
        makeBoundaryLine(bMid, "#22d3ee", "Decision boundary"),
        makeBoundaryLine(bMid + margin, "#22c55e80", "Positive margin"),
        makeBoundaryLine(bMid - margin, "#22c55e80", "Negative margin"),
      ],
      supportVectors: [...svIndices],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 12: Test classification - class 0 region ----
  const testPoint0: ScatterPoint = {
    x: 2,
    y: 1,
    label: -1,
    id: "test0",
  };

  steps.push({
    id: stepId++,
    description:
      "Testing classification: a new point in the Class 0 region falls below the decision boundary.",
    action: "classify",
    highlights: [],
    data: {
      points: pointsWithSVHighlight,
      queryPoint: testPoint0,
      boundaries: [
        makeBoundaryLine(bMid, "#22d3ee", "Decision boundary"),
        makeBoundaryLine(bMid + margin, "#22c55e80", "Positive margin"),
        makeBoundaryLine(bMid - margin, "#22c55e80", "Negative margin"),
      ],
      supportVectors: [...svIndices],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 13: Test classification - class 1 region ----
  const testPoint1: ScatterPoint = {
    x: 3,
    y: 6,
    label: -1,
    id: "test1",
  };

  steps.push({
    id: stepId++,
    description:
      "Testing classification: a new point in the Class 1 region falls above the decision boundary.",
    action: "classify",
    highlights: [],
    data: {
      points: pointsWithSVHighlight,
      queryPoint: testPoint1,
      boundaries: [
        makeBoundaryLine(bMid, "#22d3ee", "Decision boundary"),
        makeBoundaryLine(bMid + margin, "#22c55e80", "Positive margin"),
        makeBoundaryLine(bMid - margin, "#22c55e80", "Negative margin"),
      ],
      supportVectors: [...svIndices],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 14: Final model ----
  const finalPoints = points.map((p, idx) => {
    if (svIndices.includes(idx)) {
      return { ...p, highlight: "completed" as const };
    }
    return { ...p };
  });

  steps.push({
    id: stepId++,
    description: `SVM training complete! Decision boundary: y = x + ${bMid.toFixed(2)}. Margin: ${(margin * 2).toFixed(2)}. Support vectors: ${svIndices.length}.`,
    action: "complete",
    highlights: [
      {
        indices: svIndices,
        color: "completed",
        label: "Support vectors",
      },
    ],
    data: {
      points: finalPoints,
      boundaries: [
        makeBoundaryLine(bMid, "#22d3ee", "Decision boundary"),
        makeBoundaryLine(bMid + margin, "#22c55e80", "Positive margin"),
        makeBoundaryLine(bMid - margin, "#22c55e80", "Negative margin"),
      ],
      supportVectors: [...svIndices],
      ...baseData,
    } as ScatterStepData,
  });

  // ---- Step 15: Summary ----
  steps.push({
    id: stepId++,
    description:
      "SVM complete! The maximum-margin hyperplane generalizes well because it maximizes the distance to the nearest training points. For non-linearly separable data, the kernel trick maps data into higher dimensions.",
    action: "complete",
    highlights: [],
    data: {
      points: finalPoints,
      boundaries: [
        makeBoundaryLine(bMid, "#22d3ee", "Decision boundary"),
        makeBoundaryLine(bMid + margin, "#22c55e80", "Positive margin"),
        makeBoundaryLine(bMid - margin, "#22c55e80", "Negative margin"),
      ],
      supportVectors: [...svIndices],
      ...baseData,
    } as ScatterStepData,
  });

  return steps;
}
