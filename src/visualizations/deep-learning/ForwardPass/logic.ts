import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

function relu(x: number): number {
  return Math.max(0, x);
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, x))));
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s / 2147483647) - 0.5;
  };
}

export function generateForwardPassSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const rand = seededRandom(7);

  const layerSizes = [3, 4, 3, 2];
  const layerLabels = ["Input", "Hidden 1", "Hidden 2", "Output"];
  const layerTypes: NeuralNetStepData["layers"][0]["type"][] = ["input", "hidden", "hidden", "output"];

  const layers: NeuralNetStepData["layers"] = layerLabels.map((label, i) => ({
    label,
    type: layerTypes[i],
  }));

  const inputs = [0.7, 0.4, 0.9];

  // Initialize weights between layers
  const allWeights: number[][][] = [];
  const allBiases: number[][] = [];
  for (let l = 0; l < layerSizes.length - 1; l++) {
    const w: number[][] = [];
    const b: number[] = [];
    for (let j = 0; j < layerSizes[l + 1]; j++) {
      w.push([]);
      for (let i = 0; i < layerSizes[l]; i++) {
        w[j].push(rand() * 0.6);
      }
      b.push(rand() * 0.1);
    }
    allWeights.push(w);
    allBiases.push(b);
  }

  // Store activations for each layer
  const activations: number[][] = [inputs];

  function buildNeurons(
    currentActivations: number[][],
    highlightedLayer?: number,
    highlightColor?: NeuronData["highlight"]
  ): NeuronData[] {
    const neurons: NeuronData[] = [];
    for (let l = 0; l < layerSizes.length; l++) {
      for (let n = 0; n < layerSizes[l]; n++) {
        neurons.push({
          id: `n${l}-${n}`,
          layer: l,
          index: n,
          value: currentActivations[l]?.[n],
          highlight: l === highlightedLayer ? highlightColor : undefined,
        });
      }
    }
    return neurons;
  }

  function buildConnections(
    highlightedLayerPair?: number,
    highlightColor?: ConnectionData["highlight"]
  ): ConnectionData[] {
    const conns: ConnectionData[] = [];
    for (let l = 0; l < layerSizes.length - 1; l++) {
      for (let j = 0; j < layerSizes[l + 1]; j++) {
        for (let i = 0; i < layerSizes[l]; i++) {
          conns.push({
            source: `n${l}-${i}`,
            target: `n${l + 1}-${j}`,
            weight: allWeights[l][j][i],
            highlight: l === highlightedLayerPair ? highlightColor : undefined,
          });
        }
      }
    }
    return conns;
  }

  // Step 1: Show architecture
  steps.push({
    id: stepId++,
    description: `Network architecture: ${layerSizes.join(" → ")} neurons. Data flows left to right through ${layerSizes.length - 1} sets of weights.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons([inputs]),
      connections: buildConnections(),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 2: Highlight input layer
  steps.push({
    id: stepId++,
    description: `Input layer receives data: [${inputs.map(v => v.toFixed(1)).join(", ")}]. Each value feeds into every neuron in Hidden 1.`,
    action: "forward-pass",
    highlights: [{ indices: [0, 1, 2], color: "neuron-input", label: "Input values" }],
    data: {
      layers,
      neurons: buildNeurons([inputs], 0, "neuron-input"),
      connections: buildConnections(),
      currentLayer: 0,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Forward pass through each layer
  for (let l = 0; l < layerSizes.length - 1; l++) {
    const prevA = activations[l];
    const layerA: number[] = [];

    // Step: Weighted sum for this layer
    steps.push({
      id: stepId++,
      description: `Layer ${l + 1} (${layerLabels[l + 1]}): Computing weighted sums from ${layerLabels[l]}. Each neuron: z = Σ(aᵢ * wᵢ) + b.`,
      action: "forward-pass",
      highlights: [],
      data: {
        layers,
        neurons: buildNeurons(activations),
        connections: buildConnections(l, "active"),
        currentLayer: l,
        dataFlowDirection: "forward",
      } as NeuralNetStepData,
    });

    // Compute activations
    for (let j = 0; j < layerSizes[l + 1]; j++) {
      let z = allBiases[l][j];
      for (let i = 0; i < layerSizes[l]; i++) {
        z += prevA[i] * allWeights[l][j][i];
      }
      const a = l < layerSizes.length - 2 ? relu(z) : sigmoid(z);
      layerA.push(a);
    }

    activations.push(layerA);

    const activationType = l < layerSizes.length - 2 ? "ReLU" : "sigmoid";
    const hlColor: NeuronData["highlight"] = l + 1 === layerSizes.length - 1 ? "neuron-output" : "neuron-hidden";

    // Step: Show activated values
    steps.push({
      id: stepId++,
      description: `${layerLabels[l + 1]} activated (${activationType}): [${layerA.map(v => v.toFixed(3)).join(", ")}]. Values propagate to the next layer.`,
      action: "activate",
      highlights: [],
      data: {
        layers,
        neurons: buildNeurons(activations, l + 1, hlColor),
        connections: buildConnections(),
        currentLayer: l + 1,
        dataFlowDirection: "forward",
        activationFunction: activationType,
      } as NeuralNetStepData,
    });
  }

  // Step: Data has reached output
  const finalOutput = activations[activations.length - 1];
  steps.push({
    id: stepId++,
    description: `Forward pass complete! Output: [${finalOutput.map(v => v.toFixed(3)).join(", ")}]. The network has transformed ${layerSizes[0]}D input into ${layerSizes[layerSizes.length - 1]}D output.`,
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(activations, layerSizes.length - 1, "completed"),
      connections: buildConnections(),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step: Interpretation
  steps.push({
    id: stepId++,
    description: `The output [${finalOutput.map(v => v.toFixed(3)).join(", ")}] can be interpreted as class probabilities. The higher value (y${finalOutput[0] > finalOutput[1] ? "1" : "2"} = ${Math.max(...finalOutput).toFixed(3)}) is the predicted class.`,
    action: "classify",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(activations, layerSizes.length - 1, "completed"),
      connections: buildConnections(),
    } as NeuralNetStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `Forward pass summary: Input → (W₁, ReLU) → (W₂, ReLU) → (W₃, sigmoid) → Output. Each layer transforms representations, enabling the network to learn complex non-linear mappings.`,
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: (() => {
        const neurons = buildNeurons(activations);
        return neurons.map(n => ({ ...n, highlight: "completed" as NeuronData["highlight"] }));
      })(),
      connections: buildConnections(),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  return steps;
}
