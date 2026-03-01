import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const dbscan: AlgorithmMetadata = {
  id: "dbscan",
  name: "DBSCAN",
  category: "machine-learning",
  subcategory: "Clustering",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n^2)",
    note: "O(n log n) when using a spatial index like a KD-tree for neighbor queries. Without spatial indexing, each neighbor query takes O(n), giving O(n^2) overall. The worst case occurs with degenerate data where spatial indices provide no benefit.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Requires O(n) storage for cluster labels, point classifications (core/border/noise), and the neighbor queue during cluster expansion.",
  },
  description: `DBSCAN (Density-Based Spatial Clustering of Applications with Noise) is a powerful density-based clustering algorithm that groups together points that are closely packed in high-density regions while marking points in low-density regions as outliers (noise). Unlike K-Means, DBSCAN does not require the user to specify the number of clusters in advance, and it can discover clusters of arbitrary shape -- making it particularly effective for real-world datasets where clusters are non-spherical, have varying densities, or contain significant noise.

The algorithm operates on two key parameters: epsilon (eps), which defines the radius of a neighborhood around each point, and minPoints, which sets the minimum number of points required within that radius for the point to be considered a "core" point. DBSCAN classifies every data point into one of three categories: core points have at least minPoints neighbors within their eps-neighborhood; border points fall within the eps-neighborhood of a core point but do not themselves have enough neighbors to be core; and noise points are neither core nor border, lying in low-density regions far from any dense cluster. A cluster is formed by connecting overlapping neighborhoods of core points, with border points attached to the nearest cluster.

The algorithm processes points one at a time. For each unvisited point, it queries all neighbors within the epsilon radius. If the point has fewer than minPoints neighbors, it is tentatively labeled as noise (though it may later be claimed as a border point by an expanding cluster). If the point has enough neighbors, it becomes a core point and a new cluster is initiated. The cluster then expands by recursively visiting the neighbors of each newly added core point, continuing until no more density-reachable points remain. This breadth-first expansion ensures that all density-connected points are grouped together, regardless of the cluster's geometric shape. DBSCAN's key strengths are its ability to handle noise naturally, its parameter simplicity (just two intuitive parameters), and its effectiveness with non-convex cluster shapes. However, it can struggle with datasets containing clusters of vastly different densities, and selecting good eps and minPoints values often requires domain knowledge or tools like k-distance plots.`,
  shortDescription:
    "A density-based clustering algorithm that discovers clusters of arbitrary shape by expanding regions of high point density, while automatically identifying noise points as outliers.",
  pseudocode: `procedure DBSCAN(data, eps, minPoints):
    label = array of UNDEFINED for each point
    clusterID = 0

    for each point P in data:
        if label[P] != UNDEFINED:
            continue    // already processed

        neighbors = rangeQuery(data, P, eps)

        if |neighbors| < minPoints:
            label[P] = NOISE
            continue

        // P is a core point -- start new cluster
        clusterID += 1
        label[P] = clusterID

        // Seed set: neighbors minus P itself
        seedSet = neighbors \\ {P}

        for each Q in seedSet:
            if label[Q] == NOISE:
                label[Q] = clusterID   // border point

            if label[Q] != UNDEFINED:
                continue

            label[Q] = clusterID
            qNeighbors = rangeQuery(data, Q, eps)

            if |qNeighbors| >= minPoints:
                seedSet = seedSet union qNeighbors

    return label

procedure rangeQuery(data, P, eps):
    return {Q in data : distance(P, Q) <= eps}`,
  implementations: {
    python: `import numpy as np
from collections import deque

def dbscan(data: np.ndarray, eps: float, min_pts: int) -> np.ndarray:
    """
    DBSCAN clustering algorithm.

    Args:
        data: (n, d) array of n data points with d features.
        eps: Maximum distance for two points to be neighbors.
        min_pts: Minimum neighbors for a core point.

    Returns:
        Array of cluster labels (-1 = noise).
    """
    n = data.shape[0]
    labels = np.full(n, -2)  # -2 = undefined, -1 = noise
    cluster_id = -1

    def range_query(point_idx):
        dists = np.linalg.norm(data - data[point_idx], axis=1)
        return np.where(dists <= eps)[0].tolist()

    for i in range(n):
        if labels[i] != -2:
            continue

        neighbors = range_query(i)

        if len(neighbors) < min_pts:
            labels[i] = -1  # noise
            continue

        # Start new cluster
        cluster_id += 1
        labels[i] = cluster_id

        seed_queue = deque(
            nb for nb in neighbors if nb != i
        )
        processed = {i}

        while seed_queue:
            q = seed_queue.popleft()
            if q in processed:
                continue
            processed.add(q)

            if labels[q] == -1:
                labels[q] = cluster_id  # border point
                continue

            if labels[q] != -2:
                continue

            labels[q] = cluster_id
            q_neighbors = range_query(q)

            if len(q_neighbors) >= min_pts:
                for nb in q_neighbors:
                    if nb not in processed:
                        seed_queue.append(nb)

    return labels


# Example usage
if __name__ == "__main__":
    np.random.seed(42)
    c1 = np.random.randn(20, 2) * 0.5 + [2, 7]
    c2 = np.random.randn(20, 2) * 0.5 + [7, 3]
    noise = np.random.uniform(0, 10, (5, 2))
    data = np.vstack([c1, c2, noise])

    labels = dbscan(data, eps=1.5, min_pts=3)
    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise = np.sum(labels == -1)
    print(f"Clusters: {n_clusters}, Noise points: {n_noise}")`,
    javascript: `function dbscan(data, eps, minPts) {
  const n = data.length;
  const labels = new Array(n).fill(-2); // -2 = undefined, -1 = noise
  let clusterId = -1;

  function distance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += (a[i] - b[i]) ** 2;
    }
    return Math.sqrt(sum);
  }

  function rangeQuery(pointIdx) {
    const neighbors = [];
    for (let i = 0; i < n; i++) {
      if (distance(data[pointIdx], data[i]) <= eps) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }

  for (let i = 0; i < n; i++) {
    if (labels[i] !== -2) continue;

    const neighbors = rangeQuery(i);

    if (neighbors.length < minPts) {
      labels[i] = -1; // noise
      continue;
    }

    // Start new cluster
    clusterId++;
    labels[i] = clusterId;

    const seedQueue = neighbors.filter((nb) => nb !== i);
    const processed = new Set([i]);

    while (seedQueue.length > 0) {
      const q = seedQueue.shift();
      if (processed.has(q)) continue;
      processed.add(q);

      if (labels[q] === -1) {
        labels[q] = clusterId; // border point
        continue;
      }
      if (labels[q] !== -2) continue;

      labels[q] = clusterId;
      const qNeighbors = rangeQuery(q);

      if (qNeighbors.length >= minPts) {
        for (const nb of qNeighbors) {
          if (!processed.has(nb)) seedQueue.push(nb);
        }
      }
    }
  }

  return labels;
}

// Example usage
const data = [];
for (let i = 0; i < 20; i++) {
  data.push([2 + Math.random(), 7 + Math.random()]);
  data.push([7 + Math.random(), 3 + Math.random()]);
}
// Add noise
for (let i = 0; i < 5; i++) {
  data.push([Math.random() * 10, Math.random() * 10]);
}

const labels = dbscan(data, 1.5, 3);
const nClusters = new Set(labels.filter((l) => l >= 0)).size;
const nNoise = labels.filter((l) => l === -1).length;
console.log(\`Clusters: \${nClusters}, Noise: \${nNoise}\`);`,
  },
  useCases: [
    "Geospatial clustering: grouping GPS coordinates into meaningful locations or hotspots",
    "Anomaly and fraud detection: identifying unusual patterns in financial transactions",
    "Image segmentation where clusters have irregular, non-convex shapes",
    "Identifying dense regions in network traffic for intrusion detection systems",
    "Astronomical data analysis: finding star clusters and identifying outlier celestial objects",
    "Social network analysis: discovering communities of densely connected users",
  ],
  relatedAlgorithms: [
    "k-means",
    "hierarchical-clustering",
    "optics",
    "mean-shift",
    "hdbscan",
  ],
  glossaryTerms: [
    "clustering",
    "density-based clustering",
    "core point",
    "border point",
    "noise point",
    "epsilon neighborhood",
    "unsupervised learning",
    "euclidean distance",
  ],
  tags: [
    "machine-learning",
    "clustering",
    "unsupervised",
    "density-based",
    "noise-robust",
    "non-parametric",
    "advanced",
  ],
};
