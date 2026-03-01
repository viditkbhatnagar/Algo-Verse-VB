import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const backpropagation: AlgorithmMetadata = {
  id: "backpropagation",
  name: "Backpropagation",
  category: "deep-learning",
  subcategory: "Neural Network Fundamentals",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n * L * m²)",
    average: "O(n * L * m²)",
    worst: "O(n * L * m²)",
    note: "Same order as the forward pass. For each of n samples, gradients are computed through L layers with m neurons each, requiring matrix operations.",
  },
  spaceComplexity: {
    best: "O(L * m²)",
    average: "O(L * m²)",
    worst: "O(L * m²)",
    note: "All intermediate activations and pre-activations from the forward pass must be stored to compute gradients during the backward pass.",
  },
  description: `Backpropagation (backward propagation of errors) is the core algorithm for training neural networks. It efficiently computes the gradient of the loss function with respect to every weight in the network by applying the chain rule of calculus in reverse, flowing from the output layer back to the input layer. Discovered independently by several researchers and popularized by Rumelhart, Hinton, and Williams in 1986, backpropagation made training multi-layer networks practical and sparked the modern deep learning revolution.

The algorithm works in two phases. First, a forward pass computes predictions and caches intermediate values (pre-activations and activations) at every layer. Then, the backward pass starts at the output layer by computing the gradient of the loss with respect to the output. This gradient is then propagated backward through each layer using the chain rule: the gradient at layer l depends on the gradient at layer l+1 multiplied by the derivative of the activation function and the weight matrix. At each layer, the algorithm computes gradients for both the weights and biases, which are then used to update the parameters.

The mathematical elegance of backpropagation lies in its computational efficiency. Computing all gradients requires only about twice the cost of a forward pass, regardless of the number of parameters. This is because the chain rule decomposes the global gradient into a product of local gradients, each of which is cheap to compute. However, backpropagation is not without challenges: vanishing gradients (in deep networks with sigmoid activations), exploding gradients, and the need for careful initialization and learning rate selection are all active areas of research. Modern frameworks like PyTorch and TensorFlow implement automatic differentiation, which generalizes backpropagation to arbitrary computational graphs.`,
  shortDescription:
    "The algorithm that computes gradients of the loss with respect to every weight by propagating errors backward through the network using the chain rule.",
  pseudocode: `procedure Backpropagation(network, x, y_true, learningRate):
    // 1. Forward pass
    a[0] = x
    for l = 1 to L:
        z[l] = W[l] · a[l-1] + b[l]
        a[l] = activation(z[l])
    end for

    // 2. Compute output loss
    loss = lossFunction(a[L], y_true)

    // 3. Backward pass (compute gradients)
    δ[L] = ∂loss/∂a[L] * activation'(z[L])

    for l = L down to 1:
        ∂loss/∂W[l] = δ[l] · a[l-1]ᵀ
        ∂loss/∂b[l] = δ[l]
        if l > 1:
            δ[l-1] = W[l]ᵀ · δ[l] * activation'(z[l-1])
        end if
    end for

    // 4. Update weights
    for l = 1 to L:
        W[l] -= learningRate * ∂loss/∂W[l]
        b[l] -= learningRate * ∂loss/∂b[l]
    end for

    return loss
end procedure`,
  implementations: {
    python: `import numpy as np

class NeuralNetwork:
    """Simple neural network with backpropagation."""

    def __init__(self, layers, lr=0.01):
        self.lr = lr
        self.W = []
        self.b = []
        for i in range(len(layers) - 1):
            self.W.append(np.random.randn(layers[i+1], layers[i]) * np.sqrt(2/layers[i]))
            self.b.append(np.zeros((layers[i+1], 1)))

    def relu(self, z):
        return np.maximum(0, z)

    def relu_deriv(self, z):
        return (z > 0).astype(float)

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

    def forward(self, x):
        """Forward pass, caching activations for backprop."""
        self.a = [x.reshape(-1, 1)]
        self.z = []
        for i in range(len(self.W)):
            z = self.W[i] @ self.a[-1] + self.b[i]
            self.z.append(z)
            a = self.relu(z) if i < len(self.W) - 1 else self.sigmoid(z)
            self.a.append(a)
        return self.a[-1]

    def backward(self, y_true):
        """Backward pass: compute gradients and update weights."""
        y = y_true.reshape(-1, 1)
        L = len(self.W)

        # Output layer gradient
        delta = self.a[L] - y  # dLoss/da * da/dz for BCE + sigmoid

        for l in reversed(range(L)):
            # Compute weight and bias gradients
            dW = delta @ self.a[l].T
            db = delta

            # Update parameters
            self.W[l] -= self.lr * dW
            self.b[l] -= self.lr * db

            # Propagate gradient to previous layer
            if l > 0:
                delta = (self.W[l].T @ delta) * self.relu_deriv(self.z[l-1])

    def train_step(self, x, y):
        output = self.forward(x)
        loss = -y * np.log(output + 1e-8) - (1-y) * np.log(1-output + 1e-8)
        self.backward(y)
        return loss.item()


# Example: XOR
if __name__ == "__main__":
    nn = NeuralNetwork([2, 4, 1], lr=0.5)
    X = np.array([[0,0],[0,1],[1,0],[1,1]])
    y = np.array([0, 1, 1, 0])

    for epoch in range(1000):
        total_loss = sum(nn.train_step(xi, yi) for xi, yi in zip(X, y))
        if (epoch + 1) % 200 == 0:
            print(f"Epoch {epoch+1}, Loss: {total_loss/4:.4f}")

    for xi in X:
        print(f"{xi} -> {nn.forward(xi).item():.3f}")`,
    javascript: `class NeuralNetwork {
  constructor(layers, lr = 0.01) {
    this.lr = lr;
    this.W = [];
    this.b = [];
    for (let i = 0; i < layers.length - 1; i++) {
      this.W.push(
        Array.from({ length: layers[i+1] }, () =>
          Array.from({ length: layers[i] }, () => (Math.random() - 0.5) * Math.sqrt(2/layers[i]))
        )
      );
      this.b.push(new Array(layers[i+1]).fill(0));
    }
  }

  relu(z) { return z.map(v => Math.max(0, v)); }
  reluDeriv(z) { return z.map(v => v > 0 ? 1 : 0); }
  sigmoid(z) { return z.map(v => 1 / (1 + Math.exp(-v))); }

  matVec(mat, vec) {
    return mat.map(row => row.reduce((s, w, j) => s + w * vec[j], 0));
  }

  forward(x) {
    this.a = [x];
    this.z = [];
    let a = x;
    for (let i = 0; i < this.W.length; i++) {
      const z = this.matVec(this.W[i], a).map((v, j) => v + this.b[i][j]);
      this.z.push(z);
      a = i < this.W.length - 1 ? this.relu(z) : this.sigmoid(z);
      this.a.push(a);
    }
    return a;
  }

  backward(yTrue) {
    const L = this.W.length;
    let delta = this.a[L].map((a, i) => a - yTrue[i]);

    for (let l = L - 1; l >= 0; l--) {
      // Update weights and biases
      for (let i = 0; i < this.W[l].length; i++) {
        for (let j = 0; j < this.W[l][i].length; j++) {
          this.W[l][i][j] -= this.lr * delta[i] * this.a[l][j];
        }
        this.b[l][i] -= this.lr * delta[i];
      }

      // Propagate to previous layer
      if (l > 0) {
        const newDelta = new Array(this.W[l][0].length).fill(0);
        for (let j = 0; j < newDelta.length; j++) {
          for (let i = 0; i < delta.length; i++) {
            newDelta[j] += this.W[l][i][j] * delta[i];
          }
          newDelta[j] *= this.z[l-1][j] > 0 ? 1 : 0; // ReLU derivative
        }
        delta = newDelta;
      }
    }
  }
}

// Example
const nn = new NeuralNetwork([2, 4, 1], 0.5);
console.log("Output:", nn.forward([1, 0]));`,
  },
  useCases: [
    "Training all feedforward neural networks by computing exact gradients for weight updates",
    "Deep learning frameworks like PyTorch and TensorFlow use automatic differentiation based on backpropagation",
    "Fine-tuning pre-trained models where only certain layers are updated via backpropagation",
    "Computing saliency maps and attention visualization by backpropagating to the input layer",
  ],
  relatedAlgorithms: [
    "forward-pass",
    "sgd-momentum",
    "adam-optimizer",
    "vanishing-gradients",
    "mlp",
  ],
  glossaryTerms: [
    "chain rule",
    "gradient",
    "loss function",
    "learning rate",
    "vanishing gradient",
    "automatic differentiation",
    "weight update",
  ],
  tags: [
    "deep-learning",
    "neural-network",
    "gradient-computation",
    "training",
    "chain-rule",
    "advanced",
  ],
};
