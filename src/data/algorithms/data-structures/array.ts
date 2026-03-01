import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const array: AlgorithmMetadata = {
  id: "array",
  name: "Array",
  category: "data-structures",
  subcategory: "Linear",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Access by index is O(1). Insertion/deletion at an arbitrary position requires shifting elements, costing O(n).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Contiguous block of memory proportional to the number of elements.",
  },
  description: `An array is the most fundamental data structure in computer science — a contiguous block of memory that stores elements of the same type, accessible by integer indices. Because elements are stored in consecutive memory locations, accessing any element by its index takes constant time O(1): the address is calculated as base_address + index * element_size. This direct-access property is what makes arrays the backbone of nearly every other data structure.

The two key operations that distinguish arrays from more sophisticated structures are insertion and deletion at arbitrary positions. When you insert an element at index i, every element from index i onward must be shifted one position to the right to make room, costing O(n) in the worst case. Similarly, deleting the element at index i requires shifting all subsequent elements one position to the left. Insertion or deletion at the end, however, is O(1) because no shifting is needed.

Arrays come in two flavors: static arrays (fixed size, allocated once) and dynamic arrays (automatically resize when capacity is exceeded). In most high-level languages like Python (list), JavaScript (Array), and Java (ArrayList), the default "array" is actually a dynamic array under the hood. Understanding how a static array works — its strengths (O(1) access, cache-friendly) and weaknesses (costly mid-array insertions) — is essential for choosing the right data structure.

Arrays are used everywhere: as the foundation for stacks, queues, heaps, and hash tables; for implementing sorting and searching algorithms; in matrix operations and image processing; and as buffers in I/O systems. Mastering array operations is the first step toward understanding algorithmic complexity and data structure trade-offs.`,
  shortDescription:
    "A contiguous block of memory with O(1) index access and O(n) insertion/deletion at arbitrary positions.",
  pseudocode: `// Static Array Operations

access(array, index):
    return array[index]              // O(1)

insertAt(array, index, value):
    // Shift elements right from end to index
    for i = array.length - 1 down to index:
        array[i + 1] = array[i]
    array[index] = value
    array.length++                   // O(n)

deleteAt(array, index):
    // Shift elements left from index to end
    for i = index to array.length - 2:
        array[i] = array[i + 1]
    array.length--                   // O(n)

search(array, value):
    for i = 0 to array.length - 1:
        if array[i] == value:
            return i
    return -1                        // O(n)`,
  implementations: {
    python: `class StaticArray:
    """A simple static array implementation with fixed capacity."""

    def __init__(self, capacity: int):
        self._data = [None] * capacity
        self._size = 0
        self._capacity = capacity

    def access(self, index: int):
        """Access element at index. O(1)."""
        if index < 0 or index >= self._size:
            raise IndexError(f"Index {index} out of range [0, {self._size})")
        return self._data[index]

    def insert_at(self, index: int, value) -> None:
        """Insert value at index, shifting elements right. O(n)."""
        if self._size >= self._capacity:
            raise OverflowError("Array is full")
        if index < 0 or index > self._size:
            raise IndexError(f"Index {index} out of range [0, {self._size}]")
        # Shift right
        for i in range(self._size, index, -1):
            self._data[i] = self._data[i - 1]
        self._data[index] = value
        self._size += 1

    def delete_at(self, index: int):
        """Delete element at index, shifting elements left. O(n)."""
        if index < 0 or index >= self._size:
            raise IndexError(f"Index {index} out of range [0, {self._size})")
        value = self._data[index]
        for i in range(index, self._size - 1):
            self._data[i] = self._data[i + 1]
        self._data[self._size - 1] = None
        self._size -= 1
        return value

    def __repr__(self) -> str:
        return f"Array({list(self._data[:self._size])})"


# Example
arr = StaticArray(10)
arr.insert_at(0, 10)
arr.insert_at(1, 20)
arr.insert_at(2, 30)
print(arr)               # Array([10, 20, 30])
print(arr.access(1))     # 20
arr.insert_at(1, 15)
print(arr)               # Array([10, 15, 20, 30])
arr.delete_at(2)
print(arr)               # Array([10, 15, 30])`,
    javascript: `class StaticArray {
  /** A simple static array implementation with fixed capacity. */

  constructor(capacity) {
    this.data = new Array(capacity).fill(null);
    this.size = 0;
    this.capacity = capacity;
  }

  /** Access element at index. O(1). */
  access(index) {
    if (index < 0 || index >= this.size) {
      throw new RangeError(\`Index \${index} out of range [0, \${this.size})\`);
    }
    return this.data[index];
  }

  /** Insert value at index, shifting elements right. O(n). */
  insertAt(index, value) {
    if (this.size >= this.capacity) {
      throw new Error("Array is full");
    }
    if (index < 0 || index > this.size) {
      throw new RangeError(\`Index \${index} out of range [0, \${this.size}]\`);
    }
    for (let i = this.size; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }
    this.data[index] = value;
    this.size++;
  }

  /** Delete element at index, shifting elements left. O(n). */
  deleteAt(index) {
    if (index < 0 || index >= this.size) {
      throw new RangeError(\`Index \${index} out of range [0, \${this.size})\`);
    }
    const value = this.data[index];
    for (let i = index; i < this.size - 1; i++) {
      this.data[i] = this.data[i + 1];
    }
    this.data[this.size - 1] = null;
    this.size--;
    return value;
  }

  toString() {
    return \`Array(\${JSON.stringify(this.data.slice(0, this.size))})\`;
  }
}

// Example
const arr = new StaticArray(10);
arr.insertAt(0, 10);
arr.insertAt(1, 20);
arr.insertAt(2, 30);
console.log(arr.toString());  // Array([10, 20, 30])
console.log(arr.access(1));   // 20
arr.insertAt(1, 15);
console.log(arr.toString());  // Array([10, 15, 20, 30])
arr.deleteAt(2);
console.log(arr.toString());  // Array([10, 15, 30])`,
  },
  useCases: [
    "Random access — looking up any element by index in O(1), ideal for lookup tables and caches",
    "Foundation for other structures — stacks, queues, heaps, and hash tables are built on arrays",
    "Matrix operations — 2D arrays represent matrices for linear algebra, image processing, and game grids",
    "Sorting and searching — most classic algorithms (quicksort, binary search) operate on arrays",
    "Buffer storage — I/O buffers, audio samples, and pixel data are stored as contiguous arrays for cache efficiency",
  ],
  relatedAlgorithms: ["dynamic-array", "stack", "queue", "linked-list"],
  glossaryTerms: [
    "Array",
    "Index",
    "Contiguous Memory",
    "Random Access",
    "Cache Locality",
    "Static Array",
    "Shift",
  ],
  tags: [
    "array",
    "linear",
    "data structure",
    "random access",
    "contiguous",
    "beginner",
    "fundamental",
  ],
};
