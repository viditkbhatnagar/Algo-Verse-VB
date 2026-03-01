import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const priorityQueue: AlgorithmMetadata = {
  id: "priority-queue",
  name: "Priority Queue",
  category: "data-structures",
  subcategory: "Heaps",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    note: "Enqueue (insert) and dequeue (extract-min) are O(log n). Peek at the highest-priority element is O(1).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Backed by a min-heap stored in a contiguous array. Each element stores both a value/label and a priority number.",
  },
  description: `A Priority Queue is an abstract data type where each element has an associated priority, and elements are served in order of their priority rather than their insertion order. Unlike a regular queue (FIFO), a priority queue always dequeues the element with the highest priority first (lowest priority number in a min-priority queue, or highest in a max-priority queue).

The most common and efficient implementation of a priority queue is a binary heap. In this visualization, we use a min-heap where lower priority numbers mean higher priority (e.g., priority 1 is served before priority 5). Each node in the heap stores both a value (the task/item name or data) and a priority number. The heap is ordered by the priority field.

Enqueue adds a new element to the end of the heap array and bubbles it up based on its priority. Dequeue removes the root (the element with the smallest priority number, i.e., highest priority), replaces it with the last element, and bubbles down. Both operations are O(log n).

Priority queues are ubiquitous in computer science. Dijkstra's shortest path algorithm uses a priority queue to always process the nearest unvisited vertex. A* search extends this with heuristic-based priorities. CPU schedulers use priority queues to decide which process runs next. Event-driven simulations process events in timestamp order using a priority queue. Huffman coding builds optimal prefix codes by repeatedly extracting the two lowest-frequency symbols.

In languages with standard library support, priority queues are available as heapq in Python, PriorityQueue in Java, and priority_queue in C++. Understanding the heap-based implementation is essential for knowing the performance characteristics and limitations of these library implementations.`,
  shortDescription:
    "An abstract data type backed by a min-heap where elements are dequeued by priority rather than insertion order, enabling O(log n) enqueue and dequeue.",
  pseudocode: `// Priority Queue (min-heap backed)

class PriorityQueueItem:
    value     // the data/label
    priority  // lower number = higher priority

class PriorityQueue:
    heap = []  // array of PriorityQueueItems

    enqueue(value, priority):
        item = PriorityQueueItem(value, priority)
        heap.append(item)
        bubbleUp(heap.length - 1)

    dequeue():
        if heap is empty:
            return null
        top = heap[0]
        heap[0] = heap[heap.length - 1]
        heap.removeLast()
        bubbleDown(0)
        return top

    bubbleUp(i):
        parent = floor((i - 1) / 2)
        while i > 0 and heap[i].priority < heap[parent].priority:
            swap(heap[i], heap[parent])
            i = parent
            parent = floor((i - 1) / 2)

    bubbleDown(i):
        smallest = i
        left = 2 * i + 1
        right = 2 * i + 2
        if left < heap.length and heap[left].priority < heap[smallest].priority:
            smallest = left
        if right < heap.length and heap[right].priority < heap[smallest].priority:
            smallest = right
        if smallest != i:
            swap(heap[i], heap[smallest])
            bubbleDown(smallest)

    peek():
        return heap[0]`,
  implementations: {
    python: `import heapq
from dataclasses import dataclass, field


@dataclass(order=True)
class PriorityItem:
    """Wrapper for priority queue items with comparison by priority."""
    priority: int
    value: str = field(compare=False)


class PriorityQueue:
    """A min-priority queue backed by a binary heap."""

    def __init__(self):
        self._heap: list[PriorityItem] = []

    def __len__(self) -> int:
        return len(self._heap)

    def __bool__(self) -> bool:
        return len(self._heap) > 0

    def enqueue(self, value: str, priority: int) -> None:
        """Add an item with the given priority. O(log n)."""
        heapq.heappush(self._heap, PriorityItem(priority, value))

    def dequeue(self) -> PriorityItem:
        """Remove and return the highest-priority (lowest number) item. O(log n)."""
        if not self._heap:
            raise IndexError("Priority queue is empty")
        return heapq.heappop(self._heap)

    def peek(self) -> PriorityItem:
        """Return the highest-priority item without removing it. O(1)."""
        if not self._heap:
            raise IndexError("Priority queue is empty")
        return self._heap[0]


# Example usage
if __name__ == "__main__":
    pq = PriorityQueue()
    pq.enqueue("Low priority task", 5)
    pq.enqueue("Critical bug fix", 1)
    pq.enqueue("Feature request", 3)
    pq.enqueue("Urgent hotfix", 2)
    pq.enqueue("Nice to have", 4)

    while pq:
        item = pq.dequeue()
        print(f"Priority {item.priority}: {item.value}")`,
    javascript: `class PriorityQueue {
  constructor() {
    this.heap = []; // Each element: { value, priority }
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

  /** Add an item with the given priority. O(log n). */
  enqueue(value, priority) {
    this.heap.push({ value, priority });
    this._bubbleUp(this.heap.length - 1);
  }

  _bubbleUp(i) {
    while (i > 0 && this.heap[i].priority < this.heap[this._parent(i)].priority) {
      this._swap(i, this._parent(i));
      i = this._parent(i);
    }
  }

  /** Remove and return the highest-priority (lowest number) item. O(log n). */
  dequeue() {
    if (this.heap.length === 0) throw new Error("Queue is empty");
    const top = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    if (this.heap.length > 0) this._bubbleDown(0);
    return top;
  }

  _bubbleDown(i) {
    let smallest = i;
    const left = this._left(i);
    const right = this._right(i);
    if (left < this.heap.length && this.heap[left].priority < this.heap[smallest].priority) {
      smallest = left;
    }
    if (right < this.heap.length && this.heap[right].priority < this.heap[smallest].priority) {
      smallest = right;
    }
    if (smallest !== i) {
      this._swap(i, smallest);
      this._bubbleDown(smallest);
    }
  }

  /** Return the highest-priority item without removing it. O(1). */
  peek() {
    if (this.heap.length === 0) throw new Error("Queue is empty");
    return this.heap[0];
  }
}

// Example usage
const pq = new PriorityQueue();
pq.enqueue("Low priority task", 5);
pq.enqueue("Critical bug fix", 1);
pq.enqueue("Feature request", 3);
pq.enqueue("Urgent hotfix", 2);
pq.enqueue("Nice to have", 4);

while (pq.size > 0) {
  const item = pq.dequeue();
  console.log(\`Priority \${item.priority}: \${item.value}\`);
}`,
  },
  useCases: [
    "Dijkstra's algorithm — processes vertices in order of their tentative shortest distance using a min-priority queue",
    "A* search — extends Dijkstra with heuristic priorities for pathfinding in games and robotics",
    "CPU scheduling — operating systems use priority queues to run the highest-priority process next",
    "Event-driven simulation — processes events in chronological (timestamp) order",
    "Huffman coding — repeatedly extracts the two lowest-frequency symbols to build an optimal prefix code",
  ],
  relatedAlgorithms: ["min-heap", "max-heap", "dijkstra", "heap-sort"],
  glossaryTerms: [
    "Priority",
    "Enqueue",
    "Dequeue",
    "Min-Heap",
    "Bubble Up",
    "Bubble Down",
    "Abstract Data Type",
  ],
  tags: [
    "priority queue",
    "heap",
    "abstract data type",
    "data structure",
    "scheduling",
    "intermediate",
  ],
};
