import type { VisualizationStep, ScatterStepData, ScatterPoint } from "@/lib/visualization/types";

interface WordPoint {
  word: string;
  x: number;
  y: number;
  cluster: number;
}

export function generateWordEmbeddingsSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Simulated 2D projection of word embeddings (like t-SNE/PCA output)
  const wordData: WordPoint[] = [
    // Animals cluster
    { word: "cat", x: 2.1, y: 3.5, cluster: 0 },
    { word: "dog", x: 2.5, y: 3.2, cluster: 0 },
    { word: "fish", x: 1.8, y: 3.8, cluster: 0 },
    { word: "bird", x: 2.3, y: 4.0, cluster: 0 },
    { word: "horse", x: 2.8, y: 3.0, cluster: 0 },
    // Royalty cluster
    { word: "king", x: 6.0, y: 7.0, cluster: 1 },
    { word: "queen", x: 6.5, y: 7.3, cluster: 1 },
    { word: "prince", x: 5.8, y: 7.5, cluster: 1 },
    { word: "princess", x: 6.3, y: 7.8, cluster: 1 },
    // Food cluster
    { word: "apple", x: 8.0, y: 2.0, cluster: 2 },
    { word: "banana", x: 8.3, y: 2.3, cluster: 2 },
    { word: "orange", x: 7.8, y: 1.8, cluster: 2 },
    { word: "grape", x: 8.5, y: 2.5, cluster: 2 },
    // Verbs cluster
    { word: "run", x: 4.5, y: 5.5, cluster: 3 },
    { word: "walk", x: 4.8, y: 5.2, cluster: 3 },
    { word: "jump", x: 4.2, y: 5.8, cluster: 3 },
    { word: "swim", x: 4.0, y: 5.0, cluster: 3 },
  ];

  const clusterNames = ["Animals", "Royalty", "Food", "Movement"];

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `Word embeddings map words to dense vectors in continuous space. Similar words cluster together. This 2D projection (via t-SNE/PCA) shows ${wordData.length} words from ${clusterNames.length} semantic groups: ${clusterNames.join(", ")}.`,
    action: "embed",
    highlights: [],
    data: {
      points: [],
      xLabel: "Dimension 1",
      yLabel: "Dimension 2",
      xRange: [0, 10],
      yRange: [0, 10],
    } as ScatterStepData,
  });

  // Add clusters one by one
  for (let c = 0; c < clusterNames.length; c++) {
    const clusterWords = wordData.filter((w) => w.cluster <= c);
    const points: ScatterPoint[] = clusterWords.map((w) => ({
      x: w.x,
      y: w.y,
      label: w.cluster,
      id: w.word,
      highlight: w.cluster === c ? "active" as const : undefined,
    }));

    const currentClusterWords = wordData.filter((w) => w.cluster === c);
    steps.push({
      id: stepId++,
      description: `Adding "${clusterNames[c]}" cluster: [${currentClusterWords.map(w => w.word).join(", ")}]. Words with similar meanings are positioned close together in embedding space because they appear in similar contexts during training.`,
      action: "embed",
      highlights: [],
      data: {
        points,
        xLabel: "Dimension 1",
        yLabel: "Dimension 2",
        xRange: [0, 10],
        yRange: [0, 10],
      } as ScatterStepData,
    });
  }

  // Show analogy
  const allPoints: ScatterPoint[] = wordData.map((w) => ({
    x: w.x,
    y: w.y,
    label: w.cluster,
    id: w.word,
  }));

  steps.push({
    id: stepId++,
    description: `Word analogies emerge from vector arithmetic: vector("king") - vector("man") + vector("woman") ~ vector("queen"). The offset between gendered pairs is consistent, showing that embeddings capture semantic relationships as geometric relationships.`,
    action: "embed",
    highlights: [],
    data: {
      points: allPoints,
      boundaries: [{
        type: "line" as const,
        points: [
          { x: wordData.find(w => w.word === "king")!.x, y: wordData.find(w => w.word === "king")!.y },
          { x: wordData.find(w => w.word === "queen")!.x, y: wordData.find(w => w.word === "queen")!.y },
        ],
        color: "#f59e0b",
        label: "analogy",
      }],
      xLabel: "Dimension 1",
      yLabel: "Dimension 2",
      xRange: [0, 10],
      yRange: [0, 10],
    } as ScatterStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `Word embeddings complete! Key properties: (1) Semantic similarity = vector closeness, (2) Analogies via vector arithmetic, (3) Typically 100-300 dimensions reduced to 2D for visualization. Trained via Word2Vec, GloVe, or FastText. Foundation for modern NLP.`,
    action: "complete",
    highlights: [],
    data: {
      points: allPoints,
      xLabel: "Dimension 1",
      yLabel: "Dimension 2",
      xRange: [0, 10],
      yRange: [0, 10],
    } as ScatterStepData,
  });

  return steps;
}
