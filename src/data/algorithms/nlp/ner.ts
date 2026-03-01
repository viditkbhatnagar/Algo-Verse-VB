import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const ner: AlgorithmMetadata = {
  id: "ner",
  name: "Named Entity Recognition",
  category: "nlp",
  subcategory: "NLP Tasks",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * K)",
    average: "O(n * K^2)",
    worst: "O(n * K^2)",
    note: "For sequence length n and K entity types. BiLSTM is O(n * d^2). CRF layer adds O(n * K^2) for Viterbi decoding. BERT-based NER: O(n^2 * d) from self-attention.",
  },
  spaceComplexity: {
    best: "O(n * K)",
    average: "O(n * K)",
    worst: "O(n * K + d^2)",
    note: "Stores emission scores (n * K) and transition matrix (K * K). BERT-based models add O(model_params) for the transformer weights.",
  },
  description: `Named Entity Recognition (NER) is a sequence labeling task that identifies and classifies named entities in text into predefined categories such as PERSON, ORGANIZATION, LOCATION, DATE, MONEY, and more. NER is a fundamental component of information extraction systems and is typically formulated as a token classification problem using the BIO (Beginning-Inside-Outside) or BIOES tagging scheme.

In the BIO scheme, each token is assigned a tag: B-TYPE marks the beginning of an entity, I-TYPE marks tokens inside an entity, and O marks non-entity tokens. For example: "Barack/B-PER Obama/I-PER visited/O Washington/B-LOC". This scheme handles multi-word entities and adjacent entities of the same type.

The state-of-the-art approach uses pre-trained language models (BERT, RoBERTa) with a token classification head. The model processes the input sequence through the transformer and adds a linear layer on top that predicts the BIO tag for each token. Traditional approaches used BiLSTM-CRF, where the BiLSTM captures contextual features and the CRF layer ensures valid tag transitions (e.g., I-PER cannot follow B-LOC). Fine-tuning BERT on NER datasets like CoNLL-2003 achieves F1 scores above 93%.`,
  shortDescription:
    "Identifies and classifies named entities (person, location, organization, etc.) in text using sequence labeling with BIO tagging.",
  pseudocode: `procedure NER_PREDICT(tokens):
    // Encode tokens with contextual model (BERT/BiLSTM)
    embeddings = ENCODER(tokens)  // shape: (n, d)

    // Linear classification layer
    logits = embeddings * W_classifier + b  // shape: (n, num_tags)

    // CRF decoding (or simple argmax)
    tags = VITERBI_DECODE(logits, transition_matrix)

    // Convert BIO tags to entity spans
    entities = []
    current_entity = null
    for i = 0 to len(tags) - 1:
        if tags[i] starts with "B-":
            if current_entity is not null:
                entities.append(current_entity)
            current_entity = {type: tags[i][2:], start: i, tokens: [tokens[i]]}
        elif tags[i] starts with "I-" and current_entity is not null:
            current_entity.tokens.append(tokens[i])
        else:
            if current_entity is not null:
                entities.append(current_entity)
                current_entity = null

    return entities
end procedure`,
  implementations: {
    python: `from typing import List, Dict, Tuple

class SimpleNER:
    """Rule-based NER for demonstration (real systems use neural models)."""

    def __init__(self):
        self.person_names = {"barack", "obama", "john", "smith", "alice"}
        self.locations = {"washington", "london", "paris", "new", "york"}
        self.orgs = {"google", "microsoft", "apple", "amazon", "nasa"}
        self.date_words = {"january", "february", "monday", "tuesday"}

    def predict(self, tokens: List[str]) -> List[Dict]:
        tags = []
        i = 0
        while i < len(tokens):
            token_lower = tokens[i].lower()
            if token_lower in self.person_names:
                tags.append(f"B-PER")
                # Check for multi-word name
                while i + 1 < len(tokens) and tokens[i+1].lower() in self.person_names:
                    i += 1
                    tags.append("I-PER")
            elif token_lower in self.locations:
                tags.append("B-LOC")
            elif token_lower in self.orgs:
                tags.append("B-ORG")
            elif token_lower in self.date_words:
                tags.append("B-DATE")
            else:
                tags.append("O")
            i += 1

        # Extract entity spans
        entities = []
        current = None
        for i, tag in enumerate(tags):
            if tag.startswith("B-"):
                if current:
                    entities.append(current)
                current = {"type": tag[2:], "start": i,
                          "text": tokens[i]}
            elif tag.startswith("I-") and current:
                current["text"] += " " + tokens[i]
            else:
                if current:
                    entities.append(current)
                    current = None
        if current:
            entities.append(current)

        return tags, entities

# Example
ner = SimpleNER()
text = "Barack Obama visited Washington on January 20".split()
tags, entities = ner.predict(text)
for token, tag in zip(text, tags):
    print(f"{token:>12} -> {tag}")
print("\\nEntities:", entities)`,
    javascript: `class SimpleNER {
  constructor() {
    this.personNames = new Set(['barack','obama','john','smith','alice']);
    this.locations = new Set(['washington','london','paris','new','york']);
    this.orgs = new Set(['google','microsoft','apple','amazon','nasa']);
    this.dateWords = new Set(['january','february','monday','tuesday']);
  }

  predict(tokens) {
    const tags = [];
    for (let i = 0; i < tokens.length; i++) {
      const lower = tokens[i].toLowerCase();
      if (this.personNames.has(lower)) {
        tags.push(tags.length > 0 && tags[tags.length-1].endsWith('PER') ? 'I-PER' : 'B-PER');
      } else if (this.locations.has(lower)) tags.push('B-LOC');
      else if (this.orgs.has(lower)) tags.push('B-ORG');
      else if (this.dateWords.has(lower)) tags.push('B-DATE');
      else tags.push('O');
    }

    // Extract entities
    const entities = [];
    let current = null;
    tags.forEach((tag, i) => {
      if (tag.startsWith('B-')) {
        if (current) entities.push(current);
        current = { type: tag.slice(2), start: i, text: tokens[i] };
      } else if (tag.startsWith('I-') && current) {
        current.text += ' ' + tokens[i];
      } else {
        if (current) { entities.push(current); current = null; }
      }
    });
    if (current) entities.push(current);

    return { tags, entities };
  }
}

const ner = new SimpleNER();
const text = 'Barack Obama visited Washington on January 20'.split(' ');
const { tags, entities } = ner.predict(text);
text.forEach((t, i) => console.log(\`\${t} -> \${tags[i]}\`));
console.log('Entities:', entities);`,
  },
  useCases: [
    "Information extraction: automatically extracting people, organizations, and locations from news articles",
    "Knowledge graph construction: populating entity databases from unstructured text",
    "Question answering: identifying entity types in questions to guide answer extraction",
    "Medical NLP: extracting drug names, diseases, and symptoms from clinical notes",
  ],
  relatedAlgorithms: [
    "bert-architecture",
    "tokenization",
    "attention-visualization",
    "lemmatization",
  ],
  glossaryTerms: [
    "named entity recognition",
    "NER",
    "BIO tagging",
    "sequence labeling",
    "CRF",
    "token classification",
  ],
  tags: [
    "nlp",
    "ner",
    "sequence-labeling",
    "information-extraction",
    "intermediate",
  ],
};
