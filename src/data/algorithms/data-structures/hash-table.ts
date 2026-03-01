import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const hashTable: AlgorithmMetadata = {
  id: "hash-table",
  name: "Hash Table",
  category: "data-structures",
  subcategory: "Hash-Based",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)",
    note: "Average O(1) for insert, search, and delete assuming a good hash function and low load factor. Worst case O(n) when all keys collide into the same bucket.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Space for the underlying array plus storage for all key-value pairs. Resizing may temporarily double memory usage.",
  },
  description: `A hash table (also known as a hash map) is a data structure that implements an associative array, mapping keys to values. It uses a hash function to compute an index into an array of buckets, from which the desired value can be found. The key insight is that a well-designed hash function distributes keys uniformly across the array, enabling average-case O(1) time complexity for insertions, lookups, and deletions — making hash tables one of the most efficient data structures for unordered key-value storage.

The hash function is the heart of a hash table. It takes a key of arbitrary type and produces an integer index within the bounds of the underlying array. A good hash function is deterministic, distributes keys uniformly, and is fast to compute. Common approaches include the division method (key mod table_size), the multiplication method, and polynomial hashing for strings. Since different keys can produce the same hash (a collision), every hash table must have a collision resolution strategy.

The two primary collision resolution techniques are chaining and open addressing. In chaining, each bucket stores a linked list (or other collection) of all key-value pairs that hash to that index. Lookups traverse the chain at the computed index. In open addressing, when a collision occurs, the algorithm probes subsequent slots in the array using a probing sequence (linear probing, quadratic probing, or double hashing) until an empty slot is found. Chaining is simpler and degrades gracefully under high load factors, while open addressing offers better cache performance due to data locality.

Hash tables are the backbone of countless software systems. Python dictionaries, JavaScript objects and Maps, Java HashMaps, and C++ unordered_maps are all hash table implementations. They power database indexes for equality queries, caches (like memcached and Redis), symbol tables in compilers and interpreters, set operations (union, intersection, membership testing), counting frequencies, and de-duplication. Understanding hash tables — including load factor management, rehashing strategies, and the trade-offs between chaining and open addressing — is critical for writing performant code and acing technical interviews.`,
  shortDescription:
    "A key-value data structure using a hash function for average O(1) insertion, lookup, and deletion.",
  pseudocode: `// Hash Table with Chaining

class HashTable:
    size = 16
    count = 0
    buckets = array of size empty lists
    loadFactorThreshold = 0.75

    hash(key):
        // Simple polynomial hash for strings
        h = 0
        for each char in str(key):
            h = (h * 31 + charCode(char)) mod size
        return h

    put(key, value):
        if count / size >= loadFactorThreshold:
            resize(size * 2)
        index = hash(key)
        for each pair in buckets[index]:
            if pair.key == key:
                pair.value = value  // Update existing
                return
        buckets[index].append({key, value})
        count++

    get(key):
        index = hash(key)
        for each pair in buckets[index]:
            if pair.key == key:
                return pair.value
        return null  // Key not found

    remove(key):
        index = hash(key)
        for i, pair in enumerate(buckets[index]):
            if pair.key == key:
                buckets[index].removeAt(i)
                count--
                return true
        return false

    resize(newSize):
        oldBuckets = buckets
        size = newSize
        buckets = array of newSize empty lists
        count = 0
        for each bucket in oldBuckets:
            for each pair in bucket:
                put(pair.key, pair.value)`,
  implementations: {
    python: `class HashTable:
    """A hash table implementation using separate chaining for collision resolution."""

    def __init__(self, initial_capacity: int = 16, load_factor: float = 0.75):
        self._capacity: int = initial_capacity
        self._load_factor: float = load_factor
        self._size: int = 0
        self._buckets: list[list[tuple]] = [[] for _ in range(self._capacity)]

    def _hash(self, key) -> int:
        """Compute the bucket index for a given key."""
        return hash(key) % self._capacity

    def put(self, key, value) -> None:
        """Insert or update a key-value pair. O(1) average."""
        if self._size / self._capacity >= self._load_factor:
            self._resize(self._capacity * 2)

        index = self._hash(key)
        bucket = self._buckets[index]

        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)  # Update existing key
                return

        bucket.append((key, value))
        self._size += 1

    def get(self, key):
        """Retrieve the value for a key. Raises KeyError if not found. O(1) average."""
        index = self._hash(key)
        for k, v in self._buckets[index]:
            if k == key:
                return v
        raise KeyError(f"Key not found: {key}")

    def remove(self, key) -> bool:
        """Remove a key-value pair. Returns True if the key was found. O(1) average."""
        index = self._hash(key)
        bucket = self._buckets[index]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket.pop(i)
                self._size -= 1
                return True
        return False

    def contains(self, key) -> bool:
        """Return True if the key exists in the hash table. O(1) average."""
        index = self._hash(key)
        return any(k == key for k, _ in self._buckets[index])

    def keys(self) -> list:
        """Return all keys. O(n)."""
        return [k for bucket in self._buckets for k, _ in bucket]

    def values(self) -> list:
        """Return all values. O(n)."""
        return [v for bucket in self._buckets for _, v in bucket]

    def _resize(self, new_capacity: int) -> None:
        """Resize the internal array and rehash all entries."""
        old_buckets = self._buckets
        self._capacity = new_capacity
        self._buckets = [[] for _ in range(self._capacity)]
        self._size = 0
        for bucket in old_buckets:
            for key, value in bucket:
                self.put(key, value)

    def size(self) -> int:
        return self._size

    def is_empty(self) -> bool:
        return self._size == 0

    def __repr__(self) -> str:
        pairs = [f"{k}: {v}" for bucket in self._buckets for k, v in bucket]
        return "HashTable({" + ", ".join(pairs) + "})"


# Example usage
if __name__ == "__main__":
    ht = HashTable()
    ht.put("name", "Alice")
    ht.put("age", 30)
    ht.put("city", "Seattle")
    print(ht)                    # HashTable({name: Alice, age: 30, city: Seattle})
    print(ht.get("name"))        # Alice
    print(ht.contains("age"))    # True
    ht.remove("age")
    print(ht.contains("age"))    # False
    print(ht.keys())             # ['name', 'city']
    print(ht.size())             # 2`,
    javascript: `class HashTable {
  /**
   * A hash table implementation using separate chaining
   * for collision resolution.
   */

  constructor(initialCapacity = 16, loadFactor = 0.75) {
    this.capacity = initialCapacity;
    this.loadFactor = loadFactor;
    this.count = 0;
    this.buckets = Array.from({ length: this.capacity }, () => []);
  }

  /** Compute the bucket index for a given key. */
  _hash(key) {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) | 0; // 32-bit integer
    }
    return Math.abs(hash) % this.capacity;
  }

  /** Insert or update a key-value pair. O(1) average. */
  put(key, value) {
    if (this.count / this.capacity >= this.loadFactor) {
      this._resize(this.capacity * 2);
    }

    const index = this._hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value; // Update existing key
        return;
      }
    }

    bucket.push([key, value]);
    this.count++;
  }

  /** Retrieve the value for a key. Returns undefined if not found. O(1) average. */
  get(key) {
    const index = this._hash(key);
    for (const [k, v] of this.buckets[index]) {
      if (k === key) return v;
    }
    return undefined;
  }

  /** Remove a key-value pair. Returns true if the key was found. O(1) average. */
  remove(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.count--;
        return true;
      }
    }
    return false;
  }

  /** Return true if the key exists in the hash table. O(1) average. */
  contains(key) {
    const index = this._hash(key);
    return this.buckets[index].some(([k]) => k === key);
  }

  /** Return all keys. O(n). */
  keys() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const [k] of bucket) {
        result.push(k);
      }
    }
    return result;
  }

  /** Return all values. O(n). */
  values() {
    const result = [];
    for (const bucket of this.buckets) {
      for (const [, v] of bucket) {
        result.push(v);
      }
    }
    return result;
  }

  /** Resize the internal array and rehash all entries. */
  _resize(newCapacity) {
    const oldBuckets = this.buckets;
    this.capacity = newCapacity;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.count = 0;
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.put(key, value);
      }
    }
  }

  size() {
    return this.count;
  }

  isEmpty() {
    return this.count === 0;
  }

  toString() {
    const pairs = [];
    for (const bucket of this.buckets) {
      for (const [k, v] of bucket) {
        pairs.push(\`\${k}: \${v}\`);
      }
    }
    return \`HashTable({\${pairs.join(", ")}})\`;
  }
}

// Example usage
const ht = new HashTable();
ht.put("name", "Alice");
ht.put("age", 30);
ht.put("city", "Seattle");
console.log(ht.toString());     // HashTable({name: Alice, age: 30, city: Seattle})
console.log(ht.get("name"));    // Alice
console.log(ht.contains("age"));// true
ht.remove("age");
console.log(ht.contains("age"));// false
console.log(ht.keys());         // ['name', 'city']
console.log(ht.size());         // 2`,
  },
  useCases: [
    "Database indexing — hash indexes provide O(1) equality lookups, complementing B-tree indexes for range queries",
    "Caching — in-memory caches like Redis and memcached use hash tables for fast key-value retrieval",
    "Frequency counting — counting word frequencies, character occurrences, or event tallies in O(n) time",
    "De-duplication — detecting duplicate entries in datasets by checking membership in a hash set",
    "Symbol tables — compilers and interpreters use hash tables to store variable names, types, and scopes",
  ],
  relatedAlgorithms: ["linked-list", "binary-search-tree", "stack", "queue"],
  glossaryTerms: [
    "Hash Function",
    "Collision",
    "Chaining",
    "Open Addressing",
    "Load Factor",
    "Rehashing",
    "Bucket",
    "Linear Probing",
    "Quadratic Probing",
    "Double Hashing",
  ],
  tags: [
    "hash table",
    "hash map",
    "dictionary",
    "data structure",
    "key-value",
    "hashing",
    "intermediate",
    "associative array",
  ],
};
