import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const maskedSelfAttention: AlgorithmMetadata = {
  id: "masked-self-attention",
  name: "Masked Self-Attention",
  category: "deep-learning",
  subcategory: "Transformer Architecture",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n^2 * d)",
    average: "O(n^2 * d)",
    worst: "O(n^2 * d)",
    note: "Same as standard self-attention. The causal mask is applied element-wise in O(n^2) and does not change the asymptotic complexity.",
  },
  spaceComplexity: {
    best: "O(n^2 + n * d)",
    average: "O(n^2 + n * d)",
    worst: "O(n^2 + n * d)",
    note: "The n x n attention matrix and mask must be stored. The mask itself can be precomputed once and reused across layers.",
  },
  description: `Masked Self-Attention (also called Causal Attention) is a variant of self-attention used in the decoder of the Transformer architecture and in all autoregressive language models (GPT, LLaMA, Claude). It modifies the standard attention mechanism by applying a causal mask that prevents each position from attending to subsequent positions, enforcing the autoregressive property.

The mask is a lower-triangular matrix: for position i, all positions j where j > i are set to negative infinity before the softmax operation. Since exp(-infinity) = 0, these future positions receive zero attention weight after softmax. This ensures that when predicting token at position t, the model can only use information from tokens at positions 0, 1, ..., t-1 and itself. The formula becomes: MaskedAttention(Q, K, V) = softmax(QK^T / sqrt(d_k) + M) * V, where M is the causal mask.

This mechanism is critical for two reasons: (1) During training, it allows the model to process the entire sequence in parallel while maintaining the autoregressive property -- without the mask, the model would "cheat" by looking at future tokens. (2) During inference, it naturally supports left-to-right generation, producing one token at a time. Modern optimizations like FlashAttention and KV-caching exploit the causal mask structure for efficient computation.`,
  shortDescription:
    "Self-attention with a causal mask that prevents tokens from attending to future positions, enabling autoregressive generation.",
  pseudocode: `procedure MaskedSelfAttention(X, W_Q, W_K, W_V):
    Q = X * W_Q    // queries
    K = X * W_K    // keys
    V = X * W_V    // values

    // Compute raw scores
    scores = Q * K^T / sqrt(d_k)    // (n x n)

    // Create causal mask
    mask = zeros(n, n)
    for i = 0 to n-1:
        for j = 0 to n-1:
            if j > i:
                mask[i][j] = -infinity
        end for
    end for

    // Apply mask BEFORE softmax
    masked_scores = scores + mask

    // Softmax: -inf positions become 0
    attention_weights = softmax(masked_scores, dim=-1)

    // Weighted sum of values
    output = attention_weights * V

    return output
end procedure`,
  implementations: {
    python: `import numpy as np

def softmax(x, axis=-1):
    """Numerically stable softmax, handles -inf correctly."""
    e_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e_x / e_x.sum(axis=axis, keepdims=True)

def create_causal_mask(n):
    """Create lower-triangular causal mask."""
    mask = np.triu(np.full((n, n), -np.inf), k=1)
    return mask

def masked_self_attention(X, W_Q, W_K, W_V):
    """
    Masked (Causal) Self-Attention.

    Args:
        X: Input embeddings, shape (n, d_model)
        W_Q, W_K: Weight matrices, shape (d_model, d_k)
        W_V: Value weight matrix, shape (d_model, d_v)

    Returns:
        output: shape (n, d_v)
        attention_weights: shape (n, n), lower-triangular
    """
    Q = X @ W_Q
    K = X @ W_K
    V = X @ W_V
    d_k = Q.shape[-1]
    n = Q.shape[0]

    # Compute scaled scores
    scores = Q @ K.T / np.sqrt(d_k)

    # Apply causal mask
    mask = create_causal_mask(n)
    masked_scores = scores + mask

    # Softmax (masked positions -> 0)
    weights = softmax(masked_scores)

    # Output
    output = weights @ V
    return output, weights

# Example
if __name__ == "__main__":
    np.random.seed(42)
    n, d_model, d_k = 4, 8, 4
    X = np.random.randn(n, d_model)
    W_Q = np.random.randn(d_model, d_k) * 0.1
    W_K = np.random.randn(d_model, d_k) * 0.1
    W_V = np.random.randn(d_model, d_k) * 0.1

    output, weights = masked_self_attention(X, W_Q, W_K, W_V)

    tokens = ["The", "cat", "sat", "down"]
    print("Causal attention weights (lower-triangular):")
    for i, token in enumerate(tokens):
        print(f"  {token}: {np.round(weights[i], 3)}")
    print(f"\\nNote: each row sums to 1, zeros above diagonal")`,
    javascript: `function softmax(arr) {
  const finite = arr.filter(x => x > -1e8);
  const max = finite.length > 0 ? Math.max(...finite) : 0;
  const exps = arr.map(x => x < -1e8 ? 0 : Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => sum > 0 ? x / sum : 0);
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

function createCausalMask(n) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => j > i ? -Infinity : 0)
  );
}

function maskedSelfAttention(X, WQ, WK, WV) {
  const Q = matMul(X, WQ);
  const K = matMul(X, WK);
  const V = matMul(X, WV);
  const dk = Q[0].length;
  const n = Q.length;

  // Scaled scores
  const KT = transpose(K);
  const scores = matMul(Q, KT).map(row =>
    row.map(v => v / Math.sqrt(dk))
  );

  // Apply causal mask
  const mask = createCausalMask(n);
  const maskedScores = scores.map((row, i) =>
    row.map((v, j) => v + mask[i][j])
  );

  // Softmax per row
  const weights = maskedScores.map(row => softmax(row));

  // Output
  const output = matMul(weights, V);
  return { output, weights };
}

// Example
const n = 4, d = 8, dk = 4;
const rand = () => (Math.random() - 0.5) * 0.2;
const X = Array.from({ length: n }, () => Array.from({ length: d }, rand));
const WQ = Array.from({ length: d }, () => Array.from({ length: dk }, rand));
const WK = Array.from({ length: d }, () => Array.from({ length: dk }, rand));
const WV = Array.from({ length: d }, () => Array.from({ length: dk }, rand));

const { weights } = maskedSelfAttention(X, WQ, WK, WV);
const tokens = ["The", "cat", "sat", "down"];
tokens.forEach((t, i) =>
  console.log(\`\${t}: [\${weights[i].map(v => v.toFixed(3)).join(", ")}]\`)
);`,
  },
  useCases: [
    "Autoregressive language models: GPT, LLaMA, Claude use causal attention for next-token prediction",
    "Text generation: ensuring each generated token only depends on previously generated tokens",
    "Decoder in encoder-decoder models: preventing the decoder from looking ahead during training",
    "Causal sequence modeling: time-series forecasting where future values must not leak into predictions",
  ],
  relatedAlgorithms: [
    "self-attention",
    "multi-head-attention",
    "full-transformer",
    "transformer-block",
  ],
  glossaryTerms: [
    "causal mask",
    "autoregressive",
    "attention mask",
    "softmax",
    "decoder",
    "self-attention",
    "lower-triangular",
  ],
  tags: [
    "deep-learning",
    "transformer",
    "masked-attention",
    "causal",
    "decoder",
    "autoregressive",
    "advanced",
  ],
};
