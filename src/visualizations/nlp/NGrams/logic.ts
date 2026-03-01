import type { VisualizationStep, TokenStepData, TokenData } from "@/lib/visualization/types";

export function generateNGramsSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const words = ["the", "cat", "sat", "on", "the", "mat"];
  const n = 3; // trigrams

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `N-grams are contiguous sequences of N items from a text. We will extract trigrams (N=3) from: "${words.join(" ")}". N-grams capture local word context and are fundamental to language modeling.`,
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

  // Bigram step first
  const bigrams: string[] = [];
  for (let i = 0; i <= words.length - 2; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }

  steps.push({
    id: stepId++,
    description: `First, bigrams (N=2): ${bigrams.map(b => `"${b}"`).join(", ")}. The sliding window of size 2 moves one token at a time across the sequence.`,
    action: "tokenize",
    highlights: [{ indices: [0, 1], color: "window", label: "bigram window" }],
    data: {
      tokens: words.map((w, i) => ({
        id: `tok-${i}`,
        text: w,
        position: i,
        highlight: i < 2 ? "window" as const : undefined,
      })),
      connections: [],
      outputTokens: bigrams.map((b, i) => ({
        id: `bigram-${i}`,
        text: b,
        highlight: "token" as const,
      })),
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  // Sliding window for trigrams
  const trigrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    const ngram = words.slice(i, i + n).join(" ");
    trigrams.push(ngram);

    const inputTokens: TokenData[] = words.map((w, idx) => ({
      id: `tok-${idx}`,
      text: w,
      position: idx,
      highlight: idx >= i && idx < i + n ? "window" as const : idx < i ? "completed" as const : undefined,
    }));

    const outputTokens: TokenData[] = trigrams.map((t, idx) => ({
      id: `trigram-${idx}`,
      text: t,
      highlight: idx === trigrams.length - 1 ? "active" as const : "completed" as const,
    }));

    steps.push({
      id: stepId++,
      description: `Trigram ${i + 1}/${words.length - n + 1}: Window [${i}, ${i + n - 1}] = "${ngram}". The window slides right by 1 position each step.`,
      action: "slide-window",
      highlights: [{ indices: Array.from({ length: n }, (_, k) => i + k), color: "window", label: "window" }],
      data: {
        tokens: inputTokens,
        connections: [],
        outputTokens,
        processingIndex: i,
        vocabulary: [],
      } as TokenStepData,
    });
  }

  // Summary
  steps.push({
    id: stepId++,
    description: `N-gram extraction complete! Generated ${trigrams.length} trigrams from ${words.length} tokens. Formula: for a sequence of length L with N-gram size N, the number of N-grams = L - N + 1 = ${words.length} - ${n} + 1 = ${trigrams.length}.`,
    action: "complete",
    highlights: [],
    data: {
      tokens: words.map((w, i) => ({
        id: `tok-${i}`,
        text: w,
        position: i,
        highlight: "completed" as const,
      })),
      connections: [],
      outputTokens: trigrams.map((t, i) => ({
        id: `trigram-${i}`,
        text: t,
        highlight: "completed" as const,
      })),
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  return steps;
}
