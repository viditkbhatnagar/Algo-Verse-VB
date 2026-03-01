import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const bertArchitecture: AlgorithmMetadata = {
  id: "bert-architecture",
  name: "BERT Architecture",
  category: "nlp",
  subcategory: "Neural NLP Models",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n^2 * d)",
    average: "O(n^2 * d)",
    worst: "O(n^2 * d)",
    note: "Self-attention is O(n^2 * d) for sequence length n and hidden dimension d. With L layers: O(L * n^2 * d). BERT-base: L=12, d=768, n up to 512.",
  },
  spaceComplexity: {
    best: "O(n^2 + n*d)",
    average: "O(L * (n^2 + n*d))",
    worst: "O(L * (n^2 + n*d))",
    note: "Stores attention matrices (n^2) and hidden states (n*d) per layer. BERT-base has 110M parameters; BERT-large has 340M.",
  },
  description: `BERT (Bidirectional Encoder Representations from Transformers) is a landmark pre-trained language model introduced by Google in 2018 that revolutionized NLP. Its key innovation is bidirectional pre-training: unlike GPT which reads text left-to-right, BERT's self-attention mechanism allows every token to attend to all other tokens in both directions simultaneously. This bidirectional context produces richer representations.

BERT uses a stack of Transformer encoder layers. Each layer consists of: (1) Multi-Head Self-Attention -- each token computes attention weights over all other tokens, using multiple parallel attention heads. (2) Add & Layer Normalization -- residual connections and layer normalization for stable training. (3) Position-wise Feed-Forward Network -- two linear layers with GELU activation applied independently to each position. (4) Another Add & Layer Normalization.

BERT is pre-trained with two objectives: Masked Language Modeling (MLM), where 15% of tokens are randomly masked and the model predicts them, and Next Sentence Prediction (NSP), where the model predicts whether sentence B follows sentence A. After pre-training on massive text corpora, BERT is fine-tuned on specific tasks by adding a task-specific classification head. The [CLS] token representation is used for sentence-level tasks, while individual token representations serve token-level tasks like NER.`,
  shortDescription:
    "A bidirectional Transformer encoder pre-trained with masked language modeling, enabling state-of-the-art NLP across tasks via fine-tuning.",
  pseudocode: `procedure BERT_ENCODER(input_ids, segment_ids):
    // Embedding layer: token + position + segment
    token_emb = TOKEN_EMBEDDING[input_ids]
    pos_emb = POSITION_EMBEDDING[0, 1, ..., seq_len-1]
    seg_emb = SEGMENT_EMBEDDING[segment_ids]
    x = LayerNorm(token_emb + pos_emb + seg_emb)
    x = Dropout(x)

    // Stack of L Transformer encoder layers
    for layer = 1 to L:
        // Multi-Head Self-Attention
        Q = x * W_Q;  K = x * W_K;  V = x * W_V
        attn_scores = (Q * K^T) / sqrt(d_k)
        attn_weights = softmax(attn_scores)
        attn_output = attn_weights * V
        x = LayerNorm(x + Dropout(attn_output))

        // Feed-Forward Network
        ff = GELU(x * W_1 + b_1) * W_2 + b_2
        x = LayerNorm(x + Dropout(ff))

    return x  // [CLS] token at x[0] for classification
end procedure`,
  implementations: {
    python: `import numpy as np

class BERTLayer:
    """Simplified single BERT encoder layer."""

    def __init__(self, d_model: int, n_heads: int, d_ff: int):
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        scale = 0.02

        # Multi-head attention weights
        self.W_Q = np.random.randn(d_model, d_model) * scale
        self.W_K = np.random.randn(d_model, d_model) * scale
        self.W_V = np.random.randn(d_model, d_model) * scale
        self.W_O = np.random.randn(d_model, d_model) * scale

        # Feed-forward weights
        self.W_1 = np.random.randn(d_model, d_ff) * scale
        self.W_2 = np.random.randn(d_ff, d_model) * scale

    def _gelu(self, x):
        return 0.5 * x * (1 + np.tanh(np.sqrt(2/np.pi) * (x + 0.044715 * x**3)))

    def _layer_norm(self, x, eps=1e-6):
        mean = x.mean(axis=-1, keepdims=True)
        std = x.std(axis=-1, keepdims=True)
        return (x - mean) / (std + eps)

    def forward(self, x):
        seq_len = x.shape[0]

        # Multi-head self-attention
        Q = x @ self.W_Q
        K = x @ self.W_K
        V = x @ self.W_V

        scores = Q @ K.T / np.sqrt(self.d_k)
        weights = np.exp(scores - scores.max(axis=-1, keepdims=True))
        weights /= weights.sum(axis=-1, keepdims=True)
        attn_out = weights @ V @ self.W_O

        x = self._layer_norm(x + attn_out)

        # Feed-forward
        ff = self._gelu(x @ self.W_1) @ self.W_2
        x = self._layer_norm(x + ff)

        return x

# Example
layer = BERTLayer(d_model=64, n_heads=4, d_ff=256)
x = np.random.randn(8, 64)  # seq_len=8, d=64
output = layer.forward(x)
print(f"Input: {x.shape}, Output: {output.shape}")`,
    javascript: `class BERTLayer {
  constructor(dModel, nHeads, dFF) {
    this.dModel = dModel;
    this.nHeads = nHeads;
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
    const rows = A.length, cols = B[0].length, inner = B.length;
    return Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) => {
        let sum = 0;
        for (let k = 0; k < inner; k++) sum += A[i][k] * B[k][j];
        return sum;
      })
    );
  }

  softmaxRow(row) {
    const max = Math.max(...row);
    const exp = row.map(v => Math.exp(v - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(v => v / sum);
  }

  forward(x) {
    const Q = this.matMul(x, this.W_Q);
    const K = this.matMul(x, this.W_K);
    const V = this.matMul(x, this.W_V);

    // Simplified attention
    const KT = K[0].map((_, j) => K.map(row => row[j]));
    const scores = this.matMul(Q, KT).map(row =>
      row.map(v => v / Math.sqrt(this.dK))
    );
    const weights = scores.map(row => this.softmaxRow(row));
    const attnOut = this.matMul(weights, V);

    return attnOut;
  }
}

const layer = new BERTLayer(64, 4, 256);
const x = Array.from({ length: 8 }, () =>
  Array.from({ length: 64 }, () => Math.random() - 0.5)
);
const out = layer.forward(x);
console.log('Output shape:', out.length, 'x', out[0].length);`,
  },
  useCases: [
    "Text classification: fine-tuning BERT for sentiment analysis, spam detection, and topic classification",
    "Named Entity Recognition: token-level classification using BERT's contextual representations",
    "Question Answering: extracting answer spans from passages using BERT's bidirectional attention",
    "Natural Language Inference: determining entailment, contradiction, or neutrality between sentence pairs",
  ],
  relatedAlgorithms: [
    "gpt-architecture",
    "attention-visualization",
    "ner",
    "word-embeddings",
  ],
  glossaryTerms: [
    "BERT",
    "transformer",
    "self-attention",
    "masked language modeling",
    "fine-tuning",
    "pre-training",
    "multi-head attention",
  ],
  tags: [
    "nlp",
    "transformer",
    "bert",
    "pre-training",
    "deep-learning",
    "advanced",
  ],
};
