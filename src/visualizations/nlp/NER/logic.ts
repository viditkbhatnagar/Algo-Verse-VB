import type { VisualizationStep, TokenStepData, TokenData } from "@/lib/visualization/types";

interface EntityWord {
  word: string;
  entityType: string | null;
  bioTag: string;
}

export function generateNERSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const words: EntityWord[] = [
    { word: "Barack", entityType: "PERSON", bioTag: "B-PER" },
    { word: "Obama", entityType: "PERSON", bioTag: "I-PER" },
    { word: "visited", entityType: null, bioTag: "O" },
    { word: "the", entityType: null, bioTag: "O" },
    { word: "White", entityType: "LOC", bioTag: "B-LOC" },
    { word: "House", entityType: "LOC", bioTag: "I-LOC" },
    { word: "in", entityType: null, bioTag: "O" },
    { word: "Washington", entityType: "LOC", bioTag: "B-LOC" },
    { word: "on", entityType: null, bioTag: "O" },
    { word: "January", entityType: "DATE", bioTag: "B-DATE" },
    { word: "20", entityType: "DATE", bioTag: "I-DATE" },
  ];

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `Named Entity Recognition (NER) identifies and classifies named entities in text into predefined categories: PERSON, LOCATION, DATE, ORGANIZATION, etc. Using BIO tagging scheme (B=Beginning, I=Inside, O=Outside).`,
    action: "tokenize",
    highlights: [],
    data: {
      tokens: words.map((w, i) => ({
        id: `tok-${i}`,
        text: w.word,
        position: i,
      })),
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: [],
    } as TokenStepData,
  });

  // Process each word
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const inputTokens: TokenData[] = words.map((word, idx) => ({
      id: `tok-${idx}`,
      text: word.word,
      position: idx,
      type: idx <= i && word.entityType ? word.entityType : undefined,
      highlight: idx === i ? "active" as const : idx < i && word.entityType ? "completed" as const : undefined,
    }));

    const outputTokens: TokenData[] = words.slice(0, i + 1).map((word, idx) => ({
      id: `tag-${idx}`,
      text: word.bioTag,
      type: word.entityType ?? undefined,
      highlight: idx === i ? "active" as const : "completed" as const,
    }));

    const entityLabel = w.entityType ? `${w.entityType} (${w.bioTag})` : "O (Outside any entity)";
    steps.push({
      id: stepId++,
      description: `Token "${w.word}" -> ${entityLabel}. ${w.bioTag.startsWith("B-") ? "Beginning of a new entity span." : w.bioTag.startsWith("I-") ? "Continuation of current entity span." : "Not part of any named entity."}`,
      action: "classify",
      highlights: [{ indices: [i], color: "active", label: "classifying" }],
      data: {
        tokens: inputTokens,
        connections: [],
        outputTokens,
        processingIndex: i,
        vocabulary: [],
      } as TokenStepData,
    });
  }

  // Summary: show all entities highlighted
  const entities: { text: string; type: string }[] = [];
  let current: string[] = [];
  let currentType = "";
  for (const w of words) {
    if (w.bioTag.startsWith("B-")) {
      if (current.length > 0) entities.push({ text: current.join(" "), type: currentType });
      current = [w.word];
      currentType = w.entityType!;
    } else if (w.bioTag.startsWith("I-")) {
      current.push(w.word);
    } else {
      if (current.length > 0) entities.push({ text: current.join(" "), type: currentType });
      current = [];
      currentType = "";
    }
  }
  if (current.length > 0) entities.push({ text: current.join(" "), type: currentType });

  steps.push({
    id: stepId++,
    description: `NER complete! Found ${entities.length} entities: ${entities.map(e => `"${e.text}" (${e.type})`).join(", ")}. NER is typically solved using BiLSTM-CRF or fine-tuned BERT with a token classification head.`,
    action: "complete",
    highlights: [],
    data: {
      tokens: words.map((w, i) => ({
        id: `tok-${i}`,
        text: w.word,
        position: i,
        type: w.entityType ?? undefined,
        highlight: w.entityType ? "completed" as const : undefined,
      })),
      connections: [],
      outputTokens: [],
      processingIndex: undefined,
      vocabulary: entities.map((e) => ({ token: `${e.text} [${e.type}]`, count: 1 })),
    } as TokenStepData,
  });

  return steps;
}
