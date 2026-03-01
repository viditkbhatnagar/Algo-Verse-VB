import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const regularization: AlgorithmMetadata = {
  id: "regularization",
  name: "Regularization (L1/L2)",
  category: "machine-learning",
  subcategory: "Regularization",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n d)",
    average: "O(n d)",
    worst: "O(n d^2)",
    note: "L2 regularization adds O(d) to the gradient computation. L1 requires iterative solvers (e.g., coordinate descent). For linear models, the closed-form L2 solution is O(n d^2 + d^3).",
  },
  spaceComplexity: {
    best: "O(d)",
    average: "O(d)",
    worst: "O(d^2)",
    note: "L1 (Lasso) stores d weights, many of which may be zero. L2 (Ridge) stores d weights. The closed-form solution requires O(d^2) for the Gram matrix.",
  },
  description: `Regularization is a fundamental technique in machine learning that prevents overfitting by adding a penalty term to the loss function that discourages overly complex models. The two most common forms are L1 regularization (Lasso) and L2 regularization (Ridge). Both add a penalty proportional to the magnitude of model weights, but they differ in their mathematical properties and practical effects.

L1 regularization (Lasso) adds the sum of absolute values of weights: Loss_L1 = Loss + lambda * sum(|w_i|). The L1 penalty has a sharp corner at zero, which creates a diamond-shaped constraint region. This geometric property causes the optimization to push small weights to exactly zero, effectively performing automatic feature selection. Lasso is particularly useful when you believe only a subset of features are relevant. However, it can be unstable when features are correlated, and its solution path is piecewise linear.

L2 regularization (Ridge) adds the sum of squared weights: Loss_L2 = Loss + 0.5 * lambda * sum(w_i^2). The L2 penalty creates a circular constraint region, which shrinks all weights proportionally toward zero but never makes them exactly zero. Ridge regression has a closed-form solution and is more stable than Lasso when features are correlated. Elastic Net combines L1 and L2 penalties, offering both feature selection and stability. The regularization strength lambda is a hyperparameter: too small and overfitting persists, too large and the model underfits. Lambda is typically tuned via cross-validation.`,
  shortDescription:
    "A technique to prevent overfitting by penalizing large model weights. L1 (Lasso) promotes sparsity; L2 (Ridge) promotes small weights.",
  pseudocode: `// L2 Regularization (Ridge Regression)
procedure RidgeLoss(X, y, w, lambda):
    predictions = X @ w
    mse_loss = mean((predictions - y)^2)
    l2_penalty = lambda * sum(w_i^2) / 2
    return mse_loss + l2_penalty

procedure RidgeGradient(X, y, w, lambda):
    return X^T @ (X @ w - y) / n + lambda * w

// Closed-form solution:
w_ridge = (X^T X + lambda * I)^(-1) @ X^T @ y

// L1 Regularization (Lasso)
procedure LassoLoss(X, y, w, lambda):
    predictions = X @ w
    mse_loss = mean((predictions - y)^2)
    l1_penalty = lambda * sum(|w_i|)
    return mse_loss + l1_penalty

// Solved via coordinate descent:
procedure LassoCoordinateDescent(X, y, lambda, iterations):
    w = zeros(d)
    for iter = 1 to iterations:
        for j = 1 to d:
            residual = y - X @ w + X[:, j] * w[j]
            rho = X[:, j]^T @ residual / n
            w[j] = softThreshold(rho, lambda)
        end for
    end for
    return w

function softThreshold(rho, lambda):
    if rho > lambda: return rho - lambda
    if rho < -lambda: return rho + lambda
    return 0`,
  implementations: {
    python: `import numpy as np

class RidgeRegression:
    """L2-regularized linear regression."""

    def __init__(self, lambda_: float = 1.0):
        self.lambda_ = lambda_
        self.weights = None

    def fit(self, X, y):
        n, d = X.shape
        # Closed-form: w = (X^T X + lambda * I)^(-1) X^T y
        I = np.eye(d)
        self.weights = np.linalg.solve(
            X.T @ X + self.lambda_ * I, X.T @ y
        )

    def predict(self, X):
        return X @ self.weights


class LassoRegression:
    """L1-regularized linear regression via coordinate descent."""

    def __init__(self, lambda_: float = 1.0, max_iter: int = 1000):
        self.lambda_ = lambda_
        self.max_iter = max_iter
        self.weights = None

    def _soft_threshold(self, rho, lam):
        if rho > lam:
            return rho - lam
        elif rho < -lam:
            return rho + lam
        return 0.0

    def fit(self, X, y):
        n, d = X.shape
        self.weights = np.zeros(d)

        for _ in range(self.max_iter):
            for j in range(d):
                residual = y - X @ self.weights + X[:, j] * self.weights[j]
                rho = X[:, j] @ residual / n
                self.weights[j] = self._soft_threshold(rho, self.lambda_)

    def predict(self, X):
        return X @ self.weights


# Example
np.random.seed(42)
X = np.random.randn(100, 5)
true_w = np.array([3.0, -2.0, 0.0, 0.0, 1.5])
y = X @ true_w + np.random.randn(100) * 0.5

ridge = RidgeRegression(lambda_=1.0)
ridge.fit(X, y)
print("Ridge weights:", ridge.weights.round(3))

lasso = LassoRegression(lambda_=0.1)
lasso.fit(X, y)
print("Lasso weights:", lasso.weights.round(3))`,
    javascript: `class RidgeRegression {
  constructor(lambda = 1.0) {
    this.lambda = lambda;
    this.weights = null;
  }

  fit(X, y) {
    const n = X.length;
    const d = X[0].length;

    // Gradient descent approach
    this.weights = Array(d).fill(0);
    const lr = 0.01;

    for (let iter = 0; iter < 1000; iter++) {
      const grad = Array(d).fill(0);
      for (let i = 0; i < n; i++) {
        const pred = X[i].reduce((s, x, j) => s + x * this.weights[j], 0);
        const error = pred - y[i];
        for (let j = 0; j < d; j++) {
          grad[j] += (2 * error * X[i][j]) / n + 2 * this.lambda * this.weights[j];
        }
      }
      for (let j = 0; j < d; j++) {
        this.weights[j] -= lr * grad[j];
      }
    }
  }

  predict(X) {
    return X.map((x) =>
      x.reduce((s, v, j) => s + v * this.weights[j], 0)
    );
  }
}

class LassoRegression {
  constructor(lambda = 1.0, maxIter = 1000) {
    this.lambda = lambda;
    this.maxIter = maxIter;
    this.weights = null;
  }

  _softThreshold(rho, lam) {
    if (rho > lam) return rho - lam;
    if (rho < -lam) return rho + lam;
    return 0;
  }

  fit(X, y) {
    const n = X.length;
    const d = X[0].length;
    this.weights = Array(d).fill(0);

    for (let iter = 0; iter < this.maxIter; iter++) {
      for (let j = 0; j < d; j++) {
        let rho = 0;
        for (let i = 0; i < n; i++) {
          const pred = X[i].reduce((s, x, k) =>
            s + x * (k === j ? 0 : this.weights[k]), 0);
          rho += X[i][j] * (y[i] - pred);
        }
        rho /= n;
        this.weights[j] = this._softThreshold(rho, this.lambda);
      }
    }
  }

  predict(X) {
    return X.map((x) =>
      x.reduce((s, v, j) => s + v * this.weights[j], 0)
    );
  }
}

console.log("Ridge: shrinks weights, never zero");
console.log("Lasso: drives small weights to zero (sparsity)");`,
  },
  useCases: [
    "Feature selection in high-dimensional datasets using L1 (Lasso) to identify the most important variables",
    "Preventing overfitting in linear models with many correlated features using L2 (Ridge) regression",
    "Gene expression analysis where thousands of features exist but only a handful are relevant",
    "Price prediction models where regularization ensures stable coefficient estimates",
  ],
  relatedAlgorithms: [
    "linear-regression",
    "logistic-regression",
    "bias-variance-tradeoff",
    "cross-validation",
    "polynomial-regression",
  ],
  glossaryTerms: [
    "regularization",
    "L1 regularization",
    "L2 regularization",
    "Lasso",
    "Ridge regression",
    "Elastic Net",
    "overfitting",
    "sparsity",
    "feature selection",
    "weight decay",
  ],
  tags: [
    "machine-learning",
    "regularization",
    "overfitting",
    "feature-selection",
    "optimization",
    "intermediate",
  ],
};
