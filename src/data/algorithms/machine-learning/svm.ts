import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const svm: AlgorithmMetadata = {
  id: "svm",
  name: "Support Vector Machine",
  category: "machine-learning",
  subcategory: "Classification",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n d)",
    average: "O(n^2 d)",
    worst: "O(n^3)",
    note: "Training complexity depends on the kernel and solver. Linear SVM with SGD is O(n d). Kernel SVM with SMO solver ranges from O(n^2) to O(n^3). Prediction is O(n_sv * d) where n_sv is the number of support vectors.",
  },
  spaceComplexity: {
    best: "O(n_sv d)",
    average: "O(n^2)",
    worst: "O(n^2)",
    note: "Kernel SVM requires the kernel matrix of size O(n^2). The final model only stores support vectors, which is typically a small fraction of the training set.",
  },
  description: `Support Vector Machine (SVM) is a powerful supervised learning algorithm used for classification and regression tasks. The core idea behind SVM is to find the optimal hyperplane that separates data points of different classes with the maximum margin. The margin is defined as the distance between the hyperplane and the closest data points from each class, known as support vectors. By maximizing this margin, SVM creates a decision boundary that generalizes well to unseen data, making it one of the most theoretically grounded and practically effective classifiers in machine learning.

For linearly separable data, SVM finds the unique hyperplane that maximizes the margin by solving a convex quadratic optimization problem. The optimization can be expressed in its primal form (minimizing ||w||^2 subject to classification constraints) or its dual form using Lagrange multipliers. The dual formulation reveals that the solution depends only on the inner products between support vectors, which leads to the powerful kernel trick. The kernel trick allows SVM to implicitly map data into a higher-dimensional feature space where linear separation becomes possible, without ever computing the transformation explicitly. Common kernels include the polynomial kernel, radial basis function (RBF/Gaussian) kernel, and sigmoid kernel.

SVM has several attractive properties that make it widely used in practice. It is effective in high-dimensional spaces, even when the number of features exceeds the number of samples. It is memory-efficient because only support vectors (a subset of training points) are needed after training. The kernel trick gives it flexibility to handle non-linear decision boundaries. However, SVM can be computationally expensive for very large datasets (O(n^2) to O(n^3) for kernel SVM), and it requires careful tuning of hyperparameters like the regularization parameter C and the kernel parameters. SVM is extensively used in text classification, image recognition, bioinformatics, and handwriting recognition.`,
  shortDescription:
    "A classification algorithm that finds the optimal hyperplane maximizing the margin between classes, using support vectors to define the decision boundary.",
  pseudocode: `procedure SVM_Train(X, y, C, kernel):
    // Solve the dual optimization problem
    // maximize: sum(alpha_i) - 0.5 * sum(alpha_i * alpha_j * y_i * y_j * K(x_i, x_j))
    // subject to: 0 <= alpha_i <= C  and  sum(alpha_i * y_i) = 0

    Compute kernel matrix K where K[i][j] = kernel(X[i], X[j])

    // Use Sequential Minimal Optimization (SMO)
    Initialize alpha = zeros(n)
    while not converged:
        Select pair (i, j) violating KKT conditions
        Optimize alpha_i, alpha_j jointly
        Update bias b
    end while

    // Identify support vectors (alpha_i > 0)
    supportVectors = { i : alpha_i > 0 }

    // Compute weight vector (linear kernel only)
    w = sum(alpha_i * y_i * X[i]) for i in supportVectors
    b = y_j - w . X[j]  for any support vector j

    return (w, b, supportVectors)
end procedure

procedure SVM_Predict(x, w, b):
    return sign(w . x + b)
end procedure`,
  implementations: {
    python: `import numpy as np

class LinearSVM:
    """Linear Support Vector Machine using sub-gradient descent."""

    def __init__(self, C: float = 1.0, lr: float = 0.001, epochs: int = 1000):
        self.C = C        # Regularization parameter
        self.lr = lr       # Learning rate
        self.epochs = epochs
        self.w = None
        self.b = 0.0

    def fit(self, X: np.ndarray, y: np.ndarray):
        """Train the SVM on labeled data. Labels must be -1 or +1."""
        n_samples, n_features = X.shape
        self.w = np.zeros(n_features)
        self.b = 0.0

        # Convert labels to {-1, +1} if needed
        y_ = np.where(y <= 0, -1, 1)

        for _ in range(self.epochs):
            for idx in range(n_samples):
                # Check if the point satisfies the margin constraint
                condition = y_[idx] * (np.dot(X[idx], self.w) + self.b) >= 1

                if condition:
                    # Correctly classified with sufficient margin
                    self.w -= self.lr * (2 * (1 / self.epochs) * self.w)
                else:
                    # Misclassified or within margin -- apply hinge loss gradient
                    self.w -= self.lr * (
                        2 * (1 / self.epochs) * self.w - self.C * y_[idx] * X[idx]
                    )
                    self.b -= self.lr * (-self.C * y_[idx])

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict class labels (-1 or +1) for input samples."""
        return np.sign(np.dot(X, self.w) + self.b)

    def decision_function(self, X: np.ndarray) -> np.ndarray:
        """Compute the signed distance to the decision boundary."""
        return np.dot(X, self.w) + self.b


# Example usage
if __name__ == "__main__":
    X_train = np.array([[1, 2], [2, 3], [3, 1], [6, 5], [7, 8], [8, 6]])
    y_train = np.array([-1, -1, -1, 1, 1, 1])

    svm = LinearSVM(C=1.0, lr=0.001, epochs=1000)
    svm.fit(X_train, y_train)

    query = np.array([[5, 5]])
    print(f"Prediction for {query}: {svm.predict(query)[0]}")
    print(f"Decision value: {svm.decision_function(query)[0]:.4f}")`,
    javascript: `class LinearSVM {
  /**
   * Linear SVM using sub-gradient descent.
   * @param {number} C - Regularization parameter
   * @param {number} lr - Learning rate
   * @param {number} epochs - Training iterations
   */
  constructor(C = 1.0, lr = 0.001, epochs = 1000) {
    this.C = C;
    this.lr = lr;
    this.epochs = epochs;
    this.w = [];
    this.b = 0;
  }

  /** Train the SVM. Labels must be -1 or +1. */
  fit(X, y) {
    const nFeatures = X[0].length;
    this.w = new Array(nFeatures).fill(0);
    this.b = 0;

    const yNorm = y.map((v) => (v <= 0 ? -1 : 1));

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      for (let i = 0; i < X.length; i++) {
        const dot = X[i].reduce((s, v, d) => s + v * this.w[d], 0);
        const condition = yNorm[i] * (dot + this.b) >= 1;

        if (condition) {
          // Correctly classified with margin
          this.w = this.w.map(
            (wj) => wj - this.lr * (2 * (1 / this.epochs) * wj)
          );
        } else {
          // Hinge loss gradient
          this.w = this.w.map(
            (wj, d) =>
              wj -
              this.lr *
                (2 * (1 / this.epochs) * wj - this.C * yNorm[i] * X[i][d])
          );
          this.b -= this.lr * (-this.C * yNorm[i]);
        }
      }
    }
  }

  /** Predict class labels for input array. */
  predict(X) {
    return X.map((x) => {
      const val = x.reduce((s, v, d) => s + v * this.w[d], 0) + this.b;
      return val >= 0 ? 1 : -1;
    });
  }

  /** Signed distance to the decision boundary. */
  decisionFunction(X) {
    return X.map((x) =>
      x.reduce((s, v, d) => s + v * this.w[d], 0) + this.b
    );
  }
}

// Example usage
const XTrain = [[1,2],[2,3],[3,1],[6,5],[7,8],[8,6]];
const yTrain = [-1, -1, -1, 1, 1, 1];

const svm = new LinearSVM(1.0, 0.001, 1000);
svm.fit(XTrain, yTrain);

const query = [[5, 5]];
console.log("Prediction:", svm.predict(query));
console.log("Decision value:", svm.decisionFunction(query));`,
  },
  useCases: [
    "Text classification and spam filtering where high-dimensional TF-IDF features are used",
    "Image classification and object recognition in computer vision pipelines",
    "Bioinformatics for gene expression analysis and protein classification with small sample sizes",
    "Handwriting and digit recognition (e.g., the classic MNIST benchmark with RBF kernel SVM)",
  ],
  relatedAlgorithms: [
    "knn",
    "logistic-regression",
    "decision-tree",
    "random-forest",
    "kernel-pca",
  ],
  glossaryTerms: [
    "hyperplane",
    "margin",
    "support vector",
    "kernel trick",
    "regularization",
    "convex optimization",
    "classification",
    "generalization",
  ],
  tags: [
    "machine-learning",
    "classification",
    "supervised-learning",
    "kernel-methods",
    "maximum-margin",
    "convex-optimization",
    "advanced",
  ],
};
