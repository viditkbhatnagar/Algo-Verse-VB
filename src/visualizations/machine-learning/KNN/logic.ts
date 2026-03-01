import type {
  VisualizationStep,
  ScatterStepData,
  ScatterPoint,
} from "@/lib/visualization/types";

interface KNNParams {
  k: number;
  numPoints: number;
  seed?: number;
}

/** Seeded pseudo-random number generator for reproducibility */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/** Generate two linearly separable classes of 2D points */
function generateData(
  numPoints: number,
  rand: () => number
): ScatterPoint[] {
  const points: ScatterPoint[] = [];
  const half = Math.floor(numPoints / 2);

  // Class 0: cluster around (2, 2)
  for (let i = 0; i < half; i++) {
    points.push({
      x: 1 + rand() * 2.5,
      y: 1 + rand() * 2.5,
      label: 0,
      id: `p${i}`,
    });
  }

  // Class 1: cluster around (6, 6)
  for (let i = half; i < numPoints; i++) {
    points.push({
      x: 4.5 + rand() * 2.5,
      y: 4.5 + rand() * 2.5,
      label: 1,
      id: `p${i}`,
    });
  }

  return points;
}

/** Euclidean distance */
function distance(a: ScatterPoint, b: ScatterPoint): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function generateKNNSteps(params: KNNParams): VisualizationStep[] {
  const { k, numPoints, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const points = generateData(numPoints, rand);

  // Generate query point in the boundary region
  const queryPoint: ScatterPoint = {
    x: 3.2 + rand() * 1.6,
    y: 3.2 + rand() * 1.6,
    label: -1,
    id: "query",
  };

  // Compute all distances
  const distances = points.map((p, idx) => ({
    idx,
    dist: distance(p, queryPoint),
  }));
  const sortedDistances = [...distances].sort((a, b) => a.dist - b.dist);

  // ---- Step 1: Show initial data ----
  steps.push({
    id: stepId++,
    description: `Dataset loaded: ${numPoints} labeled points from 2 classes (blue = Class 0, orange = Class 1).`,
    action: "predict",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p })),
      xLabel: "Feature 1",
      yLabel: "Feature 2",
      xRange: [0, 8] as [number, number],
      yRange: [0, 8] as [number, number],
    } as ScatterStepData,
  });

  // ---- Step 2: Introduce query point ----
  steps.push({
    id: stepId++,
    description: `New query point (?) appears at (${queryPoint.x.toFixed(1)}, ${queryPoint.y.toFixed(1)}). Goal: classify it using K=${k} nearest neighbors.`,
    action: "predict",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p })),
      queryPoint: { ...queryPoint },
      xLabel: "Feature 1",
      yLabel: "Feature 2",
      xRange: [0, 8] as [number, number],
      yRange: [0, 8] as [number, number],
    } as ScatterStepData,
  });

  // ---- Steps 3..N: Measure distance to each point (batch of ~3 per step) ----
  const batchSize = Math.max(2, Math.ceil(numPoints / 6));
  const distanceCheckSteps: number[] = [];

  for (let batch = 0; batch < numPoints; batch += batchSize) {
    const end = Math.min(batch + batchSize, numPoints);
    const currentBatchIndices = [];
    for (let i = batch; i < end; i++) {
      currentBatchIndices.push(i);
    }

    distanceCheckSteps.push(...currentBatchIndices);

    const pointsCopy = points.map((p, idx) => {
      if (distanceCheckSteps.includes(idx)) {
        return { ...p, highlight: "comparing" as const };
      }
      return { ...p };
    });

    const closestInBatch = currentBatchIndices.reduce(
      (best, idx) =>
        distances[idx].dist < best.dist
          ? { idx, dist: distances[idx].dist }
          : best,
      { idx: -1, dist: Infinity }
    );

    steps.push({
      id: stepId++,
      description: `Computing distances to points ${batch + 1}-${end}. Nearest in this batch: point ${closestInBatch.idx} (d=${closestInBatch.dist.toFixed(2)}).`,
      action: "compare",
      highlights: [
        {
          indices: currentBatchIndices,
          color: "comparing",
          label: "Measuring distance",
        },
      ],
      data: {
        points: pointsCopy,
        queryPoint: { ...queryPoint },
        xLabel: "Feature 1",
        yLabel: "Feature 2",
        xRange: [0, 8] as [number, number],
        yRange: [0, 8] as [number, number],
      } as ScatterStepData,
    });
  }

  // ---- Step: All distances computed ----
  steps.push({
    id: stepId++,
    description: `All ${numPoints} distances computed. Now selecting the K=${k} nearest neighbors.`,
    action: "compare",
    highlights: [],
    data: {
      points: points.map((p) => ({ ...p, highlight: "comparing" as const })),
      queryPoint: { ...queryPoint },
      xLabel: "Feature 1",
      yLabel: "Feature 2",
      xRange: [0, 8] as [number, number],
      yRange: [0, 8] as [number, number],
    } as ScatterStepData,
  });

  // ---- Steps: Highlight k nearest one by one ----
  const kNearestIndices: number[] = [];
  for (let i = 0; i < Math.min(k, sortedDistances.length); i++) {
    kNearestIndices.push(sortedDistances[i].idx);

    const pointsCopy = points.map((p, idx) => {
      if (kNearestIndices.includes(idx)) {
        return { ...p, highlight: "selected" as const };
      }
      return { ...p };
    });

    const currentPoint = points[sortedDistances[i].idx];
    const classLabel = currentPoint.label === 0 ? "Class 0 (blue)" : "Class 1 (orange)";

    steps.push({
      id: stepId++,
      description: `Neighbor ${i + 1}/${k}: Point ${sortedDistances[i].idx} at distance ${sortedDistances[i].dist.toFixed(2)} belongs to ${classLabel}.`,
      action: "classify",
      highlights: [
        {
          indices: kNearestIndices,
          color: "selected",
          label: "K nearest",
        },
      ],
      data: {
        points: pointsCopy,
        queryPoint: { ...queryPoint },
        kNearest: [...kNearestIndices],
        xLabel: "Feature 1",
        yLabel: "Feature 2",
        xRange: [0, 8] as [number, number],
        yRange: [0, 8] as [number, number],
      } as ScatterStepData,
    });
  }

  // ---- Step: Show all K nearest with circle ----
  const pointsWithKNearest = points.map((p, idx) => {
    if (kNearestIndices.includes(idx)) {
      return { ...p, highlight: "selected" as const };
    }
    return { ...p };
  });

  steps.push({
    id: stepId++,
    description: `All K=${k} nearest neighbors identified. The dashed circle encloses the neighborhood.`,
    action: "classify",
    highlights: [
      {
        indices: kNearestIndices,
        color: "selected",
        label: "K nearest neighbors",
      },
    ],
    data: {
      points: pointsWithKNearest,
      queryPoint: { ...queryPoint },
      kNearest: [...kNearestIndices],
      xLabel: "Feature 1",
      yLabel: "Feature 2",
      xRange: [0, 8] as [number, number],
      yRange: [0, 8] as [number, number],
    } as ScatterStepData,
  });

  // ---- Step: Voting ----
  let class0Count = 0;
  let class1Count = 0;
  for (const idx of kNearestIndices) {
    if (points[idx].label === 0) class0Count++;
    else class1Count++;
  }

  steps.push({
    id: stepId++,
    description: `Majority vote: Class 0 has ${class0Count} vote(s), Class 1 has ${class1Count} vote(s).`,
    action: "classify",
    highlights: [
      {
        indices: kNearestIndices,
        color: "selected",
        label: "Voters",
      },
    ],
    data: {
      points: pointsWithKNearest,
      queryPoint: { ...queryPoint },
      kNearest: [...kNearestIndices],
      xLabel: "Feature 1",
      yLabel: "Feature 2",
      xRange: [0, 8] as [number, number],
      yRange: [0, 8] as [number, number],
    } as ScatterStepData,
  });

  // ---- Step: Classification result ----
  const predictedClass = class0Count >= class1Count ? 0 : 1;
  const classColor = predictedClass === 0 ? "blue" : "orange";
  const classifiedQuery: ScatterPoint = {
    ...queryPoint,
    label: predictedClass,
  };

  const finalPoints = points.map((p, idx) => {
    if (kNearestIndices.includes(idx)) {
      return { ...p, highlight: "completed" as const };
    }
    return { ...p };
  });

  steps.push({
    id: stepId++,
    description: `Query point classified as Class ${predictedClass} (${classColor}) by majority vote (${Math.max(class0Count, class1Count)}/${k}).`,
    action: "complete",
    highlights: [
      {
        indices: kNearestIndices,
        color: "completed",
        label: "Final neighbors",
      },
    ],
    data: {
      points: finalPoints,
      queryPoint: classifiedQuery,
      kNearest: [...kNearestIndices],
      xLabel: "Feature 1",
      yLabel: "Feature 2",
      xRange: [0, 8] as [number, number],
      yRange: [0, 8] as [number, number],
    } as ScatterStepData,
  });

  // ---- Step: Summary ----
  steps.push({
    id: stepId++,
    description: `KNN complete! With K=${k}, the query point is classified as Class ${predictedClass}. KNN is a lazy learner -- no model is built; classification is done at query time.`,
    action: "complete",
    highlights: [],
    data: {
      points: finalPoints,
      queryPoint: classifiedQuery,
      kNearest: [...kNearestIndices],
      xLabel: "Feature 1",
      yLabel: "Feature 2",
      xRange: [0, 8] as [number, number],
      yRange: [0, 8] as [number, number],
    } as ScatterStepData,
  });

  return steps;
}
