import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const knn: AlgorithmMetadata = {
  id: "knn",
  name: "K-Nearest Neighbors",
  category: "machine-learning",
  subcategory: "Classification",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n d)",
    worst: "O(n d)",
    note: "For each query, KNN computes distances to all n training points in d dimensions. With KD-trees, average case improves to O(d log n) for low-dimensional data.",
  },
  spaceComplexity: {
    best: "O(n d)",
    average: "O(n d)",
    worst: "O(n d)",
    note: "The entire training dataset must be stored in memory since KNN is a lazy learner with no explicit model.",
  },
  description: `K-Nearest Neighbors (KNN) is one of the simplest and most intuitive machine learning algorithms. It is a non-parametric, instance-based (lazy) learning method used for both classification and regression. Rather than learning an explicit model from the training data, KNN stores all training examples and defers computation until a new query point needs to be classified. When a new data point arrives, KNN finds the K closest training examples in the feature space using a distance metric (typically Euclidean distance) and assigns the majority class label among those K neighbors.

The choice of K is critical to KNN's performance. A small K (e.g., K=1) makes the algorithm sensitive to noise and outliers, since a single misclassified neighbor can dominate the prediction. A larger K provides smoother decision boundaries and is more robust to noise, but may blur the distinction between classes if K is too large. In practice, K is often chosen via cross-validation and is typically set to an odd number for binary classification to avoid ties. Other distance metrics such as Manhattan distance, Minkowski distance, or cosine similarity can be used depending on the nature of the data.

Despite its simplicity, KNN can be surprisingly effective, especially on datasets with complex, non-linear decision boundaries. However, it suffers from the curse of dimensionality: as the number of features grows, the notion of "nearest" becomes less meaningful because all points tend to be equidistant in high-dimensional spaces. KNN is also computationally expensive at query time, since it must scan the entire training set. Techniques like KD-trees, ball trees, or approximate nearest neighbor libraries (e.g., FAISS, Annoy) can significantly accelerate lookups. KNN is widely used in recommender systems, image classification, anomaly detection, and as a baseline for more complex algorithms.`,
  shortDescription:
    "A lazy learning algorithm that classifies a query point by majority vote among its K nearest training examples.",
  pseudocode: `procedure KNN(trainingSet, queryPoint, K):
    distances = []
    for each point in trainingSet:
        d = euclideanDistance(queryPoint, point)
        distances.append((point, d))
    end for

    // Sort by distance ascending
    sort distances by d

    // Select K nearest neighbors
    neighbors = distances[0 : K]

    // Majority vote
    classCounts = {}
    for each (point, d) in neighbors:
        classCounts[point.label] += 1
    end for

    return argmax(classCounts)
end procedure`,
  implementations: {
    python: `import numpy as np
from collections import Counter

class KNN:
    """K-Nearest Neighbors classifier."""

    def __init__(self, k: int = 3):
        self.k = k
        self.X_train = None
        self.y_train = None

    def fit(self, X: np.ndarray, y: np.ndarray):
        """Store training data (lazy learner)."""
        self.X_train = X
        self.y_train = y

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict class labels for each point in X."""
        return np.array([self._predict_single(x) for x in X])

    def _predict_single(self, x: np.ndarray) -> int:
        """Classify a single query point."""
        # Compute Euclidean distances to all training points
        distances = np.sqrt(np.sum((self.X_train - x) ** 2, axis=1))

        # Find K nearest neighbor indices
        k_indices = np.argsort(distances)[:self.k]

        # Majority vote
        k_labels = self.y_train[k_indices]
        most_common = Counter(k_labels).most_common(1)
        return most_common[0][0]


# Example usage
if __name__ == "__main__":
    X_train = np.array([[1, 2], [2, 3], [3, 1], [6, 5], [7, 8], [8, 6]])
    y_train = np.array([0, 0, 0, 1, 1, 1])

    model = KNN(k=3)
    model.fit(X_train, y_train)

    query = np.array([[5, 5]])
    print(f"Prediction for {query}: class {model.predict(query)[0]}")`,
    javascript: `class KNN {
  constructor(k = 3) {
    this.k = k;
    this.XTrain = [];
    this.yTrain = [];
  }

  /** Store training data (lazy learner). */
  fit(X, y) {
    this.XTrain = X;
    this.yTrain = y;
  }

  /** Predict class labels for each query point. */
  predict(X) {
    return X.map((x) => this._predictSingle(x));
  }

  /** Classify a single query point by majority vote. */
  _predictSingle(x) {
    // Compute Euclidean distances
    const distances = this.XTrain.map((xi, idx) => ({
      idx,
      dist: Math.sqrt(xi.reduce((sum, v, d) => sum + (v - x[d]) ** 2, 0)),
    }));

    // Sort and pick K nearest
    distances.sort((a, b) => a.dist - b.dist);
    const kNearest = distances.slice(0, this.k);

    // Majority vote
    const votes = {};
    for (const { idx } of kNearest) {
      const label = this.yTrain[idx];
      votes[label] = (votes[label] || 0) + 1;
    }

    return Number(
      Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0]
    );
  }
}

// Example usage
const XTrain = [[1,2],[2,3],[3,1],[6,5],[7,8],[8,6]];
const yTrain = [0, 0, 0, 1, 1, 1];

const model = new KNN(3);
model.fit(XTrain, yTrain);

const query = [[5, 5]];
console.log("Prediction:", model.predict(query));`,
  },
  useCases: [
    "Image classification where training data is small and feature extraction is handled by other methods",
    "Recommender systems that suggest items based on similarity to a user's past preferences",
    "Anomaly detection by identifying points whose K nearest neighbors are unusually far away",
    "Medical diagnosis where a patient's features are compared to historical case records for classification",
  ],
  relatedAlgorithms: [
    "svm",
    "decision-tree",
    "random-forest",
    "naive-bayes",
    "logistic-regression",
  ],
  glossaryTerms: [
    "euclidean distance",
    "classification",
    "lazy learning",
    "instance-based learning",
    "curse of dimensionality",
    "cross-validation",
    "feature space",
  ],
  tags: [
    "machine-learning",
    "classification",
    "supervised-learning",
    "lazy-learning",
    "instance-based",
    "non-parametric",
    "beginner",
  ],
};
