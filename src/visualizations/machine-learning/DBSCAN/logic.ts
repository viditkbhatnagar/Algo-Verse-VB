import type {
  VisualizationStep,
  ScatterStepData,
  ScatterPoint,
  HighlightColor,
} from "@/lib/visualization/types";

// Simple seeded random
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianRandom(rand: () => number): number {
  const u1 = rand();
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2);
}

interface DBSCANConfig {
  epsilon: number;
  minPoints: number;
  seed?: number;
}

function euclideanDist(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function generateDBSCANData(rand: () => number): ScatterPoint[] {
  const points: ScatterPoint[] = [];

  // Cluster 1: tight cluster around (2, 7)
  for (let i = 0; i < 10; i++) {
    points.push({
      x: 2 + gaussianRandom(rand) * 0.6,
      y: 7 + gaussianRandom(rand) * 0.6,
      id: `p-${points.length}`,
      label: undefined,
    });
  }

  // Cluster 2: medium cluster around (7, 3)
  for (let i = 0; i < 12; i++) {
    points.push({
      x: 7 + gaussianRandom(rand) * 0.7,
      y: 3 + gaussianRandom(rand) * 0.7,
      id: `p-${points.length}`,
      label: undefined,
    });
  }

  // Cluster 3: loose cluster around (5, 8)
  for (let i = 0; i < 8; i++) {
    points.push({
      x: 5 + gaussianRandom(rand) * 0.8,
      y: 8 + gaussianRandom(rand) * 0.8,
      id: `p-${points.length}`,
      label: undefined,
    });
  }

  // Noise points scattered across the space
  for (let i = 0; i < 5; i++) {
    points.push({
      x: rand() * 10,
      y: rand() * 10,
      id: `p-${points.length}`,
      label: undefined,
    });
  }

  return points;
}

function getNeighbors(
  points: ScatterPoint[],
  pointIdx: number,
  epsilon: number
): number[] {
  const neighbors: number[] = [];
  for (let i = 0; i < points.length; i++) {
    if (euclideanDist(points[pointIdx], points[i]) <= epsilon) {
      neighbors.push(i);
    }
  }
  return neighbors;
}

// Map cluster label to highlight color
const CLUSTER_HIGHLIGHT_MAP: HighlightColor[] = [
  "cluster-0",
  "cluster-1",
  "cluster-2",
  "cluster-3",
];

function clusterHighlight(label: number): HighlightColor {
  return CLUSTER_HIGHLIGHT_MAP[label % CLUSTER_HIGHLIGHT_MAP.length];
}

export function generateDBSCANSteps(config: DBSCANConfig): VisualizationStep[] {
  const { epsilon, minPoints, seed = 42 } = config;
  const rand = mulberry32(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const rawPoints = generateDBSCANData(rand);
  const n = rawPoints.length;

  // Internal state
  const labels: (number | "noise" | undefined)[] = new Array(n).fill(undefined);
  const pointType: ("core" | "border" | "noise" | undefined)[] = new Array(n).fill(undefined);
  let currentCluster = -1;

  // Helper to build current ScatterStepData
  function buildStepData(
    highlightIdx?: number[],
    neighborIndices?: number[],
    epsilonCircle?: { x: number; y: number }
  ): ScatterStepData {
    const pts: ScatterPoint[] = rawPoints.map((p, i) => {
      const lbl = labels[i];
      let highlight: ScatterPoint["highlight"] = undefined;

      if (highlightIdx && highlightIdx.includes(i)) {
        highlight = "active";
      }
      if (neighborIndices && neighborIndices.includes(i) && !highlightIdx?.includes(i)) {
        highlight = "comparing";
      }

      return {
        ...p,
        label: lbl === "noise" ? -1 : (lbl !== undefined ? lbl : undefined),
        highlight,
      };
    });

    const boundaries = epsilonCircle
      ? [
          {
            type: "curve" as const,
            points: Array.from({ length: 37 }, (_, i) => {
              const angle = (i / 36) * 2 * Math.PI;
              return {
                x: epsilonCircle.x + epsilon * Math.cos(angle),
                y: epsilonCircle.y + epsilon * Math.sin(angle),
              };
            }),
            color: "#22d3ee",
            label: `eps=${epsilon}`,
          },
        ]
      : undefined;

    return {
      points: pts,
      xLabel: "Feature 1",
      yLabel: "Feature 2",
      boundaries,
    };
  }

  // Step 1: Show all uncolored points
  steps.push({
    id: stepId++,
    description: `Generated ${n} data points (3 natural clusters + noise). All points unclassified.`,
    action: "cluster",
    highlights: [],
    data: buildStepData(),
  });

  // Step 2: Explain parameters
  steps.push({
    id: stepId++,
    description: `DBSCAN parameters: epsilon (eps) = ${epsilon.toFixed(1)} (neighborhood radius), minPoints = ${minPoints} (density threshold).`,
    action: "cluster",
    highlights: [],
    data: buildStepData(),
  });

  // Process each point
  for (let i = 0; i < n; i++) {
    // Skip already labeled points
    if (labels[i] !== undefined) continue;

    // Show checking this point
    const neighbors = getNeighbors(rawPoints, i, epsilon);

    steps.push({
      id: stepId++,
      description: `Examining point ${i}: found ${neighbors.length} neighbors within eps=${epsilon.toFixed(1)} (need ${minPoints}).`,
      action: "classify",
      highlights: [
        { indices: [i], color: "active", label: "Current" },
        { indices: neighbors.filter((n) => n !== i), color: "comparing", label: "Neighbors" },
      ],
      data: buildStepData([i], neighbors, rawPoints[i]),
    });

    if (neighbors.length < minPoints) {
      // Mark as noise (may later be claimed by a cluster as border)
      labels[i] = "noise";
      pointType[i] = "noise";

      steps.push({
        id: stepId++,
        description: `Point ${i} has only ${neighbors.length} neighbors (< ${minPoints}). Marked as NOISE.`,
        action: "classify",
        highlights: [{ indices: [i], color: "backtracked", label: "Noise" }],
        data: buildStepData([i]),
      });
      continue;
    }

    // Start a new cluster
    currentCluster++;
    labels[i] = currentCluster;
    pointType[i] = "core";

    steps.push({
      id: stepId++,
      description: `Point ${i} is a CORE point (${neighbors.length} >= ${minPoints} neighbors). Starting Cluster ${currentCluster}.`,
      action: "cluster",
      highlights: [{ indices: [i], color: clusterHighlight(currentCluster), label: `Cluster ${currentCluster}` }],
      data: buildStepData([i], neighbors, rawPoints[i]),
    });

    // BFS expansion of the cluster
    const seedQueue = neighbors.filter((n) => n !== i);
    const processed = new Set<number>();
    processed.add(i);

    while (seedQueue.length > 0) {
      const q = seedQueue.shift()!;
      if (processed.has(q)) continue;
      processed.add(q);

      // If this point was previously labeled noise, reassign as border
      if (labels[q] === "noise") {
        labels[q] = currentCluster;
        pointType[q] = "border";

        steps.push({
          id: stepId++,
          description: `Point ${q} was noise but is reachable from Cluster ${currentCluster}. Re-labeled as BORDER point.`,
          action: "highlight",
          highlights: [{ indices: [q], color: clusterHighlight(currentCluster), label: "Border" }],
          data: buildStepData([q]),
        });
        continue;
      }

      // Skip if already assigned to a cluster
      if (labels[q] !== undefined) continue;

      // Assign to current cluster
      labels[q] = currentCluster;

      // Check if this new point is also a core point
      const qNeighbors = getNeighbors(rawPoints, q, epsilon);

      if (qNeighbors.length >= minPoints) {
        pointType[q] = "core";

        steps.push({
          id: stepId++,
          description: `Expanding: Point ${q} is also a CORE point (${qNeighbors.length} neighbors). Adding its neighbors to the queue.`,
          action: "cluster",
          highlights: [
            { indices: [q], color: clusterHighlight(currentCluster), label: "Core" },
            { indices: qNeighbors.filter((n) => n !== q && labels[n] === undefined), color: "comparing", label: "New Neighbors" },
          ],
          data: buildStepData([q], qNeighbors, rawPoints[q]),
        });

        // Add new neighbors to seed queue
        for (const nn of qNeighbors) {
          if (!processed.has(nn)) {
            seedQueue.push(nn);
          }
        }
      } else {
        pointType[q] = "border";

        steps.push({
          id: stepId++,
          description: `Point ${q} assigned to Cluster ${currentCluster} as a BORDER point (${qNeighbors.length} < ${minPoints} neighbors).`,
          action: "highlight",
          highlights: [{ indices: [q], color: clusterHighlight(currentCluster), label: "Border" }],
          data: buildStepData([q]),
        });
      }
    }

    // Show cluster complete
    const clusterIndices = labels
      .map((l, idx) => (l === currentCluster ? idx : -1))
      .filter((idx) => idx >= 0);

    steps.push({
      id: stepId++,
      description: `Cluster ${currentCluster} fully expanded with ${clusterIndices.length} points.`,
      action: "cluster",
      highlights: [{ indices: clusterIndices, color: clusterHighlight(currentCluster), label: `Cluster ${currentCluster}` }],
      data: buildStepData(),
    });
  }

  // Final step: show all clusters and noise
  const noiseIndices = labels
    .map((l, idx) => (l === "noise" ? idx : -1))
    .filter((idx) => idx >= 0);
  const numClusters = currentCluster + 1;

  steps.push({
    id: stepId++,
    description: `DBSCAN complete! Found ${numClusters} cluster${numClusters !== 1 ? "s" : ""} and ${noiseIndices.length} noise point${noiseIndices.length !== 1 ? "s" : ""}.`,
    action: "complete",
    highlights: [],
    data: buildStepData(),
  });

  return steps;
}
