import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const miniBatchGd: AlgorithmMetadata = {
  id: "mini-batch-gd",
  name: "Mini-batch Gradient Descent",
  category: "machine-learning",
  subcategory: "Optimization",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(B * d)",
    average: "O(T * B * d)",
    worst: "O(T * B * d)",
    note: "Each iteration processes a mini-batch of B samples with d features, costing O(B*d). T is the number of iterations (total_samples * epochs / B). Mini-batch GD achieves a favorable trade-off: it converges faster than SGD (lower variance) while being much cheaper per iteration than full-batch GD. Typical batch sizes range from 32 to 512.",
  },
  spaceComplexity: {
    best: "O(B * d)",
    average: "O(B * d + d)",
    worst: "O(B * d + d)",
    note: "Requires O(B*d) space to store the current mini-batch and O(d) for the parameter vector and accumulated gradient. This is significantly less than full-batch GD's O(n*d) but more than SGD's O(d). The batch fits comfortably in GPU memory, enabling efficient parallel computation.",
  },
  description: `Mini-batch Gradient Descent is the practical compromise between full-batch Gradient Descent and Stochastic Gradient Descent (SGD). Instead of computing the gradient over the entire dataset (batch GD) or a single sample (SGD), it computes the gradient using a random subset of B training examples called a mini-batch. This approach inherits the advantages of both extremes: the gradient estimate is more stable than SGD's single-sample estimate (lower variance), while each iteration is much faster than processing the full dataset. The batch size B is a key hyperparameter that controls this trade-off.

The algorithm works by randomly partitioning the training data into mini-batches of size B at each epoch. For each mini-batch, it computes the average gradient of the loss across the B samples and updates the parameters accordingly. The gradient noise from using a subset rather than the full dataset is inversely proportional to the square root of the batch size: smaller batches have more noise, larger batches are smoother. This moderate level of noise is often beneficial — it provides enough regularization to generalize well without the extreme oscillation of pure SGD. Modern hardware (GPUs) is optimized for parallel matrix operations on mini-batches, making this approach highly efficient in practice.

Mini-batch Gradient Descent is the de facto standard for training modern machine learning models, especially deep neural networks. Common batch sizes are powers of 2 (32, 64, 128, 256) to align with GPU memory architectures. The choice of batch size affects not just convergence speed but also generalization: research has shown that smaller batch sizes often lead to solutions that generalize better to unseen data, a phenomenon related to the implicit regularization of gradient noise. Combined with learning rate scheduling, momentum, and adaptive methods like Adam, mini-batch GD forms the backbone of virtually all modern deep learning training pipelines.`,
  shortDescription:
    "Computes gradients on random subsets (mini-batches) of the training data, balancing the stability of batch GD with the efficiency of SGD.",
  pseudocode: `procedure MiniBatchGD(data, grad_loss, theta_init, lr, batch_size, epochs):
    // data: training dataset of n samples
    // grad_loss: gradient of loss function
    // theta_init: initial parameters
    // lr: learning rate
    // batch_size: number of samples per mini-batch
    // epochs: number of passes through data

    theta = theta_init

    for epoch = 1 to epochs do
        shuffle(data)

        // Split data into mini-batches
        batches = partition(data, batch_size)

        for each batch in batches do
            // Compute gradient averaged over mini-batch
            g = 0
            for each (x_i, y_i) in batch do
                g = g + grad_loss(theta, x_i, y_i)
            end for
            g = g / batch_size

            // Update parameters
            theta = theta - lr * g
        end for
    end for

    return theta
end procedure`,
  implementations: {
    python: `import numpy as np

def mini_batch_gd(
    X: np.ndarray,
    y: np.ndarray,
    batch_size: int = 32,
    lr: float = 0.01,
    epochs: int = 100,
    seed: int = 42
):
    """
    Train a linear model using Mini-batch Gradient Descent.

    Parameters:
        X: n x d feature matrix
        y: n-length target vector
        batch_size: number of samples per mini-batch
        lr: learning rate
        epochs: number of training epochs
        seed: random seed

    Returns:
        weights, bias, loss_history
    """
    rng = np.random.RandomState(seed)
    n, d = X.shape
    weights = rng.randn(d) * 0.01
    bias = 0.0
    history = []

    for epoch in range(epochs):
        # Shuffle data
        indices = rng.permutation(n)
        X_shuffled = X[indices]
        y_shuffled = y[indices]

        epoch_loss = 0.0
        num_batches = 0

        # Process mini-batches
        for start in range(0, n, batch_size):
            end = min(start + batch_size, n)
            X_batch = X_shuffled[start:end]
            y_batch = y_shuffled[start:end]
            b = len(X_batch)

            # Forward pass
            predictions = X_batch @ weights + bias
            errors = predictions - y_batch

            # Compute gradients (averaged over batch)
            grad_w = (X_batch.T @ errors) / b
            grad_b = np.mean(errors)

            # Update parameters
            weights -= lr * grad_w
            bias -= lr * grad_b

            epoch_loss += np.sum(errors ** 2)
            num_batches += 1

        history.append(epoch_loss / n)

    return weights, bias, history


# Example usage
if __name__ == "__main__":
    np.random.seed(42)
    X = np.random.randn(500, 4)
    true_w = np.array([1.5, -2.0, 0.5, 3.0])
    y = X @ true_w + 2.0 + np.random.randn(500) * 0.3

    for bs in [4, 16, 32, 128]:
        w, b, hist = mini_batch_gd(X, y, batch_size=bs, lr=0.01, epochs=30)
        print(f"Batch size {bs:>3d}: final loss = {hist[-1]:.6f}")`,
    javascript: `function miniBatchGD(X, y, batchSize = 32, lr = 0.01, epochs = 100, seed = 42) {
  /**
   * Train a linear model using Mini-batch Gradient Descent.
   * @param {number[][]} X - n x d feature matrix
   * @param {number[]} y - target vector
   * @param {number} batchSize - samples per mini-batch
   * @param {number} lr - learning rate
   * @param {number} epochs - training epochs
   * @param {number} seed - random seed
   * @returns {{ weights: number[], bias: number, history: number[] }}
   */
  const n = X.length;
  const d = X[0].length;

  // Seeded RNG
  let s = seed;
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

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

    // Process mini-batches
    for (let start = 0; start < n; start += batchSize) {
      const end = Math.min(start + batchSize, n);
      const bSize = end - start;

      // Accumulate gradients over batch
      const gradW = Array(d).fill(0);
      let gradB = 0;

      for (let k = start; k < end; k++) {
        const idx = indices[k];
        let pred = bias;
        for (let j = 0; j < d; j++) pred += X[idx][j] * weights[j];
        const error = pred - y[idx];

        for (let j = 0; j < d; j++) gradW[j] += X[idx][j] * error;
        gradB += error;
        epochLoss += error * error;
      }

      // Average and update
      for (let j = 0; j < d; j++) {
        weights[j] -= lr * gradW[j] / bSize;
      }
      bias -= lr * gradB / bSize;
    }

    history.push(epochLoss / n);
  }

  return { weights, bias, history };
}

// Example: compare different batch sizes
const n = 200;
const X = Array.from({ length: n }, () =>
  [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]
);
const trueW = [2.0, -1.5, 1.0];
const y = X.map(xi =>
  trueW.reduce((s, w, j) => s + w * xi[j], 0) + 1.0 + (Math.random() - 0.5) * 0.2
);

for (const bs of [4, 16, 32]) {
  const { weights, bias, history } = miniBatchGD(X, y, bs, 0.05, 30);
  console.log(\`Batch \${bs}: loss=\${history[history.length - 1].toFixed(6)}\`);
}`,
  },
  useCases: [
    "Training convolutional neural networks on GPU hardware where batch sizes of 32-256 maximize parallel throughput",
    "Distributed training of large language models across multiple GPUs, with each device processing a subset of the mini-batch",
    "Transfer learning and fine-tuning pretrained models where smaller batch sizes help adapt to limited target-domain data",
    "Training generative adversarial networks (GANs) where batch statistics influence the stability of adversarial training",
  ],
  relatedAlgorithms: [
    "gradient-descent",
    "sgd",
    "linear-regression",
    "logistic-regression",
  ],
  glossaryTerms: [
    "mini-batch",
    "batch size",
    "learning rate",
    "epoch",
    "gradient noise",
    "convergence rate",
    "generalization",
  ],
  tags: [
    "machine-learning",
    "optimization",
    "mini-batch",
    "gradient",
    "intermediate",
    "deep-learning",
    "practical",
  ],
};
