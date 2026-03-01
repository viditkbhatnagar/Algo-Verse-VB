import type { VisualizationStep, TokenStepData, TokenData } from "@/lib/visualization/types";

export function generateBagOfWordsSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const sentence = "the cat sat on the mat the cat";
  const words = sentence.split(" ");

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `Bag of Words (BoW) represents text as a frequency vector, discarding word order. Input: "${sentence}". Each word becomes a dimension and its count becomes the value.`,
    action: "tokenize",
    highlights: [],
    data: {
      tokens: [{ id: "raw-0", text: sentence, highlight: "token" }],
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  // Step 1: Tokenize
  steps.push({
    id: stepId++,
    description: `Step 1: Tokenize the text into ${words.length} individual words. Word order will be discarded in the bag-of-words representation.`,
    action: "tokenize",
    highlights: [],
    data: {
      tokens: words.map((w, i) => ({
        id: `tok-${i}`,
        text: w,
        position: i,
      })),
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  // Build frequency counts incrementally
  const freq = new Map<string, number>();
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    freq.set(word, (freq.get(word) ?? 0) + 1);

    const inputTokens: TokenData[] = words.map((w, idx) => ({
      id: `tok-${idx}`,
      text: w,
      position: idx,
      highlight: idx === i ? "active" as const : idx < i ? "completed" as const : undefined,
    }));

    const vocabSoFar = Array.from(freq.entries()).map(([token, count]) => ({ token, count }));

    steps.push({
      id: stepId++,
      description: `Counting word ${i + 1}/${words.length}: "${word}". Current count: ${freq.get(word)}. Vocabulary size: ${freq.size}.`,
      action: "tokenize",
      highlights: [{ indices: [i], color: "active", label: "counting" }],
      data: {
        tokens: inputTokens,
        connections: [],
        outputTokens: [],
        processingIndex: i,
        vocabulary: vocabSoFar,
      } as TokenStepData,
    });
  }

  // Final vector representation
  const vocabArray = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);
  const vectorTokens: TokenData[] = vocabArray.map(([word, count], i) => ({
    id: `vec-${i}`,
    text: `${word}: ${count}`,
    highlight: "completed" as const,
  }));

  steps.push({
    id: stepId++,
    description: `Bag of Words complete! Vector: [${vocabArray.map(([w, c]) => `${w}=${c}`).join(", ")}]. Vocabulary size: ${freq.size}. This sparse vector can be used for document classification, similarity computation, or as input to ML models.`,
    action: "complete",
    highlights: [],
    data: {
      tokens: vectorTokens,
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: vocabArray.map(([token, count]) => ({ token, count })),
    } as TokenStepData,
  });

  return steps;
}
