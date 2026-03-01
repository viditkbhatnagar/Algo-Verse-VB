import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const activationFunctions: AlgorithmMetadata = {
  id: "activation-functions",
  name: "Activation Functions",
  category: "deep-learning",
  subcategory: "Neural Network Fundamentals",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Each activation function is applied element-wise in O(1) per neuron. For a layer of m neurons, total cost is O(m).",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Activation functions operate in-place or require only a constant amount of additional memory per neuron.",
  },
  description: `Activation functions are non-linear mathematical functions applied to the output of each neuron in a neural network. They are the critical ingredient that enables neural networks to learn complex, non-linear mappings. Without activation functions (or with only linear activations), a multi-layer neural network would collapse into a single linear transformation, unable to model even simple non-linear relationships like XOR.

The most commonly used activation functions include ReLU (Rectified Linear Unit), sigmoid, tanh, and softmax. ReLU (f(x) = max(0, x)) is the default choice for hidden layers due to its simplicity, computational efficiency, and resistance to the vanishing gradient problem. However, ReLU can suffer from the "dying ReLU" problem where neurons output zero for all inputs. Variants like Leaky ReLU and ELU address this. Sigmoid (f(x) = 1/(1+e^(-x))) squashes values to [0,1] and is used for binary classification output layers. Tanh squashes to [-1,1] and is zero-centered, making optimization easier. Softmax normalizes a vector into a probability distribution, essential for multi-class classification.

Choosing the right activation function significantly impacts training dynamics. Sigmoid and tanh suffer from vanishing gradients in deep networks because their derivatives are small for large inputs. ReLU avoids this but can produce dead neurons. Modern architectures often use GELU (used in Transformers) or Swish (used in EfficientNet). Understanding activation functions is fundamental to designing effective neural networks and diagnosing training issues.`,
  shortDescription:
    "Non-linear functions applied to neuron outputs that enable neural networks to learn complex patterns. Key types include ReLU, sigmoid, tanh, and softmax.",
  pseudocode: `// ReLU (Rectified Linear Unit)
function ReLU(x):
    return max(0, x)

function ReLU_derivative(x):
    return 1 if x > 0 else 0

// Sigmoid
function sigmoid(x):
    return 1 / (1 + exp(-x))

function sigmoid_derivative(x):
    s = sigmoid(x)
    return s * (1 - s)

// Tanh
function tanh(x):
    return (exp(x) - exp(-x)) / (exp(x) + exp(-x))

function tanh_derivative(x):
    return 1 - tanh(x)²

// Softmax (for vector input)
function softmax(z):
    expZ = exp(z - max(z))  // numerical stability
    return expZ / sum(expZ)`,
  implementations: {
    python: `import numpy as np

def relu(x):
    """ReLU: max(0, x)"""
    return np.maximum(0, x)

def relu_derivative(x):
    return (x > 0).astype(float)

def sigmoid(x):
    """Sigmoid: 1 / (1 + e^(-x))"""
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def sigmoid_derivative(x):
    s = sigmoid(x)
    return s * (1 - s)

def tanh_activation(x):
    """Tanh: (e^x - e^(-x)) / (e^x + e^(-x))"""
    return np.tanh(x)

def tanh_derivative(x):
    return 1 - np.tanh(x) ** 2

def softmax(z):
    """Softmax: converts logits to probabilities."""
    exp_z = np.exp(z - np.max(z))
    return exp_z / np.sum(exp_z)

def leaky_relu(x, alpha=0.01):
    """Leaky ReLU: allows small gradient for negative values."""
    return np.where(x > 0, x, alpha * x)


# Demonstrate each function
if __name__ == "__main__":
    x = np.linspace(-5, 5, 100)

    print("ReLU(2.0):", relu(2.0))
    print("Sigmoid(0.0):", sigmoid(0.0))
    print("Tanh(1.0):", tanh_activation(1.0))

    logits = np.array([2.0, 1.0, 0.5])
    print("Softmax([2,1,0.5]):", softmax(logits))`,
    javascript: `function relu(x) {
  return Math.max(0, x);
}

function reluDerivative(x) {
  return x > 0 ? 1 : 0;
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x) {
  const s = sigmoid(x);
  return s * (1 - s);
}

function tanh(x) {
  return Math.tanh(x);
}

function tanhDerivative(x) {
  return 1 - Math.tanh(x) ** 2;
}

function softmax(z) {
  const maxZ = Math.max(...z);
  const expZ = z.map(v => Math.exp(v - maxZ));
  const sumExp = expZ.reduce((a, b) => a + b, 0);
  return expZ.map(v => v / sumExp);
}

function leakyRelu(x, alpha = 0.01) {
  return x > 0 ? x : alpha * x;
}

// Examples
console.log("ReLU(2.0):", relu(2.0));
console.log("ReLU(-1.0):", relu(-1.0));
console.log("Sigmoid(0):", sigmoid(0));
console.log("Tanh(1):", tanh(1));
console.log("Softmax:", softmax([2.0, 1.0, 0.5]));`,
  },
  useCases: [
    "ReLU in hidden layers of deep convolutional and feedforward networks for efficient gradient flow",
    "Sigmoid in binary classification output layers to produce probability estimates between 0 and 1",
    "Softmax in multi-class classification output layers to generate normalized probability distributions",
    "Tanh in recurrent neural networks where zero-centered activations improve gradient flow",
  ],
  relatedAlgorithms: [
    "perceptron",
    "mlp",
    "forward-pass",
    "vanishing-gradients",
    "backpropagation",
  ],
  glossaryTerms: [
    "activation function",
    "ReLU",
    "sigmoid",
    "softmax",
    "vanishing gradient",
    "non-linearity",
    "dead neuron",
  ],
  tags: [
    "deep-learning",
    "neural-network",
    "activation",
    "non-linearity",
    "ReLU",
    "sigmoid",
    "beginner",
  ],
};
