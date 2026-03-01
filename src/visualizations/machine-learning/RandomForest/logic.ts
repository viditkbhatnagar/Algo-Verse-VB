import type { VisualizationStep } from "@/lib/visualization/types";

interface RandomForestParams {
  numTrees: number;
  maxDepth: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

interface MiniTreeNode {
  id: string;
  label: string;
  isLeaf: boolean;
  children: MiniTreeNode[];
  prediction?: string;
}

export interface RandomForestStepData {
  trees: {
    id: number;
    nodes: MiniTreeNode;
    state: "pending" | "building" | "built" | "voting";
    prediction?: string;
    bootstrapSize?: number;
  }[];
  currentTreeIndex: number;
  phase: "intro" | "bootstrap" | "build" | "predict" | "vote" | "complete";
  queryPoint?: { features: string };
  predictions: { treeId: number; prediction: string }[];
  finalPrediction?: string;
  votes?: Record<string, number>;
}

function buildRandomTree(
  rand: () => number,
  maxDepth: number,
  prefix: string,
  depth: number = 0
): MiniTreeNode {
  const features = ["Age", "Income", "Score", "Hours"];
  const feature = features[Math.floor(rand() * features.length)];
  const threshold = Math.floor(20 + rand() * 60);

  if (depth >= maxDepth || rand() < 0.3) {
    const cls = rand() > 0.5 ? "Yes" : "No";
    return {
      id: `${prefix}-leaf-${depth}`,
      label: cls,
      isLeaf: true,
      children: [],
      prediction: cls,
    };
  }

  return {
    id: `${prefix}-${depth}`,
    label: `${feature}<=${threshold}`,
    isLeaf: false,
    children: [
      buildRandomTree(rand, maxDepth, `${prefix}L`, depth + 1),
      buildRandomTree(rand, maxDepth, `${prefix}R`, depth + 1),
    ],
  };
}

export function generateRandomForestSteps(
  params: RandomForestParams
): VisualizationStep[] {
  const { numTrees, maxDepth, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Build all trees
  const trees = Array.from({ length: numTrees }, (_, i) => ({
    id: i,
    nodes: buildRandomTree(rand, maxDepth, `t${i}`),
    state: "pending" as const,
    bootstrapSize: 15 + Math.floor(rand() * 10),
  }));

  // Assign random predictions for the query
  const treePredictions = trees.map((t) => {
    const leaves: MiniTreeNode[] = [];
    function collect(n: MiniTreeNode) {
      if (n.isLeaf) leaves.push(n);
      n.children.forEach(collect);
    }
    collect(t.nodes);
    return leaves[Math.floor(rand() * leaves.length)]?.prediction ?? "Yes";
  });

  // Step 1: Introduction
  steps.push({
    id: stepId++,
    description: `Random Forest: An ensemble of ${numTrees} decision trees, each trained on a random bootstrap sample with random feature subsets. Predictions are made by majority vote.`,
    action: "train",
    highlights: [],
    data: {
      trees: trees.map((t) => ({ ...t, state: "pending" as const })),
      currentTreeIndex: -1,
      phase: "intro",
      predictions: [],
    } as RandomForestStepData,
  });

  // Step 2: Explain bagging
  steps.push({
    id: stepId++,
    description: "Bootstrap Aggregating (Bagging): Each tree gets a random sample (with replacement) from the training data. This reduces variance and prevents overfitting.",
    action: "train",
    highlights: [],
    data: {
      trees: trees.map((t) => ({ ...t, state: "pending" as const })),
      currentTreeIndex: -1,
      phase: "bootstrap",
      predictions: [],
    } as RandomForestStepData,
  });

  // Steps: Build each tree
  for (let i = 0; i < numTrees; i++) {
    // Bootstrap step
    steps.push({
      id: stepId++,
      description: `Tree ${i + 1}: Drawing bootstrap sample of ${trees[i].bootstrapSize} points (with replacement) and selecting random feature subset.`,
      action: "train",
      highlights: [{ indices: [i], color: "active", label: `Tree ${i + 1}` }],
      data: {
        trees: trees.map((t, j) => ({
          ...t,
          state: j < i ? "built" as const : j === i ? "building" as const : "pending" as const,
        })),
        currentTreeIndex: i,
        phase: "bootstrap",
        predictions: [],
      } as RandomForestStepData,
    });

    // Build step
    steps.push({
      id: stepId++,
      description: `Tree ${i + 1}: Built with max depth ${maxDepth}. Each split considers a random subset of features (sqrt(d) for classification).`,
      action: "train",
      highlights: [{ indices: [i], color: "completed", label: `Tree ${i + 1} built` }],
      data: {
        trees: trees.map((t, j) => ({
          ...t,
          state: j <= i ? "built" as const : "pending" as const,
        })),
        currentTreeIndex: i,
        phase: "build",
        predictions: [],
      } as RandomForestStepData,
    });
  }

  // Step: All trees built
  steps.push({
    id: stepId++,
    description: `All ${numTrees} trees built! Each tree is intentionally different due to bootstrap sampling and random feature selection. Now let's classify a query point.`,
    action: "predict",
    highlights: [],
    data: {
      trees: trees.map((t) => ({ ...t, state: "built" as const })),
      currentTreeIndex: -1,
      phase: "predict",
      queryPoint: { features: "Age=45, Income=60k" },
      predictions: [],
    } as RandomForestStepData,
  });

  // Steps: Each tree predicts
  const predictions: { treeId: number; prediction: string }[] = [];

  for (let i = 0; i < numTrees; i++) {
    predictions.push({ treeId: i, prediction: treePredictions[i] });

    steps.push({
      id: stepId++,
      description: `Tree ${i + 1} predicts: "${treePredictions[i]}". The query traverses the tree from root to leaf.`,
      action: "predict",
      highlights: [{ indices: [i], color: "active", label: treePredictions[i] }],
      data: {
        trees: trees.map((t, j) => ({
          ...t,
          state: j === i ? "voting" as const : "built" as const,
          prediction: j <= i ? treePredictions[j] : undefined,
        })),
        currentTreeIndex: i,
        phase: "vote",
        queryPoint: { features: "Age=45, Income=60k" },
        predictions: [...predictions],
      } as RandomForestStepData,
    });
  }

  // Step: Majority vote
  const votes: Record<string, number> = {};
  for (const p of treePredictions) votes[p] = (votes[p] || 0) + 1;
  const finalPrediction = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];

  steps.push({
    id: stepId++,
    description: `Majority Vote: ${Object.entries(votes).map(([k, v]) => `"${k}": ${v} vote(s)`).join(", ")}. Final prediction: "${finalPrediction}".`,
    action: "complete",
    highlights: [],
    data: {
      trees: trees.map((t, j) => ({
        ...t,
        state: "built" as const,
        prediction: treePredictions[j],
      })),
      currentTreeIndex: -1,
      phase: "complete",
      queryPoint: { features: "Age=45, Income=60k" },
      predictions,
      finalPrediction,
      votes,
    } as RandomForestStepData,
  });

  // Summary step
  steps.push({
    id: stepId++,
    description: `Random Forest complete! ${numTrees} trees voted, prediction = "${finalPrediction}". Ensemble diversity from bagging and random features reduces variance compared to a single decision tree.`,
    action: "complete",
    highlights: [],
    data: {
      trees: trees.map((t, j) => ({
        ...t,
        state: "built" as const,
        prediction: treePredictions[j],
      })),
      currentTreeIndex: -1,
      phase: "complete",
      queryPoint: { features: "Age=45, Income=60k" },
      predictions,
      finalPrediction,
      votes,
    } as RandomForestStepData,
  });

  return steps;
}
