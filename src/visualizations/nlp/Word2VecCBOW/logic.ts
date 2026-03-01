import type { VisualizationStep, NeuralNetStepData, NeuronData, ConnectionData } from "@/lib/visualization/types";

export function generateWord2VecCBOWSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const sentence = ["the", "quick", "brown", "fox", "jumps"];
  const windowSize = 2;
  const targetIdx = 2; // "brown"
  const contextWords = [sentence[0], sentence[1], sentence[3], sentence[4]];
  const targetWord = sentence[targetIdx];
  const hiddenSize = 3;

  function buildNetwork(
    activeLayer?: number,
    direction?: "forward" | "backward",
    contextHighlight?: boolean,
    hiddenValues?: number[],
    outputValues?: number[],
  ): NeuralNetStepData {
    const layers = [
      { label: "Context Input", type: "input" as const },
      { label: "Projection", type: "hidden" as const },
      { label: "Output", type: "output" as const },
    ];

    const neurons: NeuronData[] = [];
    // Input layer: 4 context words
    for (let i = 0; i < contextWords.length; i++) {
      neurons.push({
        id: `i-${i}`,
        layer: 0,
        index: i,
        label: contextWords[i],
        value: contextHighlight ? 1 : undefined,
        highlight: activeLayer === 0 ? "neuron-input" : undefined,
      });
    }
    // Hidden layer
    for (let i = 0; i < hiddenSize; i++) {
      neurons.push({
        id: `h-${i}`,
        layer: 1,
        index: i,
        value: hiddenValues?.[i],
        highlight: activeLayer === 1 ? "neuron-hidden" : undefined,
      });
    }
    // Output layer: target word
    neurons.push({
      id: "o-0",
      layer: 2,
      index: 0,
      label: targetWord,
      value: outputValues?.[0],
      highlight: activeLayer === 2 ? "neuron-output" : undefined,
    });

    const connections: ConnectionData[] = [];
    // Input -> Hidden
    for (let i = 0; i < contextWords.length; i++) {
      for (let h = 0; h < hiddenSize; h++) {
        connections.push({
          source: `i-${i}`,
          target: `h-${h}`,
          weight: 0.3 + Math.random() * 0.4,
          highlight: activeLayer === 0 || activeLayer === 1 ? "positive-weight" : undefined,
        });
      }
    }
    // Hidden -> Output
    for (let h = 0; h < hiddenSize; h++) {
      connections.push({
        source: `h-${h}`,
        target: "o-0",
        weight: 0.3 + Math.random() * 0.4,
        highlight: activeLayer === 1 || activeLayer === 2 ? "positive-weight" : undefined,
      });
    }

    return {
      layers,
      neurons,
      connections,
      currentLayer: activeLayer,
      dataFlowDirection: direction,
    };
  }

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `Word2Vec CBOW (Continuous Bag of Words) predicts a target word from its context words. Window size = ${windowSize}. Sentence: "${sentence.join(" ")}". Target: "${targetWord}", Context: [${contextWords.map(w => `"${w}"`).join(", ")}].`,
    action: "encode",
    highlights: [],
    data: buildNetwork(),
  });

  // Step 1: Input context words
  steps.push({
    id: stepId++,
    description: `Input layer receives one-hot encoded context words: [${contextWords.join(", ")}]. Each word is a sparse vector of vocabulary size where only one element is 1. These are averaged in the projection layer.`,
    action: "encode",
    highlights: [],
    data: buildNetwork(0, "forward", true),
  });

  // Step 2: Projection (hidden) layer
  const hiddenVals = [0.42, 0.68, 0.31];
  steps.push({
    id: stepId++,
    description: `Projection layer averages the embedding vectors of all context words: h = (v_the + v_quick + v_fox + v_jumps) / 4. This produces a dense vector [${hiddenVals.join(", ")}] that represents the combined context.`,
    action: "forward-pass",
    highlights: [],
    data: buildNetwork(1, "forward", true, hiddenVals),
  });

  // Step 3: Output layer
  steps.push({
    id: stepId++,
    description: `Output layer computes softmax over the entire vocabulary. The model should assign the highest probability to "${targetWord}". P("${targetWord}" | context) is computed via dot product of hidden state with output weight matrix.`,
    action: "predict",
    highlights: [],
    data: buildNetwork(2, "forward", true, hiddenVals, [0.82]),
  });

  // Step 4: Loss and backprop
  steps.push({
    id: stepId++,
    description: `Loss = -log(P("${targetWord}" | context)). Backpropagation updates both the input embeddings (W matrix) and output weights (W' matrix). After many iterations, words with similar contexts get similar embeddings.`,
    action: "backprop",
    highlights: [],
    data: buildNetwork(1, "backward", true, hiddenVals, [0.82]),
  });

  // Step 5: Summary
  steps.push({
    id: stepId++,
    description: `Word2Vec CBOW training complete for this sample! The learned weight matrix W becomes the word embedding matrix. CBOW is faster to train than Skip-gram and works well for frequent words. Embedding dimensionality is typically 100-300.`,
    action: "complete",
    highlights: [],
    data: buildNetwork(undefined, undefined, true, hiddenVals, [0.82]),
  });

  return steps;
}
