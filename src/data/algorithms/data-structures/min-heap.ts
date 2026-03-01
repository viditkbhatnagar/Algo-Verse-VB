import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const minHeap: AlgorithmMetadata = {
  id: "min-heap",
  name: "Min-Heap",
  category: "data-structures",
  subcategory: "Heaps",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    note: "Insert and extract-min are O(log n) due to heapify. Peek-min is O(1) since the minimum is always at the root.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Stored as a complete binary tree in a contiguous array. No pointers needed — children of index i are at 2i+1 and 2i+2.",
  },
  description: `A Min-Heap is a complete binary tree where every parent node has a value less than or equal to its children. This "heap property" guarantees that the smallest element is always at the root, making it the ideal data structure when you need fast access to the minimum element.

Min-Heaps are typically implemented as arrays rather than linked tree structures. For a node at index i, its left child is at index 2i+1, its right child at 2i+2, and its parent at floor((i-1)/2). This array representation is memory-efficient, cache-friendly, and eliminates the overhead of storing child/parent pointers.

The two core operations are insert (also called push) and extract-min (also called pop). Insertion adds the new element at the end of the array (the next available leaf position in the complete tree) and then "bubbles up" — repeatedly swapping the element with its parent until the heap property is restored. This takes O(log n) time in the worst case since the tree height is log n. Extract-min removes the root (the minimum), moves the last element to the root position, and then "bubbles down" — repeatedly swapping with the smaller child until the heap property is restored.

Building a heap from an unsorted array can be done in O(n) time using the bottom-up heapify approach, which is more efficient than inserting elements one by one (which would be O(n log n)). This is the same technique used in Heap Sort.

Min-Heaps are the backbone of priority queues, Dijkstra's shortest-path algorithm, Huffman coding, event-driven simulations, and the heap sort algorithm. Understanding min-heaps is essential for any serious study of algorithms and data structures.`,
  shortDescription:
    "A complete binary tree where every parent is smaller than its children, providing O(1) access to the minimum and O(log n) insertion and extraction.",
  pseudocode: `// Min-Heap (array-based)

class MinHeap:
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
        while i > 0 and heap[i] < heap[parent(i)]:
            swap(heap[i], heap[parent(i)])
            i = parent(i)

    extractMin():
        if heap is empty:
            return null
        min = heap[0]
        heap[0] = heap[heap.length - 1]
        heap.removeLast()
        bubbleDown(0)
        return min

    bubbleDown(i):
        smallest = i
        left = leftChild(i)
        right = rightChild(i)
        if left < heap.length and heap[left] < heap[smallest]:
            smallest = left
        if right < heap.length and heap[right] < heap[smallest]:
            smallest = right
        if smallest != i:
            swap(heap[i], heap[smallest])
            bubbleDown(smallest)

    peekMin():
        return heap[0]`,
  implementations: {
    python: `class MinHeap:
    """A min-heap implementation using a list."""

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
        while i > 0 and self.heap[i] < self.heap[self._parent(i)]:
            self._swap(i, self._parent(i))
            i = self._parent(i)

    def extract_min(self) -> int:
        """Remove and return the minimum element. O(log n)."""
        if not self.heap:
            raise IndexError("Heap is empty")
        min_val = self.heap[0]
        self.heap[0] = self.heap[-1]
        self.heap.pop()
        if self.heap:
            self._bubble_down(0)
        return min_val

    def _bubble_down(self, i: int) -> None:
        smallest = i
        left = self._left(i)
        right = self._right(i)
        if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
            smallest = left
        if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
            smallest = right
        if smallest != i:
            self._swap(i, smallest)
            self._bubble_down(smallest)

    def peek(self) -> int:
        """Return the minimum without removing it. O(1)."""
        if not self.heap:
            raise IndexError("Heap is empty")
        return self.heap[0]


# Example usage
if __name__ == "__main__":
    h = MinHeap()
    for v in [40, 20, 30, 10, 15, 25, 5]:
        h.insert(v)
    print(h.heap)          # [5, 15, 10, 40, 20, 30, 25]
    print(h.extract_min()) # 5
    print(h.extract_min()) # 10`,
    javascript: `class MinHeap {
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
    while (i > 0 && this.heap[i] < this.heap[this._parent(i)]) {
      this._swap(i, this._parent(i));
      i = this._parent(i);
    }
  }

  /** Remove and return the minimum element. O(log n). */
  extractMin() {
    if (this.heap.length === 0) throw new Error("Heap is empty");
    const min = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    if (this.heap.length > 0) this._bubbleDown(0);
    return min;
  }

  _bubbleDown(i) {
    let smallest = i;
    const left = this._left(i);
    const right = this._right(i);
    if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
      smallest = left;
    }
    if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
      smallest = right;
    }
    if (smallest !== i) {
      this._swap(i, smallest);
      this._bubbleDown(smallest);
    }
  }

  /** Return the minimum without removing it. O(1). */
  peek() {
    if (this.heap.length === 0) throw new Error("Heap is empty");
    return this.heap[0];
  }
}

// Example usage
const h = new MinHeap();
[40, 20, 30, 10, 15, 25, 5].forEach((v) => h.insert(v));
console.log(h.heap);          // [5, 15, 10, 40, 20, 30, 25]
console.log(h.extractMin());  // 5
console.log(h.extractMin());  // 10`,
  },
  useCases: [
    "Priority queues — min-heaps are the standard implementation for priority queues where the smallest-priority item is served first",
    "Dijkstra's algorithm — uses a min-heap to always process the closest unvisited vertex next",
    "Huffman coding — builds an optimal prefix code by repeatedly extracting the two lowest-frequency nodes",
    "Event-driven simulation — processes events in chronological order using a min-heap of timestamps",
    "Median maintenance — paired with a max-heap to efficiently track the running median of a data stream",
  ],
  relatedAlgorithms: ["max-heap", "priority-queue", "heap-sort", "binary-search-tree"],
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
    "min-heap",
    "heap",
    "priority queue",
    "data structure",
    "tree",
    "array-based",
    "intermediate",
  ],
};
