import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

interface DropoutParams {
  dropoutRate: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateDropoutSteps(params: DropoutParams): VisualizationStep[] {
  const { dropoutRate } = params;
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const rand = seededRandom(42);

  const layerSizes = [3, 5, 5, 2];
  const layerLabels = ["Input", "Hidden 1", "Hidden 2", "Output"];
  const layerTypes: NeuralNetStepData["layers"][0]["type"][] = ["input", "hidden", "hidden", "output"];

  const layers: NeuralNetStepData["layers"] = layerLabels.map((label, i) => ({
    label,
    type: layerTypes[i],
  }));

  function makeNeurons(
    dropMask1?: boolean[],
    dropMask2?: boolean[],
    highlights?: Record<string, NeuronData["highlight"]>
  ): NeuronData[] {
    const neurons: NeuronData[] = [];
    for (let i = 0; i < 3; i++) {
      neurons.push({
        id: `i${i}`, layer: 0, index: i, value: 0.5 + rand() * 0.5,
        highlight: highlights?.[`i${i}`],
      });
    }
    for (let h = 0; h < 5; h++) {
      neurons.push({
        id: `h1-${h}`, layer: 1, index: h, value: 0.3 + rand() * 0.7,
        isDropped: dropMask1?.[h] ?? false,
        highlight: highlights?.[`h1-${h}`],
      });
    }
    for (let h = 0; h < 5; h++) {
      neurons.push({
        id: `h2-${h}`, layer: 2, index: h, value: 0.2 + rand() * 0.8,
        isDropped: dropMask2?.[h] ?? false,
        highlight: highlights?.[`h2-${h}`],
      });
    }
    for (let o = 0; o < 2; o++) {
      neurons.push({
        id: `o${o}`, layer: 3, index: o, value: 0.4 + rand() * 0.3,
        highlight: highlights?.[`o${o}`],
      });
    }
    return neurons;
  }

  function makeConnections(
    dropMask1?: boolean[],
    dropMask2?: boolean[]
  ): ConnectionData[] {
    const conns: ConnectionData[] = [];
    for (let h = 0; h < 5; h++) {
      for (let i = 0; i < 3; i++) {
        const dropped = dropMask1?.[h] ?? false;
        conns.push({
          source: `i${i}`, target: `h1-${h}`,
          weight: dropped ? 0 : (rand() * 0.6 - 0.3),
        });
      }
    }
    for (let h2 = 0; h2 < 5; h2++) {
      for (let h1 = 0; h1 < 5; h1++) {
        const dropped1 = dropMask1?.[h1] ?? false;
        const dropped2 = dropMask2?.[h2] ?? false;
        conns.push({
          source: `h1-${h1}`, target: `h2-${h2}`,
          weight: (dropped1 || dropped2) ? 0 : (rand() * 0.6 - 0.3),
        });
      }
    }
    for (let o = 0; o < 2; o++) {
      for (let h2 = 0; h2 < 5; h2++) {
        const dropped = dropMask2?.[h2] ?? false;
        conns.push({
          source: `h2-${h2}`, target: `o${o}`,
          weight: dropped ? 0 : (rand() * 0.6 - 0.3),
        });
      }
    }
    return conns;
  }

  // Generate multiple dropout masks
  function generateMask(size: number, rate: number, seed: number): boolean[] {
    const r = seededRandom(seed);
    return Array.from({ length: size }, () => r() < rate);
  }

  const mask1a = generateMask(5, dropoutRate, 100);
  const mask2a = generateMask(5, dropoutRate, 200);
  const mask1b = generateMask(5, dropoutRate, 300);
  const mask2b = generateMask(5, dropoutRate, 400);
  const mask1c = generateMask(5, dropoutRate, 500);
  const mask2c = generateMask(5, dropoutRate, 600);

  const dropped1a = mask1a.filter(Boolean).length;
  const dropped2a = mask2a.filter(Boolean).length;

  // Step 1: Full network
  steps.push({
    id: stepId++,
    description: `A 3-5-5-2 neural network. During training, dropout randomly deactivates neurons to prevent overfitting. Dropout rate = ${(dropoutRate * 100).toFixed(0)}%.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(),
      connections: makeConnections(),
    } as NeuralNetStepData,
  });

  // Step 2: Explain dropout
  steps.push({
    id: stepId++,
    description: `Each hidden neuron has a ${(dropoutRate * 100).toFixed(0)}% chance of being dropped. Dropped neurons output zero and do not contribute to the forward or backward pass.`,
    action: "highlight",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(),
      connections: makeConnections(),
    } as NeuralNetStepData,
  });

  // Step 3: Apply first dropout mask
  steps.push({
    id: stepId++,
    description: `Training iteration 1: Dropout applied! Hidden 1: ${dropped1a} of 5 neurons dropped. Hidden 2: ${dropped2a} of 5 neurons dropped. Dashed circles = dropped.`,
    action: "activate",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(mask1a, mask2a),
      connections: makeConnections(mask1a, mask2a),
    } as NeuralNetStepData,
  });

  // Step 4: Show forward pass through thinned network
  steps.push({
    id: stepId++,
    description: "Forward pass through the thinned network. Only active neurons participate. This forces remaining neurons to learn independent, useful features.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(mask1a, mask2a),
      connections: makeConnections(mask1a, mask2a),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 5: Backprop through thinned network
  steps.push({
    id: stepId++,
    description: "Backpropagation only updates weights connected to active neurons. Dropped neurons receive no gradient signal this iteration.",
    action: "backprop",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(mask1a, mask2a),
      connections: makeConnections(mask1a, mask2a),
      dataFlowDirection: "backward",
    } as NeuralNetStepData,
  });

  // Step 6: Second dropout mask
  const dropped1b = mask1b.filter(Boolean).length;
  const dropped2b = mask2b.filter(Boolean).length;
  steps.push({
    id: stepId++,
    description: `Training iteration 2: New random mask! Hidden 1: ${dropped1b} dropped, Hidden 2: ${dropped2b} dropped. Different neurons are active each time.`,
    action: "activate",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(mask1b, mask2b),
      connections: makeConnections(mask1b, mask2b),
    } as NeuralNetStepData,
  });

  // Step 7: Third mask
  const dropped1c = mask1c.filter(Boolean).length;
  const dropped2c = mask2c.filter(Boolean).length;
  steps.push({
    id: stepId++,
    description: `Training iteration 3: Yet another mask! Hidden 1: ${dropped1c} dropped, Hidden 2: ${dropped2c} dropped. Each iteration trains a different 'sub-network'.`,
    action: "activate",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(mask1c, mask2c),
      connections: makeConnections(mask1c, mask2c),
    } as NeuralNetStepData,
  });

  // Step 8: Ensemble interpretation
  steps.push({
    id: stepId++,
    description: "Dropout as ensemble: With 10 hidden neurons, there are 2^10 = 1024 possible sub-networks. Training effectively averages over all these models!",
    action: "train",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(mask1a, mask2a),
      connections: makeConnections(mask1a, mask2a),
    } as NeuralNetStepData,
  });

  // Step 9: Co-adaptation prevention
  steps.push({
    id: stepId++,
    description: "Without dropout, neurons can co-adapt: neuron A only works well when neuron B is present. Dropout breaks this dependency, making each neuron independently useful.",
    action: "highlight",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(mask1b, mask2b),
      connections: makeConnections(mask1b, mask2b),
    } as NeuralNetStepData,
  });

  // Step 10: Inference mode
  steps.push({
    id: stepId++,
    description: "Inference mode: ALL neurons are active (no dropout). Activations are scaled by (1-p) to match the expected values during training. This is called inverted dropout.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(undefined, undefined, {
        "h1-0": "completed", "h1-1": "completed", "h1-2": "completed", "h1-3": "completed", "h1-4": "completed",
        "h2-0": "completed", "h2-1": "completed", "h2-2": "completed", "h2-3": "completed", "h2-4": "completed",
      }),
      connections: makeConnections(),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 11: Inverted dropout scaling
  steps.push({
    id: stepId++,
    description: `Inverted dropout: during training, active neurons are scaled by 1/(1-p) = 1/${(1 - dropoutRate).toFixed(2)} = ${(1 / (1 - dropoutRate)).toFixed(2)}x. This way, no scaling needed at inference.`,
    action: "train",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(),
      connections: makeConnections(),
    } as NeuralNetStepData,
    variables: { "scale_factor": 1 / (1 - dropoutRate) },
  });

  // Step 12: Dropout rate impact
  steps.push({
    id: stepId++,
    description: `Dropout rate = ${(dropoutRate * 100).toFixed(0)}%. Lower rates (10-20%) for small networks. Higher rates (40-50%) for large networks. Too high = underfitting, too low = overfitting.`,
    action: "highlight",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(mask1a, mask2a),
      connections: makeConnections(mask1a, mask2a),
    } as NeuralNetStepData,
    variables: { dropoutRate },
  });

  // Step 13: Summary
  steps.push({
    id: stepId++,
    description: "Dropout summary: randomly drop neurons during training (regularization), use all neurons during inference (with scaling). Prevents overfitting and co-adaptation.",
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: (() => {
        const ns = makeNeurons();
        return ns.map(n => ({ ...n, highlight: "completed" as NeuronData["highlight"] }));
      })(),
      connections: makeConnections(),
    } as NeuralNetStepData,
  });

  return steps;
}
