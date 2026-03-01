import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const stack: AlgorithmMetadata = {
  id: "stack",
  name: "Stack",
  category: "data-structures",
  subcategory: "Linear",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Push and pop are O(1). Searching or accessing an arbitrary element is O(n).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Space grows linearly with the number of elements stored.",
  },
  description: `A stack is a linear data structure that follows the Last-In, First-Out (LIFO) principle. This means that the last element added to the stack is the first one to be removed. Think of it like a stack of plates: you place new plates on top, and when you need one, you take the top plate first. This simple yet powerful abstraction underpins many critical operations in computer science, from managing function calls to evaluating mathematical expressions.

The two fundamental operations on a stack are push (adding an element to the top) and pop (removing the element from the top). Both of these operations execute in constant time O(1) because they only interact with the top of the stack. Additional operations typically include peek (viewing the top element without removing it) and isEmpty (checking whether the stack contains any elements). Some implementations also track the current size of the stack.

Stacks can be implemented using either arrays or linked lists. An array-based stack is straightforward: a pointer (or index) tracks the top of the stack, and push/pop operations simply increment or decrement this pointer. A linked-list-based stack uses the head of the list as the top of the stack, with push prepending a new node and pop removing the head node. Array-based implementations offer better cache locality, while linked-list implementations avoid the need for resizing.

Stacks are ubiquitous in computing. The call stack manages function invocation and return in virtually every programming language. Compilers use stacks to parse expressions and check balanced parentheses. Undo/redo functionality in text editors relies on stacks. Depth-first search (DFS) in graphs can be implemented iteratively using a stack. Browser history navigation (the back button) is conceptually a stack. Understanding stacks is foundational because they appear as building blocks in so many higher-level algorithms and system designs.`,
  shortDescription:
    "A linear LIFO data structure supporting constant-time push and pop operations at the top.",
  pseudocode: `// Array-based Stack

class Stack:
    items = []

    push(element):
        items.append(element)

    pop():
        if isEmpty():
            throw "Stack Underflow"
        return items.removeLast()

    peek():
        if isEmpty():
            throw "Stack is empty"
        return items[items.length - 1]

    isEmpty():
        return items.length == 0

    size():
        return items.length`,
  implementations: {
    python: `class Stack:
    """A stack implementation using a Python list."""

    def __init__(self):
        self._items: list = []

    def push(self, item) -> None:
        """Push an item onto the top of the stack. O(1) amortized."""
        self._items.append(item)

    def pop(self):
        """Remove and return the top item. Raises IndexError if empty. O(1)."""
        if self.is_empty():
            raise IndexError("Pop from an empty stack")
        return self._items.pop()

    def peek(self):
        """Return the top item without removing it. Raises IndexError if empty. O(1)."""
        if self.is_empty():
            raise IndexError("Peek at an empty stack")
        return self._items[-1]

    def is_empty(self) -> bool:
        """Return True if the stack has no elements. O(1)."""
        return len(self._items) == 0

    def size(self) -> int:
        """Return the number of elements in the stack. O(1)."""
        return len(self._items)

    def __repr__(self) -> str:
        return f"Stack(top -> {self._items[::-1]})"


# Example usage
if __name__ == "__main__":
    s = Stack()
    s.push(10)
    s.push(20)
    s.push(30)
    print(s)            # Stack(top -> [30, 20, 10])
    print(s.pop())      # 30
    print(s.peek())     # 20
    print(s.size())     # 2
    print(s.is_empty()) # False`,
    javascript: `class Stack {
  /** A stack implementation using a JavaScript array. */

  constructor() {
    this.items = [];
  }

  /** Push an item onto the top of the stack. O(1) amortized. */
  push(item) {
    this.items.push(item);
  }

  /** Remove and return the top item. Throws if empty. O(1). */
  pop() {
    if (this.isEmpty()) {
      throw new Error("Pop from an empty stack");
    }
    return this.items.pop();
  }

  /** Return the top item without removing it. Throws if empty. O(1). */
  peek() {
    if (this.isEmpty()) {
      throw new Error("Peek at an empty stack");
    }
    return this.items[this.items.length - 1];
  }

  /** Return true if the stack has no elements. O(1). */
  isEmpty() {
    return this.items.length === 0;
  }

  /** Return the number of elements in the stack. O(1). */
  size() {
    return this.items.length;
  }

  /** String representation showing top-first order. */
  toString() {
    return \`Stack(top -> [\${[...this.items].reverse().join(", ")}])\`;
  }
}

// Example usage
const s = new Stack();
s.push(10);
s.push(20);
s.push(30);
console.log(s.toString());  // Stack(top -> [30, 20, 10])
console.log(s.pop());       // 30
console.log(s.peek());      // 20
console.log(s.size());      // 2
console.log(s.isEmpty());   // false`,
  },
  useCases: [
    "Function call management — the call stack tracks active function invocations and local variables",
    "Expression evaluation — converting infix expressions to postfix and evaluating them using operator/operand stacks",
    "Undo/Redo functionality — text editors and design tools push actions onto a stack to support reversal",
    "Balanced parentheses checking — compilers and linters verify matching brackets using a stack",
    "Depth-First Search (DFS) — iterative DFS uses an explicit stack instead of recursion",
  ],
  relatedAlgorithms: ["queue", "linked-list", "binary-search-tree"],
  glossaryTerms: [
    "LIFO",
    "Push",
    "Pop",
    "Peek",
    "Stack Overflow",
    "Stack Underflow",
    "Call Stack",
    "Recursion",
  ],
  tags: [
    "stack",
    "LIFO",
    "linear",
    "data structure",
    "push",
    "pop",
    "beginner",
    "fundamental",
  ],
};
