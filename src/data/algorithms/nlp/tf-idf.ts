import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const tfIdf: AlgorithmMetadata = {
  id: "tf-idf",
  name: "TF-IDF",
  category: "nlp",
  subcategory: "Text Representation",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(D * L)",
    average: "O(D * L)",
    worst: "O(D * L)",
    note: "Requires one pass through all D documents of average length L to compute term frequencies and document frequencies. TF-IDF lookup per term is O(1) after precomputation.",
  },
  spaceComplexity: {
    best: "O(D * V)",
    average: "O(D * V)",
    worst: "O(D * V)",
    note: "Stores a sparse matrix of D documents by V vocabulary terms. In practice, sparse storage reduces this to O(nnz) where nnz is the number of non-zero entries.",
  },
  description: `TF-IDF (Term Frequency - Inverse Document Frequency) is a statistical measure that evaluates how important a word is to a document within a corpus. It combines two intuitions: a word is important to a document if it appears frequently in that document (high TF) but rarely across the corpus (high IDF). This elegantly down-weights common words like "the" and "is" while promoting discriminative terms.

The TF component measures how often a term appears in a document: TF(t,d) = count(t in d) / total_words(d). The IDF component measures rarity across the corpus: IDF(t) = log(N / DF(t)), where N is the total number of documents and DF(t) is the number of documents containing term t. The final TF-IDF score is: TF-IDF(t,d) = TF(t,d) * IDF(t).

TF-IDF remains one of the most widely used text representations despite being over 50 years old. It powers search engines (ranking documents by relevance to queries), recommendation systems, keyword extraction, and serves as a strong baseline for text classification. Common variants include sublinear TF scaling (1 + log(TF)), smooth IDF (log(1 + N/DF)), and L2-normalized vectors. The scikit-learn TfidfVectorizer is the standard implementation.`,
  shortDescription:
    "Weights terms by frequency in a document (TF) scaled by rarity across the corpus (IDF), highlighting discriminative words.",
  pseudocode: `procedure TF_IDF(corpus):
    N = len(corpus)
    vocabulary = build_vocabulary(corpus)

    // Compute document frequencies
    DF = {}
    for each term in vocabulary:
        DF[term] = count of documents containing term

    // Compute IDF
    IDF = {}
    for each term in vocabulary:
        IDF[term] = log(N / DF[term])

    // Compute TF-IDF for each document
    tfidf_matrix = []
    for each document in corpus:
        tokens = tokenize(document)
        total = len(tokens)
        vector = {}
        for each term in tokens:
            TF = count(term in tokens) / total
            vector[term] = TF * IDF[term]
        tfidf_matrix.append(vector)

    return tfidf_matrix
end procedure`,
  implementations: {
    python: `import math
from typing import List, Dict
from collections import Counter

def compute_tfidf(corpus: List[str]) -> tuple:
    """Compute TF-IDF matrix for a corpus."""
    # Tokenize
    docs = [doc.lower().split() for doc in corpus]
    N = len(docs)

    # Build vocabulary and document frequencies
    vocab = sorted(set(word for doc in docs for word in doc))
    df = Counter()
    for doc in docs:
        for word in set(doc):
            df[word] += 1

    # Compute IDF
    idf = {word: math.log(N / df[word]) for word in vocab}

    # Compute TF-IDF matrix
    tfidf = []
    for doc in docs:
        total = len(doc)
        tf = Counter(doc)
        vec = {word: (tf[word] / total) * idf[word] for word in vocab}
        tfidf.append(vec)

    return vocab, tfidf

# Example
corpus = [
    "the cat sat on the mat",
    "the dog chased the cat",
    "a bird sat on the fence"
]
vocab, tfidf = compute_tfidf(corpus)
for i, vec in enumerate(tfidf):
    top = sorted(vec.items(), key=lambda x: -x[1])[:3]
    print(f"Doc {i+1} top terms: {top}")`,
    javascript: `function computeTfIdf(corpus) {
  const docs = corpus.map(d => d.toLowerCase().split(' '));
  const N = docs.length;

  // Build vocabulary & document frequencies
  const vocab = [...new Set(docs.flat())].sort();
  const df = {};
  vocab.forEach(w => { df[w] = 0; });
  for (const doc of docs) {
    const unique = new Set(doc);
    for (const w of unique) df[w]++;
  }

  // Compute IDF
  const idf = {};
  for (const w of vocab) idf[w] = Math.log(N / df[w]);

  // Compute TF-IDF
  const tfidf = docs.map(doc => {
    const total = doc.length;
    const tf = {};
    for (const w of doc) tf[w] = (tf[w] || 0) + 1;
    const vec = {};
    for (const w of vocab) {
      vec[w] = ((tf[w] || 0) / total) * idf[w];
    }
    return vec;
  });

  return { vocab, tfidf };
}

const corpus = [
  'the cat sat on the mat',
  'the dog chased the cat',
  'a bird sat on the fence'
];
const { vocab, tfidf } = computeTfIdf(corpus);
console.log('Vocab:', vocab.length, 'terms');`,
  },
  useCases: [
    "Search engines: ranking documents by relevance to a query using TF-IDF cosine similarity",
    "Keyword extraction: identifying the most important terms in a document",
    "Document clustering: using TF-IDF vectors as features for K-means or hierarchical clustering",
    "Recommendation systems: finding similar articles or products based on text descriptions",
  ],
  relatedAlgorithms: [
    "bag-of-words",
    "cosine-similarity",
    "word-embeddings",
    "tokenization",
  ],
  glossaryTerms: [
    "tf-idf",
    "term frequency",
    "inverse document frequency",
    "document frequency",
    "information retrieval",
  ],
  tags: [
    "nlp",
    "text-representation",
    "tf-idf",
    "information-retrieval",
    "intermediate",
  ],
};
