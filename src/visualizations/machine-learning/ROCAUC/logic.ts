import type {
  VisualizationStep,
  FunctionPlotStepData,
  FunctionPlotPoint,
} from "@/lib/visualization/types";

interface ROCAUCParams {
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

export function generateROCAUCSteps(params: ROCAUCParams): VisualizationStep[] {
  const { numSamples, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Generate simulated scores and labels
  const data: { score: number; label: number }[] = [];
  for (let i = 0; i < numSamples; i++) {
    const label = rand() > 0.5 ? 1 : 0;
    // Positive class has higher scores on average
    const score = label === 1
      ? 0.4 + rand() * 0.55
      : 0.05 + rand() * 0.55;
    data.push({ score, label });
  }

  // Sort by score descending for ROC computation
  data.sort((a, b) => b.score - a.score);

  const totalPositive = data.filter((d) => d.label === 1).length;
  const totalNegative = data.filter((d) => d.label === 0).length;

  // Compute ROC curve points
  const rocPoints: FunctionPlotPoint[] = [{ x: 0, y: 0 }];
  let tpCount = 0;
  let fpCount = 0;

  for (const sample of data) {
    if (sample.label === 1) tpCount++;
    else fpCount++;
    rocPoints.push({
      x: fpCount / totalNegative,
      y: tpCount / totalPositive,
    });
  }

  // Diagonal line (random classifier)
  const diagonalPoints: FunctionPlotPoint[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    diagonalPoints.push({ x: t, y: t });
  }

  // Compute AUC using trapezoidal rule
  let auc = 0;
  for (let i = 1; i < rocPoints.length; i++) {
    const dx = rocPoints[i].x - rocPoints[i - 1].x;
    const avgY = (rocPoints[i].y + rocPoints[i - 1].y) / 2;
    auc += dx * avgY;
  }

  // Step 1: Introduction
  steps.push({
    id: stepId++,
    description: `We have ${numSamples} samples with predicted scores. The ROC curve plots True Positive Rate vs False Positive Rate at different thresholds.`,
    action: "predict",
    highlights: [],
    data: {
      functions: [
        { name: "Random (diagonal)", points: diagonalPoints, color: "#475569", active: true },
      ],
      xLabel: "False Positive Rate (FPR)",
      yLabel: "True Positive Rate (TPR)",
      xRange: [0, 1] as [number, number],
      yRange: [0, 1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 2: Explain diagonal
  steps.push({
    id: stepId++,
    description: "The diagonal line represents a random classifier (AUC = 0.5). A good model's ROC curve should be above this line, toward the top-left corner.",
    action: "predict",
    highlights: [],
    data: {
      functions: [
        { name: "Random (diagonal)", points: diagonalPoints, color: "#475569", active: true },
      ],
      xLabel: "False Positive Rate (FPR)",
      yLabel: "True Positive Rate (TPR)",
      xRange: [0, 1] as [number, number],
      yRange: [0, 1] as [number, number],
      annotations: [{ x: 0.5, y: 0.5, label: "AUC = 0.5 (random)" }],
    } as FunctionPlotStepData,
  });

  // Steps 3-N: Build ROC curve progressively
  const numProgressiveSteps = Math.min(15, rocPoints.length);
  const stepSize = Math.max(1, Math.floor(rocPoints.length / numProgressiveSteps));

  for (let i = 1; i <= numProgressiveSteps; i++) {
    const endIdx = Math.min(i * stepSize, rocPoints.length);
    const partialRoc = rocPoints.slice(0, endIdx);
    const lastPoint = partialRoc[partialRoc.length - 1];

    // Compute partial AUC
    let partialAuc = 0;
    for (let j = 1; j < partialRoc.length; j++) {
      const dx = partialRoc[j].x - partialRoc[j - 1].x;
      const avgY = (partialRoc[j].y + partialRoc[j - 1].y) / 2;
      partialAuc += dx * avgY;
    }

    steps.push({
      id: stepId++,
      description: `Threshold ${i}/${numProgressiveSteps}: FPR = ${lastPoint.x.toFixed(2)}, TPR = ${lastPoint.y.toFixed(2)}. Each point represents a different classification threshold.`,
      action: "predict",
      highlights: [],
      data: {
        functions: [
          { name: "Random (diagonal)", points: diagonalPoints, color: "#475569", active: true },
          { name: "Model ROC", points: partialRoc, color: "#6366f1", active: true },
        ],
        currentX: lastPoint.x,
        xLabel: "False Positive Rate (FPR)",
        yLabel: "True Positive Rate (TPR)",
        xRange: [0, 1] as [number, number],
        yRange: [0, 1] as [number, number],
      } as FunctionPlotStepData,
    });
  }

  // Step N+1: Complete ROC
  steps.push({
    id: stepId++,
    description: `ROC curve complete. The curve shows the model's ability to discriminate between classes across all thresholds.`,
    action: "predict",
    highlights: [],
    data: {
      functions: [
        { name: "Random (diagonal)", points: diagonalPoints, color: "#475569", active: true },
        { name: "Model ROC", points: rocPoints, color: "#6366f1", active: true },
      ],
      xLabel: "False Positive Rate (FPR)",
      yLabel: "True Positive Rate (TPR)",
      xRange: [0, 1] as [number, number],
      yRange: [0, 1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step N+2: Show AUC value
  steps.push({
    id: stepId++,
    description: `AUC (Area Under the Curve) = ${auc.toFixed(3)}. AUC ranges from 0 to 1; higher is better. AUC = 1 means perfect separation, AUC = 0.5 means random.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [
        { name: "Random (diagonal)", points: diagonalPoints, color: "#475569", active: true },
        { name: `Model ROC (AUC=${auc.toFixed(3)})`, points: rocPoints, color: "#6366f1", active: true },
      ],
      xLabel: "False Positive Rate (FPR)",
      yLabel: "True Positive Rate (TPR)",
      xRange: [0, 1] as [number, number],
      yRange: [0, 1] as [number, number],
      annotations: [{ x: 0.5, y: 0.8, label: `AUC = ${auc.toFixed(3)}` }],
    } as FunctionPlotStepData,
  });

  // Step N+3: Summary
  const quality = auc >= 0.9 ? "Excellent" : auc >= 0.8 ? "Good" : auc >= 0.7 ? "Fair" : "Poor";
  steps.push({
    id: stepId++,
    description: `ROC-AUC analysis complete. AUC = ${auc.toFixed(3)} (${quality}). The ROC curve is threshold-independent, making it ideal for comparing classifiers regardless of the chosen threshold.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [
        { name: "Random (diagonal)", points: diagonalPoints, color: "#475569", active: true },
        { name: `Model ROC (AUC=${auc.toFixed(3)})`, points: rocPoints, color: "#6366f1", active: true },
      ],
      xLabel: "False Positive Rate (FPR)",
      yLabel: "True Positive Rate (TPR)",
      xRange: [0, 1] as [number, number],
      yRange: [0, 1] as [number, number],
      annotations: [
        { x: 0.5, y: 0.8, label: `AUC = ${auc.toFixed(3)} (${quality})` },
        { x: 0, y: 1, label: "Perfect (0,1)" },
      ],
    } as FunctionPlotStepData,
  });

  return steps;
}
