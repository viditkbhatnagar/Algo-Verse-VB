import type {
  VisualizationStep,
  ScatterStepData,
  ScatterPoint,
} from "@/lib/visualization/types";

// Simple seeded random for reproducibility within a run
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianRandom(rand: () => number): number {
  // Box-Muller transform
  const u1 = rand();
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2);
}

interface KMeansConfig {
  k: number;
  numPoints: number;
  seed?: number;
}

function generateClusteredData(
  numPoints: number,
  k: number,
  rand: () => number
): ScatterPoint[] {
  // Cluster centers spread across the space
  const centers = [
    { x: 2, y: 2 },
    { x: 8, y: 8 },
    { x: 2, y: 8 },
    { x: 8, y: 2 },
    { x: 5, y: 5 },
  ].slice(0, k);

  const points: ScatterPoint[] = [];
  const pointsPerCluster = Math.floor(numPoints / k);
  const remainder = numPoints - pointsPerCluster * k;

  for (let c = 0; c < k; c++) {
    const count = pointsPerCluster + (c < remainder ? 1 : 0);
    for (let i = 0; i < count; i++) {
      points.push({
        x: centers[c].x + gaussianRandom(rand) * 1.2,
        y: centers[c].y + gaussianRandom(rand) * 1.2,
        id: `p-${points.length}`,
        label: undefined, // unassigned
      });
    }
  }

  return points;
}

function euclideanDist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function assignClusters(
  points: ScatterPoint[],
  centroids: ScatterPoint[]
): number[] {
  return points.map((p) => {
    let minDist = Infinity;
    let closest = 0;
    centroids.forEach((c, ci) => {
      const d = euclideanDist(p, c);
      if (d < minDist) {
        minDist = d;
        closest = ci;
      }
    });
    return closest;
  });
}

function computeCentroids(
  points: ScatterPoint[],
  assignments: number[],
  k: number
): ScatterPoint[] {
  const sums: { x: number; y: number; count: number }[] = Array.from(
    { length: k },
    () => ({ x: 0, y: 0, count: 0 })
  );

  points.forEach((p, i) => {
    const c = assignments[i];
    sums[c].x += p.x;
    sums[c].y += p.y;
    sums[c].count++;
  });

  return sums.map((s, i) => ({
    x: s.count > 0 ? s.x / s.count : 0,
    y: s.count > 0 ? s.y / s.count : 0,
    label: i,
    id: `centroid-${i}`,
    highlight: "centroid" as const,
  }));
}

export function generateKMeansSteps(config: KMeansConfig): VisualizationStep[] {
  const { k, numPoints, seed = 42 } = config;
  const rand = mulberry32(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Generate data
  const rawPoints = generateClusteredData(numPoints, k, rand);

  // Step 1: Show all uncolored points
  steps.push({
    id: stepId++,
    description: `Generated ${numPoints} data points. All points are unassigned (gray).`,
    action: "cluster",
    highlights: [],
    data: {
      points: rawPoints.map((p) => ({ ...p, label: undefined })),
      xLabel: "Feature 1",
      yLabel: "Feature 2",
    } as ScatterStepData,
  });

  // Step 2: Randomly place k centroids
  const initialCentroidIndices: number[] = [];
  while (initialCentroidIndices.length < k) {
    const idx = Math.floor(rand() * numPoints);
    if (!initialCentroidIndices.includes(idx)) {
      initialCentroidIndices.push(idx);
    }
  }

  let centroids: ScatterPoint[] = initialCentroidIndices.map((idx, i) => ({
    x: rawPoints[idx].x,
    y: rawPoints[idx].y,
    label: i,
    id: `centroid-${i}`,
    highlight: "centroid" as const,
  }));

  steps.push({
    id: stepId++,
    description: `Randomly initialized ${k} centroids (triangles) at data point locations.`,
    action: "cluster",
    highlights: [],
    data: {
      points: rawPoints.map((p) => ({ ...p, label: undefined })),
      centroids: centroids.map((c) => ({ ...c })),
      xLabel: "Feature 1",
      yLabel: "Feature 2",
    } as ScatterStepData,
  });

  // Iterative K-Means
  const maxIterations = 10;
  let prevAssignments: number[] = [];

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assignment step
    const assignments = assignClusters(rawPoints, centroids);

    // Step: Show assignment in progress (highlight a few points being assigned)
    const batchSize = Math.max(3, Math.ceil(numPoints / 5));
    for (let batch = 0; batch < numPoints; batch += batchSize) {
      const end = Math.min(batch + batchSize, numPoints);
      const partialPoints = rawPoints.map((p, i) => ({
        ...p,
        label: i < end ? assignments[i] : (i < batch ? assignments[i] : undefined),
        highlight: (i >= batch && i < end ? "active" : undefined) as ScatterPoint["highlight"],
      }));

      steps.push({
        id: stepId++,
        description: `Iteration ${iter + 1}: Assigning points ${batch + 1}-${end} to nearest centroid.`,
        action: "assign-cluster",
        highlights: [
          {
            indices: Array.from({ length: end - batch }, (_, j) => batch + j),
            color: "active",
            label: "Assigning",
          },
        ],
        data: {
          points: partialPoints,
          centroids: centroids.map((c) => ({ ...c })),
          xLabel: "Feature 1",
          yLabel: "Feature 2",
        } as ScatterStepData,
      });
    }

    // Show full assignment result
    const assignedPoints = rawPoints.map((p, i) => ({
      ...p,
      label: assignments[i],
    }));

    steps.push({
      id: stepId++,
      description: `Iteration ${iter + 1}: All points assigned to nearest centroid. Computing new centroids...`,
      action: "assign-cluster",
      highlights: [],
      data: {
        points: assignedPoints,
        centroids: centroids.map((c) => ({ ...c })),
        xLabel: "Feature 1",
        yLabel: "Feature 2",
      } as ScatterStepData,
    });

    // Update step
    const newCentroids = computeCentroids(rawPoints, assignments, k);

    steps.push({
      id: stepId++,
      description: `Iteration ${iter + 1}: Centroids moved to the mean position of their assigned points.`,
      action: "update-centroid",
      highlights: [],
      data: {
        points: assignedPoints,
        centroids: newCentroids.map((c) => ({ ...c })),
        xLabel: "Feature 1",
        yLabel: "Feature 2",
      } as ScatterStepData,
    });

    // Check convergence
    const converged =
      prevAssignments.length > 0 &&
      assignments.every((a, i) => a === prevAssignments[i]);

    if (converged) {
      steps.push({
        id: stepId++,
        description: `Converged after ${iter + 1} iterations! No point changed its cluster assignment.`,
        action: "complete",
        highlights: [],
        data: {
          points: assignedPoints,
          centroids: newCentroids.map((c) => ({ ...c })),
          xLabel: "Feature 1",
          yLabel: "Feature 2",
        } as ScatterStepData,
      });
      break;
    }

    prevAssignments = [...assignments];
    centroids = newCentroids;

    if (iter === maxIterations - 1) {
      steps.push({
        id: stepId++,
        description: `Reached maximum iterations (${maxIterations}). Algorithm terminated.`,
        action: "complete",
        highlights: [],
        data: {
          points: assignedPoints,
          centroids: newCentroids.map((c) => ({ ...c })),
          xLabel: "Feature 1",
          yLabel: "Feature 2",
        } as ScatterStepData,
      });
    }
  }

  return steps;
}
