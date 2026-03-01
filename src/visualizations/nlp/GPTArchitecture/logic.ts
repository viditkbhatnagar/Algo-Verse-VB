import type { VisualizationStep, NeuralNetStepData, NeuronData, ConnectionData } from "@/lib/visualization/types";

export function generateGPTArchitectureSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const layerNames = [
    "Token+Pos\nEmbed",
    "Decoder 1\n(Masked Attn)",
    "Decoder 2\n(Masked Attn)",
    "Decoder 3\n(Masked Attn)",
    "LM Head\n(Softmax)",
  ];

  const layerTypes: ("input" | "hidden" | "attention" | "output")[] = [
    "input", "attention", "attention", "attention", "output",
  ];

  const neuronsPerLayer = [4, 5, 5, 5, 4];
  const inputLabels = ["The", "cat", "sat", "on"];

  function buildNetwork(
    activeLayer?: number,
    direction?: "forward" | "backward",
    showValues?: boolean,
    maskedConnections?: boolean,
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
        const labels = l === 0 ? inputLabels :
                       l === layerNames.length - 1 ? ["cat", "sat", "on", "the"] :
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

    // Connect consecutive layers (with causal masking hint)
    for (let l = 0; l < layerNames.length - 1; l++) {
      const srcCount = neuronsPerLayer[l];
      const tgtCount = neuronsPerLayer[l + 1];
      for (let s = 0; s < srcCount; s++) {
        for (let t = 0; t < tgtCount; t++) {
          // In masked self-attention, tokens can only attend to previous positions
          const isMasked = maskedConnections && l >= 1 && l <= 3 && s > t;
          if (isMasked) continue;

          connections.push({
            source: `n-${l}-${s}`,
            target: `n-${l + 1}-${t}`,
            weight: isMasked ? 0 : 0.2 + Math.random() * 0.5,
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
    description: "GPT (Generative Pre-trained Transformer) uses stacked Transformer decoder layers with masked (causal) self-attention. Unlike BERT, GPT is autoregressive: each token can only attend to previous tokens, enabling text generation.",
    action: "encode",
    highlights: [],
    data: buildNetwork(),
  });

  // Step 1: Embedding
  steps.push({
    id: stepId++,
    description: `Input layer: tokens "${inputLabels.join('", "')}" receive token embeddings + positional embeddings (no segment embeddings unlike BERT). The positional encoding tells the model about word order since attention is position-agnostic.`,
    action: "encode",
    highlights: [],
    data: buildNetwork(0, "forward", true),
  });

  // Step 2-4: Decoder layers with masked attention
  for (let l = 1; l <= 3; l++) {
    steps.push({
      id: stepId++,
      description: `Transformer Decoder Layer ${l}: (1) Masked Multi-Head Self-Attention -- token at position i can ONLY attend to positions 0..i (causal mask prevents seeing future tokens). (2) Add & LayerNorm. (3) Feed-Forward Network (2 layers + GELU). (4) Add & LayerNorm. GPT-2 has 12-48 layers.`,
      action: "attend",
      highlights: [],
      data: buildNetwork(l, "forward", true, true),
    });
  }

  // Step 5: LM Head
  steps.push({
    id: stepId++,
    description: "Language Model Head: applies a linear projection + softmax over the vocabulary to predict the next token. Each position predicts the next word: P(token_{i+1} | token_1, ..., token_i). This enables autoregressive text generation.",
    action: "predict",
    highlights: [],
    data: buildNetwork(4, "forward", true),
  });

  // Step 6: Summary
  steps.push({
    id: stepId++,
    description: "GPT architecture complete! Key differences from BERT: (1) Unidirectional (causal) attention vs. bidirectional, (2) Autoregressive pre-training (next token prediction) vs. MLM, (3) Better for generation tasks, (4) GPT-2: 1.5B params, GPT-3: 175B params, GPT-4: estimated >1T params.",
    action: "complete",
    highlights: [],
    data: buildNetwork(),
  });

  return steps;
}
