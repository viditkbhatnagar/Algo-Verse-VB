import type { VisualizationStep, ScatterStepData, ScatterPoint, DecisionBoundary } from "@/lib/visualization/types";

interface PolynomialRegressionInput {
  numPoints: number;
  degree: number;
  seed?: number;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateDataPoints(
  numPoints: number,
  rng: () => number
): { xs: number[]; ys: number[] } {
  // True underlying relationship: y = 0.4x^2 - 0.5x + 2 + noise
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < numPoints; i++) {
    const x = (rng() * 8) - 4; // range [-4, 4]
    const y = 0.4 * x * x - 0.5 * x + 2 + (rng() - 0.5) * 3;
    xs.push(parseFloat(x.toFixed(2)));
    ys.push(parseFloat(y.toFixed(2)));
  }
  return { xs, ys };
}

/**
 * Solve a linear system Ax = b via Gaussian elimination with partial pivoting.
 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const aug = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    if (Math.abs(aug[col][col]) < 1e-12) continue;

    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) aug[row][j] -= factor * aug[col][j];
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = aug[i][n];
    for (let j = i + 1; j < n; j++) x[i] -= aug[i][j] * x[j];
    if (Math.abs(aug[i][i]) > 1e-12) x[i] /= aug[i][i];
  }
  return x;
}

function polyFit(xs: number[], ys: number[], degree: number): number[] {
  const n = xs.length;
  const d = degree + 1;

  // Build Vandermonde matrix
  const V = xs.map((x) => Array.from({ length: d }, (_, j) => Math.pow(x, j)));

  // Compute V^T * V
  const VtV: number[][] = Array.from({ length: d }, (_, i) =>
    Array.from({ length: d }, (_, j) =>
      V.reduce((sum, row) => sum + row[i] * row[j], 0)
    )
  );

  // Compute V^T * y
  const Vty: number[] = Array.from({ length: d }, (_, i) =>
    V.reduce((sum, row, k) => sum + row[i] * ys[k], 0)
  );

  return solveLinearSystem(VtV, Vty);
}

function polyEval(coeffs: number[], x: number): number {
  return coeffs.reduce((sum, c, j) => sum + c * Math.pow(x, j), 0);
}

function computeMSE(xs: number[], ys: number[], coeffs: number[]): number {
  let sum = 0;
  for (let i = 0; i < xs.length; i++) {
    sum += (ys[i] - polyEval(coeffs, xs[i])) ** 2;
  }
  return sum / xs.length;
}

function makeCurvePoints(
  xs: number[],
  coeffs: number[],
  numSamples: number = 60
): { x: number; y: number }[] {
  const xMin = Math.min(...xs) - 0.5;
  const xMax = Math.max(...xs) + 0.5;
  const step = (xMax - xMin) / (numSamples - 1);
  const curvePoints: { x: number; y: number }[] = [];
  for (let i = 0; i < numSamples; i++) {
    const x = xMin + i * step;
    curvePoints.push({ x, y: polyEval(coeffs, x) });
  }
  return curvePoints;
}

function interpolateCoeffs(
  from: number[],
  to: number[],
  t: number
): number[] {
  const maxLen = Math.max(from.length, to.length);
  const result: number[] = [];
  for (let i = 0; i < maxLen; i++) {
    const a = i < from.length ? from[i] : 0;
    const b = i < to.length ? to[i] : 0;
    result.push(a + (b - a) * t);
  }
  return result;
}

export function generatePolynomialRegressionSteps(
  input: PolynomialRegressionInput
): VisualizationStep[] {
  const { numPoints, degree, seed = 42 } = input;
  const rng = seededRandom(seed);
  const { xs, ys } = generateDataPoints(numPoints, rng);

  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const points: ScatterPoint[] = xs.map((x, i) => ({
    x,
    y: ys[i],
    label: 0,
    id: `p-${i}`,
  }));

  // --- Step 1: Show data ---
  steps.push({
    id: stepId++,
    description: `Generated ${numPoints} data points with a non-linear trend. Goal: fit a degree-${degree} polynomial.`,
    action: "train",
    highlights: [],
    data: {
      points: [...points],
      xLabel: "x",
      yLabel: "y",
    } satisfies ScatterStepData,
  });

  // --- Step 2: Show degree-1 fit for comparison ---
  const linearCoeffs = polyFit(xs, ys, 1);
  const linearCurve = makeCurvePoints(xs, linearCoeffs);
  const linearMSE = computeMSE(xs, ys, linearCoeffs);

  steps.push({
    id: stepId++,
    description: `First, fit a linear model (degree 1) for comparison: y = ${linearCoeffs[1].toFixed(3)}x + ${linearCoeffs[0].toFixed(3)}. MSE = ${linearMSE.toFixed(2)}. Notice the poor fit for the curved data.`,
    action: "fit-line",
    highlights: [],
    data: {
      points: [...points],
      boundaries: [{
        type: "curve" as const,
        points: linearCurve,
        color: "#475569",
        label: "Linear (degree 1)",
      }],
      xLabel: "x",
      yLabel: "y",
      lossValue: linearMSE,
    } satisfies ScatterStepData,
    variables: { degree: 1, mse: parseFloat(linearMSE.toFixed(2)) },
  });

  // --- Step 3: Build Vandermonde matrix concept ---
  steps.push({
    id: stepId++,
    description: `Building the Vandermonde matrix with ${numPoints} rows and ${degree + 1} columns. Each row [1, x, x², ..., x^${degree}] represents one data point's polynomial features.`,
    action: "train",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p, highlight: "active" as const })),
      boundaries: [{
        type: "curve" as const,
        points: linearCurve,
        color: "#475569",
        label: "Linear (degree 1)",
      }],
      xLabel: "x",
      yLabel: "y",
    } satisfies ScatterStepData,
    variables: { matrixRows: numPoints, matrixCols: degree + 1 },
  });

  // --- Compute optimal coefficients ---
  const optimalCoeffs = polyFit(xs, ys, degree);

  // --- Steps: Progressive curve fitting ---
  const numFittingSteps = 14;
  const startCoeffs = linearCoeffs; // Start from linear fit

  for (let s = 1; s <= numFittingSteps; s++) {
    const t = s / numFittingSteps;
    const eased = 1 - Math.pow(1 - t, 3);

    const currentCoeffs = interpolateCoeffs(startCoeffs, optimalCoeffs, eased);
    const curvePoints = makeCurvePoints(xs, currentCoeffs);
    const mse = computeMSE(xs, ys, currentCoeffs);

    // Highlight points with largest residuals
    const residuals = xs.map((x, i) => ({
      idx: i,
      residual: Math.abs(ys[i] - polyEval(currentCoeffs, x)),
    }));
    residuals.sort((a, b) => b.residual - a.residual);
    const worstSet = new Set(residuals.slice(0, 3).map((r) => r.idx));

    const stepPoints: ScatterPoint[] = points.map((p, i) => ({
      ...p,
      highlight: worstSet.has(i) ? ("comparing" as const) : undefined,
    }));

    const coeffStr = currentCoeffs
      .map((c, i) => `a${i}=${c.toFixed(3)}`)
      .join(", ");

    const boundary: DecisionBoundary = {
      type: "curve",
      points: curvePoints,
      color: undefined,
      label: `Degree ${degree}`,
    };

    steps.push({
      id: stepId++,
      description: `Fitting step ${s}/${numFittingSteps}: ${coeffStr}. MSE = ${mse.toFixed(2)}. Curve progressively fits the data.`,
      action: "fit-line",
      highlights: [],
      data: {
        points: stepPoints,
        boundaries: [boundary],
        xLabel: "x",
        yLabel: "y",
        lossValue: mse,
      } satisfies ScatterStepData,
      variables: {
        step: s,
        mse: parseFloat(mse.toFixed(2)),
        progress: `${Math.round(eased * 100)}%`,
      },
    });
  }

  // --- R-squared ---
  const yMean = ys.reduce((a, b) => a + b, 0) / ys.length;
  const ssTot = ys.reduce((sum, y) => sum + (y - yMean) ** 2, 0);
  const ssRes = xs.reduce(
    (sum, x, i) => sum + (ys[i] - polyEval(optimalCoeffs, x)) ** 2,
    0
  );
  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  const finalMSE = computeMSE(xs, ys, optimalCoeffs);

  // --- Step: Show equation ---
  const equationParts: string[] = [];
  for (let i = optimalCoeffs.length - 1; i >= 0; i--) {
    const c = optimalCoeffs[i];
    if (i === 0) equationParts.push(c.toFixed(3));
    else if (i === 1) equationParts.push(`${c.toFixed(3)}x`);
    else equationParts.push(`${c.toFixed(3)}x^${i}`);
  }
  const equation = `y = ${equationParts.join(" + ").replace(/\+ -/g, "- ")}`;

  steps.push({
    id: stepId++,
    description: `Optimal polynomial found: ${equation}. MSE = ${finalMSE.toFixed(2)}, R² = ${rSquared.toFixed(4)}.`,
    action: "train",
    highlights: [],
    data: {
      points: [...points],
      boundaries: [{
        type: "curve" as const,
        points: makeCurvePoints(xs, optimalCoeffs),
        label: `Degree ${degree}`,
      }],
      xLabel: "x",
      yLabel: "y",
      lossValue: finalMSE,
    } satisfies ScatterStepData,
    variables: {
      coefficients: optimalCoeffs.map((c) => parseFloat(c.toFixed(4))),
      rSquared: parseFloat(rSquared.toFixed(4)),
    },
  });

  // --- Step: Prediction ---
  const predX = 2.0;
  const predY = polyEval(optimalCoeffs, predX);

  steps.push({
    id: stepId++,
    description: `Prediction: for x = ${predX}, y = ${predY.toFixed(2)}.`,
    action: "predict",
    highlights: [],
    data: {
      points: [...points],
      boundaries: [{
        type: "curve" as const,
        points: makeCurvePoints(xs, optimalCoeffs),
        label: `Degree ${degree}`,
      }],
      queryPoint: { x: predX, y: predY, label: 0 },
      xLabel: "x",
      yLabel: "y",
      lossValue: finalMSE,
    } satisfies ScatterStepData,
  });

  // --- Final step ---
  steps.push({
    id: stepId++,
    description: `Polynomial Regression (degree ${degree}) complete! ${equation}. R² = ${rSquared.toFixed(4)}.`,
    action: "complete",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p, highlight: "completed" as const })),
      boundaries: [{
        type: "curve" as const,
        points: makeCurvePoints(xs, optimalCoeffs),
        label: `Degree ${degree}`,
      }],
      xLabel: "x",
      yLabel: "y",
      lossValue: finalMSE,
    } satisfies ScatterStepData,
    variables: {
      equation,
      rSquared: parseFloat(rSquared.toFixed(4)),
      mse: parseFloat(finalMSE.toFixed(2)),
    },
  });

  return steps;
}
