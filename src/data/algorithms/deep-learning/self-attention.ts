import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const selfAttention: AlgorithmMetadata = {
  id: "self-attention",
  name: "Self-Attention",
  category: "deep-learning",
  subcategory: "Transformer Architecture",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n^2 * d)",
    average: "O(n^2 * d)",
    worst: "O(n^2 * d)",
    note: "n is the sequence length and d is the model dimension. The quadratic cost comes from computing all pairwise attention scores between tokens.",
  },
  spaceComplexity: {
    best: "O(n^2 + n*d)",
    average: "O(n^2 + n*d)",
    worst: "O(n^2 + n*d)",
    note: "The n^2 attention matrix must be stored, plus Q, K, V matrices of size n*d.",
  },
  description: `Self-Attention is the core mechanism of the Transformer architecture, introduced in "Attention Is All You Need" (Vaswani et al., 2017). It allows each position in a sequence to attend to all other positions, computing a weighted sum of value vectors where the weights are determined by the compatibility between query and key vectors. The formula is: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V.

For each token, three vectors are computed by multiplying the input embedding with learned weight matrices: a Query (Q) representing what the token is looking for, a Key (K) representing what the token offers, and a Value (V) representing the actual information content. The attention score between two tokens is the dot product of their query and key vectors, scaled by the square root of the key dimension to prevent gradients from vanishing in the softmax.

Self-Attention enables the model to capture long-range dependencies regardless of distance in the sequence, unlike RNNs which must propagate information through sequential hidden states. This parallelizability and direct access to all positions are key advantages. However, the O(n^2) complexity with respect to sequence length is a limitation for very long sequences, motivating research into efficient attention variants like linear attention, sparse attention, and FlashAttention.`,
  shortDescription:
    "Each token attends to every other token in the sequence, computing context-aware representations through learned query, key, and value projections.",
  pseudocode: `procedure SelfAttention(X, W_Q, W_K, W_V):
    // X: input embeddings (n x d_model)
    // W_Q, W_K, W_V: weight matrices (d_model x d_k)

    Q = X * W_Q    // (n x d_k) — queries
    K = X * W_K    // (n x d_k) — keys
    V = X * W_V    // (n x d_k) — values

    // Compute raw attention scores
    scores = Q * K^T              // (n x n)

    // Scale by sqrt(d_k)
    scores = scores / sqrt(d_k)

    // Apply softmax row-wise
    attention_weights = softmax(scores, dim=-1)  // (n x n), each row sums to 1

    // Compute weighted sum of values
    output = attention_weights * V   // (n x d_k)

    return output
end procedure`,
  implementations: {
    python: `import numpy as np

def softmax(x, axis=-1):
    """Numerically stable softmax."""
    e_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e_x / e_x.sum(axis=axis, keepdims=True)

def self_attention(X, W_Q, W_K, W_V):
    """
    Scaled dot-product self-attention.

    Args:
        X: Input embeddings, shape (n, d_model)
        W_Q: Query weight matrix, shape (d_model, d_k)
        W_K: Key weight matrix, shape (d_model, d_k)
        W_V: Value weight matrix, shape (d_model, d_v)

    Returns:
        output: Context-aware representations, shape (n, d_v)
        attention_weights: Attention matrix, shape (n, n)
    """
    # Project inputs to Q, K, V
    Q = X @ W_Q  # (n, d_k)
    K = X @ W_K  # (n, d_k)
    V = X @ W_V  # (n, d_v)

    d_k = Q.shape[-1]

    # Compute scaled dot-product attention scores
    scores = Q @ K.T / np.sqrt(d_k)  # (n, n)

    # Softmax to get attention weights
    attention_weights = softmax(scores)  # (n, n)

    # Weighted sum of values
    output = attention_weights @ V  # (n, d_v)

    return output, attention_weights

# Example
if __name__ == "__main__":
    np.random.seed(42)
    n, d_model, d_k = 4, 8, 4
    X = np.random.randn(n, d_model)
    W_Q = np.random.randn(d_model, d_k) * 0.1
    W_K = np.random.randn(d_model, d_k) * 0.1
    W_V = np.random.randn(d_model, d_k) * 0.1

    output, weights = self_attention(X, W_Q, W_K, W_V)
    print("Attention weights (each row sums to 1):")
    print(np.round(weights, 3))
    print("\\nOutput shape:", output.shape)`,
    javascript: `function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
}

function matMul(A, B) {
  const rows = A.length, cols = B[0].length, inner = B.length;
  const C = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      for (let k = 0; k < inner; k++)
        C[i][j] += A[i][k] * B[k][j];
  return C;
}

function transpose(M) {
  return M[0].map((_, j) => M.map(row => row[j]));
}

function selfAttention(X, W_Q, W_K, W_V) {
  const Q = matMul(X, W_Q);
  const K = matMul(X, W_K);
  const V = matMul(X, W_V);
  const d_k = Q[0].length;

  // QK^T / sqrt(d_k)
  const KT = transpose(K);
  const scores = matMul(Q, KT).map(row =>
    row.map(v => v / Math.sqrt(d_k))
  );

  // Softmax per row
  const weights = scores.map(row => softmax(row));

  // Weighted sum of values
  const output = matMul(weights, V);

  return { output, weights };
}

// Example
const n = 4, d = 8, dk = 4;
const rand = () => (Math.random() - 0.5) * 0.2;
const X = Array.from({ length: n }, () => Array.from({ length: d }, rand));
const W_Q = Array.from({ length: d }, () => Array.from({ length: dk }, rand));
const W_K = Array.from({ length: d }, () => Array.from({ length: dk }, rand));
const W_V = Array.from({ length: d }, () => Array.from({ length: dk }, rand));

const { output, weights } = selfAttention(X, W_Q, W_K, W_V);
console.log("Attention weights:", weights.map(r => r.map(v => v.toFixed(3))));
console.log("Output shape:", [output.length, output[0].length]);`,
  },
  useCases: [
    "Natural language understanding: capturing contextual relationships between words in a sentence",
    "Machine translation: aligning source and target language tokens dynamically",
    "Text generation: determining which previous tokens are relevant for predicting the next token",
    "Image recognition (Vision Transformers): modeling spatial relationships between image patches",
  ],
  relatedAlgorithms: [
    "multi-head-attention",
    "masked-self-attention",
    "positional-encoding",
    "transformer-block",
    "seq2seq",
  ],
  glossaryTerms: [
    "attention mechanism",
    "query",
    "key",
    "value",
    "softmax",
    "scaled dot-product attention",
    "transformer",
  ],
  tags: [
    "deep-learning",
    "transformer",
    "attention",
    "self-attention",
    "nlp",
    "advanced",
  ],
};
