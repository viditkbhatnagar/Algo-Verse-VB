import type { VisualizationStep, FunctionPlotStepData, FunctionPlotPoint } from "@/lib/visualization/types";

interface MiniBatchGDInput {
  batchSize: number;
  learningRate: number;
  seed?: number;
}

/** Simple seeded pseudo-random number generator */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Gaussian random via Box-Muller */
function gaussianRandom(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
}

/** Loss function: f(x) = x^2 + 0.5*sin(3x) */
function lossFunction(x: number): number {
  return x * x + 0.5 * Math.sin(3 * x);
}

/** True gradient: f'(x) = 2x + 1.5*cos(3x) */
function trueGradient(x: number): number {
  return 2 * x + 1.5 * Math.cos(3 * x);
}

/** Generate densely sampled function curve */
function sampleFunction(xMin: number, xMax: number, numSamples: number): FunctionPlotPoint[] {
  const points: FunctionPlotPoint[] = [];
  const step = (xMax - xMin) / (numSamples - 1);
  for (let i = 0; i < numSamples; i++) {
    const x = xMin + i * step;
    points.push({ x: parseFloat(x.toFixed(3)), y: parseFloat(lossFunction(x).toFixed(4)) });
  }
  return points;
}

export function generateMiniBatchGDSteps(input: MiniBatchGDInput): VisualizationStep[] {
  const { batchSize, learningRate, seed = 42 } = input;
  const rng = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const xMin = -5;
  const xMax = 5;
  const functionPoints = sampleFunction(xMin, xMax, 200);

  const yValues = functionPoints.map((p) => p.y);
  const yMin = Math.min(...yValues) - 1;
  const yMax = Math.max(...yValues) + 2;

  const xRange: [number, number] = [xMin, xMax];
  const yRange: [number, number] = [yMin, yMax];

  const lossCurve = {
    name: "f(x) = x² + 0.5·sin(3x)",
    points: functionPoints,
    color: "#6366f1",
    active: true,
  };

  // --- Step 1: Show loss function and explain mini-batch ---
  steps.push({
    id: stepId++,
    description: `Mini-batch Gradient Descent uses batches of ${batchSize} samples to estimate the gradient. Larger batches give smoother updates (less noise) but cost more per step. This is a middle ground between full-batch GD and SGD.`,
    action: "train",
    highlights: [],
    data: {
      functions: [lossCurve],
      xLabel: "x",
      yLabel: "f(x)",
      xRange,
      yRange,
    } satisfies FunctionPlotStepData,
  });

  // --- Step 2: Show starting point ---
  let currentX = 3.5;
  let currentY = lossFunction(currentX);

  steps.push({
    id: stepId++,
    description: `Starting at x = ${currentX.toFixed(2)}, f(x) = ${currentY.toFixed(4)}. Learning rate = ${learningRate.toFixed(2)}, batch size = ${batchSize}. Noise decreases as batch size increases.`,
    action: "train",
    highlights: [],
    data: {
      functions: [lossCurve],
      currentX,
      xLabel: "x",
      yLabel: "f(x)",
      xRange,
      yRange,
      annotations: [{ x: currentX, y: currentY, label: `x₀ = ${currentX.toFixed(2)}` }],
    } satisfies FunctionPlotStepData,
    variables: { x: currentX, fx: parseFloat(currentY.toFixed(4)), learningRate, batchSize },
  });

  // --- Step 3: Explain noise relationship ---
  // Noise scale: inversely proportional to sqrt(batchSize)
  // Full batch (batchSize -> infinity): no noise
  // SGD (batchSize = 1): maximum noise
  const noiseScale = 1.5 / Math.sqrt(batchSize);

  steps.push({
    id: stepId++,
    description: `Gradient noise ~ 1/sqrt(batch_size). With batch size ${batchSize}, noise scale = ${noiseScale.toFixed(3)}. Batch GD (no noise) vs SGD (max noise) vs Mini-batch (moderate noise).`,
    action: "train",
    highlights: [],
    data: {
      functions: [lossCurve],
      currentX,
      xLabel: "x",
      yLabel: "f(x)",
      xRange,
      yRange,
      annotations: [{ x: currentX, y: currentY, label: `noise ~ ${noiseScale.toFixed(2)}` }],
    } satisfies FunctionPlotStepData,
    variables: { noiseScale: parseFloat(noiseScale.toFixed(3)), batchSize },
  });

  // --- Steps 4-N: Mini-batch GD iterations ---
  const path: { x: number; y: number }[] = [{ x: currentX, y: currentY }];
  const numSteps = 22;

  for (let i = 0; i < numSteps; i++) {
    const trueGrad = trueGradient(currentX);

    // Simulate mini-batch: average of batchSize noisy gradients
    let batchGrad = 0;
    for (let b = 0; b < batchSize; b++) {
      const sampleNoise = gaussianRandom(rng) * 2.0; // individual sample noise
      batchGrad += trueGrad + sampleNoise;
    }
    batchGrad /= batchSize; // averaging reduces noise by sqrt(batchSize)

    const prevX = currentX;
    const prevY = currentY;

    // Update
    currentX = currentX - learningRate * batchGrad;
    currentX = Math.max(xMin + 0.1, Math.min(xMax - 0.1, currentX));
    currentY = lossFunction(currentX);

    path.push({ x: currentX, y: currentY });

    // Gradient arrow
    const arrowScale = Math.min(1.5, Math.abs(learningRate * batchGrad));
    const gradientArrow = {
      x: prevX,
      y: prevY,
      dx: -Math.sign(batchGrad) * arrowScale,
      dy: 0,
    };

    const pathTrace = {
      name: "Mini-batch path",
      points: path.map((p) => ({ x: p.x, y: p.y })),
      color: "#22c55e",
      active: true,
    };

    const batchNoise = batchGrad - trueGrad;

    steps.push({
      id: stepId++,
      description: `Step ${i + 1}: true grad = ${trueGrad.toFixed(3)}, batch grad = ${batchGrad.toFixed(3)} (noise = ${batchNoise.toFixed(3)}). x: ${prevX.toFixed(3)} -> ${currentX.toFixed(3)}. f(x) = ${currentY.toFixed(4)}.`,
      action: "compute-gradient",
      highlights: [],
      data: {
        functions: [lossCurve, pathTrace],
        currentX,
        xLabel: "x",
        yLabel: "f(x)",
        xRange,
        yRange,
        gradientArrow,
        annotations: [{ x: currentX, y: currentY, label: `x = ${currentX.toFixed(2)}` }],
      } satisfies FunctionPlotStepData,
      variables: {
        iteration: i + 1,
        x: parseFloat(currentX.toFixed(4)),
        fx: parseFloat(currentY.toFixed(4)),
        trueGradient: parseFloat(trueGrad.toFixed(4)),
        batchGradient: parseFloat(batchGrad.toFixed(4)),
        batchNoise: parseFloat(batchNoise.toFixed(4)),
      },
    });
  }

  // --- Final step ---
  const finalPathTrace = {
    name: "Mini-batch path",
    points: path.map((p) => ({ x: p.x, y: p.y })),
    color: "#22c55e",
    active: true,
  };

  steps.push({
    id: stepId++,
    description: `Mini-batch GD complete! Final: x = ${currentX.toFixed(4)}, f(x) = ${currentY.toFixed(4)}. With batch size ${batchSize}, the path is smoother than SGD but noisier than full-batch GD, achieving a practical balance between convergence speed and computational cost.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [lossCurve, finalPathTrace],
      currentX,
      xLabel: "x",
      yLabel: "f(x)",
      xRange,
      yRange,
      annotations: [
        { x: currentX, y: currentY, label: `final: (${currentX.toFixed(2)}, ${currentY.toFixed(2)})` },
        { x: 3.5, y: lossFunction(3.5), label: "start" },
      ],
    } satisfies FunctionPlotStepData,
    variables: {
      finalX: parseFloat(currentX.toFixed(4)),
      finalFx: parseFloat(currentY.toFixed(4)),
      totalSteps: numSteps,
      batchSize,
      learningRate,
      noiseScale: parseFloat(noiseScale.toFixed(3)),
    },
  });

  return steps;
}
