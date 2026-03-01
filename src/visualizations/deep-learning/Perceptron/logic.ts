import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

interface PerceptronParams {
  learningRate: number;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function generatePerceptronSteps(params: PerceptronParams): VisualizationStep[] {
  const { learningRate } = params;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Fixed inputs for demonstration
  const x1 = 0.6;
  const x2 = 0.4;
  let w1 = 0.5;
  let w2 = -0.3;
  let bias = 0.1;
  const target = 1;

  const layers: NeuralNetStepData["layers"] = [
    { label: "Input", type: "input" },
    { label: "Output", type: "output" },
  ];

  function makeNeurons(vals?: { n0?: number; n1?: number; n2?: number }, highlights?: Record<string, string>): NeuronData[] {
    return [
      { id: "x1", layer: 0, index: 0, value: vals?.n0 ?? x1, label: "x₁", highlight: (highlights?.x1 as NeuronData["highlight"]) },
      { id: "x2", layer: 0, index: 1, value: vals?.n1 ?? x2, label: "x₂", highlight: (highlights?.x2 as NeuronData["highlight"]) },
      { id: "out", layer: 1, index: 0, value: vals?.n2, label: "y", highlight: (highlights?.out as NeuronData["highlight"]) },
    ];
  }

  function makeConnections(cw1: number, cw2: number, highlights?: Record<string, string>): ConnectionData[] {
    return [
      { source: "x1", target: "out", weight: cw1, highlight: (highlights?.c1 as ConnectionData["highlight"]) },
      { source: "x2", target: "out", weight: cw2, highlight: (highlights?.c2 as ConnectionData["highlight"]) },
    ];
  }

  // Step 1: Show architecture
  steps.push({
    id: stepId++,
    description: "A single Perceptron with 2 inputs (x₁, x₂), weights (w₁, w₂), a bias, and one output neuron.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(),
      connections: makeConnections(w1, w2),
      activationFunction: "step",
    } as NeuralNetStepData,
  });

  // Step 2: Show input values
  steps.push({
    id: stepId++,
    description: `Input values: x₁ = ${x1}, x₂ = ${x2}. These are fed into the neuron.`,
    action: "forward-pass",
    highlights: [{ indices: [0, 1], color: "neuron-input", label: "Inputs" }],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2 }, { x1: "neuron-input", x2: "neuron-input" }),
      connections: makeConnections(w1, w2),
      currentLayer: 0,
      activationFunction: "step",
    } as NeuralNetStepData,
  });

  // Step 3: Show weights
  steps.push({
    id: stepId++,
    description: `Weights: w₁ = ${w1.toFixed(2)}, w₂ = ${w2.toFixed(2)}, bias = ${bias.toFixed(2)}.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2 }),
      connections: makeConnections(w1, w2, { c1: "positive-weight", c2: "negative-weight" }),
      activationFunction: "step",
    } as NeuralNetStepData,
  });

  // Step 4: Compute weighted sum for x1
  const wx1 = x1 * w1;
  steps.push({
    id: stepId++,
    description: `Multiply: x₁ * w₁ = ${x1} * ${w1.toFixed(2)} = ${wx1.toFixed(3)}.`,
    action: "forward-pass",
    highlights: [{ indices: [0], color: "active", label: "x₁ * w₁" }],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2 }, { x1: "active" }),
      connections: makeConnections(w1, w2, { c1: "active" }),
      currentLayer: 0,
      activationFunction: "step",
    } as NeuralNetStepData,
    variables: { "x₁*w₁": wx1 },
  });

  // Step 5: Compute weighted sum for x2
  const wx2 = x2 * w2;
  steps.push({
    id: stepId++,
    description: `Multiply: x₂ * w₂ = ${x2} * ${w2.toFixed(2)} = ${wx2.toFixed(3)}.`,
    action: "forward-pass",
    highlights: [{ indices: [1], color: "active", label: "x₂ * w₂" }],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2 }, { x2: "active" }),
      connections: makeConnections(w1, w2, { c2: "active" }),
      currentLayer: 0,
      activationFunction: "step",
    } as NeuralNetStepData,
    variables: { "x₂*w₂": wx2 },
  });

  // Step 6: Sum all
  const weightedSum = wx1 + wx2 + bias;
  steps.push({
    id: stepId++,
    description: `Sum: (x₁*w₁) + (x₂*w₂) + bias = ${wx1.toFixed(3)} + ${wx2.toFixed(3)} + ${bias.toFixed(2)} = ${weightedSum.toFixed(3)}.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: weightedSum }),
      connections: makeConnections(w1, w2, { c1: "active", c2: "active" }),
      currentLayer: 1,
      activationFunction: "step",
    } as NeuralNetStepData,
    variables: { sum: weightedSum },
  });

  // Step 7: Apply activation
  const activated = sigmoid(weightedSum);
  const output = activated >= 0.5 ? 1 : 0;
  steps.push({
    id: stepId++,
    description: `Apply sigmoid activation: σ(${weightedSum.toFixed(3)}) = ${activated.toFixed(3)}. Threshold at 0.5 gives output = ${output}.`,
    action: "activate",
    highlights: [{ indices: [2], color: "neuron-output", label: "Activated" }],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: activated }, { out: "neuron-output" }),
      connections: makeConnections(w1, w2),
      currentLayer: 1,
      activationFunction: "sigmoid",
    } as NeuralNetStepData,
    variables: { output: activated },
  });

  // Step 8: Compare with target
  const error = target - output;
  steps.push({
    id: stepId++,
    description: `Compare output (${output}) with target (${target}). Error = target - output = ${error}.`,
    action: "compute-gradient",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: activated }, { out: error !== 0 ? "swapping" : "completed" }),
      connections: makeConnections(w1, w2),
      currentLayer: 1,
      lossValue: Math.abs(error),
    } as NeuralNetStepData,
    variables: { error },
  });

  // Step 9: Compute weight updates
  const dw1 = learningRate * error * x1;
  const dw2 = learningRate * error * x2;
  const db = learningRate * error;
  steps.push({
    id: stepId++,
    description: `Weight updates: Δw₁ = lr * error * x₁ = ${learningRate} * ${error} * ${x1} = ${dw1.toFixed(4)}, Δw₂ = ${dw2.toFixed(4)}, Δb = ${db.toFixed(4)}.`,
    action: "update-weights",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: activated }),
      connections: makeConnections(w1, w2, { c1: "gradient", c2: "gradient" }),
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
    variables: { "Δw₁": dw1, "Δw₂": dw2, "Δb": db },
  });

  // Step 10: Apply updates
  const newW1 = w1 + dw1;
  const newW2 = w2 + dw2;
  const newBias = bias + db;
  steps.push({
    id: stepId++,
    description: `Updated weights: w₁ = ${w1.toFixed(2)} + ${dw1.toFixed(4)} = ${newW1.toFixed(4)}, w₂ = ${w2.toFixed(2)} + ${dw2.toFixed(4)} = ${newW2.toFixed(4)}, bias = ${newBias.toFixed(4)}.`,
    action: "update-weights",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: activated }),
      connections: makeConnections(newW1, newW2, { c1: "positive-weight", c2: "negative-weight" }),
    } as NeuralNetStepData,
    variables: { w1: newW1, w2: newW2, bias: newBias },
  });

  // Step 11: Second forward pass with new weights
  w1 = newW1;
  w2 = newW2;
  bias = newBias;
  const newSum = x1 * w1 + x2 * w2 + bias;
  const newActivated = sigmoid(newSum);
  const newOutput = newActivated >= 0.5 ? 1 : 0;
  steps.push({
    id: stepId++,
    description: `Second forward pass with updated weights: sum = ${newSum.toFixed(3)}, σ(sum) = ${newActivated.toFixed(3)}, output = ${newOutput}.`,
    action: "forward-pass",
    highlights: [{ indices: [2], color: "neuron-output", label: "New output" }],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: newActivated }, { out: "neuron-output" }),
      connections: makeConnections(w1, w2),
      currentLayer: 1,
      dataFlowDirection: "forward",
      activationFunction: "sigmoid",
    } as NeuralNetStepData,
    variables: { sum: newSum, output: newActivated },
  });

  // Step 12: Check convergence
  const newError = target - newOutput;
  steps.push({
    id: stepId++,
    description: `New error = ${target} - ${newOutput} = ${newError}. ${newError === 0 ? "The perceptron now classifies correctly!" : "Still misclassifying; more training needed."}`,
    action: newError === 0 ? "complete" : "compute-gradient",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: newActivated }, { out: newError === 0 ? "completed" : "swapping" }),
      connections: makeConnections(w1, w2),
      currentLayer: 1,
      lossValue: Math.abs(newError),
    } as NeuralNetStepData,
    variables: { error: newError },
  });

  // Step 13: Show learning rate effect
  steps.push({
    id: stepId++,
    description: `Learning rate = ${learningRate}. Higher values cause larger weight updates (faster but potentially unstable). Lower values are more stable but slower.`,
    action: "train",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: newActivated }),
      connections: makeConnections(w1, w2),
      activationFunction: "sigmoid",
    } as NeuralNetStepData,
    variables: { learningRate },
  });

  // Step 14: Decision boundary concept
  steps.push({
    id: stepId++,
    description: `The Perceptron defines a linear decision boundary: w₁*x₁ + w₂*x₂ + b = 0. Points on one side are class 1, the other side class 0.`,
    action: "classify",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: newActivated }, { out: "completed" }),
      connections: makeConnections(w1, w2, { c1: "positive-weight", c2: "negative-weight" }),
    } as NeuralNetStepData,
  });

  // Step 15: Summary
  steps.push({
    id: stepId++,
    description: `Perceptron complete! A single neuron computes: output = σ(w₁x₁ + w₂x₂ + b). Training adjusts weights to minimize classification errors via the perceptron learning rule.`,
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons({ n0: x1, n1: x2, n2: newActivated }, { x1: "completed", x2: "completed", out: "completed" }),
      connections: makeConnections(w1, w2, { c1: "completed", c2: "completed" }),
    } as NeuralNetStepData,
  });

  return steps;
}
