import type { VisualizationStep, TokenStepData, TokenData } from "@/lib/visualization/types";

export function generateTokenizationSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const sentence = "The quick brown fox jumps over the lazy dog";
  const words = sentence.split(" ");

  // Step 0: Show original sentence
  steps.push({
    id: stepId++,
    description: `Tokenization splits raw text into individual tokens (words, subwords, or characters). Input: "${sentence}"`,
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

  // Steps 1-N: Add tokens one by one
  for (let i = 0; i < words.length; i++) {
    const currentTokens: TokenData[] = words.slice(0, i + 1).map((w, idx) => ({
      id: `tok-${idx}`,
      text: w,
      position: idx,
      highlight: idx === i ? "active" as const : undefined,
    }));

    steps.push({
      id: stepId++,
      description: `Split token ${i + 1}/${words.length}: "${words[i]}" at position ${i}. Whitespace delimiter detected.`,
      action: "tokenize",
      highlights: [{ indices: [i], color: "active", label: "current" }],
      data: {
        tokens: currentTokens,
        connections: [],
        outputTokens: [],
        processingIndex: i,
        vocabulary: [],
      } as TokenStepData,
    });
  }

  // Build vocabulary
  const vocab = new Map<string, number>();
  for (const w of words) {
    const lower = w.toLowerCase();
    vocab.set(lower, (vocab.get(lower) ?? 0) + 1);
  }

  const allTokens: TokenData[] = words.map((w, idx) => ({
    id: `tok-${idx}`,
    text: w,
    position: idx,
    highlight: "completed" as const,
  }));

  steps.push({
    id: stepId++,
    description: `Tokenization complete! ${words.length} tokens extracted. Vocabulary size: ${vocab.size} unique tokens. Common next steps: lowercasing, stemming, stop-word removal.`,
    action: "complete",
    highlights: [],
    data: {
      tokens: allTokens,
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: Array.from(vocab.entries()).map(([token, count]) => ({ token, count })),
    } as TokenStepData,
  });

  return steps;
}
