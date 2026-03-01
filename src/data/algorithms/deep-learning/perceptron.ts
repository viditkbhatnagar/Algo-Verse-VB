import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const perceptron: AlgorithmMetadata = {
  id: "perceptron",
  name: "Perceptron",
  category: "deep-learning",
  subcategory: "Neural Network Fundamentals",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n * epochs)",
    worst: "O(n * epochs)",
    note: "Each epoch iterates over all n training samples. Convergence is guaranteed only for linearly separable data.",
  },
  spaceComplexity: {
    best: "O(d)",
    average: "O(d)",
    worst: "O(d)",
    note: "Only the weight vector and bias are stored, where d is the number of input features.",
  },
  description: `The Perceptron is the simplest form of an artificial neural network, consisting of a single neuron that takes multiple inputs, multiplies each by a learnable weight, sums the weighted inputs with a bias term, and passes the result through an activation function (typically a step function) to produce a binary output. Invented by Frank Rosenblatt in 1958, it was one of the earliest models of biological neural computation and laid the groundwork for modern deep learning.

The Perceptron learning rule is straightforward: if the predicted output matches the true label, no update is made; otherwise, the weights are adjusted proportionally to the input values and the learning rate. This process is repeated over multiple epochs until the algorithm converges. The Perceptron Convergence Theorem guarantees that if the data is linearly separable, the algorithm will find a separating hyperplane in a finite number of steps. However, if the data is not linearly separable (e.g., the XOR problem), the Perceptron will never converge, a limitation famously highlighted by Minsky and Papert in 1969.

Despite its simplicity, the Perceptron is foundational. It introduced key concepts like weighted sums, activation functions, and gradient-based weight updates that underpin all modern neural networks. Understanding the Perceptron is essential before studying multi-layer perceptrons, backpropagation, and deep architectures. It also has practical applications as a fast linear classifier for high-dimensional data in text classification, spam filtering, and online learning scenarios.`,
  shortDescription:
    "The simplest neural network unit that computes a weighted sum of inputs plus bias, applies a step activation, and outputs a binary decision.",
  pseudocode: `procedure Perceptron(inputs, weights, bias):
    // Forward pass
    weightedSum = 0
    for i = 0 to len(inputs) - 1:
        weightedSum += inputs[i] * weights[i]
    end for
    weightedSum += bias

    // Activation (step function)
    if weightedSum >= 0:
        output = 1
    else:
        output = 0
    end if

    return output
end procedure

procedure Train(X, y, learningRate, epochs):
    initialize weights to small random values
    initialize bias to 0

    for epoch = 1 to epochs:
        for each (x, target) in (X, y):
            prediction = Perceptron(x, weights, bias)
            error = target - prediction
            for i = 0 to len(weights) - 1:
                weights[i] += learningRate * error * x[i]
            end for
            bias += learningRate * error
        end for
    end for
end procedure`,
  implementations: {
    python: `import numpy as np

class Perceptron:
    """Single-layer Perceptron classifier."""

    def __init__(self, learning_rate: float = 0.1, n_epochs: int = 100):
        self.lr = learning_rate
        self.n_epochs = n_epochs
        self.weights = None
        self.bias = 0.0

    def activation(self, z: float) -> int:
        """Step activation function."""
        return 1 if z >= 0 else 0

    def predict(self, x: np.ndarray) -> int:
        """Forward pass: weighted sum + activation."""
        z = np.dot(self.weights, x) + self.bias
        return self.activation(z)

    def fit(self, X: np.ndarray, y: np.ndarray):
        """Train perceptron using the perceptron learning rule."""
        n_features = X.shape[1]
        self.weights = np.zeros(n_features)
        self.bias = 0.0

        for epoch in range(self.n_epochs):
            errors = 0
            for xi, target in zip(X, y):
                prediction = self.predict(xi)
                error = target - prediction
                self.weights += self.lr * error * xi
                self.bias += self.lr * error
                errors += int(error != 0)
            if errors == 0:
                print(f"Converged at epoch {epoch + 1}")
                break


# Example: AND gate
if __name__ == "__main__":
    X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y = np.array([0, 0, 0, 1])

    p = Perceptron(learning_rate=0.1)
    p.fit(X, y)

    for xi in X:
        print(f"{xi} -> {p.predict(xi)}")`,
    javascript: `class Perceptron {
  constructor(learningRate = 0.1, nEpochs = 100) {
    this.lr = learningRate;
    this.nEpochs = nEpochs;
    this.weights = [];
    this.bias = 0;
  }

  /** Step activation function. */
  activation(z) {
    return z >= 0 ? 1 : 0;
  }

  /** Forward pass: weighted sum + activation. */
  predict(x) {
    const z = x.reduce((sum, xi, i) => sum + xi * this.weights[i], 0) + this.bias;
    return this.activation(z);
  }

  /** Train using the perceptron learning rule. */
  fit(X, y) {
    const nFeatures = X[0].length;
    this.weights = new Array(nFeatures).fill(0);
    this.bias = 0;

    for (let epoch = 0; epoch < this.nEpochs; epoch++) {
      let errors = 0;
      for (let i = 0; i < X.length; i++) {
        const prediction = this.predict(X[i]);
        const error = y[i] - prediction;
        for (let j = 0; j < nFeatures; j++) {
          this.weights[j] += this.lr * error * X[i][j];
        }
        this.bias += this.lr * error;
        if (error !== 0) errors++;
      }
      if (errors === 0) {
        console.log(\`Converged at epoch \${epoch + 1}\`);
        break;
      }
    }
  }
}

// Example: AND gate
const X = [[0,0],[0,1],[1,0],[1,1]];
const y = [0, 0, 0, 1];
const p = new Perceptron(0.1);
p.fit(X, y);
X.forEach(xi => console.log(\`[\${xi}] -> \${p.predict(xi)}\`));`,
  },
  useCases: [
    "Binary classification of linearly separable data such as spam vs. not-spam in simple feature spaces",
    "Online learning where the model updates incrementally as new data arrives one sample at a time",
    "Text classification using bag-of-words features where high-dimensional linear separability often holds",
    "Teaching fundamental neural network concepts as a building block for multi-layer architectures",
  ],
  relatedAlgorithms: [
    "mlp",
    "logistic-regression",
    "svm",
    "forward-pass",
    "backpropagation",
  ],
  glossaryTerms: [
    "activation function",
    "weight",
    "bias",
    "learning rate",
    "linear separability",
    "convergence",
    "epoch",
  ],
  tags: [
    "deep-learning",
    "neural-network",
    "classification",
    "supervised-learning",
    "linear-classifier",
    "beginner",
  ],
};
