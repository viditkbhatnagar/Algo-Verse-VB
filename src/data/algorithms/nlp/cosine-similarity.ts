import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const cosineSimilarity: AlgorithmMetadata = {
  id: "cosine-similarity",
  name: "Cosine Similarity",
  category: "nlp",
  subcategory: "Text Representation",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(d)",
    average: "O(d)",
    worst: "O(d)",
    note: "Computing dot product and norms requires O(d) for d-dimensional vectors. For sparse vectors, O(nnz) where nnz is the number of non-zero elements.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Constant space beyond the input vectors: stores only the dot product and two magnitude values.",
  },
  description: `Cosine similarity measures the cosine of the angle between two vectors in multi-dimensional space. Unlike Euclidean distance, it captures directional similarity regardless of vector magnitude. The formula is: cos(A, B) = (A . B) / (|A| * |B|), where A . B is the dot product and |A|, |B| are the L2 norms. The result ranges from -1 (opposite directions) through 0 (orthogonal) to 1 (same direction).

In NLP, cosine similarity is the standard metric for comparing text representations. When documents are represented as TF-IDF or BoW vectors, cosine similarity effectively measures topic overlap while being invariant to document length. A 10-page document about "machine learning" and a 1-page abstract on the same topic will have high cosine similarity despite very different magnitudes. This length-invariance property is why cosine similarity dominates over Euclidean distance in text similarity.

For word embeddings, cosine similarity measures semantic relatedness. Words like "king" and "queen" have cosine similarity close to 1, while "king" and "banana" are near 0. In information retrieval, documents are ranked by cosine similarity to the query vector. Modern sentence embeddings (BERT, Sentence-BERT) are specifically trained so that cosine similarity correlates with human judgments of semantic similarity.`,
  shortDescription:
    "Measures the angle between two vectors to determine directional similarity, independent of magnitude -- the standard NLP similarity metric.",
  pseudocode: `procedure COSINE_SIMILARITY(vector_a, vector_b):
    // Compute dot product
    dot_product = 0
    for i = 0 to len(vector_a) - 1:
        dot_product += vector_a[i] * vector_b[i]

    // Compute magnitudes
    magnitude_a = sqrt(sum(a_i^2 for a_i in vector_a))
    magnitude_b = sqrt(sum(b_i^2 for b_i in vector_b))

    // Avoid division by zero
    if magnitude_a == 0 or magnitude_b == 0:
        return 0

    return dot_product / (magnitude_a * magnitude_b)
end procedure`,
  implementations: {
    python: `import numpy as np
from typing import List

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))

def pairwise_cosine(matrix: np.ndarray) -> np.ndarray:
    """Compute pairwise cosine similarity matrix."""
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    normalized = matrix / (norms + 1e-10)
    return normalized @ normalized.T

# Example: compare document vectors
docs = {
    "ML paper": np.array([3, 2, 0, 1, 0]),   # [ML, AI, cooking, math, recipe]
    "AI blog":  np.array([2, 3, 0, 0, 0]),
    "Recipe":   np.array([0, 0, 4, 0, 3]),
    "Math book": np.array([1, 1, 0, 5, 0]),
}

print("Cosine Similarities:")
names = list(docs.keys())
for i in range(len(names)):
    for j in range(i + 1, len(names)):
        sim = cosine_similarity(docs[names[i]], docs[names[j]])
        print(f"  {names[i]:>10} vs {names[j]:<10}: {sim:.4f}")`,
    javascript: `function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

function pairwiseSimilarity(docs) {
  const names = Object.keys(docs);
  const results = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const sim = cosineSimilarity(docs[names[i]], docs[names[j]]);
      results.push({ a: names[i], b: names[j], similarity: sim });
    }
  }
  return results.sort((a, b) => b.similarity - a.similarity);
}

// Example
const docs = {
  'ML paper': [3, 2, 0, 1, 0],
  'AI blog':  [2, 3, 0, 0, 0],
  'Recipe':   [0, 0, 4, 0, 3],
  'Math book': [1, 1, 0, 5, 0],
};

pairwiseSimilarity(docs).forEach(({ a, b, similarity }) =>
  console.log(\`\${a} vs \${b}: \${similarity.toFixed(4)}\`)
);`,
  },
  useCases: [
    "Information retrieval: ranking documents by relevance to a search query",
    "Duplicate detection: finding near-duplicate documents or plagiarism using embedding similarity",
    "Recommendation systems: suggesting similar items based on feature vector similarity",
    "Sentence similarity: comparing sentence embeddings for paraphrase detection and semantic search",
  ],
  relatedAlgorithms: [
    "tf-idf",
    "word-embeddings",
    "bag-of-words",
    "word2vec-cbow",
  ],
  glossaryTerms: [
    "cosine similarity",
    "dot product",
    "euclidean distance",
    "vector similarity",
    "L2 norm",
  ],
  tags: [
    "nlp",
    "similarity",
    "cosine",
    "information-retrieval",
    "beginner",
  ],
};
