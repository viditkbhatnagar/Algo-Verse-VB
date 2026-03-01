import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const bagOfWords: AlgorithmMetadata = {
  id: "bag-of-words",
  name: "Bag of Words",
  category: "nlp",
  subcategory: "Text Preprocessing",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Single pass through n words to count frequencies. Building the vocabulary is O(D * L) for D documents of average length L.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(D * V)",
    worst: "O(D * V)",
    note: "Stores a vector of size V (vocabulary) for each of D documents. Sparse representation reduces this significantly.",
  },
  description: `Bag of Words (BoW) is a text representation model that converts a document into a fixed-length vector based on word frequencies, completely discarding word order and grammar. Each unique word in the vocabulary becomes a dimension, and the value is the count (or binary presence) of that word in the document. The name "bag" reflects the metaphor of throwing all words into a bag where their positions are lost.

To construct a BoW representation: (1) Build a vocabulary from all unique words in the corpus. (2) For each document, count the occurrences of each vocabulary word. (3) Represent each document as a vector of these counts. For example, with vocabulary ["cat", "sat", "mat", "the"], the sentence "the cat sat on the mat" becomes [1, 1, 1, 2] (with "on" excluded or added to vocabulary).

Despite its simplicity and loss of sequential information, BoW is remarkably effective for many tasks. It serves as a baseline for document classification, spam filtering, and information retrieval. Common extensions include: binary BoW (presence/absence only), TF-IDF weighting (down-weighting common words), and N-gram BoW (using bigrams or trigrams as features). The main limitations are: large vocabulary leads to high-dimensional sparse vectors, no word order information, and no semantic understanding.`,
  shortDescription:
    "Represents text as a frequency vector over vocabulary words, discarding order -- the simplest text-to-vector model.",
  pseudocode: `procedure BAG_OF_WORDS(corpus):
    // Step 1: Build vocabulary
    vocabulary = set()
    for each document in corpus:
        tokens = tokenize(document)
        vocabulary = vocabulary union set(tokens)
    vocabulary = sorted(vocabulary)

    // Step 2: Vectorize each document
    vectors = []
    for each document in corpus:
        tokens = tokenize(document)
        vector = [0] * len(vocabulary)
        for each token in tokens:
            index = vocabulary.index(token)
            vector[index] += 1
        vectors.append(vector)

    return vocabulary, vectors
end procedure`,
  implementations: {
    python: `from typing import List, Dict, Tuple
from collections import Counter

def bag_of_words(corpus: List[str]) -> Tuple[List[str], List[List[int]]]:
    """Convert corpus to Bag of Words representation."""
    # Step 1: Build vocabulary
    vocab = set()
    tokenized = []
    for doc in corpus:
        tokens = doc.lower().split()
        tokenized.append(tokens)
        vocab.update(tokens)
    vocab_list = sorted(vocab)
    word_to_idx = {w: i for i, w in enumerate(vocab_list)}

    # Step 2: Vectorize
    vectors = []
    for tokens in tokenized:
        vec = [0] * len(vocab_list)
        for token in tokens:
            vec[word_to_idx[token]] += 1
        vectors.append(vec)

    return vocab_list, vectors

# Example
corpus = [
    "the cat sat on the mat",
    "the dog chased the cat",
    "the bird flew over the tree"
]

vocab, vectors = bag_of_words(corpus)
print(f"Vocabulary ({len(vocab)} words):", vocab)
for i, (doc, vec) in enumerate(zip(corpus, vectors)):
    print(f"Doc {i+1}: {vec}")`,
    javascript: `function bagOfWords(corpus) {
  // Step 1: Build vocabulary
  const vocab = new Set();
  const tokenized = corpus.map(doc => {
    const tokens = doc.toLowerCase().split(' ');
    tokens.forEach(t => vocab.add(t));
    return tokens;
  });
  const vocabList = [...vocab].sort();
  const wordToIdx = Object.fromEntries(vocabList.map((w, i) => [w, i]));

  // Step 2: Vectorize
  const vectors = tokenized.map(tokens => {
    const vec = new Array(vocabList.length).fill(0);
    for (const token of tokens) {
      vec[wordToIdx[token]]++;
    }
    return vec;
  });

  return { vocab: vocabList, vectors };
}

// Example
const corpus = [
  'the cat sat on the mat',
  'the dog chased the cat',
  'the bird flew over the tree'
];
const { vocab, vectors } = bagOfWords(corpus);
console.log('Vocabulary:', vocab);
vectors.forEach((v, i) => console.log(\`Doc \${i+1}:\`, v));`,
  },
  useCases: [
    "Document classification: converting documents to feature vectors for ML classifiers (Naive Bayes, SVM)",
    "Spam filtering: representing emails as word frequency vectors to detect spam patterns",
    "Sentiment analysis: using word presence/frequency to predict positive/negative sentiment",
    "Information retrieval: computing document similarity using cosine similarity on BoW vectors",
  ],
  relatedAlgorithms: [
    "tokenization",
    "tf-idf",
    "one-hot-encoding",
    "n-grams",
  ],
  glossaryTerms: [
    "bag of words",
    "vocabulary",
    "sparse vector",
    "term frequency",
    "document representation",
  ],
  tags: [
    "nlp",
    "text-preprocessing",
    "bag-of-words",
    "text-representation",
    "beginner",
  ],
};
