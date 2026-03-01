import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const bpe: AlgorithmMetadata = {
  id: "bpe",
  name: "Byte Pair Encoding",
  category: "nlp",
  subcategory: "NLP Tasks",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * m)",
    average: "O(n * m * k)",
    worst: "O(n * m * k)",
    note: "Where n = corpus size, m = number of merge operations, k = average sequence length. Each merge requires scanning all sequences. Encoding a new word is O(k^2) for k characters.",
  },
  spaceComplexity: {
    best: "O(V + m)",
    average: "O(V + m)",
    worst: "O(V + m)",
    note: "Stores the base vocabulary V (character set) plus m learned merge rules. The merge table is typically 30K-50K entries.",
  },
  description: `Byte Pair Encoding (BPE) is a subword tokenization algorithm that builds a vocabulary of variable-length token units by iteratively merging the most frequent adjacent symbol pairs. Starting from individual characters, BPE greedily merges the most common pair at each step until the desired vocabulary size is reached. This approach naturally handles morphology: common words remain whole while rare words are split into meaningful subwords.

The algorithm works in two phases. Training: (1) Initialize vocabulary with all individual characters. (2) Count all adjacent symbol pairs across the corpus. (3) Merge the most frequent pair into a new symbol. (4) Repeat steps 2-3 for the desired number of merges. Encoding: apply the learned merges in order to tokenize new text. For example, after learning merges "l"+"o"="lo" and "lo"+"w"="low", the word "lowest" tokenizes as ["low", "est"].

BPE is used by GPT-2, RoBERTa, and many modern LLMs. Its key advantage is eliminating out-of-vocabulary (OOV) words: any word can be represented as a sequence of known subwords, down to individual characters if needed. Variants include WordPiece (used by BERT, which maximizes likelihood instead of frequency) and Unigram (used by SentencePiece, which starts with a large vocabulary and prunes). Typical vocabulary sizes are 30K-50K tokens.`,
  shortDescription:
    "Builds a subword vocabulary by iteratively merging the most frequent adjacent character pairs, enabling open-vocabulary tokenization.",
  pseudocode: `procedure TRAIN_BPE(corpus, num_merges):
    // Initialize with character-level vocabulary
    vocab = set of all characters in corpus + end-of-word marker
    words = split each corpus word into characters + </w>
    merge_rules = []

    for i = 1 to num_merges:
        // Count all adjacent pairs
        pair_counts = {}
        for each word, count in words:
            symbols = current tokenization of word
            for j = 0 to len(symbols) - 2:
                pair = (symbols[j], symbols[j+1])
                pair_counts[pair] += count

        // Find most frequent pair
        best_pair = argmax(pair_counts)
        if pair_counts[best_pair] < 2: break

        // Merge the pair everywhere
        new_symbol = best_pair[0] + best_pair[1]
        vocab.add(new_symbol)
        merge_rules.append(best_pair)

        // Replace all occurrences in word list
        for each word in words:
            replace adjacent (best_pair[0], best_pair[1]) with new_symbol

    return vocab, merge_rules

procedure ENCODE_BPE(word, merge_rules):
    symbols = list of characters in word + </w>
    for each (a, b) in merge_rules:
        i = 0
        while i < len(symbols) - 1:
            if symbols[i] == a and symbols[i+1] == b:
                symbols = symbols[:i] + [a+b] + symbols[i+2:]
            else:
                i += 1
    return symbols
end procedure`,
  implementations: {
    python: `from typing import List, Dict, Tuple
from collections import Counter, defaultdict

class BPETokenizer:
    def __init__(self):
        self.merges: List[Tuple[str, str]] = []
        self.vocab: set = set()

    def train(self, corpus: List[str], num_merges: int = 100):
        """Train BPE on a corpus."""
        # Initialize: split words into characters + end marker
        word_freqs = Counter()
        for text in corpus:
            for word in text.strip().split():
                word_freqs[" ".join(list(word)) + " </w>"] += 1

        self.vocab = set(c for word in word_freqs for c in word.split())

        for _ in range(num_merges):
            # Count adjacent pairs
            pairs = defaultdict(int)
            for word, freq in word_freqs.items():
                symbols = word.split()
                for i in range(len(symbols) - 1):
                    pairs[(symbols[i], symbols[i+1])] += freq

            if not pairs:
                break

            best = max(pairs, key=pairs.get)
            if pairs[best] < 2:
                break

            # Merge best pair
            merged = best[0] + best[1]
            self.merges.append(best)
            self.vocab.add(merged)

            # Apply merge to all words
            new_freqs = {}
            for word, freq in word_freqs.items():
                new_word = word.replace(f"{best[0]} {best[1]}", merged)
                new_freqs[new_word] = freq
            word_freqs = new_freqs

    def encode(self, word: str) -> List[str]:
        """Encode a word using learned merges."""
        symbols = list(word) + ["</w>"]
        for a, b in self.merges:
            i = 0
            while i < len(symbols) - 1:
                if symbols[i] == a and symbols[i+1] == b:
                    symbols = symbols[:i] + [a + b] + symbols[i+2:]
                else:
                    i += 1
        return symbols

# Example
tokenizer = BPETokenizer()
corpus = ["low low lowest newer wider new"]
tokenizer.train(corpus, num_merges=10)
print(f"Learned {len(tokenizer.merges)} merges:")
for a, b in tokenizer.merges:
    print(f"  '{a}' + '{b}' -> '{a+b}'")
print(f"\\nEncode 'lowest': {tokenizer.encode('lowest')}")
print(f"Encode 'newer':  {tokenizer.encode('newer')}")`,
    javascript: `class BPETokenizer {
  constructor() {
    this.merges = [];
    this.vocab = new Set();
  }

  train(corpus, numMerges = 100) {
    // Character-level initialization
    const wordFreqs = new Map();
    for (const text of corpus) {
      for (const word of text.trim().split(/\\s+/)) {
        const chars = word.split('').join(' ') + ' </w>';
        wordFreqs.set(chars, (wordFreqs.get(chars) || 0) + 1);
      }
    }

    for (let m = 0; m < numMerges; m++) {
      // Count pairs
      const pairs = new Map();
      for (const [word, freq] of wordFreqs) {
        const symbols = word.split(' ');
        for (let i = 0; i < symbols.length - 1; i++) {
          const pair = symbols[i] + '|' + symbols[i+1];
          pairs.set(pair, (pairs.get(pair) || 0) + freq);
        }
      }
      if (pairs.size === 0) break;

      // Find best pair
      let bestPair = '', bestCount = 0;
      for (const [pair, count] of pairs) {
        if (count > bestCount) { bestPair = pair; bestCount = count; }
      }
      if (bestCount < 2) break;

      const [a, b] = bestPair.split('|');
      this.merges.push([a, b]);
      this.vocab.add(a + b);

      // Apply merge
      const newFreqs = new Map();
      for (const [word, freq] of wordFreqs) {
        newFreqs.set(word.split(a + ' ' + b).join(a + b), freq);
      }
      wordFreqs.clear();
      for (const [k, v] of newFreqs) wordFreqs.set(k, v);
    }
  }

  encode(word) {
    let symbols = [...word.split(''), '</w>'];
    for (const [a, b] of this.merges) {
      const newSymbols = [];
      let i = 0;
      while (i < symbols.length) {
        if (i < symbols.length - 1 && symbols[i] === a && symbols[i+1] === b) {
          newSymbols.push(a + b);
          i += 2;
        } else { newSymbols.push(symbols[i]); i++; }
      }
      symbols = newSymbols;
    }
    return symbols;
  }
}

const tok = new BPETokenizer();
tok.train(['low low lowest newer wider new'], 10);
console.log('Merges:', tok.merges);
console.log('Encode "lowest":', tok.encode('lowest'));`,
  },
  useCases: [
    "Tokenization for language models: GPT-2, RoBERTa, and most modern LLMs use BPE-based tokenizers",
    "Handling rare and out-of-vocabulary words: subword decomposition eliminates OOV problems",
    "Machine translation: BPE handles morphologically rich languages by learning subword units",
    "Code tokenization: BPE adapts to programming languages by learning common token patterns",
  ],
  relatedAlgorithms: [
    "tokenization",
    "gpt-architecture",
    "bert-architecture",
    "n-grams",
  ],
  glossaryTerms: [
    "byte pair encoding",
    "BPE",
    "subword tokenization",
    "WordPiece",
    "SentencePiece",
    "vocabulary",
  ],
  tags: [
    "nlp",
    "tokenization",
    "bpe",
    "subword",
    "intermediate",
  ],
};
