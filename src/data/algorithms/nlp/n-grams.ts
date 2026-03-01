import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const nGrams: AlgorithmMetadata = {
  id: "n-grams",
  name: "N-grams",
  category: "nlp",
  subcategory: "Text Preprocessing",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Single pass through the token sequence of length n. For each position, extracting the N-gram is O(N) but N is typically small (2-5), so overall is O(n * N) = O(n).",
  },
  spaceComplexity: {
    best: "O(n * N)",
    average: "O(n * N)",
    worst: "O(n * N)",
    note: "Stores up to (n - N + 1) N-grams, each of size N. For vocabulary-based storage, can be O(V^N) in the worst case.",
  },
  description: `N-grams are contiguous sequences of N items (characters, words, or tokens) extracted from text. Unigrams (N=1) are individual words, bigrams (N=2) capture word pairs, and trigrams (N=3) capture three-word sequences. N-grams are fundamental to statistical language models, where the probability of a word depends on the preceding N-1 words: P(w_n | w_1...w_{n-1}) ~ P(w_n | w_{n-N+1}...w_{n-1}).

The sliding window approach extracts N-grams by moving a window of size N across the token sequence, one position at a time. From L tokens, you get (L - N + 1) N-grams. For example, from "the cat sat on the mat" with N=2: ["the cat", "cat sat", "sat on", "on the", "the mat"]. N-gram frequency counts form the basis of statistical language models like Kneser-Ney smoothing.

N-grams capture local context but suffer from data sparsity: as N increases, many possible N-grams never appear in the training data. This necessitates smoothing techniques (Laplace, Good-Turing, Kneser-Ney) to handle unseen N-grams. Despite their simplicity, N-gram models remained the dominant approach in NLP and speech recognition until neural language models (Word2Vec, LSTM, Transformers) became practical.`,
  shortDescription:
    "Extracts contiguous sequences of N words from text using a sliding window, forming the basis of statistical language models.",
  pseudocode: `procedure EXTRACT_NGRAMS(tokens, n):
    ngrams = []
    for i = 0 to len(tokens) - n:
        ngram = tokens[i : i + n]
        ngrams.append(ngram)
    return ngrams

procedure BUILD_NGRAM_MODEL(corpus, n):
    counts = {}
    for each sentence in corpus:
        tokens = tokenize(sentence)
        for each ngram in EXTRACT_NGRAMS(tokens, n):
            counts[ngram] = counts.get(ngram, 0) + 1

    // Convert counts to probabilities
    for each ngram in counts:
        context = ngram[:-1]
        P(ngram) = counts[ngram] / sum(counts[ctx + w] for all w)

    return counts
end procedure`,
  implementations: {
    python: `from typing import List, Tuple, Dict
from collections import Counter

def extract_ngrams(tokens: List[str], n: int) -> List[Tuple[str, ...]]:
    """Extract all n-grams from a token list."""
    return [tuple(tokens[i:i + n]) for i in range(len(tokens) - n + 1)]

def build_ngram_model(corpus: List[str], n: int) -> Dict[Tuple, float]:
    """Build n-gram probability model from corpus."""
    # Count all n-grams
    ngram_counts = Counter()
    context_counts = Counter()

    for sentence in corpus:
        tokens = sentence.lower().split()
        for ngram in extract_ngrams(tokens, n):
            ngram_counts[ngram] += 1
            context_counts[ngram[:-1]] += 1

    # Compute probabilities: P(word | context)
    probs = {}
    for ngram, count in ngram_counts.items():
        context = ngram[:-1]
        probs[ngram] = count / context_counts[context]

    return probs

# Example
corpus = ["the cat sat on the mat", "the cat ate the fish"]
bigrams = extract_ngrams("the cat sat on the mat".split(), 2)
print("Bigrams:", bigrams)

model = build_ngram_model(corpus, 2)
for ngram, prob in sorted(model.items(), key=lambda x: -x[1])[:5]:
    print(f"P({ngram[-1]} | {ngram[:-1]}) = {prob:.3f}")`,
    javascript: `function extractNgrams(tokens, n) {
  const ngrams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n));
  }
  return ngrams;
}

function buildNgramModel(corpus, n) {
  const ngramCounts = new Map();
  const contextCounts = new Map();

  for (const sentence of corpus) {
    const tokens = sentence.toLowerCase().split(' ');
    for (const ngram of extractNgrams(tokens, n)) {
      const key = ngram.join(' ');
      const contextKey = ngram.slice(0, -1).join(' ');
      ngramCounts.set(key, (ngramCounts.get(key) || 0) + 1);
      contextCounts.set(contextKey, (contextCounts.get(contextKey) || 0) + 1);
    }
  }

  // Compute probabilities
  const probs = new Map();
  for (const [key, count] of ngramCounts) {
    const parts = key.split(' ');
    const contextKey = parts.slice(0, -1).join(' ');
    probs.set(key, count / contextCounts.get(contextKey));
  }
  return probs;
}

// Example
const corpus = ['the cat sat on the mat', 'the cat ate the fish'];
const bigrams = extractNgrams('the cat sat on the mat'.split(' '), 2);
console.log('Bigrams:', bigrams);`,
  },
  useCases: [
    "Statistical language modeling: predicting the next word in a sequence",
    "Spell checking: detecting unlikely character n-grams to flag misspellings",
    "Text classification: using n-gram features for spam detection and sentiment analysis",
    "Speech recognition: n-gram language models for decoding acoustic signals",
  ],
  relatedAlgorithms: [
    "tokenization",
    "bag-of-words",
    "tf-idf",
    "bpe",
  ],
  glossaryTerms: [
    "n-gram",
    "bigram",
    "trigram",
    "language model",
    "smoothing",
  ],
  tags: [
    "nlp",
    "text-preprocessing",
    "n-gram",
    "language-model",
    "beginner",
  ],
};
