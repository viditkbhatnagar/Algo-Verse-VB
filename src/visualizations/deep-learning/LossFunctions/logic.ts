import type {
  VisualizationStep,
  FunctionPlotStepData,
  FunctionPlotPoint,
} from "@/lib/visualization/types";

function generatePoints(fn: (x: number) => number, xMin: number, xMax: number, n: number): FunctionPlotPoint[] {
  const points: FunctionPlotPoint[] = [];
  for (let i = 0; i <= n; i++) {
    const x = xMin + (xMax - xMin) * (i / n);
    const y = fn(x);
    if (isFinite(y)) {
      points.push({ x, y });
    }
  }
  return points;
}

export function generateLossFunctionsSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const numPoints = 200;

  // MSE: L = (y_pred - y_true)^2, assuming y_true = 1
  const msePoints = generatePoints(x => (x - 1) ** 2, -1, 3, numPoints);
  // Binary Cross-Entropy: L = -(y*log(p) + (1-y)*log(1-p)), y=1 -> L = -log(p)
  const bcePoints = generatePoints(x => {
    if (x <= 0.01 || x >= 0.99) return NaN;
    return -Math.log(Math.max(0.001, x));
  }, 0.01, 0.99, numPoints);
  // Hinge Loss: L = max(0, 1 - y*f(x)), y=1 -> L = max(0, 1-x)
  const hingePoints = generatePoints(x => Math.max(0, 1 - x), -1, 3, numPoints);
  // Huber Loss: smooth MSE/MAE combination, delta=1
  const huberPoints = generatePoints(x => {
    const a = Math.abs(x - 1);
    return a <= 1 ? 0.5 * a * a : a - 0.5;
  }, -1, 3, numPoints);

  // MSE gradient
  const mseGradPoints = generatePoints(x => 2 * (x - 1), -1, 3, numPoints);
  // BCE gradient
  const bceGradPoints = generatePoints(x => {
    if (x <= 0.01 || x >= 0.99) return NaN;
    return -1 / Math.max(0.001, x);
  }, 0.02, 0.98, numPoints);

  // Step 1: Overview
  steps.push({
    id: stepId++,
    description: "Loss functions measure prediction error. They drive neural network training by providing the gradient signal for backpropagation.",
    action: "highlight",
    highlights: [],
    data: {
      functions: [
        { name: "MSE", points: msePoints, color: "#6366f1", active: true },
        { name: "BCE", points: bcePoints, color: "#f59e0b", active: true },
        { name: "Hinge", points: hingePoints, color: "#22d3ee", active: true },
      ],
      xLabel: "Prediction",
      yLabel: "Loss",
      xRange: [-1, 3] as [number, number],
      yRange: [-0.5, 5] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 2: MSE
  steps.push({
    id: stepId++,
    description: "Mean Squared Error (MSE): L = (prediction - target)^2. Shown with target=1. The parabola has minimum at prediction=1. Used for regression.",
    action: "activate",
    highlights: [],
    data: {
      functions: [
        { name: "MSE", points: msePoints, color: "#6366f1", active: true },
      ],
      xLabel: "Prediction",
      yLabel: "MSE Loss",
      xRange: [-1, 3] as [number, number],
      yRange: [-0.5, 5] as [number, number],
      currentX: 1,
      annotations: [{ x: 1, y: 0, label: "Minimum at target" }],
    } as FunctionPlotStepData,
  });

  // Step 3: MSE properties
  steps.push({
    id: stepId++,
    description: "MSE gradient = 2(prediction - target). Linear gradient: larger errors produce larger updates. Sensitive to outliers due to squaring.",
    action: "compute-gradient",
    highlights: [],
    data: {
      functions: [
        { name: "MSE", points: msePoints, color: "#6366f1", active: true },
        { name: "MSE gradient", points: mseGradPoints, color: "#ec4899", active: true },
      ],
      xLabel: "Prediction",
      yLabel: "Value",
      xRange: [-1, 3] as [number, number],
      yRange: [-4, 5] as [number, number],
      currentX: 0,
    } as FunctionPlotStepData,
  });

  // Step 4: Binary Cross-Entropy
  steps.push({
    id: stepId++,
    description: "Binary Cross-Entropy: L = -log(p) when target=1. Heavily penalizes confident wrong predictions (p near 0). Goes to infinity as p approaches 0.",
    action: "activate",
    highlights: [],
    data: {
      functions: [
        { name: "BCE (y=1)", points: bcePoints, color: "#f59e0b", active: true },
      ],
      xLabel: "Predicted Probability",
      yLabel: "BCE Loss",
      xRange: [0, 1] as [number, number],
      yRange: [-0.5, 5] as [number, number],
      currentX: 0.5,
      annotations: [{ x: 0.5, y: 0.693, label: "L(0.5) = 0.693" }],
    } as FunctionPlotStepData,
  });

  // Step 5: BCE gradient
  steps.push({
    id: stepId++,
    description: "BCE gradient = -1/p (when target=1). Gradient explodes as prediction approaches 0, pushing the model strongly away from confident wrong answers.",
    action: "compute-gradient",
    highlights: [],
    data: {
      functions: [
        { name: "BCE", points: bcePoints, color: "#f59e0b", active: true },
        { name: "BCE gradient", points: bceGradPoints, color: "#ec4899", active: true },
      ],
      xLabel: "Predicted Probability",
      yLabel: "Value",
      xRange: [0.05, 1] as [number, number],
      yRange: [-10, 5] as [number, number],
      currentX: 0.3,
    } as FunctionPlotStepData,
  });

  // Step 6: Hinge Loss
  steps.push({
    id: stepId++,
    description: "Hinge Loss: L = max(0, 1 - y*f(x)). Used in SVMs. Zero loss when prediction exceeds margin (>1). Creates a 'margin' of safety around the decision boundary.",
    action: "activate",
    highlights: [],
    data: {
      functions: [
        { name: "Hinge", points: hingePoints, color: "#22d3ee", active: true },
      ],
      xLabel: "Prediction Score",
      yLabel: "Hinge Loss",
      xRange: [-1, 3] as [number, number],
      yRange: [-0.5, 3] as [number, number],
      currentX: 1,
      annotations: [{ x: 1, y: 0, label: "Margin boundary" }],
    } as FunctionPlotStepData,
  });

  // Step 7: Huber Loss
  steps.push({
    id: stepId++,
    description: "Huber Loss: Combines MSE (for small errors) and MAE (for large errors). Robust to outliers while maintaining smooth gradients near the minimum.",
    action: "activate",
    highlights: [],
    data: {
      functions: [
        { name: "MSE", points: msePoints, color: "#6366f1", active: true },
        { name: "Huber", points: huberPoints, color: "#22c55e", active: true },
      ],
      xLabel: "Prediction",
      yLabel: "Loss",
      xRange: [-1, 3] as [number, number],
      yRange: [-0.5, 5] as [number, number],
      currentX: 1,
    } as FunctionPlotStepData,
  });

  // Step 8: MSE vs BCE comparison
  steps.push({
    id: stepId++,
    description: "MSE vs BCE: For classification, BCE is preferred because it penalizes confident wrong predictions much more harshly than MSE. MSE gradients can be very small for sigmoid outputs.",
    action: "compare",
    highlights: [],
    data: {
      functions: [
        { name: "MSE", points: generatePoints(x => (x - 1) ** 2, 0.01, 0.99, numPoints), color: "#6366f1", active: true },
        { name: "BCE", points: bcePoints, color: "#f59e0b", active: true },
      ],
      xLabel: "Predicted Probability (target=1)",
      yLabel: "Loss",
      xRange: [0, 1] as [number, number],
      yRange: [-0.5, 5] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 9: When to use each
  steps.push({
    id: stepId++,
    description: "Choosing a loss: MSE for regression, BCE for binary classification, Cross-Entropy for multi-class, Hinge for margin-based classifiers, Huber for outlier-robust regression.",
    action: "classify",
    highlights: [],
    data: {
      functions: [
        { name: "MSE", points: msePoints, color: "#6366f1", active: true },
        { name: "BCE", points: bcePoints, color: "#f59e0b", active: true },
        { name: "Hinge", points: hingePoints, color: "#22d3ee", active: true },
        { name: "Huber", points: huberPoints, color: "#22c55e", active: true },
      ],
      xLabel: "Prediction",
      yLabel: "Loss",
      xRange: [-1, 3] as [number, number],
      yRange: [-0.5, 5] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 10: Summary
  steps.push({
    id: stepId++,
    description: "Summary: Loss functions are the optimization objective. They connect predictions to learning by providing gradients for backpropagation. The right choice depends on the task type.",
    action: "complete",
    highlights: [],
    data: {
      functions: [
        { name: "MSE", points: msePoints, color: "#6366f1", active: true },
        { name: "BCE", points: bcePoints, color: "#f59e0b", active: true },
        { name: "Hinge", points: hingePoints, color: "#22d3ee", active: true },
      ],
      xLabel: "Prediction",
      yLabel: "Loss",
      xRange: [-1, 3] as [number, number],
      yRange: [-0.5, 5] as [number, number],
    } as FunctionPlotStepData,
  });

  return steps;
}
