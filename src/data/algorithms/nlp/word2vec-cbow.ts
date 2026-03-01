import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const word2vecCbow: AlgorithmMetadata = {
  id: "word2vec-cbow",
  name: "Word2Vec CBOW",
  category: "nlp",
  subcategory: "Text Representation",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(V * d)",
    average: "O(V * d)",
    worst: "O(V * d)",
    note: "Per training sample, the softmax over vocabulary V with embedding dimension d is O(V*d). With negative sampling, this reduces to O(k*d) where k is the number of negative samples (typically 5-20).",
  },
  spaceComplexity: {
    best: "O(V * d)",
    average: "O(V * d)",
    worst: "O(V * d)",
    note: "Stores two weight matrices: input embeddings (V x d) and output weights (V x d). Total space is O(2 * V * d).",
  },
  description: `Word2Vec CBOW (Continuous Bag of Words) is a neural network model that learns word embeddings by predicting a target word from its surrounding context words. Given a window of context words around a center position, CBOW averages their embedding vectors and uses this averaged representation to predict the center word. The architecture has three layers: an input projection layer, a hidden (averaging) layer, and an output softmax layer.

The training process slides a window of size 2c+1 across the corpus. For each position, the center word is the target and the 2c surrounding words are the context. The context word embeddings are looked up from the weight matrix W and averaged: h = (1/2c) * sum(W[context_i]). The output layer computes a softmax over the entire vocabulary: P(target | context) = softmax(W' * h), where W' is the output weight matrix. Training minimizes the negative log-likelihood.

CBOW is faster to train than Skip-gram because it combines multiple context words into a single prediction. It tends to produce better representations for frequent words since it effectively averages over many training examples. With negative sampling optimization, training becomes very efficient: instead of computing the full softmax over V words, only k negative samples are updated per training step.`,
  shortDescription:
    "A shallow neural network that predicts a target word from surrounding context words, learning dense word embeddings in the process.",
  pseudocode: `procedure TRAIN_CBOW(corpus, embedding_dim, window_size, epochs):
    V = vocabulary_size(corpus)
    W_in  = random_matrix(V, embedding_dim)   // input embeddings
    W_out = random_matrix(embedding_dim, V)    // output weights

    for epoch = 1 to epochs:
        for each position i in corpus:
            target = corpus[i]
            context = corpus[i-window..i-1] + corpus[i+1..i+window]

            // Forward pass
            h = average(W_in[c] for c in context)  // projection
            scores = W_out^T * h                     // raw scores
            probs = softmax(scores)                  // probabilities

            // Loss and backpropagation
            loss = -log(probs[target])
            gradient = probs
            gradient[target] -= 1
            update W_out -= lr * outer(h, gradient)
            update W_in[context] -= lr * (W_out * gradient) / len(context)

    return W_in  // final word embeddings
end procedure`,
  implementations: {
    python: `import numpy as np
from typing import List, Dict

class Word2VecCBOW:
    def __init__(self, vocab_size: int, embed_dim: int, lr: float = 0.01):
        self.V = vocab_size
        self.d = embed_dim
        self.W_in = np.random.randn(vocab_size, embed_dim) * 0.01
        self.W_out = np.random.randn(embed_dim, vocab_size) * 0.01
        self.lr = lr

    def forward(self, context_ids: List[int]) -> np.ndarray:
        # Average context embeddings
        self.h = np.mean(self.W_in[context_ids], axis=0)
        scores = self.W_out.T @ self.h
        # Softmax
        exp_scores = np.exp(scores - scores.max())
        self.probs = exp_scores / exp_scores.sum()
        return self.probs

    def backward(self, target_id: int, context_ids: List[int]):
        grad = self.probs.copy()
        grad[target_id] -= 1  # cross-entropy gradient

        # Update output weights
        self.W_out -= self.lr * np.outer(self.h, grad)

        # Update input embeddings for context words
        grad_h = self.W_out @ grad
        for cid in context_ids:
            self.W_in[cid] -= self.lr * grad_h / len(context_ids)

    def train_step(self, target_id: int, context_ids: List[int]) -> float:
        probs = self.forward(context_ids)
        loss = -np.log(probs[target_id] + 1e-10)
        self.backward(target_id, context_ids)
        return loss

# Example
model = Word2VecCBOW(vocab_size=100, embed_dim=10)
loss = model.train_step(target_id=5, context_ids=[2, 3, 7, 8])
print(f"Loss: {loss:.4f}")
print(f"Embedding shape: {model.W_in.shape}")`,
    javascript: `class Word2VecCBOW {
  constructor(vocabSize, embedDim, lr = 0.01) {
    this.V = vocabSize;
    this.d = embedDim;
    this.lr = lr;
    this.W_in = Array.from({ length: vocabSize }, () =>
      Array.from({ length: embedDim }, () => (Math.random() - 0.5) * 0.02)
    );
    this.W_out = Array.from({ length: embedDim }, () =>
      Array.from({ length: vocabSize }, () => (Math.random() - 0.5) * 0.02)
    );
  }

  forward(contextIds) {
    // Average context embeddings
    this.h = new Array(this.d).fill(0);
    for (const cid of contextIds) {
      for (let j = 0; j < this.d; j++) this.h[j] += this.W_in[cid][j];
    }
    for (let j = 0; j < this.d; j++) this.h[j] /= contextIds.length;

    // Scores and softmax
    const scores = new Array(this.V).fill(0);
    for (let v = 0; v < this.V; v++) {
      for (let j = 0; j < this.d; j++) scores[v] += this.W_out[j][v] * this.h[j];
    }
    const maxScore = Math.max(...scores);
    const expScores = scores.map(s => Math.exp(s - maxScore));
    const sum = expScores.reduce((a, b) => a + b, 0);
    this.probs = expScores.map(e => e / sum);
    return this.probs;
  }

  trainStep(targetId, contextIds) {
    const probs = this.forward(contextIds);
    const loss = -Math.log(probs[targetId] + 1e-10);
    // Backward pass (simplified)
    const grad = [...probs];
    grad[targetId] -= 1;
    return loss;
  }
}

const model = new Word2VecCBOW(100, 10);
console.log('Loss:', model.trainStep(5, [2, 3, 7, 8]).toFixed(4));`,
  },
  useCases: [
    "Learning word embeddings for downstream NLP tasks (classification, NER, parsing)",
    "Semantic similarity: finding words with similar meanings via embedding distance",
    "Feature extraction: converting text to dense vectors for machine learning models",
    "Analogy solving: king - man + woman = queen using learned vector arithmetic",
  ],
  relatedAlgorithms: [
    "word2vec-skip-gram",
    "word-embeddings",
    "one-hot-encoding",
    "cosine-similarity",
  ],
  glossaryTerms: [
    "word2vec",
    "cbow",
    "word embedding",
    "softmax",
    "negative sampling",
    "context window",
  ],
  tags: [
    "nlp",
    "embeddings",
    "word2vec",
    "neural-network",
    "intermediate",
  ],
};
