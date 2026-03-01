import type {
  VisualizationStep,
  FunctionPlotStepData,
  FunctionPlotPoint,
} from "@/lib/visualization/types";

interface NaiveBayesParams {
  numFeatures: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/** Gaussian PDF */
function gaussianPDF(x: number, mean: number, std: number): number {
  const coeff = 1 / (std * Math.sqrt(2 * Math.PI));
  const exp = Math.exp(-((x - mean) ** 2) / (2 * std ** 2));
  return coeff * exp;
}

export function generateNaiveBayesSteps(
  params: NaiveBayesParams
): VisualizationStep[] {
  const { numFeatures, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Generate class statistics
  const featureNames = ["Height", "Weight", "Age", "Income"].slice(0, numFeatures);
  const classes = ["Cat A", "Cat B"];

  // Generate means and stds for each class/feature
  const classStats: Record<string, { mean: number; std: number }[]> = {};
  for (const cls of classes) {
    classStats[cls] = featureNames.map((_, i) => ({
      mean: (cls === "Cat A" ? 3 + i * 1.5 : 6 + i * 1.2) + (rand() - 0.5) * 0.5,
      std: 0.8 + rand() * 0.6,
    }));
  }

  const priorA = 0.4 + rand() * 0.2; // ~40-60%
  const priorB = 1 - priorA;

  // Generate query point
  const queryValues = featureNames.map((_, i) =>
    4 + i * 1.3 + (rand() - 0.5) * 1
  );

  // Generate curve points for visualization
  function genCurvePoints(mean: number, std: number): FunctionPlotPoint[] {
    const pts: FunctionPlotPoint[] = [];
    const lo = mean - 4 * std;
    const hi = mean + 4 * std;
    for (let i = 0; i <= 50; i++) {
      const x = lo + (hi - lo) * (i / 50);
      pts.push({ x, y: gaussianPDF(x, mean, std) });
    }
    return pts;
  }

  // Determine x range across all features/classes
  const allMeans = Object.values(classStats).flat().map((s) => s.mean);
  const allStds = Object.values(classStats).flat().map((s) => s.std);
  const globalMin = Math.min(...allMeans.map((m, i) => m - 4 * allStds[i]));
  const globalMax = Math.max(...allMeans.map((m, i) => m + 4 * allStds[i]));
  const xRange: [number, number] = [Math.floor(globalMin - 1), Math.ceil(globalMax + 1)];

  // Step 1: Introduction
  steps.push({
    id: stepId++,
    description: `Naive Bayes classifier with ${numFeatures} features and 2 classes. Assumes features are conditionally independent given the class (the "naive" assumption).`,
    action: "predict",
    highlights: [],
    data: {
      functions: [],
      xLabel: "Feature Value",
      yLabel: "P(x | class)",
      xRange,
      yRange: [0, 1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 2: Show priors
  steps.push({
    id: stepId++,
    description: `Prior probabilities: P(Cat A) = ${priorA.toFixed(2)}, P(Cat B) = ${priorB.toFixed(2)}. These represent the base rate of each class before seeing any features.`,
    action: "predict",
    highlights: [],
    data: {
      functions: [],
      xLabel: "Feature Value",
      yLabel: "P(x | class)",
      xRange,
      yRange: [0, 1] as [number, number],
      annotations: [
        { x: xRange[0] + 1, y: 0.8, label: `P(A)=${priorA.toFixed(2)}` },
        { x: xRange[0] + 1, y: 0.6, label: `P(B)=${priorB.toFixed(2)}` },
      ],
    } as FunctionPlotStepData,
  });

  // Steps: Show likelihood distributions for each feature
  for (let f = 0; f < numFeatures; f++) {
    const statsA = classStats["Cat A"][f];
    const statsB = classStats["Cat B"][f];
    const curveA = genCurvePoints(statsA.mean, statsA.std);
    const curveB = genCurvePoints(statsB.mean, statsB.std);

    const maxY = Math.max(
      ...curveA.map((p) => p.y),
      ...curveB.map((p) => p.y)
    );

    steps.push({
      id: stepId++,
      description: `Feature "${featureNames[f]}": Cat A ~ N(${statsA.mean.toFixed(1)}, ${statsA.std.toFixed(1)}), Cat B ~ N(${statsB.mean.toFixed(1)}, ${statsB.std.toFixed(1)}). These Gaussian distributions represent P(${featureNames[f]} | class).`,
      action: "predict",
      highlights: [],
      data: {
        functions: [
          { name: `Cat A: ${featureNames[f]}`, points: curveA, color: "#6366f1", active: true },
          { name: `Cat B: ${featureNames[f]}`, points: curveB, color: "#f59e0b", active: true },
        ],
        xLabel: featureNames[f],
        yLabel: "Likelihood",
        xRange,
        yRange: [0, maxY * 1.2] as [number, number],
      } as FunctionPlotStepData,
    });

    // Show query value on this feature
    const likelihoodA = gaussianPDF(queryValues[f], statsA.mean, statsA.std);
    const likelihoodB = gaussianPDF(queryValues[f], statsB.mean, statsB.std);

    steps.push({
      id: stepId++,
      description: `Query ${featureNames[f]}=${queryValues[f].toFixed(1)}: P(x|A)=${likelihoodA.toFixed(4)}, P(x|B)=${likelihoodB.toFixed(4)}.`,
      action: "classify",
      highlights: [],
      data: {
        functions: [
          { name: `Cat A: ${featureNames[f]}`, points: curveA, color: "#6366f1", active: true },
          { name: `Cat B: ${featureNames[f]}`, points: curveB, color: "#f59e0b", active: true },
        ],
        currentX: queryValues[f],
        xLabel: featureNames[f],
        yLabel: "Likelihood",
        xRange,
        yRange: [0, maxY * 1.2] as [number, number],
        annotations: [
          { x: queryValues[f], y: likelihoodA, label: `A: ${likelihoodA.toFixed(3)}` },
          { x: queryValues[f], y: likelihoodB, label: `B: ${likelihoodB.toFixed(3)}` },
        ],
      } as FunctionPlotStepData,
    });
  }

  // Compute posteriors
  let posteriorA = Math.log(priorA);
  let posteriorB = Math.log(priorB);

  for (let f = 0; f < numFeatures; f++) {
    const likA = gaussianPDF(queryValues[f], classStats["Cat A"][f].mean, classStats["Cat A"][f].std);
    const likB = gaussianPDF(queryValues[f], classStats["Cat B"][f].mean, classStats["Cat B"][f].std);
    posteriorA += Math.log(likA + 1e-10);
    posteriorB += Math.log(likB + 1e-10);
  }

  // Convert from log space for display
  const maxLog = Math.max(posteriorA, posteriorB);
  const pA = Math.exp(posteriorA - maxLog);
  const pB = Math.exp(posteriorB - maxLog);
  const normA = pA / (pA + pB);
  const normB = pB / (pA + pB);

  // Step: Compute posterior
  steps.push({
    id: stepId++,
    description: `Posterior computation: P(A|x) = P(A) * product(P(xi|A)) and P(B|x) = P(B) * product(P(xi|B)). Using the naive independence assumption, we multiply likelihoods across all features.`,
    action: "classify",
    highlights: [],
    data: {
      functions: [],
      xLabel: "Feature Value",
      yLabel: "Likelihood",
      xRange,
      yRange: [0, 1] as [number, number],
      annotations: [
        { x: xRange[0] + 2, y: 0.8, label: `P(A|x) proportional to ${normA.toFixed(3)}` },
        { x: xRange[0] + 2, y: 0.5, label: `P(B|x) proportional to ${normB.toFixed(3)}` },
      ],
    } as FunctionPlotStepData,
  });

  // Step: Final classification
  const predicted = normA > normB ? "Cat A" : "Cat B";
  const confidence = Math.max(normA, normB);

  steps.push({
    id: stepId++,
    description: `Classification: ${predicted} with ${(confidence * 100).toFixed(1)}% confidence. P(A|x)=${(normA * 100).toFixed(1)}%, P(B|x)=${(normB * 100).toFixed(1)}%.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [],
      xLabel: "Feature Value",
      yLabel: "Posterior",
      xRange,
      yRange: [0, 1] as [number, number],
      annotations: [
        { x: (xRange[0] + xRange[1]) / 2, y: 0.7, label: `Prediction: ${predicted} (${(confidence * 100).toFixed(1)}%)` },
      ],
    } as FunctionPlotStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `Naive Bayes complete! Despite the strong independence assumption, Naive Bayes often performs well in practice, especially for text classification (spam detection, sentiment analysis). It is extremely fast to train and predict.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [],
      xLabel: "Feature Value",
      yLabel: "Posterior",
      xRange,
      yRange: [0, 1] as [number, number],
      annotations: [
        { x: (xRange[0] + xRange[1]) / 2, y: 0.7, label: `${predicted}: ${(confidence * 100).toFixed(1)}% confidence` },
      ],
    } as FunctionPlotStepData,
  });

  return steps;
}
