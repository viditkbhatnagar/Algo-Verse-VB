import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const seq2seq: AlgorithmMetadata = {
  id: "seq2seq",
  name: "Seq2Seq",
  category: "deep-learning",
  subcategory: "Recurrent Neural Networks",
  difficulty: "advanced",
  timeComplexity: {
    best: "O((T_enc + T_dec) * n^2)",
    average: "O((T_enc + T_dec) * n^2)",
    worst: "O((T_enc + T_dec) * n^2)",
    note: "T_enc and T_dec are the source and target sequence lengths. Each step in encoder and decoder performs O(n^2) matrix operations.",
  },
  spaceComplexity: {
    best: "O((T_enc + T_dec) * n)",
    average: "O((T_enc + T_dec) * n)",
    worst: "O((T_enc + T_dec) * n)",
    note: "Hidden states for all encoder and decoder time steps must be stored. The context vector is O(n).",
  },
  description: `Sequence-to-Sequence (Seq2Seq) is a neural network architecture for transforming one sequence into another, where the input and output sequences can have different lengths. Introduced by Sutskever et al. (2014) and Cho et al. (2014), the Seq2Seq model consists of two main components: an encoder and a decoder, both typically implemented as RNNs (vanilla RNN, LSTM, or GRU).

The encoder processes the input sequence one token at a time, building up an internal representation in its hidden states. After processing all input tokens, the encoder's final hidden state -- called the context vector -- is a fixed-size representation that captures the meaning of the entire input sequence. This context vector is then used to initialize the decoder. The decoder generates the output sequence autoregressively: at each step, it takes the previously generated token (or the start-of-sequence token) and its current hidden state to produce the next output token, continuing until an end-of-sequence token is generated.

The fundamental limitation of the basic Seq2Seq model is the information bottleneck: the entire input sequence must be compressed into a single fixed-size context vector. For long sequences, this leads to information loss, particularly for tokens far from the end of the input. The attention mechanism (Bahdanau et al., 2015) addresses this by allowing the decoder to attend to all encoder hidden states at each decoding step, computing a weighted sum of encoder states as a dynamic context vector. This was a crucial stepping stone toward the Transformer architecture (Vaswani et al., 2017), which replaced RNNs entirely with self-attention and became the foundation for modern models like BERT, GPT, and T5.`,
  shortDescription:
    "An encoder-decoder architecture that maps an input sequence to an output sequence through a learned context vector.",
  pseudocode: `procedure Seq2Seq(sourceSequence, targetSequence):
    // ENCODER
    h_enc = zeros(hiddenSize)

    for t = 0 to len(sourceSequence) - 1:
        h_enc = EncoderRNN(sourceSequence[t], h_enc)
    end for

    contextVector = h_enc  // final encoder hidden state

    // DECODER
    h_dec = contextVector   // initialize decoder with context
    input_token = <SOS>     // start-of-sequence token
    output = []

    for t = 0 to maxOutputLen - 1:
        h_dec = DecoderRNN(input_token, h_dec)
        logits = OutputLayer(h_dec)
        predicted_token = argmax(softmax(logits))
        output.append(predicted_token)

        if predicted_token == <EOS>:
            break

        input_token = predicted_token  // teacher forcing uses targetSequence[t]
    end for

    return output
end procedure`,
  implementations: {
    python: `import numpy as np

class SimpleEncoder:
    """Simple RNN-based encoder."""
    def __init__(self, input_size, hidden_size):
        scale = 0.01
        self.W_xh = np.random.randn(hidden_size, input_size) * scale
        self.W_hh = np.random.randn(hidden_size, hidden_size) * scale
        self.b_h = np.zeros((hidden_size, 1))

    def forward(self, sequence):
        """Encode entire input sequence, return final hidden state."""
        h = np.zeros((self.W_hh.shape[0], 1))
        for x in sequence:
            x = x.reshape(-1, 1)
            h = np.tanh(self.W_xh @ x + self.W_hh @ h + self.b_h)
        return h  # context vector

class SimpleDecoder:
    """Simple RNN-based decoder with output projection."""
    def __init__(self, input_size, hidden_size, output_size):
        scale = 0.01
        self.W_xh = np.random.randn(hidden_size, input_size) * scale
        self.W_hh = np.random.randn(hidden_size, hidden_size) * scale
        self.W_hy = np.random.randn(output_size, hidden_size) * scale
        self.b_h = np.zeros((hidden_size, 1))
        self.b_y = np.zeros((output_size, 1))

    def step(self, x, h):
        """One decoder step: returns output logits and new hidden state."""
        x = x.reshape(-1, 1)
        h = np.tanh(self.W_xh @ x + self.W_hh @ h + self.b_h)
        y = self.W_hy @ h + self.b_y
        return y, h

# Example
if __name__ == "__main__":
    enc = SimpleEncoder(input_size=4, hidden_size=8)
    dec = SimpleDecoder(input_size=4, hidden_size=8, output_size=4)

    # Encode source sequence
    source = [np.random.randn(4) for _ in range(3)]
    context = enc.forward(source)
    print(f"Context vector norm: {np.linalg.norm(context):.4f}")

    # Decode target sequence
    h = context
    x = np.zeros(4)  # start token
    for t in range(3):
        y, h = dec.step(x, h)
        token = np.argmax(y)
        print(f"Decoder t={t}: predicted token index = {token}")
        x = np.zeros(4)
        x[token] = 1  # one-hot for next input`,
    javascript: `class Encoder {
  constructor(inputSize, hiddenSize) {
    this.W_xh = randomMatrix(hiddenSize, inputSize, 0.01);
    this.W_hh = randomMatrix(hiddenSize, hiddenSize, 0.01);
    this.b = Array(hiddenSize).fill(0);
    this.hiddenSize = hiddenSize;
  }

  forward(sequence) {
    let h = Array(this.hiddenSize).fill(0);
    for (const x of sequence) {
      const xh = matMul(this.W_xh, x);
      const hh = matMul(this.W_hh, h);
      h = xh.map((v, i) => Math.tanh(v + hh[i] + this.b[i]));
    }
    return h; // context vector
  }
}

class Decoder {
  constructor(inputSize, hiddenSize, outputSize) {
    this.W_xh = randomMatrix(hiddenSize, inputSize, 0.01);
    this.W_hh = randomMatrix(hiddenSize, hiddenSize, 0.01);
    this.W_hy = randomMatrix(outputSize, hiddenSize, 0.01);
    this.b_h = Array(hiddenSize).fill(0);
    this.b_y = Array(outputSize).fill(0);
  }

  step(x, h) {
    const xh = matMul(this.W_xh, x);
    const hh = matMul(this.W_hh, h);
    const newH = xh.map((v, i) => Math.tanh(v + hh[i] + this.b_h[i]));
    const y = matMul(this.W_hy, newH).map((v, i) => v + this.b_y[i]);
    return { y, h: newH };
  }
}

function randomMatrix(rows, cols, scale) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.5) * scale * 2)
  );
}
function matMul(matrix, vec) {
  return matrix.map(row => row.reduce((s, w, j) => s + w * vec[j], 0));
}

// Example
const enc = new Encoder(4, 8);
const dec = new Decoder(4, 8, 4);
const source = Array.from({ length: 3 }, () =>
  Array.from({ length: 4 }, () => Math.random())
);
const context = enc.forward(source);
let h = context;
let x = Array(4).fill(0);
for (let t = 0; t < 3; t++) {
  const result = dec.step(x, h);
  h = result.h;
  const token = result.y.indexOf(Math.max(...result.y));
  console.log(\`t=\${t}: token=\${token}\`);
  x = Array(4).fill(0);
  x[token] = 1;
}`,
  },
  useCases: [
    "Machine translation: converting sentences from one language to another (e.g., English to French)",
    "Text summarization: condensing long documents into shorter summaries",
    "Conversational AI: generating responses in dialogue systems and chatbots",
    "Code generation: translating natural language descriptions into source code",
  ],
  relatedAlgorithms: [
    "vanilla-rnn",
    "lstm",
    "gru",
  ],
  glossaryTerms: [
    "encoder",
    "decoder",
    "context vector",
    "teacher forcing",
    "attention mechanism",
    "autoregressive",
    "sequence-to-sequence",
  ],
  tags: [
    "deep-learning",
    "rnn",
    "seq2seq",
    "encoder-decoder",
    "machine-translation",
    "advanced",
  ],
};
