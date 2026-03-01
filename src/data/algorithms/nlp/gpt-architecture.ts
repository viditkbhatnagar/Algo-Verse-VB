import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const gptArchitecture: AlgorithmMetadata = {
  id: "gpt-architecture",
  name: "GPT Architecture",
  category: "nlp",
  subcategory: "Neural NLP Models",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n^2 * d)",
    average: "O(n^2 * d)",
    worst: "O(n^2 * d)",
    note: "Masked self-attention is O(n^2 * d) per layer for sequence length n and dimension d. Generation is O(T * n * d) for T generated tokens with KV-cache optimization.",
  },
  spaceComplexity: {
    best: "O(n * d)",
    average: "O(L * n * d)",
    worst: "O(L * n * d)",
    note: "Stores hidden states and KV-cache across L layers. GPT-2: 1.5B params, GPT-3: 175B params requiring hundreds of GBs.",
  },
  description: `GPT (Generative Pre-trained Transformer) is an autoregressive language model that uses stacked Transformer decoder layers with masked (causal) self-attention. Unlike BERT's bidirectional attention, GPT processes text left-to-right: each token can only attend to itself and all previous tokens. This causal constraint enables text generation -- the model can be used to predict the next token in a sequence.

The architecture consists of: (1) Token + Positional Embeddings -- each input token gets a learned embedding plus a positional encoding. (2) N Transformer decoder layers, each containing masked multi-head self-attention, layer normalization, and a feed-forward network. (3) A language model head that projects the final hidden state to a vocabulary-sized logit vector followed by softmax. The causal mask is implemented by setting attention scores for future positions to negative infinity before softmax.

GPT's pre-training objective is next-token prediction: given tokens [w1, ..., wt], predict wt+1. This simple objective, when applied at massive scale, produces remarkably capable models. GPT-2 (1.5B parameters) demonstrated coherent text generation, GPT-3 (175B) showed few-shot learning capabilities, and GPT-4 achieved human-level performance on many benchmarks. The scaling laws of GPT models -- performance improves predictably with model size, data, and compute -- have become a foundational principle of modern AI.`,
  shortDescription:
    "An autoregressive Transformer decoder using causal self-attention, pre-trained on next-token prediction for text generation.",
  pseudocode: `procedure GPT_DECODER(input_ids):
    // Embedding
    token_emb = TOKEN_EMBEDDING[input_ids]
    pos_emb = POSITION_EMBEDDING[0, 1, ..., seq_len-1]
    x = Dropout(token_emb + pos_emb)

    // Stack of L Transformer decoder layers
    for layer = 1 to L:
        // Masked Multi-Head Self-Attention
        Q = x * W_Q;  K = x * W_K;  V = x * W_V
        attn_scores = (Q * K^T) / sqrt(d_k)
        // Apply causal mask: future positions = -infinity
        for i = 0 to seq_len-1:
            for j = i+1 to seq_len-1:
                attn_scores[i][j] = -infinity
        attn_weights = softmax(attn_scores)
        attn_output = attn_weights * V
        x = LayerNorm(x + attn_output)

        // Feed-Forward Network
        ff = GELU(x * W_1 + b_1) * W_2 + b_2
        x = LayerNorm(x + ff)

    // Language model head
    logits = x * W_vocab  // project to vocabulary size
    next_token_probs = softmax(logits[-1])  // last position

    return next_token_probs
end procedure

procedure GENERATE(prompt, max_tokens):
    tokens = tokenize(prompt)
    for i = 1 to max_tokens:
        probs = GPT_DECODER(tokens)
        next_token = sample(probs)  // or argmax for greedy
        tokens.append(next_token)
        if next_token == END_TOKEN: break
    return tokens
end procedure`,
  implementations: {
    python: `import numpy as np

class GPTLayer:
    """Simplified GPT decoder layer with causal masking."""

    def __init__(self, d_model: int, n_heads: int, d_ff: int):
        self.d_model = d_model
        self.d_k = d_model // n_heads
        s = 0.02
        self.W_Q = np.random.randn(d_model, d_model) * s
        self.W_K = np.random.randn(d_model, d_model) * s
        self.W_V = np.random.randn(d_model, d_model) * s
        self.W_1 = np.random.randn(d_model, d_ff) * s
        self.W_2 = np.random.randn(d_ff, d_model) * s

    def forward(self, x: np.ndarray) -> np.ndarray:
        n = x.shape[0]
        Q, K, V = x @ self.W_Q, x @ self.W_K, x @ self.W_V

        scores = Q @ K.T / np.sqrt(self.d_k)
        # Causal mask: set future positions to -inf
        mask = np.triu(np.ones((n, n)) * -1e9, k=1)
        scores += mask

        weights = np.exp(scores - scores.max(axis=-1, keepdims=True))
        weights /= weights.sum(axis=-1, keepdims=True)
        attn = weights @ V

        x = x + attn  # residual
        ff = np.maximum(0, x @ self.W_1) @ self.W_2  # ReLU for simplicity
        return x + ff  # residual

def generate(model_layers, vocab_size, prompt_emb, max_tokens=5):
    """Autoregressive generation."""
    x = prompt_emb.copy()
    generated = []
    for _ in range(max_tokens):
        h = x
        for layer in model_layers:
            h = layer.forward(h)
        # Project last token to vocabulary
        logits = h[-1] @ np.random.randn(h.shape[1], vocab_size) * 0.01
        probs = np.exp(logits - logits.max())
        probs /= probs.sum()
        next_token = np.random.choice(vocab_size, p=probs)
        generated.append(next_token)
    return generated

# Example
layer = GPTLayer(d_model=64, n_heads=4, d_ff=256)
x = np.random.randn(5, 64)  # 5 tokens
out = layer.forward(x)
print(f"Shape: {out.shape}, causal attention applied")`,
    javascript: `class GPTLayer {
  constructor(dModel, nHeads, dFF) {
    this.dModel = dModel;
    this.dK = Math.floor(dModel / nHeads);
    const s = 0.02;
    const randMat = (r, c) => Array.from({ length: r }, () =>
      Array.from({ length: c }, () => (Math.random() - 0.5) * s * 2));
    this.W_Q = randMat(dModel, dModel);
    this.W_K = randMat(dModel, dModel);
    this.W_V = randMat(dModel, dModel);
    this.W1 = randMat(dModel, dFF);
    this.W2 = randMat(dFF, dModel);
  }

  matMul(A, B) {
    return A.map(row =>
      B[0].map((_, j) => row.reduce((sum, val, k) => sum + val * B[k][j], 0))
    );
  }

  forward(x) {
    const n = x.length;
    const Q = this.matMul(x, this.W_Q);
    const K = this.matMul(x, this.W_K);
    const V = this.matMul(x, this.W_V);

    const KT = K[0].map((_, j) => K.map(row => row[j]));
    const scores = this.matMul(Q, KT).map(row =>
      row.map(v => v / Math.sqrt(this.dK))
    );

    // Apply causal mask
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        scores[i][j] = -1e9;

    // Softmax per row
    const weights = scores.map(row => {
      const max = Math.max(...row);
      const exp = row.map(v => Math.exp(v - max));
      const sum = exp.reduce((a, b) => a + b, 0);
      return exp.map(v => v / sum);
    });

    return this.matMul(weights, V);
  }
}

const layer = new GPTLayer(64, 4, 256);
const x = Array.from({ length: 5 }, () =>
  Array.from({ length: 64 }, () => Math.random() - 0.5));
const out = layer.forward(x);
console.log('Output:', out.length, 'x', out[0].length);`,
  },
  useCases: [
    "Text generation: writing articles, stories, code, and conversational responses",
    "Few-shot learning: performing tasks from just a few examples in the prompt",
    "Code generation: writing and completing source code (GitHub Copilot, Codex)",
    "Conversational AI: powering chatbots like ChatGPT with coherent multi-turn dialogue",
  ],
  relatedAlgorithms: [
    "bert-architecture",
    "attention-visualization",
    "beam-search",
    "bpe",
  ],
  glossaryTerms: [
    "GPT",
    "autoregressive",
    "causal attention",
    "transformer",
    "language model",
    "next token prediction",
    "few-shot learning",
  ],
  tags: [
    "nlp",
    "transformer",
    "gpt",
    "autoregressive",
    "text-generation",
    "advanced",
  ],
};
