import type {
  VisualizationStep,
  FunctionPlotStepData,
  FunctionPlotPoint,
} from "@/lib/visualization/types";

interface RegularizationParams {
  lambda: number;
  regType: "L1" | "L2";
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateRegularizationSteps(
  params: RegularizationParams
): VisualizationStep[] {
  const { lambda, regType, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Simulate 8 feature weights (unregularized)
  const numWeights = 8;
  const unregWeights = Array.from({ length: numWeights }, () =>
    (rand() - 0.5) * 6
  );

  // Apply L1 regularization (soft thresholding)
  const l1Weights = unregWeights.map((w) => {
    if (w > lambda) return w - lambda;
    if (w < -lambda) return w + lambda;
    return 0;
  });

  // Apply L2 regularization (weight shrinkage)
  const l2Weights = unregWeights.map((w) => w / (1 + lambda));

  const regWeights = regType === "L1" ? l1Weights : l2Weights;

  // Create weight magnitude chart points
  const weightXRange: [number, number] = [0, numWeights + 1];
  const maxW = Math.max(...unregWeights.map(Math.abs), ...regWeights.map(Math.abs));
  const weightYRange: [number, number] = [-maxW * 1.2, maxW * 1.2];

  function weightsToPoints(weights: number[]): FunctionPlotPoint[] {
    return weights.map((w, i) => ({ x: i + 1, y: w }));
  }

  // Generate penalty function curves for background
  const penaltyRange = 40;
  const l1PenaltyPoints: FunctionPlotPoint[] = [];
  const l2PenaltyPoints: FunctionPlotPoint[] = [];
  for (let i = 0; i <= penaltyRange; i++) {
    const w = -4 + (8 * i) / penaltyRange;
    l1PenaltyPoints.push({ x: w, y: Math.abs(w) * lambda });
    l2PenaltyPoints.push({ x: w, y: 0.5 * lambda * w * w });
  }

  // Step 1: Introduction
  steps.push({
    id: stepId++,
    description: `Regularization adds a penalty term to the loss function to prevent overfitting. We'll compare ${regType} regularization with lambda=${lambda.toFixed(2)} on ${numWeights} model weights.`,
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "Unregularized Weights", points: weightsToPoints(unregWeights), color: "#ef4444", active: true },
      ],
      xLabel: "Weight Index",
      yLabel: "Weight Value",
      xRange: weightXRange,
      yRange: weightYRange,
    } as FunctionPlotStepData,
  });

  // Step 2: Show unregularized weights
  steps.push({
    id: stepId++,
    description: `Unregularized model weights: Some are very large (|w| > 2). Large weights mean the model is sensitive to small input changes, leading to overfitting.`,
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "Unregularized", points: weightsToPoints(unregWeights), color: "#ef4444", active: true },
      ],
      xLabel: "Weight Index",
      yLabel: "Weight Value",
      xRange: weightXRange,
      yRange: weightYRange,
      annotations: unregWeights
        .map((w, i) => Math.abs(w) > 2 ? { x: i + 1, y: w, label: `w${i + 1}=${w.toFixed(1)}` } : null)
        .filter((a): a is { x: number; y: number; label: string } => a !== null)
        .slice(0, 3),
    } as FunctionPlotStepData,
  });

  // Step 3: Explain penalty function
  const penYMax = Math.max(
    ...l1PenaltyPoints.map((p) => p.y),
    ...l2PenaltyPoints.map((p) => p.y)
  );

  steps.push({
    id: stepId++,
    description: regType === "L1"
      ? `L1 Penalty (Lasso): Adds lambda * |w| to the loss. This creates a diamond-shaped constraint region, pushing weights exactly to zero (feature selection).`
      : `L2 Penalty (Ridge): Adds 0.5 * lambda * w^2 to the loss. This creates a circular constraint region, shrinking weights toward zero but rarely making them exactly zero.`,
    action: "train",
    highlights: [],
    data: {
      functions: regType === "L1"
        ? [{ name: "L1 Penalty: lambda*|w|", points: l1PenaltyPoints, color: "#22d3ee", active: true }]
        : [{ name: "L2 Penalty: 0.5*lambda*w^2", points: l2PenaltyPoints, color: "#a855f7", active: true }],
      xLabel: "Weight Value (w)",
      yLabel: "Penalty",
      xRange: [-4, 4] as [number, number],
      yRange: [0, penYMax * 1.1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 4: Show both L1 and L2 penalties
  steps.push({
    id: stepId++,
    description: "Comparing L1 and L2 penalties: L1 has a sharp corner at w=0 (encouraging sparsity), while L2 is smooth everywhere (weights shrink proportionally but never reach exactly zero).",
    action: "train",
    highlights: [],
    data: {
      functions: [
        { name: "L1: lambda*|w|", points: l1PenaltyPoints, color: "#22d3ee", active: regType === "L1" },
        { name: "L2: 0.5*lambda*w^2", points: l2PenaltyPoints, color: "#a855f7", active: regType === "L2" },
      ],
      xLabel: "Weight Value (w)",
      yLabel: "Penalty",
      xRange: [-4, 4] as [number, number],
      yRange: [0, penYMax * 1.1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Steps 5-7: Apply regularization progressively
  const fractions = [0.33, 0.66, 1.0];
  for (let fi = 0; fi < fractions.length; fi++) {
    const frac = fractions[fi];
    const partialWeights = unregWeights.map((w, i) => {
      const target = regWeights[i];
      return w + (target - w) * frac;
    });

    const zeroCount = partialWeights.filter((w) => Math.abs(w) < 0.01).length;

    steps.push({
      id: stepId++,
      description: frac < 1
        ? `Applying ${regType} regularization (${Math.round(frac * 100)}%)... Weights are being ${regType === "L1" ? "pushed toward zero (sparsity)" : "shrunk proportionally"}.`
        : `${regType} regularization with lambda=${lambda.toFixed(2)} applied. ${regType === "L1" ? `${zeroCount} weights became exactly zero.` : `All weights shrunk by factor 1/(1+lambda)=${(1 / (1 + lambda)).toFixed(3)}.`}`,
      action: frac === 1 ? "predict" : "train",
      highlights: [],
      data: {
        functions: [
          { name: "Unregularized", points: weightsToPoints(unregWeights), color: "#ef4444", active: false },
          { name: `${regType} Regularized`, points: weightsToPoints(partialWeights), color: regType === "L1" ? "#22d3ee" : "#a855f7", active: true },
        ],
        xLabel: "Weight Index",
        yLabel: "Weight Value",
        xRange: weightXRange,
        yRange: weightYRange,
      } as FunctionPlotStepData,
    });
  }

  // Step: Side-by-side comparison
  steps.push({
    id: stepId++,
    description: `Comparison: Red = unregularized, ${regType === "L1" ? "Cyan" : "Purple"} = ${regType}-regularized. ${regType === "L1" ? "L1 drives small weights to exactly zero (sparse model = feature selection)." : "L2 shrinks all weights proportionally (no weights become exactly zero)."}`,
    action: "predict",
    highlights: [],
    data: {
      functions: [
        { name: "Unregularized", points: weightsToPoints(unregWeights), color: "#ef4444", active: true },
        { name: `${regType} (lambda=${lambda.toFixed(2)})`, points: weightsToPoints(regWeights), color: regType === "L1" ? "#22d3ee" : "#a855f7", active: true },
      ],
      xLabel: "Weight Index",
      yLabel: "Weight Value",
      xRange: weightXRange,
      yRange: weightYRange,
    } as FunctionPlotStepData,
  });

  // Step: Lambda effect
  // Show different lambda values
  const lambdaValues = [0.1, 1.0, 5.0];
  const lambdaCurves = lambdaValues.map((lam) => {
    const ws = regType === "L1"
      ? unregWeights.map((w) => w > lam ? w - lam : w < -lam ? w + lam : 0)
      : unregWeights.map((w) => w / (1 + lam));
    return {
      name: `lambda=${lam}`,
      points: weightsToPoints(ws),
      color: lam === 0.1 ? "#22c55e" : lam === 1.0 ? "#f59e0b" : "#ef4444",
      active: true,
    };
  });

  steps.push({
    id: stepId++,
    description: `Effect of lambda: As lambda increases, regularization becomes stronger. Higher lambda means simpler model (more bias, less variance). Lambda is a hyperparameter tuned via cross-validation.`,
    action: "predict",
    highlights: [],
    data: {
      functions: lambdaCurves,
      xLabel: "Weight Index",
      yLabel: "Weight Value",
      xRange: weightXRange,
      yRange: weightYRange,
    } as FunctionPlotStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `Regularization summary: ${regType} with lambda=${lambda.toFixed(2)} controls model complexity. L1 (Lasso) promotes sparsity/feature selection. L2 (Ridge) promotes small but non-zero weights. Elastic Net combines both. All reduce overfitting by constraining the model.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [
        { name: "Unregularized", points: weightsToPoints(unregWeights), color: "#ef4444", active: true },
        { name: `${regType} (lambda=${lambda.toFixed(2)})`, points: weightsToPoints(regWeights), color: regType === "L1" ? "#22d3ee" : "#a855f7", active: true },
      ],
      xLabel: "Weight Index",
      yLabel: "Weight Value",
      xRange: weightXRange,
      yRange: weightYRange,
    } as FunctionPlotStepData,
  });

  return steps;
}
