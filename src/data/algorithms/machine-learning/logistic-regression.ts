import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const logisticRegression: AlgorithmMetadata = {
  id: "logistic-regression",
  name: "Logistic Regression",
  category: "machine-learning",
  subcategory: "Classification",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * d * T)",
    average: "O(n * d * T)",
    worst: "O(n * d * T)",
    note: "Where n is the number of samples, d is the number of features, and T is the number of gradient descent iterations. Each iteration requires computing the sigmoid for all n samples and updating d+1 weights. Convergence typically requires T = O(1/epsilon) iterations for gradient descent.",
  },
  spaceComplexity: {
    best: "O(d)",
    average: "O(n * d)",
    worst: "O(n * d)",
    note: "The weight vector requires O(d) space. Storing the feature matrix requires O(n*d). For batch gradient descent, all samples must be in memory. Stochastic gradient descent reduces space to O(d) per iteration.",
  },
  description: `Logistic Regression is a fundamental classification algorithm that models the probability of a binary outcome using the logistic (sigmoid) function. Despite its name containing "regression," it is used for classification tasks. The model computes a linear combination of input features (z = w^T * x + b), then passes this through the sigmoid function sigma(z) = 1 / (1 + e^(-z)) to produce a probability between 0 and 1. If the probability exceeds a threshold (typically 0.5), the model predicts class 1; otherwise, it predicts class 0.

The model parameters (weights and bias) are learned by maximizing the log-likelihood of the training data, which is equivalent to minimizing the binary cross-entropy loss. Unlike linear regression, there is no closed-form solution for logistic regression, so optimization is performed iteratively using gradient descent. In each iteration, the gradient of the loss function is computed with respect to each weight, and the weights are updated in the direction that reduces the loss. The learning rate controls the step size: too large a learning rate causes overshooting and divergence, while too small a rate leads to slow convergence.

Logistic regression is widely used in practice due to its simplicity, interpretability, and efficiency. The learned weights directly indicate the influence of each feature on the prediction: positive weights increase the probability of class 1, while negative weights decrease it. The model naturally provides calibrated probabilities rather than just class labels, making it useful for risk assessment applications. Logistic regression serves as the building block for neural networks (a single neuron with sigmoid activation) and can be extended to multi-class classification using the softmax function (multinomial logistic regression). Regularization techniques like L1 (lasso) and L2 (ridge) can be applied to prevent overfitting and perform feature selection.`,
  shortDescription:
    "A binary classification algorithm that uses the sigmoid function to model the probability of a data point belonging to one of two classes.",
  pseudocode: `procedure LogisticRegression(X, y, learning_rate, epochs):
    // X: feature matrix (n x d)
    // y: binary labels {0, 1} (n samples)
    // learning_rate: step size for gradient descent
    // epochs: number of training iterations
    n = number of samples
    d = number of features

    // Initialize weights and bias
    w = vector of zeros (d)
    b = 0

    for epoch = 1 to epochs do
        // Forward pass: compute predictions
        for i = 0 to n - 1 do
            z[i] = dot(w, X[i]) + b
            p[i] = sigmoid(z[i])     // p[i] = 1 / (1 + exp(-z[i]))
        end for

        // Compute gradients
        dw = (1/n) * sum((p[i] - y[i]) * X[i] for i in 0..n-1)
        db = (1/n) * sum(p[i] - y[i] for i in 0..n-1)

        // Compute loss (binary cross-entropy)
        loss = -(1/n) * sum(y[i]*log(p[i]) + (1-y[i])*log(1-p[i]))

        // Update parameters
        w = w - learning_rate * dw
        b = b - learning_rate * db
    end for

    return w, b
end procedure

function sigmoid(z):
    return 1 / (1 + exp(-z))

function predict(x, w, b):
    p = sigmoid(dot(w, x) + b)
    return 1 if p >= 0.5 else 0`,
  implementations: {
    python: `import numpy as np

def sigmoid(z: np.ndarray) -> np.ndarray:
    """Compute the sigmoid function, clipping to avoid overflow."""
    z = np.clip(z, -500, 500)
    return 1.0 / (1.0 + np.exp(-z))


def logistic_regression(
    X: np.ndarray,
    y: np.ndarray,
    learning_rate: float = 0.1,
    epochs: int = 100,
) -> tuple:
    """
    Train a logistic regression model using gradient descent.

    Parameters:
        X: Feature matrix (n x d)
        y: Binary labels (n,)
        learning_rate: Step size for gradient descent
        epochs: Number of training iterations

    Returns:
        weights, bias, loss_history
    """
    n, d = X.shape
    weights = np.zeros(d)
    bias = 0.0
    loss_history = []

    for epoch in range(epochs):
        # Forward pass
        z = X @ weights + bias
        predictions = sigmoid(z)

        # Compute gradients
        error = predictions - y
        dw = (1 / n) * (X.T @ error)
        db = (1 / n) * np.sum(error)

        # Compute binary cross-entropy loss
        eps = 1e-15
        loss = -(1 / n) * np.sum(
            y * np.log(predictions + eps) +
            (1 - y) * np.log(1 - predictions + eps)
        )
        loss_history.append(loss)

        # Update parameters
        weights -= learning_rate * dw
        bias -= learning_rate * db

    return weights, bias, loss_history


def predict(X: np.ndarray, weights: np.ndarray, bias: float) -> np.ndarray:
    """Predict class labels for input features."""
    probabilities = sigmoid(X @ weights + bias)
    return (probabilities >= 0.5).astype(int)


# Example usage
if __name__ == "__main__":
    np.random.seed(42)
    n = 100
    X = np.random.randn(n, 2)
    y = (X[:, 0] + X[:, 1] > 0).astype(float)

    weights, bias, losses = logistic_regression(X, y, learning_rate=0.5, epochs=200)
    predictions = predict(X, weights, bias)
    accuracy = np.mean(predictions == y)

    print(f"Weights: {weights.round(4)}")
    print(f"Bias: {bias:.4f}")
    print(f"Accuracy: {accuracy:.2%}")
    print(f"Final loss: {losses[-1]:.4f}")`,
    javascript: `function sigmoid(z) {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
}

function logisticRegression(X, y, learningRate = 0.1, epochs = 100) {
  /**
   * Train a logistic regression model using gradient descent.
   * @param {number[][]} X - Feature matrix (n x d)
   * @param {number[]} y - Binary labels
   * @param {number} learningRate - Step size
   * @param {number} epochs - Training iterations
   * @returns {{ weights: number[], bias: number, lossHistory: number[] }}
   */
  const n = X.length;
  const d = X[0].length;
  const weights = new Array(d).fill(0);
  let bias = 0;
  const lossHistory = [];

  for (let epoch = 0; epoch < epochs; epoch++) {
    // Forward pass
    const predictions = X.map((xi) => {
      const z = xi.reduce((sum, xij, j) => sum + xij * weights[j], 0) + bias;
      return sigmoid(z);
    });

    // Compute gradients
    const dw = new Array(d).fill(0);
    let db = 0;
    for (let i = 0; i < n; i++) {
      const error = predictions[i] - y[i];
      for (let j = 0; j < d; j++) dw[j] += error * X[i][j];
      db += error;
    }
    for (let j = 0; j < d; j++) dw[j] /= n;
    db /= n;

    // Compute loss
    const eps = 1e-15;
    let loss = 0;
    for (let i = 0; i < n; i++) {
      loss -= y[i] * Math.log(predictions[i] + eps)
            + (1 - y[i]) * Math.log(1 - predictions[i] + eps);
    }
    loss /= n;
    lossHistory.push(loss);

    // Update parameters
    for (let j = 0; j < d; j++) weights[j] -= learningRate * dw[j];
    bias -= learningRate * db;
  }

  return { weights, bias, lossHistory };
}

function predict(X, weights, bias) {
  return X.map((xi) => {
    const z = xi.reduce((sum, xij, j) => sum + xij * weights[j], 0) + bias;
    return sigmoid(z) >= 0.5 ? 1 : 0;
  });
}

// Example usage
const n = 100;
const X = Array.from({ length: n }, () => [
  (Math.random() - 0.5) * 4,
  (Math.random() - 0.5) * 4,
]);
const y = X.map(([x1, x2]) => (x1 + x2 > 0 ? 1 : 0));

const { weights, bias, lossHistory } = logisticRegression(X, y, 0.5, 200);
const predictions = predict(X, weights, bias);
const accuracy = predictions.filter((p, i) => p === y[i]).length / n;

console.log(\`Weights: [\${weights.map((w) => w.toFixed(4)).join(", ")}]\`);
console.log(\`Bias: \${bias.toFixed(4)}\`);
console.log(\`Accuracy: \${(accuracy * 100).toFixed(1)}%\`);
console.log(\`Final loss: \${lossHistory[lossHistory.length - 1].toFixed(4)}\`);`,
  },
  useCases: [
    "Email spam detection based on word frequencies, sender reputation, and email metadata",
    "Medical diagnosis predicting the probability of a disease given patient symptoms and test results",
    "Customer churn prediction to identify users likely to cancel a subscription or service",
    "Credit risk assessment determining the probability of loan default based on financial indicators",
  ],
  relatedAlgorithms: [
    "linear-regression",
    "polynomial-regression",
  ],
  glossaryTerms: [
    "classification",
    "sigmoid function",
    "gradient descent",
    "cross-entropy",
    "overfitting",
    "regularization",
    "decision boundary",
  ],
  tags: [
    "machine-learning",
    "classification",
    "supervised-learning",
    "binary-classification",
    "intermediate",
    "sigmoid",
    "gradient-descent",
  ],
};
