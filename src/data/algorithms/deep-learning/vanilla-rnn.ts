import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const vanillaRnn: AlgorithmMetadata = {
  id: "vanilla-rnn",
  name: "Vanilla RNN",
  category: "deep-learning",
  subcategory: "Recurrent Neural Networks",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(T * n^2)",
    average: "O(T * n^2)",
    worst: "O(T * n^2)",
    note: "For sequence length T and hidden size n. At each time step, the matrix multiplications W_xh*x(t) and W_hh*h(t-1) each cost O(n^2).",
  },
  spaceComplexity: {
    best: "O(T * n)",
    average: "O(T * n)",
    worst: "O(T * n)",
    note: "Must store all T hidden states for backpropagation through time (BPTT). Parameter count is O(n^2) for weight matrices.",
  },
  description: `A Vanilla Recurrent Neural Network (RNN) is the simplest form of recurrent neural network. It processes sequential data by maintaining a hidden state vector that is updated at each time step based on the current input and the previous hidden state. The key recurrence relation is: h(t) = tanh(W_xh * x(t) + W_hh * h(t-1) + b_h), where W_xh is the input-to-hidden weight matrix, W_hh is the hidden-to-hidden (recurrent) weight matrix, and b_h is a bias term. The tanh activation function squashes values to the range [-1, 1].

The hidden state h(t) acts as the network's "memory" -- it encodes information about all previous inputs x(0), x(1), ..., x(t). This makes RNNs naturally suited for sequential tasks where context matters: language modeling, speech recognition, time series forecasting, and music generation. The same weight matrices W_xh and W_hh are shared across all time steps, which means the RNN can process sequences of arbitrary length with a fixed number of parameters.

However, vanilla RNNs have a critical limitation: the vanishing gradient problem. During backpropagation through time (BPTT), gradients must flow backward through many time steps. At each step, the gradient is multiplied by W_hh. If the largest eigenvalue of W_hh is less than 1, gradients shrink exponentially, making it nearly impossible to learn long-range dependencies. Conversely, if the eigenvalue exceeds 1, gradients can explode. This limitation motivated the development of LSTM (Long Short-Term Memory) and GRU (Gated Recurrent Unit) architectures, which use gating mechanisms to control information flow and maintain gradients over longer sequences.`,
  shortDescription:
    "A recurrent network that maintains a hidden state updated at each time step, enabling sequential data processing.",
  pseudocode: `procedure VanillaRNN_Forward(inputs, h_init, W_xh, W_hh, W_hy, b_h, b_y):
    h = h_init                 // initial hidden state (often zeros)
    outputs = []
    hidden_states = []

    for t = 0 to T - 1:
        // Compute new hidden state
        h = tanh(W_xh * inputs[t] + W_hh * h + b_h)
        hidden_states.append(h)

        // Compute output (optional, at each step or only final)
        y_t = W_hy * h + b_y
        outputs.append(y_t)
    end for

    return outputs, hidden_states
end procedure

// Backpropagation Through Time (BPTT):
// Unroll the RNN for T steps and apply standard backprop
// Gradients flow backward through the chain of hidden states`,
  implementations: {
    python: `import numpy as np

class VanillaRNN:
    """Simple Vanilla RNN implementation."""

    def __init__(self, input_size: int, hidden_size: int, output_size: int):
        scale = 0.01
        self.W_xh = np.random.randn(hidden_size, input_size) * scale
        self.W_hh = np.random.randn(hidden_size, hidden_size) * scale
        self.W_hy = np.random.randn(output_size, hidden_size) * scale
        self.b_h = np.zeros((hidden_size, 1))
        self.b_y = np.zeros((output_size, 1))

    def forward(self, inputs: list[np.ndarray]) -> tuple:
        """Forward pass through the sequence."""
        T = len(inputs)
        hidden_size = self.W_hh.shape[0]
        h = np.zeros((hidden_size, 1))  # initial hidden state

        hidden_states = []
        outputs = []

        for t in range(T):
            x_t = inputs[t].reshape(-1, 1)  # column vector
            h = np.tanh(self.W_xh @ x_t + self.W_hh @ h + self.b_h)
            y_t = self.W_hy @ h + self.b_y
            hidden_states.append(h)
            outputs.append(y_t)

        return outputs, hidden_states

# Example
if __name__ == "__main__":
    rnn = VanillaRNN(input_size=3, hidden_size=5, output_size=2)
    sequence = [np.random.randn(3) for _ in range(4)]
    outputs, states = rnn.forward(sequence)
    print(f"Sequence length: {len(sequence)}")
    for t, (out, h) in enumerate(zip(outputs, states)):
        print(f"t={t}: output shape={out.shape}, hidden norm={np.linalg.norm(h):.3f}")`,
    javascript: `class VanillaRNN {
  constructor(inputSize, hiddenSize, outputSize) {
    this.hiddenSize = hiddenSize;
    // Initialize weight matrices (simplified)
    this.W_xh = randomMatrix(hiddenSize, inputSize, 0.01);
    this.W_hh = randomMatrix(hiddenSize, hiddenSize, 0.01);
    this.W_hy = randomMatrix(outputSize, hiddenSize, 0.01);
    this.b_h = new Array(hiddenSize).fill(0);
    this.b_y = new Array(outputSize).fill(0);
  }

  forward(inputs) {
    let h = new Array(this.hiddenSize).fill(0);
    const hiddenStates = [];
    const outputs = [];

    for (const x of inputs) {
      // h = tanh(W_xh * x + W_hh * h + b_h)
      const xh = matVecMul(this.W_xh, x);
      const hh = matVecMul(this.W_hh, h);
      h = xh.map((v, i) => Math.tanh(v + hh[i] + this.b_h[i]));

      // y = W_hy * h + b_y
      const y = matVecMul(this.W_hy, h).map((v, i) => v + this.b_y[i]);

      hiddenStates.push([...h]);
      outputs.push(y);
    }

    return { outputs, hiddenStates };
  }
}

function randomMatrix(rows, cols, scale) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.5) * scale * 2)
  );
}

function matVecMul(matrix, vec) {
  return matrix.map(row => row.reduce((sum, w, i) => sum + w * vec[i], 0));
}

// Example
const rnn = new VanillaRNN(3, 5, 2);
const sequence = Array.from({ length: 4 }, () =>
  Array.from({ length: 3 }, () => Math.random())
);
const { outputs } = rnn.forward(sequence);
outputs.forEach((o, t) => console.log(\`t=\${t}: output=[\${o.map(v => v.toFixed(4))}]\`));`,
  },
  useCases: [
    "Character-level language modeling where the network predicts the next character given a sequence",
    "Simple time series forecasting for short-range dependencies like stock price trends",
    "Part-of-speech tagging where each word in a sentence needs a label based on context",
    "Teaching and understanding the foundations of recurrent architectures before moving to LSTM/GRU",
  ],
  relatedAlgorithms: [
    "lstm",
    "gru",
    "seq2seq",
    "cnn-architecture",
  ],
  glossaryTerms: [
    "recurrent neural network",
    "hidden state",
    "vanishing gradient",
    "backpropagation through time",
    "tanh",
    "sequence modeling",
  ],
  tags: [
    "deep-learning",
    "rnn",
    "sequence-modeling",
    "recurrent",
    "intermediate",
  ],
};
