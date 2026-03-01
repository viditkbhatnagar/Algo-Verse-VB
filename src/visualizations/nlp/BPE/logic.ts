import type { VisualizationStep, TokenStepData, TokenData } from "@/lib/visualization/types";

export function generateBPESteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // BPE iteratively merges the most frequent adjacent pair of symbols
  // Starting vocabulary: individual characters + end-of-word marker
  const corpus = ["low", "lowest", "newer", "wider", "low"];

  // Start with character-level tokenization
  const initialTokens: string[][] = corpus.map((word) =>
    [...word.split(""), "</w>"]
  );

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `Byte Pair Encoding (BPE) builds a subword vocabulary by iteratively merging the most frequent adjacent character pair. Starting with character-level tokens from corpus: [${corpus.join(", ")}]. BPE is used by GPT-2, RoBERTa, and many modern LLMs.`,
    action: "tokenize",
    highlights: [],
    data: {
      tokens: corpus.map((w, i) => ({
        id: `word-${i}`,
        text: w,
        position: i,
      })),
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  // Step 1: Character-level tokenization
  const charTokens: TokenData[] = [];
  let idx = 0;
  for (let w = 0; w < initialTokens.length; w++) {
    for (const char of initialTokens[w]) {
      charTokens.push({
        id: `char-${idx++}`,
        text: char,
        type: char === "</w>" ? "SUBWORD" : undefined,
      });
    }
    if (w < initialTokens.length - 1) {
      charTokens.push({ id: `sep-${w}`, text: "|", type: undefined });
    }
  }

  steps.push({
    id: stepId++,
    description: `Step 1: Split all words into individual characters plus end-of-word marker </w>. Initial vocabulary: all unique characters. Total tokens: ${charTokens.filter(t => t.text !== "|").length}.`,
    action: "tokenize",
    highlights: [],
    data: {
      tokens: charTokens,
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  // Simulate BPE merge steps
  const mergeSteps = [
    { pair: "l o", merged: "lo", explanation: "Most frequent pair: 'l' + 'o' appears 3 times (low, low, lowest)" },
    { pair: "lo w", merged: "low", explanation: "Next: 'lo' + 'w' appears 3 times" },
    { pair: "e r", merged: "er", explanation: "Next: 'e' + 'r' appears 2 times (newer, wider)" },
    { pair: "e s", merged: "es", explanation: "Next: 'e' + 's' appears 1 time (lowest)" },
    { pair: "n e", merged: "ne", explanation: "Next: 'n' + 'e' appears 1 time (newer)" },
    { pair: "w i", merged: "wi", explanation: "Next: 'w' + 'i' appears 1 time (wider)" },
  ];

  const vocab: string[] = ["l", "o", "w", "e", "s", "t", "n", "r", "i", "d", "</w>"];

  for (let m = 0; m < mergeSteps.length; m++) {
    const merge = mergeSteps[m];
    vocab.push(merge.merged);

    const mergedTokens: TokenData[] = [
      { id: `merge-old-${m}`, text: merge.pair, type: "SUBWORD", highlight: "active" as const },
      { id: `merge-arrow-${m}`, text: "->", highlight: undefined },
      { id: `merge-new-${m}`, text: merge.merged, type: "MERGED", highlight: "completed" as const },
    ];

    steps.push({
      id: stepId++,
      description: `BPE Merge ${m + 1}: "${merge.pair}" -> "${merge.merged}". ${merge.explanation}. Vocabulary size: ${vocab.length}. The merged token is added to the vocabulary and all occurrences are replaced.`,
      action: "tokenize",
      highlights: [],
      data: {
        tokens: mergedTokens,
        connections: [],
        outputTokens: [],
        processingIndex: undefined,
        vocabulary: vocab.slice(-8).map((v) => ({ token: v, count: 1 })),
      } as TokenStepData,
    });
  }

  // Final result
  const finalTokenizations = [
    ["low", "</w>"],
    ["low", "es", "t", "</w>"],
    ["ne", "w", "er", "</w>"],
    ["wi", "d", "er", "</w>"],
    ["low", "</w>"],
  ];

  const finalTokens: TokenData[] = [];
  let fi = 0;
  for (let w = 0; w < finalTokenizations.length; w++) {
    for (const tok of finalTokenizations[w]) {
      finalTokens.push({
        id: `final-${fi++}`,
        text: tok,
        type: tok.length > 1 && tok !== "</w>" ? "MERGED" : "SUBWORD",
        highlight: "completed" as const,
      });
    }
    if (w < finalTokenizations.length - 1) {
      finalTokens.push({ id: `fsep-${w}`, text: "|" });
    }
  }

  steps.push({
    id: stepId++,
    description: `BPE complete! Final vocabulary: ${vocab.length} tokens. Results: ${corpus.map((w, i) => `"${w}" -> [${finalTokenizations[i].join(", ")}]`).join("; ")}. BPE handles unknown words by splitting into known subwords, eliminating OOV (out-of-vocabulary) problems.`,
    action: "complete",
    highlights: [],
    data: {
      tokens: finalTokens,
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: vocab.map((v) => ({ token: v, count: 1 })),
    } as TokenStepData,
  });

  return steps;
}
