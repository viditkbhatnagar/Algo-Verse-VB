import type {
  VisualizationStep,
  FunctionPlotStepData,
  FunctionPlotPoint,
} from "@/lib/visualization/types";

function reluFn(x: number): number {
  return Math.max(0, x);
}

function sigmoidFn(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function tanhFn(x: number): number {
  return Math.tanh(x);
}

function leakyReluFn(x: number): number {
  return x > 0 ? x : 0.1 * x;
}

function reluDerivFn(x: number): number {
  return x > 0 ? 1 : 0;
}

function sigmoidDerivFn(x: number): number {
  const s = sigmoidFn(x);
  return s * (1 - s);
}

function tanhDerivFn(x: number): number {
  return 1 - Math.tanh(x) ** 2;
}

function generatePoints(fn: (x: number) => number, xMin: number, xMax: number, n: number): FunctionPlotPoint[] {
  const points: FunctionPlotPoint[] = [];
  for (let i = 0; i <= n; i++) {
    const x = xMin + (xMax - xMin) * (i / n);
    points.push({ x, y: fn(x) });
  }
  return points;
}

interface ActivationFunctionsParams {
  functionType: string;
}

export function generateActivationFunctionsSteps(params: ActivationFunctionsParams): VisualizationStep[] {
  const { functionType } = params;
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const xRange: [number, number] = [-5, 5];
  const numPoints = 200;

  const reluPoints = generatePoints(reluFn, xRange[0], xRange[1], numPoints);
  const sigmoidPoints = generatePoints(sigmoidFn, xRange[0], xRange[1], numPoints);
  const tanhPoints = generatePoints(tanhFn, xRange[0], xRange[1], numPoints);
  const leakyReluPoints = generatePoints(leakyReluFn, xRange[0], xRange[1], numPoints);

  const reluDerivPoints = generatePoints(reluDerivFn, xRange[0], xRange[1], numPoints);
  const sigmoidDerivPoints = generatePoints(sigmoidDerivFn, xRange[0], xRange[1], numPoints);
  const tanhDerivPoints = generatePoints(tanhDerivFn, xRange[0], xRange[1], numPoints);

  const allFunctions = [
    { name: "ReLU", points: reluPoints, color: "#6366f1" },
    { name: "Sigmoid", points: sigmoidPoints, color: "#f59e0b" },
    { name: "Tanh", points: tanhPoints, color: "#22d3ee" },
    { name: "Leaky ReLU", points: leakyReluPoints, color: "#22c55e" },
  ];

  // Step 1: Overview of all activation functions
  steps.push({
    id: stepId++,
    description: "Activation functions introduce non-linearity into neural networks. Here are the four most common: ReLU, Sigmoid, Tanh, and Leaky ReLU.",
    action: "highlight",
    highlights: [],
    data: {
      functions: allFunctions.map(f => ({ ...f, active: true })),
      xLabel: "Input (z)",
      yLabel: "Output f(z)",
      xRange,
      yRange: [-1.5, 5] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 2: Focus on ReLU
  steps.push({
    id: stepId++,
    description: "ReLU (Rectified Linear Unit): f(x) = max(0, x). Simple, fast, and the default choice for hidden layers. Zero for negative inputs, linear for positive.",
    action: "activate",
    highlights: [],
    data: {
      functions: allFunctions.map(f => ({ ...f, active: f.name === "ReLU" })),
      xLabel: "Input (z)",
      yLabel: "ReLU(z)",
      xRange,
      yRange: [-1.5, 5] as [number, number],
      currentX: 0,
    } as FunctionPlotStepData,
  });

  // Step 3: ReLU properties
  steps.push({
    id: stepId++,
    description: "ReLU advantages: no vanishing gradient for positive values (derivative = 1), computationally cheap. Disadvantage: 'dying ReLU' -- neurons with negative input always output 0.",
    action: "activate",
    highlights: [],
    data: {
      functions: [
        { name: "ReLU", points: reluPoints, color: "#6366f1", active: true },
        { name: "ReLU'", points: reluDerivPoints, color: "#ec4899", active: true },
      ],
      xLabel: "Input (z)",
      yLabel: "Value",
      xRange,
      yRange: [-0.5, 5] as [number, number],
      currentX: 2,
      annotations: [{ x: 0, y: 0, label: "Kink at 0" }],
    } as FunctionPlotStepData,
  });

  // Step 4: Focus on Sigmoid
  steps.push({
    id: stepId++,
    description: "Sigmoid: f(x) = 1/(1+e^(-x)). Squashes input to (0, 1). Used for binary classification outputs and probability estimation.",
    action: "activate",
    highlights: [],
    data: {
      functions: allFunctions.map(f => ({ ...f, active: f.name === "Sigmoid" })),
      xLabel: "Input (z)",
      yLabel: "σ(z)",
      xRange,
      yRange: [-0.5, 1.5] as [number, number],
      currentX: 0,
      annotations: [{ x: 0, y: 0.5, label: "σ(0) = 0.5" }],
    } as FunctionPlotStepData,
  });

  // Step 5: Sigmoid derivative
  steps.push({
    id: stepId++,
    description: "Sigmoid derivative: σ'(x) = σ(x)(1 - σ(x)). Maximum at x=0 (0.25). Vanishes for large |x|, causing the vanishing gradient problem in deep networks.",
    action: "activate",
    highlights: [],
    data: {
      functions: [
        { name: "Sigmoid", points: sigmoidPoints, color: "#f59e0b", active: true },
        { name: "Sigmoid'", points: sigmoidDerivPoints, color: "#ec4899", active: true },
      ],
      xLabel: "Input (z)",
      yLabel: "Value",
      xRange,
      yRange: [-0.2, 1.2] as [number, number],
      currentX: 0,
      annotations: [{ x: 0, y: 0.25, label: "Max gradient = 0.25" }],
    } as FunctionPlotStepData,
  });

  // Step 6: Focus on Tanh
  steps.push({
    id: stepId++,
    description: "Tanh: f(x) = (e^x - e^(-x))/(e^x + e^(-x)). Squashes to (-1, 1). Zero-centered, which helps optimization. Stronger gradients than sigmoid.",
    action: "activate",
    highlights: [],
    data: {
      functions: allFunctions.map(f => ({ ...f, active: f.name === "Tanh" })),
      xLabel: "Input (z)",
      yLabel: "tanh(z)",
      xRange,
      yRange: [-1.5, 1.5] as [number, number],
      currentX: 0,
      annotations: [{ x: 0, y: 0, label: "tanh(0) = 0" }],
    } as FunctionPlotStepData,
  });

  // Step 7: Tanh derivative
  steps.push({
    id: stepId++,
    description: "Tanh derivative: tanh'(x) = 1 - tanh(x)^2. Maximum of 1.0 at x=0 (4x stronger than sigmoid's max). Still vanishes for large |x|.",
    action: "activate",
    highlights: [],
    data: {
      functions: [
        { name: "Tanh", points: tanhPoints, color: "#22d3ee", active: true },
        { name: "Tanh'", points: tanhDerivPoints, color: "#ec4899", active: true },
      ],
      xLabel: "Input (z)",
      yLabel: "Value",
      xRange,
      yRange: [-1.5, 1.5] as [number, number],
      currentX: 0,
    } as FunctionPlotStepData,
  });

  // Step 8: Leaky ReLU
  steps.push({
    id: stepId++,
    description: "Leaky ReLU: f(x) = x if x > 0, else α*x (α=0.01 or 0.1). Fixes 'dying ReLU' by allowing small gradient for negative inputs.",
    action: "activate",
    highlights: [],
    data: {
      functions: [
        { name: "ReLU", points: reluPoints, color: "#6366f1", active: true },
        { name: "Leaky ReLU", points: leakyReluPoints, color: "#22c55e", active: true },
      ],
      xLabel: "Input (z)",
      yLabel: "Output",
      xRange,
      yRange: [-1.5, 5] as [number, number],
      currentX: -2,
    } as FunctionPlotStepData,
  });

  // Step 9: Compare sigmoid vs tanh
  steps.push({
    id: stepId++,
    description: "Sigmoid vs Tanh: Tanh is a scaled/shifted sigmoid: tanh(x) = 2*sigmoid(2x) - 1. Tanh is preferred in hidden layers because it is zero-centered.",
    action: "compare",
    highlights: [],
    data: {
      functions: [
        { name: "Sigmoid", points: sigmoidPoints, color: "#f59e0b", active: true },
        { name: "Tanh", points: tanhPoints, color: "#22d3ee", active: true },
      ],
      xLabel: "Input (z)",
      yLabel: "Output",
      xRange,
      yRange: [-1.5, 1.5] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 10: Compare all derivatives
  steps.push({
    id: stepId++,
    description: "Derivative comparison: ReLU has constant gradient (1) for positive inputs. Sigmoid and Tanh derivatives vanish for large |x|, limiting gradient flow in deep networks.",
    action: "compare",
    highlights: [],
    data: {
      functions: [
        { name: "ReLU'", points: reluDerivPoints, color: "#6366f1", active: true },
        { name: "Sigmoid'", points: sigmoidDerivPoints, color: "#f59e0b", active: true },
        { name: "Tanh'", points: tanhDerivPoints, color: "#22d3ee", active: true },
      ],
      xLabel: "Input (z)",
      yLabel: "Derivative",
      xRange,
      yRange: [-0.2, 1.5] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 11: Practical guidance based on selected function
  const guidanceMap: Record<string, string> = {
    relu: "ReLU is the go-to choice for hidden layers. Use it unless you have a specific reason not to.",
    sigmoid: "Use sigmoid only for binary classification output layers. Avoid in hidden layers due to vanishing gradients.",
    tanh: "Use tanh when you need zero-centered outputs, especially in RNNs and LSTMs.",
    leakyRelu: "Use Leaky ReLU when you notice dying neurons with standard ReLU.",
  };

  steps.push({
    id: stepId++,
    description: guidanceMap[functionType] || "Each activation function has trade-offs. ReLU for hidden layers, sigmoid for binary output, softmax for multi-class output.",
    action: "classify",
    highlights: [],
    data: {
      functions: allFunctions.map(f => ({
        ...f,
        active: f.name.toLowerCase().replace(/\s+/g, "") === functionType.replace(/\s+/g, "") || functionType === "all",
      })),
      xLabel: "Input (z)",
      yLabel: "Output",
      xRange,
      yRange: [-1.5, 5] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 12: Summary
  steps.push({
    id: stepId++,
    description: "Summary: Activation functions enable non-linearity. ReLU (fast, no vanishing gradient), Sigmoid (probability output), Tanh (zero-centered), Leaky ReLU (no dead neurons).",
    action: "complete",
    highlights: [],
    data: {
      functions: allFunctions.map(f => ({ ...f, active: true })),
      xLabel: "Input (z)",
      yLabel: "Output f(z)",
      xRange,
      yRange: [-1.5, 5] as [number, number],
    } as FunctionPlotStepData,
  });

  return steps;
}
