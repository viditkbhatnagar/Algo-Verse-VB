import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const transformerBlock: AlgorithmMetadata = {
  id: "transformer-block",
  name: "Transformer Block",
  category: "deep-learning",
  subcategory: "Transformer Architecture",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n^2 * d + n * d^2)",
    average: "O(n^2 * d + n * d^2)",
    worst: "O(n^2 * d + n * d^2)",
    note: "O(n^2 * d) from multi-head attention (pairwise attention over n tokens) and O(n * d^2) from the feed-forward network (two linear layers with hidden dimension 4d).",
  },
  spaceComplexity: {
    best: "O(n^2 + n * d)",
    average: "O(n^2 + n * d)",
    worst: "O(n^2 + n * d)",
    note: "The attention matrix is n x n, plus intermediate activations of size n x d. Parameters: ~12 * d^2 per block (4 attention matrices + 2 FFN matrices + norms).",
  },
  description: `A Transformer Block is the fundamental repeating unit of the Transformer architecture. Each block consists of two main sub-layers: a Multi-Head Attention (MHA) mechanism and a position-wise Feed-Forward Network (FFN). Both sub-layers employ residual connections and layer normalization to enable stable training of deep networks.

The data flow through a block follows this pattern: Input -> LayerNorm -> Multi-Head Attention -> Add (residual) -> LayerNorm -> FFN -> Add (residual) -> Output. The MHA sub-layer allows each token to gather information from all other tokens in the sequence, while the FFN sub-layer processes each token independently through a two-layer neural network with a wider hidden dimension (typically 4x the model dimension), adding non-linear transformation capacity.

Modern Transformers stack many such blocks: BERT-base uses 12, GPT-2 uses 48, GPT-3 uses 96, and LLaMA-70B uses 80 blocks. The Pre-LN variant (applying LayerNorm before each sub-layer) has become standard in modern architectures as it provides more stable training dynamics. Each block contributes approximately 12*d_model^2 parameters, making the total parameter count roughly proportional to the number of blocks times the square of the model dimension.`,
  shortDescription:
    "The fundamental building block of Transformers: Multi-Head Attention + Feed-Forward Network, each with residual connections and layer normalization.",
  pseudocode: `procedure TransformerBlock(x):
    // Sub-layer 1: Multi-Head Attention with residual
    residual = x
    x = LayerNorm(x)
    x = MultiHeadAttention(Q=x, K=x, V=x)
    x = x + residual         // residual connection

    // Sub-layer 2: Feed-Forward Network with residual
    residual = x
    x = LayerNorm(x)
    x = FFN(x)               // Two linear layers with activation
    x = x + residual         // residual connection

    return x
end procedure

procedure FFN(x):
    // Position-wise feed-forward: applies same MLP to each token
    hidden = Linear(x, d_model, 4*d_model)   // up-project
    hidden = GELU(hidden)                      // activation
    output = Linear(hidden, 4*d_model, d_model) // down-project
    return output
end procedure`,
  implementations: {
    python: `import numpy as np

def layer_norm(x, eps=1e-5):
    """Layer normalization across the last dimension."""
    mean = x.mean(axis=-1, keepdims=True)
    std = x.std(axis=-1, keepdims=True)
    return (x - mean) / (std + eps)

def gelu(x):
    """Gaussian Error Linear Unit activation."""
    return 0.5 * x * (1 + np.tanh(np.sqrt(2 / np.pi) * (x + 0.044715 * x**3)))

def softmax(x, axis=-1):
    e_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e_x / e_x.sum(axis=axis, keepdims=True)

class TransformerBlock:
    def __init__(self, d_model, num_heads, d_ff=None):
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        self.d_ff = d_ff or 4 * d_model
        scale = 0.02

        # MHA weights (simplified: single head for clarity)
        self.W_Q = np.random.randn(d_model, d_model) * scale
        self.W_K = np.random.randn(d_model, d_model) * scale
        self.W_V = np.random.randn(d_model, d_model) * scale
        self.W_O = np.random.randn(d_model, d_model) * scale

        # FFN weights
        self.W1 = np.random.randn(d_model, self.d_ff) * scale
        self.b1 = np.zeros(self.d_ff)
        self.W2 = np.random.randn(self.d_ff, d_model) * scale
        self.b2 = np.zeros(d_model)

    def attention(self, x):
        Q, K, V = x @ self.W_Q, x @ self.W_K, x @ self.W_V
        scores = Q @ K.T / np.sqrt(self.d_model)
        weights = softmax(scores)
        return weights @ V @ self.W_O

    def ffn(self, x):
        hidden = gelu(x @ self.W1 + self.b1)
        return hidden @ self.W2 + self.b2

    def forward(self, x):
        # Sub-layer 1: MHA + residual
        residual = x
        x = layer_norm(x)
        x = self.attention(x) + residual

        # Sub-layer 2: FFN + residual
        residual = x
        x = layer_norm(x)
        x = self.ffn(x) + residual

        return x

# Example
if __name__ == "__main__":
    np.random.seed(42)
    block = TransformerBlock(d_model=16, num_heads=4)
    x = np.random.randn(4, 16)  # 4 tokens, d_model=16
    output = block.forward(x)
    print(f"Input shape: {x.shape}")
    print(f"Output shape: {output.shape}")
    print(f"Residual preserved: {np.allclose(output.mean(), x.mean(), atol=1)}")`,
    javascript: `function layerNorm(x, eps = 1e-5) {
  return x.map(row => {
    const mean = row.reduce((s, v) => s + v, 0) / row.length;
    const variance = row.reduce((s, v) => s + (v - mean) ** 2, 0) / row.length;
    const std = Math.sqrt(variance + eps);
    return row.map(v => (v - mean) / std);
  });
}

function gelu(x) {
  return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));
}

function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
}

function matMul(A, B) {
  const rows = A.length, cols = B[0].length, inner = B.length;
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) =>
      A[i].reduce((s, _, k) => s + A[i][k] * B[k][j], 0)
    )
  );
}

function transpose(M) {
  return M[0].map((_, j) => M.map(row => row[j]));
}

class TransformerBlock {
  constructor(dModel, numHeads) {
    this.dModel = dModel;
    this.dFF = 4 * dModel;
    const rand = () => (Math.random() - 0.5) * 0.04;
    const mat = (r, c) => Array.from({ length: r }, () =>
      Array.from({ length: c }, rand));
    this.WQ = mat(dModel, dModel);
    this.WK = mat(dModel, dModel);
    this.WV = mat(dModel, dModel);
    this.WO = mat(dModel, dModel);
    this.W1 = mat(dModel, this.dFF);
    this.W2 = mat(this.dFF, dModel);
  }

  attention(x) {
    const Q = matMul(x, this.WQ);
    const K = matMul(x, this.WK);
    const V = matMul(x, this.WV);
    const scores = matMul(Q, transpose(K)).map(row =>
      row.map(v => v / Math.sqrt(this.dModel))
    );
    const weights = scores.map(row => softmax(row));
    return matMul(matMul(weights, V), this.WO);
  }

  ffn(x) {
    const hidden = matMul(x, this.W1).map(row => row.map(gelu));
    return matMul(hidden, this.W2);
  }

  forward(x) {
    let residual = x;
    let out = this.attention(layerNorm(x));
    x = out.map((row, i) => row.map((v, j) => v + residual[i][j]));

    residual = x;
    out = this.ffn(layerNorm(x));
    return out.map((row, i) => row.map((v, j) => v + residual[i][j]));
  }
}

// Example
const block = new TransformerBlock(16, 4);
const x = Array.from({ length: 4 }, () =>
  Array.from({ length: 16 }, () => Math.random() - 0.5)
);
const output = block.forward(x);
console.log("Output shape:", [output.length, output[0].length]);`,
  },
  useCases: [
    "Language models: GPT, LLaMA, and other autoregressive models stack decoder blocks",
    "BERT-style models: bidirectional encoder blocks for text understanding tasks",
    "Vision Transformers (ViT): processing image patches through encoder blocks",
    "Multi-modal models: shared Transformer blocks for processing text, images, and audio",
  ],
  relatedAlgorithms: [
    "multi-head-attention",
    "self-attention",
    "full-transformer",
    "positional-encoding",
    "forward-pass",
  ],
  glossaryTerms: [
    "transformer block",
    "residual connection",
    "layer normalization",
    "feed-forward network",
    "multi-head attention",
    "pre-norm",
    "post-norm",
  ],
  tags: [
    "deep-learning",
    "transformer",
    "encoder-block",
    "residual",
    "layer-norm",
    "advanced",
  ],
};
