import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const attentionVisualization: AlgorithmMetadata = {
  id: "attention-visualization",
  name: "Attention Mechanism",
  category: "nlp",
  subcategory: "NLP Tasks",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n^2 * d)",
    average: "O(n^2 * d)",
    worst: "O(n^2 * d)",
    note: "Computing attention scores requires O(n^2 * d) for sequence length n and dimension d. Multi-head attention with h heads: O(h * n^2 * d/h) = O(n^2 * d).",
  },
  spaceComplexity: {
    best: "O(n^2 + n*d)",
    average: "O(n^2 + n*d)",
    worst: "O(h * n^2 + n*d)",
    note: "Stores attention weight matrix (n^2 per head) and Q/K/V projections (n*d). With h heads: O(h * n^2) for attention matrices.",
  },
  description: `The Attention mechanism allows neural networks to focus on relevant parts of the input when producing each element of the output. In Scaled Dot-Product Attention, three matrices are computed from the input: Query (Q), Key (K), and Value (V). The attention weights are computed as: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V, where d_k is the dimension of the keys.

The intuition is that Q represents "what I'm looking for", K represents "what I contain", and V represents "what I'll give you if you attend to me". The dot product QK^T measures compatibility between each query-key pair, softmax normalizes these scores to form a probability distribution, and the weighted sum over V produces context-aware representations.

Multi-Head Attention runs h attention operations in parallel, each with different learned projections, then concatenates the results: MultiHead(Q,K,V) = Concat(head_1,...,head_h) * W_O, where head_i = Attention(Q*W_i^Q, K*W_i^K, V*W_i^V). Different heads can capture different types of relationships (syntactic, semantic, positional). Visualizing attention weights reveals which tokens influence each other, providing interpretability into transformer models.`,
  shortDescription:
    "The core mechanism of Transformers: computes weighted focus over input tokens using Query-Key-Value dot products and softmax normalization.",
  pseudocode: `procedure SCALED_DOT_PRODUCT_ATTENTION(Q, K, V):
    d_k = dimension of K
    // Compute attention scores
    scores = Q * K^T / sqrt(d_k)

    // Optional: apply mask (for causal/padding)
    if mask is not None:
        scores[mask == 0] = -infinity

    // Softmax to get attention weights
    weights = softmax(scores, dim=-1)

    // Apply dropout (during training)
    weights = dropout(weights)

    // Weighted sum of values
    output = weights * V
    return output, weights

procedure MULTI_HEAD_ATTENTION(x, n_heads):
    d_model = dim(x)
    d_k = d_model / n_heads

    heads = []
    for h = 1 to n_heads:
        Q_h = x * W_Q_h  // project to d_k dimensions
        K_h = x * W_K_h
        V_h = x * W_V_h
        head_h, _ = SCALED_DOT_PRODUCT_ATTENTION(Q_h, K_h, V_h)
        heads.append(head_h)

    output = concatenate(heads) * W_O
    return output
end procedure`,
  implementations: {
    python: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """Compute scaled dot-product attention."""
    d_k = K.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)

    if mask is not None:
        scores = np.where(mask, scores, -1e9)

    # Softmax
    weights = np.exp(scores - scores.max(axis=-1, keepdims=True))
    weights /= weights.sum(axis=-1, keepdims=True)

    output = weights @ V
    return output, weights

def multi_head_attention(x, n_heads=4):
    """Simplified multi-head attention."""
    n, d = x.shape
    d_k = d // n_heads
    heads = []

    for h in range(n_heads):
        # Random projections (learned in practice)
        W_Q = np.random.randn(d, d_k) * 0.02
        W_K = np.random.randn(d, d_k) * 0.02
        W_V = np.random.randn(d, d_k) * 0.02

        Q = x @ W_Q
        K = x @ W_K
        V = x @ W_V

        head_out, weights = scaled_dot_product_attention(Q, K, V)
        heads.append(head_out)

    # Concatenate heads
    concat = np.concatenate(heads, axis=-1)
    W_O = np.random.randn(d, d) * 0.02
    return concat @ W_O

# Example
x = np.random.randn(6, 64)  # 6 tokens, 64 dimensions
Q = K = V = x  # Self-attention
output, weights = scaled_dot_product_attention(Q, K, V)
print(f"Attention weights shape: {weights.shape}")
print(f"Row sums (should be 1.0): {weights.sum(axis=-1).round(4)}")
print(f"\\nAttention matrix:\\n{weights.round(3)}")`,
    javascript: `function scaledDotProductAttention(Q, K, V) {
  const dK = K[0].length;
  const n = Q.length;

  // QK^T / sqrt(d_k)
  const scores = Q.map(q =>
    K.map(k => q.reduce((sum, qi, j) => sum + qi * k[j], 0) / Math.sqrt(dK))
  );

  // Softmax per row
  const weights = scores.map(row => {
    const max = Math.max(...row);
    const exp = row.map(v => Math.exp(v - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(v => v / sum);
  });

  // Weighted sum: weights @ V
  const output = weights.map(row =>
    V[0].map((_, j) => row.reduce((sum, w, k) => sum + w * V[k][j], 0))
  );

  return { output, weights };
}

// Example
const n = 6, d = 16;
const x = Array.from({ length: n }, () =>
  Array.from({ length: d }, () => Math.random() - 0.5));
const { output, weights } = scaledDotProductAttention(x, x, x);
console.log('Attention weights (first row):', weights[0].map(w => w.toFixed(3)));
console.log('Row sum:', weights[0].reduce((a, b) => a + b, 0).toFixed(4));`,
  },
  useCases: [
    "Machine translation: aligning source and target language tokens during encoding/decoding",
    "Model interpretability: visualizing what tokens a transformer attends to for each prediction",
    "Document summarization: attention-based models identify the most important sentences",
    "Image captioning: cross-attention between visual features and generated text tokens",
  ],
  relatedAlgorithms: [
    "bert-architecture",
    "gpt-architecture",
    "cosine-similarity",
    "word-embeddings",
  ],
  glossaryTerms: [
    "attention",
    "self-attention",
    "multi-head attention",
    "query key value",
    "softmax",
    "scaled dot product",
    "transformer",
  ],
  tags: [
    "nlp",
    "attention",
    "transformer",
    "deep-learning",
    "intermediate",
  ],
};
