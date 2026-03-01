import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

interface MLPParams {
  hiddenSize: number;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, x))));
}

function relu(x: number): number {
  return Math.max(0, x);
}

/** Seeded pseudo-random for reproducibility */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s / 2147483647) - 0.5;
  };
}

export function generateMLPSteps(params: MLPParams): VisualizationStep[] {
  const { hiddenSize } = params;
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const rand = seededRandom(42);

  const inputSize = 3;
  const outputSize = 2;

  const layers: NeuralNetStepData["layers"] = [
    { label: "Input", type: "input" },
    { label: "Hidden", type: "hidden" },
    { label: "Output", type: "output" },
  ];

  // Initialize inputs
  const inputs = [0.5, 0.8, 0.3];

  // Initialize weights
  const weightsIH: number[][] = [];
  for (let h = 0; h < hiddenSize; h++) {
    weightsIH.push([]);
    for (let i = 0; i < inputSize; i++) {
      weightsIH[h].push(rand() * 0.8);
    }
  }

  const weightsHO: number[][] = [];
  for (let o = 0; o < outputSize; o++) {
    weightsHO.push([]);
    for (let h = 0; h < hiddenSize; h++) {
      weightsHO[o].push(rand() * 0.8);
    }
  }

  const biasesH = Array.from({ length: hiddenSize }, () => rand() * 0.2);
  const biasesO = Array.from({ length: outputSize }, () => rand() * 0.2);

  function makeNeurons(
    inputVals: number[],
    hiddenVals: (number | undefined)[],
    outputVals: (number | undefined)[],
    highlights?: Record<string, NeuronData["highlight"]>
  ): NeuronData[] {
    const neurons: NeuronData[] = [];
    for (let i = 0; i < inputSize; i++) {
      neurons.push({
        id: `i${i}`,
        layer: 0,
        index: i,
        value: inputVals[i],
        label: `x${i + 1}`,
        highlight: highlights?.[`i${i}`],
      });
    }
    for (let h = 0; h < hiddenSize; h++) {
      neurons.push({
        id: `h${h}`,
        layer: 1,
        index: h,
        value: hiddenVals[h],
        label: `h${h + 1}`,
        highlight: highlights?.[`h${h}`],
      });
    }
    for (let o = 0; o < outputSize; o++) {
      neurons.push({
        id: `o${o}`,
        layer: 2,
        index: o,
        value: outputVals[o],
        label: `y${o + 1}`,
        highlight: highlights?.[`o${o}`],
      });
    }
    return neurons;
  }

  function makeConnections(
    highlightLayer?: "ih" | "ho",
    highlightColor?: ConnectionData["highlight"]
  ): ConnectionData[] {
    const conns: ConnectionData[] = [];
    for (let h = 0; h < hiddenSize; h++) {
      for (let i = 0; i < inputSize; i++) {
        conns.push({
          source: `i${i}`,
          target: `h${h}`,
          weight: weightsIH[h][i],
          highlight: highlightLayer === "ih" ? highlightColor : undefined,
        });
      }
    }
    for (let o = 0; o < outputSize; o++) {
      for (let h = 0; h < hiddenSize; h++) {
        conns.push({
          source: `h${h}`,
          target: `o${o}`,
          weight: weightsHO[o][h],
          highlight: highlightLayer === "ho" ? highlightColor : undefined,
        });
      }
    }
    return conns;
  }

  const emptyHidden = new Array(hiddenSize).fill(undefined);
  const emptyOutput = new Array(outputSize).fill(undefined);

  // Step 1: Show architecture
  steps.push({
    id: stepId++,
    description: `MLP architecture: ${inputSize} input neurons, ${hiddenSize} hidden neurons, ${outputSize} output neurons. All layers are fully connected.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(inputs, emptyHidden, emptyOutput),
      connections: makeConnections(),
    } as NeuralNetStepData,
  });

  // Step 2: Show inputs
  const inputHighlights: Record<string, NeuronData["highlight"]> = {};
  for (let i = 0; i < inputSize; i++) inputHighlights[`i${i}`] = "neuron-input";
  steps.push({
    id: stepId++,
    description: `Input values: x₁=${inputs[0]}, x₂=${inputs[1]}, x₃=${inputs[2]}. These propagate to every hidden neuron.`,
    action: "forward-pass",
    highlights: [{ indices: [0, 1, 2], color: "neuron-input", label: "Inputs" }],
    data: {
      layers,
      neurons: makeNeurons(inputs, emptyHidden, emptyOutput, inputHighlights),
      connections: makeConnections(),
      currentLayer: 0,
    } as NeuralNetStepData,
  });

  // Step 3: Show weights from input to hidden
  steps.push({
    id: stepId++,
    description: `Each connection carries a weight. Input-to-hidden connections have ${inputSize * hiddenSize} weights total.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(inputs, emptyHidden, emptyOutput),
      connections: makeConnections("ih", "positive-weight"),
    } as NeuralNetStepData,
  });

  // Step 4-N: Compute each hidden neuron
  const hiddenZs: number[] = [];
  const hiddenAs: number[] = [];
  for (let h = 0; h < hiddenSize; h++) {
    let z = biasesH[h];
    for (let i = 0; i < inputSize; i++) {
      z += inputs[i] * weightsIH[h][i];
    }
    hiddenZs.push(z);
    const a = relu(z);
    hiddenAs.push(a);

    const partialHidden = [...emptyHidden];
    for (let j = 0; j <= h; j++) partialHidden[j] = hiddenAs[j];
    const hl: Record<string, NeuronData["highlight"]> = { [`h${h}`]: "neuron-hidden" };

    steps.push({
      id: stepId++,
      description: `Hidden neuron h${h + 1}: z = Σ(xᵢwᵢ) + b = ${z.toFixed(3)}. After ReLU: a = max(0, ${z.toFixed(3)}) = ${a.toFixed(3)}.`,
      action: "activate",
      highlights: [{ indices: [h], color: "neuron-hidden", label: `h${h + 1}` }],
      data: {
        layers,
        neurons: makeNeurons(inputs, partialHidden, emptyOutput, hl),
        connections: makeConnections(),
        currentLayer: 1,
        activationFunction: "ReLU",
      } as NeuralNetStepData,
      variables: { [`z_h${h + 1}`]: z, [`a_h${h + 1}`]: a },
    });
  }

  // Step: All hidden activations computed
  steps.push({
    id: stepId++,
    description: `All ${hiddenSize} hidden neurons activated. Values: [${hiddenAs.map(a => a.toFixed(3)).join(", ")}]. Now propagating to output layer.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(inputs, hiddenAs, emptyOutput),
      connections: makeConnections("ho", "active"),
      currentLayer: 1,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Compute output neurons
  const outputZs: number[] = [];
  const outputAs: number[] = [];
  for (let o = 0; o < outputSize; o++) {
    let z = biasesO[o];
    for (let h = 0; h < hiddenSize; h++) {
      z += hiddenAs[h] * weightsHO[o][h];
    }
    outputZs.push(z);
    const a = sigmoid(z);
    outputAs.push(a);

    const partialOutput = [...emptyOutput];
    for (let j = 0; j <= o; j++) partialOutput[j] = outputAs[j];
    const hl: Record<string, NeuronData["highlight"]> = { [`o${o}`]: "neuron-output" };

    steps.push({
      id: stepId++,
      description: `Output neuron y${o + 1}: z = Σ(hⱼwⱼ) + b = ${z.toFixed(3)}. After sigmoid: σ(${z.toFixed(3)}) = ${a.toFixed(3)}.`,
      action: "activate",
      highlights: [{ indices: [o], color: "neuron-output", label: `y${o + 1}` }],
      data: {
        layers,
        neurons: makeNeurons(inputs, hiddenAs, partialOutput, hl),
        connections: makeConnections(),
        currentLayer: 2,
        activationFunction: "sigmoid",
      } as NeuralNetStepData,
      variables: { [`z_o${o + 1}`]: z, [`a_o${o + 1}`]: a },
    });
  }

  // Final step: All outputs computed
  steps.push({
    id: stepId++,
    description: `Forward pass complete! Output: [${outputAs.map(a => a.toFixed(3)).join(", ")}]. The MLP transformed ${inputSize}D input through ${hiddenSize} hidden units into ${outputSize}D output.`,
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(
        inputs,
        hiddenAs,
        outputAs,
        { o0: "completed", o1: "completed" }
      ),
      connections: makeConnections(),
    } as NeuralNetStepData,
  });

  // Summary step
  steps.push({
    id: stepId++,
    description: `MLP summary: ${inputSize}→${hiddenSize}→${outputSize} architecture with ReLU hidden activation and sigmoid output. Total parameters: ${inputSize * hiddenSize + hiddenSize + hiddenSize * outputSize + outputSize} (weights + biases).`,
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(
        inputs,
        hiddenAs,
        outputAs,
        (() => {
          const h: Record<string, NeuronData["highlight"]> = {};
          for (let i = 0; i < inputSize; i++) h[`i${i}`] = "completed";
          for (let j = 0; j < hiddenSize; j++) h[`h${j}`] = "completed";
          for (let k = 0; k < outputSize; k++) h[`o${k}`] = "completed";
          return h;
        })()
      ),
      connections: makeConnections(),
    } as NeuralNetStepData,
  });

  return steps;
}
