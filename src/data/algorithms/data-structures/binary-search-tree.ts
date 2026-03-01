import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const binarySearchTree: AlgorithmMetadata = {
  id: "binary-search-tree",
  name: "Binary Search Tree",
  category: "data-structures",
  subcategory: "Trees",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(n)",
    note: "All operations are O(log n) on average for balanced trees. Worst case O(n) occurs when the tree degenerates into a linked list (e.g., inserting sorted data).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Each node stores data plus left and right child pointers. Recursive operations use O(h) stack space where h is the tree height.",
  },
  description: `A Binary Search Tree (BST) is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child. The defining property of a BST is that for every node, all values in its left subtree are strictly less than the node's value, and all values in its right subtree are strictly greater. This ordering property enables efficient searching, insertion, and deletion — all achievable in O(log n) time on average — making BSTs a cornerstone of computer science.

Searching in a BST starts at the root and compares the target value with the current node. If the target is smaller, the search moves to the left child; if larger, to the right child. This halving of the search space at each step gives the logarithmic average-case performance. Insertion follows the same path as search: traverse the tree to find the correct position where the new value should reside (i.e., a null child slot), then create a new node there. Deletion is more nuanced: deleting a leaf is trivial, deleting a node with one child involves replacing the node with its child, and deleting a node with two children requires finding its in-order successor (or predecessor) to maintain the BST property.

The performance of a BST depends critically on its shape. A balanced BST (where the height is O(log n)) provides optimal performance for all operations. However, if elements are inserted in sorted order, the tree degenerates into a linked list with O(n) height, making all operations linear. Self-balancing BST variants — such as AVL trees, Red-Black trees, and B-trees — automatically restructure themselves during insertions and deletions to maintain logarithmic height. These balanced variants are used in practice for most applications requiring ordered data.

BSTs support powerful ordered operations that hash tables cannot provide: in-order traversal yields elements in sorted order in O(n) time, finding the minimum and maximum elements is O(h), and range queries (finding all elements between two values) are efficient. BSTs form the foundation for many standard library data structures: C++'s std::map and std::set use Red-Black trees, Java's TreeMap and TreeSet use Red-Black trees, and databases use B-trees (a generalized BST) for indexing. Understanding the basic BST is essential before studying its balanced variants and their applications in databases, file systems, and computational geometry.`,
  shortDescription:
    "A hierarchical data structure where each node's left descendants are smaller and right descendants are larger, enabling O(log n) average-case operations.",
  pseudocode: `// Binary Search Tree

class Node:
    value
    left = null
    right = null

class BST:
    root = null

    insert(value):
        root = _insert(root, value)

    _insert(node, value):
        if node == null:
            return Node(value)
        if value < node.value:
            node.left = _insert(node.left, value)
        else if value > node.value:
            node.right = _insert(node.right, value)
        return node

    search(value):
        return _search(root, value)

    _search(node, value):
        if node == null:
            return false
        if value == node.value:
            return true
        if value < node.value:
            return _search(node.left, value)
        return _search(node.right, value)

    delete(value):
        root = _delete(root, value)

    _delete(node, value):
        if node == null:
            return null
        if value < node.value:
            node.left = _delete(node.left, value)
        else if value > node.value:
            node.right = _delete(node.right, value)
        else:
            // Node found
            if node.left == null:
                return node.right
            if node.right == null:
                return node.left
            // Two children: find in-order successor
            successor = findMin(node.right)
            node.value = successor.value
            node.right = _delete(node.right, successor.value)
        return node

    findMin(node):
        while node.left != null:
            node = node.left
        return node

    inOrderTraversal(node):
        if node != null:
            inOrderTraversal(node.left)
            visit(node.value)
            inOrderTraversal(node.right)`,
  implementations: {
    python: `class Node:
    """A node in a binary search tree."""

    __slots__ = ("value", "left", "right")

    def __init__(self, value):
        self.value = value
        self.left: "Node | None" = None
        self.right: "Node | None" = None


class BinarySearchTree:
    """A binary search tree supporting insert, search, delete, and traversal."""

    def __init__(self):
        self.root: Node | None = None

    def insert(self, value) -> None:
        """Insert a value into the BST. O(log n) average, O(n) worst."""
        self.root = self._insert(self.root, value)

    def _insert(self, node: "Node | None", value) -> Node:
        if node is None:
            return Node(value)
        if value < node.value:
            node.left = self._insert(node.left, value)
        elif value > node.value:
            node.right = self._insert(node.right, value)
        # Duplicate values are ignored
        return node

    def search(self, value) -> bool:
        """Return True if the value exists in the BST. O(log n) average, O(n) worst."""
        return self._search(self.root, value)

    def _search(self, node: "Node | None", value) -> bool:
        if node is None:
            return False
        if value == node.value:
            return True
        if value < node.value:
            return self._search(node.left, value)
        return self._search(node.right, value)

    def delete(self, value) -> None:
        """Delete a value from the BST. O(log n) average, O(n) worst."""
        self.root = self._delete(self.root, value)

    def _delete(self, node: "Node | None", value) -> "Node | None":
        if node is None:
            return None
        if value < node.value:
            node.left = self._delete(node.left, value)
        elif value > node.value:
            node.right = self._delete(node.right, value)
        else:
            # Node to delete found
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left
            # Two children: replace with in-order successor
            successor = self._find_min(node.right)
            node.value = successor.value
            node.right = self._delete(node.right, successor.value)
        return node

    def _find_min(self, node: Node) -> Node:
        """Find the node with the minimum value in the subtree."""
        while node.left is not None:
            node = node.left
        return node

    def find_min(self):
        """Return the minimum value in the BST. Raises ValueError if empty."""
        if self.root is None:
            raise ValueError("Tree is empty")
        return self._find_min(self.root).value

    def find_max(self):
        """Return the maximum value in the BST. Raises ValueError if empty."""
        if self.root is None:
            raise ValueError("Tree is empty")
        node = self.root
        while node.right is not None:
            node = node.right
        return node.value

    def in_order(self) -> list:
        """Return elements in sorted order via in-order traversal. O(n)."""
        result = []
        self._in_order(self.root, result)
        return result

    def _in_order(self, node: "Node | None", result: list) -> None:
        if node is not None:
            self._in_order(node.left, result)
            result.append(node.value)
            self._in_order(node.right, result)

    def __repr__(self) -> str:
        return f"BST({self.in_order()})"


# Example usage
if __name__ == "__main__":
    bst = BinarySearchTree()
    for val in [50, 30, 70, 20, 40, 60, 80]:
        bst.insert(val)
    print(bst)                # BST([20, 30, 40, 50, 60, 70, 80])
    print(bst.search(40))     # True
    print(bst.search(45))     # False
    bst.delete(30)
    print(bst.in_order())     # [20, 40, 50, 60, 70, 80]
    print(bst.find_min())     # 20
    print(bst.find_max())     # 80`,
    javascript: `class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  /** A binary search tree supporting insert, search, delete, and traversal. */

  constructor() {
    this.root = null;
  }

  /** Insert a value into the BST. O(log n) average, O(n) worst. */
  insert(value) {
    this.root = this._insert(this.root, value);
  }

  _insert(node, value) {
    if (node === null) return new Node(value);
    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    }
    // Duplicate values are ignored
    return node;
  }

  /** Return true if the value exists in the BST. O(log n) average, O(n) worst. */
  search(value) {
    return this._search(this.root, value);
  }

  _search(node, value) {
    if (node === null) return false;
    if (value === node.value) return true;
    if (value < node.value) return this._search(node.left, value);
    return this._search(node.right, value);
  }

  /** Delete a value from the BST. O(log n) average, O(n) worst. */
  delete(value) {
    this.root = this._delete(this.root, value);
  }

  _delete(node, value) {
    if (node === null) return null;
    if (value < node.value) {
      node.left = this._delete(node.left, value);
    } else if (value > node.value) {
      node.right = this._delete(node.right, value);
    } else {
      // Node to delete found
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;
      // Two children: replace with in-order successor
      const successor = this._findMin(node.right);
      node.value = successor.value;
      node.right = this._delete(node.right, successor.value);
    }
    return node;
  }

  _findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  /** Return the minimum value in the BST. Throws if empty. */
  findMin() {
    if (this.root === null) throw new Error("Tree is empty");
    return this._findMin(this.root).value;
  }

  /** Return the maximum value in the BST. Throws if empty. */
  findMax() {
    if (this.root === null) throw new Error("Tree is empty");
    let node = this.root;
    while (node.right !== null) {
      node = node.right;
    }
    return node.value;
  }

  /** Return elements in sorted order via in-order traversal. O(n). */
  inOrder() {
    const result = [];
    this._inOrder(this.root, result);
    return result;
  }

  _inOrder(node, result) {
    if (node !== null) {
      this._inOrder(node.left, result);
      result.push(node.value);
      this._inOrder(node.right, result);
    }
  }

  toString() {
    return \`BST([\${this.inOrder().join(", ")}])\`;
  }
}

// Example usage
const bst = new BinarySearchTree();
[50, 30, 70, 20, 40, 60, 80].forEach((v) => bst.insert(v));
console.log(bst.toString());   // BST([20, 30, 40, 50, 60, 70, 80])
console.log(bst.search(40));   // true
console.log(bst.search(45));   // false
bst.delete(30);
console.log(bst.inOrder());    // [20, 40, 50, 60, 70, 80]
console.log(bst.findMin());    // 20
console.log(bst.findMax());    // 80`,
  },
  useCases: [
    "Ordered data storage — BSTs maintain elements in sorted order, supporting efficient range queries and sorted iteration",
    "Database indexing — B-trees (generalized BSTs) are the standard indexing structure in relational databases",
    "Symbol tables in compilers — variable and function names are stored in BST-based symbol tables for fast lookup",
    "Auto-complete and spell checkers — augmented BSTs (like tries, which share the tree concept) power predictive text",
    "Priority scheduling — BSTs can serve as a basis for priority queues when ordered operations are needed",
  ],
  relatedAlgorithms: ["linked-list", "hash-table", "stack", "queue"],
  glossaryTerms: [
    "Binary Tree",
    "BST Property",
    "In-Order Traversal",
    "Pre-Order Traversal",
    "Post-Order Traversal",
    "Balanced Tree",
    "AVL Tree",
    "Red-Black Tree",
    "In-Order Successor",
    "Tree Height",
  ],
  tags: [
    "binary search tree",
    "BST",
    "tree",
    "data structure",
    "hierarchical",
    "ordered",
    "intermediate",
    "recursive",
  ],
};
