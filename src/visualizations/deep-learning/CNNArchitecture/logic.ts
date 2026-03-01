import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

/**
 * CNN Architecture pipeline:
 * Input -> Conv1 -> ReLU1 -> Pool1 -> Conv2 -> ReLU2 -> Pool2 -> Flatten -> Dense -> Output
 */

const LAYERS: NeuralNetStepData["layers"] = [
  { label: "Input", type: "input" },
  { label: "Conv1", type: "conv" },
  { label: "ReLU1", type: "hidden" },
  { label: "Pool1", type: "pool" },
  { label: "Conv2", type: "conv" },
  { label: "ReLU2", type: "hidden" },
  { label: "Pool2", type: "pool" },
  { label: "Flatten", type: "hidden" },
  { label: "Dense", type: "hidden" },
  { label: "Output", type: "output" },
];

const NEURONS_PER_LAYER = [3, 4, 4, 3, 4, 4, 3, 4, 3, 2];

function buildNeurons(): NeuronData[] {
  const neurons: NeuronData[] = [];
  for (let layerIdx = 0; layerIdx < LAYERS.length; layerIdx++) {
    const count = NEURONS_PER_LAYER[layerIdx];
    for (let i = 0; i < count; i++) {
      neurons.push({
        id: `L${layerIdx}-N${i}`,
        layer: layerIdx,
        index: i,
        value: undefined,
      });
    }
  }
  return neurons;
}

function buildConnections(): ConnectionData[] {
  const connections: ConnectionData[] = [];
  for (let layerIdx = 0; layerIdx < LAYERS.length - 1; layerIdx++) {
    const srcCount = NEURONS_PER_LAYER[layerIdx];
    const tgtCount = NEURONS_PER_LAYER[layerIdx + 1];
    // For conv/pool layers connect sparsely (3 per neuron), for dense connect fully
    const isDense = layerIdx >= 7;
    for (let s = 0; s < srcCount; s++) {
      for (let t = 0; t < tgtCount; t++) {
        if (isDense || Math.abs(s - t) <= 1 || srcCount <= 3) {
          connections.push({
            source: `L${layerIdx}-N${s}`,
            target: `L${layerIdx + 1}-N${t}`,
            weight: 0.3 + Math.random() * 0.4,
          });
        }
      }
    }
  }
  return connections;
}

export function generateCNNArchitectureSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const baseNeurons = buildNeurons();
  const baseConnections = buildConnections();

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: "CNN Architecture: Input -> Conv -> ReLU -> Pool -> Conv -> ReLU -> Pool -> Flatten -> Dense -> Output. Data flows left to right through each stage.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers: LAYERS,
      neurons: baseNeurons.map((n) => ({ ...n })),
      connections: baseConnections.map((c) => ({ ...c })),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Walk through each layer
  const layerDescriptions = [
    "Input layer receives the raw image pixels (e.g., 32x32x3 for RGB). Each neuron represents a pixel channel.",
    "Conv1: Learnable 3x3 kernels slide across the input, detecting low-level features like edges and textures.",
    "ReLU1: Applies ReLU activation (max(0, x)) element-wise, introducing non-linearity. Negative values become 0.",
    "Pool1: Max pooling (2x2) halves spatial dimensions, keeping strongest activations. Provides translation invariance.",
    "Conv2: Second convolutional layer detects higher-level features (corners, patterns) by combining Conv1 features.",
    "ReLU2: Another ReLU activation after Conv2. Non-linearity allows the network to learn complex functions.",
    "Pool2: Second max pooling further reduces spatial dimensions. The feature maps are now compact but feature-rich.",
    "Flatten: Reshapes the 2D feature maps into a 1D vector. This bridges convolutional and fully connected layers.",
    "Dense: Fully connected layer that combines all features to form high-level representations for classification.",
    "Output: Final layer with one neuron per class. Softmax converts raw scores to probabilities.",
  ];

  for (let targetLayer = 0; targetLayer < LAYERS.length; targetLayer++) {
    const neurons = baseNeurons.map((n) => {
      if (n.layer === targetLayer) {
        return { ...n, highlight: "neuron-input" as const, value: Math.round(Math.random() * 10) / 10 };
      }
      if (n.layer < targetLayer) {
        return { ...n, highlight: "completed" as const, value: Math.round(Math.random() * 10) / 10 };
      }
      return { ...n };
    });

    const connections = baseConnections.map((c) => {
      const srcLayer = parseInt(c.source.split("-")[0].replace("L", ""));
      if (srcLayer === targetLayer - 1) {
        return { ...c, highlight: "neuron-hidden" as const };
      }
      if (srcLayer < targetLayer - 1) {
        return { ...c, highlight: "completed" as const };
      }
      return { ...c };
    });

    steps.push({
      id: stepId++,
      description: layerDescriptions[targetLayer],
      action: "forward-pass",
      highlights: [],
      data: {
        layers: LAYERS,
        neurons,
        connections,
        currentLayer: targetLayer,
        dataFlowDirection: "forward",
      } as NeuralNetStepData,
    });
  }

  // Final summary
  steps.push({
    id: stepId++,
    description: "Forward pass complete! Data flowed through: convolution (feature extraction) -> pooling (downsampling) -> dense (classification). CNNs learn hierarchical features -- from edges to textures to objects.",
    action: "complete",
    highlights: [],
    data: {
      layers: LAYERS,
      neurons: baseNeurons.map((n) => ({ ...n, highlight: "completed" as const, value: Math.round(Math.random() * 10) / 10 })),
      connections: baseConnections.map((c) => ({ ...c, highlight: "completed" as const })),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  return steps;
}
