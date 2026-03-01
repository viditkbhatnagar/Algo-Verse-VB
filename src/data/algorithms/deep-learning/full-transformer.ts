import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const fullTransformer: AlgorithmMetadata = {
  id: "full-transformer",
  name: "Full Transformer",
  category: "deep-learning",
  subcategory: "Transformer Architecture",
  difficulty: "expert",
  timeComplexity: {
    best: "O(N * (n^2 * d + n * d^2))",
    average: "O(N * (n^2 * d + n * d^2))",
    worst: "O(N * (n^2 * d + n * d^2))",
    note: "N is the number of encoder/decoder blocks, n is the sequence length, d is the model dimension. Each block contributes O(n^2 * d) for attention and O(n * d^2) for FFN. The decoder additionally performs cross-attention.",
  },
  spaceComplexity: {
    best: "O(N * (n^2 + n * d) + V * d)",
    average: "O(N * (n^2 + n * d) + V * d)",
    worst: "O(N * (n^2 + n * d) + V * d)",
    note: "N blocks each store attention matrices and activations. V*d for the embedding/output projection layers where V is vocabulary size. Parameters: ~12*N*d^2 for the Transformer blocks.",
  },
  description: `The Full Transformer is the complete encoder-decoder architecture introduced in "Attention Is All You Need" (Vaswani et al., 2017). It replaced recurrent neural networks with self-attention as the primary mechanism for sequence transduction, achieving state-of-the-art results in machine translation while being significantly more parallelizable.

The architecture consists of two main components: an encoder stack of N identical blocks and a decoder stack of N identical blocks. Each encoder block contains multi-head self-attention and a feed-forward network. Each decoder block contains three sub-layers: masked multi-head self-attention (to prevent attending to future tokens), multi-head cross-attention (queries from decoder, keys and values from encoder output), and a feed-forward network. All sub-layers use residual connections and layer normalization.

The Transformer has become the foundation of modern deep learning. Encoder-only variants (BERT, RoBERTa) excel at understanding tasks. Decoder-only variants (GPT, LLaMA, Claude) dominate text generation. Full encoder-decoder models (T5, BART, mBART) are used for translation and summarization. The original hyperparameters were N=6, d_model=512, h=8, d_ff=2048 (65M parameters), while modern LLMs scale to billions of parameters with N=96+, d_model=12288+.`,
  shortDescription:
    "The complete encoder-decoder Transformer architecture that revolutionized NLP, using self-attention and cross-attention instead of recurrence.",
  pseudocode: `procedure Transformer(source, target):
    // ENCODER
    x = SourceEmbedding(source) + PositionalEncoding
    for i = 1 to N:
        x = EncoderBlock(x)
    encoder_output = x

    // DECODER
    y = TargetEmbedding(target) + PositionalEncoding
    for i = 1 to N:
        y = DecoderBlock(y, encoder_output)

    // OUTPUT
    logits = Linear(y)           // project to vocab size
    probs = Softmax(logits)
    return probs
end procedure

procedure EncoderBlock(x):
    residual = x
    x = LayerNorm(x)
    x = MultiHeadSelfAttention(x)
    x = x + residual

    residual = x
    x = LayerNorm(x)
    x = FFN(x)
    x = x + residual
    return x
end procedure

procedure DecoderBlock(y, encoder_output):
    // Sub-layer 1: Masked self-attention
    residual = y
    y = LayerNorm(y)
    y = MaskedMultiHeadSelfAttention(y)
    y = y + residual

    // Sub-layer 2: Cross-attention
    residual = y
    y = LayerNorm(y)
    y = CrossAttention(Q=y, K=encoder_output, V=encoder_output)
    y = y + residual

    // Sub-layer 3: FFN
    residual = y
    y = LayerNorm(y)
    y = FFN(y)
    y = y + residual
    return y
end procedure`,
  implementations: {
    python: `import numpy as np

def softmax(x, axis=-1):
    e_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e_x / e_x.sum(axis=axis, keepdims=True)

def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    std = x.std(axis=-1, keepdims=True)
    return (x - mean) / (std + eps)

def gelu(x):
    return 0.5 * x * (1 + np.tanh(np.sqrt(2/np.pi) * (x + 0.044715*x**3)))

def attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    if mask is not None:
        scores = scores + mask  # mask is -inf for blocked positions
    weights = softmax(scores)
    return weights @ V

class TransformerBlock:
    def __init__(self, d, d_ff, is_decoder=False):
        s = 0.02
        self.is_decoder = is_decoder
        self.WQ = np.random.randn(d, d) * s
        self.WK = np.random.randn(d, d) * s
        self.WV = np.random.randn(d, d) * s
        self.W1 = np.random.randn(d, d_ff) * s
        self.W2 = np.random.randn(d_ff, d) * s
        if is_decoder:
            self.WQ_cross = np.random.randn(d, d) * s
            self.WK_cross = np.random.randn(d, d) * s
            self.WV_cross = np.random.randn(d, d) * s

    def forward(self, x, enc_out=None, mask=None):
        # Self-attention
        res = x
        x = layer_norm(x)
        Q, K, V = x @ self.WQ, x @ self.WK, x @ self.WV
        x = attention(Q, K, V, mask) + res

        # Cross-attention (decoder only)
        if self.is_decoder and enc_out is not None:
            res = x
            x = layer_norm(x)
            Q = x @ self.WQ_cross
            K = enc_out @ self.WK_cross
            V = enc_out @ self.WV_cross
            x = attention(Q, K, V) + res

        # FFN
        res = x
        x = layer_norm(x)
        x = gelu(x @ self.W1) @ self.W2 + res
        return x

class Transformer:
    def __init__(self, d=32, d_ff=128, N=2):
        self.enc_blocks = [TransformerBlock(d, d_ff) for _ in range(N)]
        self.dec_blocks = [TransformerBlock(d, d_ff, is_decoder=True) for _ in range(N)]

    def encode(self, src):
        x = src
        for block in self.enc_blocks:
            x = block.forward(x)
        return x

    def decode(self, tgt, enc_out):
        n = tgt.shape[0]
        mask = np.triu(np.full((n, n), -1e9), k=1)  # causal mask
        y = tgt
        for block in self.dec_blocks:
            y = block.forward(y, enc_out, mask)
        return y

# Example
if __name__ == "__main__":
    np.random.seed(42)
    d = 32
    model = Transformer(d=d, d_ff=128, N=2)
    src = np.random.randn(5, d)  # 5 source tokens
    tgt = np.random.randn(3, d)  # 3 target tokens
    enc_out = model.encode(src)
    dec_out = model.decode(tgt, enc_out)
    print(f"Encoder output: {enc_out.shape}")
    print(f"Decoder output: {dec_out.shape}")`,
    javascript: `function softmax(arr) {
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

function layerNorm(x) {
  return x.map(row => {
    const mean = row.reduce((s, v) => s + v, 0) / row.length;
    const v = row.reduce((s, v) => s + (v - mean) ** 2, 0) / row.length;
    return row.map(val => (val - mean) / Math.sqrt(v + 1e-5));
  });
}

function attention(Q, K, V, mask = null) {
  const dk = Q[0].length;
  const KT = transpose(K);
  let scores = matMul(Q, KT).map(row => row.map(v => v / Math.sqrt(dk)));
  if (mask) {
    scores = scores.map((row, i) => row.map((v, j) => v + mask[i][j]));
  }
  const weights = scores.map(row => softmax(row));
  return matMul(weights, V);
}

function gelu(x) {
  return 0.5 * x * (1 + Math.tanh(Math.sqrt(2/Math.PI) * (x + 0.044715*x**3)));
}

const rand = () => (Math.random() - 0.5) * 0.04;
const mat = (r, c) => Array.from({ length: r }, () => Array.from({ length: c }, rand));

class TransformerBlock {
  constructor(d, dFF, isDecoder = false) {
    this.WQ = mat(d, d); this.WK = mat(d, d); this.WV = mat(d, d);
    this.W1 = mat(d, dFF); this.W2 = mat(dFF, d);
    this.isDecoder = isDecoder;
    if (isDecoder) {
      this.WQc = mat(d, d); this.WKc = mat(d, d); this.WVc = mat(d, d);
    }
  }
  forward(x, encOut = null, mask = null) {
    let res = x;
    let ln = layerNorm(x);
    let Q = matMul(ln, this.WQ), K = matMul(ln, this.WK), V = matMul(ln, this.WV);
    x = attention(Q, K, V, mask).map((r, i) => r.map((v, j) => v + res[i][j]));

    if (this.isDecoder && encOut) {
      res = x; ln = layerNorm(x);
      Q = matMul(ln, this.WQc); K = matMul(encOut, this.WKc); V = matMul(encOut, this.WVc);
      x = attention(Q, K, V).map((r, i) => r.map((v, j) => v + res[i][j]));
    }

    res = x; ln = layerNorm(x);
    const h = matMul(ln, this.W1).map(r => r.map(gelu));
    x = matMul(h, this.W2).map((r, i) => r.map((v, j) => v + res[i][j]));
    return x;
  }
}

// Example
const d = 16, N = 2;
const encBlocks = Array.from({ length: N }, () => new TransformerBlock(d, d*4));
const decBlocks = Array.from({ length: N }, () => new TransformerBlock(d, d*4, true));

const src = Array.from({ length: 4 }, () => Array.from({ length: d }, rand));
const tgt = Array.from({ length: 3 }, () => Array.from({ length: d }, rand));

let enc = src;
encBlocks.forEach(b => { enc = b.forward(enc); });

const n = tgt.length;
const mask = Array.from({ length: n }, (_, i) =>
  Array.from({ length: n }, (_, j) => j > i ? -1e9 : 0)
);
let dec = tgt;
decBlocks.forEach(b => { dec = b.forward(dec, enc, mask); });

console.log("Encoder output:", [enc.length, enc[0].length]);
console.log("Decoder output:", [dec.length, dec[0].length]);`,
  },
  useCases: [
    "Machine translation: the original application, translating between languages (e.g., WMT benchmarks)",
    "Text summarization: T5 and BART use encoder-decoder for abstractive summarization",
    "Speech recognition: Whisper uses a Transformer encoder-decoder for audio-to-text",
    "Image captioning: generating natural language descriptions of images using cross-attention",
  ],
  relatedAlgorithms: [
    "transformer-block",
    "self-attention",
    "multi-head-attention",
    "masked-self-attention",
    "positional-encoding",
    "seq2seq",
  ],
  glossaryTerms: [
    "transformer",
    "encoder",
    "decoder",
    "cross-attention",
    "self-attention",
    "causal mask",
    "autoregressive",
    "attention is all you need",
  ],
  tags: [
    "deep-learning",
    "transformer",
    "encoder-decoder",
    "attention",
    "nlp",
    "expert",
  ],
};
