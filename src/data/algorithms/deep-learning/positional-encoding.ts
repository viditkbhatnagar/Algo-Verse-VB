import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const positionalEncoding: AlgorithmMetadata = {
  id: "positional-encoding",
  name: "Positional Encoding",
  category: "deep-learning",
  subcategory: "Transformer Architecture",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n * d)",
    average: "O(n * d)",
    worst: "O(n * d)",
    note: "n is the sequence length and d is the model dimension. Computing the sinusoidal values is O(1) per element, applied to an n x d matrix.",
  },
  spaceComplexity: {
    best: "O(n * d)",
    average: "O(n * d)",
    worst: "O(n * d)",
    note: "The positional encoding matrix is n x d. It can be precomputed and cached for a maximum sequence length.",
  },
  description: `Positional Encoding is a technique used in the Transformer architecture to inject information about the position of tokens in a sequence. Since the Transformer processes all tokens in parallel through self-attention (unlike RNNs which process sequentially), it has no inherent notion of token order. Positional encodings solve this by adding a position-dependent signal to each token's embedding vector.

The original Transformer uses sinusoidal positional encodings: PE(pos, 2i) = sin(pos / 10000^(2i/d_model)) for even dimensions and PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model)) for odd dimensions. The key property is that for any fixed offset k, PE(pos+k) can be represented as a linear function of PE(pos), allowing the model to easily learn to attend to relative positions. The wavelengths form a geometric progression from 2*pi to 10000*2*pi.

Alternative approaches include learned positional embeddings (used in BERT and GPT), which are trainable vectors for each position; Rotary Position Embedding (RoPE), which encodes position through rotation matrices applied to query and key vectors; and ALiBi, which adds a position-dependent bias directly to attention scores. Each approach offers different tradeoffs in terms of generalization to sequence lengths unseen during training.`,
  shortDescription:
    "Injects position information into token embeddings using sinusoidal functions, enabling Transformers to distinguish token order.",
  pseudocode: `procedure PositionalEncoding(maxLen, dModel):
    // Create PE matrix of shape (maxLen, dModel)
    PE = zeros(maxLen, dModel)

    for pos = 0 to maxLen - 1:
        for i = 0 to dModel/2 - 1:
            // Compute the angle
            angle = pos / (10000 ^ (2*i / dModel))

            // Even dimension: sine
            PE[pos][2*i] = sin(angle)

            // Odd dimension: cosine
            PE[pos][2*i + 1] = cos(angle)
        end for
    end for

    return PE
end procedure

procedure AddPositionalEncoding(embeddings, PE):
    // embeddings: (n, dModel) token embeddings
    // PE: precomputed positional encoding matrix
    return embeddings + PE[0:n]
end procedure`,
  implementations: {
    python: `import numpy as np

def positional_encoding(max_len, d_model):
    """
    Compute sinusoidal positional encoding.

    Args:
        max_len: Maximum sequence length
        d_model: Model dimension

    Returns:
        PE matrix of shape (max_len, d_model)
    """
    PE = np.zeros((max_len, d_model))
    position = np.arange(max_len)[:, np.newaxis]  # (max_len, 1)
    div_term = np.exp(
        np.arange(0, d_model, 2) * -(np.log(10000.0) / d_model)
    )  # (d_model/2,)

    PE[:, 0::2] = np.sin(position * div_term)  # even dimensions
    PE[:, 1::2] = np.cos(position * div_term)  # odd dimensions

    return PE

def add_positional_encoding(embeddings, PE):
    """Add positional encoding to token embeddings."""
    seq_len = embeddings.shape[0]
    return embeddings + PE[:seq_len]

# Example
if __name__ == "__main__":
    d_model = 16
    max_len = 10

    PE = positional_encoding(max_len, d_model)

    # Show PE for first 4 positions
    tokens = ["The", "cat", "sat", "down"]
    for i, token in enumerate(tokens):
        print(f"PE[{i}] ({token}): {np.round(PE[i, :4], 3)} ...")

    # Verify: dot product of nearby positions should be higher
    for d in range(1, 4):
        sim = np.dot(PE[0], PE[d])
        print(f"Similarity PE[0] . PE[{d}] = {sim:.4f}")`,
    javascript: `function positionalEncoding(maxLen, dModel) {
  const PE = Array.from({ length: maxLen }, () =>
    Array(dModel).fill(0)
  );

  for (let pos = 0; pos < maxLen; pos++) {
    for (let i = 0; i < dModel; i += 2) {
      const angle = pos / Math.pow(10000, i / dModel);
      PE[pos][i] = Math.sin(angle);
      if (i + 1 < dModel) {
        PE[pos][i + 1] = Math.cos(angle);
      }
    }
  }

  return PE;
}

function addPositionalEncoding(embeddings, PE) {
  return embeddings.map((emb, pos) =>
    emb.map((val, dim) => val + PE[pos][dim])
  );
}

// Example
const dModel = 16;
const maxLen = 10;
const PE = positionalEncoding(maxLen, dModel);

const tokens = ["The", "cat", "sat", "down"];
tokens.forEach((token, i) => {
  const peSlice = PE[i].slice(0, 4).map(v => v.toFixed(3));
  console.log(\`PE[\${i}] (\${token}): [\${peSlice.join(", ")}] ...\`);
});

// Dot product similarity
for (let d = 1; d <= 3; d++) {
  const sim = PE[0].reduce((s, v, i) => s + v * PE[d][i], 0);
  console.log(\`Similarity PE[0] . PE[\${d}] = \${sim.toFixed(4)}\`);
}`,
  },
  useCases: [
    "Transformer models: enabling position awareness in all self-attention-based architectures",
    "Machine translation: preserving word order information when processing source and target sequences",
    "Music generation: encoding temporal position of notes in a sequence",
    "Vision Transformers: encoding spatial position of image patches in 2D grids",
  ],
  relatedAlgorithms: [
    "self-attention",
    "multi-head-attention",
    "transformer-block",
    "full-transformer",
  ],
  glossaryTerms: [
    "positional encoding",
    "sinusoidal",
    "embedding",
    "transformer",
    "sequence",
    "position",
  ],
  tags: [
    "deep-learning",
    "transformer",
    "positional-encoding",
    "embedding",
    "nlp",
    "intermediate",
  ],
};
