import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const doublyLinkedList: AlgorithmMetadata = {
  id: "doubly-linked-list",
  name: "Doubly Linked List",
  category: "data-structures",
  subcategory: "Linear",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Insertion and deletion at head or tail are O(1) with tail pointer. Search and arbitrary-position operations require traversal, costing O(n).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Each node stores a value plus two pointers (next and prev), using more memory per node than a singly linked list.",
  },
  description: `A doubly linked list is a linear data structure where each node contains a value, a pointer to the next node, and a pointer to the previous node. This bidirectional linking allows traversal in both directions — from head to tail and from tail to head — which is the key advantage over a singly linked list. The list maintains a head pointer (first node) and a tail pointer (last node) for efficient access to both ends.

The bidirectional pointers enable O(1) deletion of a node when you already have a reference to it, because you can update both the previous and next neighbors without needing to traverse from the head. In a singly linked list, deleting a node requires knowing its predecessor, which costs O(n) to find. This makes doubly linked lists ideal for implementing LRU caches, undo/redo systems, and music/video playlists where you need to move both forward and backward.

Insertion and deletion at the head or tail are O(1) operations. Inserting at the head involves creating a new node, pointing its next to the current head, updating the old head's prev to the new node, and moving the head pointer. Tail insertion is symmetric. Insertion at an arbitrary position requires traversal to find the position (O(n)), but the actual pointer manipulation is O(1).

The trade-off is memory: each node requires an extra pointer compared to a singly linked list. For n nodes, this is 2n pointers versus n pointers. Despite this overhead, doubly linked lists are widely used in practice. The Linux kernel uses them extensively for task scheduling. Browser history (back/forward navigation) is a classic doubly linked list application. Language runtimes use them for memory management (free lists). Understanding doubly linked lists prepares you for more complex structures like skip lists and B-trees.`,
  shortDescription:
    "A linked list where each node has both next and prev pointers, enabling bidirectional traversal and O(1) deletion.",
  pseudocode: `class Node:
    value
    next = null
    prev = null

class DoublyLinkedList:
    head = null
    tail = null
    size = 0

    insertAtHead(value):
        newNode = Node(value)
        if head == null:
            head = newNode
            tail = newNode
        else:
            newNode.next = head
            head.prev = newNode
            head = newNode
        size++

    insertAtTail(value):
        newNode = Node(value)
        if tail == null:
            head = newNode
            tail = newNode
        else:
            newNode.prev = tail
            tail.next = newNode
            tail = newNode
        size++

    deleteNode(node):
        if node.prev:
            node.prev.next = node.next
        else:
            head = node.next
        if node.next:
            node.next.prev = node.prev
        else:
            tail = node.prev
        size--

    search(value):
        current = head
        while current != null:
            if current.value == value:
                return current
            current = current.next
        return null`,
  implementations: {
    python: `class Node:
    """A node in a doubly linked list."""

    __slots__ = ("value", "next", "prev")

    def __init__(self, value):
        self.value = value
        self.next: "Node | None" = None
        self.prev: "Node | None" = None


class DoublyLinkedList:
    """A doubly linked list with head and tail pointers."""

    def __init__(self):
        self.head: Node | None = None
        self.tail: Node | None = None
        self.size: int = 0

    def insert_at_head(self, value) -> None:
        """Insert at the front. O(1)."""
        new_node = Node(value)
        if self.head is None:
            self.head = new_node
            self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node
        self.size += 1

    def insert_at_tail(self, value) -> None:
        """Insert at the end. O(1)."""
        new_node = Node(value)
        if self.tail is None:
            self.head = new_node
            self.tail = new_node
        else:
            new_node.prev = self.tail
            self.tail.next = new_node
            self.tail = new_node
        self.size += 1

    def delete_node(self, node: Node) -> None:
        """Delete a given node. O(1) if you have the reference."""
        if node.prev:
            node.prev.next = node.next
        else:
            self.head = node.next
        if node.next:
            node.next.prev = node.prev
        else:
            self.tail = node.prev
        self.size -= 1

    def search(self, value) -> "Node | None":
        """Find a node by value. O(n)."""
        current = self.head
        while current:
            if current.value == value:
                return current
            current = current.next
        return None

    def __repr__(self) -> str:
        items = []
        current = self.head
        while current:
            items.append(str(current.value))
            current = current.next
        return f"DLL([{' <-> '.join(items)}])"


# Example
dll = DoublyLinkedList()
dll.insert_at_head(20)
dll.insert_at_head(10)
dll.insert_at_tail(30)
print(dll)  # DLL([10 <-> 20 <-> 30])
node = dll.search(20)
dll.delete_node(node)
print(dll)  # DLL([10 <-> 30])`,
    javascript: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  /** A doubly linked list with head and tail pointers. */

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  /** Insert at the front. O(1). */
  insertAtHead(value) {
    const newNode = new Node(value);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
  }

  /** Insert at the end. O(1). */
  insertAtTail(value) {
    const newNode = new Node(value);
    if (this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  /** Delete a given node. O(1) if you have the reference. */
  deleteNode(node) {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
    this.size--;
  }

  /** Find a node by value. O(n). */
  search(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  toString() {
    const items = [];
    let current = this.head;
    while (current) {
      items.push(current.value);
      current = current.next;
    }
    return \`DLL([\${items.join(" <-> ")}])\`;
  }
}

// Example
const dll = new DoublyLinkedList();
dll.insertAtHead(20);
dll.insertAtHead(10);
dll.insertAtTail(30);
console.log(dll.toString());  // DLL([10 <-> 20 <-> 30])
const node = dll.search(20);
dll.deleteNode(node);
console.log(dll.toString());  // DLL([10 <-> 30])`,
  },
  useCases: [
    "LRU Cache — doubly linked list + hash map enables O(1) access and eviction of least recently used items",
    "Browser history — back/forward navigation is naturally modeled as a doubly linked list",
    "Undo/Redo — each action is a node; moving backward (undo) and forward (redo) uses prev/next pointers",
    "Music/video playlists — users navigate forward and backward through a sequence of tracks",
    "Memory allocators — free lists in memory managers use doubly linked lists for efficient block coalescing",
  ],
  relatedAlgorithms: ["linked-list", "stack", "queue", "hash-table"],
  glossaryTerms: [
    "Doubly Linked List",
    "Node",
    "Head",
    "Tail",
    "Prev Pointer",
    "Next Pointer",
    "Bidirectional Traversal",
    "LRU Cache",
  ],
  tags: [
    "doubly linked list",
    "bidirectional",
    "linear",
    "data structure",
    "pointers",
    "beginner",
    "fundamental",
  ],
};
