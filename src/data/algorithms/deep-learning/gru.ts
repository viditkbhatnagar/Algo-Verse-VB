import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const gru: AlgorithmMetadata = {
  id: "gru",
  name: "GRU",
  category: "deep-learning",
  subcategory: "Recurrent Neural Networks",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(T * n^2)",
    average: "O(T * n^2)",
    worst: "O(T * n^2)",
    note: "For sequence length T and hidden size n. GRU has 3 gate computations per step (vs 4 for LSTM), making it ~25% faster per step.",
  },
  spaceComplexity: {
    best: "O(T * n + 3n^2)",
    average: "O(T * n + 3n^2)",
    worst: "O(T * n + 3n^2)",
    note: "3 weight matrices (vs 4 for LSTM) and no separate cell state reduces memory usage.",
  },
  description: `The Gated Recurrent Unit (GRU) is a gated recurrent neural network architecture introduced by Cho et al. in 2014. It is designed to capture long-range dependencies in sequential data while being simpler and computationally cheaper than the LSTM. The GRU achieves this by using only two gates -- an update gate and a reset gate -- compared to LSTM's three gates and separate cell state.

The update gate z(t) = sigmoid(W_z * [h_{t-1}, x_t] + b_z) controls how much of the previous hidden state should be carried forward. It functions as a combined version of LSTM's forget and input gates. When z(t) is close to 1, the GRU mostly uses new information; when close to 0, it retains the previous hidden state. The reset gate r(t) = sigmoid(W_r * [h_{t-1}, x_t] + b_r) determines how much of the previous hidden state should be forgotten when computing the candidate activation. A candidate hidden state is computed as h_tilde(t) = tanh(W * [r(t) * h_{t-1}, x_t] + b), where the reset gate modulates the previous hidden state. The final hidden state is an interpolation: h(t) = (1 - z(t)) * h_{t-1} + z(t) * h_tilde(t).

The GRU's key advantage is simplicity: fewer parameters mean faster training and less risk of overfitting, especially on small datasets. The lack of a separate cell state means there are fewer tensors to manage. Empirically, GRUs often achieve performance comparable to LSTMs on many benchmarks, particularly for tasks with moderate sequence lengths. GRUs are popular in real-time applications, mobile deployments, and scenarios where computational budget is limited. However, for very long sequences or tasks that benefit from fine-grained memory control, LSTMs may have an edge due to their explicit cell state.`,
  shortDescription:
    "A simplified gated RNN with update and reset gates, offering LSTM-like performance with fewer parameters.",
  pseudocode: `procedure GRU_Forward(inputs, h_prev, W_z, W_r, W, b_z, b_r, b):
    for t = 0 to T - 1:
        combined = [h_prev, inputs[t]]

        // Update gate: controls how much to update
        z_t = sigmoid(W_z * combined + b_z)

        // Reset gate: controls how much past to forget
        r_t = sigmoid(W_r * combined + b_r)

        // Candidate hidden state
        h_tilde = tanh(W * [r_t * h_prev, inputs[t]] + b)

        // Interpolate between old and new
        h_t = (1 - z_t) * h_prev + z_t * h_tilde

        h_prev = h_t
    end for

    return h_t
end procedure`,
  implementations: {
    python: `import numpy as np

class GRUCell:
    """A single GRU cell."""

    def __init__(self, input_size: int, hidden_size: int):
        self.hidden_size = hidden_size
        n, m = hidden_size, input_size
        scale = 0.01

        # Weight matrices for update gate, reset gate, and candidate
        self.W_z = np.random.randn(n, m + n) * scale
        self.W_r = np.random.randn(n, m + n) * scale
        self.W = np.random.randn(n, m + n) * scale
        self.b_z = np.zeros((n, 1))
        self.b_r = np.zeros((n, 1))
        self.b = np.zeros((n, 1))

    def forward(self, x: np.ndarray, h_prev: np.ndarray) -> np.ndarray:
        x = x.reshape(-1, 1)
        combined = np.vstack([h_prev, x])

        # Gates
        z = self._sigmoid(self.W_z @ combined + self.b_z)  # update
        r = self._sigmoid(self.W_r @ combined + self.b_r)  # reset

        # Candidate
        reset_combined = np.vstack([r * h_prev, x])
        h_tilde = np.tanh(self.W @ reset_combined + self.b)

        # Output
        h = (1 - z) * h_prev + z * h_tilde
        return h

    @staticmethod
    def _sigmoid(x):
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

# Example
if __name__ == "__main__":
    cell = GRUCell(input_size=3, hidden_size=4)
    h = np.zeros((4, 1))

    for t in range(5):
        x = np.random.randn(3)
        h = cell.forward(x, h)
        print(f"t={t}: h norm = {np.linalg.norm(h):.4f}")`,
    javascript: `class GRUCell {
  constructor(inputSize, hiddenSize) {
    this.hiddenSize = hiddenSize;
    const n = hiddenSize, m = inputSize;
    this.W_z = randomMatrix(n, m + n, 0.01);
    this.W_r = randomMatrix(n, m + n, 0.01);
    this.W = randomMatrix(n, m + n, 0.01);
    this.b_z = Array(n).fill(0);
    this.b_r = Array(n).fill(0);
    this.b = Array(n).fill(0);
  }

  forward(x, hPrev) {
    const combined = [...hPrev, ...x];

    // Update gate
    const z = this.W_z.map((row, i) =>
      sigmoid(row.reduce((s, w, j) => s + w * combined[j], 0) + this.b_z[i])
    );

    // Reset gate
    const r = this.W_r.map((row, i) =>
      sigmoid(row.reduce((s, w, j) => s + w * combined[j], 0) + this.b_r[i])
    );

    // Candidate
    const resetCombined = [...hPrev.map((h, i) => r[i] * h), ...x];
    const hTilde = this.W.map((row, i) =>
      Math.tanh(row.reduce((s, w, j) => s + w * resetCombined[j], 0) + this.b[i])
    );

    // Interpolate
    return z.map((zv, i) => (1 - zv) * hPrev[i] + zv * hTilde[i]);
  }
}

function sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); }
function randomMatrix(rows, cols, scale) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.5) * scale * 2)
  );
}

// Example
const cell = new GRUCell(3, 4);
let h = Array(4).fill(0);
for (let t = 0; t < 5; t++) {
  const x = Array.from({ length: 3 }, () => Math.random() - 0.5);
  h = cell.forward(x, h);
  console.log(\`t=\${t}: h=[\${h.map(v => v.toFixed(4))}]\`);
}`,
  },
  useCases: [
    "Sentiment analysis on product reviews and social media posts with moderate-length text",
    "Music generation where the model predicts the next note conditioned on previous notes",
    "Real-time speech synthesis (text-to-speech) where low latency and fast inference are critical",
    "Anomaly detection in streaming time-series data from IoT sensors and financial transactions",
  ],
  relatedAlgorithms: [
    "vanilla-rnn",
    "lstm",
    "seq2seq",
  ],
  glossaryTerms: [
    "gru",
    "update gate",
    "reset gate",
    "hidden state",
    "gating mechanism",
    "vanishing gradient",
  ],
  tags: [
    "deep-learning",
    "rnn",
    "gru",
    "gated-rnn",
    "sequence-modeling",
    "advanced",
  ],
};
