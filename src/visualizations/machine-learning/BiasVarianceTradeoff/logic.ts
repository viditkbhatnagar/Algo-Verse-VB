import type {
  VisualizationStep,
  FunctionPlotStepData,
  FunctionPlotPoint,
} from "@/lib/visualization/types";

export function generateBiasVarianceSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Model complexity range: 1 (linear) to 20 (very complex)
  const complexityRange = 20;
  const points: { complexity: number; bias2: number; variance: number; totalError: number }[] = [];

  for (let c = 1; c <= complexityRange; c++) {
    // Bias^2 decreases as complexity increases (exponential decay)
    const bias2 = 2.5 * Math.exp(-0.2 * c) + 0.05;
    // Variance increases as complexity increases (exponential growth)
    const variance = 0.05 * Math.exp(0.15 * c);
    // Irreducible error
    const irreducible = 0.15;
    const totalError = bias2 + variance + irreducible;
    points.push({ complexity: c, bias2, variance, totalError });
  }

  // Find optimal complexity (minimum total error)
  let optimalIdx = 0;
  let minError = Infinity;
  for (let i = 0; i < points.length; i++) {
    if (points[i].totalError < minError) {
      minError = points[i].totalError;
      optimalIdx = i;
    }
  }
  const optimalComplexity = points[optimalIdx].complexity;

  // Helper to convert to FunctionPlotPoints up to index
  function bias2Points(upTo: number): FunctionPlotPoint[] {
    return points.slice(0, upTo + 1).map((p) => ({ x: p.complexity, y: p.bias2 }));
  }
  function variancePoints(upTo: number): FunctionPlotPoint[] {
    return points.slice(0, upTo + 1).map((p) => ({ x: p.complexity, y: p.variance }));
  }
  function totalErrorPoints(upTo: number): FunctionPlotPoint[] {
    return points.slice(0, upTo + 1).map((p) => ({ x: p.complexity, y: p.totalError }));
  }
  function irreduciblePoints(): FunctionPlotPoint[] {
    return points.map((p) => ({ x: p.complexity, y: 0.15 }));
  }

  const xRange: [number, number] = [0, complexityRange + 1];
  const maxY = Math.max(...points.map((p) => p.totalError)) * 1.1;
  const yRange: [number, number] = [0, maxY];

  // Step 1: Introduction
  steps.push({
    id: stepId++,
    description: "Bias-Variance Tradeoff: As model complexity increases, bias decreases but variance increases. The goal is to find the sweet spot that minimizes total error.",
    action: "train",
    highlights: [],
    data: {
      functions: [],
      xLabel: "Model Complexity",
      yLabel: "Error",
      xRange,
      yRange,
    } as FunctionPlotStepData,
  });

  // Step 2: Show bias^2 curve
  steps.push({
    id: stepId++,
    description: "Bias^2 (blue): Measures how far the average prediction is from the true value. High bias means the model is too simple (underfitting). Bias decreases as complexity increases.",
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "Bias^2", points: bias2Points(complexityRange - 1), color: "#3b82f6", active: true },
      ],
      xLabel: "Model Complexity",
      yLabel: "Error",
      xRange,
      yRange,
    } as FunctionPlotStepData,
  });

  // Step 3: Show variance curve
  steps.push({
    id: stepId++,
    description: "Variance (orange): Measures how much predictions change with different training sets. High variance means the model is too complex (overfitting). Variance increases with complexity.",
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "Bias^2", points: bias2Points(complexityRange - 1), color: "#3b82f6", active: true },
        { name: "Variance", points: variancePoints(complexityRange - 1), color: "#f59e0b", active: true },
      ],
      xLabel: "Model Complexity",
      yLabel: "Error",
      xRange,
      yRange,
    } as FunctionPlotStepData,
  });

  // Step 4: Show irreducible error
  steps.push({
    id: stepId++,
    description: "Irreducible Error (gray dashed): The noise inherent in the data that no model can eliminate. Total Error = Bias^2 + Variance + Irreducible Error.",
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "Bias^2", points: bias2Points(complexityRange - 1), color: "#3b82f6", active: true },
        { name: "Variance", points: variancePoints(complexityRange - 1), color: "#f59e0b", active: true },
        { name: "Irreducible Error", points: irreduciblePoints(), color: "#64748b", active: true },
      ],
      xLabel: "Model Complexity",
      yLabel: "Error",
      xRange,
      yRange,
    } as FunctionPlotStepData,
  });

  // Steps 5-10: Progressively build total error curve
  const progressSteps = 6;
  for (let i = 1; i <= progressSteps; i++) {
    const upTo = Math.min(Math.floor((i / progressSteps) * complexityRange), complexityRange) - 1;
    const current = points[upTo];

    steps.push({
      id: stepId++,
      description: `Complexity=${current.complexity}: Bias^2=${current.bias2.toFixed(3)}, Variance=${current.variance.toFixed(3)}, Total=${current.totalError.toFixed(3)}.`,
      action: "train",
      highlights: [],
      data: {
        functions: [
          { name: "Bias^2", points: bias2Points(complexityRange - 1), color: "#3b82f6", active: true },
          { name: "Variance", points: variancePoints(complexityRange - 1), color: "#f59e0b", active: true },
          { name: "Irreducible Error", points: irreduciblePoints(), color: "#64748b", active: false },
          { name: "Total Error", points: totalErrorPoints(upTo), color: "#ef4444", active: true },
        ],
        currentX: current.complexity,
        xLabel: "Model Complexity",
        yLabel: "Error",
        xRange,
        yRange,
      } as FunctionPlotStepData,
    });
  }

  // Step: Show optimal point
  steps.push({
    id: stepId++,
    description: `Optimal complexity = ${optimalComplexity}: Total error minimized at ${minError.toFixed(3)}. Below this point, the model underfits (high bias). Above, it overfits (high variance).`,
    action: "predict",
    highlights: [],
    data: {
      functions: [
        { name: "Bias^2", points: bias2Points(complexityRange - 1), color: "#3b82f6", active: true },
        { name: "Variance", points: variancePoints(complexityRange - 1), color: "#f59e0b", active: true },
        { name: "Irreducible Error", points: irreduciblePoints(), color: "#64748b", active: false },
        { name: "Total Error", points: totalErrorPoints(complexityRange - 1), color: "#ef4444", active: true },
      ],
      currentX: optimalComplexity,
      xLabel: "Model Complexity",
      yLabel: "Error",
      xRange,
      yRange,
      annotations: [
        { x: optimalComplexity, y: minError, label: `Optimal (${optimalComplexity})` },
        { x: 3, y: maxY * 0.85, label: "Underfitting" },
        { x: complexityRange - 2, y: maxY * 0.85, label: "Overfitting" },
      ],
    } as FunctionPlotStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `Bias-Variance Tradeoff: Simple models (linear) have high bias but low variance. Complex models (deep nets) have low bias but high variance. Cross-validation helps find the right balance. Regularization reduces variance at the cost of slightly increased bias.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [
        { name: "Bias^2", points: bias2Points(complexityRange - 1), color: "#3b82f6", active: true },
        { name: "Variance", points: variancePoints(complexityRange - 1), color: "#f59e0b", active: true },
        { name: "Irreducible Error", points: irreduciblePoints(), color: "#64748b", active: false },
        { name: "Total Error", points: totalErrorPoints(complexityRange - 1), color: "#ef4444", active: true },
      ],
      currentX: optimalComplexity,
      xLabel: "Model Complexity",
      yLabel: "Error",
      xRange,
      yRange,
      annotations: [
        { x: optimalComplexity, y: minError, label: "Sweet Spot" },
      ],
    } as FunctionPlotStepData,
  });

  return steps;
}
