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

export function generateBackpropagationSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const rand = seededRandom(13);

  const layerSizes = [2, 3, 2];
  const layerLabels = ["Input", "Hidden", "Output"];
  const layerTypes: NeuralNetStepData["layers"][0]["type"][] = ["input", "hidden", "output"];

  const layers: NeuralNetStepData["layers"] = layerLabels.map((label, i) => ({
    label,
    type: layerTypes[i],
  }));

  const inputs = [0.6, 0.9];
  const target = [1, 0];

  // Weights
  const wIH: number[][] = [];
  for (let h = 0; h < 3; h++) {
    wIH.push([]);
    for (let i = 0; i < 2; i++) {
      wIH[h].push(rand() * 0.6);
    }
  }
  const wHO: number[][] = [];
  for (let o = 0; o < 2; o++) {
    wHO.push([]);
    for (let h = 0; h < 3; h++) {
      wHO[o].push(rand() * 0.6);
    }
  }
  const bH = [0.1, -0.05, 0.08];
  const bO = [0.05, -0.02];

  // Forward pass computation
  const hiddenZ: number[] = [];
  const hiddenA: number[] = [];
  for (let h = 0; h < 3; h++) {
    let z = bH[h];
    for (let i = 0; i < 2; i++) z += inputs[i] * wIH[h][i];
    hiddenZ.push(z);
    hiddenA.push(relu(z));
  }

  const outputZ: number[] = [];
  const outputA: number[] = [];
  for (let o = 0; o < 2; o++) {
    let z = bO[o];
    for (let h = 0; h < 3; h++) z += hiddenA[h] * wHO[o][h];
    outputZ.push(z);
    outputA.push(sigmoid(z));
  }

  // Loss: MSE
  const loss = outputA.reduce((s, a, i) => s + (a - target[i]) ** 2, 0) / 2;

  // Backward pass: output gradients
  const dOutputA = outputA.map((a, i) => a - target[i]);
  const dOutputZ = outputA.map((a, i) => dOutputA[i] * a * (1 - a)); // sigmoid derivative

  // Hidden gradients
  const dHiddenA: number[] = new Array(3).fill(0);
  for (let h = 0; h < 3; h++) {
    for (let o = 0; o < 2; o++) {
      dHiddenA[h] += dOutputZ[o] * wHO[o][h];
    }
  }
  const dHiddenZ = dHiddenA.map((da, h) => da * (hiddenZ[h] > 0 ? 1 : 0)); // relu derivative

  function buildNeurons(
    hVals: (number | undefined)[],
    oVals: (number | undefined)[],
    neuronHighlights?: Record<string, NeuronData["highlight"]>,
    gradients?: Record<string, number>
  ): NeuronData[] {
    const neurons: NeuronData[] = [];
    for (let i = 0; i < 2; i++) {
      neurons.push({
        id: `i${i}`, layer: 0, index: i, value: inputs[i], label: `x${i + 1}`,
        highlight: neuronHighlights?.[`i${i}`],
      });
    }
    for (let h = 0; h < 3; h++) {
      neurons.push({
        id: `h${h}`, layer: 1, index: h, value: hVals[h], label: `h${h + 1}`,
        highlight: neuronHighlights?.[`h${h}`],
        gradient: gradients?.[`h${h}`],
      });
    }
    for (let o = 0; o < 2; o++) {
      neurons.push({
        id: `o${o}`, layer: 2, index: o, value: oVals[o], label: `y${o + 1}`,
        highlight: neuronHighlights?.[`o${o}`],
        gradient: gradients?.[`o${o}`],
      });
    }
    return neurons;
  }

  function buildConnections(
    connHighlights?: Record<string, ConnectionData["highlight"]>,
    connGradients?: Record<string, number>
  ): ConnectionData[] {
    const conns: ConnectionData[] = [];
    for (let h = 0; h < 3; h++) {
      for (let i = 0; i < 2; i++) {
        const key = `i${i}-h${h}`;
        conns.push({
          source: `i${i}`, target: `h${h}`, weight: wIH[h][i],
          highlight: connHighlights?.[key],
          gradient: connGradients?.[key],
        });
      }
    }
    for (let o = 0; o < 2; o++) {
      for (let h = 0; h < 3; h++) {
        const key = `h${h}-o${o}`;
        conns.push({
          source: `h${h}`, target: `o${o}`, weight: wHO[o][h],
          highlight: connHighlights?.[key],
          gradient: connGradients?.[key],
        });
      }
    }
    return conns;
  }

  // Step 1: Show network
  steps.push({
    id: stepId++,
    description: "A 2-3-2 neural network. We will perform a forward pass, compute loss, then backpropagate gradients to update all weights.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(new Array(3).fill(undefined), new Array(2).fill(undefined)),
      connections: buildConnections(),
    } as NeuralNetStepData,
  });

  // Step 2: Forward pass - input
  steps.push({
    id: stepId++,
    description: `Forward pass: inputs x₁=${inputs[0]}, x₂=${inputs[1]} propagate through the network.`,
    action: "forward-pass",
    highlights: [{ indices: [0, 1], color: "neuron-input", label: "Input" }],
    data: {
      layers,
      neurons: buildNeurons(new Array(3).fill(undefined), new Array(2).fill(undefined), { i0: "neuron-input", i1: "neuron-input" }),
      connections: buildConnections(),
      currentLayer: 0,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 3: Hidden layer computed
  steps.push({
    id: stepId++,
    description: `Hidden activations (ReLU): [${hiddenA.map(v => v.toFixed(3)).join(", ")}].`,
    action: "activate",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, new Array(2).fill(undefined), { h0: "neuron-hidden", h1: "neuron-hidden", h2: "neuron-hidden" }),
      connections: buildConnections(),
      currentLayer: 1,
      dataFlowDirection: "forward",
      activationFunction: "ReLU",
    } as NeuralNetStepData,
  });

  // Step 4: Output computed
  steps.push({
    id: stepId++,
    description: `Output (sigmoid): [${outputA.map(v => v.toFixed(3)).join(", ")}]. Target: [${target.join(", ")}].`,
    action: "activate",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, outputA, { o0: "neuron-output", o1: "neuron-output" }),
      connections: buildConnections(),
      currentLayer: 2,
      dataFlowDirection: "forward",
      activationFunction: "sigmoid",
    } as NeuralNetStepData,
  });

  // Step 5: Compute loss
  steps.push({
    id: stepId++,
    description: `Loss (MSE): L = ½Σ(predicted - target)² = ${loss.toFixed(4)}. Now we propagate this error backward.`,
    action: "compute-gradient",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, outputA, { o0: "swapping", o1: "swapping" }),
      connections: buildConnections(),
      currentLayer: 2,
      lossValue: loss,
    } as NeuralNetStepData,
    variables: { loss },
  });

  // Step 6: Output gradient
  steps.push({
    id: stepId++,
    description: `Output gradients: δ_output = (predicted - target) * σ'(z). δ₁=${dOutputZ[0].toFixed(4)}, δ₂=${dOutputZ[1].toFixed(4)}.`,
    action: "backprop",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, outputA, { o0: "gradient", o1: "gradient" }, { o0: dOutputZ[0], o1: dOutputZ[1] }),
      connections: buildConnections(),
      currentLayer: 2,
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
    variables: { "δ_o1": dOutputZ[0], "δ_o2": dOutputZ[1] },
  });

  // Step 7: Gradients flow to hidden-output weights
  const hoGradients: Record<string, number> = {};
  for (let o = 0; o < 2; o++) {
    for (let h = 0; h < 3; h++) {
      hoGradients[`h${h}-o${o}`] = dOutputZ[o] * hiddenA[h];
    }
  }
  steps.push({
    id: stepId++,
    description: `Hidden→Output weight gradients: ∂L/∂wⱼₒ = δₒ * hⱼ. These tell us how to adjust each connection.`,
    action: "backprop",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, outputA, { o0: "gradient", o1: "gradient" }, { o0: dOutputZ[0], o1: dOutputZ[1] }),
      connections: buildConnections(
        Object.fromEntries(Object.keys(hoGradients).map(k => [k, "gradient" as const])),
        hoGradients
      ),
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
  });

  // Step 8: Propagate to hidden layer
  steps.push({
    id: stepId++,
    description: `Hidden gradients: δ_hidden = (Wᵀ · δ_output) * ReLU'(z). δ=[${dHiddenZ.map(d => d.toFixed(4)).join(", ")}].`,
    action: "backprop",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(
        hiddenA, outputA,
        { h0: "gradient", h1: "gradient", h2: "gradient" },
        { h0: dHiddenZ[0], h1: dHiddenZ[1], h2: dHiddenZ[2] }
      ),
      connections: buildConnections(),
      currentLayer: 1,
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
    variables: { "δ_h1": dHiddenZ[0], "δ_h2": dHiddenZ[1], "δ_h3": dHiddenZ[2] },
  });

  // Step 9: Input-hidden weight gradients
  const ihGradients: Record<string, number> = {};
  for (let h = 0; h < 3; h++) {
    for (let i = 0; i < 2; i++) {
      ihGradients[`i${i}-h${h}`] = dHiddenZ[h] * inputs[i];
    }
  }
  steps.push({
    id: stepId++,
    description: `Input→Hidden weight gradients: ∂L/∂wᵢₕ = δₕ * xᵢ. All gradients have been computed.`,
    action: "backprop",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(
        hiddenA, outputA,
        { h0: "gradient", h1: "gradient", h2: "gradient", i0: "gradient", i1: "gradient" },
        { h0: dHiddenZ[0], h1: dHiddenZ[1], h2: dHiddenZ[2] }
      ),
      connections: buildConnections(
        Object.fromEntries(Object.keys(ihGradients).map(k => [k, "gradient" as const])),
        ihGradients
      ),
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
  });

  // Step 10: Update weights (concept)
  const lr = 0.1;
  steps.push({
    id: stepId++,
    description: `Weight update: w_new = w_old - lr * gradient. Learning rate = ${lr}. All ${2 * 3 + 3 * 2} weights updated simultaneously.`,
    action: "update-weights",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, outputA),
      connections: buildConnections(
        Object.fromEntries([
          ...Object.keys(ihGradients).map(k => [k, "active" as const]),
          ...Object.keys(hoGradients).map(k => [k, "active" as const]),
        ])
      ),
    } as NeuralNetStepData,
    variables: { learningRate: lr },
  });

  // Step 11: Show updated network
  steps.push({
    id: stepId++,
    description: "Weights updated! One training step complete. In practice, this process repeats for thousands of iterations until the loss converges.",
    action: "train",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, outputA, { o0: "completed", o1: "completed" }),
      connections: buildConnections(),
      lossValue: loss,
      epoch: 1,
    } as NeuralNetStepData,
  });

  // Step 12: Chain rule visualization
  steps.push({
    id: stepId++,
    description: "The chain rule decomposes ∂L/∂w into a product of local gradients: ∂L/∂w = (∂L/∂a) * (∂a/∂z) * (∂z/∂w). Each factor is cheap to compute.",
    action: "backprop",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, outputA),
      connections: buildConnections(),
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
  });

  // Step 13: Computational cost
  steps.push({
    id: stepId++,
    description: "Key insight: backpropagation computes ALL gradients in one backward pass, costing roughly 2x the forward pass. This makes training large networks feasible.",
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, outputA),
      connections: buildConnections(),
    } as NeuralNetStepData,
  });

  // Step 14: Challenges
  steps.push({
    id: stepId++,
    description: "Challenges: vanishing gradients (deep sigmoid networks), exploding gradients, and saddle points. Solutions include ReLU, batch normalization, and careful initialization.",
    action: "train",
    highlights: [],
    data: {
      layers,
      neurons: buildNeurons(hiddenA, outputA),
      connections: buildConnections(),
    } as NeuralNetStepData,
  });

  // Step 15: Summary
  steps.push({
    id: stepId++,
    description: "Backpropagation summary: Forward pass → Compute loss → Backward pass (chain rule) → Update weights. This loop is the heart of neural network training.",
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: (() => {
        const ns = buildNeurons(hiddenA, outputA);
        return ns.map(n => ({ ...n, highlight: "completed" as NeuronData["highlight"] }));
      })(),
      connections: buildConnections(),
    } as NeuralNetStepData,
  });

  return steps;
}
