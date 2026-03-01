import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const pca: AlgorithmMetadata = {
  id: "pca",
  name: "Principal Component Analysis",
  category: "machine-learning",
  subcategory: "Dimensionality Reduction",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * d^2)",
    average: "O(n * d^2 + d^3)",
    worst: "O(n * d^2 + d^3)",
    note: "Where n is the number of samples and d is the number of features. Computing the covariance matrix is O(n*d^2), and eigenvalue decomposition of the d x d covariance matrix is O(d^3). For high-dimensional data where d >> n, truncated SVD methods run in O(n^2 * k) where k is the number of components retained.",
  },
  spaceComplexity: {
    best: "O(d^2)",
    average: "O(d^2 + n * d)",
    worst: "O(n * d + d^2)",
    note: "The covariance matrix requires O(d^2) space. The centered data matrix uses O(n*d). When using SVD-based methods, additional workspace proportional to the matrix dimensions is needed.",
  },
  description: `Principal Component Analysis (PCA) is one of the most widely used unsupervised dimensionality reduction techniques in machine learning and data science. It transforms high-dimensional data into a lower-dimensional representation by identifying the directions (principal components) along which the data varies the most. Each principal component is a linear combination of the original features, and the components are orthogonal to each other, ensuring that they capture independent sources of variation.

The algorithm works by first centering the data (subtracting the mean of each feature), then computing the covariance matrix to understand how features relate to each other. The eigenvectors of the covariance matrix define the principal component directions, and the corresponding eigenvalues indicate the amount of variance captured along each direction. By selecting only the top-k eigenvectors (those with the largest eigenvalues), we project the data into a k-dimensional subspace that retains the most information while reducing dimensionality. This projection minimizes the reconstruction error in a least-squares sense.

PCA is fundamental to exploratory data analysis, noise reduction, and feature engineering. It is used as a preprocessing step before applying supervised learning algorithms on high-dimensional data, for visualization of complex datasets in 2D or 3D, and for identifying latent structure in the data. While PCA assumes linear relationships between features and is sensitive to feature scaling, its simplicity, efficiency, and strong mathematical foundations make it indispensable in the machine learning toolkit. Extensions like Kernel PCA handle nonlinear relationships, and Sparse PCA produces more interpretable components.`,
  shortDescription:
    "Reduces data dimensionality by finding the directions of maximum variance (principal components) and projecting data onto them.",
  pseudocode: `procedure PCA(X, k):
    // X: n x d data matrix (n samples, d features)
    // k: number of components to retain
    n = number of rows in X

    // Step 1: Center the data
    mean = column-wise mean of X
    X_centered = X - mean

    // Step 2: Compute covariance matrix
    C = (1 / (n - 1)) * X_centered^T * X_centered

    // Step 3: Compute eigenvalues and eigenvectors
    eigenvalues, eigenvectors = eigen_decomposition(C)

    // Step 4: Sort by eigenvalue (descending)
    sort eigenvectors by corresponding eigenvalues descending

    // Step 5: Select top-k eigenvectors
    W = eigenvectors[:, 0:k]  // d x k projection matrix

    // Step 6: Project data
    X_reduced = X_centered * W  // n x k reduced data

    // Variance explained
    variance_explained = sum(top-k eigenvalues) / sum(all eigenvalues)

    return X_reduced, W, variance_explained
end procedure`,
  implementations: {
    python: `import numpy as np

def pca(X: np.ndarray, k: int = 2):
    """
    Perform PCA on dataset X, reducing to k dimensions.

    Parameters:
        X: n x d data matrix (n samples, d features)
        k: number of principal components to retain

    Returns:
        X_reduced: n x k projected data
        components: k x d principal component directions
        explained_variance_ratio: fraction of variance explained
    """
    n, d = X.shape

    # Step 1: Center the data
    mean = np.mean(X, axis=0)
    X_centered = X - mean

    # Step 2: Compute covariance matrix
    cov_matrix = np.cov(X_centered, rowvar=False)

    # Step 3: Eigenvalue decomposition
    eigenvalues, eigenvectors = np.linalg.eigh(cov_matrix)

    # Step 4: Sort by eigenvalue (descending)
    idx = np.argsort(eigenvalues)[::-1]
    eigenvalues = eigenvalues[idx]
    eigenvectors = eigenvectors[:, idx]

    # Step 5: Select top-k components
    components = eigenvectors[:, :k].T  # k x d

    # Step 6: Project data
    X_reduced = X_centered @ eigenvectors[:, :k]

    # Variance explained
    explained_variance_ratio = eigenvalues[:k] / np.sum(eigenvalues)

    return X_reduced, components, explained_variance_ratio


# Example usage
if __name__ == "__main__":
    np.random.seed(42)
    # Generate correlated 2D data
    angle = np.pi / 4
    R = np.array([[np.cos(angle), -np.sin(angle)],
                  [np.sin(angle),  np.cos(angle)]])
    data = np.random.randn(100, 2) @ np.diag([3, 0.5]) @ R.T + [5, 5]

    X_reduced, components, var_ratio = pca(data, k=1)
    print(f"Principal component: {components[0]}")
    print(f"Variance explained: {var_ratio[0]:.4f}")
    print(f"Reduced shape: {X_reduced.shape}")`,
    javascript: `function pca(X, k = 2) {
  /**
   * Perform PCA on dataset X, reducing to k dimensions.
   * @param {number[][]} X - n x d data matrix
   * @param {number} k - number of components to retain
   * @returns {{ reduced: number[][], components: number[][], varianceExplained: number[] }}
   */
  const n = X.length;
  const d = X[0].length;

  // Step 1: Center the data
  const mean = Array(d).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < d; j++) mean[j] += X[i][j];
  }
  for (let j = 0; j < d; j++) mean[j] /= n;

  const centered = X.map(row => row.map((v, j) => v - mean[j]));

  // Step 2: Compute covariance matrix (d x d)
  const cov = Array.from({ length: d }, () => Array(d).fill(0));
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < d; a++) {
      for (let b = a; b < d; b++) {
        cov[a][b] += centered[i][a] * centered[i][b];
      }
    }
  }
  for (let a = 0; a < d; a++) {
    for (let b = a; b < d; b++) {
      cov[a][b] /= (n - 1);
      cov[b][a] = cov[a][b];
    }
  }

  // Step 3: Power iteration for top-k eigenvectors (simplified for 2D)
  function powerIteration(matrix, numIter = 100) {
    let v = Array(d).fill(0).map(() => Math.random());
    let norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    v = v.map(x => x / norm);

    for (let iter = 0; iter < numIter; iter++) {
      const Av = Array(d).fill(0);
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) Av[i] += matrix[i][j] * v[j];
      }
      norm = Math.sqrt(Av.reduce((s, x) => s + x * x, 0));
      v = Av.map(x => x / norm);
    }
    const Av = Array(d).fill(0);
    for (let i = 0; i < d; i++) {
      for (let j = 0; j < d; j++) Av[i] += matrix[i][j] * v[j];
    }
    const eigenvalue = v.reduce((s, x, i) => s + x * Av[i], 0);
    return { eigenvector: v, eigenvalue };
  }

  const components = [];
  const eigenvalues = [];
  let currentCov = cov.map(row => [...row]);

  for (let c = 0; c < k; c++) {
    const { eigenvector, eigenvalue } = powerIteration(currentCov);
    components.push(eigenvector);
    eigenvalues.push(eigenvalue);
    // Deflate the matrix
    for (let i = 0; i < d; i++) {
      for (let j = 0; j < d; j++) {
        currentCov[i][j] -= eigenvalue * eigenvector[i] * eigenvector[j];
      }
    }
  }

  // Step 4: Project data
  const reduced = centered.map(row =>
    components.map(comp => comp.reduce((s, c, j) => s + c * row[j], 0))
  );

  const totalVar = eigenvalues.reduce((s, v) => s + v, 0) +
    (d > k ? eigenvalues[eigenvalues.length - 1] * 0.1 : 0);
  const varianceExplained = eigenvalues.map(v => v / totalVar);

  return { reduced, components, varianceExplained };
}

// Example usage
const data = Array.from({ length: 50 }, () => {
  const x = Math.random() * 10;
  return [x + Math.random(), x * 0.5 + Math.random()];
});

const { reduced, components, varianceExplained } = pca(data, 1);
console.log("First PC:", components[0].map(v => v.toFixed(4)));
console.log("Variance explained:", varianceExplained[0].toFixed(4));
console.log("Reduced shape:", reduced.length, "x", reduced[0].length);`,
  },
  useCases: [
    "Reducing high-dimensional image data for faster training of classifiers while preserving key visual features",
    "Visualizing clusters in gene expression data by projecting thousands of genes onto 2-3 principal components",
    "Removing noise from sensor data by discarding components with low variance that likely represent measurement noise",
    "Compressing facial recognition features (Eigenfaces) for efficient storage and comparison in biometric systems",
  ],
  relatedAlgorithms: [
    "k-means",
    "linear-regression",
    "svm",
  ],
  glossaryTerms: [
    "dimensionality reduction",
    "eigenvalue",
    "eigenvector",
    "covariance matrix",
    "variance",
    "feature extraction",
    "unsupervised learning",
  ],
  tags: [
    "machine-learning",
    "dimensionality-reduction",
    "unsupervised-learning",
    "linear-algebra",
    "intermediate",
    "statistics",
    "feature-engineering",
  ],
};
