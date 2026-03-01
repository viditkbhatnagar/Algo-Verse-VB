import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const vanishingGradients: AlgorithmMetadata = {
  id: "vanishing-gradients",
  name: "Vanishing Gradients",
  category: "deep-learning",
  subcategory: "Neural Network Fundamentals",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(L * m²)",
    average: "O(L * m²)",
    worst: "O(L * m²)",
    note: "Same as backpropagation. The vanishing gradient problem does not change computational cost, but it makes the computed gradients ineffective for learning.",
  },
  spaceComplexity: {
    best: "O(L * m)",
    average: "O(L * m)",
    worst: "O(L * m)",
    note: "Same as backpropagation. Gradient magnitudes shrink exponentially with depth, but the storage requirements remain unchanged.",
  },
  description: `The vanishing gradient problem is a fundamental challenge in training deep neural networks. During backpropagation, gradients are computed by multiplying chains of local derivatives as they flow backward through the layers. When these local derivatives are consistently less than 1 (as with sigmoid or tanh activation functions), the gradient magnitude decreases exponentially with each layer. By the time gradients reach the earliest layers, they become extremely small, effectively preventing those layers from learning.

Mathematically, the gradient at layer l is proportional to the product of activation derivatives across all subsequent layers: grad(l) is proportional to the product of f'(z_k) for k from l to L. Since sigmoid derivatives are at most 0.25 and tanh derivatives at most 1.0, this product shrinks rapidly. In a 10-layer network with sigmoid activations, the gradient at the first layer could be as small as 0.25^10 (about 10^-6) times the gradient at the output. This means early layers learn extremely slowly or not at all, while later layers learn normally.

Several solutions have been developed: (1) ReLU activation, whose derivative is 1 for positive inputs, enabling constant gradient flow; (2) residual connections (skip connections) that provide shortcut paths for gradient flow; (3) batch normalization that maintains activation magnitudes; (4) careful weight initialization (Xavier/He initialization) that preserves variance across layers; (5) LSTM and GRU architectures that use gates to selectively preserve gradients in recurrent networks. Understanding vanishing gradients is essential for diagnosing training failures in deep networks.`,
  shortDescription:
    "The problem where gradients become exponentially small in early layers of deep networks, preventing them from learning effectively during backpropagation.",
  pseudocode: `// Demonstrating why gradients vanish in deep networks

// Forward pass through L layers with sigmoid
for l = 1 to L:
    z[l] = W[l] · a[l-1] + b[l]
    a[l] = sigmoid(z[l])

// Backward pass: gradient at layer l
// grad[L] = dLoss/da[L]
// grad[l] = grad[l+1] * W[l+1]ᵀ * sigmoid'(z[l])

// Since sigmoid'(z) = sigmoid(z) * (1 - sigmoid(z)) <= 0.25
// Gradient magnitude at layer l:
// |grad[l]| ≈ |grad[L]| * (0.25 * ||W||)^(L-l)

// If ||W|| < 4, then 0.25 * ||W|| < 1
// Gradients VANISH exponentially!

// Solutions:
// 1. Use ReLU: derivative = 1 for positive inputs
// 2. Skip connections: grad flows directly
// 3. Batch normalization: prevents saturation
// 4. Proper initialization: Xavier or He`,
  implementations: {
    python: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

def sigmoid_derivative(z):
    s = sigmoid(z)
    return s * (1 - s)

def relu(z):
    return np.maximum(0, z)

def relu_derivative(z):
    return (z > 0).astype(float)

def demonstrate_vanishing_gradients(n_layers=10, activation="sigmoid"):
    """Show how gradients shrink through deep layers."""
    np.random.seed(42)
    layer_size = 5

    # Initialize weights and simulate forward pass
    weights = [np.random.randn(layer_size, layer_size) * 0.5 for _ in range(n_layers)]
    z_values = []
    a = np.ones(layer_size) * 0.5  # input

    for l in range(n_layers):
        z = weights[l] @ a
        z_values.append(z)
        if activation == "sigmoid":
            a = sigmoid(z)
        else:
            a = relu(z)

    # Backward pass: track gradient magnitudes
    grad = np.ones(layer_size)  # start with unit gradient
    gradient_norms = []

    for l in reversed(range(n_layers)):
        if activation == "sigmoid":
            grad = grad * sigmoid_derivative(z_values[l])
        else:
            grad = grad * relu_derivative(z_values[l])
        grad = weights[l].T @ grad
        gradient_norms.append(np.linalg.norm(grad))

    gradient_norms.reverse()

    print(f"\\nActivation: {activation}")
    print(f"{'Layer':<8} {'Gradient Norm':<20}")
    print("-" * 28)
    for i, norm in enumerate(gradient_norms):
        bar = "█" * min(50, int(norm * 10))
        print(f"{i+1:<8} {norm:<20.6f} {bar}")


if __name__ == "__main__":
    demonstrate_vanishing_gradients(10, "sigmoid")
    demonstrate_vanishing_gradients(10, "relu")`,
    javascript: `function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function sigmoidDerivative(z) {
  const s = sigmoid(z);
  return s * (1 - s);
}

function demonstrateVanishingGradients(nLayers = 10) {
  const layerSize = 5;

  // Simple forward pass simulation
  const zValues = [];
  let a = new Array(layerSize).fill(0.5);

  // Random weights (small magnitude to simulate typical init)
  const weights = Array.from({ length: nLayers }, () =>
    Array.from({ length: layerSize }, () =>
      Array.from({ length: layerSize }, () => (Math.random() - 0.5))
    )
  );

  for (let l = 0; l < nLayers; l++) {
    const z = weights[l].map(row =>
      row.reduce((sum, w, j) => sum + w * a[j], 0)
    );
    zValues.push(z);
    a = z.map(sigmoid);
  }

  // Backward pass: measure gradient magnitudes per layer
  let grad = new Array(layerSize).fill(1);
  const gradientNorms = [];

  for (let l = nLayers - 1; l >= 0; l--) {
    grad = grad.map((g, i) => g * sigmoidDerivative(zValues[l][i]));
    // Matrix-transpose multiply
    const newGrad = new Array(layerSize).fill(0);
    for (let j = 0; j < layerSize; j++) {
      for (let i = 0; i < layerSize; i++) {
        newGrad[j] += weights[l][i][j] * grad[i];
      }
    }
    grad = newGrad;
    const norm = Math.sqrt(grad.reduce((s, g) => s + g * g, 0));
    gradientNorms.unshift(norm);
  }

  console.log("Layer | Gradient Norm");
  gradientNorms.forEach((norm, i) =>
    console.log(\`  \${i + 1}   | \${norm.toExponential(4)}\`)
  );
}

demonstrateVanishingGradients(10);`,
  },
  useCases: [
    "Diagnosing training failures where early layers in deep networks fail to learn meaningful features",
    "Choosing activation functions: ReLU over sigmoid/tanh to maintain gradient flow",
    "Designing deep architectures with residual connections to enable training of 100+ layer networks",
    "Understanding why LSTMs outperform vanilla RNNs on long-sequence tasks",
  ],
  relatedAlgorithms: [
    "backpropagation",
    "activation-functions",
    "mlp",
    "dropout",
    "sgd-momentum",
  ],
  glossaryTerms: [
    "vanishing gradient",
    "exploding gradient",
    "chain rule",
    "sigmoid",
    "ReLU",
    "residual connection",
    "batch normalization",
  ],
  tags: [
    "deep-learning",
    "neural-network",
    "gradient",
    "training-problem",
    "backpropagation",
    "advanced",
  ],
};
