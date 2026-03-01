import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const binaryTree: AlgorithmMetadata = {
  id: "binary-tree",
  name: "Binary Tree",
  category: "data-structures",
  subcategory: "Trees",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Traversal visits every node exactly once. For unordered binary trees, search, insert at a specific position, and delete all require O(n) traversal in the worst case.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Each node stores data and two child pointers. Recursive traversal uses O(h) stack space where h is the tree height (O(log n) for balanced, O(n) for skewed).",
  },
  description: `A binary tree is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child. It is one of the most fundamental tree structures in computer science and serves as the basis for many specialized trees including binary search trees, AVL trees, red-black trees, heaps, and segment trees. The topmost node is called the root, and nodes with no children are called leaves.

Binary trees have several important properties. The depth of a node is the number of edges from the root to that node. The height of a tree is the maximum depth among all nodes. A complete binary tree has all levels fully filled except possibly the last, which is filled from left to right. A full binary tree is one where every node has either zero or two children. A perfect binary tree has all internal nodes with exactly two children and all leaves at the same level.

There are three classical depth-first traversal orders for binary trees: in-order (left, root, right), pre-order (root, left, right), and post-order (left, right, root). In-order traversal of a binary search tree yields elements in sorted order. Pre-order traversal is useful for creating a copy of the tree or producing a prefix expression. Post-order traversal is used when you need to process children before parents, such as calculating the size of subtrees or deleting a tree. Breadth-first (level-order) traversal visits nodes level by level using a queue.

Binary trees are ubiquitous in computing. Expression trees represent mathematical expressions with operators as internal nodes and operands as leaves. Huffman coding trees enable optimal prefix-free compression. Decision trees in machine learning recursively partition feature space. Parse trees represent the syntactic structure of programs. Heap-ordered complete binary trees power priority queues. Understanding binary tree structure and traversal is essential prerequisite knowledge for nearly every advanced tree-based algorithm and data structure.`,
  shortDescription:
    "A hierarchical data structure where each node has at most two children, forming the basis for BSTs, heaps, and many other tree structures.",
  pseudocode: `// Binary Tree Traversals

class Node:
    value
    left = null
    right = null

// In-order traversal (Left, Root, Right)
inOrder(node):
    if node == null: return
    inOrder(node.left)
    visit(node.value)
    inOrder(node.right)

// Pre-order traversal (Root, Left, Right)
preOrder(node):
    if node == null: return
    visit(node.value)
    preOrder(node.left)
    preOrder(node.right)

// Post-order traversal (Left, Right, Root)
postOrder(node):
    if node == null: return
    postOrder(node.left)
    postOrder(node.right)
    visit(node.value)

// Level-order traversal (BFS)
levelOrder(root):
    if root == null: return
    queue = [root]
    while queue is not empty:
        node = queue.dequeue()
        visit(node.value)
        if node.left != null:
            queue.enqueue(node.left)
        if node.right != null:
            queue.enqueue(node.right)`,
  implementations: {
    python: `class Node:
    """A node in a binary tree."""

    __slots__ = ("value", "left", "right")

    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left: "Node | None" = left
        self.right: "Node | None" = right


def in_order(node: "Node | None") -> list:
    """In-order traversal: Left, Root, Right."""
    if node is None:
        return []
    return in_order(node.left) + [node.value] + in_order(node.right)


def pre_order(node: "Node | None") -> list:
    """Pre-order traversal: Root, Left, Right."""
    if node is None:
        return []
    return [node.value] + pre_order(node.left) + pre_order(node.right)


def post_order(node: "Node | None") -> list:
    """Post-order traversal: Left, Right, Root."""
    if node is None:
        return []
    return post_order(node.left) + post_order(node.right) + [node.value]


def level_order(root: "Node | None") -> list:
    """Level-order (BFS) traversal."""
    if root is None:
        return []
    result = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        result.append(node.value)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result


def height(node: "Node | None") -> int:
    """Return the height of the tree (-1 for empty)."""
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))


# Example usage
if __name__ == "__main__":
    #       1
    #      / \\
    #     2   3
    #    / \\   \\
    #   4   5   6
    root = Node(1,
        Node(2, Node(4), Node(5)),
        Node(3, None, Node(6))
    )
    print("In-order:   ", in_order(root))    # [4, 2, 5, 1, 3, 6]
    print("Pre-order:  ", pre_order(root))   # [1, 2, 4, 5, 3, 6]
    print("Post-order: ", post_order(root))  # [4, 5, 2, 6, 3, 1]
    print("Level-order:", level_order(root))  # [1, 2, 3, 4, 5, 6]
    print("Height:     ", height(root))       # 2`,
    javascript: `class Node {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

/** In-order traversal: Left, Root, Right. */
function inOrder(node) {
  if (node === null) return [];
  return [...inOrder(node.left), node.value, ...inOrder(node.right)];
}

/** Pre-order traversal: Root, Left, Right. */
function preOrder(node) {
  if (node === null) return [];
  return [node.value, ...preOrder(node.left), ...preOrder(node.right)];
}

/** Post-order traversal: Left, Right, Root. */
function postOrder(node) {
  if (node === null) return [];
  return [...postOrder(node.left), ...postOrder(node.right), node.value];
}

/** Level-order (BFS) traversal. */
function levelOrder(root) {
  if (root === null) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}

/** Return the height of the tree (-1 for empty). */
function height(node) {
  if (node === null) return -1;
  return 1 + Math.max(height(node.left), height(node.right));
}

// Example usage
//       1
//      / \\
//     2   3
//    / \\   \\
//   4   5   6
const root = new Node(1,
  new Node(2, new Node(4), new Node(5)),
  new Node(3, null, new Node(6))
);
console.log("In-order:   ", inOrder(root));    // [4, 2, 5, 1, 3, 6]
console.log("Pre-order:  ", preOrder(root));   // [1, 2, 4, 5, 3, 6]
console.log("Post-order: ", postOrder(root));  // [4, 5, 2, 6, 3, 1]
console.log("Level-order:", levelOrder(root)); // [1, 2, 3, 4, 5, 6]
console.log("Height:     ", height(root));      // 2`,
  },
  useCases: [
    "Expression trees -- represent mathematical expressions with operators as internal nodes and operands as leaves",
    "Huffman coding trees -- optimal prefix-free encoding for data compression",
    "Decision trees in machine learning -- recursively partition feature space for classification and regression",
    "Parse trees in compilers -- represent syntactic structure of programs derived from grammar rules",
    "File system hierarchies -- directories and files naturally form a tree structure",
  ],
  relatedAlgorithms: ["binary-search-tree", "linked-list", "stack", "queue"],
  glossaryTerms: [
    "Root",
    "Leaf",
    "Height",
    "Depth",
    "Level",
    "Complete Binary Tree",
    "Full Binary Tree",
    "Perfect Binary Tree",
    "In-Order Traversal",
    "Pre-Order Traversal",
    "Post-Order Traversal",
    "Level-Order Traversal",
  ],
  tags: [
    "binary tree",
    "tree",
    "data structure",
    "hierarchical",
    "traversal",
    "beginner",
    "fundamental",
    "recursive",
  ],
};
