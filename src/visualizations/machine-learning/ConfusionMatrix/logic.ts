import type {
  VisualizationStep,
  HeatmapStepData,
  HeatmapCell,
} from "@/lib/visualization/types";

interface ConfusionMatrixParams {
  numSamples: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateConfusionMatrixSteps(
  params: ConfusionMatrixParams
): VisualizationStep[] {
  const { numSamples, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Generate predictions for a binary classifier
  const labels = ["Positive", "Negative"];
  let tp = 0, fp = 0, tn = 0, fn = 0;

  for (let i = 0; i < numSamples; i++) {
    const actual = rand() > 0.5 ? 1 : 0;
    // Model has ~80% accuracy
    const correct = rand() < 0.8;
    const predicted = correct ? actual : 1 - actual;

    if (actual === 1 && predicted === 1) tp++;
    else if (actual === 0 && predicted === 1) fp++;
    else if (actual === 0 && predicted === 0) tn++;
    else fn++;
  }

  // Step 1: Introduction
  steps.push({
    id: stepId++,
    description: `We have ${numSamples} samples classified by a binary classifier. A confusion matrix summarizes the predictions vs actual labels.`,
    action: "predict",
    highlights: [],
    data: {
      cells: [],
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      title: "Confusion Matrix",
    } as HeatmapStepData,
  });

  // Step 2: Show empty matrix
  const emptyCells: HeatmapCell[] = [
    { row: 0, col: 0, value: 0 },
    { row: 0, col: 1, value: 0 },
    { row: 1, col: 0, value: 0 },
    { row: 1, col: 1, value: 0 },
  ];

  steps.push({
    id: stepId++,
    description: "Empty confusion matrix created. Rows represent actual classes, columns represent predicted classes.",
    action: "predict",
    highlights: [],
    data: {
      cells: emptyCells,
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      title: "Confusion Matrix",
    } as HeatmapStepData,
  });

  // Step 3: Fill TP
  steps.push({
    id: stepId++,
    description: `True Positives (TP) = ${tp}. These are correctly identified positive samples. The model predicted positive and the actual label was positive.`,
    action: "classify",
    highlights: [{ indices: [0], color: "completed", label: "TP" }],
    data: {
      cells: [
        { row: 0, col: 0, value: tp },
        { row: 0, col: 1, value: 0 },
        { row: 1, col: 0, value: 0 },
        { row: 1, col: 1, value: 0 },
      ],
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      currentCell: [0, 0] as [number, number],
      title: "True Positives (TP)",
    } as HeatmapStepData,
  });

  // Step 4: Fill FN
  steps.push({
    id: stepId++,
    description: `False Negatives (FN) = ${fn}. The model incorrectly predicted negative for these actually positive samples (Type II error).`,
    action: "classify",
    highlights: [{ indices: [1], color: "swapping", label: "FN" }],
    data: {
      cells: [
        { row: 0, col: 0, value: tp },
        { row: 0, col: 1, value: fn },
        { row: 1, col: 0, value: 0 },
        { row: 1, col: 1, value: 0 },
      ],
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      currentCell: [0, 1] as [number, number],
      title: "False Negatives (FN)",
    } as HeatmapStepData,
  });

  // Step 5: Fill FP
  steps.push({
    id: stepId++,
    description: `False Positives (FP) = ${fp}. The model incorrectly predicted positive for these actually negative samples (Type I error).`,
    action: "classify",
    highlights: [{ indices: [2], color: "swapping", label: "FP" }],
    data: {
      cells: [
        { row: 0, col: 0, value: tp },
        { row: 0, col: 1, value: fn },
        { row: 1, col: 0, value: fp },
        { row: 1, col: 1, value: 0 },
      ],
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      currentCell: [1, 0] as [number, number],
      title: "False Positives (FP)",
    } as HeatmapStepData,
  });

  // Step 6: Fill TN
  steps.push({
    id: stepId++,
    description: `True Negatives (TN) = ${tn}. These are correctly identified negative samples. The model predicted negative and the actual label was negative.`,
    action: "classify",
    highlights: [{ indices: [3], color: "completed", label: "TN" }],
    data: {
      cells: [
        { row: 0, col: 0, value: tp },
        { row: 0, col: 1, value: fn },
        { row: 1, col: 0, value: fp },
        { row: 1, col: 1, value: tn },
      ],
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      currentCell: [1, 1] as [number, number],
      title: "True Negatives (TN)",
    } as HeatmapStepData,
  });

  // Step 7: Full matrix
  const fullCells: HeatmapCell[] = [
    { row: 0, col: 0, value: tp },
    { row: 0, col: 1, value: fn },
    { row: 1, col: 0, value: fp },
    { row: 1, col: 1, value: tn },
  ];

  steps.push({
    id: stepId++,
    description: `Complete confusion matrix. Diagonal entries (TP=${tp}, TN=${tn}) are correct predictions.`,
    action: "predict",
    highlights: [],
    data: {
      cells: fullCells,
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      title: "Complete Confusion Matrix",
    } as HeatmapStepData,
  });

  // Step 8: Accuracy
  const accuracy = (tp + tn) / numSamples;
  steps.push({
    id: stepId++,
    description: `Accuracy = (TP + TN) / Total = (${tp} + ${tn}) / ${numSamples} = ${(accuracy * 100).toFixed(1)}%. Accuracy measures overall correctness.`,
    action: "predict",
    highlights: [{ indices: [0, 3], color: "completed", label: "Correct" }],
    data: {
      cells: fullCells,
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      title: `Accuracy = ${(accuracy * 100).toFixed(1)}%`,
    } as HeatmapStepData,
  });

  // Step 9: Precision
  const precision = tp / (tp + fp) || 0;
  steps.push({
    id: stepId++,
    description: `Precision = TP / (TP + FP) = ${tp} / (${tp} + ${fp}) = ${(precision * 100).toFixed(1)}%. Precision measures how many predicted positives are actually positive.`,
    action: "predict",
    highlights: [{ indices: [0, 2], color: "comparing", label: "Pred Positive" }],
    data: {
      cells: fullCells,
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      title: `Precision = ${(precision * 100).toFixed(1)}%`,
    } as HeatmapStepData,
  });

  // Step 10: Recall
  const recall = tp / (tp + fn) || 0;
  steps.push({
    id: stepId++,
    description: `Recall = TP / (TP + FN) = ${tp} / (${tp} + ${fn}) = ${(recall * 100).toFixed(1)}%. Recall measures how many actual positives were correctly identified.`,
    action: "predict",
    highlights: [{ indices: [0, 1], color: "comparing", label: "Actual Positive" }],
    data: {
      cells: fullCells,
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      title: `Recall = ${(recall * 100).toFixed(1)}%`,
    } as HeatmapStepData,
  });

  // Step 11: F1 Score
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  steps.push({
    id: stepId++,
    description: `F1 Score = 2 * (Precision * Recall) / (Precision + Recall) = ${(f1 * 100).toFixed(1)}%. F1 is the harmonic mean of precision and recall.`,
    action: "complete",
    highlights: [],
    data: {
      cells: fullCells,
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      title: `F1 Score = ${(f1 * 100).toFixed(1)}%`,
    } as HeatmapStepData,
  });

  // Step 12: Summary
  steps.push({
    id: stepId++,
    description: `Summary: Acc=${(accuracy * 100).toFixed(1)}%, Prec=${(precision * 100).toFixed(1)}%, Rec=${(recall * 100).toFixed(1)}%, F1=${(f1 * 100).toFixed(1)}%. The confusion matrix reveals the types of errors the model makes.`,
    action: "complete",
    highlights: [],
    data: {
      cells: fullCells,
      rows: 2,
      cols: 2,
      rowLabels: ["Actual Pos", "Actual Neg"],
      colLabels: ["Pred Pos", "Pred Neg"],
      colorScale: "confusion",
      title: "Evaluation Complete",
    } as HeatmapStepData,
  });

  return steps;
}
