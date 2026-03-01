import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const hashTableOpenAddressing: AlgorithmMetadata = {
  id: "hash-table-open-addressing",
  name: "Hash Table (Open Addressing)",
  category: "data-structures",
  subcategory: "Hash Tables",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)",
    note: "Average O(1) for insert, search, and delete when the load factor is kept below ~0.7. Worst case O(n) when many keys cluster together and the table is nearly full, requiring long probe sequences.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Stores all key-value pairs directly in the array, requiring no additional linked-list overhead. However, the table must maintain extra capacity (typically 30-50% free slots) for efficient probing.",
  },
  description: `Open addressing is a collision resolution strategy for hash tables where all key-value pairs are stored directly in the hash table array itself, rather than in auxiliary data structures like linked lists. When a collision occurs (two keys hash to the same index), the algorithm probes subsequent slots in the array following a deterministic sequence until an empty slot is found.

The simplest probing strategy is linear probing: h(key, i) = (h(key) + i) % tableSize, where i = 0, 1, 2, ... represents the probe number. Starting at the initial hash index, the algorithm checks each successive slot in sequence. Linear probing is cache-friendly because it accesses contiguous memory locations, but it suffers from primary clustering — long runs of occupied slots that grow over time, degrading performance.

Quadratic probing uses h(key, i) = (h(key) + c1*i + c2*i^2) % tableSize to spread probes more widely, reducing primary clustering. Double hashing uses a second hash function: h(key, i) = (h1(key) + i * h2(key)) % tableSize, which provides the most uniform probe distribution. Robin Hood hashing is a variant that minimizes probe-length variance by allowing a new key to "steal" a slot from an existing key that had a shorter probe sequence.

Open addressing offers excellent cache performance and memory efficiency since there are no pointer overheads. However, deletion is tricky — removed slots must be marked with a "tombstone" sentinel rather than simply emptied, because emptying a slot would break probe sequences for keys that were inserted after it. The load factor must be kept below approximately 0.7 for linear probing to maintain O(1) average-case performance. Languages like Python (for its internal dict implementation prior to 3.6), Rust (HashMap), and many embedded systems use open addressing for its predictable memory layout and cache efficiency.`,
  shortDescription:
    "A hash table collision resolution strategy that stores all entries in the array itself, probing subsequent slots on collision.",
  pseudocode: `// Hash Table with Open Addressing (Linear Probing)

class HashTableOA:
    size = 7
    count = 0
    keys = array of size nulls
    values = array of size nulls
    DELETED = sentinel marker

    hash(key):
        return key mod size

    probe(key, i):
        // Linear probing
        return (hash(key) + i) mod size

    put(key, value):
        if count >= size * 0.7:
            resize(size * 2)
        i = 0
        while i < size:
            index = probe(key, i)
            if keys[index] is null or keys[index] is DELETED:
                keys[index] = key
                values[index] = value
                count++
                return
            if keys[index] == key:
                values[index] = value  // Update
                return
            i++
        error "Table is full"

    get(key):
        i = 0
        while i < size:
            index = probe(key, i)
            if keys[index] is null:
                return null  // Not found
            if keys[index] == key:
                return values[index]
            i++  // Skip DELETED or different key
        return null

    remove(key):
        i = 0
        while i < size:
            index = probe(key, i)
            if keys[index] is null:
                return false
            if keys[index] == key:
                keys[index] = DELETED  // Tombstone
                count--
                return true
            i++
        return false`,
  implementations: {
    python: `class HashTableOA:
    """Hash table using open addressing with linear probing."""

    DELETED = object()  # Tombstone sentinel

    def __init__(self, capacity: int = 7):
        self.capacity = capacity
        self.count = 0
        self.keys: list = [None] * capacity
        self.values: list = [None] * capacity

    def _hash(self, key: int) -> int:
        return key % self.capacity

    def _probe(self, key: int, i: int) -> int:
        """Linear probing: h(key, i) = (h(key) + i) % capacity."""
        return (self._hash(key) + i) % self.capacity

    def put(self, key: int, value: str) -> None:
        """Insert or update a key-value pair."""
        if self.count >= self.capacity * 0.7:
            self._resize(self.capacity * 2 + 1)

        for i in range(self.capacity):
            index = self._probe(key, i)
            if self.keys[index] is None or self.keys[index] is self.DELETED:
                self.keys[index] = key
                self.values[index] = value
                self.count += 1
                return
            if self.keys[index] == key:
                self.values[index] = value  # Update existing
                return

        raise RuntimeError("Hash table is full")

    def get(self, key: int):
        """Retrieve value for a key. Returns None if not found."""
        for i in range(self.capacity):
            index = self._probe(key, i)
            if self.keys[index] is None:
                return None
            if self.keys[index] == key:
                return self.values[index]
        return None

    def remove(self, key: int) -> bool:
        """Remove a key. Uses tombstone (DELETED) marker."""
        for i in range(self.capacity):
            index = self._probe(key, i)
            if self.keys[index] is None:
                return False
            if self.keys[index] == key:
                self.keys[index] = self.DELETED
                self.values[index] = None
                self.count -= 1
                return True
        return False

    def _resize(self, new_capacity: int) -> None:
        old_keys, old_values = self.keys, self.values
        self.capacity = new_capacity
        self.keys = [None] * new_capacity
        self.values = [None] * new_capacity
        self.count = 0
        for k, v in zip(old_keys, old_values):
            if k is not None and k is not self.DELETED:
                self.put(k, v)

    def __repr__(self) -> str:
        pairs = []
        for k, v in zip(self.keys, self.values):
            if k is not None and k is not self.DELETED:
                pairs.append(f"{k}: {v}")
        return "HashTableOA({" + ", ".join(pairs) + "})"


# Example
ht = HashTableOA(7)
for key in [15, 25, 35, 10, 20]:
    ht.put(key, f"v{key}")
print(ht)           # HashTableOA({35: v35, 15: v15, 10: v10, 25: v25, 20: v20})
print(ht.get(25))   # v25
ht.remove(25)
print(ht.get(25))   # None`,
    javascript: `class HashTableOA {
  /** Hash table using open addressing with linear probing. */

  static DELETED = Symbol("DELETED");

  constructor(capacity = 7) {
    this.capacity = capacity;
    this.count = 0;
    this.keys = new Array(capacity).fill(null);
    this.values = new Array(capacity).fill(null);
  }

  _hash(key) {
    return key % this.capacity;
  }

  _probe(key, i) {
    // Linear probing: h(key, i) = (h(key) + i) % capacity
    return (this._hash(key) + i) % this.capacity;
  }

  put(key, value) {
    if (this.count >= this.capacity * 0.7) {
      this._resize(this.capacity * 2 + 1);
    }

    for (let i = 0; i < this.capacity; i++) {
      const index = this._probe(key, i);
      if (this.keys[index] === null || this.keys[index] === HashTableOA.DELETED) {
        this.keys[index] = key;
        this.values[index] = value;
        this.count++;
        return;
      }
      if (this.keys[index] === key) {
        this.values[index] = value; // Update existing
        return;
      }
    }
    throw new Error("Hash table is full");
  }

  get(key) {
    for (let i = 0; i < this.capacity; i++) {
      const index = this._probe(key, i);
      if (this.keys[index] === null) return undefined;
      if (this.keys[index] === key) return this.values[index];
    }
    return undefined;
  }

  remove(key) {
    for (let i = 0; i < this.capacity; i++) {
      const index = this._probe(key, i);
      if (this.keys[index] === null) return false;
      if (this.keys[index] === key) {
        this.keys[index] = HashTableOA.DELETED; // Tombstone
        this.values[index] = null;
        this.count--;
        return true;
      }
    }
    return false;
  }

  _resize(newCapacity) {
    const oldKeys = this.keys;
    const oldValues = this.values;
    this.capacity = newCapacity;
    this.keys = new Array(newCapacity).fill(null);
    this.values = new Array(newCapacity).fill(null);
    this.count = 0;
    for (let i = 0; i < oldKeys.length; i++) {
      if (oldKeys[i] !== null && oldKeys[i] !== HashTableOA.DELETED) {
        this.put(oldKeys[i], oldValues[i]);
      }
    }
  }

  toString() {
    const pairs = [];
    for (let i = 0; i < this.capacity; i++) {
      if (this.keys[i] !== null && this.keys[i] !== HashTableOA.DELETED) {
        pairs.push(\`\${this.keys[i]}: \${this.values[i]}\`);
      }
    }
    return \`HashTableOA({\${pairs.join(", ")}})\`;
  }
}

// Example
const ht = new HashTableOA(7);
[15, 25, 35, 10, 20].forEach((k) => ht.put(k, \`v\${k}\`));
console.log(ht.toString()); // HashTableOA({35: v35, 15: v15, 10: v10, 25: v25, 20: v20})
console.log(ht.get(25));    // v25
ht.remove(25);
console.log(ht.get(25));    // undefined`,
  },
  useCases: [
    "Cache-friendly key-value storage where memory access patterns matter (e.g., CPU caches, embedded systems)",
    "Compact hash maps in memory-constrained environments where pointer overhead of chaining is unacceptable",
    "Language runtime internals — Python's dict (pre-3.6), Rust's HashMap, Go's map all use variants of open addressing",
    "Real-time systems requiring predictable memory allocation without dynamic linked-list node creation",
    "String interning and symbol tables in compilers where fast lookups with minimal indirection are critical",
  ],
  relatedAlgorithms: ["hash-table", "binary-search-tree", "linked-list"],
  glossaryTerms: [
    "Open Addressing",
    "Linear Probing",
    "Quadratic Probing",
    "Double Hashing",
    "Tombstone",
    "Primary Clustering",
    "Load Factor",
    "Probe Sequence",
    "Robin Hood Hashing",
    "Rehashing",
  ],
  tags: [
    "hash table",
    "open addressing",
    "linear probing",
    "data structure",
    "collision resolution",
    "intermediate",
    "probing",
    "cache-friendly",
  ],
};
