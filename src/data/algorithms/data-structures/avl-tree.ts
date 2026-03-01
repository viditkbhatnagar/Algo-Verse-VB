import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const avlTree: AlgorithmMetadata = {
  id: "avl-tree",
  name: "AVL Tree",
  category: "data-structures",
  subcategory: "Trees",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(log n)",
    note: "AVL trees guarantee O(log n) for search, insert, and delete because the height is always kept within O(log n) through rotations. The constant factor is slightly higher than a plain BST due to rebalancing.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Each node stores data, two child pointers, and a height/balance factor. The strict balancing means memory usage is always proportional to the number of elements.",
  },
  description: `An AVL tree (named after inventors Adelson-Velsky and Landis, 1962) is a self-balancing binary search tree in which the heights of the left and right subtrees of every node differ by at most one. This balance constraint, enforced through rotations after every insertion and deletion, guarantees that the tree height is always O(log n), ensuring worst-case O(log n) time for search, insert, and delete operations. AVL trees were the first self-balancing BST data structure to be invented.

The key concept in AVL trees is the balance factor, defined as height(left subtree) - height(right subtree). A valid AVL tree requires every node's balance factor to be -1, 0, or +1. When an insertion or deletion causes a node's balance factor to become -2 or +2, the tree performs one or two rotations to restore balance. There are four cases: Left-Left (single right rotation), Right-Right (single left rotation), Left-Right (left rotation on child, then right rotation on node), and Right-Left (right rotation on child, then left rotation on node).

A right rotation at node X makes X's left child become the new root of that subtree, with X becoming the right child. The left child's right subtree transfers to become X's left subtree. A left rotation is the mirror image. These rotations preserve the BST property (in-order ordering) while reducing the tree's height. After a rotation, the balance factors of affected nodes are updated. At most two rotations are needed per insertion and O(log n) rotations per deletion.

AVL trees provide stricter balancing than Red-Black trees (which allow a height ratio of up to 2:1), making AVL trees faster for lookup-heavy workloads due to their shorter height. However, Red-Black trees are faster for insert/delete-heavy workloads because they require fewer rotations. In practice, AVL trees are used in databases and in-memory dictionaries where reads far outnumber writes, while Red-Black trees are used in general-purpose libraries (e.g., C++ std::map, Java TreeMap). Understanding AVL trees is crucial for grasping how self-balancing works in all balanced BST variants.`,
  shortDescription:
    "A self-balancing BST where the height difference between left and right subtrees of every node is at most 1, guaranteeing O(log n) worst-case operations.",
  pseudocode: `// AVL Tree

class Node:
    value
    left = null
    right = null
    height = 0

height(node):
    return node == null ? -1 : node.height

balanceFactor(node):
    return height(node.left) - height(node.right)

updateHeight(node):
    node.height = 1 + max(height(node.left), height(node.right))

rotateRight(y):
    x = y.left
    T = x.right
    x.right = y
    y.left = T
    updateHeight(y)
    updateHeight(x)
    return x  // x is new root

rotateLeft(x):
    y = x.right
    T = y.left
    y.left = x
    x.right = T
    updateHeight(x)
    updateHeight(y)
    return y  // y is new root

rebalance(node):
    updateHeight(node)
    bf = balanceFactor(node)

    if bf > 1:  // Left-heavy
        if balanceFactor(node.left) < 0:  // Left-Right case
            node.left = rotateLeft(node.left)
        return rotateRight(node)

    if bf < -1:  // Right-heavy
        if balanceFactor(node.right) > 0:  // Right-Left case
            node.right = rotateRight(node.right)
        return rotateLeft(node)

    return node  // Already balanced

insert(node, value):
    if node == null:
        return Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else if value > node.value:
        node.right = insert(node.right, value)
    return rebalance(node)`,
  implementations: {
    python: `class Node:
    """A node in an AVL tree."""

    __slots__ = ("value", "left", "right", "height")

    def __init__(self, value):
        self.value = value
        self.left: "Node | None" = None
        self.right: "Node | None" = None
        self.height: int = 0


class AVLTree:
    """A self-balancing AVL binary search tree."""

    def __init__(self):
        self.root: Node | None = None

    @staticmethod
    def _height(node: "Node | None") -> int:
        return -1 if node is None else node.height

    @staticmethod
    def _update_height(node: Node) -> None:
        node.height = 1 + max(
            AVLTree._height(node.left),
            AVLTree._height(node.right),
        )

    @staticmethod
    def _balance_factor(node: Node) -> int:
        return AVLTree._height(node.left) - AVLTree._height(node.right)

    @staticmethod
    def _rotate_right(y: Node) -> Node:
        x = y.left
        assert x is not None
        t = x.right
        x.right = y
        y.left = t
        AVLTree._update_height(y)
        AVLTree._update_height(x)
        return x

    @staticmethod
    def _rotate_left(x: Node) -> Node:
        y = x.right
        assert y is not None
        t = y.left
        y.left = x
        x.right = t
        AVLTree._update_height(x)
        AVLTree._update_height(y)
        return y

    @staticmethod
    def _rebalance(node: Node) -> Node:
        AVLTree._update_height(node)
        bf = AVLTree._balance_factor(node)
        if bf > 1:
            if AVLTree._balance_factor(node.left) < 0:
                node.left = AVLTree._rotate_left(node.left)
            return AVLTree._rotate_right(node)
        if bf < -1:
            if AVLTree._balance_factor(node.right) > 0:
                node.right = AVLTree._rotate_right(node.right)
            return AVLTree._rotate_left(node)
        return node

    def insert(self, value) -> None:
        self.root = self._insert(self.root, value)

    def _insert(self, node: "Node | None", value) -> Node:
        if node is None:
            return Node(value)
        if value < node.value:
            node.left = self._insert(node.left, value)
        elif value > node.value:
            node.right = self._insert(node.right, value)
        return self._rebalance(node)

    def search(self, value) -> bool:
        node = self.root
        while node is not None:
            if value == node.value:
                return True
            node = node.left if value < node.value else node.right
        return False

    def in_order(self) -> list:
        result: list = []
        self._in_order(self.root, result)
        return result

    def _in_order(self, node: "Node | None", result: list) -> None:
        if node is not None:
            self._in_order(node.left, result)
            result.append(node.value)
            self._in_order(node.right, result)


# Example usage
if __name__ == "__main__":
    avl = AVLTree()
    for v in [30, 20, 10, 40, 50, 35]:
        avl.insert(v)
    print(avl.in_order())      # [10, 20, 30, 35, 40, 50]
    print(avl.search(35))      # True
    print(avl.search(25))      # False`,
    javascript: `class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 0;
  }
}

class AVLTree {
  /** A self-balancing AVL binary search tree. */

  constructor() {
    this.root = null;
  }

  _height(node) {
    return node === null ? -1 : node.height;
  }

  _updateHeight(node) {
    node.height = 1 + Math.max(
      this._height(node.left),
      this._height(node.right)
    );
  }

  _balanceFactor(node) {
    return this._height(node.left) - this._height(node.right);
  }

  _rotateRight(y) {
    const x = y.left;
    const t = x.right;
    x.right = y;
    y.left = t;
    this._updateHeight(y);
    this._updateHeight(x);
    return x;
  }

  _rotateLeft(x) {
    const y = x.right;
    const t = y.left;
    y.left = x;
    x.right = t;
    this._updateHeight(x);
    this._updateHeight(y);
    return y;
  }

  _rebalance(node) {
    this._updateHeight(node);
    const bf = this._balanceFactor(node);
    if (bf > 1) {
      if (this._balanceFactor(node.left) < 0) {
        node.left = this._rotateLeft(node.left);
      }
      return this._rotateRight(node);
    }
    if (bf < -1) {
      if (this._balanceFactor(node.right) > 0) {
        node.right = this._rotateRight(node.right);
      }
      return this._rotateLeft(node);
    }
    return node;
  }

  /** Insert a value into the AVL tree. O(log n). */
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
    return this._rebalance(node);
  }

  /** Return true if the value exists in the tree. O(log n). */
  search(value) {
    let node = this.root;
    while (node !== null) {
      if (value === node.value) return true;
      node = value < node.value ? node.left : node.right;
    }
    return false;
  }

  /** Return elements in sorted order. O(n). */
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
    return \`AVL([\${this.inOrder().join(", ")}])\`;
  }
}

// Example usage
const avl = new AVLTree();
[30, 20, 10, 40, 50, 35].forEach((v) => avl.insert(v));
console.log(avl.toString());     // AVL([10, 20, 30, 35, 40, 50])
console.log(avl.search(35));     // true
console.log(avl.search(25));     // false`,
  },
  useCases: [
    "Database indexing -- AVL trees provide guaranteed O(log n) lookups ideal for read-heavy database indexes",
    "In-memory dictionaries -- when consistent lookup performance is critical and writes are less frequent",
    "Real-time systems -- worst-case O(log n) guarantee is important when predictable response times are required",
    "Spell checkers and auto-complete -- balanced tree structure ensures fast prefix lookups",
    "Symbol tables in compilers -- fast guaranteed lookup for variable and function name resolution",
  ],
  relatedAlgorithms: ["binary-search-tree", "linked-list", "hash-table"],
  glossaryTerms: [
    "Balance Factor",
    "Left Rotation",
    "Right Rotation",
    "Left-Right Rotation",
    "Right-Left Rotation",
    "Self-Balancing",
    "Height-Balanced",
    "AVL Property",
    "Red-Black Tree",
    "Tree Height",
  ],
  tags: [
    "AVL tree",
    "self-balancing",
    "BST",
    "tree",
    "data structure",
    "rotations",
    "intermediate",
    "balanced",
  ],
};
