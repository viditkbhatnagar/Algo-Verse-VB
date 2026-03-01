import type { VisualizationStep, ScatterStepData, ScatterPoint, DecisionBoundary } from "@/lib/visualization/types";

interface LogisticRegressionInput {
  numPoints: number;
  learningRate: number;
  seed?: number;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
}

/** Box-Muller transform for approximately normal random variates */
function gaussianRandom(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
}

function generateTwoClassData(
  numPoints: number,
  rng: () => number
): { xs: number[][]; ys: number[] } {
  const xs: number[][] = [];
  const ys: number[] = [];
  const half = Math.floor(numPoints / 2);

  // Class 0: centered around (-1.5, -1.5)
  for (let i = 0; i < half; i++) {
    xs.push([
      -1.5 + gaussianRandom(rng) * 1.0,
      -1.5 + gaussianRandom(rng) * 1.0,
    ]);
    ys.push(0);
  }

  // Class 1: centered around (1.5, 1.5)
  for (let i = half; i < numPoints; i++) {
    xs.push([
      1.5 + gaussianRandom(rng) * 1.0,
      1.5 + gaussianRandom(rng) * 1.0,
    ]);
    ys.push(1);
  }

  return { xs, ys };
}

function computeLoss(
  xs: number[][],
  ys: number[],
  w: number[],
  b: number
): number {
  const n = xs.length;
  const eps = 1e-15;
  let loss = 0;
  for (let i = 0; i < n; i++) {
    const z = xs[i][0] * w[0] + xs[i][1] * w[1] + b;
    const p = sigmoid(z);
    loss -= ys[i] * Math.log(p + eps) + (1 - ys[i]) * Math.log(1 - p + eps);
  }
  return loss / n;
}

function computeAccuracy(
  xs: number[][],
  ys: number[],
  w: number[],
  b: number
): number {
  let correct = 0;
  for (let i = 0; i < xs.length; i++) {
    const z = xs[i][0] * w[0] + xs[i][1] * w[1] + b;
    const pred = sigmoid(z) >= 0.5 ? 1 : 0;
    if (pred === ys[i]) correct++;
  }
  return correct / xs.length;
}

/**
 * Build a decision boundary line for 2D logistic regression.
 * The boundary is where w0*x0 + w1*x1 + b = 0
 * => x1 = -(w0*x0 + b) / w1
 */
function makeDecisionBoundary(
  xs: number[][],
  w: number[],
  b: number
): DecisionBoundary {
  const allX0 = xs.map((x) => x[0]);
  const xMin = Math.min(...allX0) - 1;
  const xMax = Math.max(...allX0) + 1;

  const points: { x: number; y: number }[] = [];
  if (Math.abs(w[1]) > 1e-8) {
    // x1 = -(w0 * x0 + b) / w1
    const numSamples = 40;
    const step = (xMax - xMin) / (numSamples - 1);
    for (let i = 0; i < numSamples; i++) {
      const x0 = xMin + i * step;
      const x1 = -(w[0] * x0 + b) / w[1];
      points.push({ x: x0, y: x1 });
    }
  } else if (Math.abs(w[0]) > 1e-8) {
    // Vertical line: x0 = -b / w0
    const x0 = -b / w[0];
    const allX1 = xs.map((x) => x[1]);
    const yMin = Math.min(...allX1) - 1;
    const yMax = Math.max(...allX1) + 1;
    points.push({ x: x0, y: yMin }, { x: x0, y: yMax });
  }

  return {
    type: "line",
    points,
    label: "Decision boundary",
  };
}

export function generateLogisticRegressionSteps(
  input: LogisticRegressionInput
): VisualizationStep[] {
  const { numPoints, learningRate, seed = 42 } = input;
  const rng = seededRandom(seed);
  const { xs, ys } = generateTwoClassData(numPoints, rng);

  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Build scatter points with class labels
  const points: ScatterPoint[] = xs.map((x, i) => ({
    x: parseFloat(x[0].toFixed(2)),
    y: parseFloat(x[1].toFixed(2)),
    label: ys[i],
    id: `p-${i}`,
  }));

  // --- Step 1: Show data points ---
  steps.push({
    id: stepId++,
    description: `Generated ${numPoints} data points in 2 classes (class 0 and class 1). Goal: learn a sigmoid decision boundary using gradient descent.`,
    action: "train",
    highlights: [],
    data: {
      points: [...points],
      xLabel: "x\u2081",
      yLabel: "x\u2082",
    } satisfies ScatterStepData,
  });

  // --- Step 2: Initialize weights ---
  let w = [0, 0];
  let b = 0;
  const initLoss = computeLoss(xs, ys, w, b);

  steps.push({
    id: stepId++,
    description: `Initialize weights w = [0, 0], bias b = 0. Initial loss = ${initLoss.toFixed(4)} (random guessing).`,
    action: "train",
    highlights: [],
    data: {
      points: [...points],
      xLabel: "x\u2081",
      yLabel: "x\u2082",
      lossValue: initLoss,
    } satisfies ScatterStepData,
    variables: { w: [...w], b, loss: parseFloat(initLoss.toFixed(4)) },
  });

  // --- Training loop: show 20 selected epochs ---
  const totalEpochs = 200;
  const snapshotEpochs: number[] = [];
  // Logarithmic-ish sampling: more snapshots early when changes are large
  for (let i = 1; i <= 8; i++) snapshotEpochs.push(i);
  for (let i = 10; i <= 30; i += 5) snapshotEpochs.push(i);
  for (let i = 40; i <= totalEpochs; i += 20) snapshotEpochs.push(i);

  const snapshotSet = new Set(snapshotEpochs);

  for (let epoch = 1; epoch <= totalEpochs; epoch++) {
    const n = xs.length;

    // Forward pass
    const predictions = xs.map(
      (xi) => sigmoid(xi[0] * w[0] + xi[1] * w[1] + b)
    );

    // Compute gradients
    let dw0 = 0, dw1 = 0, db = 0;
    for (let i = 0; i < n; i++) {
      const error = predictions[i] - ys[i];
      dw0 += error * xs[i][0];
      dw1 += error * xs[i][1];
      db += error;
    }
    dw0 /= n;
    dw1 /= n;
    db /= n;

    // Update
    w = [w[0] - learningRate * dw0, w[1] - learningRate * dw1];
    b = b - learningRate * db;

    if (snapshotSet.has(epoch)) {
      const loss = computeLoss(xs, ys, w, b);
      const acc = computeAccuracy(xs, ys, w, b);

      // Color misclassified points
      const stepPoints: ScatterPoint[] = points.map((p, i) => {
        const z = xs[i][0] * w[0] + xs[i][1] * w[1] + b;
        const pred = sigmoid(z) >= 0.5 ? 1 : 0;
        const isWrong = pred !== ys[i];
        return {
          ...p,
          highlight: isWrong ? ("comparing" as const) : undefined,
        };
      });

      const boundary = makeDecisionBoundary(xs, w, b);
      const misclassified = stepPoints.filter((p) => p.highlight === "comparing").length;

      steps.push({
        id: stepId++,
        description: `Epoch ${epoch}/${totalEpochs}: w = [${w[0].toFixed(3)}, ${w[1].toFixed(3)}], b = ${b.toFixed(3)}. Loss = ${loss.toFixed(4)}, accuracy = ${(acc * 100).toFixed(1)}%. ${misclassified} misclassified points highlighted.`,
        action: "fit-line",
        highlights: [],
        data: {
          points: stepPoints,
          boundaries: [boundary],
          xLabel: "x\u2081",
          yLabel: "x\u2082",
          lossValue: loss,
          epoch,
        } satisfies ScatterStepData,
        variables: {
          epoch,
          w0: parseFloat(w[0].toFixed(3)),
          w1: parseFloat(w[1].toFixed(3)),
          bias: parseFloat(b.toFixed(3)),
          loss: parseFloat(loss.toFixed(4)),
          accuracy: `${(acc * 100).toFixed(1)}%`,
          misclassified,
        },
      });
    }
  }

  // --- Step: Prediction ---
  const predPoint = [0.5, 0.5];
  const predZ = predPoint[0] * w[0] + predPoint[1] * w[1] + b;
  const predProb = sigmoid(predZ);
  const predClass = predProb >= 0.5 ? 1 : 0;

  steps.push({
    id: stepId++,
    description: `Prediction: point (${predPoint[0]}, ${predPoint[1]}) has z = ${predZ.toFixed(3)}, sigmoid(z) = ${predProb.toFixed(3)} => class ${predClass}.`,
    action: "predict",
    highlights: [],
    data: {
      points: [...points],
      boundaries: [makeDecisionBoundary(xs, w, b)],
      queryPoint: { x: predPoint[0], y: predPoint[1], label: predClass },
      xLabel: "x\u2081",
      yLabel: "x\u2082",
      lossValue: computeLoss(xs, ys, w, b),
    } satisfies ScatterStepData,
    variables: {
      z: parseFloat(predZ.toFixed(3)),
      probability: parseFloat(predProb.toFixed(3)),
      predictedClass: predClass,
    },
  });

  // --- Final step ---
  const finalLoss = computeLoss(xs, ys, w, b);
  const finalAcc = computeAccuracy(xs, ys, w, b);

  steps.push({
    id: stepId++,
    description: `Logistic Regression complete! Final weights: [${w[0].toFixed(3)}, ${w[1].toFixed(3)}], bias: ${b.toFixed(3)}. Loss = ${finalLoss.toFixed(4)}, accuracy = ${(finalAcc * 100).toFixed(1)}%.`,
    action: "complete",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p, highlight: "completed" as const })),
      boundaries: [makeDecisionBoundary(xs, w, b)],
      xLabel: "x\u2081",
      yLabel: "x\u2082",
      lossValue: finalLoss,
    } satisfies ScatterStepData,
    variables: {
      w0: parseFloat(w[0].toFixed(4)),
      w1: parseFloat(w[1].toFixed(4)),
      bias: parseFloat(b.toFixed(4)),
      loss: parseFloat(finalLoss.toFixed(4)),
      accuracy: `${(finalAcc * 100).toFixed(1)}%`,
    },
  });

  return steps;
}
