import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const trie: AlgorithmMetadata = {
  id: "trie",
  name: "Trie (Prefix Tree)",
  category: "data-structures",
  subcategory: "Trees",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(m)",
    average: "O(m)",
    worst: "O(m)",
    note: "All operations (insert, search, delete) take O(m) time where m is the length of the key/word. This is independent of the number of keys stored in the trie.",
  },
  spaceComplexity: {
    best: "O(n * m)",
    average: "O(n * m)",
    worst: "O(n * m * ALPHABET_SIZE)",
    note: "Where n is the number of keys and m is the average key length. Space depends on how many prefixes are shared. Worst case occurs with no shared prefixes.",
  },
  description: `A Trie (pronounced "try", from reTRIEval) is a tree-like data structure used to store and retrieve strings efficiently. Unlike a binary search tree where each node stores a complete key, a trie stores keys character by character — each edge represents a single character, and the path from root to any node spells out a prefix of some stored key.

The root node represents the empty string. Each node can have up to ALPHABET_SIZE children (26 for lowercase English letters). A boolean flag at each node indicates whether the path from root to that node represents a complete stored word (not just a prefix). For example, if we insert "cat" and "car", the trie shares the path for "ca" and branches at the third character.

Insertion follows the path character by character, creating new nodes where necessary, and marks the final node as a word-ending node. Search follows the same path — if every character is found and the final node is marked as a word, the search succeeds. If the path breaks at any character, the word is not in the trie. Prefix search checks if the prefix path exists (without requiring a word-end marker).

Tries excel at prefix-based operations that hash tables cannot efficiently support: finding all words with a given prefix (auto-complete), longest common prefix, spell checking, and IP routing (longest prefix matching). The key advantage is that search time depends only on the length of the query, not on the number of stored strings.

Tries are used in search engines for auto-complete and query suggestion, in text editors for spell checking, in networking for IP routing tables (using binary tries), in bioinformatics for DNA sequence matching, and in compilers for keyword recognition. Compressed variants like Patricia tries and ternary search tries reduce space usage for sparse alphabets.`,
  shortDescription:
    "A tree where each edge represents a character, enabling O(m) insert/search operations and powerful prefix-based queries like auto-complete.",
  pseudocode: `// Trie (Prefix Tree)

class TrieNode:
    children = {}    // map: character -> TrieNode
    isEndOfWord = false

class Trie:
    root = TrieNode()

    insert(word):
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.isEndOfWord = true

    search(word):
        node = root
        for char in word:
            if char not in node.children:
                return false
            node = node.children[char]
        return node.isEndOfWord

    startsWith(prefix):
        node = root
        for char in prefix:
            if char not in node.children:
                return false
            node = node.children[char]
        return true

    delete(word):
        _delete(root, word, 0)

    _delete(node, word, depth):
        if depth == word.length:
            node.isEndOfWord = false
            return len(node.children) == 0
        char = word[depth]
        if char not in node.children:
            return false
        shouldDelete = _delete(node.children[char], word, depth + 1)
        if shouldDelete:
            delete node.children[char]
            return len(node.children) == 0 and not node.isEndOfWord
        return false`,
  implementations: {
    python: `class TrieNode:
    """A node in the trie."""

    __slots__ = ("children", "is_end")

    def __init__(self):
        self.children: dict[str, "TrieNode"] = {}
        self.is_end: bool = False


class Trie:
    """A trie (prefix tree) supporting insert, search, and prefix queries."""

    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """Insert a word into the trie. O(m) where m = len(word)."""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word: str) -> bool:
        """Return True if the word is in the trie. O(m)."""
        node = self._find_node(word)
        return node is not None and node.is_end

    def starts_with(self, prefix: str) -> bool:
        """Return True if any word starts with the given prefix. O(m)."""
        return self._find_node(prefix) is not None

    def _find_node(self, prefix: str) -> "TrieNode | None":
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node

    def get_words_with_prefix(self, prefix: str) -> list[str]:
        """Return all words that start with the given prefix."""
        node = self._find_node(prefix)
        if node is None:
            return []
        result: list[str] = []
        self._collect(node, prefix, result)
        return result

    def _collect(self, node: TrieNode, prefix: str, result: list[str]) -> None:
        if node.is_end:
            result.append(prefix)
        for char, child in sorted(node.children.items()):
            self._collect(child, prefix + char, result)


# Example usage
if __name__ == "__main__":
    trie = Trie()
    for word in ["cat", "car", "card", "care"]:
        trie.insert(word)
    print(trie.search("car"))     # True
    print(trie.search("cap"))     # False
    print(trie.starts_with("ca")) # True
    print(trie.get_words_with_prefix("car"))  # ["car", "card", "care"]`,
    javascript: `class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class Trie {
  /** A trie (prefix tree) supporting insert, search, and prefix queries. */

  constructor() {
    this.root = new TrieNode();
  }

  /** Insert a word into the trie. O(m) where m = word.length. */
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEnd = true;
  }

  /** Return true if the word is in the trie. O(m). */
  search(word) {
    const node = this._findNode(word);
    return node !== null && node.isEnd;
  }

  /** Return true if any word starts with the given prefix. O(m). */
  startsWith(prefix) {
    return this._findNode(prefix) !== null;
  }

  _findNode(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return null;
      node = node.children.get(char);
    }
    return node;
  }

  /** Return all words that start with the given prefix. */
  getWordsWithPrefix(prefix) {
    const node = this._findNode(prefix);
    if (!node) return [];
    const result = [];
    this._collect(node, prefix, result);
    return result;
  }

  _collect(node, prefix, result) {
    if (node.isEnd) result.push(prefix);
    for (const [char, child] of [...node.children.entries()].sort()) {
      this._collect(child, prefix + char, result);
    }
  }
}

// Example usage
const trie = new Trie();
["cat", "car", "card", "care"].forEach((w) => trie.insert(w));
console.log(trie.search("car"));     // true
console.log(trie.search("cap"));     // false
console.log(trie.startsWith("ca"));  // true
console.log(trie.getWordsWithPrefix("car")); // ["car", "card", "care"]`,
  },
  useCases: [
    "Auto-complete and search suggestions — quickly find all words matching a typed prefix",
    "Spell checking — verify if a word exists and suggest corrections by exploring nearby trie branches",
    "IP routing — longest prefix matching for routing table lookups in network routers",
    "DNA sequence analysis — store and search genetic sequences efficiently",
    "T9 predictive text — map phone key sequences to candidate words using a trie",
  ],
  relatedAlgorithms: ["binary-search-tree", "hash-table", "linked-list"],
  glossaryTerms: [
    "Trie",
    "Prefix Tree",
    "Edge Label",
    "End-of-Word Marker",
    "Prefix Search",
    "Auto-Complete",
    "Patricia Trie",
    "Radix Tree",
  ],
  tags: [
    "trie",
    "prefix tree",
    "tree",
    "data structure",
    "string",
    "auto-complete",
    "intermediate",
  ],
};
