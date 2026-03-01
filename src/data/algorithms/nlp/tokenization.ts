import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const tokenization: AlgorithmMetadata = {
  id: "tokenization",
  name: "Tokenization",
  category: "nlp",
  subcategory: "Text Preprocessing",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Linear scan through the input string of length n. Whitespace tokenization is O(n); regex-based tokenizers may have higher constants but remain linear.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Stores the list of output tokens. In the worst case (every character is a token), space equals input length.",
  },
  description: `Tokenization is the foundational step in Natural Language Processing that splits raw text into individual meaningful units called tokens. These tokens can be words, subwords, characters, or even sentences, depending on the tokenization strategy. Every NLP pipeline begins with tokenization because models cannot process raw strings directly -- they need discrete, well-defined units.

The simplest approach is whitespace tokenization, which splits on spaces and punctuation. However, real-world text requires more sophisticated handling: contractions ("don't" -> "do" + "n't"), hyphenated words, URLs, emojis, and multilingual text. Rule-based tokenizers like those in NLTK and spaCy use language-specific patterns and exception lists to handle these edge cases.

Modern NLP systems often use subword tokenization (BPE, WordPiece, SentencePiece) which breaks words into smaller units. This approach handles out-of-vocabulary words gracefully and provides a good balance between vocabulary size and sequence length. For example, "unhappiness" might be tokenized as ["un", "happiness"] or ["un", "happ", "iness"] depending on the learned vocabulary.`,
  shortDescription:
    "Splits raw text into individual tokens (words, subwords, or characters) as the first step in any NLP pipeline.",
  pseudocode: `procedure TOKENIZE(text):
    tokens = []
    current_token = ""

    for each character c in text:
        if c is whitespace or punctuation:
            if current_token is not empty:
                tokens.append(current_token)
                current_token = ""
            if c is punctuation:
                tokens.append(c)
        else:
            current_token += c

    if current_token is not empty:
        tokens.append(current_token)

    return tokens
end procedure`,
  implementations: {
    python: `import re
from typing import List

def whitespace_tokenize(text: str) -> List[str]:
    """Simple whitespace + punctuation tokenizer."""
    # Split on whitespace and keep punctuation as separate tokens
    pattern = r"\\w+|[^\\w\\s]"
    return re.findall(pattern, text)

def word_tokenize(text: str) -> List[str]:
    """Enhanced tokenizer handling contractions and special cases."""
    # Handle contractions
    text = re.sub(r"(\\w)'(\\w)", r"\\1 '\\2", text)
    # Handle punctuation
    text = re.sub(r"([^\\w\\s])", r" \\1 ", text)
    return text.split()

# Example
text = "The cat's out! Don't worry."
print("Whitespace:", whitespace_tokenize(text))
print("Word:", word_tokenize(text))`,
    javascript: `function whitespaceTokenize(text) {
  // Split on whitespace and keep punctuation as separate tokens
  return text.match(/\\w+|[^\\w\\s]/g) || [];
}

function wordTokenize(text) {
  // Handle contractions
  text = text.replace(/(\\w)'(\\w)/g, "$1 '$2");
  // Handle punctuation
  text = text.replace(/([^\\w\\s])/g, " $1 ");
  return text.split(/\\s+/).filter(t => t.length > 0);
}

// Example
const text = "The cat's out! Don't worry.";
console.log("Whitespace:", whitespaceTokenize(text));
console.log("Word:", wordTokenize(text));`,
  },
  useCases: [
    "Text preprocessing for any NLP pipeline (sentiment analysis, translation, summarization)",
    "Search engine indexing: breaking documents into searchable tokens",
    "Chatbot input processing: splitting user messages into processable units",
    "Code parsing: tokenizing source code into keywords, identifiers, and operators",
  ],
  relatedAlgorithms: [
    "stemming",
    "lemmatization",
    "bpe",
    "bag-of-words",
  ],
  glossaryTerms: [
    "token",
    "tokenization",
    "vocabulary",
    "corpus",
    "preprocessing",
  ],
  tags: [
    "nlp",
    "text-preprocessing",
    "tokenization",
    "beginner",
  ],
};
