import type { VisualizationStep } from "@/lib/visualization/types";

interface CrossValidationParams {
  k: number;
  dataSize: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export interface CrossValidationStepData {
  folds: { id: number; role: "train" | "test" | "idle" }[];
  foldSize: number;
  dataSize: number;
  currentRound: number;
  totalRounds: number;
  accuracies: { fold: number; accuracy: number }[];
  averageAccuracy: number | null;
}

export function generateCrossValidationSteps(
  params: CrossValidationParams
): VisualizationStep[] {
  const { k, dataSize, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const foldSize = Math.floor(dataSize / k);

  // Step 1: Show the dataset
  steps.push({
    id: stepId++,
    description: `Dataset loaded with ${dataSize} samples. We will perform ${k}-fold cross-validation, splitting the data into ${k} equal folds of ~${foldSize} samples each.`,
    action: "train",
    highlights: [],
    data: {
      folds: Array.from({ length: k }, (_, i) => ({ id: i, role: "idle" as const })),
      foldSize,
      dataSize,
      currentRound: -1,
      totalRounds: k,
      accuracies: [],
      averageAccuracy: null,
    } as CrossValidationStepData,
  });

  // Step 2: Show folds created
  steps.push({
    id: stepId++,
    description: `Data shuffled and divided into ${k} folds. Each fold contains approximately ${foldSize} samples. In each round, one fold will serve as the test set.`,
    action: "split-node",
    highlights: [],
    data: {
      folds: Array.from({ length: k }, (_, i) => ({ id: i, role: "idle" as const })),
      foldSize,
      dataSize,
      currentRound: -1,
      totalRounds: k,
      accuracies: [],
      averageAccuracy: null,
    } as CrossValidationStepData,
  });

  // Steps for each fold round
  const accuracies: { fold: number; accuracy: number }[] = [];

  for (let round = 0; round < k; round++) {
    // Show which fold is test
    const folds = Array.from({ length: k }, (_, i) => ({
      id: i,
      role: (i === round ? "test" : "train") as "train" | "test" | "idle",
    }));

    steps.push({
      id: stepId++,
      description: `Round ${round + 1}/${k}: Fold ${round + 1} is the test set (red). All other folds are used for training (green).`,
      action: "train",
      highlights: [{ indices: [round], color: "swapping", label: "Test fold" }],
      data: {
        folds,
        foldSize,
        dataSize,
        currentRound: round,
        totalRounds: k,
        accuracies: [...accuracies],
        averageAccuracy: null,
      } as CrossValidationStepData,
    });

    // Training step
    steps.push({
      id: stepId++,
      description: `Round ${round + 1}/${k}: Training model on ${foldSize * (k - 1)} samples from the green folds...`,
      action: "train",
      highlights: [{ indices: [round], color: "swapping", label: "Test fold" }],
      data: {
        folds,
        foldSize,
        dataSize,
        currentRound: round,
        totalRounds: k,
        accuracies: [...accuracies],
        averageAccuracy: null,
      } as CrossValidationStepData,
    });

    // Evaluation step
    const accuracy = 0.75 + rand() * 0.2; // Random accuracy between 75-95%
    accuracies.push({ fold: round, accuracy });

    steps.push({
      id: stepId++,
      description: `Round ${round + 1}/${k}: Model evaluated on fold ${round + 1}. Accuracy = ${(accuracy * 100).toFixed(1)}%.`,
      action: "predict",
      highlights: [{ indices: [round], color: "completed", label: `Acc: ${(accuracy * 100).toFixed(1)}%` }],
      data: {
        folds,
        foldSize,
        dataSize,
        currentRound: round,
        totalRounds: k,
        accuracies: [...accuracies],
        averageAccuracy: null,
      } as CrossValidationStepData,
    });
  }

  // Final step: compute average
  const avgAccuracy = accuracies.reduce((s, a) => s + a.accuracy, 0) / accuracies.length;

  steps.push({
    id: stepId++,
    description: `${k}-fold cross-validation complete! Average accuracy = ${(avgAccuracy * 100).toFixed(1)}%. This gives a more reliable estimate than a single train/test split.`,
    action: "complete",
    highlights: [],
    data: {
      folds: Array.from({ length: k }, (_, i) => ({ id: i, role: "idle" as const })),
      foldSize,
      dataSize,
      currentRound: k,
      totalRounds: k,
      accuracies,
      averageAccuracy: avgAccuracy,
    } as CrossValidationStepData,
  });

  return steps;
}
