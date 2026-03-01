import type { VisualizationStep, TokenStepData, TokenData, TokenConnection } from "@/lib/visualization/types";

interface StemExample {
  word: string;
  stem: string;
  rule: string;
}

export function generateStemmingSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const examples: StemExample[] = [
    { word: "running", stem: "run", rule: "Remove -ning" },
    { word: "flies", stem: "fli", rule: "Replace -ies with -i" },
    { word: "happily", stem: "happili", rule: "Replace -ly suffix" },
    { word: "connection", stem: "connect", rule: "Remove -ion" },
    { word: "generalization", stem: "general", rule: "Remove -ization" },
    { word: "playing", stem: "play", rule: "Remove -ing" },
    { word: "caresses", stem: "caress", rule: "Remove -es" },
    { word: "ponies", stem: "poni", rule: "Replace -ies with -i" },
  ];

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: "Stemming reduces words to their root form by removing suffixes. The Porter Stemmer applies a series of rules to strip common English suffixes. Unlike lemmatization, stemming may produce non-dictionary words.",
    action: "tokenize",
    highlights: [],
    data: {
      tokens: examples.map((e, i) => ({
        id: `word-${i}`,
        text: e.word,
        position: i,
      })),
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  // Process each word
  for (let i = 0; i < examples.length; i++) {
    const ex = examples[i];
    const inputTokens: TokenData[] = examples.map((e, idx) => ({
      id: `word-${idx}`,
      text: e.word,
      position: idx,
      highlight: idx === i ? "active" as const : idx < i ? "completed" as const : undefined,
    }));

    const outputTokens: TokenData[] = examples.slice(0, i + 1).map((e, idx) => ({
      id: `stem-${idx}`,
      text: e.stem,
      type: idx === i ? "MERGED" : undefined,
      highlight: idx === i ? "active" as const : "completed" as const,
    }));

    const connections: TokenConnection[] = [{
      source: `word-${i}`,
      target: `stem-${i}`,
      label: ex.rule,
      highlight: "active",
    }];

    steps.push({
      id: stepId++,
      description: `Stemming "${ex.word}" -> "${ex.stem}". Rule: ${ex.rule}. The suffix is stripped to approximate the root form.`,
      action: "tokenize",
      highlights: [{ indices: [i], color: "active", label: "current" }],
      data: {
        tokens: inputTokens,
        connections,
        outputTokens,
        processingIndex: i,
        vocabulary: [],
      } as TokenStepData,
    });
  }

  // Final summary
  steps.push({
    id: stepId++,
    description: `Stemming complete! ${examples.length} words processed. Note that stems like "fli" and "poni" are not real words -- this is expected behavior. Stemming is fast but aggressive; lemmatization is more accurate.`,
    action: "complete",
    highlights: [],
    data: {
      tokens: examples.map((e, i) => ({
        id: `word-${i}`,
        text: e.word,
        position: i,
        highlight: "completed" as const,
      })),
      connections: examples.map((e, i) => ({
        source: `word-${i}`,
        target: `stem-${i}`,
        label: e.rule,
        highlight: "completed" as const,
      })),
      outputTokens: examples.map((e, i) => ({
        id: `stem-${i}`,
        text: e.stem,
        highlight: "completed" as const,
      })),
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  return steps;
}
