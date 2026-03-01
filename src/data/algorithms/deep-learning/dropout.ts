import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const dropout: AlgorithmMetadata = {
  id: "dropout",
  name: "Dropout",
  category: "deep-learning",
  subcategory: "Regularization",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(m)",
    average: "O(m)",
    worst: "O(m)",
    note: "Dropout adds O(m) cost per layer to generate a random mask for m neurons. This is negligible compared to the matrix multiplication cost.",
  },
  spaceComplexity: {
    best: "O(m)",
    average: "O(m)",
    worst: "O(m)",
    note: "A binary mask of size m must be stored for each layer during training for use in the backward pass.",
  },
  description: `Dropout is a regularization technique for neural networks that prevents overfitting by randomly deactivating (dropping) a fraction of neurons during each training iteration. Introduced by Srivastava, Hinton, Krizhevsky, Sutskever, and Salakhutdinov in 2014, dropout works by setting each neuron's output to zero with probability p (the dropout rate) during training. This forces the network to learn redundant representations, since any neuron could be removed at any time. The result is a more robust and generalizable model.

During training, each neuron is independently retained with probability (1-p) and dropped with probability p. When a neuron is dropped, both its forward activation and backward gradient become zero. This has several beneficial effects: it prevents co-adaptation between neurons (where one neuron relies too heavily on another specific neuron), it acts as an implicit ensemble method (each training step effectively trains a different sub-network), and it provides a form of noise injection that regularizes the learned features. Common dropout rates are 0.2-0.5 for hidden layers.

During inference (test time), dropout is turned off and all neurons are active. To compensate for the fact that more neurons are active than during training, the activations are scaled by (1-p), or equivalently, training activations are divided by (1-p) (called "inverted dropout"). This ensures that the expected output at test time matches the expected output during training. Dropout has become a standard component in deep learning architectures and is particularly effective in fully connected layers. It has been superseded in some architectures by batch normalization, but remains widely used in Transformers and other models.`,
  shortDescription:
    "A regularization technique that randomly deactivates neurons during training to prevent overfitting and improve generalization.",
  pseudocode: `procedure Dropout_Forward(a, p, is_training):
    // a: layer activations, p: dropout rate
    if is_training:
        // Generate random mask
        mask = random_bernoulli(shape=a.shape, prob=1-p)
        // Apply mask and scale (inverted dropout)
        a_dropped = a * mask / (1 - p)
        // Store mask for backward pass
        cache = mask
        return a_dropped, cache
    else:
        // No dropout at inference time
        return a, null
    end if
end procedure

procedure Dropout_Backward(grad, cache, p):
    mask = cache
    // Only pass gradients through active neurons
    return grad * mask / (1 - p)
end procedure`,
  implementations: {
    python: `import numpy as np

class Dropout:
    """Dropout regularization layer."""

    def __init__(self, rate: float = 0.5):
        self.rate = rate
        self.mask = None

    def forward(self, x: np.ndarray, training: bool = True) -> np.ndarray:
        """Apply dropout during training, identity during inference."""
        if training:
            # Generate binary mask: 1 with probability (1 - rate)
            self.mask = (np.random.rand(*x.shape) > self.rate).astype(float)
            # Inverted dropout: scale by 1/(1-p) during training
            return x * self.mask / (1 - self.rate)
        else:
            return x  # No dropout at test time

    def backward(self, grad: np.ndarray) -> np.ndarray:
        """Pass gradients only through active neurons."""
        return grad * self.mask / (1 - self.rate)


# Example: Dropout in a simple network
if __name__ == "__main__":
    np.random.seed(42)

    # Simulate a hidden layer output
    hidden = np.array([0.5, 1.2, -0.3, 0.8, 2.1, -0.1, 0.9, 1.5])
    print(f"Before dropout: {hidden}")

    dropout = Dropout(rate=0.3)

    # Training mode
    dropped = dropout.forward(hidden, training=True)
    print(f"After dropout (train): {dropped}")
    print(f"Mask: {dropout.mask}")

    # Inference mode
    output = dropout.forward(hidden, training=False)
    print(f"After dropout (inference): {output}")`,
    javascript: `class Dropout {
  constructor(rate = 0.5) {
    this.rate = rate;
    this.mask = [];
  }

  /** Apply dropout during training. */
  forward(x, training = true) {
    if (training) {
      this.mask = x.map(() => Math.random() > this.rate ? 1 : 0);
      return x.map((v, i) => v * this.mask[i] / (1 - this.rate));
    }
    return [...x]; // No dropout during inference
  }

  /** Backpropagate through dropout mask. */
  backward(grad) {
    return grad.map((g, i) => g * this.mask[i] / (1 - this.rate));
  }
}

// Example
const dropout = new Dropout(0.3);
const hidden = [0.5, 1.2, -0.3, 0.8, 2.1, -0.1, 0.9, 1.5];

console.log("Before:", hidden);
console.log("Train:", dropout.forward(hidden, true));
console.log("Mask:", dropout.mask);
console.log("Inference:", dropout.forward(hidden, false));`,
  },
  useCases: [
    "Preventing overfitting in large fully-connected layers of deep neural networks",
    "Improving generalization in Transformer attention layers and feed-forward sub-layers",
    "Acting as an implicit ensemble method where each training step trains a different sub-network",
    "Estimating model uncertainty via Monte Carlo dropout at inference time",
  ],
  relatedAlgorithms: [
    "mlp",
    "backpropagation",
    "regularization",
    "forward-pass",
    "vanishing-gradients",
  ],
  glossaryTerms: [
    "regularization",
    "overfitting",
    "dropout rate",
    "co-adaptation",
    "ensemble",
    "generalization",
    "inverted dropout",
  ],
  tags: [
    "deep-learning",
    "neural-network",
    "regularization",
    "dropout",
    "overfitting",
    "intermediate",
  ],
};
