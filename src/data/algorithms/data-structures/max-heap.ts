import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const maxHeap: AlgorithmMetadata = {
  id: "max-heap",
  name: "Max-Heap",
  category: "data-structures",
  subcategory: "Heaps",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    note: "Insert and extract-max are O(log n) due to heapify operations. Peek-max is O(1) since the maximum is always at the root.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Stored as a complete binary tree in a contiguous array. No pointers needed — children of index i are at 2i+1 and 2i+2.",
  },
  description: `A Max-Heap is a complete binary tree where every parent node has a value greater than or equal to its children. This "max-heap property" guarantees that the largest element is always at the root, providing O(1) access to the maximum and O(log n) insertion and extraction.

Like min-heaps, max-heaps are implemented as arrays. For a node at index i, its left child is at 2i+1, its right child at 2i+2, and its parent at floor((i-1)/2). The array representation makes max-heaps cache-friendly and memory-efficient with no pointer overhead.

Insertion places the new element at the end of the array and "bubbles up" — comparing with the parent and swapping if the new element is larger. This continues until the element finds a position where it is less than or equal to its parent, or it becomes the root. Extract-max removes the root (the maximum), replaces it with the last element, and "bubbles down" — repeatedly swapping with the larger child until the heap property is restored.

Max-Heaps are the foundation of the Heap Sort algorithm: build a max-heap from the unsorted data, then repeatedly extract the maximum and place it at the end of the array. They are also used in priority queues where the highest-priority element must be served first (e.g., CPU scheduling with highest-priority processes). Max-heaps appear in algorithms like finding the k smallest elements in a stream (maintain a max-heap of size k), and in the bounded-buffer producer-consumer pattern.

Understanding both min-heaps and max-heaps is essential because many problems can be solved by pairing them — for example, finding the running median of a data stream uses a max-heap for the lower half and a min-heap for the upper half.`,
  shortDescription:
    "A complete binary tree where every parent is larger than its children, providing O(1) access to the maximum and O(log n) insertion and extraction.",
  pseudocode: `// Max-Heap (array-based)

class MaxHeap:
    heap = []

    parent(i):
        return floor((i - 1) / 2)

    leftChild(i):
        return 2 * i + 1

    rightChild(i):
        return 2 * i + 2

    insert(value):
        heap.append(value)
        bubbleUp(heap.length - 1)

    bubbleUp(i):
        while i > 0 and heap[i] > heap[parent(i)]:
            swap(heap[i], heap[parent(i)])
            i = parent(i)

    extractMax():
        if heap is empty:
            return null
        max = heap[0]
        heap[0] = heap[heap.length - 1]
        heap.removeLast()
        bubbleDown(0)
        return max

    bubbleDown(i):
        largest = i
        left = leftChild(i)
        right = rightChild(i)
        if left < heap.length and heap[left] > heap[largest]:
            largest = left
        if right < heap.length and heap[right] > heap[largest]:
            largest = right
        if largest != i:
            swap(heap[i], heap[largest])
            bubbleDown(largest)

    peekMax():
        return heap[0]`,
  implementations: {
    python: `class MaxHeap:
    """A max-heap implementation using a list."""

    def __init__(self):
        self.heap: list[int] = []

    def __len__(self) -> int:
        return len(self.heap)

    def __bool__(self) -> bool:
        return len(self.heap) > 0

    def _parent(self, i: int) -> int:
        return (i - 1) // 2

    def _left(self, i: int) -> int:
        return 2 * i + 1

    def _right(self, i: int) -> int:
        return 2 * i + 2

    def _swap(self, i: int, j: int) -> None:
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]

    def insert(self, value: int) -> None:
        """Insert a value into the heap. O(log n)."""
        self.heap.append(value)
        self._bubble_up(len(self.heap) - 1)

    def _bubble_up(self, i: int) -> None:
        while i > 0 and self.heap[i] > self.heap[self._parent(i)]:
            self._swap(i, self._parent(i))
            i = self._parent(i)

    def extract_max(self) -> int:
        """Remove and return the maximum element. O(log n)."""
        if not self.heap:
            raise IndexError("Heap is empty")
        max_val = self.heap[0]
        self.heap[0] = self.heap[-1]
        self.heap.pop()
        if self.heap:
            self._bubble_down(0)
        return max_val

    def _bubble_down(self, i: int) -> None:
        largest = i
        left = self._left(i)
        right = self._right(i)
        if left < len(self.heap) and self.heap[left] > self.heap[largest]:
            largest = left
        if right < len(self.heap) and self.heap[right] > self.heap[largest]:
            largest = right
        if largest != i:
            self._swap(i, largest)
            self._bubble_down(largest)

    def peek(self) -> int:
        """Return the maximum without removing it. O(1)."""
        if not self.heap:
            raise IndexError("Heap is empty")
        return self.heap[0]


# Example usage
if __name__ == "__main__":
    h = MaxHeap()
    for v in [10, 30, 20, 40, 35, 25, 50]:
        h.insert(v)
    print(h.heap)           # [50, 35, 40, 10, 30, 20, 25]
    print(h.extract_max())  # 50
    print(h.extract_max())  # 40`,
    javascript: `class MaxHeap {
  constructor() {
    this.heap = [];
  }

  get size() {
    return this.heap.length;
  }

  _parent(i) {
    return Math.floor((i - 1) / 2);
  }
  _left(i) {
    return 2 * i + 1;
  }
  _right(i) {
    return 2 * i + 2;
  }
  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  /** Insert a value into the heap. O(log n). */
  insert(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
  }

  _bubbleUp(i) {
    while (i > 0 && this.heap[i] > this.heap[this._parent(i)]) {
      this._swap(i, this._parent(i));
      i = this._parent(i);
    }
  }

  /** Remove and return the maximum element. O(log n). */
  extractMax() {
    if (this.heap.length === 0) throw new Error("Heap is empty");
    const max = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    if (this.heap.length > 0) this._bubbleDown(0);
    return max;
  }

  _bubbleDown(i) {
    let largest = i;
    const left = this._left(i);
    const right = this._right(i);
    if (left < this.heap.length && this.heap[left] > this.heap[largest]) {
      largest = left;
    }
    if (right < this.heap.length && this.heap[right] > this.heap[largest]) {
      largest = right;
    }
    if (largest !== i) {
      this._swap(i, largest);
      this._bubbleDown(largest);
    }
  }

  /** Return the maximum without removing it. O(1). */
  peek() {
    if (this.heap.length === 0) throw new Error("Heap is empty");
    return this.heap[0];
  }
}

// Example usage
const h = new MaxHeap();
[10, 30, 20, 40, 35, 25, 50].forEach((v) => h.insert(v));
console.log(h.heap);          // [50, 35, 40, 10, 30, 20, 25]
console.log(h.extractMax());  // 50
console.log(h.extractMax());  // 40`,
  },
  useCases: [
    "Heap Sort — builds a max-heap and repeatedly extracts the maximum to sort in ascending order",
    "Priority scheduling — operating systems use max-heaps to always run the highest-priority process next",
    "Finding k smallest elements — maintain a max-heap of size k; if a new element is smaller than the max, replace it",
    "Running median — paired with a min-heap to efficiently track the median of a streaming dataset",
    "Bandwidth management — network routers use max-heaps to prioritize high-bandwidth traffic flows",
  ],
  relatedAlgorithms: ["min-heap", "priority-queue", "heap-sort", "binary-search-tree"],
  glossaryTerms: [
    "Heap Property",
    "Complete Binary Tree",
    "Bubble Up",
    "Bubble Down",
    "Heapify",
    "Priority Queue",
    "Array Representation",
  ],
  tags: [
    "max-heap",
    "heap",
    "priority queue",
    "data structure",
    "tree",
    "array-based",
    "intermediate",
  ],
};
