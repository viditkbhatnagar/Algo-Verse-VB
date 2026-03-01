import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const mlp: AlgorithmMetadata = {
  id: "mlp",
  name: "Multi-Layer Perceptron",
  category: "deep-learning",
  subcategory: "Neural Network Fundamentals",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * L * m²)",
    average: "O(n * L * m²)",
    worst: "O(n * L * m²)",
    note: "For n samples, L layers, and m neurons per layer. Matrix multiplications dominate the cost of both forward and backward passes.",
  },
  spaceComplexity: {
    best: "O(L * m²)",
    average: "O(L * m²)",
    worst: "O(L * m²)",
    note: "Weights between each pair of adjacent layers form an m×m matrix. Activations must also be stored during training for backpropagation.",
  },
  description: `The Multi-Layer Perceptron (MLP) is the foundational feedforward neural network architecture, consisting of an input layer, one or more hidden layers, and an output layer. Each layer is fully connected to the next, meaning every neuron in one layer connects to every neuron in the subsequent layer through learnable weights. Unlike a single perceptron, an MLP can learn non-linear decision boundaries, making it a universal function approximator according to the Universal Approximation Theorem.

During the forward pass, input data flows through the network layer by layer. At each layer, the weighted sum of inputs is computed and passed through a non-linear activation function (such as ReLU, sigmoid, or tanh). The non-linearity is critical: without it, stacking multiple layers would still only produce a linear transformation, offering no advantage over a single-layer perceptron. The final layer typically uses sigmoid for binary classification, softmax for multi-class classification, or a linear activation for regression tasks.

Training an MLP involves computing a loss function that measures the difference between predicted and actual outputs, then using backpropagation to compute gradients of the loss with respect to each weight. These gradients are then used by an optimizer (such as SGD or Adam) to update the weights. MLPs form the backbone of deep learning and are used in countless applications including image recognition, natural language processing, recommendation systems, and scientific computing. Understanding MLPs is essential for studying more specialized architectures like CNNs, RNNs, and Transformers.`,
  shortDescription:
    "A feedforward neural network with one or more hidden layers that can learn non-linear decision boundaries through weighted connections and activation functions.",
  pseudocode: `procedure MLP_Forward(input, weights[], biases[]):
    activation = input
    for l = 1 to numLayers:
        z = weights[l] · activation + biases[l]
        activation = activationFunction(z)
    end for
    return activation
end procedure

procedure MLP_Train(X, y, learningRate, epochs):
    initialize all weights randomly
    initialize all biases to 0

    for epoch = 1 to epochs:
        for each (x, target) in (X, y):
            // Forward pass
            activations = [x]
            for each layer l:
                z = weights[l] · activations[-1] + biases[l]
                a = activationFunction(z)
                activations.append(a)
            end for

            // Compute loss
            loss = lossFunction(activations[-1], target)

            // Backward pass (backpropagation)
            delta = lossGradient(activations[-1], target)
            for l = numLayers down to 1:
                gradW = delta · activations[l-1]ᵀ
                gradB = delta
                weights[l] -= learningRate * gradW
                biases[l] -= learningRate * gradB
                delta = weights[l]ᵀ · delta * activationDerivative(z[l-1])
            end for
        end for
    end for
end procedure`,
  implementations: {
    python: `import numpy as np

class MLP:
    """Multi-Layer Perceptron with configurable hidden layers."""

    def __init__(self, layer_sizes: list, lr: float = 0.01):
        self.lr = lr
        self.weights = []
        self.biases = []
        for i in range(len(layer_sizes) - 1):
            w = np.random.randn(layer_sizes[i+1], layer_sizes[i]) * 0.5
            b = np.zeros((layer_sizes[i+1], 1))
            self.weights.append(w)
            self.biases.append(b)

    def relu(self, z):
        return np.maximum(0, z)

    def relu_deriv(self, z):
        return (z > 0).astype(float)

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

    def forward(self, x):
        """Forward pass through all layers."""
        self.activations = [x.reshape(-1, 1)]
        self.z_values = []
        for i in range(len(self.weights)):
            z = self.weights[i] @ self.activations[-1] + self.biases[i]
            self.z_values.append(z)
            if i < len(self.weights) - 1:
                a = self.relu(z)
            else:
                a = self.sigmoid(z)
            self.activations.append(a)
        return self.activations[-1]

    def backward(self, y):
        """Backpropagation to compute gradients and update weights."""
        y = y.reshape(-1, 1)
        m = 1
        delta = self.activations[-1] - y  # output error

        for i in reversed(range(len(self.weights))):
            dW = (1/m) * delta @ self.activations[i].T
            dB = (1/m) * delta
            self.weights[i] -= self.lr * dW
            self.biases[i] -= self.lr * dB
            if i > 0:
                delta = self.weights[i].T @ delta * self.relu_deriv(self.z_values[i-1])

    def train(self, X, y, epochs=100):
        for epoch in range(epochs):
            total_loss = 0
            for xi, yi in zip(X, y):
                output = self.forward(xi)
                loss = -yi * np.log(output + 1e-8) - (1-yi) * np.log(1-output + 1e-8)
                total_loss += loss.item()
                self.backward(yi)
            if (epoch + 1) % 20 == 0:
                print(f"Epoch {epoch+1}, Loss: {total_loss/len(X):.4f}")


# Example: XOR problem
if __name__ == "__main__":
    X = np.array([[0,0],[0,1],[1,0],[1,1]])
    y = np.array([0, 1, 1, 0])
    mlp = MLP([2, 4, 1], lr=0.5)
    mlp.train(X, y, epochs=1000)
    for xi in X:
        print(f"{xi} -> {mlp.forward(xi).item():.3f}")`,
    javascript: `class MLP {
  constructor(layerSizes, lr = 0.01) {
    this.lr = lr;
    this.weights = [];
    this.biases = [];
    for (let i = 0; i < layerSizes.length - 1; i++) {
      const rows = layerSizes[i + 1];
      const cols = layerSizes[i];
      this.weights.push(
        Array.from({ length: rows }, () =>
          Array.from({ length: cols }, () => (Math.random() - 0.5))
        )
      );
      this.biases.push(new Array(rows).fill(0));
    }
  }

  relu(z) { return z.map(v => Math.max(0, v)); }
  sigmoid(z) { return z.map(v => 1 / (1 + Math.exp(-v))); }

  /** Matrix-vector multiply. */
  matVec(mat, vec) {
    return mat.map(row =>
      row.reduce((sum, w, j) => sum + w * vec[j], 0)
    );
  }

  /** Forward pass through all layers. */
  forward(input) {
    this.activations = [input];
    let a = input;
    for (let i = 0; i < this.weights.length; i++) {
      const z = this.matVec(this.weights[i], a).map(
        (v, j) => v + this.biases[i][j]
      );
      a = i < this.weights.length - 1 ? this.relu(z) : this.sigmoid(z);
      this.activations.push(a);
    }
    return a;
  }

  /** Train on one sample (simplified). */
  trainStep(input, target) {
    const output = this.forward(input);
    const outputError = output.map((o, i) => o - target[i]);
    // Simplified gradient update for last layer
    for (let i = 0; i < this.weights[this.weights.length-1].length; i++) {
      for (let j = 0; j < this.weights[this.weights.length-1][i].length; j++) {
        this.weights[this.weights.length-1][i][j] -=
          this.lr * outputError[i] * this.activations[this.activations.length-2][j];
      }
      this.biases[this.biases.length-1][i] -= this.lr * outputError[i];
    }
  }
}

// Example
const mlp = new MLP([3, 4, 2], 0.01);
const output = mlp.forward([0.5, 0.3, 0.8]);
console.log("Output:", output);`,
  },
  useCases: [
    "Image classification by flattening pixel values and learning non-linear feature representations",
    "Tabular data prediction where feature interactions are complex and non-linear",
    "Natural language processing tasks when combined with word embeddings as input features",
    "Function approximation and regression for scientific computing and engineering applications",
  ],
  relatedAlgorithms: [
    "perceptron",
    "forward-pass",
    "backpropagation",
    "activation-functions",
    "dropout",
  ],
  glossaryTerms: [
    "feedforward network",
    "hidden layer",
    "activation function",
    "universal approximation theorem",
    "backpropagation",
    "weight matrix",
    "fully connected layer",
  ],
  tags: [
    "deep-learning",
    "neural-network",
    "feedforward",
    "supervised-learning",
    "universal-approximator",
    "intermediate",
  ],
};
