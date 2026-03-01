import type { VisualizationStep, NeuralNetStepData, NeuronData, ConnectionData } from "@/lib/visualization/types";

export function generateWord2VecSkipGramSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const sentence = ["the", "quick", "brown", "fox", "jumps"];
  const targetIdx = 2;
  const targetWord = sentence[targetIdx];
  const contextWords = [sentence[0], sentence[1], sentence[3], sentence[4]];
  const hiddenSize = 3;

  function buildNetwork(
    activeLayer?: number,
    direction?: "forward" | "backward",
    hiddenValues?: number[],
    outputValues?: number[],
  ): NeuralNetStepData {
    const layers = [
      { label: "Target Input", type: "input" as const },
      { label: "Embedding", type: "hidden" as const },
      { label: "Context Output", type: "output" as const },
    ];

    const neurons: NeuronData[] = [];
    // Input: single target word
    neurons.push({
      id: "i-0",
      layer: 0,
      index: 0,
      label: targetWord,
      value: 1,
      highlight: activeLayer === 0 ? "neuron-input" : undefined,
    });

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

    // Output: multiple context words
    for (let i = 0; i < contextWords.length; i++) {
      neurons.push({
        id: `o-${i}`,
        layer: 2,
        index: i,
        label: contextWords[i],
        value: outputValues?.[i],
        highlight: activeLayer === 2 ? "neuron-output" : undefined,
      });
    }

    const connections: ConnectionData[] = [];
    // Input -> Hidden
    for (let h = 0; h < hiddenSize; h++) {
      connections.push({
        source: "i-0",
        target: `h-${h}`,
        weight: 0.3 + Math.random() * 0.4,
        highlight: activeLayer === 0 || activeLayer === 1 ? "positive-weight" : undefined,
      });
    }
    // Hidden -> Output
    for (let h = 0; h < hiddenSize; h++) {
      for (let o = 0; o < contextWords.length; o++) {
        connections.push({
          source: `h-${h}`,
          target: `o-${o}`,
          weight: 0.2 + Math.random() * 0.5,
          highlight: activeLayer === 1 || activeLayer === 2 ? "positive-weight" : undefined,
        });
      }
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
    description: `Word2Vec Skip-gram predicts context words from a target word -- the reverse of CBOW. Target: "${targetWord}", Expected context: [${contextWords.map(w => `"${w}"`).join(", ")}]. Skip-gram works better for rare words.`,
    action: "encode",
    highlights: [],
    data: buildNetwork(),
  });

  // Step 1: Input target word
  steps.push({
    id: stepId++,
    description: `The target word "${targetWord}" is one-hot encoded and fed into the network. Unlike CBOW which averages multiple inputs, Skip-gram has a single word as input and must predict multiple context words.`,
    action: "encode",
    highlights: [],
    data: buildNetwork(0, "forward"),
  });

  // Step 2: Embedding lookup
  const hiddenVals = [0.55, 0.33, 0.71];
  steps.push({
    id: stepId++,
    description: `The hidden layer performs an embedding lookup: h = W[index("${targetWord}")]. This extracts the row corresponding to "${targetWord}" from the weight matrix. Result: [${hiddenVals.join(", ")}]. This IS the word embedding!`,
    action: "forward-pass",
    highlights: [],
    data: buildNetwork(1, "forward", hiddenVals),
  });

  // Step 3: Predict context words
  const outputVals = [0.71, 0.85, 0.63, 0.59];
  steps.push({
    id: stepId++,
    description: `For each context position, compute softmax probability over vocabulary. The model should maximize P(context | target). Predictions: ${contextWords.map((w, i) => `P("${w}")=${outputVals[i].toFixed(2)}`).join(", ")}.`,
    action: "predict",
    highlights: [],
    data: buildNetwork(2, "forward", hiddenVals, outputVals),
  });

  // Step 4: Backpropagation
  steps.push({
    id: stepId++,
    description: `Loss = -sum(log P(context_i | target)) for all context positions. Gradients flow backward to update both W (input embeddings) and W' (output matrix). Negative sampling is typically used instead of full softmax for efficiency.`,
    action: "backprop",
    highlights: [],
    data: buildNetwork(1, "backward", hiddenVals, outputVals),
  });

  // Step 5: Summary
  steps.push({
    id: stepId++,
    description: `Skip-gram training complete for this sample! The input weight matrix W gives word embeddings. Skip-gram excels at capturing syntactic/semantic relationships: vector("king") - vector("man") + vector("woman") ~ vector("queen"). It handles rare words better than CBOW.`,
    action: "complete",
    highlights: [],
    data: buildNetwork(undefined, undefined, hiddenVals, outputVals),
  });

  return steps;
}
