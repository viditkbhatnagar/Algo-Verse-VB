import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const lemmatization: AlgorithmMetadata = {
  id: "lemmatization",
  name: "Lemmatization",
  category: "nlp",
  subcategory: "Text Preprocessing",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)",
    note: "Dictionary lookup is O(1) amortized. Morphological analysis of unknown words may take O(n) where n is word length. POS tagging adds overhead.",
  },
  spaceComplexity: {
    best: "O(V)",
    average: "O(V)",
    worst: "O(V)",
    note: "Requires a morphological dictionary of size V (vocabulary). WordNet-based lemmatizers load the full lexical database.",
  },
  description: `Lemmatization is a text normalization technique that reduces words to their canonical dictionary form, called the lemma. Unlike stemming, which blindly strips suffixes, lemmatization uses vocabulary and morphological analysis to ensure the output is always a valid word. For example, "better" lemmatizes to "good" (not "bet"), "mice" to "mouse", and "went" to "go".

A key requirement of lemmatization is knowing the part-of-speech (POS) tag of the word. The word "running" as a verb lemmatizes to "run", but as a noun ("the running of the bulls") it stays "running". This POS dependency means lemmatization typically requires a POS tagger as a preprocessing step, making it slower but more accurate than stemming.

The most common approach uses WordNet, a large lexical database of English. The WordNet lemmatizer looks up the word's morph exceptions table (irregular forms like "went" -> "go") and applies detachment rules based on POS (e.g., remove -ing for verbs, -s for nouns). SpaCy's lemmatizer uses lookup tables combined with rule-based systems. Modern approaches using neural networks (e.g., Stanza) can handle lemmatization across many languages without hand-crafted rules.`,
  shortDescription:
    "Reduces words to their dictionary form (lemma) using vocabulary lookup and morphological analysis, considering part-of-speech.",
  pseudocode: `procedure LEMMATIZE(word, pos_tag):
    // Step 1: Check irregular forms table
    if (word, pos_tag) in EXCEPTION_TABLE:
        return EXCEPTION_TABLE[(word, pos_tag)]

    // Step 2: Apply detachment rules based on POS
    if pos_tag is NOUN:
        rules = [("ses", "s"), ("xes", "x"), ("zes", "z"),
                 ("ches", "ch"), ("shes", "sh"), ("ies", "y"), ("s", "")]
    elif pos_tag is VERB:
        rules = [("ies", "y"), ("es", "e"), ("es", ""),
                 ("ed", "e"), ("ed", ""), ("ing", "e"), ("ing", "")]
    elif pos_tag is ADJ:
        rules = [("er", ""), ("est", ""), ("er", "e"), ("est", "e")]

    for (suffix, replacement) in rules:
        if word ends with suffix:
            candidate = word[:-len(suffix)] + replacement
            if candidate in DICTIONARY:
                return candidate

    return word  // return original if no rule applies
end procedure`,
  implementations: {
    python: `from typing import Dict, List, Optional

class SimpleLemmatizer:
    """Simplified dictionary-based lemmatizer."""

    def __init__(self):
        # Irregular forms lookup
        self.exceptions: Dict[str, Dict[str, str]] = {
            "VERB": {"went": "go", "are": "be", "was": "be",
                     "is": "be", "been": "be", "had": "have",
                     "ran": "run", "ate": "eat", "saw": "see"},
            "NOUN": {"mice": "mouse", "geese": "goose",
                     "teeth": "tooth", "children": "child",
                     "feet": "foot", "men": "man", "women": "woman"},
            "ADJ":  {"better": "good", "best": "good",
                     "worse": "bad", "worst": "bad"},
        }
        self.rules = {
            "VERB": [("ies", "y"), ("es", "e"), ("es", ""),
                     ("ed", "e"), ("ed", ""), ("ing", "e"), ("ing", ""),
                     ("s", "")],
            "NOUN": [("ses", "s"), ("ies", "y"), ("es", ""),
                     ("s", "")],
        }

    def lemmatize(self, word: str, pos: str = "NOUN") -> str:
        word_lower = word.lower()

        # Check exceptions first
        if pos in self.exceptions:
            if word_lower in self.exceptions[pos]:
                return self.exceptions[pos][word_lower]

        # Apply rules
        if pos in self.rules:
            for suffix, replacement in self.rules[pos]:
                if word_lower.endswith(suffix):
                    return word_lower[:-len(suffix)] + replacement

        return word_lower

# Example
lem = SimpleLemmatizer()
tests = [("running", "VERB"), ("better", "ADJ"), ("mice", "NOUN")]
for word, pos in tests:
    print(f"{word} ({pos}) -> {lem.lemmatize(word, pos)}")`,
    javascript: `class SimpleLemmatizer {
  constructor() {
    this.exceptions = {
      VERB: { went: 'go', are: 'be', was: 'be', is: 'be',
              ran: 'run', ate: 'eat', saw: 'see' },
      NOUN: { mice: 'mouse', geese: 'goose', teeth: 'tooth',
              children: 'child', feet: 'foot', men: 'man' },
      ADJ:  { better: 'good', best: 'good', worse: 'bad' },
    };
    this.rules = {
      VERB: [['ies','y'],['es','e'],['es',''],['ed','e'],
             ['ed',''],['ing','e'],['ing',''],['s','']],
      NOUN: [['ses','s'],['ies','y'],['es',''],['s','']],
    };
  }

  lemmatize(word, pos = 'NOUN') {
    const w = word.toLowerCase();
    // Check exceptions
    if (this.exceptions[pos]?.[w]) return this.exceptions[pos][w];
    // Apply rules
    const rules = this.rules[pos] || [];
    for (const [suffix, replacement] of rules) {
      if (w.endsWith(suffix)) {
        return w.slice(0, -suffix.length) + replacement;
      }
    }
    return w;
  }
}

const lem = new SimpleLemmatizer();
[['running','VERB'],['better','ADJ'],['mice','NOUN']].forEach(([w,p]) =>
  console.log(\`\${w} (\${p}) -> \${lem.lemmatize(w, p)}\`)
);`,
  },
  useCases: [
    "Text normalization for accurate NLP: ensuring 'went', 'goes', 'going' all map to 'go'",
    "Sentiment analysis: reducing word forms to improve feature quality over raw stemming",
    "Question answering: matching question terms to document terms via canonical forms",
    "Linguistic research: analyzing word frequency and usage patterns using base forms",
  ],
  relatedAlgorithms: [
    "tokenization",
    "stemming",
    "bag-of-words",
    "ner",
  ],
  glossaryTerms: [
    "lemma",
    "lemmatization",
    "part-of-speech",
    "morphology",
    "wordnet",
  ],
  tags: [
    "nlp",
    "text-preprocessing",
    "lemmatization",
    "beginner",
  ],
};
