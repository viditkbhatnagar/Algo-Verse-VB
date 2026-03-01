import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const sgd: AlgorithmMetadata = {
  id: "sgd",
  name: "Stochastic Gradient Descent",
  category: "machine-learning",
  subcategory: "Optimization",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(d)",
    average: "O(T * d)",
    worst: "O(T * d)",
    note: "Each iteration processes a single sample (or very small batch) with d features, costing O(d) per update. T is the number of iterations. SGD typically requires more iterations than batch GD but each iteration is much cheaper. For convex problems, SGD achieves O(1/sqrt(T)) convergence rate for general convex functions and O(1/T) for strongly convex functions.",
  },
  spaceComplexity: {
    best: "O(d)",
    average: "O(d)",
    worst: "O(d)",
    note: "SGD only needs to store the current parameter vector and gradient, both of size d. Unlike batch gradient descent, it does not need to load the entire dataset into memory at once — it processes one sample at a time, making it extremely memory-efficient.",
  },
  description: `Stochastic Gradient Descent (SGD) is a variant of gradient descent that computes the gradient using a single randomly selected training example (or a very small batch) rather than the entire dataset. This introduces noise into the gradient estimate but dramatically reduces the computational cost per iteration. The stochastic nature of the updates means the optimization path is erratic and noisy, oscillating around the true gradient direction, but this property can actually be beneficial: the noise helps the optimizer escape shallow local minima and saddle points that would trap standard gradient descent.

The algorithm randomly shuffles the training data at each epoch and processes samples one at a time. For each sample, it computes the gradient of the loss with respect to the current parameters and immediately updates the parameters. Because the gradient from a single sample is a noisy estimate of the true gradient (computed over the entire dataset), the updates are highly variable. However, in expectation, the stochastic gradient points in the same direction as the true gradient. Over many iterations, this is sufficient to converge to a good solution. The learning rate is often decayed over time (learning rate scheduling) to reduce oscillation near the optimum.

SGD is the workhorse optimizer for training deep neural networks and large-scale machine learning models. Its low per-iteration cost makes it practical for datasets with millions or billions of examples where computing the full gradient is infeasible. SGD also enables online learning, where the model is updated as new data arrives without reprocessing historical data. Modern variants like SGD with momentum, Nesterov accelerated gradient, and adaptive methods (Adam, AdaGrad, RMSProp) all build upon the SGD framework by adding mechanisms to stabilize and accelerate convergence.`,
  shortDescription:
    "Updates parameters using the gradient computed from a single random sample, trading accuracy for speed and enabling large-scale training.",
  pseudocode: `procedure SGD(data, grad_loss, theta_init, lr, epochs):
    // data: list of training samples (x_i, y_i)
    // grad_loss: gradient of loss for a single sample
    // theta_init: initial parameters
    // lr: learning rate
    // epochs: number of passes through the data

    theta = theta_init

    for epoch = 1 to epochs do
        shuffle(data)

        for each sample (x_i, y_i) in data do
            // Compute gradient on single sample
            g = grad_loss(theta, x_i, y_i)

            // Update parameters
            theta = theta - lr * g
        end for

        // Optional: decay learning rate
        lr = lr * decay_factor
    end for

    return theta
end procedure`,
  implementations: {
    python: `import numpy as np

def sgd(
    X: np.ndarray,
    y: np.ndarray,
    lr: float = 0.01,
    epochs: int = 100,
    seed: int = 42
):
    """
    Train a simple linear model using Stochastic Gradient Descent.

    Parameters:
        X: n x d feature matrix
        y: n-length target vector
        lr: learning rate
        epochs: number of epochs
        seed: random seed for reproducibility

    Returns:
        weights: learned parameter vector
        history: list of loss values per epoch
    """
    rng = np.random.RandomState(seed)
    n, d = X.shape
    weights = rng.randn(d) * 0.01
    bias = 0.0
    history = []

    for epoch in range(epochs):
        # Shuffle data
        indices = rng.permutation(n)
        epoch_loss = 0.0

        for idx in indices:
            xi, yi = X[idx], y[idx]

            # Forward pass (linear model)
            pred = np.dot(xi, weights) + bias
            error = pred - yi

            # Compute gradient for this single sample
            grad_w = xi * error
            grad_b = error

            # Update parameters
            weights -= lr * grad_w
            bias -= lr * grad_b

            epoch_loss += error ** 2

        epoch_loss /= n
        history.append(epoch_loss)

    return weights, bias, history


# Example usage
if __name__ == "__main__":
    np.random.seed(42)
    X = np.random.randn(200, 3)
    true_w = np.array([2.0, -1.0, 0.5])
    y = X @ true_w + 3.0 + np.random.randn(200) * 0.5

    weights, bias, history = sgd(X, y, lr=0.01, epochs=50)
    print(f"Learned weights: {weights}")
    print(f"Learned bias: {bias:.4f}")
    print(f"Final loss: {history[-1]:.6f}")`,
    javascript: `function sgd(X, y, lr = 0.01, epochs = 100, seed = 42) {
  /**
   * Train a linear model using Stochastic Gradient Descent.
   * @param {number[][]} X - n x d feature matrix
   * @param {number[]} y - target vector
   * @param {number} lr - learning rate
   * @param {number} epochs - number of epochs
   * @param {number} seed - random seed
   * @returns {{ weights: number[], bias: number, history: number[] }}
   */
  const n = X.length;
  const d = X[0].length;

  // Simple seeded RNG
  let s = seed;
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

  // Initialize weights
  const weights = Array.from({ length: d }, () => (rng() - 0.5) * 0.02);
  let bias = 0;
  const history = [];

  for (let epoch = 0; epoch < epochs; epoch++) {
    // Shuffle indices
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let epochLoss = 0;

    for (const idx of indices) {
      const xi = X[idx];
      const yi = y[idx];

      // Forward pass
      let pred = bias;
      for (let j = 0; j < d; j++) pred += xi[j] * weights[j];
      const error = pred - yi;

      // Update weights and bias
      for (let j = 0; j < d; j++) {
        weights[j] -= lr * xi[j] * error;
      }
      bias -= lr * error;

      epochLoss += error * error;
    }

    history.push(epochLoss / n);
  }

  return { weights, bias, history };
}

// Example usage
const n = 100;
const X = Array.from({ length: n }, () =>
  [Math.random() * 2 - 1, Math.random() * 2 - 1]
);
const trueW = [3.0, -2.0];
const y = X.map(xi => trueW[0] * xi[0] + trueW[1] * xi[1] + 1 + (Math.random() - 0.5) * 0.3);

const { weights, bias, history } = sgd(X, y, 0.05, 50);
console.log("Learned weights:", weights.map(w => w.toFixed(4)));
console.log("Learned bias:", bias.toFixed(4));
console.log("Final loss:", history[history.length - 1].toFixed(6));`,
  },
  useCases: [
    "Training deep neural networks on massive image datasets (ImageNet, COCO) where batch gradient descent is infeasible",
    "Online learning systems that update recommendations in real-time as users interact with a platform",
    "Natural language processing models processing billions of text tokens where each sample provides a gradient signal",
    "Large-scale ad click prediction models that must learn from streaming data with low latency",
  ],
  relatedAlgorithms: [
    "gradient-descent",
    "mini-batch-gd",
    "linear-regression",
    "logistic-regression",
  ],
  glossaryTerms: [
    "stochastic gradient descent",
    "learning rate",
    "epoch",
    "convergence",
    "momentum",
    "learning rate schedule",
    "online learning",
  ],
  tags: [
    "machine-learning",
    "optimization",
    "stochastic",
    "gradient",
    "intermediate",
    "deep-learning",
    "scalable",
  ],
};
