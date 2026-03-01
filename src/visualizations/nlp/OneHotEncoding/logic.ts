import type { VisualizationStep, TokenStepData, TokenData } from "@/lib/visualization/types";

export function generateOneHotEncodingSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const words = ["cat", "dog", "fish", "bird", "cat"];
  const vocab = Array.from(new Set(words)).sort();

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `One-Hot Encoding represents each word as a binary vector of vocabulary size. Only one element is 1 (the word's index), the rest are 0. Vocabulary: [${vocab.join(", ")}], size: ${vocab.length}.`,
    action: "encode",
    highlights: [],
    data: {
      tokens: words.map((w, i) => ({
        id: `word-${i}`,
        text: w,
        position: i,
      })),
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: vocab.map((v) => ({ token: v, count: words.filter(w => w === v).length })),
    } as TokenStepData,
  });

  // Step 1: Build vocabulary
  steps.push({
    id: stepId++,
    description: `Step 1: Build vocabulary by collecting unique words and assigning indices. ${vocab.map((v, i) => `"${v}" -> index ${i}`).join(", ")}. Vocabulary size V = ${vocab.length}.`,
    action: "encode",
    highlights: [],
    data: {
      tokens: vocab.map((v, i) => ({
        id: `vocab-${i}`,
        text: `${v} [${i}]`,
        position: i,
        highlight: "token" as const,
      })),
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  // Encode each word
  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    const vocabIdx = vocab.indexOf(word);
    const oneHot = vocab.map((_, i) => i === vocabIdx ? 1 : 0);

    const inputTokens: TokenData[] = words.map((wd, i) => ({
      id: `word-${i}`,
      text: wd,
      position: i,
      highlight: i === w ? "active" as const : i < w ? "completed" as const : undefined,
    }));

    const outputTokens: TokenData[] = oneHot.map((val, i) => ({
      id: `oh-${w}-${i}`,
      text: val.toString(),
      highlight: val === 1 ? "active" as const : undefined,
    }));

    steps.push({
      id: stepId++,
      description: `Encoding "${word}" (index ${vocabIdx}): one-hot = [${oneHot.join(", ")}]. The ${vocabIdx}-th position is 1, all others are 0. Vector dimension = vocabulary size = ${vocab.length}.`,
      action: "encode",
      highlights: [{ indices: [w], color: "active", label: "encoding" }],
      data: {
        tokens: inputTokens,
        connections: [],
        outputTokens,
        processingIndex: w,
        vocabulary: [],
      } as TokenStepData,
    });
  }

  // Summary
  steps.push({
    id: stepId++,
    description: `One-Hot Encoding complete! Each word is now a ${vocab.length}-dimensional binary vector. Limitations: (1) Vectors are orthogonal -- no similarity information, (2) High dimensionality for large vocabularies, (3) Sparse representation. Word embeddings (Word2Vec, GloVe) solve these issues.`,
    action: "complete",
    highlights: [],
    data: {
      tokens: words.map((w, i) => ({
        id: `word-${i}`,
        text: w,
        position: i,
        highlight: "completed" as const,
      })),
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: vocab.map((v, i) => ({ token: `${v} -> [${vocab.map((_, j) => j === i ? 1 : 0).join(",")}]`, count: i })),
    } as TokenStepData,
  });

  return steps;
}
