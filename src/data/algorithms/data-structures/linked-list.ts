import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const linkedList: AlgorithmMetadata = {
  id: "linked-list",
  name: "Linked List",
  category: "data-structures",
  subcategory: "Linear",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Insert/delete at head is O(1). Search, insert at position, and delete by value are O(n).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Each node stores data plus a pointer to the next node (and previous, in doubly linked lists).",
  },
  description: `A linked list is a linear data structure in which elements are stored in nodes, and each node contains a reference (or pointer) to the next node in the sequence. Unlike arrays, linked list elements are not stored in contiguous memory locations. This means that insertion and deletion at the head of the list can be performed in O(1) time without shifting elements, but accessing an element by index requires O(n) traversal from the head. Linked lists come in several variants: singly linked (each node points to the next), doubly linked (each node points to both the next and previous), and circular (the last node points back to the first).

The core operations on a linked list are insertion, deletion, and traversal. Inserting a new node at the head involves creating the node, setting its next pointer to the current head, and updating the head reference — all in constant time. Inserting at the tail requires traversing to the end (O(n) for a singly linked list without a tail pointer, O(1) with a tail pointer). Deletion works similarly: removing the head is O(1), while removing a node in the middle requires finding the predecessor, which takes O(n). Searching for a value always requires linear traversal.

Doubly linked lists add a previous pointer to each node, enabling O(1) deletion when you already have a reference to the node (since you can access the predecessor directly). This comes at the cost of extra memory per node and slightly more complex insertion logic. Circular linked lists, where the last node points back to the first, are useful for applications that cycle through elements repeatedly, like round-robin scheduling or implementing circular buffers.

Linked lists are foundational to many advanced data structures. Hash tables use linked lists for chaining in collision resolution. Adjacency lists in graph representations are essentially arrays of linked lists. LRU caches combine a doubly linked list with a hash map for O(1) access and eviction. Linked lists also underpin the implementation of stacks, queues, and deques. While arrays offer better cache performance and random access, linked lists excel when frequent insertions and deletions at arbitrary positions are needed and the data size is unpredictable.`,
  shortDescription:
    "A linear data structure where each node contains data and a pointer to the next node, enabling O(1) head insertion.",
  pseudocode: `// Singly Linked List

class Node:
    value
    next = null

class LinkedList:
    head = null
    length = 0

    insertAtHead(value):
        newNode = Node(value)
        newNode.next = head
        head = newNode
        length++

    insertAtTail(value):
        newNode = Node(value)
        if head == null:
            head = newNode
        else:
            current = head
            while current.next != null:
                current = current.next
            current.next = newNode
        length++

    deleteAtHead():
        if head == null:
            throw "List is empty"
        value = head.value
        head = head.next
        length--
        return value

    search(value):
        current = head
        index = 0
        while current != null:
            if current.value == value:
                return index
            current = current.next
            index++
        return -1

    traverse():
        current = head
        while current != null:
            visit(current.value)
            current = current.next`,
  implementations: {
    python: `class Node:
    """A node in a singly linked list."""

    __slots__ = ("value", "next")

    def __init__(self, value):
        self.value = value
        self.next: "Node | None" = None


class LinkedList:
    """A singly linked list with head and tail pointers."""

    def __init__(self):
        self.head: Node | None = None
        self.tail: Node | None = None
        self._length: int = 0

    def insert_at_head(self, value) -> None:
        """Insert a new node at the head. O(1)."""
        new_node = Node(value)
        new_node.next = self.head
        self.head = new_node
        if self.tail is None:
            self.tail = new_node
        self._length += 1

    def insert_at_tail(self, value) -> None:
        """Insert a new node at the tail. O(1) with tail pointer."""
        new_node = Node(value)
        if self.tail is None:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node
        self._length += 1

    def delete_at_head(self):
        """Remove and return the head value. Raises IndexError if empty. O(1)."""
        if self.head is None:
            raise IndexError("Delete from an empty list")
        value = self.head.value
        self.head = self.head.next
        if self.head is None:
            self.tail = None
        self._length -= 1
        return value

    def delete_by_value(self, value) -> bool:
        """Delete the first node with the given value. Returns True if found. O(n)."""
        if self.head is None:
            return False
        if self.head.value == value:
            self.delete_at_head()
            return True
        current = self.head
        while current.next is not None:
            if current.next.value == value:
                if current.next == self.tail:
                    self.tail = current
                current.next = current.next.next
                self._length -= 1
                return True
            current = current.next
        return False

    def search(self, value) -> int:
        """Return the index of the first occurrence, or -1 if not found. O(n)."""
        current = self.head
        index = 0
        while current is not None:
            if current.value == value:
                return index
            current = current.next
            index += 1
        return -1

    def to_list(self) -> list:
        """Convert the linked list to a Python list. O(n)."""
        result = []
        current = self.head
        while current is not None:
            result.append(current.value)
            current = current.next
        return result

    def is_empty(self) -> bool:
        return self._length == 0

    def size(self) -> int:
        return self._length

    def __repr__(self) -> str:
        return f"LinkedList({' -> '.join(map(str, self.to_list()))})"


# Example usage
if __name__ == "__main__":
    ll = LinkedList()
    ll.insert_at_tail(1)
    ll.insert_at_tail(2)
    ll.insert_at_tail(3)
    ll.insert_at_head(0)
    print(ll)                # LinkedList(0 -> 1 -> 2 -> 3)
    print(ll.search(2))      # 2
    print(ll.delete_at_head())  # 0
    ll.delete_by_value(2)
    print(ll)                # LinkedList(1 -> 3)
    print(ll.size())         # 2`,
    javascript: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  /** A singly linked list with head and tail pointers. */

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /** Insert a new node at the head. O(1). */
  insertAtHead(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    if (this.tail === null) {
      this.tail = newNode;
    }
    this.length++;
  }

  /** Insert a new node at the tail. O(1) with tail pointer. */
  insertAtTail(value) {
    const newNode = new Node(value);
    if (this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  /** Remove and return the head value. Throws if empty. O(1). */
  deleteAtHead() {
    if (this.head === null) {
      throw new Error("Delete from an empty list");
    }
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) {
      this.tail = null;
    }
    this.length--;
    return value;
  }

  /** Delete the first node with the given value. Returns true if found. O(n). */
  deleteByValue(value) {
    if (this.head === null) return false;
    if (this.head.value === value) {
      this.deleteAtHead();
      return true;
    }
    let current = this.head;
    while (current.next !== null) {
      if (current.next.value === value) {
        if (current.next === this.tail) {
          this.tail = current;
        }
        current.next = current.next.next;
        this.length--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  /** Return the index of the first occurrence, or -1 if not found. O(n). */
  search(value) {
    let current = this.head;
    let index = 0;
    while (current !== null) {
      if (current.value === value) return index;
      current = current.next;
      index++;
    }
    return -1;
  }

  /** Convert the linked list to an array. O(n). */
  toArray() {
    const result = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  isEmpty() {
    return this.length === 0;
  }

  size() {
    return this.length;
  }

  toString() {
    return \`LinkedList(\${this.toArray().join(" -> ")})\`;
  }
}

// Example usage
const ll = new LinkedList();
ll.insertAtTail(1);
ll.insertAtTail(2);
ll.insertAtTail(3);
ll.insertAtHead(0);
console.log(ll.toString());      // LinkedList(0 -> 1 -> 2 -> 3)
console.log(ll.search(2));       // 2
console.log(ll.deleteAtHead());  // 0
ll.deleteByValue(2);
console.log(ll.toString());      // LinkedList(1 -> 3)
console.log(ll.size());          // 2`,
  },
  useCases: [
    "Hash table chaining — each bucket stores colliding entries in a linked list",
    "Graph adjacency lists — each vertex maintains a linked list of its neighbors",
    "LRU cache eviction — a doubly linked list combined with a hash map enables O(1) access and eviction",
    "Dynamic memory allocation — operating systems use free lists (linked lists of available memory blocks)",
    "Undo history — some editors use a linked list of states for efficient forward/backward navigation",
  ],
  relatedAlgorithms: ["stack", "queue", "hash-table", "binary-search-tree"],
  glossaryTerms: [
    "Node",
    "Pointer",
    "Head",
    "Tail",
    "Singly Linked List",
    "Doubly Linked List",
    "Circular Linked List",
    "Traversal",
  ],
  tags: [
    "linked list",
    "singly linked",
    "linear",
    "data structure",
    "nodes",
    "pointers",
    "beginner",
    "fundamental",
  ],
};
