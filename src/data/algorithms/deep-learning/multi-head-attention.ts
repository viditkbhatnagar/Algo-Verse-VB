import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const multiHeadAttention: AlgorithmMetadata = {
  id: "multi-head-attention",
  name: "Multi-Head Attention",
  category: "deep-learning",
  subcategory: "Transformer Architecture",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n^2 * d)",
    average: "O(n^2 * d)",
    worst: "O(n^2 * d)",
    note: "With h heads each of dimension d_k = d/h, total cost is h * O(n^2 * d/h) = O(n^2 * d), same as single-head attention with full dimension d.",
  },
  spaceComplexity: {
    best: "O(h * n^2 + n * d)",
    average: "O(h * n^2 + n * d)",
    worst: "O(h * n^2 + n * d)",
    note: "Each head stores an n x n attention matrix, plus Q, K, V projections. The output projection W_O is d x d.",
  },
  description: `Multi-Head Attention extends the self-attention mechanism by running h parallel attention heads, each with its own learned projection matrices. Instead of performing a single attention function with d_model-dimensional keys, values, and queries, the model linearly projects them h times with different learned projections to d_k, d_k, and d_v dimensions respectively.

The key insight is that different attention heads can learn to attend to different types of relationships. For example, one head might capture syntactic dependencies (subject-verb agreement), another might focus on semantic similarity, and yet another on positional proximity. Each head operates on a subspace of the full representation, with d_k = d_model / h, making the total computational cost similar to single-head attention.

The outputs of all heads are concatenated and projected through a final linear layer: MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O, where head_i = Attention(Q * W_Q^i, K * W_K^i, V * W_V^i). In the original Transformer paper, h=8 heads with d_model=512 and d_k=d_v=64 were used. Multi-head attention is used in every layer of both the encoder and decoder in the Transformer architecture.`,
  shortDescription:
    "Runs multiple attention heads in parallel, each learning different relationship patterns, then concatenates and projects the results.",
  pseudocode: `procedure MultiHeadAttention(Q, K, V, h, W_Q[], W_K[], W_V[], W_O):
    // h: number of heads
    // W_Q[i], W_K[i], W_V[i]: projection matrices for head i
    // W_O: output projection matrix

    heads = []
    for i = 1 to h:
        Q_i = Q * W_Q[i]    // project to d_k dimensions
        K_i = K * W_K[i]    // project to d_k dimensions
        V_i = V * W_V[i]    // project to d_v dimensions

        head_i = Attention(Q_i, K_i, V_i)
        heads.append(head_i)
    end for

    // Concatenate all heads
    concat = Concatenate(heads)    // (n x h*d_v)

    // Final linear projection
    output = concat * W_O          // (n x d_model)

    return output
end procedure

procedure Attention(Q, K, V):
    d_k = Q.columns
    scores = Q * K^T / sqrt(d_k)
    weights = softmax(scores, dim=-1)
    return weights * V
end procedure`,
  implementations: {
    python: `import numpy as np

def softmax(x, axis=-1):
    e_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e_x / e_x.sum(axis=axis, keepdims=True)

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    weights = softmax(scores)
    return weights @ V, weights

class MultiHeadAttention:
    def __init__(self, d_model, num_heads):
        assert d_model % num_heads == 0
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads

        scale = 0.01
        self.W_Q = [np.random.randn(d_model, self.d_k) * scale for _ in range(num_heads)]
        self.W_K = [np.random.randn(d_model, self.d_k) * scale for _ in range(num_heads)]
        self.W_V = [np.random.randn(d_model, self.d_k) * scale for _ in range(num_heads)]
        self.W_O = np.random.randn(d_model, d_model) * scale

    def forward(self, X):
        """
        Args: X shape (n, d_model)
        Returns: output shape (n, d_model), attention_weights list
        """
        head_outputs = []
        all_weights = []

        for i in range(self.num_heads):
            Q = X @ self.W_Q[i]
            K = X @ self.W_K[i]
            V = X @ self.W_V[i]
            out, weights = scaled_dot_product_attention(Q, K, V)
            head_outputs.append(out)
            all_weights.append(weights)

        # Concatenate and project
        concat = np.concatenate(head_outputs, axis=-1)  # (n, d_model)
        output = concat @ self.W_O

        return output, all_weights

# Example
if __name__ == "__main__":
    np.random.seed(42)
    n, d_model, num_heads = 4, 8, 4
    X = np.random.randn(n, d_model)

    mha = MultiHeadAttention(d_model, num_heads)
    output, weights = mha.forward(X)

    print(f"Input shape: {X.shape}")
    print(f"Output shape: {output.shape}")
    for i, w in enumerate(weights):
        print(f"Head {i+1} attention (row 0): {np.round(w[0], 3)}")`,
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

function attention(Q, K, V) {
  const dk = Q[0].length;
  const KT = transpose(K);
  const scores = matMul(Q, KT).map(row =>
    row.map(v => v / Math.sqrt(dk))
  );
  const weights = scores.map(row => softmax(row));
  return { output: matMul(weights, V), weights };
}

class MultiHeadAttention {
  constructor(dModel, numHeads) {
    this.dModel = dModel;
    this.numHeads = numHeads;
    this.dk = dModel / numHeads;
    const rand = () => (Math.random() - 0.5) * 0.02;
    const mat = (r, c) => Array.from({ length: r }, () =>
      Array.from({ length: c }, rand));
    this.WQ = Array.from({ length: numHeads }, () => mat(dModel, this.dk));
    this.WK = Array.from({ length: numHeads }, () => mat(dModel, this.dk));
    this.WV = Array.from({ length: numHeads }, () => mat(dModel, this.dk));
    this.WO = mat(dModel, dModel);
  }

  forward(X) {
    const headOutputs = [];
    const allWeights = [];
    for (let i = 0; i < this.numHeads; i++) {
      const Q = matMul(X, this.WQ[i]);
      const K = matMul(X, this.WK[i]);
      const V = matMul(X, this.WV[i]);
      const { output, weights } = attention(Q, K, V);
      headOutputs.push(output);
      allWeights.push(weights);
    }
    // Concatenate
    const concat = X.map((_, ri) =>
      headOutputs.flatMap(h => h[ri])
    );
    const output = matMul(concat, this.WO);
    return { output, weights: allWeights };
  }
}

// Example
const mha = new MultiHeadAttention(8, 4);
const X = Array.from({ length: 4 }, () =>
  Array.from({ length: 8 }, () => Math.random() - 0.5)
);
const { output, weights } = mha.forward(X);
console.log("Output shape:", [output.length, output[0].length]);
weights.forEach((w, i) =>
  console.log(\`Head \${i+1} row 0:\`, w[0].map(v => v.toFixed(3)))
);`,
  },
  useCases: [
    "Language understanding: capturing syntactic, semantic, and positional patterns simultaneously",
    "Machine translation: attending to different aspects of source sentence for each target word",
    "Text summarization: identifying important phrases through different attention perspectives",
    "Protein structure prediction: modeling different types of amino acid interactions",
  ],
  relatedAlgorithms: [
    "self-attention",
    "masked-self-attention",
    "transformer-block",
    "full-transformer",
  ],
  glossaryTerms: [
    "attention mechanism",
    "multi-head attention",
    "query",
    "key",
    "value",
    "concatenation",
    "linear projection",
  ],
  tags: [
    "deep-learning",
    "transformer",
    "multi-head-attention",
    "attention",
    "nlp",
    "advanced",
  ],
};
