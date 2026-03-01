import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const word2vecSkipGram: AlgorithmMetadata = {
  id: "word2vec-skip-gram",
  name: "Word2Vec Skip-gram",
  category: "nlp",
  subcategory: "Text Representation",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(V * d)",
    average: "O(V * d)",
    worst: "O(c * V * d)",
    note: "Per training sample, computes softmax over vocabulary V with dimension d for each of 2c context positions. With negative sampling: O(c * k * d) where k << V.",
  },
  spaceComplexity: {
    best: "O(V * d)",
    average: "O(V * d)",
    worst: "O(V * d)",
    note: "Same as CBOW: two weight matrices of size V x d each.",
  },
  description: `Word2Vec Skip-gram is the counterpart to CBOW, predicting context words from a center (target) word. Given a target word, Skip-gram independently predicts each surrounding context word within a window. This reversal makes Skip-gram particularly effective at learning representations for rare and infrequent words, since each word gets its own dedicated training examples.

The model architecture is elegant: the target word is one-hot encoded and multiplied by the input weight matrix W to produce its embedding vector h = W[target]. This embedding is then used to predict each context word independently through the output weight matrix: P(context_i | target) = softmax(W' * h). The total loss is the sum of negative log-likelihoods for all context positions.

The key innovation of the original Word2Vec paper (Mikolov et al., 2013) was negative sampling, which approximates the full softmax. Instead of computing probabilities over the entire vocabulary, each training step only updates the target word, its actual context words (positive samples), and a small number of randomly sampled non-context words (negative samples). This reduces per-step complexity from O(V) to O(k), making training on billion-word corpora feasible.`,
  shortDescription:
    "Predicts surrounding context words from a center word, learning word embeddings that capture semantic relationships and analogies.",
  pseudocode: `procedure TRAIN_SKIPGRAM(corpus, embedding_dim, window, epochs):
    V = vocabulary_size(corpus)
    W_in  = random_matrix(V, embedding_dim)
    W_out = random_matrix(embedding_dim, V)

    for epoch = 1 to epochs:
        for each position i in corpus:
            target = corpus[i]
            h = W_in[target]  // embedding lookup

            for j = i - window to i + window (j != i):
                context_word = corpus[j]
                // Predict context from target
                scores = W_out^T * h
                probs = softmax(scores)
                loss = -log(probs[context_word])

                // Update weights
                gradient = probs
                gradient[context_word] -= 1
                W_out -= lr * outer(h, gradient)
                W_in[target] -= lr * (W_out * gradient)

    return W_in
end procedure`,
  implementations: {
    python: `import numpy as np
from typing import List

class Word2VecSkipGram:
    def __init__(self, vocab_size: int, embed_dim: int, lr: float = 0.01):
        self.V = vocab_size
        self.d = embed_dim
        self.lr = lr
        self.W_in = np.random.randn(vocab_size, embed_dim) * 0.01
        self.W_out = np.random.randn(embed_dim, vocab_size) * 0.01

    def _softmax(self, x: np.ndarray) -> np.ndarray:
        e = np.exp(x - x.max())
        return e / e.sum()

    def train_pair(self, target_id: int, context_id: int) -> float:
        """Train on a single (target, context) pair."""
        # Forward: embedding lookup
        h = self.W_in[target_id]
        scores = self.W_out.T @ h
        probs = self._softmax(scores)
        loss = -np.log(probs[context_id] + 1e-10)

        # Backward
        grad = probs.copy()
        grad[context_id] -= 1
        self.W_out -= self.lr * np.outer(h, grad)
        self.W_in[target_id] -= self.lr * (self.W_out @ grad)

        return loss

    def train_step(self, target_id: int, context_ids: List[int]) -> float:
        """Train on all context words for a target."""
        total_loss = 0.0
        for cid in context_ids:
            total_loss += self.train_pair(target_id, cid)
        return total_loss / len(context_ids)

    def most_similar(self, word_id: int, top_k: int = 5) -> List[int]:
        """Find most similar words by cosine similarity."""
        vec = self.W_in[word_id]
        norms = np.linalg.norm(self.W_in, axis=1)
        sims = (self.W_in @ vec) / (norms * np.linalg.norm(vec) + 1e-10)
        return np.argsort(-sims)[1:top_k+1].tolist()

# Example
model = Word2VecSkipGram(vocab_size=1000, embed_dim=50)
loss = model.train_step(target_id=42, context_ids=[10, 15, 55, 60])
print(f"Average loss: {loss:.4f}")`,
    javascript: `class Word2VecSkipGram {
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

  trainPair(targetId, contextId) {
    // Forward: embedding lookup
    const h = this.W_in[targetId];
    const scores = new Array(this.V).fill(0);
    for (let v = 0; v < this.V; v++) {
      for (let j = 0; j < this.d; j++) scores[v] += this.W_out[j][v] * h[j];
    }
    // Softmax
    const max = Math.max(...scores);
    const exp = scores.map(s => Math.exp(s - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    const probs = exp.map(e => e / sum);

    return -Math.log(probs[contextId] + 1e-10);
  }

  trainStep(targetId, contextIds) {
    let totalLoss = 0;
    for (const cid of contextIds) totalLoss += this.trainPair(targetId, cid);
    return totalLoss / contextIds.length;
  }
}

const model = new Word2VecSkipGram(1000, 50);
console.log('Loss:', model.trainStep(42, [10, 15, 55, 60]).toFixed(4));`,
  },
  useCases: [
    "Pre-training word embeddings for transfer learning to downstream NLP tasks",
    "Word analogy tasks: king - man + woman = queen via vector arithmetic",
    "Semantic search: finding semantically similar words in large vocabularies",
    "Rare word representation: Skip-gram excels where CBOW struggles with infrequent words",
  ],
  relatedAlgorithms: [
    "word2vec-cbow",
    "word-embeddings",
    "cosine-similarity",
    "one-hot-encoding",
  ],
  glossaryTerms: [
    "skip-gram",
    "word2vec",
    "negative sampling",
    "embedding",
    "context window",
    "softmax",
  ],
  tags: [
    "nlp",
    "embeddings",
    "word2vec",
    "skip-gram",
    "intermediate",
  ],
};
