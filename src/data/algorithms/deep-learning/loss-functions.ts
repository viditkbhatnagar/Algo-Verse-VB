import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const lossFunctions: AlgorithmMetadata = {
  id: "loss-functions",
  name: "Loss Functions",
  category: "deep-learning",
  subcategory: "Neural Network Fundamentals",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Computing the loss requires iterating over n samples (or a mini-batch). Each sample's contribution is computed in O(1) or O(C) for C classes.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(C)",
    note: "MSE and binary cross-entropy use O(1) space. Multi-class cross-entropy requires O(C) for C class probabilities.",
  },
  description: `Loss functions (also called cost functions or objective functions) measure how well a neural network's predictions match the true target values. They are the quantitative signal that drives learning: the network's weights are adjusted to minimize the loss. Choosing the right loss function is one of the most important design decisions in deep learning, as it directly determines what the network optimizes for.

Mean Squared Error (MSE) is the standard loss for regression tasks. It computes the average squared difference between predictions and targets: L = (1/n) * sum((y_pred - y_true)^2). MSE penalizes large errors quadratically, making it sensitive to outliers. For classification, Binary Cross-Entropy (BCE) is used for two-class problems: L = -(y*log(p) + (1-y)*log(1-p)), where p is the predicted probability. Cross-Entropy generalizes to multi-class problems: L = -sum(y_c * log(p_c)). Cross-entropy has the attractive property that its gradient with respect to the output logits is simply (predicted - target), leading to efficient and stable optimization.

Other important loss functions include Hinge Loss (used in SVMs and max-margin classifiers), Huber Loss (a smooth combination of MSE and MAE that is robust to outliers), KL Divergence (measures how one probability distribution differs from another), and Focal Loss (addresses class imbalance by down-weighting easy examples). The gradient of the loss function with respect to the network output is the starting point of backpropagation, making loss functions the bridge between forward pass predictions and backward pass weight updates.`,
  shortDescription:
    "Functions that measure prediction error and drive neural network training. Common types include MSE for regression and Cross-Entropy for classification.",
  pseudocode: `// Mean Squared Error (MSE)
function MSE(y_pred, y_true):
    return (1/n) * sum((y_pred - y_true)²)

// Binary Cross-Entropy (BCE)
function BCE(y_pred, y_true):
    return -(1/n) * sum(
        y_true * log(y_pred) + (1 - y_true) * log(1 - y_pred)
    )

// Categorical Cross-Entropy
function CCE(y_pred, y_true):
    // y_true is one-hot encoded, y_pred is softmax output
    return -(1/n) * sum(
        sum(y_true[c] * log(y_pred[c]))  for each class c
    )

// Hinge Loss (for SVM-style classification)
function HingeLoss(y_pred, y_true):
    // y_true in {-1, +1}
    return (1/n) * sum(max(0, 1 - y_true * y_pred))`,
  implementations: {
    python: `import numpy as np

def mse_loss(y_pred, y_true):
    """Mean Squared Error for regression."""
    return np.mean((y_pred - y_true) ** 2)

def mse_gradient(y_pred, y_true):
    """Gradient of MSE w.r.t. predictions."""
    return 2 * (y_pred - y_true) / len(y_true)

def binary_cross_entropy(y_pred, y_true, eps=1e-8):
    """Binary Cross-Entropy for binary classification."""
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.mean(
        y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred)
    )

def bce_gradient(y_pred, y_true, eps=1e-8):
    """Gradient of BCE w.r.t. predictions."""
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -(y_true / y_pred - (1 - y_true) / (1 - y_pred)) / len(y_true)

def categorical_cross_entropy(y_pred, y_true, eps=1e-8):
    """Cross-Entropy for multi-class classification."""
    y_pred = np.clip(y_pred, eps, 1.0)
    return -np.mean(np.sum(y_true * np.log(y_pred), axis=1))

def hinge_loss(y_pred, y_true):
    """Hinge Loss for max-margin classification."""
    return np.mean(np.maximum(0, 1 - y_true * y_pred))


# Example
if __name__ == "__main__":
    y_true = np.array([1, 0, 1, 1])
    y_pred = np.array([0.9, 0.1, 0.8, 0.7])

    print(f"MSE: {mse_loss(y_pred, y_true):.4f}")
    print(f"BCE: {binary_cross_entropy(y_pred, y_true):.4f}")

    # Multi-class example
    y_true_mc = np.array([[1,0,0], [0,1,0], [0,0,1]])
    y_pred_mc = np.array([[0.7,0.2,0.1], [0.1,0.8,0.1], [0.2,0.3,0.5]])
    print(f"CCE: {categorical_cross_entropy(y_pred_mc, y_true_mc):.4f}")`,
    javascript: `function mseLoss(yPred, yTrue) {
  const n = yPred.length;
  return yPred.reduce((sum, p, i) => sum + (p - yTrue[i]) ** 2, 0) / n;
}

function binaryCrossEntropy(yPred, yTrue, eps = 1e-8) {
  const n = yPred.length;
  return -yPred.reduce((sum, p, i) => {
    p = Math.max(eps, Math.min(1 - eps, p));
    return sum + yTrue[i] * Math.log(p) + (1 - yTrue[i]) * Math.log(1 - p);
  }, 0) / n;
}

function hingeLoss(yPred, yTrue) {
  const n = yPred.length;
  return yPred.reduce(
    (sum, p, i) => sum + Math.max(0, 1 - yTrue[i] * p), 0
  ) / n;
}

function categoricalCrossEntropy(yPred, yTrue, eps = 1e-8) {
  let total = 0;
  for (let i = 0; i < yPred.length; i++) {
    for (let c = 0; c < yPred[i].length; c++) {
      total -= yTrue[i][c] * Math.log(Math.max(yPred[i][c], eps));
    }
  }
  return total / yPred.length;
}

// Example
const yTrue = [1, 0, 1, 1];
const yPred = [0.9, 0.1, 0.8, 0.7];
console.log("MSE:", mseLoss(yPred, yTrue).toFixed(4));
console.log("BCE:", binaryCrossEntropy(yPred, yTrue).toFixed(4));`,
  },
  useCases: [
    "MSE for regression tasks like house price prediction, temperature forecasting, and continuous value estimation",
    "Cross-Entropy for classification in image recognition, text categorization, and recommendation systems",
    "Hinge loss for support vector machines and max-margin classifiers in text classification",
    "Custom loss functions for specialized tasks like object detection (IoU loss) and image generation (perceptual loss)",
  ],
  relatedAlgorithms: [
    "backpropagation",
    "sgd-momentum",
    "adam-optimizer",
    "activation-functions",
    "forward-pass",
  ],
  glossaryTerms: [
    "loss function",
    "cost function",
    "mean squared error",
    "cross-entropy",
    "gradient",
    "optimization",
    "overfitting",
  ],
  tags: [
    "deep-learning",
    "neural-network",
    "loss",
    "optimization",
    "training",
    "intermediate",
  ],
};
