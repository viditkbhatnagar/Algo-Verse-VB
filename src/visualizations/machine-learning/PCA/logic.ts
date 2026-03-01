import type { VisualizationStep, ScatterStepData, ScatterPoint, DecisionBoundary } from "@/lib/visualization/types";

interface PCAInput {
  numPoints: number;
  seed?: number;
}

/** Simple seeded pseudo-random number generator for reproducible data */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Generate a standard-normal-ish value via Box-Muller */
function gaussianRandom(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
}

export function generatePCASteps(input: PCAInput): VisualizationStep[] {
  const { numPoints, seed = 42 } = input;
  const rng = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Generate correlated 2D data along a principal direction
  // True principal axis at ~30 degrees, with high variance along it
  const angle = Math.PI / 6; // 30 degrees
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const varMajor = 4.0; // variance along principal axis
  const varMinor = 0.8; // variance along minor axis

  const rawX: number[] = [];
  const rawY: number[] = [];

  for (let i = 0; i < numPoints; i++) {
    const z1 = gaussianRandom(rng) * Math.sqrt(varMajor);
    const z2 = gaussianRandom(rng) * Math.sqrt(varMinor);
    // Rotate to get correlated data
    const x = cosA * z1 - sinA * z2 + 5; // center at (5, 5)
    const y = sinA * z1 + cosA * z2 + 5;
    rawX.push(parseFloat(x.toFixed(2)));
    rawY.push(parseFloat(y.toFixed(2)));
  }

  const points: ScatterPoint[] = rawX.map((x, i) => ({
    x,
    y: rawY[i],
    label: 0,
    id: `p-${i}`,
  }));

  // --- Step 1: Show raw data ---
  steps.push({
    id: stepId++,
    description: `Generated ${numPoints} data points with correlated features. PCA will find the directions of maximum variance.`,
    action: "train",
    highlights: [],
    data: {
      points: [...points],
      xLabel: "Feature 1",
      yLabel: "Feature 2",
    } satisfies ScatterStepData,
  });

  // --- Step 2: Compute mean ---
  const xMean = rawX.reduce((a, b) => a + b, 0) / numPoints;
  const yMean = rawY.reduce((a, b) => a + b, 0) / numPoints;

  steps.push({
    id: stepId++,
    description: `Compute the mean of each feature: mean_x = ${xMean.toFixed(2)}, mean_y = ${yMean.toFixed(2)}. This is the centroid of the data.`,
    action: "train",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p, highlight: "active" as const })),
      xLabel: "Feature 1",
      yLabel: "Feature 2",
      centroids: [{ x: xMean, y: yMean, label: "mean" }],
    } satisfies ScatterStepData,
    variables: { xMean: parseFloat(xMean.toFixed(2)), yMean: parseFloat(yMean.toFixed(2)) },
  });

  // --- Step 3: Center the data ---
  const centeredX = rawX.map((x) => x - xMean);
  const centeredY = rawY.map((y) => y - yMean);

  const centeredPoints: ScatterPoint[] = centeredX.map((x, i) => ({
    x,
    y: centeredY[i],
    label: 0,
    id: `p-${i}`,
  }));

  steps.push({
    id: stepId++,
    description: `Center the data by subtracting the mean from each feature. Data is now centered at origin (0, 0).`,
    action: "train",
    highlights: [],
    data: {
      points: centeredPoints,
      xLabel: "Centered Feature 1",
      yLabel: "Centered Feature 2",
    } satisfies ScatterStepData,
    variables: { centered: true },
  });

  // --- Step 4: Compute covariance matrix ---
  let covXX = 0, covXY = 0, covYY = 0;
  for (let i = 0; i < numPoints; i++) {
    covXX += centeredX[i] * centeredX[i];
    covXY += centeredX[i] * centeredY[i];
    covYY += centeredY[i] * centeredY[i];
  }
  covXX /= (numPoints - 1);
  covXY /= (numPoints - 1);
  covYY /= (numPoints - 1);

  steps.push({
    id: stepId++,
    description: `Compute the covariance matrix: [[${covXX.toFixed(2)}, ${covXY.toFixed(2)}], [${covXY.toFixed(2)}, ${covYY.toFixed(2)}]]. This captures how features vary together.`,
    action: "train",
    highlights: [],
    data: {
      points: centeredPoints,
      xLabel: "Centered Feature 1",
      yLabel: "Centered Feature 2",
    } satisfies ScatterStepData,
    variables: {
      covMatrix: `[[${covXX.toFixed(2)}, ${covXY.toFixed(2)}], [${covXY.toFixed(2)}, ${covYY.toFixed(2)}]]`,
    },
  });

  // --- Step 5: Compute eigenvalues ---
  // For 2x2 symmetric matrix: eigenvalues from quadratic formula
  const trace = covXX + covYY;
  const det = covXX * covYY - covXY * covXY;
  const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det));
  const lambda1 = (trace + discriminant) / 2; // larger eigenvalue
  const lambda2 = (trace - discriminant) / 2; // smaller eigenvalue

  steps.push({
    id: stepId++,
    description: `Compute eigenvalues: lambda_1 = ${lambda1.toFixed(3)} (larger), lambda_2 = ${lambda2.toFixed(3)} (smaller). These represent the variance along each principal component.`,
    action: "train",
    highlights: [],
    data: {
      points: centeredPoints,
      xLabel: "Centered Feature 1",
      yLabel: "Centered Feature 2",
    } satisfies ScatterStepData,
    variables: { lambda1: parseFloat(lambda1.toFixed(3)), lambda2: parseFloat(lambda2.toFixed(3)) },
  });

  // --- Step 6: Compute eigenvectors ---
  // First eigenvector (for lambda1)
  let ev1x: number, ev1y: number;
  if (Math.abs(covXY) > 1e-10) {
    ev1x = lambda1 - covYY;
    ev1y = covXY;
  } else {
    ev1x = covXX >= covYY ? 1 : 0;
    ev1y = covXX >= covYY ? 0 : 1;
  }
  const norm1 = Math.sqrt(ev1x * ev1x + ev1y * ev1y);
  ev1x /= norm1;
  ev1y /= norm1;

  // Second eigenvector (perpendicular)
  let ev2x = -ev1y;
  let ev2y = ev1x;

  // Scale eigenvectors by sqrt of eigenvalue for visualization
  const scale1 = Math.sqrt(lambda1) * 2;
  const scale2 = Math.sqrt(lambda2) * 2;

  const pc1Line: DecisionBoundary = {
    type: "line",
    points: [
      { x: -ev1x * scale1, y: -ev1y * scale1 },
      { x: ev1x * scale1, y: ev1y * scale1 },
    ],
    color: "#6366f1",
    label: "PC1",
  };

  const pc2Line: DecisionBoundary = {
    type: "line",
    points: [
      { x: -ev2x * scale2, y: -ev2y * scale2 },
      { x: ev2x * scale2, y: ev2y * scale2 },
    ],
    color: "#22d3ee",
    label: "PC2",
  };

  steps.push({
    id: stepId++,
    description: `Compute eigenvectors: PC1 = [${ev1x.toFixed(3)}, ${ev1y.toFixed(3)}] (major axis), PC2 = [${ev2x.toFixed(3)}, ${ev2y.toFixed(3)}] (minor axis).`,
    action: "train",
    highlights: [],
    data: {
      points: centeredPoints,
      boundaries: [pc1Line],
      xLabel: "Centered Feature 1",
      yLabel: "Centered Feature 2",
    } satisfies ScatterStepData,
    variables: {
      PC1: `[${ev1x.toFixed(3)}, ${ev1y.toFixed(3)}]`,
      PC2: `[${ev2x.toFixed(3)}, ${ev2y.toFixed(3)}]`,
    },
  });

  // --- Step 7: Show both principal axes ---
  steps.push({
    id: stepId++,
    description: `Both principal components shown. PC1 (indigo) captures ${((lambda1 / (lambda1 + lambda2)) * 100).toFixed(1)}% of variance. PC2 (cyan) captures ${((lambda2 / (lambda1 + lambda2)) * 100).toFixed(1)}%.`,
    action: "train",
    highlights: [],
    data: {
      points: centeredPoints,
      boundaries: [pc1Line, pc2Line],
      xLabel: "Centered Feature 1",
      yLabel: "Centered Feature 2",
    } satisfies ScatterStepData,
    variables: {
      varianceExplainedPC1: `${((lambda1 / (lambda1 + lambda2)) * 100).toFixed(1)}%`,
      varianceExplainedPC2: `${((lambda2 / (lambda1 + lambda2)) * 100).toFixed(1)}%`,
    },
  });

  // --- Steps 8-14: Progressively project points onto PC1 ---
  const projectedOnPC1: ScatterPoint[] = centeredX.map((cx, i) => {
    // Project onto PC1: dot product with eigenvector
    const projection = cx * ev1x + centeredY[i] * ev1y;
    return {
      x: projection * ev1x,
      y: projection * ev1y,
      label: 0,
      id: `p-${i}`,
      highlight: "completed" as const,
    };
  });

  const numProjectionSteps = 7;
  for (let s = 1; s <= numProjectionSteps; s++) {
    const t = s / numProjectionSteps;
    const eased = 1 - Math.pow(1 - t, 3);

    const interpolatedPoints: ScatterPoint[] = centeredX.map((cx, i) => {
      const origX = cx;
      const origY = centeredY[i];
      const targetX = projectedOnPC1[i].x;
      const targetY = projectedOnPC1[i].y;
      return {
        x: parseFloat((origX + eased * (targetX - origX)).toFixed(3)),
        y: parseFloat((origY + eased * (targetY - origY)).toFixed(3)),
        label: 0,
        id: `p-${i}`,
        highlight: s === numProjectionSteps ? "completed" as const : "active" as const,
      };
    });

    steps.push({
      id: stepId++,
      description: s < numProjectionSteps
        ? `Projecting data onto PC1 (${Math.round(eased * 100)}% complete). Points move toward the principal component axis.`
        : `Projection complete! All points now lie on PC1. Data reduced from 2D to 1D, retaining ${((lambda1 / (lambda1 + lambda2)) * 100).toFixed(1)}% of original variance.`,
      action: s < numProjectionSteps ? "train" : "complete",
      highlights: [],
      data: {
        points: interpolatedPoints,
        boundaries: [pc1Line, pc2Line],
        xLabel: "Centered Feature 1",
        yLabel: "Centered Feature 2",
      } satisfies ScatterStepData,
      variables: {
        projectionProgress: `${Math.round(eased * 100)}%`,
      },
    });
  }

  // --- Step: Show variance explained summary ---
  const totalVariance = lambda1 + lambda2;
  steps.push({
    id: stepId++,
    description: `PCA complete! Variance explained: PC1 = ${((lambda1 / totalVariance) * 100).toFixed(1)}%, PC2 = ${((lambda2 / totalVariance) * 100).toFixed(1)}%. Dimensionality reduced from 2D to 1D.`,
    action: "complete",
    highlights: [],
    data: {
      points: projectedOnPC1.map((p) => ({ ...p, highlight: "completed" as const })),
      boundaries: [pc1Line],
      xLabel: "PC1",
      yLabel: "PC2",
    } satisfies ScatterStepData,
    variables: {
      totalVarianceExplained: `${((lambda1 / totalVariance) * 100).toFixed(1)}%`,
      lambda1: parseFloat(lambda1.toFixed(3)),
      lambda2: parseFloat(lambda2.toFixed(3)),
      eigenvector1: `[${ev1x.toFixed(3)}, ${ev1y.toFixed(3)}]`,
      eigenvector2: `[${ev2x.toFixed(3)}, ${ev2y.toFixed(3)}]`,
    },
  });

  // --- Final step: Reconstruction ---
  const reconstructedPoints: ScatterPoint[] = projectedOnPC1.map((p, i) => ({
    x: parseFloat((p.x + xMean).toFixed(2)),
    y: parseFloat((p.y + yMean).toFixed(2)),
    label: 0,
    id: `p-${i}`,
    highlight: "completed" as const,
  }));

  steps.push({
    id: stepId++,
    description: `Reconstructed data in original space by adding mean back. Points now lie along the principal component direction in the original coordinate system.`,
    action: "complete",
    highlights: [],
    data: {
      points: reconstructedPoints,
      boundaries: [{
        type: "line" as const,
        points: [
          { x: xMean - ev1x * scale1, y: yMean - ev1y * scale1 },
          { x: xMean + ev1x * scale1, y: yMean + ev1y * scale1 },
        ],
        color: "#6366f1",
        label: "PC1",
      }],
      xLabel: "Feature 1",
      yLabel: "Feature 2",
    } satisfies ScatterStepData,
    variables: {
      dimensionalityReduction: "2D -> 1D",
      informationRetained: `${((lambda1 / totalVariance) * 100).toFixed(1)}%`,
    },
  });

  return steps;
}
