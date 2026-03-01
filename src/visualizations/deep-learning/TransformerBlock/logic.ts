import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

/**
 * Transformer Block (Encoder) visualization.
 * Block diagram: Input -> LayerNorm -> MHA -> Add&Norm -> FFN -> Add&Norm -> Output
 * Uses NeuralNetCanvas in compactMode to show data flowing through each sub-layer.
 */

interface BlockLayerDef {
  label: string;
  type: "input" | "hidden" | "output" | "attention";
  neurons: number;
}

const BLOCK_LAYERS: BlockLayerDef[] = [
  { label: "Input", type: "input", neurons: 4 },
  { label: "LayerNorm1", type: "hidden", neurons: 4 },
  { label: "MHA", type: "attention", neurons: 4 },
  { label: "Add&Norm1", type: "hidden", neurons: 4 },
  { label: "FFN-Up", type: "hidden", neurons: 6 },
  { label: "FFN-Down", type: "hidden", neurons: 4 },
  { label: "Add&Norm2", type: "hidden", neurons: 4 },
  { label: "Output", type: "output", neurons: 4 },
];

function buildLayers() {
  return BLOCK_LAYERS.map((l) => ({
    label: l.label,
    type: l.type as "input" | "hidden" | "output" | "attention",
  }));
}

function buildNeurons(): NeuronData[] {
  const neurons: NeuronData[] = [];
  BLOCK_LAYERS.forEach((layer, layerIdx) => {
    for (let i = 0; i < layer.neurons; i++) {
      neurons.push({
        id: `L${layerIdx}-${i}`,
        layer: layerIdx,
        index: i,
      });
    }
  });
  return neurons;
}

function buildConnections(): ConnectionData[] {
  const connections: ConnectionData[] = [];
  for (let li = 0; li < BLOCK_LAYERS.length - 1; li++) {
    const srcCount = BLOCK_LAYERS[li].neurons;
    const tgtCount = BLOCK_LAYERS[li + 1].neurons;
    for (let s = 0; s < srcCount; s++) {
      for (let t = 0; t < tgtCount; t++) {
        connections.push({
          source: `L${li}-${s}`,
          target: `L${li + 1}-${t}`,
          weight: 0.4,
        });
      }
    }
  }

  // Residual connections: Input -> Add&Norm1 (skip MHA)
  for (let i = 0; i < BLOCK_LAYERS[0].neurons; i++) {
    connections.push({
      source: `L0-${i}`,
      target: `L3-${i}`,
      weight: 0.2,
    });
  }

  // Residual connections: Add&Norm1 -> Add&Norm2 (skip FFN)
  for (let i = 0; i < BLOCK_LAYERS[3].neurons; i++) {
    connections.push({
      source: `L3-${i}`,
      target: `L6-${i}`,
      weight: 0.2,
    });
  }

  return connections;
}

export function generateTransformerBlockSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const layers = buildLayers();
  const baseNeurons = buildNeurons();
  const baseConnections = buildConnections();

  const layerDescriptions = [
    "Input: Token embeddings with positional encoding enter the Transformer block. Each token is a d_model-dimensional vector. The block will transform these representations while preserving the residual connection.",
    "Layer Normalization 1: Normalize the input across the feature dimension. LayerNorm stabilizes training by ensuring consistent scale. Applied BEFORE attention (Pre-LN variant, used in GPT-2+).",
    "Multi-Head Attention (MHA): The core of the Transformer block. Each token attends to all other tokens through h parallel attention heads. The output is a context-enriched representation of each token.",
    "Add & Norm 1: Residual connection adds the original input to the MHA output, then applies LayerNorm. output = LayerNorm(x + MHA(x)). This helps gradients flow through deep networks.",
    "Feed-Forward Network (Up-projection): Each token is independently transformed by a 2-layer FFN. First layer expands dimension: d_model -> 4*d_model with GELU/ReLU activation. This adds non-linear capacity.",
    "Feed-Forward Network (Down-projection): Second layer projects back: 4*d_model -> d_model. The FFN acts as a per-token transformation, unlike attention which mixes information across tokens.",
    "Add & Norm 2: Second residual connection adds the FFN input to the FFN output, then applies LayerNorm. output = LayerNorm(x + FFN(x)). This completes the Transformer block.",
    "Output: The final representations exit the block. In an encoder stack, this output becomes the input to the next block. After N blocks (typically 6-24), the representations are used for the final task.",
  ];

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description:
      "Transformer Block: The fundamental building block of the Transformer. It consists of Multi-Head Attention (MHA) followed by a Feed-Forward Network (FFN), each wrapped with residual connections and layer normalization. Data flows: Input -> LN -> MHA -> Add&Norm -> FFN -> Add&Norm -> Output.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: baseNeurons.map((n) => ({ ...n })),
      connections: baseConnections.map((c) => ({ ...c })),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Steps 1-8: Flow through each layer
  for (let li = 0; li < BLOCK_LAYERS.length; li++) {
    const neurons = baseNeurons.map((n) => {
      if (n.layer === li) {
        const highlight =
          BLOCK_LAYERS[li].type === "input"
            ? "neuron-input"
            : BLOCK_LAYERS[li].type === "output"
            ? "neuron-output"
            : BLOCK_LAYERS[li].type === "attention"
            ? "attention-high"
            : "neuron-hidden";
        return {
          ...n,
          highlight: highlight as "neuron-input" | "neuron-hidden" | "neuron-output" | "attention-high",
          value: Math.round(Math.random() * 10) / 10,
        };
      }
      if (n.layer < li) {
        return { ...n, highlight: "completed" as const };
      }
      return { ...n };
    });

    const action = li === 2 ? "attend" : li >= 4 && li <= 5 ? "activate" : "forward-pass";

    steps.push({
      id: stepId++,
      description: layerDescriptions[li],
      action,
      highlights: [],
      data: {
        layers,
        neurons,
        connections: baseConnections.map((c) => ({ ...c })),
        currentLayer: li,
        dataFlowDirection: "forward",
      } as NeuralNetStepData,
    });
  }

  // Step 9: Residual connections highlight
  steps.push({
    id: stepId++,
    description:
      "Residual connections (skip connections) are critical: they add the input directly to the sublayer output. This creates shortcut paths for gradient flow, enabling training of very deep Transformer stacks (up to 100+ layers). Without residuals, deep Transformers would be untrainable.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: baseNeurons.map((n) => {
        if (n.layer === 0 || n.layer === 3 || n.layer === 6) {
          return { ...n, highlight: "attention-high" as const, value: 1 };
        }
        return { ...n, highlight: "completed" as const };
      }),
      connections: baseConnections.map((c) => {
        // Highlight residual connections
        if (
          (c.source.startsWith("L0-") && c.target.startsWith("L3-")) ||
          (c.source.startsWith("L3-") && c.target.startsWith("L6-"))
        ) {
          return { ...c, highlight: "attention-high" as const };
        }
        return { ...c };
      }),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 10: Pre-LN vs Post-LN
  steps.push({
    id: stepId++,
    description:
      "Pre-LN vs Post-LN: The original Transformer (Vaswani 2017) used Post-LN: output = LN(x + Sublayer(x)). Most modern Transformers use Pre-LN: output = x + Sublayer(LN(x)), which is more stable for training deep models. Our visualization shows the Pre-LN variant.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: baseNeurons.map((n) => {
        if (n.layer === 1 || n.layer === 3 || n.layer === 6) {
          return { ...n, highlight: "neuron-hidden" as const, value: 1 };
        }
        return { ...n, highlight: "completed" as const };
      }),
      connections: baseConnections.map((c) => ({ ...c })),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 11: Summary
  steps.push({
    id: stepId++,
    description:
      "Transformer Block complete! One block: Input -> LN -> MHA -> Add&Norm -> LN -> FFN -> Add&Norm -> Output. The encoder uses N such blocks stacked sequentially (N=6 in original paper, N=12 in BERT-base, N=96 in GPT-3). Each block has ~4*d_model^2 parameters from MHA and FFN weights.",
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
