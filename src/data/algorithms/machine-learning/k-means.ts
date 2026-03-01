import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const kMeans: AlgorithmMetadata = {
  id: "k-means",
  name: "K-Means Clustering",
  category: "machine-learning",
  subcategory: "Clustering",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(nkd)",
    average: "O(nkdi)",
    worst: "O(n^(dk+1))",
    note: "Where n = number of data points, k = number of clusters, d = dimensionality of data, and i = number of iterations. In practice, the algorithm converges quickly and is treated as approximately linear.",
  },
  spaceComplexity: {
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n + k)",
    note: "Requires storage for n data points and k centroids, plus cluster assignment labels.",
  },
  description: `K-Means is one of the most widely used unsupervised machine learning algorithms for partitioning a dataset into a predefined number of clusters (k). The algorithm aims to minimize the within-cluster sum of squares (WCSS), also known as inertia, by iteratively assigning each data point to the nearest centroid and then recomputing centroids as the mean of all points in each cluster. This simple yet powerful approach works remarkably well for datasets with roughly spherical, equally-sized clusters.

The algorithm follows an Expectation-Maximization (EM) style procedure. It begins by initializing k centroids, either randomly from the data points or using smarter strategies like K-Means++ which spreads initial centroids apart. In the expectation step, every data point is assigned to the cluster whose centroid is closest (using Euclidean distance by default). In the maximization step, each centroid is updated to the mean position of all points currently assigned to its cluster. These two steps repeat until convergence, which occurs when no point changes its cluster assignment or when centroids stop moving beyond a threshold.

Despite its popularity, K-Means has several important limitations. The user must specify the number of clusters k in advance, which requires domain knowledge or heuristics like the elbow method or silhouette score. The algorithm is sensitive to initialization, often requiring multiple restarts with different seeds (as in the K-Means++ variant). It assumes clusters are convex and isotropic, meaning it struggles with elongated, non-spherical, or overlapping clusters. It is also sensitive to outliers, since outlier points can pull centroids away from the true cluster centers. Nevertheless, K-Means remains the go-to clustering algorithm for exploratory data analysis, customer segmentation, image compression, and many other applications due to its simplicity, speed, and scalability.`,
  shortDescription:
    "An iterative unsupervised algorithm that partitions data into k clusters by alternating between assigning points to the nearest centroid and recomputing centroids as cluster means.",
  pseudocode: `procedure KMeans(data, k):
    // Initialize k centroids randomly from data points
    centroids = randomSample(data, k)

    repeat:
        // Assignment step: assign each point to nearest centroid
        for each point in data:
            point.cluster = argmin_j distance(point, centroids[j])

        // Update step: recompute centroids
        for j = 1 to k:
            cluster_points = {p in data : p.cluster == j}
            centroids[j] = mean(cluster_points)

    until centroids do not change (convergence)

    return cluster assignments, centroids`,
  implementations: {
    python: `import numpy as np

def k_means(data: np.ndarray, k: int, max_iters: int = 100) -> tuple:
    """
    K-Means clustering algorithm.

    Args:
        data: (n, d) array of n data points with d features.
        k: Number of clusters.
        max_iters: Maximum number of iterations.

    Returns:
        Tuple of (labels, centroids).
    """
    n = data.shape[0]
    # Random initialization (pick k points from data)
    indices = np.random.choice(n, k, replace=False)
    centroids = data[indices].copy()

    for iteration in range(max_iters):
        # Assignment step: compute distances and assign clusters
        distances = np.linalg.norm(data[:, None] - centroids[None, :], axis=2)
        labels = np.argmin(distances, axis=1)

        # Update step: recompute centroids
        new_centroids = np.array([
            data[labels == j].mean(axis=0) if np.any(labels == j)
            else centroids[j]
            for j in range(k)
        ])

        # Check convergence
        if np.allclose(centroids, new_centroids):
            print(f"Converged after {iteration + 1} iterations.")
            break

        centroids = new_centroids

    return labels, centroids


# Example usage
if __name__ == "__main__":
    np.random.seed(42)
    # Generate 3 clusters
    c1 = np.random.randn(30, 2) + [2, 2]
    c2 = np.random.randn(30, 2) + [8, 8]
    c3 = np.random.randn(30, 2) + [2, 8]
    data = np.vstack([c1, c2, c3])

    labels, centroids = k_means(data, k=3)
    print("Centroids:", centroids)
    print("Labels:", labels)`,
    javascript: `function kMeans(data, k, maxIters = 100) {
  const n = data.length;
  const d = data[0].length;

  // Random initialization: pick k distinct data points
  const indices = [];
  while (indices.length < k) {
    const idx = Math.floor(Math.random() * n);
    if (!indices.includes(idx)) indices.push(idx);
  }
  let centroids = indices.map((i) => [...data[i]]);

  let labels = new Array(n).fill(0);

  for (let iter = 0; iter < maxIters; iter++) {
    // Assignment step
    let changed = false;
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let best = 0;
      for (let j = 0; j < k; j++) {
        let dist = 0;
        for (let f = 0; f < d; f++) {
          dist += (data[i][f] - centroids[j][f]) ** 2;
        }
        if (dist < minDist) {
          minDist = dist;
          best = j;
        }
      }
      if (labels[i] !== best) {
        labels[i] = best;
        changed = true;
      }
    }

    // Update step: new centroids
    const sums = Array.from({ length: k }, () => new Array(d).fill(0));
    const counts = new Array(k).fill(0);
    for (let i = 0; i < n; i++) {
      const c = labels[i];
      counts[c]++;
      for (let f = 0; f < d; f++) sums[c][f] += data[i][f];
    }
    centroids = sums.map((s, j) =>
      s.map((val) => (counts[j] > 0 ? val / counts[j] : 0))
    );

    if (!changed) {
      console.log(\`Converged after \${iter + 1} iterations.\`);
      break;
    }
  }

  return { labels, centroids };
}

// Example usage
const data = [];
for (let i = 0; i < 30; i++) {
  data.push([2 + Math.random() * 2, 2 + Math.random() * 2]);
  data.push([8 + Math.random() * 2, 8 + Math.random() * 2]);
}
const result = kMeans(data, 2);
console.log("Centroids:", result.centroids);`,
  },
  useCases: [
    "Customer segmentation in marketing based on purchasing behavior or demographics",
    "Image compression by reducing the number of colors (color quantization)",
    "Document clustering for topic modeling and information retrieval",
    "Anomaly detection by identifying points far from any cluster centroid",
    "Feature engineering as a preprocessing step to create cluster-based features for supervised learning",
    "Gene expression analysis in bioinformatics to identify groups of co-expressed genes",
  ],
  relatedAlgorithms: [
    "dbscan",
    "hierarchical-clustering",
    "gaussian-mixture-models",
    "mean-shift",
    "knn",
  ],
  glossaryTerms: [
    "clustering",
    "centroid",
    "unsupervised learning",
    "euclidean distance",
    "convergence",
    "inertia",
    "elbow method",
    "k-means++",
  ],
  tags: [
    "machine-learning",
    "clustering",
    "unsupervised",
    "partitioning",
    "centroid-based",
    "iterative",
    "intermediate",
  ],
};
