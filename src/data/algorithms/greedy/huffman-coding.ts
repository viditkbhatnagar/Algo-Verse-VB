import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const huffmanCoding: AlgorithmMetadata = {
  id: "huffman-coding",
  name: "Huffman Coding",
  category: "greedy",
  subcategory: "Data Compression",
  difficulty: "advanced",
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    note: "Building the initial min-heap is O(n). Each of the (n-1) merge operations involves two extract-min and one insert, each O(log n).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "The Huffman tree has exactly 2n - 1 nodes (n leaves and n - 1 internal nodes). The priority queue stores at most n elements.",
  },
  description: `Huffman coding is a lossless data compression algorithm invented by David A. Huffman in 1952 while he was a Ph.D. student at MIT. It produces an optimal prefix-free binary code for a given set of characters with known frequencies, minimizing the total number of bits needed to encode a message.

The algorithm works by building a binary tree bottom-up. It starts by creating a leaf node for each character, weighted by its frequency. These nodes are placed in a min-priority queue. At each step, the two nodes with the lowest frequencies are extracted, merged into a new internal node whose frequency is the sum of its children, and the new node is inserted back into the queue. This process repeats until a single tree remains — the Huffman tree.

To encode a character, we traverse from the root to its leaf: going left adds a '0' bit and going right adds a '1' bit. The resulting code is a prefix-free code, meaning no codeword is a prefix of another, which allows unambiguous decoding. Frequent characters end up closer to the root (shorter codes), while rare characters end up deeper (longer codes), minimizing the expected encoding length.

Huffman coding achieves the theoretical minimum average code length for a given character frequency distribution (when restricted to integer bit lengths). It is optimal among all prefix codes, though arithmetic coding can achieve better compression by using fractional bits.

Huffman coding is used in DEFLATE (the basis for gzip and PNG), JPEG image compression, MP3 audio compression, and as a component in many other compression algorithms. Understanding Huffman coding is fundamental to information theory, data compression, and the study of greedy algorithms.`,
  shortDescription:
    "Builds an optimal prefix-free binary code by greedily merging the two least-frequent characters into a tree, producing shorter codes for more frequent characters.",
  pseudocode: `function HuffmanCoding(characters, frequencies):
    // Create leaf nodes and insert into min-heap
    PQ = MinPriorityQueue()
    for each (char, freq) in (characters, frequencies):
        node = new LeafNode(char, freq)
        PQ.insert(node, freq)

    // Build the tree by merging two smallest nodes
    while PQ.size > 1:
        left = PQ.extractMin()
        right = PQ.extractMin()

        merged = new InternalNode(
            freq = left.freq + right.freq,
            left = left,
            right = right
        )
        PQ.insert(merged, merged.freq)

    root = PQ.extractMin()

    // Generate codes by traversing the tree
    codes = {}
    function generateCodes(node, prefix = ""):
        if node is leaf:
            codes[node.char] = prefix
        else:
            generateCodes(node.left, prefix + "0")
            generateCodes(node.right, prefix + "1")

    generateCodes(root)
    return codes, root`,
  implementations: {
    python: `import heapq
from typing import Dict, Optional, Tuple


class HuffmanNode:
    """A node in the Huffman tree."""

    def __init__(
        self,
        freq: int,
        char: Optional[str] = None,
        left: Optional["HuffmanNode"] = None,
        right: Optional["HuffmanNode"] = None,
    ):
        self.freq = freq
        self.char = char
        self.left = left
        self.right = right

    def __lt__(self, other: "HuffmanNode") -> bool:
        return self.freq < other.freq

    @property
    def is_leaf(self) -> bool:
        return self.char is not None


def build_huffman_tree(freq_map: Dict[str, int]) -> HuffmanNode:
    """Build a Huffman tree from character frequencies."""
    heap = [HuffmanNode(freq, char) for char, freq in freq_map.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = HuffmanNode(left.freq + right.freq, left=left, right=right)
        heapq.heappush(heap, merged)

    return heap[0]


def generate_codes(
    root: HuffmanNode, prefix: str = ""
) -> Dict[str, str]:
    """Generate Huffman codes from the tree."""
    if root.is_leaf:
        return {root.char: prefix or "0"}

    codes: Dict[str, str] = {}
    if root.left:
        codes.update(generate_codes(root.left, prefix + "0"))
    if root.right:
        codes.update(generate_codes(root.right, prefix + "1"))
    return codes


# Example usage
if __name__ == "__main__":
    freq_map = {"a": 5, "b": 9, "c": 12, "d": 13, "e": 16, "f": 45}
    tree = build_huffman_tree(freq_map)
    codes = generate_codes(tree)

    print("Huffman Codes:")
    for char, code in sorted(codes.items()):
        print(f"  {char}: {code}")

    total_bits = sum(freq_map[c] * len(codes[c]) for c in freq_map)
    print(f"Total bits: {total_bits}")`,
    javascript: `class HuffmanNode {
  constructor(freq, char = null, left = null, right = null) {
    this.freq = freq;
    this.char = char;
    this.left = left;
    this.right = right;
  }

  get isLeaf() {
    return this.char !== null;
  }
}

/**
 * Build a Huffman tree from character frequencies.
 * @param {Object<string, number>} freqMap - { character: frequency }
 * @returns {HuffmanNode} Root of the Huffman tree
 */
function buildHuffmanTree(freqMap) {
  // Simple min-heap using sorted array
  const nodes = Object.entries(freqMap).map(
    ([char, freq]) => new HuffmanNode(freq, char)
  );

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const merged = new HuffmanNode(
      left.freq + right.freq, null, left, right
    );
    nodes.push(merged);
  }

  return nodes[0];
}

/**
 * Generate Huffman codes from the tree.
 * @param {HuffmanNode} root
 * @param {string} prefix
 * @returns {Object<string, string>}
 */
function generateCodes(root, prefix = "") {
  if (root.isLeaf) {
    return { [root.char]: prefix || "0" };
  }

  return {
    ...(root.left ? generateCodes(root.left, prefix + "0") : {}),
    ...(root.right ? generateCodes(root.right, prefix + "1") : {}),
  };
}

// Example usage
const freqMap = { a: 5, b: 9, c: 12, d: 13, e: 16, f: 45 };
const tree = buildHuffmanTree(freqMap);
const codes = generateCodes(tree);

console.log("Huffman Codes:");
for (const [char, code] of Object.entries(codes).sort()) {
  console.log(\`  \${char}: \${code}\`);
}

const totalBits = Object.entries(freqMap).reduce(
  (sum, [c, f]) => sum + f * codes[c].length, 0
);
console.log("Total bits:", totalBits);`,
  },
  useCases: [
    "File compression — DEFLATE algorithm (gzip, zlib, PNG) uses Huffman coding as a key component",
    "Image compression — JPEG uses Huffman coding for entropy coding of quantized DCT coefficients",
    "Audio compression — MP3 uses Huffman coding in its final encoding stage",
    "Network protocols — compressing HTTP headers (HPACK in HTTP/2 uses Huffman coding)",
    "Text encoding — efficient encoding of text files with skewed character distributions",
  ],
  relatedAlgorithms: [
    "activity-selection",
    "fractional-knapsack",
    "min-heap",
    "shannon-fano",
  ],
  glossaryTerms: [
    "prefix-free code",
    "entropy",
    "Huffman tree",
    "greedy algorithm",
    "lossless compression",
    "min-priority queue",
    "optimal prefix code",
    "variable-length code",
  ],
  tags: [
    "greedy",
    "compression",
    "tree",
    "priority-queue",
    "information-theory",
    "prefix-code",
    "classic",
    "advanced",
  ],
};
