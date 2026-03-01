import type { VisualizationStep, FunctionPlotStepData, FunctionPlotPoint } from "@/lib/visualization/types";

interface SGDInput {
  learningRate: number;
  batchSize: number;
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

export function generateSGDSteps(input: SGDInput): VisualizationStep[] {
  const { learningRate, batchSize, seed = 42 } = input;
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

  // --- Step 1: Show the loss function ---
  steps.push({
    id: stepId++,
    description: `The loss function f(x) = x² + 0.5·sin(3x). SGD approximates the gradient using random mini-batches of size ${batchSize}, leading to noisy but fast updates.`,
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
  let currentX = 3.5; // Fixed starting point for SGD
  let currentY = lossFunction(currentX);

  steps.push({
    id: stepId++,
    description: `Starting at x = ${currentX.toFixed(2)}, f(x) = ${currentY.toFixed(4)}. Learning rate = ${learningRate.toFixed(2)}, batch size = ${batchSize}. Smaller batches = noisier gradients.`,
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

  // --- Steps 3-N: SGD iterations with noisy gradients ---
  const path: { x: number; y: number }[] = [{ x: currentX, y: currentY }];
  const numSteps = Math.max(20, 30 - batchSize * 2); // More steps for smaller batches

  for (let i = 0; i < numSteps; i++) {
    const trueGrad = trueGradient(currentX);

    // Add noise inversely proportional to batch size
    // SGD noise ~ sigma / sqrt(batchSize)
    const noiseScale = 2.0 / Math.sqrt(batchSize);
    const noise = gaussianRandom(rng) * noiseScale;
    const noisyGrad = trueGrad + noise;

    const prevX = currentX;

    // Update with noisy gradient
    currentX = currentX - learningRate * noisyGrad;
    currentX = Math.max(xMin + 0.1, Math.min(xMax - 0.1, currentX));
    currentY = lossFunction(currentX);

    path.push({ x: currentX, y: currentY });

    // Gradient arrow
    const arrowScale = Math.min(1.5, Math.abs(learningRate * noisyGrad));
    const gradientArrow = {
      x: prevX,
      y: lossFunction(prevX),
      dx: -Math.sign(noisyGrad) * arrowScale,
      dy: 0,
    };

    const pathTrace = {
      name: "SGD path",
      points: path.map((p) => ({ x: p.x, y: p.y })),
      color: "#f59e0b",
      active: true,
    };

    steps.push({
      id: stepId++,
      description: `Step ${i + 1}: true gradient = ${trueGrad.toFixed(3)}, noise = ${noise.toFixed(3)}, noisy gradient = ${noisyGrad.toFixed(3)}. x: ${prevX.toFixed(3)} -> ${currentX.toFixed(3)}. f(x) = ${currentY.toFixed(4)}.`,
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
        noise: parseFloat(noise.toFixed(4)),
        noisyGradient: parseFloat(noisyGrad.toFixed(4)),
      },
    });
  }

  // --- Final step ---
  const finalPathTrace = {
    name: "SGD path",
    points: path.map((p) => ({ x: p.x, y: p.y })),
    color: "#f59e0b",
    active: true,
  };

  steps.push({
    id: stepId++,
    description: `SGD complete after ${numSteps} steps. Final: x = ${currentX.toFixed(4)}, f(x) = ${currentY.toFixed(4)}. The erratic path is characteristic of SGD — noisy gradients cause oscillation but enable escape from shallow local minima.`,
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
    },
  });

  return steps;
}
