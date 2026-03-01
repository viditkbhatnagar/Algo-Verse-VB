import type { VisualizationStep, ScatterStepData, ScatterPoint } from "@/lib/visualization/types";

interface LinearRegressionInput {
  numPoints: number;
  noise: number;
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

function generateDataPoints(
  numPoints: number,
  noise: number,
  rng: () => number
): { xs: number[]; ys: number[] } {
  // True underlying relationship: y = 2x + 1 + noise
  const trueSlope = 2;
  const trueIntercept = 1;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < numPoints; i++) {
    const x = rng() * 10;
    const y = trueSlope * x + trueIntercept + (rng() - 0.5) * 2 * noise;
    xs.push(parseFloat(x.toFixed(2)));
    ys.push(parseFloat(y.toFixed(2)));
  }
  return { xs, ys };
}

function computeMSE(xs: number[], ys: number[], m: number, b: number): number {
  let sum = 0;
  for (let i = 0; i < xs.length; i++) {
    const pred = m * xs[i] + b;
    sum += (ys[i] - pred) ** 2;
  }
  return sum / xs.length;
}

function makeRegressionLine(
  xs: number[],
  m: number,
  b: number
): { x: number; y: number }[] {
  const xMin = Math.min(...xs) - 0.5;
  const xMax = Math.max(...xs) + 0.5;
  return [
    { x: xMin, y: m * xMin + b },
    { x: xMax, y: m * xMax + b },
  ];
}

export function generateLinearRegressionSteps(
  input: LinearRegressionInput
): VisualizationStep[] {
  const { numPoints, noise, seed = 42 } = input;
  const rng = seededRandom(seed);
  const { xs, ys } = generateDataPoints(numPoints, noise, rng);

  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Build base scatter points
  const points: ScatterPoint[] = xs.map((x, i) => ({
    x,
    y: ys[i],
    label: 0,
    id: `p-${i}`,
  }));

  // --- Step 1: Show data points ---
  steps.push({
    id: stepId++,
    description: `Generated ${numPoints} data points with noise level ${noise}. The goal is to find the best-fit line y = mx + b.`,
    action: "train",
    highlights: [],
    data: {
      points: [...points],
      xLabel: "x",
      yLabel: "y",
    } satisfies ScatterStepData,
  });

  // --- Step 2: Compute means ---
  const xMean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const yMean = ys.reduce((a, b) => a + b, 0) / ys.length;

  steps.push({
    id: stepId++,
    description: `Compute mean of x = ${xMean.toFixed(2)} and mean of y = ${yMean.toFixed(2)}.`,
    action: "train",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p, highlight: "active" as const })),
      xLabel: "x",
      yLabel: "y",
    } satisfies ScatterStepData,
    variables: { xMean: parseFloat(xMean.toFixed(2)), yMean: parseFloat(yMean.toFixed(2)) },
  });

  // --- Step 3: Start with a flat line (m=0, b=yMean) ---
  let currentSlope = 0;
  let currentIntercept = yMean;

  steps.push({
    id: stepId++,
    description: `Start with a flat line: y = ${currentIntercept.toFixed(2)} (slope=0, intercept=mean of y). MSE = ${computeMSE(xs, ys, currentSlope, currentIntercept).toFixed(2)}.`,
    action: "fit-line",
    highlights: [],
    data: {
      points: [...points],
      regressionLine: makeRegressionLine(xs, currentSlope, currentIntercept),
      xLabel: "x",
      yLabel: "y",
      lossValue: computeMSE(xs, ys, currentSlope, currentIntercept),
    } satisfies ScatterStepData,
    variables: { slope: 0, intercept: parseFloat(currentIntercept.toFixed(2)) },
  });

  // --- Compute the optimal slope and intercept ---
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < xs.length; i++) {
    numerator += (xs[i] - xMean) * (ys[i] - yMean);
    denominator += (xs[i] - xMean) ** 2;
  }
  const optimalSlope = numerator / denominator;
  const optimalIntercept = yMean - optimalSlope * xMean;

  // --- Steps 4-N: Progressively adjust slope and intercept toward optimal ---
  const numFittingSteps = 15;
  for (let s = 1; s <= numFittingSteps; s++) {
    const t = s / numFittingSteps; // interpolation factor 0..1
    // Use ease-out cubic for smoother progression
    const eased = 1 - Math.pow(1 - t, 3);

    currentSlope = eased * optimalSlope;
    currentIntercept = yMean + eased * (optimalIntercept - yMean);

    const mse = computeMSE(xs, ys, currentSlope, currentIntercept);

    // Highlight points with largest residuals
    const residuals = xs.map((x, i) => ({
      idx: i,
      residual: Math.abs(ys[i] - (currentSlope * x + currentIntercept)),
    }));
    residuals.sort((a, b) => b.residual - a.residual);
    const worstIndices = new Set(residuals.slice(0, 3).map((r) => r.idx));

    const stepPoints: ScatterPoint[] = points.map((p, i) => ({
      ...p,
      highlight: worstIndices.has(i) ? ("comparing" as const) : undefined,
    }));

    steps.push({
      id: stepId++,
      description: `Fitting step ${s}/${numFittingSteps}: slope = ${currentSlope.toFixed(3)}, intercept = ${currentIntercept.toFixed(3)}. MSE = ${mse.toFixed(2)}. Highlighted points have largest residuals.`,
      action: "fit-line",
      highlights: [],
      data: {
        points: stepPoints,
        regressionLine: makeRegressionLine(xs, currentSlope, currentIntercept),
        xLabel: "x",
        yLabel: "y",
        lossValue: mse,
      } satisfies ScatterStepData,
      variables: {
        slope: parseFloat(currentSlope.toFixed(3)),
        intercept: parseFloat(currentIntercept.toFixed(3)),
        mse: parseFloat(mse.toFixed(2)),
        progress: `${Math.round(eased * 100)}%`,
      },
    });
  }

  // --- Compute R-squared ---
  const ssTot = ys.reduce((sum, y) => sum + (y - yMean) ** 2, 0);
  const ssRes = xs.reduce(
    (sum, x, i) => sum + (ys[i] - (optimalSlope * x + optimalIntercept)) ** 2,
    0
  );
  const rSquared = 1 - ssRes / ssTot;

  // --- Step: Show final computation ---
  steps.push({
    id: stepId++,
    description: `Computing numerator = ${numerator.toFixed(2)} (covariance of x,y) and denominator = ${denominator.toFixed(2)} (variance of x).`,
    action: "train",
    highlights: [],
    data: {
      points: [...points],
      regressionLine: makeRegressionLine(xs, optimalSlope, optimalIntercept),
      xLabel: "x",
      yLabel: "y",
      lossValue: computeMSE(xs, ys, optimalSlope, optimalIntercept),
    } satisfies ScatterStepData,
    variables: {
      numerator: parseFloat(numerator.toFixed(2)),
      denominator: parseFloat(denominator.toFixed(2)),
      slope: parseFloat(optimalSlope.toFixed(4)),
      intercept: parseFloat(optimalIntercept.toFixed(4)),
    },
  });

  // --- Step: Predict with the fitted model ---
  const predX = parseFloat((xMean + 2).toFixed(2));
  const predY = parseFloat((optimalSlope * predX + optimalIntercept).toFixed(2));

  steps.push({
    id: stepId++,
    description: `Prediction: for x = ${predX}, y = ${optimalSlope.toFixed(2)} * ${predX} + ${optimalIntercept.toFixed(2)} = ${predY}.`,
    action: "predict",
    highlights: [],
    data: {
      points: [...points],
      regressionLine: makeRegressionLine(xs, optimalSlope, optimalIntercept),
      queryPoint: { x: predX, y: predY, label: 0 },
      xLabel: "x",
      yLabel: "y",
      lossValue: computeMSE(xs, ys, optimalSlope, optimalIntercept),
    } satisfies ScatterStepData,
    variables: {
      predX,
      predY,
    },
  });

  // --- Final step ---
  const finalMse = computeMSE(xs, ys, optimalSlope, optimalIntercept);

  steps.push({
    id: stepId++,
    description: `Linear Regression complete! Best fit: y = ${optimalSlope.toFixed(3)}x + ${optimalIntercept.toFixed(3)}. MSE = ${finalMse.toFixed(2)}, R² = ${rSquared.toFixed(4)}.`,
    action: "complete",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p, highlight: "completed" as const })),
      regressionLine: makeRegressionLine(xs, optimalSlope, optimalIntercept),
      xLabel: "x",
      yLabel: "y",
      lossValue: finalMse,
    } satisfies ScatterStepData,
    variables: {
      slope: parseFloat(optimalSlope.toFixed(4)),
      intercept: parseFloat(optimalIntercept.toFixed(4)),
      mse: parseFloat(finalMse.toFixed(2)),
      rSquared: parseFloat(rSquared.toFixed(4)),
    },
  });

  return steps;
}
