import type {
  VisualizationStep,
  ScatterStepData,
  ScatterPoint,
} from "@/lib/visualization/types";

interface FeatureScalingParams {
  numPoints: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateFeatureScalingSteps(
  params: FeatureScalingParams
): VisualizationStep[] {
  const { numPoints, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Generate raw data with very different scales
  // Feature 1: age (20-80), Feature 2: salary (20000-120000)
  const rawPoints: ScatterPoint[] = [];
  for (let i = 0; i < numPoints; i++) {
    rawPoints.push({
      x: 20 + rand() * 60,  // Age: 20-80
      y: 20000 + rand() * 100000,  // Salary: 20k-120k
      label: rand() > 0.5 ? 0 : 1,
      id: `p${i}`,
    });
  }

  // Step 1: Show raw data
  const xVals = rawPoints.map((p) => p.x);
  const yVals = rawPoints.map((p) => p.y);

  steps.push({
    id: stepId++,
    description: `Raw dataset: ${numPoints} points. Feature 1 (Age: 20-80) and Feature 2 (Salary: 20k-120k) have very different scales. This can bias distance-based algorithms.`,
    action: "predict",
    highlights: [],
    data: {
      points: rawPoints.map((p) => ({ ...p })),
      xLabel: "Age (20-80)",
      yLabel: "Salary (20k-120k)",
      xRange: [0, 100] as [number, number],
      yRange: [0, 140000] as [number, number],
    } as ScatterStepData,
  });

  // Step 2: Explain the problem
  steps.push({
    id: stepId++,
    description: "Problem: Salary dominates distance calculations because its range (100k) is 1000x larger than Age's range (60). KNN and SVM would essentially ignore the Age feature.",
    action: "predict",
    highlights: [{ indices: Array.from({ length: numPoints }, (_, i) => i), color: "comparing", label: "Unscaled" }],
    data: {
      points: rawPoints.map((p) => ({ ...p, highlight: "comparing" as const })),
      xLabel: "Age (20-80)",
      yLabel: "Salary (20k-120k)",
      xRange: [0, 100] as [number, number],
      yRange: [0, 140000] as [number, number],
    } as ScatterStepData,
  });

  // Min-Max Normalization: (x - min) / (max - min) -> [0, 1]
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const yMin = Math.min(...yVals);
  const yMax = Math.max(...yVals);

  // Step 3: Explain min-max
  steps.push({
    id: stepId++,
    description: `Min-Max Normalization: Scale each feature to [0, 1] using (x - min) / (max - min). Age range: [${xMin.toFixed(0)}, ${xMax.toFixed(0)}], Salary range: [${yMin.toFixed(0)}, ${yMax.toFixed(0)}].`,
    action: "predict",
    highlights: [],
    data: {
      points: rawPoints.map((p) => ({ ...p })),
      xLabel: "Age (20-80)",
      yLabel: "Salary (20k-120k)",
      xRange: [0, 100] as [number, number],
      yRange: [0, 140000] as [number, number],
    } as ScatterStepData,
  });

  // Step 4-5: Apply min-max normalization progressively
  const halfPoint = Math.floor(numPoints / 2);
  const minMaxPartial: ScatterPoint[] = rawPoints.map((p, i) => {
    if (i < halfPoint) {
      return {
        ...p,
        x: (p.x - xMin) / (xMax - xMin),
        y: (p.y - yMin) / (yMax - yMin),
        highlight: "active" as const,
      };
    }
    return { ...p };
  });

  steps.push({
    id: stepId++,
    description: `Applying Min-Max to first half of points... Each feature value is transformed to (value - min) / (max - min).`,
    action: "predict",
    highlights: [{ indices: Array.from({ length: halfPoint }, (_, i) => i), color: "active", label: "Scaled" }],
    data: {
      points: minMaxPartial,
      xLabel: "Age (normalized)",
      yLabel: "Salary (normalized)",
      xRange: [-0.1, 1.1] as [number, number],
      yRange: [-0.1, 1.1] as [number, number],
    } as ScatterStepData,
  });

  // Full min-max
  const minMaxFull: ScatterPoint[] = rawPoints.map((p) => ({
    ...p,
    x: (p.x - xMin) / (xMax - xMin),
    y: (p.y - yMin) / (yMax - yMin),
    highlight: "completed" as const,
  }));

  steps.push({
    id: stepId++,
    description: `Min-Max Normalization complete! All features now in [0, 1]. Both Age and Salary contribute equally to distance calculations.`,
    action: "predict",
    highlights: [{ indices: Array.from({ length: numPoints }, (_, i) => i), color: "completed", label: "Min-Max scaled" }],
    data: {
      points: minMaxFull,
      xLabel: "Age (0-1)",
      yLabel: "Salary (0-1)",
      xRange: [-0.1, 1.1] as [number, number],
      yRange: [-0.1, 1.1] as [number, number],
    } as ScatterStepData,
  });

  // Z-Score Standardization: (x - mean) / std
  const xMean = xVals.reduce((s, v) => s + v, 0) / numPoints;
  const yMean = yVals.reduce((s, v) => s + v, 0) / numPoints;
  const xStd = Math.sqrt(xVals.reduce((s, v) => s + (v - xMean) ** 2, 0) / numPoints);
  const yStd = Math.sqrt(yVals.reduce((s, v) => s + (v - yMean) ** 2, 0) / numPoints);

  // Step 6: Explain standardization
  steps.push({
    id: stepId++,
    description: `Now applying Z-Score Standardization: (x - mean) / std. This centers the data at 0 with unit variance. Age: mean=${xMean.toFixed(1)}, std=${xStd.toFixed(1)}. Salary: mean=${yMean.toFixed(0)}, std=${yStd.toFixed(0)}.`,
    action: "predict",
    highlights: [],
    data: {
      points: rawPoints.map((p) => ({ ...p })),
      xLabel: "Age (raw)",
      yLabel: "Salary (raw)",
      xRange: [0, 100] as [number, number],
      yRange: [0, 140000] as [number, number],
    } as ScatterStepData,
  });

  // Step 7: Apply Z-score partially
  const zScorePartial: ScatterPoint[] = rawPoints.map((p, i) => {
    if (i < halfPoint) {
      return {
        ...p,
        x: (p.x - xMean) / xStd,
        y: (p.y - yMean) / yStd,
        highlight: "active" as const,
      };
    }
    return { ...p, x: (p.x - xMean) / xStd, y: (p.y - yMean) / yStd };
  });

  const zXVals = rawPoints.map((p) => (p.x - xMean) / xStd);
  const zYVals = rawPoints.map((p) => (p.y - yMean) / yStd);
  const zXRange: [number, number] = [Math.min(...zXVals) - 0.3, Math.max(...zXVals) + 0.3];
  const zYRange: [number, number] = [Math.min(...zYVals) - 0.3, Math.max(...zYVals) + 0.3];

  steps.push({
    id: stepId++,
    description: `Applying Z-Score standardization... Each value becomes (value - mean) / std, resulting in mean=0 and std=1 for each feature.`,
    action: "predict",
    highlights: [],
    data: {
      points: zScorePartial,
      xLabel: "Age (z-score)",
      yLabel: "Salary (z-score)",
      xRange: zXRange,
      yRange: zYRange,
    } as ScatterStepData,
  });

  // Step 8: Full Z-score
  const zScoreFull: ScatterPoint[] = rawPoints.map((p) => ({
    ...p,
    x: (p.x - xMean) / xStd,
    y: (p.y - yMean) / yStd,
    highlight: "completed" as const,
  }));

  steps.push({
    id: stepId++,
    description: `Z-Score Standardization complete! Data centered at (0, 0) with unit variance. Both features are now on comparable scales.`,
    action: "predict",
    highlights: [{ indices: Array.from({ length: numPoints }, (_, i) => i), color: "completed", label: "Z-score" }],
    data: {
      points: zScoreFull,
      xLabel: "Age (z-score)",
      yLabel: "Salary (z-score)",
      xRange: zXRange,
      yRange: zYRange,
    } as ScatterStepData,
  });

  // Step 9: Compare
  steps.push({
    id: stepId++,
    description: "Min-Max scales to [0,1] -- good when you know the bounds. Z-Score centers at 0 with std=1 -- better for algorithms assuming Gaussian distributions (e.g., SVM, Logistic Regression).",
    action: "predict",
    highlights: [],
    data: {
      points: zScoreFull,
      xLabel: "Age (z-score)",
      yLabel: "Salary (z-score)",
      xRange: zXRange,
      yRange: zYRange,
    } as ScatterStepData,
  });

  // Step 10: Summary
  steps.push({
    id: stepId++,
    description: "Feature scaling is essential for distance-based (KNN, SVM, K-Means) and gradient-based (Neural Nets, Logistic Regression) algorithms. Tree-based methods (Random Forest, XGBoost) are generally scale-invariant.",
    action: "complete",
    highlights: [],
    data: {
      points: zScoreFull,
      xLabel: "Age (z-score)",
      yLabel: "Salary (z-score)",
      xRange: zXRange,
      yRange: zYRange,
    } as ScatterStepData,
  });

  return steps;
}
