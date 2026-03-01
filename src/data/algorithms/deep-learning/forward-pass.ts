import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const forwardPass: AlgorithmMetadata = {
  id: "forward-pass",
  name: "Forward Pass",
  category: "deep-learning",
  subcategory: "Neural Network Fundamentals",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(L * m²)",
    average: "O(L * m²)",
    worst: "O(L * m²)",
    note: "For L layers with m neurons each, each layer requires a matrix-vector multiplication of size m×m.",
  },
  spaceComplexity: {
    best: "O(L * m)",
    average: "O(L * m)",
    worst: "O(L * m)",
    note: "Intermediate activations for all L layers must be stored, each containing m neuron values.",
  },
  description: `The forward pass (also called forward propagation) is the process by which input data flows through a neural network from the input layer to the output layer, producing a prediction. At each layer, the input vector is multiplied by the weight matrix, a bias vector is added, and the result is passed through a non-linear activation function. This sequence of linear transformations followed by non-linear activations is what gives neural networks their power to model complex functions.

During the forward pass, each layer transforms its input into a new representation. The first hidden layer might learn to detect simple features, the second might combine these into more complex patterns, and deeper layers capture increasingly abstract representations. For example, in image recognition, early layers detect edges, middle layers detect shapes, and later layers detect objects. The final layer produces the network's prediction, which could be a probability distribution over classes (for classification) or a continuous value (for regression).

Understanding the forward pass is essential because it is the first half of the training loop. After the forward pass produces a prediction, the loss function measures how far the prediction is from the true target. Then backpropagation computes gradients by traversing the network in reverse. Without a clear understanding of how data flows forward, it is impossible to understand how gradients flow backward. The forward pass is also used during inference (making predictions on new data), which is typically much faster than training since no gradient computation is needed.`,
  shortDescription:
    "The process of propagating input data through a neural network layer by layer to produce an output prediction.",
  pseudocode: `procedure ForwardPass(input, network):
    a = input  // activation of current layer

    for each layer l in network:
        // Linear transformation
        z = W[l] · a + b[l]

        // Non-linear activation
        a = activation(z)

        // Store for backpropagation
        cache[l] = (a, z)
    end for

    return a  // final output / prediction
end procedure

// For each layer:
// z = W · a_prev + b     (pre-activation)
// a = g(z)               (post-activation)
// where g is the activation function`,
  implementations: {
    python: `import numpy as np

def forward_pass(X, weights, biases, activations):
    """
    Perform a forward pass through a neural network.

    Args:
        X: Input data (n_features,)
        weights: List of weight matrices for each layer
        biases: List of bias vectors for each layer
        activations: List of activation function names

    Returns:
        output: Network prediction
        cache: Intermediate values for backpropagation
    """
    a = X.reshape(-1, 1)
    cache = [{"a": a}]

    for l in range(len(weights)):
        # Linear transformation: z = W · a + b
        z = weights[l] @ a + biases[l]

        # Apply activation function
        if activations[l] == "relu":
            a = np.maximum(0, z)
        elif activations[l] == "sigmoid":
            a = 1 / (1 + np.exp(-z))
        elif activations[l] == "tanh":
            a = np.tanh(z)
        else:
            a = z  # linear

        cache.append({"z": z, "a": a})

    return a, cache


# Example: 3-layer network
if __name__ == "__main__":
    np.random.seed(42)

    # Input
    X = np.array([0.5, 0.8, 0.3])

    # Layer 1: 3 -> 4 (ReLU)
    W1 = np.random.randn(4, 3) * 0.5
    b1 = np.zeros((4, 1))

    # Layer 2: 4 -> 2 (Sigmoid)
    W2 = np.random.randn(2, 4) * 0.5
    b2 = np.zeros((2, 1))

    output, cache = forward_pass(
        X, [W1, W2], [b1, b2], ["relu", "sigmoid"]
    )
    print(f"Input: {X}")
    print(f"Output: {output.flatten()}")`,
    javascript: `function forwardPass(input, weights, biases, activations) {
  /**
   * Perform a forward pass through a neural network.
   * @param {number[]} input - Input vector
   * @param {number[][][]} weights - Weight matrices per layer
   * @param {number[][]} biases - Bias vectors per layer
   * @param {string[]} activations - Activation names per layer
   * @returns {{ output: number[], cache: object[] }}
   */
  let a = input;
  const cache = [{ a: [...a] }];

  for (let l = 0; l < weights.length; l++) {
    // Linear: z = W * a + b
    const z = weights[l].map((row, i) =>
      row.reduce((sum, w, j) => sum + w * a[j], 0) + biases[l][i]
    );

    // Activation
    if (activations[l] === "relu") {
      a = z.map(v => Math.max(0, v));
    } else if (activations[l] === "sigmoid") {
      a = z.map(v => 1 / (1 + Math.exp(-v)));
    } else if (activations[l] === "tanh") {
      a = z.map(v => Math.tanh(v));
    } else {
      a = [...z];
    }

    cache.push({ z: [...z], a: [...a] });
  }

  return { output: a, cache };
}

// Example
const W1 = [[0.1, -0.2, 0.3], [0.4, 0.5, -0.1],
             [-0.3, 0.2, 0.4], [0.1, -0.4, 0.2]];
const b1 = [0, 0, 0, 0];
const W2 = [[0.2, -0.1, 0.3, 0.4], [-0.2, 0.3, 0.1, -0.1]];
const b2 = [0, 0];

const { output } = forwardPass(
  [0.5, 0.8, 0.3], [W1, W2], [b1, b2], ["relu", "sigmoid"]
);
console.log("Output:", output);`,
  },
  useCases: [
    "Making predictions with a trained neural network during inference time",
    "Computing intermediate representations for feature extraction and transfer learning",
    "Evaluating model performance by comparing forward pass outputs with ground truth labels",
    "Real-time applications like image classification, speech recognition, and recommendation where low-latency prediction is critical",
  ],
  relatedAlgorithms: [
    "backpropagation",
    "mlp",
    "activation-functions",
    "perceptron",
    "loss-functions",
  ],
  glossaryTerms: [
    "forward propagation",
    "activation function",
    "weight matrix",
    "bias",
    "inference",
    "pre-activation",
    "post-activation",
  ],
  tags: [
    "deep-learning",
    "neural-network",
    "forward-propagation",
    "inference",
    "beginner",
  ],
};
