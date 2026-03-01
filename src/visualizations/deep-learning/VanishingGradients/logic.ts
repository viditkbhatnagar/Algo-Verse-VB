import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s / 2147483647) - 0.5;
  };
}

export function generateVanishingGradientsSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const rand = seededRandom(42);

  const numLayers = 6;
  const neuronsPerLayer = 3;

  const layerLabels = ["Input", "L1", "L2", "L3", "L4", "Output"];
  const layerTypes: NeuralNetStepData["layers"][0]["type"][] = ["input", "hidden", "hidden", "hidden", "hidden", "output"];

  const layers: NeuralNetStepData["layers"] = layerLabels.map((label, i) => ({
    label,
    type: layerTypes[i],
  }));

  // Simulate gradient magnitudes per layer (exponential decay with sigmoid)
  const gradientMagnitudes: number[] = [];
  let grad = 1.0;
  for (let l = numLayers - 1; l >= 0; l--) {
    gradientMagnitudes.unshift(grad);
    grad *= 0.22; // sigmoid derivative max ~0.25, with weight scaling ~0.22
  }

  // ReLU gradient magnitudes (stay near 1.0)
  const reluGradients: number[] = [];
  let rGrad = 1.0;
  for (let l = numLayers - 1; l >= 0; l--) {
    reluGradients.unshift(rGrad);
    rGrad *= 0.85; // much less decay with ReLU
  }

  function buildNeurons(
    gradients?: number[],
    highlightedLayer?: number,
    highlightColor?: NeuronData["highlight"]
  ): NeuronData[] {
    const neurons: NeuronData[] = [];
    for (let l = 0; l < numLayers; l++) {
      for (let n = 0; n < neuronsPerLayer; n++) {
        neurons.push({
          id: `n${l}-${n}`,
          layer: l,
          index: n,
          value: gradients ? gradients[l] : 0.5 + rand() * 0.3,
          gradient: gradients ? gradients[l] : undefined,
          highlight: l === highlightedLayer ? highlightColor : undefined,
        });
      }
    }
    return neurons;
  }

  function buildConnections(
    highlightedLayer?: number,
    highlightColor?: ConnectionData["highlight"]
  ): ConnectionData[] {
    const conns: ConnectionData[] = [];
    for (let l = 0; l < numLayers - 1; l++) {
      for (let j = 0; j < neuronsPerLayer; j++) {
        for (let i = 0; i < neuronsPerLayer; i++) {
          conns.push({
            source: `n${l}-${i}`,
            target: `n${l + 1}-${j}`,
            weight: rand() * 0.4,
            highlight: l === highlightedLayer ? highlightColor : undefined,
          });
        }
      }
    }
    return conns;
  }

  // Step 1: Deep network
  steps.push({
    id: stepId++,
    description: `A ${numLayers}-layer deep network with sigmoid activations. We will observe how gradient magnitudes change as they flow backward through the layers.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(),
      connections: buildConnections(),
    } as NeuralNetStepData,
  });

  // Step 2: Forward pass complete
  steps.push({
    id: stepId++,
    description: "Forward pass completed. Now computing loss at the output layer and starting backpropagation to compute gradients.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(undefined, numLayers - 1, "neuron-output"),
      connections: buildConnections(),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 3: Output gradient (strong)
  steps.push({
    id: stepId++,
    description: `Output layer (L5): Gradient magnitude = ${gradientMagnitudes[5].toFixed(4)}. Strong gradient signal drives weight updates effectively.`,
    action: "backprop",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons([0, 0, 0, 0, 0, gradientMagnitudes[5]], 5, "gradient"),
      connections: buildConnections(),
      currentLayer: 5,
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
    variables: { gradient_L5: gradientMagnitudes[5] },
  });

  // Steps 4-7: Gradient flowing backward through layers
  for (let l = 4; l >= 1; l--) {
    const layerGrads = new Array(numLayers).fill(0);
    for (let k = l; k < numLayers; k++) layerGrads[k] = gradientMagnitudes[k];

    const severity = gradientMagnitudes[l] < 0.01 ? "nearly zero" : gradientMagnitudes[l] < 0.1 ? "very small" : "reduced";

    steps.push({
      id: stepId++,
      description: `Layer ${layerLabels[l]}: Gradient = ${gradientMagnitudes[l].toFixed(6)} (${severity}). Sigmoid derivative (max 0.25) multiplied at each layer causes exponential decay.`,
      action: "backprop",
      highlights: [],
      data: {
        layers,
        neurons: buildNeurons(layerGrads, l, "gradient"),
        connections: buildConnections(l, "gradient"),
        currentLayer: l,
        dataFlowDirection: "backward",
      } as NeuralNetStepData,
      variables: { [`gradient_${layerLabels[l]}`]: gradientMagnitudes[l] },
    });
  }

  // Step 8: Show all gradient magnitudes
  steps.push({
    id: stepId++,
    description: `All gradient magnitudes: [${gradientMagnitudes.map(g => g.toFixed(6)).join(", ")}]. Early layers have gradients ${(gradientMagnitudes[5] / gradientMagnitudes[0]).toFixed(0)}x smaller than the output!`,
    action: "backprop",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(gradientMagnitudes),
      connections: buildConnections(),
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
  });

  // Step 9: Why it happens
  steps.push({
    id: stepId++,
    description: "Root cause: sigmoid derivative is at most 0.25. Chain rule multiplies these: 0.25^5 = 0.001. Gradients shrink exponentially with depth.",
    action: "compute-gradient",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(gradientMagnitudes),
      connections: buildConnections(),
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
  });

  // Step 10: Solution - ReLU
  steps.push({
    id: stepId++,
    description: `Solution 1: ReLU activation. ReLU'(x) = 1 for x > 0. Gradients: [${reluGradients.map(g => g.toFixed(4)).join(", ")}]. Much less decay!`,
    action: "activate",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(reluGradients),
      connections: buildConnections(),
      dataFlowDirection: "backward",
      activationFunction: "ReLU",
    } as NeuralNetStepData,
  });

  // Step 11: Solution - Skip connections
  steps.push({
    id: stepId++,
    description: "Solution 2: Residual (skip) connections. Gradient flows directly through shortcut paths, bypassing the vanishing multiplication chain. Enables 100+ layer networks.",
    action: "highlight",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(reluGradients, 0, "completed"),
      connections: buildConnections(),
    } as NeuralNetStepData,
  });

  // Step 12: Solution - Batch norm + initialization
  steps.push({
    id: stepId++,
    description: "Solution 3: Batch normalization normalizes activations to prevent saturation. He/Xavier initialization sets weights to preserve variance across layers.",
    action: "train",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(reluGradients),
      connections: buildConnections(),
    } as NeuralNetStepData,
  });

  // Step 13: Summary
  steps.push({
    id: stepId++,
    description: "Summary: Vanishing gradients occur when sigmoid/tanh derivatives (< 1) are chained through many layers. Solutions: ReLU, skip connections, batch norm, proper initialization.",
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: (() => {
        const ns = buildNeurons(reluGradients);
        return ns.map(n => ({ ...n, highlight: "completed" as NeuronData["highlight"] }));
      })(),
      connections: buildConnections(),
    } as NeuralNetStepData,
  });

  return steps;
}
