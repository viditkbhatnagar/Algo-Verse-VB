import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const featureScaling: AlgorithmMetadata = {
  id: "feature-scaling",
  name: "Feature Scaling",
  category: "machine-learning",
  subcategory: "Preprocessing",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n d)",
    average: "O(n d)",
    worst: "O(n d)",
    note: "Requires a single pass over n samples with d features to compute statistics (min/max or mean/std), then another pass to transform. Both Min-Max and Z-Score are O(n d).",
  },
  spaceComplexity: {
    best: "O(d)",
    average: "O(d)",
    worst: "O(n d)",
    note: "Stores per-feature statistics (2 values per feature for Min-Max, 2 for Z-Score). The transformed data may be stored in-place or require O(n d) for a copy.",
  },
  description: `Feature scaling is a critical preprocessing step in machine learning that transforms numeric features to a common scale. Without scaling, features with larger magnitudes dominate distance calculations and gradient updates, leading to poor model performance. The two most common methods are Min-Max Normalization and Z-Score Standardization.

Min-Max Normalization rescales each feature to a fixed range, typically [0, 1], using the formula: x_scaled = (x - min) / (max - min). This preserves the original distribution shape and is useful when you know the bounds of your data. However, it is sensitive to outliers since a single extreme value can compress the majority of the data into a narrow range. It is commonly used with neural networks and image data where pixel values need to be in [0, 1].

Z-Score Standardization (also called Standard Scaling) transforms each feature to have zero mean and unit variance using: x_scaled = (x - mean) / std. This does not bound the values to a specific range but centers the data around zero. It is more robust to outliers than Min-Max and is preferred for algorithms that assume Gaussian-distributed features (e.g., Logistic Regression, SVM, PCA). Feature scaling is essential for distance-based algorithms (KNN, K-Means, SVM), gradient descent optimization, and regularized models. Tree-based methods like Random Forest and XGBoost are generally scale-invariant.`,
  shortDescription:
    "Preprocessing technique that transforms features to a common scale using Min-Max Normalization or Z-Score Standardization.",
  pseudocode: `procedure MinMaxNormalization(X, feature_range=(0, 1)):
    for each feature j in X:
        x_min = min(X[:, j])
        x_max = max(X[:, j])
        X[:, j] = (X[:, j] - x_min) / (x_max - x_min)
        X[:, j] = X[:, j] * (feature_range[1] - feature_range[0]) + feature_range[0]
    end for
    return X

procedure ZScoreStandardization(X):
    for each feature j in X:
        mean_j = mean(X[:, j])
        std_j = std(X[:, j])
        X[:, j] = (X[:, j] - mean_j) / std_j
    end for
    return X`,
  implementations: {
    python: `import numpy as np

class MinMaxScaler:
    """Min-Max Normalization to [0, 1]."""

    def __init__(self):
        self.min_ = None
        self.max_ = None

    def fit(self, X: np.ndarray):
        self.min_ = X.min(axis=0)
        self.max_ = X.max(axis=0)
        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        return (X - self.min_) / (self.max_ - self.min_ + 1e-8)

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        return self.fit(X).transform(X)


class StandardScaler:
    """Z-Score Standardization (mean=0, std=1)."""

    def __init__(self):
        self.mean_ = None
        self.std_ = None

    def fit(self, X: np.ndarray):
        self.mean_ = X.mean(axis=0)
        self.std_ = X.std(axis=0)
        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        return (X - self.mean_) / (self.std_ + 1e-8)

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        return self.fit(X).transform(X)


# Example
X = np.array([[25, 50000], [45, 80000], [35, 60000], [50, 90000]])
mm = MinMaxScaler().fit_transform(X)
ss = StandardScaler().fit_transform(X)
print("Min-Max:\\n", mm)
print("Z-Score:\\n", ss)`,
    javascript: `class MinMaxScaler {
  constructor() {
    this.min = null;
    this.max = null;
  }

  fit(X) {
    const d = X[0].length;
    this.min = Array(d).fill(Infinity);
    this.max = Array(d).fill(-Infinity);
    for (const row of X) {
      for (let j = 0; j < d; j++) {
        this.min[j] = Math.min(this.min[j], row[j]);
        this.max[j] = Math.max(this.max[j], row[j]);
      }
    }
    return this;
  }

  transform(X) {
    return X.map((row) =>
      row.map((v, j) => (v - this.min[j]) / (this.max[j] - this.min[j] + 1e-8))
    );
  }

  fitTransform(X) { return this.fit(X).transform(X); }
}

class StandardScaler {
  constructor() {
    this.mean = null;
    this.std = null;
  }

  fit(X) {
    const n = X.length, d = X[0].length;
    this.mean = Array(d).fill(0);
    for (const row of X)
      for (let j = 0; j < d; j++) this.mean[j] += row[j] / n;

    this.std = Array(d).fill(0);
    for (const row of X)
      for (let j = 0; j < d; j++)
        this.std[j] += (row[j] - this.mean[j]) ** 2 / n;
    this.std = this.std.map(Math.sqrt);
    return this;
  }

  transform(X) {
    return X.map((row) =>
      row.map((v, j) => (v - this.mean[j]) / (this.std[j] + 1e-8))
    );
  }

  fitTransform(X) { return this.fit(X).transform(X); }
}

const X = [[25, 50000], [45, 80000], [35, 60000], [50, 90000]];
console.log("Min-Max:", new MinMaxScaler().fitTransform(X));
console.log("Z-Score:", new StandardScaler().fitTransform(X));`,
  },
  useCases: [
    "Preprocessing data for KNN, SVM, and K-Means where distance calculations require features on the same scale",
    "Normalizing pixel values to [0,1] for neural network training on image data",
    "Standardizing features before PCA to ensure all dimensions contribute equally to variance",
    "Preparing mixed-scale features (e.g., age, income, temperature) for logistic regression",
  ],
  relatedAlgorithms: [
    "knn",
    "svm",
    "k-means",
    "linear-regression",
    "logistic-regression",
  ],
  glossaryTerms: [
    "feature scaling",
    "normalization",
    "standardization",
    "min-max scaling",
    "z-score",
    "preprocessing",
    "curse of dimensionality",
  ],
  tags: [
    "machine-learning",
    "preprocessing",
    "normalization",
    "standardization",
    "beginner",
  ],
};
