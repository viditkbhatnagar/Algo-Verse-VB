import type { VisualizationStep, NeuralNetStepData, NeuronData, ConnectionData } from "@/lib/visualization/types";

export function generateBERTArchitectureSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // BERT layers: Embedding -> N Transformer Encoder layers -> Output
  const layerNames = [
    "Token+Pos\nEmbed",
    "Encoder 1\n(Self-Attn)",
    "Encoder 2\n(Self-Attn)",
    "Encoder 3\n(Self-Attn)",
    "Output\n(MLM/CLS)",
  ];

  const layerTypes: ("input" | "hidden" | "attention" | "output")[] = [
    "input", "attention", "attention", "attention", "output",
  ];

  const neuronsPerLayer = [4, 5, 5, 5, 4]; // compact display

  function buildNetwork(
    activeLayer?: number,
    direction?: "forward" | "backward",
    showValues?: boolean,
  ): NeuralNetStepData {
    const layers = layerNames.map((label, i) => ({
      label,
      type: layerTypes[i],
    }));

    const neurons: NeuronData[] = [];
    const connections: ConnectionData[] = [];

    for (let l = 0; l < layerNames.length; l++) {
      const count = neuronsPerLayer[l];
      for (let n = 0; n < count; n++) {
        const labels = l === 0 ? ["[CLS]", "The", "cat", "[SEP]"] :
                       l === layerNames.length - 1 ? ["CLS", "T1", "T2", "SEP"] :
                       undefined;
        neurons.push({
          id: `n-${l}-${n}`,
          layer: l,
          index: n,
          label: labels?.[n],
          value: showValues && l === activeLayer ? parseFloat((Math.random() * 0.5 + 0.3).toFixed(2)) : undefined,
          highlight: l === activeLayer ?
            (l === 0 ? "neuron-input" : l === layerNames.length - 1 ? "neuron-output" : "neuron-hidden") :
            undefined,
        });
      }
    }

    // Connect consecutive layers
    for (let l = 0; l < layerNames.length - 1; l++) {
      const srcCount = neuronsPerLayer[l];
      const tgtCount = neuronsPerLayer[l + 1];
      for (let s = 0; s < srcCount; s++) {
        for (let t = 0; t < tgtCount; t++) {
          connections.push({
            source: `n-${l}-${s}`,
            target: `n-${l + 1}-${t}`,
            weight: 0.2 + Math.random() * 0.5,
            highlight: l === activeLayer || l + 1 === activeLayer ? "positive-weight" : undefined,
          });
        }
      }
    }

    return { layers, neurons, connections, currentLayer: activeLayer, dataFlowDirection: direction };
  }

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: "BERT (Bidirectional Encoder Representations from Transformers) is a pre-trained language model that uses stacked Transformer encoder layers. It processes text bidirectionally -- attending to both left and right context simultaneously.",
    action: "encode",
    highlights: [],
    data: buildNetwork(),
  });

  // Step 1: Token + Position Embedding
  steps.push({
    id: stepId++,
    description: "Input layer: each token gets 3 embeddings summed together: (1) Token embedding from vocabulary, (2) Position embedding for word order, (3) Segment embedding for sentence A/B distinction. Special tokens: [CLS] for classification, [SEP] for sentence boundary.",
    action: "encode",
    highlights: [],
    data: buildNetwork(0, "forward", true),
  });

  // Step 2-4: Transformer encoder layers
  for (let l = 1; l <= 3; l++) {
    steps.push({
      id: stepId++,
      description: `Transformer Encoder Layer ${l}: (1) Multi-Head Self-Attention -- each token attends to ALL tokens in the sequence (bidirectional). (2) Add & LayerNorm. (3) Feed-Forward Network (2 linear layers + GELU). (4) Add & LayerNorm. BERT-base has 12 such layers, 768 hidden dim, 12 attention heads.`,
      action: "attend",
      highlights: [],
      data: buildNetwork(l, "forward", true),
    });
  }

  // Step 5: Output
  steps.push({
    id: stepId++,
    description: "Output layer: [CLS] token representation is used for classification tasks (sentiment, NLI). Individual token representations are used for token-level tasks (NER, Q&A). Pre-training uses Masked Language Modeling (MLM) and Next Sentence Prediction (NSP).",
    action: "predict",
    highlights: [],
    data: buildNetwork(4, "forward", true),
  });

  // Step 6: Summary
  steps.push({
    id: stepId++,
    description: "BERT architecture complete! Key innovations: (1) Bidirectional self-attention (vs. GPT's left-to-right), (2) MLM pre-training (randomly mask 15% of tokens), (3) Fine-tuning paradigm (one model, many tasks). BERT-base: 110M params, BERT-large: 340M params.",
    action: "complete",
    highlights: [],
    data: buildNetwork(),
  });

  return steps;
}
