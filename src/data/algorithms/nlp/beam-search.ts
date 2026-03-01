import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const beamSearch: AlgorithmMetadata = {
  id: "beam-search",
  name: "Beam Search",
  category: "nlp",
  subcategory: "NLP Tasks",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(T * B * V)",
    average: "O(T * B * V)",
    worst: "O(T * B * V)",
    note: "For T decoding steps, beam width B, and vocabulary size V. At each step, expand B beams by V candidates and select top B. With model inference: O(T * B * model_cost).",
  },
  spaceComplexity: {
    best: "O(T * B)",
    average: "O(T * B)",
    worst: "O(T * B * V)",
    note: "Stores B candidate sequences of up to length T. Keeping full score history for all candidates requires O(T * B * V).",
  },
  description: `Beam Search is a heuristic search algorithm used for decoding in sequence generation tasks. It maintains a fixed number of B (beam width) best partial hypotheses at each decoding step, exploring multiple candidate sequences simultaneously. This provides a balance between greedy search (B=1, fast but suboptimal) and exhaustive search (B=V^T, optimal but intractable).

At each time step, Beam Search: (1) Takes the current B best partial sequences. (2) Expands each by all V possible next tokens. (3) Scores all B*V candidates by their cumulative log probability. (4) Keeps only the top B candidates. This process continues until all beams produce an end-of-sequence token or reach the maximum length.

Key enhancements include: Length normalization -- dividing scores by sequence length to avoid bias toward shorter sequences: score = (1/T^alpha) * sum(log P(y_t | y_{<t})), where alpha is typically 0.6-1.0. Coverage penalty for translation -- encouraging the model to attend to all source tokens. Diverse beam search -- modifying scoring to produce more diverse output candidates. Beam search is used in machine translation, speech recognition, image captioning, and any auto-regressive generation task where quality matters more than speed.`,
  shortDescription:
    "Explores multiple candidate sequences simultaneously during decoding, keeping the top-k beams at each step for higher-quality text generation.",
  pseudocode: `procedure BEAM_SEARCH(model, prompt, beam_width, max_length):
    // Initialize with prompt
    beams = [(prompt, 0.0)]  // (sequence, cumulative_log_prob)

    for t = 1 to max_length:
        all_candidates = []

        for each (seq, score) in beams:
            if seq ends with <END>:
                all_candidates.append((seq, score))
                continue

            // Get next token probabilities from model
            log_probs = model.predict_next(seq)

            // Expand beam with all vocabulary items
            for each token, log_p in enumerate(log_probs):
                new_seq = seq + [token]
                new_score = score + log_p
                all_candidates.append((new_seq, new_score))

        // Keep top beam_width candidates
        all_candidates.sort(by=score, descending=True)
        beams = all_candidates[:beam_width]

        // Check if all beams have ended
        if all beams end with <END>:
            break

    // Length normalization
    for each (seq, score) in beams:
        score = score / len(seq)^alpha

    return beams[0]  // best sequence
end procedure`,
  implementations: {
    python: `import numpy as np
from typing import List, Tuple
import heapq

def beam_search(
    model_fn,  # fn(sequence) -> log_probs over vocab
    start_token: int,
    end_token: int,
    beam_width: int = 3,
    max_length: int = 20,
    length_penalty: float = 0.7,
) -> List[Tuple[List[int], float]]:
    """Beam search decoding."""

    # Each beam: (neg_score, sequence)
    beams = [(0.0, [start_token])]
    completed = []

    for _ in range(max_length):
        candidates = []

        for neg_score, seq in beams:
            if seq[-1] == end_token:
                # Normalize by length
                norm_score = neg_score / (len(seq) ** length_penalty)
                completed.append((norm_score, seq))
                continue

            # Get model predictions
            log_probs = model_fn(seq)

            # Expand with top-k tokens (efficiency optimization)
            top_k = min(beam_width * 2, len(log_probs))
            top_indices = np.argpartition(log_probs, -top_k)[-top_k:]

            for idx in top_indices:
                new_score = neg_score - log_probs[idx]  # negate for min-heap
                candidates.append((new_score, seq + [idx]))

        if not candidates:
            break

        # Keep top beam_width candidates
        candidates.sort(key=lambda x: x[0])
        beams = candidates[:beam_width]

    # Add remaining beams to completed
    for neg_score, seq in beams:
        norm_score = neg_score / (len(seq) ** length_penalty)
        completed.append((norm_score, seq))

    completed.sort(key=lambda x: x[0])
    return [(seq, -score) for score, seq in completed[:beam_width]]

# Example with dummy model
vocab_size = 10
def dummy_model(seq):
    np.random.seed(sum(seq) % 100)
    probs = np.random.dirichlet(np.ones(vocab_size))
    return np.log(probs + 1e-10)

results = beam_search(dummy_model, start_token=0, end_token=9,
                      beam_width=3, max_length=5)
for seq, score in results:
    print(f"Score: {score:.3f}, Sequence: {seq}")`,
    javascript: `function beamSearch(modelFn, startToken, endToken, beamWidth = 3, maxLen = 20) {
  let beams = [{ score: 0, seq: [startToken] }];
  const completed = [];

  for (let t = 0; t < maxLen; t++) {
    const candidates = [];

    for (const beam of beams) {
      if (beam.seq[beam.seq.length - 1] === endToken) {
        completed.push(beam);
        continue;
      }

      // Get predictions
      const logProbs = modelFn(beam.seq);

      // Expand with all tokens
      for (let v = 0; v < logProbs.length; v++) {
        candidates.push({
          score: beam.score + logProbs[v],
          seq: [...beam.seq, v],
        });
      }
    }

    if (candidates.length === 0) break;

    // Keep top beamWidth
    candidates.sort((a, b) => b.score - a.score);
    beams = candidates.slice(0, beamWidth);
  }

  // Add remaining + normalize
  const alpha = 0.7;
  const all = [...completed, ...beams].map(b => ({
    ...b,
    normScore: b.score / Math.pow(b.seq.length, alpha),
  }));
  all.sort((a, b) => b.normScore - a.normScore);
  return all.slice(0, beamWidth);
}

// Example
const vocabSize = 8;
function dummyModel(seq) {
  const probs = Array.from({ length: vocabSize }, () => Math.random());
  const sum = probs.reduce((a, b) => a + b, 0);
  return probs.map(p => Math.log(p / sum));
}

const results = beamSearch(dummyModel, 0, 7, 3, 5);
results.forEach(r => console.log(\`Score: \${r.normScore.toFixed(3)}, Seq: [\${r.seq}]\`));`,
  },
  useCases: [
    "Machine translation: generating the most likely target language sentence from source",
    "Speech recognition: decoding audio features into the most probable text transcription",
    "Image captioning: generating descriptive text for images using encoder-decoder models",
    "Text summarization: producing the best summary from an encoder-decoder summarization model",
  ],
  relatedAlgorithms: [
    "gpt-architecture",
    "bpe",
    "attention-visualization",
    "bert-architecture",
  ],
  glossaryTerms: [
    "beam search",
    "decoding",
    "beam width",
    "length normalization",
    "greedy search",
    "autoregressive",
  ],
  tags: [
    "nlp",
    "decoding",
    "beam-search",
    "text-generation",
    "intermediate",
  ],
};
