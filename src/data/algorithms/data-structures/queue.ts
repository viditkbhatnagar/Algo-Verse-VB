import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const queue: AlgorithmMetadata = {
  id: "queue",
  name: "Queue",
  category: "data-structures",
  subcategory: "Linear",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Enqueue and dequeue are O(1). Searching for an arbitrary element is O(n).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Space grows linearly with the number of elements stored.",
  },
  description: `A queue is a linear data structure that follows the First-In, First-Out (FIFO) principle. The first element added to the queue is the first one to be removed, much like a line of people waiting at a ticket counter. This ordering guarantee makes queues essential whenever tasks or data must be processed in the exact order they arrive. Queues are one of the most fundamental abstractions in computer science and appear everywhere from operating system schedulers to network routers.

The two primary operations on a queue are enqueue (adding an element to the rear) and dequeue (removing an element from the front). Both operations run in O(1) time when the queue is implemented correctly. Supporting operations include front or peek (inspecting the element at the front without removing it), isEmpty, and size. Some variants, like the double-ended queue (deque), allow insertion and removal at both ends.

Queues can be implemented using arrays (often as circular buffers to avoid wasted space), linked lists, or even two stacks. A circular array implementation uses two pointers — front and rear — that wrap around the array, providing amortized O(1) enqueue and dequeue without shifting elements. A linked-list implementation uses the head as the front and the tail as the rear, with enqueue appending to the tail and dequeue removing from the head. The linked-list approach avoids capacity limits but incurs pointer overhead.

Queues are central to Breadth-First Search (BFS) in graphs and trees, where nodes are explored level by level. Operating systems use queues for CPU scheduling (e.g., round-robin scheduling), disk I/O request ordering, and print spooling. Message queues like RabbitMQ and Kafka power distributed systems by decoupling producers from consumers. Rate limiters, buffering in streaming media, and keyboard input handling all rely on queue semantics. Mastering queues is essential for understanding concurrency, networking, and systems design.`,
  shortDescription:
    "A linear FIFO data structure supporting constant-time enqueue and dequeue operations.",
  pseudocode: `// Linked-list-based Queue

class Node:
    value
    next = null

class Queue:
    head = null
    tail = null
    length = 0

    enqueue(element):
        newNode = Node(element)
        if isEmpty():
            head = newNode
            tail = newNode
        else:
            tail.next = newNode
            tail = newNode
        length++

    dequeue():
        if isEmpty():
            throw "Queue Underflow"
        value = head.value
        head = head.next
        if head == null:
            tail = null
        length--
        return value

    front():
        if isEmpty():
            throw "Queue is empty"
        return head.value

    isEmpty():
        return length == 0`,
  implementations: {
    python: `class Node:
    """A node in the linked-list-based queue."""

    __slots__ = ("value", "next")

    def __init__(self, value):
        self.value = value
        self.next: "Node | None" = None


class Queue:
    """A queue implementation using a singly linked list for O(1) operations."""

    def __init__(self):
        self._head: Node | None = None
        self._tail: Node | None = None
        self._length: int = 0

    def enqueue(self, item) -> None:
        """Add an item to the rear of the queue. O(1)."""
        new_node = Node(item)
        if self.is_empty():
            self._head = new_node
            self._tail = new_node
        else:
            self._tail.next = new_node
            self._tail = new_node
        self._length += 1

    def dequeue(self):
        """Remove and return the front item. Raises IndexError if empty. O(1)."""
        if self.is_empty():
            raise IndexError("Dequeue from an empty queue")
        value = self._head.value
        self._head = self._head.next
        if self._head is None:
            self._tail = None
        self._length -= 1
        return value

    def front(self):
        """Return the front item without removing it. Raises IndexError if empty. O(1)."""
        if self.is_empty():
            raise IndexError("Front of an empty queue")
        return self._head.value

    def is_empty(self) -> bool:
        """Return True if the queue has no elements. O(1)."""
        return self._length == 0

    def size(self) -> int:
        """Return the number of elements in the queue. O(1)."""
        return self._length

    def __repr__(self) -> str:
        items = []
        current = self._head
        while current:
            items.append(str(current.value))
            current = current.next
        return f"Queue(front -> [{', '.join(items)}] <- rear)"


# Example usage
if __name__ == "__main__":
    q = Queue()
    q.enqueue("A")
    q.enqueue("B")
    q.enqueue("C")
    print(q)             # Queue(front -> [A, B, C] <- rear)
    print(q.dequeue())   # A
    print(q.front())     # B
    print(q.size())      # 2
    print(q.is_empty())  # False`,
    javascript: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  /** A queue implementation using a singly linked list for O(1) operations. */

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /** Add an item to the rear of the queue. O(1). */
  enqueue(item) {
    const newNode = new Node(item);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  /** Remove and return the front item. Throws if empty. O(1). */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Dequeue from an empty queue");
    }
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) {
      this.tail = null;
    }
    this.length--;
    return value;
  }

  /** Return the front item without removing it. Throws if empty. O(1). */
  front() {
    if (this.isEmpty()) {
      throw new Error("Front of an empty queue");
    }
    return this.head.value;
  }

  /** Return true if the queue has no elements. O(1). */
  isEmpty() {
    return this.length === 0;
  }

  /** Return the number of elements in the queue. O(1). */
  size() {
    return this.length;
  }

  /** String representation showing front-to-rear order. */
  toString() {
    const items = [];
    let current = this.head;
    while (current) {
      items.push(current.value);
      current = current.next;
    }
    return \`Queue(front -> [\${items.join(", ")}] <- rear)\`;
  }
}

// Example usage
const q = new Queue();
q.enqueue("A");
q.enqueue("B");
q.enqueue("C");
console.log(q.toString());  // Queue(front -> [A, B, C] <- rear)
console.log(q.dequeue());   // A
console.log(q.front());     // B
console.log(q.size());      // 2
console.log(q.isEmpty());   // false`,
  },
  useCases: [
    "Breadth-First Search (BFS) — exploring graph or tree nodes level by level using a FIFO queue",
    "CPU scheduling — operating systems use queues (e.g., round-robin) to manage process execution order",
    "Print spooling — print jobs are queued and processed in the order they are submitted",
    "Message queues in distributed systems — RabbitMQ, Kafka, and SQS decouple producers from consumers",
    "Buffering in streaming — media players buffer incoming data in a queue to ensure smooth playback",
  ],
  relatedAlgorithms: ["stack", "linked-list", "binary-search-tree"],
  glossaryTerms: [
    "FIFO",
    "Enqueue",
    "Dequeue",
    "Circular Buffer",
    "Priority Queue",
    "Double-Ended Queue",
    "BFS",
  ],
  tags: [
    "queue",
    "FIFO",
    "linear",
    "data structure",
    "enqueue",
    "dequeue",
    "beginner",
    "fundamental",
  ],
};
