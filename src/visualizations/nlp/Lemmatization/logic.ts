import type { VisualizationStep, TokenStepData, TokenData, TokenConnection } from "@/lib/visualization/types";

interface LemmaExample {
  word: string;
  pos: string;
  lemma: string;
  explanation: string;
}

export function generateLemmatizationSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const examples: LemmaExample[] = [
    { word: "running", pos: "VERB", lemma: "run", explanation: "Verb form -> base verb" },
    { word: "better", pos: "ADJ", lemma: "good", explanation: "Irregular comparative -> base adjective" },
    { word: "mice", pos: "NOUN", lemma: "mouse", explanation: "Irregular plural -> singular" },
    { word: "went", pos: "VERB", lemma: "go", explanation: "Irregular past tense -> base verb" },
    { word: "are", pos: "VERB", lemma: "be", explanation: "Conjugated form -> base verb" },
    { word: "geese", pos: "NOUN", lemma: "goose", explanation: "Irregular plural -> singular" },
    { word: "happily", pos: "ADV", lemma: "happily", explanation: "Adverb stays unchanged" },
    { word: "studies", pos: "VERB", lemma: "study", explanation: "3rd person singular -> base form" },
  ];

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: "Lemmatization reduces words to their dictionary form (lemma) using vocabulary and morphological analysis. Unlike stemming, it considers the part-of-speech (POS) tag and always produces valid words.",
    action: "tokenize",
    highlights: [],
    data: {
      tokens: examples.map((e, i) => ({
        id: `word-${i}`,
        text: e.word,
        type: e.pos,
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
      type: e.pos,
      position: idx,
      highlight: idx === i ? "active" as const : idx < i ? "completed" as const : undefined,
    }));

    const outputTokens: TokenData[] = examples.slice(0, i + 1).map((e, idx) => ({
      id: `lemma-${idx}`,
      text: e.lemma,
      type: e.pos,
      highlight: idx === i ? "active" as const : "completed" as const,
    }));

    const connections: TokenConnection[] = [{
      source: `word-${i}`,
      target: `lemma-${i}`,
      label: ex.pos,
      highlight: "active",
    }];

    steps.push({
      id: stepId++,
      description: `Lemmatizing "${ex.word}" (${ex.pos}) -> "${ex.lemma}". ${ex.explanation}. POS tag is crucial: "running" as NOUN stays "running", as VERB becomes "run".`,
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

  // Final
  steps.push({
    id: stepId++,
    description: `Lemmatization complete! All ${examples.length} words mapped to valid dictionary entries. Key advantage over stemming: "better" -> "good" (not "bet"), "mice" -> "mouse" (not "mic"). Requires POS tagger and morphological dictionary.`,
    action: "complete",
    highlights: [],
    data: {
      tokens: examples.map((e, i) => ({
        id: `word-${i}`,
        text: e.word,
        type: e.pos,
        position: i,
        highlight: "completed" as const,
      })),
      connections: [],
      outputTokens: examples.map((e, i) => ({
        id: `lemma-${i}`,
        text: e.lemma,
        type: e.pos,
        highlight: "completed" as const,
      })),
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  return steps;
}
