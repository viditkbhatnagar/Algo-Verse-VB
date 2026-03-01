import type { VisualizationStep, FunctionPlotStepData, FunctionPlotPoint } from "@/lib/visualization/types";

interface GradientDescentInput {
  learningRate: number;
  startingX: number;
  seed?: number;
}

/** Loss function: f(x) = x^2 + 0.5*sin(3x) — a smooth convex-ish function */
function lossFunction(x: number): number {
  return x * x + 0.5 * Math.sin(3 * x);
}

/** Gradient of the loss function: f'(x) = 2x + 1.5*cos(3x) */
function lossGradient(x: number): number {
  return 2 * x + 1.5 * Math.cos(3 * x);
}

/** Generate densely sampled function curve for plotting */
function sampleFunction(xMin: number, xMax: number, numSamples: number): FunctionPlotPoint[] {
  const points: FunctionPlotPoint[] = [];
  const step = (xMax - xMin) / (numSamples - 1);
  for (let i = 0; i < numSamples; i++) {
    const x = xMin + i * step;
    points.push({ x: parseFloat(x.toFixed(3)), y: parseFloat(lossFunction(x).toFixed(4)) });
  }
  return points;
}

export function generateGradientDescentSteps(input: GradientDescentInput): VisualizationStep[] {
  const { learningRate, startingX } = input;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const xMin = -5;
  const xMax = 5;
  const functionPoints = sampleFunction(xMin, xMax, 200);

  // Compute y range for the plot
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
    description: `The loss function f(x) = x² + 0.5·sin(3x). Gradient Descent will find the minimum by following the negative gradient.`,
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
  let currentX = startingX;
  let currentY = lossFunction(currentX);

  steps.push({
    id: stepId++,
    description: `Starting point: x = ${currentX.toFixed(2)}, f(x) = ${currentY.toFixed(4)}. Learning rate = ${learningRate.toFixed(2)}.`,
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
    variables: { x: currentX, fx: parseFloat(currentY.toFixed(4)), learningRate },
  });

  // --- Steps 3-N: Gradient descent iterations ---
  const path: { x: number; y: number; label: string }[] = [
    { x: currentX, y: currentY, label: "start" },
  ];

  const maxSteps = 20;
  const convergenceThreshold = 1e-6;

  for (let i = 0; i < maxSteps; i++) {
    const grad = lossGradient(currentX);
    const prevX = currentX;
    const prevY = currentY;

    // Update rule: x_new = x_old - lr * gradient
    currentX = currentX - learningRate * grad;
    // Clamp to visible range
    currentX = Math.max(xMin + 0.1, Math.min(xMax - 0.1, currentX));
    currentY = lossFunction(currentX);

    // Gradient arrow: points from current position in direction of negative gradient
    const arrowScale = Math.min(1.5, Math.abs(learningRate * grad));
    const gradientArrow = {
      x: prevX,
      y: prevY,
      dx: -Math.sign(grad) * arrowScale,
      dy: 0,
    };

    path.push({ x: currentX, y: currentY, label: `step ${i + 1}` });

    // Build path trace as a second function
    const pathTrace = {
      name: "Descent path",
      points: path.map((p) => ({ x: p.x, y: p.y })),
      color: "#22d3ee",
      active: true,
    };

    const stepChange = Math.abs(currentX - prevX);

    steps.push({
      id: stepId++,
      description: `Step ${i + 1}: gradient = ${grad.toFixed(4)}, x_new = ${prevX.toFixed(3)} - ${learningRate.toFixed(2)} × ${grad.toFixed(4)} = ${currentX.toFixed(3)}. f(x) = ${currentY.toFixed(4)}.`,
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
        annotations: [
          { x: currentX, y: currentY, label: `x = ${currentX.toFixed(2)}` },
        ],
      } satisfies FunctionPlotStepData,
      variables: {
        iteration: i + 1,
        x: parseFloat(currentX.toFixed(4)),
        fx: parseFloat(currentY.toFixed(4)),
        gradient: parseFloat(grad.toFixed(4)),
        stepSize: parseFloat((learningRate * Math.abs(grad)).toFixed(4)),
      },
    });

    // Check convergence
    if (stepChange < convergenceThreshold) {
      break;
    }
  }

  // --- Final step: Converged ---
  const finalGrad = lossGradient(currentX);
  const pathTrace = {
    name: "Descent path",
    points: path.map((p) => ({ x: p.x, y: p.y })),
    color: "#22d3ee",
    active: true,
  };

  steps.push({
    id: stepId++,
    description: `Gradient Descent converged! Minimum at x = ${currentX.toFixed(4)}, f(x) = ${currentY.toFixed(4)}. Final gradient = ${finalGrad.toFixed(6)} (near zero). Total steps: ${path.length - 1}.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [lossCurve, pathTrace],
      currentX,
      xLabel: "x",
      yLabel: "f(x)",
      xRange,
      yRange,
      annotations: [
        { x: currentX, y: currentY, label: `min: (${currentX.toFixed(2)}, ${currentY.toFixed(2)})` },
        { x: startingX, y: lossFunction(startingX), label: "start" },
      ],
    } satisfies FunctionPlotStepData,
    variables: {
      finalX: parseFloat(currentX.toFixed(4)),
      finalFx: parseFloat(currentY.toFixed(4)),
      finalGradient: parseFloat(finalGrad.toFixed(6)),
      totalSteps: path.length - 1,
      learningRate,
    },
  });

  return steps;
}
