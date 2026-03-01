import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

/**
 * Seq2Seq: Encoder (3 time steps) -> Context Vector -> Decoder (3 time steps)
 * Layers: enc_x0, enc_h0, enc_x1, enc_h1, enc_x2, enc_h2, ctx, dec_h0, dec_y0, dec_h1, dec_y1, dec_h2, dec_y2
 */

const ENC_STEPS = 3;
const DEC_STEPS = 3;

interface Seq2SeqLayerDef {
  label: string;
  type: "input" | "hidden" | "output" | "attention";
}

function buildLayers(): Seq2SeqLayerDef[] {
  const layers: Seq2SeqLayerDef[] = [];

  // Encoder: input and hidden for each time step
  for (let t = 0; t < ENC_STEPS; t++) {
    layers.push({ label: `enc_x${t}`, type: "input" });
    layers.push({ label: `enc_h${t}`, type: "hidden" });
  }

  // Context vector
  layers.push({ label: "Context", type: "attention" });

  // Decoder: hidden and output for each time step
  for (let t = 0; t < DEC_STEPS; t++) {
    layers.push({ label: `dec_h${t}`, type: "hidden" });
    layers.push({ label: `dec_y${t}`, type: "output" });
  }

  return layers;
}

function buildNeurons(): NeuronData[] {
  const neurons: NeuronData[] = [];
  let layerIdx = 0;

  // Encoder inputs + hiddens
  for (let t = 0; t < ENC_STEPS; t++) {
    // 2 input neurons
    for (let i = 0; i < 2; i++) {
      neurons.push({ id: `enc_x${t}-${i}`, layer: layerIdx, index: i });
    }
    layerIdx++;
    // 3 hidden neurons
    for (let i = 0; i < 3; i++) {
      neurons.push({ id: `enc_h${t}-${i}`, layer: layerIdx, index: i });
    }
    layerIdx++;
  }

  // Context vector (3 neurons)
  for (let i = 0; i < 3; i++) {
    neurons.push({ id: `ctx-${i}`, layer: layerIdx, index: i });
  }
  layerIdx++;

  // Decoder hiddens + outputs
  for (let t = 0; t < DEC_STEPS; t++) {
    // 3 hidden neurons
    for (let i = 0; i < 3; i++) {
      neurons.push({ id: `dec_h${t}-${i}`, layer: layerIdx, index: i });
    }
    layerIdx++;
    // 2 output neurons
    for (let i = 0; i < 2; i++) {
      neurons.push({ id: `dec_y${t}-${i}`, layer: layerIdx, index: i });
    }
    layerIdx++;
  }

  return neurons;
}

function buildConnections(): ConnectionData[] {
  const connections: ConnectionData[] = [];

  // Encoder: input -> hidden at each step
  for (let t = 0; t < ENC_STEPS; t++) {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        connections.push({
          source: `enc_x${t}-${i}`,
          target: `enc_h${t}-${j}`,
          weight: 0.4,
        });
      }
    }
    // Recurrent: enc_h(t) -> enc_h(t+1)
    if (t < ENC_STEPS - 1) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          connections.push({
            source: `enc_h${t}-${i}`,
            target: `enc_h${t + 1}-${j}`,
            weight: 0.3,
          });
        }
      }
    }
  }

  // Last encoder hidden -> context
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      connections.push({
        source: `enc_h${ENC_STEPS - 1}-${i}`,
        target: `ctx-${j}`,
        weight: 0.5,
      });
    }
  }

  // Context -> first decoder hidden
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      connections.push({
        source: `ctx-${i}`,
        target: `dec_h0-${j}`,
        weight: 0.5,
      });
    }
  }

  // Decoder: hidden -> output, and recurrent hidden -> next hidden
  for (let t = 0; t < DEC_STEPS; t++) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        connections.push({
          source: `dec_h${t}-${i}`,
          target: `dec_y${t}-${j}`,
          weight: 0.4,
        });
      }
    }
    if (t < DEC_STEPS - 1) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          connections.push({
            source: `dec_h${t}-${i}`,
            target: `dec_h${t + 1}-${j}`,
            weight: 0.3,
          });
        }
      }
    }
  }

  return connections;
}

export function generateSeq2SeqSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const layers = buildLayers();
  const baseNeurons = buildNeurons();
  const baseConnections = buildConnections();

  const totalLayers = layers.length;

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: "Seq2Seq (Sequence-to-Sequence): An encoder reads the input sequence, compresses it into a context vector, then a decoder generates the output sequence. Used in machine translation, summarization, and chatbots.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: baseNeurons.map((n) => ({ ...n })),
      connections: baseConnections.map((c) => ({ ...c })),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Encoder phase
  const encoderDescriptions = [
    "Encoder: input token x(0) (e.g., 'Hello') enters. The embedding is fed to the encoder RNN.",
    "Encoder hidden state h(0) is computed from x(0). This captures information about the first token.",
    "Encoder: input token x(1) (e.g., 'world') enters. Previous hidden state provides context.",
    "Encoder hidden state h(1) combines current input with context from h(0).",
    "Encoder: input token x(2) (e.g., '<EOS>') -- end of source sequence.",
    "Encoder hidden state h(2) now encodes the ENTIRE input sequence. This is the final encoder state.",
  ];

  for (let layerIdx = 0; layerIdx < ENC_STEPS * 2; layerIdx++) {
    const neurons = baseNeurons.map((n) => {
      if (n.layer === layerIdx) {
        return { ...n, highlight: "neuron-input" as const, value: Math.round(Math.random() * 10) / 10 };
      }
      if (n.layer < layerIdx) {
        return { ...n, highlight: "completed" as const };
      }
      return { ...n };
    });

    steps.push({
      id: stepId++,
      description: encoderDescriptions[layerIdx],
      action: layerIdx % 2 === 0 ? "encode" : "activate",
      highlights: [],
      data: {
        layers,
        neurons,
        connections: baseConnections.map((c) => ({ ...c })),
        currentLayer: layerIdx,
        dataFlowDirection: "forward",
      } as NeuralNetStepData,
    });
  }

  // Context vector
  const ctxLayerIdx = ENC_STEPS * 2;
  const neuronsCtx = baseNeurons.map((n) => {
    if (n.layer === ctxLayerIdx) {
      return { ...n, highlight: "neuron-hidden" as const, value: Math.round(Math.random() * 10) / 10 };
    }
    if (n.layer < ctxLayerIdx) {
      return { ...n, highlight: "completed" as const };
    }
    return { ...n };
  });

  steps.push({
    id: stepId++,
    description: "Context vector: the final encoder hidden state is passed as the initial state of the decoder. This fixed-size vector must capture all information from the source sequence -- a bottleneck that attention mechanisms later address.",
    action: "encode",
    highlights: [],
    data: {
      layers,
      neurons: neuronsCtx,
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: ctxLayerIdx,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Decoder phase
  const decoderDescriptions = [
    "Decoder: hidden state dec_h(0) is initialized from the context vector. The decoder begins generating output.",
    "Decoder: output y(0) is produced (e.g., 'Bonjour'). This token is also fed as input to the next decoder step.",
    "Decoder: hidden state dec_h(1) processes the previous output token and context to generate the next hidden state.",
    "Decoder: output y(1) (e.g., 'le') is generated from the current decoder hidden state.",
    "Decoder: hidden state dec_h(2) continues the autoregressive generation.",
    "Decoder: final output y(2) (e.g., 'monde') is produced. Decoding stops when an <EOS> token is generated.",
  ];

  for (let i = 0; i < DEC_STEPS * 2; i++) {
    const layerIdx = ctxLayerIdx + 1 + i;
    const neurons = baseNeurons.map((n) => {
      if (n.layer === layerIdx) {
        const hl = layerIdx % 2 === (ctxLayerIdx + 1) % 2 ? "neuron-hidden" : "neuron-output";
        return { ...n, highlight: hl as "neuron-hidden" | "neuron-output", value: Math.round(Math.random() * 10) / 10 };
      }
      if (n.layer < layerIdx) {
        return { ...n, highlight: "completed" as const };
      }
      return { ...n };
    });

    steps.push({
      id: stepId++,
      description: decoderDescriptions[i],
      action: i % 2 === 0 ? "decode" : "activate",
      highlights: [],
      data: {
        layers,
        neurons,
        connections: baseConnections.map((c) => ({ ...c })),
        currentLayer: layerIdx,
        dataFlowDirection: "forward",
      } as NeuralNetStepData,
    });
  }

  // Summary
  steps.push({
    id: stepId++,
    description: "Seq2Seq complete! The encoder compressed the input sequence into a context vector, and the decoder autoregressively generated the output sequence. Limitation: the fixed-size context vector is a bottleneck for long sequences. This motivated the attention mechanism (Bahdanau 2014) and eventually the Transformer (Vaswani 2017).",
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
