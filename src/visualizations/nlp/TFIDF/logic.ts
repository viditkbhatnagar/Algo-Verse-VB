import type { VisualizationStep, HeatmapStepData, HeatmapCell } from "@/lib/visualization/types";

export function generateTFIDFSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const docs = [
    "the cat sat on the mat",
    "the dog chased the cat",
    "a bird sat on the fence",
  ];

  // Build vocabulary
  const allWords = new Set<string>();
  const docWords = docs.map((d) => d.split(" "));
  for (const words of docWords) {
    for (const w of words) allWords.add(w);
  }
  const vocab = Array.from(allWords).sort();
  const N = docs.length;

  // Compute TF
  const tf: number[][] = docWords.map((words) => {
    const total = words.length;
    return vocab.map((v) => {
      const count = words.filter((w) => w === v).length;
      return count / total;
    });
  });

  // Compute DF
  const df: number[] = vocab.map((v) => {
    return docWords.filter((words) => words.includes(v)).length;
  });

  // Compute IDF
  const idf: number[] = df.map((d) => Math.log(N / d));

  // Compute TF-IDF
  const tfidf: number[][] = tf.map((docTf) =>
    docTf.map((t, j) => t * idf[j])
  );

  const docLabels = docs.map((_, i) => `Doc ${i + 1}`);

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `TF-IDF (Term Frequency - Inverse Document Frequency) measures how important a word is to a document in a corpus. It balances term frequency with rarity across documents. Corpus: ${N} documents, Vocabulary: ${vocab.length} terms.`,
    action: "tokenize",
    highlights: [],
    data: {
      cells: [],
      rows: N,
      cols: vocab.length,
      rowLabels: docLabels,
      colLabels: vocab,
      colorScale: "tfidf",
      title: "TF-IDF Matrix (empty)",
    } as HeatmapStepData,
  });

  // Step 1: Show TF matrix
  const tfCells: HeatmapCell[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < vocab.length; c++) {
      tfCells.push({ row: r, col: c, value: parseFloat(tf[r][c].toFixed(3)) });
    }
  }

  steps.push({
    id: stepId++,
    description: `Step 1: Term Frequency (TF). TF(t,d) = count(t in d) / total words in d. Higher values mean the word appears more often in that document. "the" has high TF in Doc 1 (2/6 = 0.333).`,
    action: "tokenize",
    highlights: [],
    data: {
      cells: tfCells,
      rows: N,
      cols: vocab.length,
      rowLabels: docLabels,
      colLabels: vocab,
      colorScale: "tfidf",
      title: "Term Frequency (TF)",
    } as HeatmapStepData,
  });

  // Step 2: Show IDF values
  steps.push({
    id: stepId++,
    description: `Step 2: Inverse Document Frequency. IDF(t) = log(N/DF(t)). Common words like "the" (DF=3) get IDF=log(3/3)=0. Rare words like "dog" (DF=1) get IDF=log(3/1)=${Math.log(3).toFixed(3)}. IDF penalizes common terms.`,
    action: "tokenize",
    highlights: [],
    data: {
      cells: vocab.map((_, c) => ({ row: 0, col: c, value: parseFloat(idf[c].toFixed(3)) })),
      rows: 1,
      cols: vocab.length,
      rowLabels: ["IDF"],
      colLabels: vocab,
      colorScale: "tfidf",
      title: "Inverse Document Frequency (IDF)",
    } as HeatmapStepData,
  });

  // Steps 3-5: Compute TF-IDF for each document
  for (let r = 0; r < N; r++) {
    const cellsSoFar: HeatmapCell[] = [];
    for (let dr = 0; dr <= r; dr++) {
      for (let c = 0; c < vocab.length; c++) {
        cellsSoFar.push({
          row: dr,
          col: c,
          value: parseFloat(tfidf[dr][c].toFixed(3)),
          highlight: dr === r ? "attention-high" : undefined,
        });
      }
    }

    const topTermIdx = tfidf[r].indexOf(Math.max(...tfidf[r]));
    const topTerm = vocab[topTermIdx];

    steps.push({
      id: stepId++,
      description: `TF-IDF for Doc ${r + 1}: TF-IDF(t,d) = TF(t,d) * IDF(t). The most important term is "${topTerm}" (${tfidf[r][topTermIdx].toFixed(3)}). Common words like "the" get a score of 0 because IDF=0.`,
      action: "tokenize",
      highlights: [],
      data: {
        cells: cellsSoFar,
        rows: N,
        cols: vocab.length,
        rowLabels: docLabels,
        colLabels: vocab,
        colorScale: "tfidf",
        currentCell: [r, topTermIdx],
        title: `TF-IDF (computing Doc ${r + 1})`,
      } as HeatmapStepData,
    });
  }

  // Final complete matrix
  const allCells: HeatmapCell[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < vocab.length; c++) {
      allCells.push({
        row: r,
        col: c,
        value: parseFloat(tfidf[r][c].toFixed(3)),
      });
    }
  }

  steps.push({
    id: stepId++,
    description: `TF-IDF complete! The matrix shows that discriminative words (appearing in few documents) have high scores while common words (appearing everywhere) have low/zero scores. This weighted representation dramatically improves over raw BoW for information retrieval and text classification.`,
    action: "complete",
    highlights: [],
    data: {
      cells: allCells,
      rows: N,
      cols: vocab.length,
      rowLabels: docLabels,
      colLabels: vocab,
      colorScale: "tfidf",
      title: "TF-IDF Matrix (complete)",
    } as HeatmapStepData,
  });

  return steps;
}
