import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const oneHotEncoding: AlgorithmMetadata = {
  id: "one-hot-encoding",
  name: "One-Hot Encoding",
  category: "nlp",
  subcategory: "Text Representation",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Building the vocabulary is O(n) for n total tokens. Encoding a single word requires creating a V-dimensional vector and setting one element.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(n * V)",
    worst: "O(n * V)",
    note: "Each of n encoded words produces a V-dimensional vector. Extremely sparse -- only one non-zero element per vector.",
  },
  description: `One-Hot Encoding is the simplest method to convert categorical data (like words) into numerical vectors. Each word in the vocabulary is assigned a unique integer index, and its one-hot vector is all zeros except for a 1 at that index position. For a vocabulary of size V, each word becomes a V-dimensional binary vector with exactly one non-zero entry.

For example, with vocabulary ["apple", "banana", "cat", "dog"]: "apple" = [1,0,0,0], "banana" = [0,1,0,0], "cat" = [0,0,1,0], "dog" = [0,0,0,1]. This encoding treats every word as equally different from every other word -- the cosine similarity between any two different one-hot vectors is always 0 (they are orthogonal).

One-hot encoding is the starting point for understanding why word embeddings are necessary. Its three fundamental limitations are: (1) High dimensionality -- a vocabulary of 100K words produces 100K-dimensional vectors, which is computationally expensive. (2) No semantic similarity -- "cat" and "dog" are just as different as "cat" and "democracy". (3) Extreme sparsity -- only 1 out of V elements is non-zero, wasting memory and computation. Dense word embeddings (Word2Vec, GloVe) address all these issues by learning compact representations.`,
  shortDescription:
    "Represents each word as a binary vector with a single 1 at the word's vocabulary index -- the simplest text encoding scheme.",
  pseudocode: `procedure ONE_HOT_ENCODE(word, vocabulary):
    V = len(vocabulary)
    vector = [0] * V
    index = vocabulary.index(word)
    vector[index] = 1
    return vector

procedure BUILD_ONE_HOT_MATRIX(tokens, vocabulary):
    matrix = []
    for each token in tokens:
        vector = ONE_HOT_ENCODE(token, vocabulary)
        matrix.append(vector)
    return matrix  // shape: (n_tokens, V)
end procedure`,
  implementations: {
    python: `from typing import List, Dict
import numpy as np

class OneHotEncoder:
    def __init__(self, vocabulary: List[str]):
        self.vocab = sorted(set(vocabulary))
        self.word_to_idx: Dict[str, int] = {w: i for i, w in enumerate(self.vocab)}
        self.V = len(self.vocab)

    def encode(self, word: str) -> np.ndarray:
        """Encode a single word as one-hot vector."""
        vec = np.zeros(self.V, dtype=int)
        if word in self.word_to_idx:
            vec[self.word_to_idx[word]] = 1
        return vec

    def encode_sequence(self, words: List[str]) -> np.ndarray:
        """Encode a sequence of words as a matrix."""
        return np.array([self.encode(w) for w in words])

    def decode(self, vector: np.ndarray) -> str:
        """Decode a one-hot vector back to a word."""
        idx = np.argmax(vector)
        return self.vocab[idx]

# Example
vocab = ["cat", "dog", "fish", "bird"]
encoder = OneHotEncoder(vocab)

for word in vocab:
    vec = encoder.encode(word)
    print(f"{word:>6} -> {vec.tolist()}")

# Show orthogonality
cat_vec = encoder.encode("cat")
dog_vec = encoder.encode("dog")
similarity = np.dot(cat_vec, dog_vec)
print(f"\\nSimilarity(cat, dog) = {similarity}  (always 0 for one-hot)")`,
    javascript: `class OneHotEncoder {
  constructor(vocabulary) {
    this.vocab = [...new Set(vocabulary)].sort();
    this.wordToIdx = Object.fromEntries(this.vocab.map((w, i) => [w, i]));
    this.V = this.vocab.length;
  }

  encode(word) {
    const vec = new Array(this.V).fill(0);
    if (word in this.wordToIdx) vec[this.wordToIdx[word]] = 1;
    return vec;
  }

  encodeSequence(words) {
    return words.map(w => this.encode(w));
  }

  decode(vector) {
    const idx = vector.indexOf(1);
    return idx >= 0 ? this.vocab[idx] : '<UNK>';
  }
}

// Example
const encoder = new OneHotEncoder(['cat', 'dog', 'fish', 'bird']);
for (const word of encoder.vocab) {
  console.log(\`\${word} -> [\${encoder.encode(word).join(', ')}]\`);
}

// Cosine similarity is always 0 between different words
const catVec = encoder.encode('cat');
const dogVec = encoder.encode('dog');
const dot = catVec.reduce((sum, v, i) => sum + v * dogVec[i], 0);
console.log('Similarity(cat, dog):', dot);`,
  },
  useCases: [
    "Input representation for neural networks: converting categorical features to numerical inputs",
    "Baseline encoding for NLP: serving as the starting representation before learning embeddings",
    "Categorical feature encoding in machine learning: converting labels to binary vectors for classifiers",
    "Multi-class classification output: target labels encoded as one-hot vectors for cross-entropy loss",
  ],
  relatedAlgorithms: [
    "word-embeddings",
    "bag-of-words",
    "word2vec-cbow",
    "word2vec-skip-gram",
  ],
  glossaryTerms: [
    "one-hot encoding",
    "sparse vector",
    "vocabulary",
    "categorical variable",
    "embedding",
  ],
  tags: [
    "nlp",
    "encoding",
    "one-hot",
    "representation",
    "beginner",
  ],
};
