import type {
  VisualizationStep,
  NeuralNetStepData,
  NeuronData,
  ConnectionData,
} from "@/lib/visualization/types";

/**
 * Full Transformer (Encoder-Decoder) visualization.
 * Architecture: Encoder Stack (N=2 blocks) -> Context -> Decoder Stack (N=2 blocks) -> Output
 * Uses NeuralNetCanvas in compactMode.
 */

interface FullLayerDef {
  label: string;
  type: "input" | "hidden" | "output" | "attention";
  neurons: number;
}

// Simplified architecture layers
const FULL_LAYERS: FullLayerDef[] = [
  // Encoder
  { label: "Src Embed", type: "input", neurons: 3 },
  { label: "Enc Blk 1", type: "hidden", neurons: 3 },
  { label: "Enc MHA 1", type: "attention", neurons: 3 },
  { label: "Enc Blk 2", type: "hidden", neurons: 3 },
  { label: "Enc MHA 2", type: "attention", neurons: 3 },
  // Cross-attention bridge
  { label: "Context", type: "attention", neurons: 3 },
  // Decoder
  { label: "Tgt Embed", type: "input", neurons: 3 },
  { label: "Dec Blk 1", type: "hidden", neurons: 3 },
  { label: "Mask MHA", type: "attention", neurons: 3 },
  { label: "Cross Attn", type: "attention", neurons: 3 },
  { label: "Dec Blk 2", type: "hidden", neurons: 3 },
  { label: "Dec MHA 2", type: "attention", neurons: 3 },
  // Output
  { label: "Linear", type: "hidden", neurons: 3 },
  { label: "Softmax", type: "output", neurons: 3 },
];

function buildLayers() {
  return FULL_LAYERS.map((l) => ({
    label: l.label,
    type: l.type as "input" | "hidden" | "output" | "attention",
  }));
}

function buildNeurons(): NeuronData[] {
  const neurons: NeuronData[] = [];
  FULL_LAYERS.forEach((layer, layerIdx) => {
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

  // Sequential encoder connections (layers 0-4)
  for (let li = 0; li < 4; li++) {
    const srcCount = FULL_LAYERS[li].neurons;
    const tgtCount = FULL_LAYERS[li + 1].neurons;
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

  // Encoder output to context (4 -> 5)
  for (let s = 0; s < 3; s++) {
    for (let t = 0; t < 3; t++) {
      connections.push({
        source: `L4-${s}`,
        target: `L5-${t}`,
        weight: 0.5,
      });
    }
  }

  // Sequential decoder connections (layers 6-13)
  for (let li = 6; li < 13; li++) {
    const srcCount = FULL_LAYERS[li].neurons;
    const tgtCount = FULL_LAYERS[li + 1].neurons;
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

  // Cross-attention: Context (5) -> Cross Attn layer (9)
  for (let s = 0; s < 3; s++) {
    for (let t = 0; t < 3; t++) {
      connections.push({
        source: `L5-${s}`,
        target: `L9-${t}`,
        weight: 0.5,
      });
    }
  }

  return connections;
}

export function generateFullTransformerSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const layers = buildLayers();
  const baseNeurons = buildNeurons();
  const baseConnections = buildConnections();

  function makeNeurons(
    activeLayer: number,
    highlightColor: "neuron-input" | "neuron-hidden" | "neuron-output" | "attention-high" = "neuron-hidden"
  ): NeuronData[] {
    return baseNeurons.map((n) => {
      if (n.layer === activeLayer) {
        return { ...n, highlight: highlightColor, value: Math.round(Math.random() * 10) / 10 };
      }
      if (n.layer < activeLayer) {
        return { ...n, highlight: "completed" as const };
      }
      return { ...n };
    });
  }

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description:
      "The Full Transformer (Vaswani et al., 2017): An encoder-decoder architecture that revolutionized NLP. The encoder processes the source sequence, the decoder generates the target sequence, connected through cross-attention. Used in machine translation, summarization, and was the foundation for BERT, GPT, and all modern LLMs.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: baseNeurons.map((n) => ({ ...n })),
      connections: baseConnections.map((c) => ({ ...c })),
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 1: Source embedding
  steps.push({
    id: stepId++,
    description:
      "Source Embedding: Input tokens (e.g., \"Hello world\") are converted to embeddings and summed with positional encodings. These d_model-dimensional vectors enter the encoder stack.",
    action: "embed",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(0, "neuron-input"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 0,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 2: Encoder Block 1
  steps.push({
    id: stepId++,
    description:
      "Encoder Block 1: The first encoder block processes the source sequence. LayerNorm -> Self-Attention -> Add&Norm -> FFN -> Add&Norm. Each token can attend to all other source tokens.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(1, "neuron-hidden"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 1,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 3: Encoder MHA 1
  steps.push({
    id: stepId++,
    description:
      "Encoder Self-Attention (Block 1): Multi-head attention allows each source token to gather context from all other source tokens. \"Hello\" attends to \"world\" and vice versa. This creates context-aware representations.",
    action: "attend",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(2, "attention-high"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 2,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 4: Encoder Block 2
  steps.push({
    id: stepId++,
    description:
      "Encoder Block 2: The second encoder block further refines representations. Deeper layers capture more abstract relationships. The original Transformer uses N=6 encoder blocks.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(3, "neuron-hidden"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 3,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 5: Encoder MHA 2
  steps.push({
    id: stepId++,
    description:
      "Encoder Self-Attention (Block 2): Second round of attention further enriches the representations. Higher layers tend to capture more semantic (meaning) relationships, while lower layers capture more syntactic (grammar) patterns.",
    action: "attend",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(4, "attention-high"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 4,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 6: Context
  steps.push({
    id: stepId++,
    description:
      "Encoder Output (Context): The final encoder representations serve as the \"memory\" for the decoder. Unlike Seq2Seq which compresses to a single vector, the Transformer passes ALL encoder hidden states to the decoder through cross-attention.",
    action: "encode",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(5, "attention-high"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 5,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 7: Target embedding
  steps.push({
    id: stepId++,
    description:
      "Target Embedding: Decoder input tokens (e.g., \"<SOS> Bonjour\") are embedded and summed with positional encodings. During training, the full target sequence is provided (teacher forcing). During inference, tokens are generated one at a time.",
    action: "embed",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(6, "neuron-input"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 6,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 8: Decoder Block 1
  steps.push({
    id: stepId++,
    description:
      "Decoder Block 1: Each decoder block has THREE sub-layers: (1) Masked self-attention, (2) Cross-attention to encoder output, (3) FFN. This is more complex than encoder blocks.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(7, "neuron-hidden"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 7,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 9: Masked self-attention
  steps.push({
    id: stepId++,
    description:
      "Masked Self-Attention: The decoder can only attend to previous positions (causal mask). When generating \"monde\", it can see \"<SOS> Bonjour le\" but not future tokens. This prevents information leakage during training and enables autoregressive generation.",
    action: "attend",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(8, "attention-high"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 8,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 10: Cross-attention
  steps.push({
    id: stepId++,
    description:
      "Cross-Attention: The decoder attends to the encoder output. Queries come from the decoder, Keys and Values come from the encoder. This is how the decoder \"reads\" the source sequence. Each decoder token can focus on different parts of the source.",
    action: "attend",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(9, "attention-high"),
      connections: baseConnections.map((c) => {
        if (c.source.startsWith("L5-") && c.target.startsWith("L9-")) {
          return { ...c, highlight: "attention-high" as const };
        }
        return { ...c };
      }),
      currentLayer: 9,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 11: Decoder Block 2
  steps.push({
    id: stepId++,
    description:
      "Decoder Block 2: Second decoder block applies masked self-attention, cross-attention, and FFN again. Stacking multiple decoder blocks (N=6 in original) enables progressively richer output representations.",
    action: "forward-pass",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(10, "neuron-hidden"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 10,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 12: Linear + Softmax
  steps.push({
    id: stepId++,
    description:
      "Output Layer: A linear projection maps from d_model to vocabulary size, followed by softmax to produce a probability distribution over the vocabulary. The token with highest probability is selected (greedy) or sampled (nucleus/top-p sampling).",
    action: "activate",
    highlights: [],
    data: {
      layers,
      neurons: (() => {
        const n = makeNeurons(12, "neuron-hidden");
        return n.map((ne) => {
          if (ne.layer === 13) return { ...ne, highlight: "neuron-output" as const, value: Math.round(Math.random() * 10) / 10 };
          return ne;
        });
      })(),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 12,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 13: Softmax output
  steps.push({
    id: stepId++,
    description:
      "Softmax Output: Probability distribution over the entire vocabulary (e.g., 50,000 tokens). The model predicts the next token: P(\"Bonjour\") = 0.85, P(\"Salut\") = 0.10, ... During training, cross-entropy loss compares this to the ground truth.",
    action: "activate",
    highlights: [],
    data: {
      layers,
      neurons: makeNeurons(13, "neuron-output"),
      connections: baseConnections.map((c) => ({ ...c })),
      currentLayer: 13,
      dataFlowDirection: "forward",
    } as NeuralNetStepData,
  });

  // Step 14: Summary
  steps.push({
    id: stepId++,
    description:
      "Full Transformer complete! Encoder-decoder architecture: Encoder (N blocks of self-attention + FFN) encodes source, Decoder (N blocks of masked self-attention + cross-attention + FFN) generates target autoregressively. Original paper: N=6, d_model=512, h=8 heads, d_ff=2048. This architecture spawned BERT (encoder-only), GPT (decoder-only), and T5 (full encoder-decoder).",
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
