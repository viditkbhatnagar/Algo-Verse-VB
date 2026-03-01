import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const wordEmbeddings: AlgorithmMetadata = {
  id: "word-embeddings",
  name: "Word Embeddings",
  category: "nlp",
  subcategory: "Text Representation",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Embedding lookup is O(1) per word. Training the embedding model varies: Word2Vec O(V*d) per step, GloVe O(|X|*d) for co-occurrence matrix X.",
  },
  spaceComplexity: {
    best: "O(V * d)",
    average: "O(V * d)",
    worst: "O(V * d)",
    note: "Stores V word vectors of dimension d. GloVe 300d with 400K vocabulary uses ~480MB. FastText adds subword vectors.",
  },
  description: `Word embeddings are dense, low-dimensional vector representations of words that capture semantic and syntactic relationships. Unlike sparse one-hot vectors (dimension = vocabulary size), embeddings map words to continuous vectors of typically 50-300 dimensions, where similar words are close together in the vector space. This is the distributional hypothesis in action: "you shall know a word by the company it keeps" (Firth, 1957).

The three major approaches to learning word embeddings are: (1) Word2Vec (Mikolov et al., 2013) -- trains a shallow neural network using either CBOW or Skip-gram on local context windows. (2) GloVe (Pennington et al., 2014) -- factorizes the global word co-occurrence matrix, combining the advantages of count-based and predictive models. (3) FastText (Bojanowski et al., 2017) -- extends Word2Vec by learning subword (character n-gram) embeddings, handling morphology and out-of-vocabulary words.

Word embeddings exhibit remarkable algebraic properties: vector("king") - vector("man") + vector("woman") approximately equals vector("queen"). This shows that embeddings encode analogical relationships as consistent vector offsets. Pre-trained embeddings (GloVe, FastText) are available for download and serve as initialization for most NLP models. Modern contextual embeddings (ELMo, BERT) produce different vectors for the same word in different contexts, but static embeddings remain valuable for their simplicity and efficiency.`,
  shortDescription:
    "Dense vector representations of words where semantic similarity corresponds to geometric proximity in the embedding space.",
  pseudocode: `// Word embedding usage (not training)
procedure GET_EMBEDDING(word, embedding_matrix):
    index = vocabulary.index(word)
    return embedding_matrix[index]  // d-dimensional vector

procedure FIND_SIMILAR(word, embedding_matrix, top_k):
    query_vec = GET_EMBEDDING(word)
    similarities = []
    for each other_word in vocabulary:
        other_vec = GET_EMBEDDING(other_word)
        sim = cosine_similarity(query_vec, other_vec)
        similarities.append((other_word, sim))
    return top_k highest similarities

procedure WORD_ANALOGY(a, b, c, embedding_matrix):
    // a is to b as c is to ?
    target = GET_EMBEDDING(b) - GET_EMBEDDING(a) + GET_EMBEDDING(c)
    return FIND_SIMILAR(target, embedding_matrix, top_k=1)
end procedure`,
  implementations: {
    python: `import numpy as np
from typing import List, Tuple, Dict

class WordEmbeddings:
    """Simple word embedding store with similarity operations."""

    def __init__(self, word_vectors: Dict[str, np.ndarray]):
        self.word_vectors = word_vectors
        self.vocab = list(word_vectors.keys())
        self.matrix = np.array([word_vectors[w] for w in self.vocab])
        # Pre-compute norms for fast cosine similarity
        self.norms = np.linalg.norm(self.matrix, axis=1, keepdims=True)

    def get_vector(self, word: str) -> np.ndarray:
        return self.word_vectors[word]

    def cosine_similarity(self, vec_a: np.ndarray, vec_b: np.ndarray) -> float:
        return float(np.dot(vec_a, vec_b) /
                     (np.linalg.norm(vec_a) * np.linalg.norm(vec_b) + 1e-10))

    def most_similar(self, word: str, top_k: int = 5) -> List[Tuple[str, float]]:
        vec = self.get_vector(word).reshape(1, -1)
        sims = (self.matrix @ vec.T).flatten() / (self.norms.flatten() *
                np.linalg.norm(vec) + 1e-10)
        indices = np.argsort(-sims)[1:top_k+1]
        return [(self.vocab[i], float(sims[i])) for i in indices]

    def analogy(self, a: str, b: str, c: str) -> List[Tuple[str, float]]:
        """a is to b as c is to ?"""
        target = self.get_vector(b) - self.get_vector(a) + self.get_vector(c)
        target_norm = target / (np.linalg.norm(target) + 1e-10)
        sims = (self.matrix @ target_norm) / (self.norms.flatten() + 1e-10)
        exclude = {a, b, c}
        results = [(self.vocab[i], float(sims[i]))
                   for i in np.argsort(-sims) if self.vocab[i] not in exclude]
        return results[:5]

# Example with random embeddings (use pre-trained in practice)
np.random.seed(42)
words = ["king", "queen", "man", "woman", "prince", "princess"]
vecs = {w: np.random.randn(50) for w in words}
emb = WordEmbeddings(vecs)
print("Most similar to 'king':", emb.most_similar("king", 3))`,
    javascript: `class WordEmbeddings {
  constructor(wordVectors) {
    this.wordVectors = wordVectors;
    this.vocab = Object.keys(wordVectors);
  }

  getVector(word) { return this.wordVectors[word]; }

  cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
  }

  mostSimilar(word, topK = 5) {
    const vec = this.getVector(word);
    const sims = this.vocab
      .filter(w => w !== word)
      .map(w => ({ word: w, sim: this.cosineSimilarity(vec, this.getVector(w)) }))
      .sort((a, b) => b.sim - a.sim);
    return sims.slice(0, topK);
  }

  analogy(a, b, c) {
    const va = this.getVector(a), vb = this.getVector(b), vc = this.getVector(c);
    const target = va.map((_, i) => vb[i] - va[i] + vc[i]);
    return this.vocab
      .filter(w => w !== a && w !== b && w !== c)
      .map(w => ({ word: w, sim: this.cosineSimilarity(target, this.getVector(w)) }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 5);
  }
}

// Example
const dim = 50;
const randVec = () => Array.from({ length: dim }, () => Math.random() - 0.5);
const vecs = { king: randVec(), queen: randVec(), man: randVec(), woman: randVec() };
const emb = new WordEmbeddings(vecs);
console.log('Similar to king:', emb.mostSimilar('king', 2));`,
  },
  useCases: [
    "Transfer learning: pre-trained embeddings as features for text classification, NER, and sentiment analysis",
    "Semantic search: finding documents/passages similar to a query using embedding similarity",
    "Word analogy and relationship discovery: exploring semantic relationships in language",
    "Cross-lingual NLP: aligned embeddings enable zero-shot transfer across languages",
  ],
  relatedAlgorithms: [
    "word2vec-cbow",
    "word2vec-skip-gram",
    "cosine-similarity",
    "one-hot-encoding",
  ],
  glossaryTerms: [
    "word embedding",
    "distributed representation",
    "GloVe",
    "FastText",
    "transfer learning",
    "cosine similarity",
  ],
  tags: [
    "nlp",
    "embeddings",
    "representation-learning",
    "intermediate",
  ],
};
