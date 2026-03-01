import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const dynamicArray: AlgorithmMetadata = {
  id: "dynamic-array",
  name: "Dynamic Array",
  category: "data-structures",
  subcategory: "Linear",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)",
    note: "Append is O(1) amortized. Worst case O(n) occurs when the internal array must be resized (copied to a larger array). Access by index is always O(1).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(2n)",
    note: "During a resize, both the old and new arrays exist briefly in memory, doubling the space. After the resize completes, only the larger array is retained.",
  },
  description: `A dynamic array is an array that automatically grows in capacity when it runs out of space. Unlike a static array where the size is fixed at creation, a dynamic array starts with an initial capacity and doubles (or grows by a constant factor) whenever the number of elements reaches the current capacity. This doubling strategy ensures that the amortized cost of appending an element is O(1), even though individual resize operations cost O(n) because every existing element must be copied to the new, larger array.

The key insight behind dynamic arrays is the amortized analysis. If we start with capacity 4 and keep pushing elements, the array resizes at sizes 4, 8, 16, 32, and so on. Each resize copies all existing elements to new memory. However, between resizes the number of cheap O(1) pushes doubles. When averaged over a sequence of n pushes, the total cost of all copies is proportional to n (summing the geometric series 4 + 8 + 16 + ... + n is approximately 2n). Therefore, each push has an amortized cost of O(1).

Dynamic arrays are the default array type in most high-level languages: Python's list, JavaScript's Array, Java's ArrayList, C++'s std::vector, and Rust's Vec all implement dynamic arrays with a growth factor (typically 1.5x or 2x). They combine the O(1) random access of static arrays with the flexibility of not needing to know the size in advance.

The trade-off is that dynamic arrays may waste memory: after a resize, the capacity can be up to twice the number of elements, and during the resize itself, both the old and new arrays must coexist. For applications where memory is tight or where worst-case O(1) guarantees are needed (real-time systems), alternative structures like linked lists or ring buffers may be preferred. Understanding dynamic arrays is crucial because they underpin so many everyday programming abstractions.`,
  shortDescription:
    "An array that automatically doubles its capacity when full, achieving O(1) amortized append time.",
  pseudocode: `class DynamicArray:
    data = new Array(4)     // initial capacity
    size = 0
    capacity = 4

    push(element):
        if size == capacity:
            resize(capacity * 2)
        data[size] = element
        size++

    resize(newCapacity):
        newData = new Array(newCapacity)
        for i = 0 to size - 1:
            newData[i] = data[i]      // copy each element
        data = newData
        capacity = newCapacity

    access(index):
        if index < 0 or index >= size:
            throw "Index out of bounds"
        return data[index]             // O(1)

    pop():
        if size == 0:
            throw "Array is empty"
        size--
        return data[size]              // O(1)`,
  implementations: {
    python: `class DynamicArray:
    """A dynamic array that doubles capacity when full."""

    def __init__(self, initial_capacity: int = 4):
        self._data = [None] * initial_capacity
        self._size = 0
        self._capacity = initial_capacity

    def push(self, item) -> None:
        """Append item. O(1) amortized, O(n) worst case (resize)."""
        if self._size == self._capacity:
            self._resize(self._capacity * 2)
        self._data[self._size] = item
        self._size += 1

    def pop(self):
        """Remove and return the last element. O(1)."""
        if self._size == 0:
            raise IndexError("Pop from empty array")
        self._size -= 1
        val = self._data[self._size]
        self._data[self._size] = None
        return val

    def access(self, index: int):
        """Access element by index. O(1)."""
        if index < 0 or index >= self._size:
            raise IndexError(f"Index {index} out of range")
        return self._data[index]

    def _resize(self, new_capacity: int) -> None:
        """Copy elements to a new array with larger capacity. O(n)."""
        new_data = [None] * new_capacity
        for i in range(self._size):
            new_data[i] = self._data[i]
        self._data = new_data
        self._capacity = new_capacity

    def __repr__(self) -> str:
        items = [str(self._data[i]) for i in range(self._size)]
        return f"DynamicArray([{', '.join(items)}], size={self._size}, cap={self._capacity})"


# Example
da = DynamicArray(4)
for x in [10, 20, 30, 40, 50]:
    da.push(x)
    print(da)`,
    javascript: `class DynamicArray {
  /** A dynamic array that doubles capacity when full. */

  constructor(initialCapacity = 4) {
    this.data = new Array(initialCapacity).fill(null);
    this.size = 0;
    this.capacity = initialCapacity;
  }

  /** Append item. O(1) amortized, O(n) worst case (resize). */
  push(item) {
    if (this.size === this.capacity) {
      this.resize(this.capacity * 2);
    }
    this.data[this.size] = item;
    this.size++;
  }

  /** Remove and return the last element. O(1). */
  pop() {
    if (this.size === 0) throw new Error("Pop from empty array");
    this.size--;
    const val = this.data[this.size];
    this.data[this.size] = null;
    return val;
  }

  /** Access element by index. O(1). */
  access(index) {
    if (index < 0 || index >= this.size) {
      throw new RangeError(\`Index \${index} out of range\`);
    }
    return this.data[index];
  }

  /** Copy elements to a new array with larger capacity. O(n). */
  resize(newCapacity) {
    const newData = new Array(newCapacity).fill(null);
    for (let i = 0; i < this.size; i++) {
      newData[i] = this.data[i];
    }
    this.data = newData;
    this.capacity = newCapacity;
  }

  toString() {
    const items = this.data.slice(0, this.size);
    return \`DynamicArray([\${items.join(", ")}], size=\${this.size}, cap=\${this.capacity})\`;
  }
}

// Example
const da = new DynamicArray(4);
for (const x of [10, 20, 30, 40, 50]) {
  da.push(x);
  console.log(da.toString());
}`,
  },
  useCases: [
    "General-purpose list — Python list, JS Array, Java ArrayList are all dynamic arrays under the hood",
    "Buffer management — growing buffers for I/O, logging, or batch processing without upfront size knowledge",
    "Stack implementation — using a dynamic array as the backing store for a stack avoids fixed-size limitations",
    "Collecting results — gathering query results, search matches, or filtered elements of unknown count",
    "Building strings — StringBuilder in Java uses a dynamic char array to efficiently concatenate strings",
  ],
  relatedAlgorithms: ["array", "stack", "queue", "linked-list"],
  glossaryTerms: [
    "Dynamic Array",
    "Amortized Analysis",
    "Capacity",
    "Resize",
    "Growth Factor",
    "Doubling Strategy",
    "ArrayList",
    "Vector",
  ],
  tags: [
    "dynamic array",
    "resize",
    "amortized",
    "linear",
    "data structure",
    "beginner",
    "fundamental",
  ],
};
