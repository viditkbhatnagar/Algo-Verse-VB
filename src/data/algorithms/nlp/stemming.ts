import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const stemming: AlgorithmMetadata = {
  id: "stemming",
  name: "Stemming",
  category: "nlp",
  subcategory: "Text Preprocessing",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Each word is processed in constant time (suffix rule application). Total time is linear in the number of words n.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Per-word stemming uses constant space. The rule table is fixed-size.",
  },
  description: `Stemming is a text normalization technique that reduces words to their root or base form (called the stem) by removing suffixes and sometimes prefixes. The most widely used algorithm is the Porter Stemmer (1980), which applies a series of cascading rules to strip common English morphological suffixes like -ing, -tion, -ly, -ed, and -es.

The Porter Stemmer operates in five phases, each applying a set of transformation rules. For example: "running" -> "run" (remove -ning), "flies" -> "fli" (replace -ies with -i), "generalization" -> "general" (remove -ization). The rules are ordered by suffix length and applied greedily. A key concept is the "measure" m of a word -- the number of vowel-consonant sequences -- which determines whether a rule can fire.

Unlike lemmatization, stemming does not guarantee linguistically valid outputs. "happiness" stems to "happi", and "ponies" to "poni". Despite this, stemming is extremely fast and effective for information retrieval, where matching "connect", "connected", "connecting", and "connection" to the same stem dramatically improves recall. The Snowball framework generalizes Porter's approach to multiple languages.`,
  shortDescription:
    "Reduces words to their root form by removing suffixes using rule-based transformations like the Porter Stemmer.",
  pseudocode: `procedure PORTER_STEM(word):
    // Phase 1a: Plurals and -ed/-ing
    if word ends with "sses": replace with "ss"
    elif word ends with "ies": replace with "i"
    elif word ends with "s" (not "ss"): remove "s"

    if word ends with "eed": if measure > 0, remove "d"
    elif word ends with "ed" or "ing":
        if stem contains vowel:
            remove suffix
            // Cleanup: "at" -> "ate", "bl" -> "ble", "iz" -> "ize"
            if ends with double consonant (not l,s,z):
                remove last letter

    // Phase 1b-5: Additional suffix rules
    // ... (30+ additional rules)

    return word
end procedure`,
  implementations: {
    python: `class PorterStemmer:
    """Simplified Porter Stemmer implementation."""

    def __init__(self):
        self.vowels = set("aeiou")

    def _measure(self, stem: str) -> int:
        """Count VC (vowel-consonant) sequences."""
        m, prev_vowel = 0, False
        for c in stem:
            is_v = c in self.vowels
            if prev_vowel and not is_v:
                m += 1
            prev_vowel = is_v
        return m

    def _has_vowel(self, stem: str) -> bool:
        return any(c in self.vowels for c in stem)

    def stem(self, word: str) -> str:
        word = word.lower()

        # Phase 1a: plurals
        if word.endswith("sses"):
            word = word[:-2]
        elif word.endswith("ies"):
            word = word[:-2]
        elif word.endswith("s") and not word.endswith("ss"):
            word = word[:-1]

        # Phase 1b: -ed, -ing
        if word.endswith("eed"):
            if self._measure(word[:-3]) > 0:
                word = word[:-1]
        elif word.endswith("ed"):
            stem = word[:-2]
            if self._has_vowel(stem):
                word = stem
        elif word.endswith("ing"):
            stem = word[:-3]
            if self._has_vowel(stem):
                word = stem

        # Phase 2: -tion, -ness, etc. (simplified)
        suffixes = {"ational": "ate", "ization": "ize",
                    "fulness": "ful", "ousness": "ous"}
        for suffix, replacement in suffixes.items():
            if word.endswith(suffix):
                stem = word[:-len(suffix)]
                if self._measure(stem) > 0:
                    word = stem + replacement
                break

        return word

# Example
stemmer = PorterStemmer()
words = ["running", "flies", "happily", "connection"]
for w in words:
    print(f"{w} -> {stemmer.stem(w)}")`,
    javascript: `class PorterStemmer {
  constructor() {
    this.vowels = new Set('aeiou');
  }

  measure(stem) {
    let m = 0, prevVowel = false;
    for (const c of stem) {
      const isV = this.vowels.has(c);
      if (prevVowel && !isV) m++;
      prevVowel = isV;
    }
    return m;
  }

  hasVowel(stem) {
    return [...stem].some(c => this.vowels.has(c));
  }

  stem(word) {
    word = word.toLowerCase();

    // Phase 1a: plurals
    if (word.endsWith('sses')) word = word.slice(0, -2);
    else if (word.endsWith('ies')) word = word.slice(0, -2);
    else if (word.endsWith('s') && !word.endsWith('ss'))
      word = word.slice(0, -1);

    // Phase 1b: -ed, -ing
    if (word.endsWith('eed')) {
      if (this.measure(word.slice(0, -3)) > 0) word = word.slice(0, -1);
    } else if (word.endsWith('ed')) {
      const stem = word.slice(0, -2);
      if (this.hasVowel(stem)) word = stem;
    } else if (word.endsWith('ing')) {
      const stem = word.slice(0, -3);
      if (this.hasVowel(stem)) word = stem;
    }

    // Phase 2: common suffixes (simplified)
    const suffixes = { ational: 'ate', ization: 'ize', fulness: 'ful' };
    for (const [suffix, replacement] of Object.entries(suffixes)) {
      if (word.endsWith(suffix)) {
        const stem = word.slice(0, -suffix.length);
        if (this.measure(stem) > 0) word = stem + replacement;
        break;
      }
    }
    return word;
  }
}

const stemmer = new PorterStemmer();
['running', 'flies', 'happily', 'connection'].forEach(w =>
  console.log(\`\${w} -> \${stemmer.stem(w)}\`)
);`,
  },
  useCases: [
    "Information retrieval: matching documents containing 'connect', 'connected', 'connecting' to query 'connection'",
    "Text classification: reducing feature space by normalizing word forms",
    "Search engines: improving recall by matching morphological variants",
    "Spam filtering: normalizing text for consistent feature extraction",
  ],
  relatedAlgorithms: [
    "tokenization",
    "lemmatization",
    "bag-of-words",
    "tf-idf",
  ],
  glossaryTerms: [
    "stemming",
    "porter stemmer",
    "morphology",
    "suffix",
    "root form",
  ],
  tags: [
    "nlp",
    "text-preprocessing",
    "stemming",
    "beginner",
  ],
};
