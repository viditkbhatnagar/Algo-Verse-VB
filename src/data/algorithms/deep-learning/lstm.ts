import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const lstm: AlgorithmMetadata = {
  id: "lstm",
  name: "LSTM",
  category: "deep-learning",
  subcategory: "Recurrent Neural Networks",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(T * n^2)",
    average: "O(T * n^2)",
    worst: "O(T * n^2)",
    note: "For sequence length T and hidden size n. Each gate requires its own matrix multiplication, so total per step is ~4x that of vanilla RNN (4 gate computations).",
  },
  spaceComplexity: {
    best: "O(T * n + 4n^2)",
    average: "O(T * n + 4n^2)",
    worst: "O(T * n + 4n^2)",
    note: "T*n for storing all hidden and cell states (for BPTT). 4n^2 for the four gate weight matrices.",
  },
  description: `Long Short-Term Memory (LSTM) is a recurrent neural network architecture designed to address the vanishing gradient problem that plagues vanilla RNNs. Introduced by Hochreiter and Schmidhuber in 1997, LSTM introduces a cell state that acts as a "conveyor belt" for information, allowing gradients to flow through many time steps without decaying. The cell state is regulated by three gating mechanisms: the forget gate, the input gate, and the output gate.

The forget gate (f_t = sigmoid(W_f * [h_{t-1}, x_t] + b_f)) decides what information to discard from the previous cell state. Values near 0 mean "forget this information" and values near 1 mean "keep it". The input gate (i_t = sigmoid(W_i * [h_{t-1}, x_t] + b_i)) decides what new information to store, while a candidate cell state (C_tilde = tanh(W_C * [h_{t-1}, x_t] + b_C)) proposes new values. The cell state is updated as: C_t = f_t * C_{t-1} + i_t * C_tilde. Finally, the output gate (o_t = sigmoid(W_o * [h_{t-1}, x_t] + b_o)) determines what parts of the cell state to expose as the hidden state: h_t = o_t * tanh(C_t).

The key insight is that the cell state update is additive (C_t = f_t * C_{t-1} + i_t * C_tilde) rather than multiplicative. This additive structure means gradients can flow through the cell state across many time steps without vanishing, as long as the forget gate values remain close to 1. LSTMs have been enormously successful in sequence-to-sequence translation, speech recognition, handwriting generation, music composition, and time series prediction. Despite the rise of Transformer-based models, LSTMs remain relevant for many time-series and streaming applications due to their O(1) memory per step during inference.`,
  shortDescription:
    "A gated RNN architecture with forget, input, and output gates that maintains a cell state to capture long-range dependencies.",
  pseudocode: `procedure LSTM_Forward(inputs, h_prev, c_prev, weights):
    for t = 0 to T - 1:
        // Concatenate previous hidden state and current input
        combined = [h_prev, inputs[t]]

        // Forget gate: what to discard from cell state
        f_t = sigmoid(W_f * combined + b_f)

        // Input gate: what new information to store
        i_t = sigmoid(W_i * combined + b_i)

        // Candidate cell state
        c_tilde = tanh(W_c * combined + b_c)

        // Update cell state (additive — key to solving vanishing gradients)
        c_t = f_t * c_prev + i_t * c_tilde

        // Output gate: what to output from cell state
        o_t = sigmoid(W_o * combined + b_o)

        // New hidden state
        h_t = o_t * tanh(c_t)

        h_prev = h_t
        c_prev = c_t
    end for

    return h_t, c_t
end procedure`,
  implementations: {
    python: `import numpy as np

class LSTMCell:
    """A single LSTM cell."""

    def __init__(self, input_size: int, hidden_size: int):
        self.hidden_size = hidden_size
        n = hidden_size
        m = input_size

        # Combined weight matrices for all 4 gates
        # [forget, input, candidate, output] stacked
        scale = 0.01
        self.W = np.random.randn(4 * n, m + n) * scale
        self.b = np.zeros((4 * n, 1))

    def forward(self, x: np.ndarray, h_prev: np.ndarray,
                c_prev: np.ndarray) -> tuple:
        n = self.hidden_size

        # Concatenate input and previous hidden state
        combined = np.vstack([h_prev, x.reshape(-1, 1)])

        # All gates in one matrix multiply
        gates = self.W @ combined + self.b

        # Split into 4 gate activations
        f = self._sigmoid(gates[:n])       # forget gate
        i = self._sigmoid(gates[n:2*n])    # input gate
        c_tilde = np.tanh(gates[2*n:3*n])  # candidate
        o = self._sigmoid(gates[3*n:])     # output gate

        # Cell state and hidden state updates
        c = f * c_prev + i * c_tilde
        h = o * np.tanh(c)

        return h, c, {"f": f, "i": i, "c_tilde": c_tilde, "o": o}

    @staticmethod
    def _sigmoid(x):
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

# Example
if __name__ == "__main__":
    cell = LSTMCell(input_size=3, hidden_size=4)
    h = np.zeros((4, 1))
    c = np.zeros((4, 1))

    for t in range(5):
        x = np.random.randn(3)
        h, c, gates = cell.forward(x, h, c)
        print(f"t={t}: |h|={np.linalg.norm(h):.4f}, |c|={np.linalg.norm(c):.4f}")`,
    javascript: `class LSTMCell {
  constructor(inputSize, hiddenSize) {
    this.hiddenSize = hiddenSize;
    const n = hiddenSize;
    const m = inputSize;
    // Combined weights for all 4 gates [f, i, c~, o]
    this.W = randomMatrix(4 * n, m + n, 0.01);
    this.b = new Array(4 * n).fill(0);
  }

  forward(x, hPrev, cPrev) {
    const n = this.hiddenSize;

    // Concatenate h_prev and x
    const combined = [...hPrev, ...x];

    // Matrix multiply for all gates at once
    const gates = this.W.map((row, i) =>
      row.reduce((sum, w, j) => sum + w * combined[j], 0) + this.b[i]
    );

    // Split and activate
    const f = gates.slice(0, n).map(sigmoid);       // forget
    const ig = gates.slice(n, 2*n).map(sigmoid);     // input
    const cTilde = gates.slice(2*n, 3*n).map(Math.tanh); // candidate
    const o = gates.slice(3*n).map(sigmoid);          // output

    // Update cell state and hidden state
    const c = f.map((fv, i) => fv * cPrev[i] + ig[i] * cTilde[i]);
    const h = o.map((ov, i) => ov * Math.tanh(c[i]));

    return { h, c, gates: { f, ig, cTilde, o } };
  }
}

function sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); }
function randomMatrix(rows, cols, scale) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.5) * scale * 2)
  );
}

// Example
const cell = new LSTMCell(3, 4);
let h = Array(4).fill(0);
let c = Array(4).fill(0);
for (let t = 0; t < 5; t++) {
  const x = Array.from({ length: 3 }, () => Math.random() - 0.5);
  const result = cell.forward(x, h, c);
  h = result.h;
  c = result.c;
  console.log(\`t=\${t}: h_norm=\${Math.sqrt(h.reduce((s,v)=>s+v*v,0)).toFixed(4)}\`);
}`,
  },
  useCases: [
    "Machine translation: encoding and decoding sentences across languages (seq2seq with attention)",
    "Speech recognition: processing audio spectrograms to produce text transcriptions",
    "Time series forecasting: predicting stock prices, weather, and energy demand using historical sequences",
    "Music generation: composing melodies note-by-note conditioned on previous musical context",
  ],
  relatedAlgorithms: [
    "vanilla-rnn",
    "gru",
    "seq2seq",
  ],
  glossaryTerms: [
    "lstm",
    "forget gate",
    "input gate",
    "output gate",
    "cell state",
    "hidden state",
    "vanishing gradient",
    "gating mechanism",
  ],
  tags: [
    "deep-learning",
    "rnn",
    "lstm",
    "gated-rnn",
    "sequence-modeling",
    "advanced",
  ],
};
