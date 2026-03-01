import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

/**
 * Vanilla RNN unrolled over 4 time steps:
 * x(t=0) -> h0 -> h1 -> h2 -> h3 -> y
 * Each time step has: input, hidden, and the hidden state flows forward.
 * We represent this as layers: x0, h0, x1, h1, x2, h2, x3, h3, output
 */

const TIME_STEPS = 4;

interface RNNLayerDef {
  label: string;
  type: "input" | "hidden" | "output";
}

function buildLayers(): RNNLayerDef[] {
  const layers: RNNLayerDef[] = [];
  for (let t = 0; t < TIME_STEPS; t++) {
    layers.push({ label: `x(${t})`, type: "input" });
    layers.push({ label: `h(${t})`, type: "hidden" });
  }
  layers.push({ label: "y", type: "output" });
  return layers;
}

function buildNeurons(): NeuronData[] {
  const neurons: NeuronData[] = [];
  let layerIdx = 0;

  for (let t = 0; t < TIME_STEPS; t++) {
    // Input neurons (2 per time step)
    for (let i = 0; i < 2; i++) {
      neurons.push({
        id: `x${t}-${i}`,
        layer: layerIdx,
        index: i,
      });
    }
    layerIdx++;

    // Hidden neurons (3 per time step)
    for (let i = 0; i < 3; i++) {
      neurons.push({
        id: `h${t}-${i}`,
        layer: layerIdx,
        index: i,
      });
    }
    layerIdx++;
  }

  // Output neurons (2)
  for (let i = 0; i < 2; i++) {
    neurons.push({
      id: `y-${i}`,
      layer: layerIdx,
      index: i,
    });
  }

  return neurons;
}

function buildConnections(): ConnectionData[] {
  const connections: ConnectionData[] = [];

  for (let t = 0; t < TIME_STEPS; t++) {
    // Input -> Hidden (at same time step)
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        connections.push({
          source: `x${t}-${i}`,
          target: `h${t}-${j}`,
          weight: 0.3 + Math.random() * 0.4,
        });
      }
    }

    // Hidden -> Hidden (recurrent: h(t) -> h(t+1))
    if (t < TIME_STEPS - 1) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          connections.push({
            source: `h${t}-${i}`,
            target: `h${t + 1}-${j}`,
            weight: 0.2 + Math.random() * 0.3,
          });
        }
      }
    }
  }

  // Last hidden -> output
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      connections.push({
        source: `h${TIME_STEPS - 1}-${i}`,
        target: `y-${j}`,
        weight: 0.3 + Math.random() * 0.5,
      });
    }
  }

  return connections;
}

export function generateVanillaRNNSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const layers = buildLayers();
  const baseNeurons = buildNeurons();
  const baseConnections = buildConnections();

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `Vanilla RNN unrolled over ${TIME_STEPS} time steps. At each step t, the hidden state h(t) depends on the input x(t) AND the previous hidden state h(t-1). This is what gives RNNs memory.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: baseNeurons.map((n) => ({ ...n })),
      connections: baseConnections.map((c) => ({ ...c })),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Walk through each time step
  for (let t = 0; t < TIME_STEPS; t++) {
    const inputLayerIdx = t * 2;
    const hiddenLayerIdx = t * 2 + 1;

    // Step: Process input x(t)
    const neuronsForInput = baseNeurons.map((n) => {
      if (n.layer === inputLayerIdx) {
        return { ...n, highlight: "neuron-input" as const, value: Math.round(Math.random() * 10) / 10 };
      }
      if (n.layer < inputLayerIdx) {
        return { ...n, highlight: "completed" as const };
      }
      return { ...n };
    });

    steps.push({
      id: stepId++,
      description: `Time step t=${t}: Input x(${t}) arrives. ${t > 0 ? `Previous hidden state h(${t - 1}) carries context from earlier time steps.` : "No previous hidden state (h(-1) = 0)."}`,
      action: "forward-pass",
      highlights: [],
      data: {
        layers,
        neurons: neuronsForInput,
        connections: baseConnections.map((c) => ({ ...c })),
        currentLayer: inputLayerIdx,
        dataFlowDirection: "forward",
      } as NeuralNetStepData,
    });

    // Step: Compute hidden state h(t)
    const neuronsForHidden = baseNeurons.map((n) => {
      if (n.layer === hiddenLayerIdx) {
        return { ...n, highlight: "neuron-hidden" as const, value: Math.round(Math.random() * 10) / 10 };
      }
      if (n.layer <= inputLayerIdx) {
        return { ...n, highlight: "completed" as const };
      }
      return { ...n };
    });

    const connectionsForHidden = baseConnections.map((c) => {
      // Highlight input->hidden connections for this time step
      if (c.source.startsWith(`x${t}`) && c.target.startsWith(`h${t}`)) {
        return { ...c, highlight: "neuron-input" as const };
      }
      // Highlight recurrent connections h(t-1)->h(t)
      if (t > 0 && c.source.startsWith(`h${t - 1}`) && c.target.startsWith(`h${t}`)) {
        return { ...c, highlight: "neuron-hidden" as const };
      }
      return { ...c };
    });

    steps.push({
      id: stepId++,
      description: `h(${t}) = tanh(W_xh * x(${t}) + W_hh * h(${t > 0 ? t - 1 : "init"}) + b_h). Hidden state combines current input with recurrent context.`,
      action: "activate",
      highlights: [],
      data: {
        layers,
        neurons: neuronsForHidden,
        connections: connectionsForHidden,
        currentLayer: hiddenLayerIdx,
        activationFunction: "tanh",
        dataFlowDirection: "forward",
      } as NeuralNetStepData,
    });
  }

  // Step: Output
  const outputLayerIdx = TIME_STEPS * 2;
  const neuronsForOutput = baseNeurons.map((n) => {
    if (n.layer === outputLayerIdx) {
      return { ...n, highlight: "neuron-output" as const, value: Math.round(Math.random() * 10) / 10 };
    }
    return { ...n, highlight: "completed" as const };
  });

  steps.push({
    id: stepId++,
    description: `Output y = W_hy * h(${TIME_STEPS - 1}) + b_y. The final hidden state encodes the entire sequence context and produces the output prediction.`,
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: neuronsForOutput,
      connections: baseConnections.map((c) => ({ ...c, highlight: "completed" as const })),
      currentLayer: outputLayerIdx,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `Vanilla RNN complete! Key formula: h(t) = tanh(W_xh*x(t) + W_hh*h(t-1) + b). The same weights W_xh and W_hh are shared across all time steps. Limitation: vanilla RNNs suffer from vanishing gradients for long sequences, which LSTM and GRU address.`,
    action: "complete",
    highlights: [],
    data: {
      layers,
      neurons: baseNeurons.map((n) => ({ ...n, highlight: "completed" as const })),
      connections: baseConnections.map((c) => ({ ...c, highlight: "completed" as const })),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  return steps;
}
