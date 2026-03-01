import type {
  VisualizationStep,
  TreeStepData,
  TreeNodeData,
  TreeEdgeData,
} from "@/lib/visualization/types";

/**
 * Generates visualization steps for AVL Tree operations:
 * 1. Insert 30, 20, 10 -- triggers a RIGHT rotation (LL case)
 * 2. Insert 40, 50 -- triggers a LEFT rotation (RR case)
 * 3. Insert 35 -- triggers a RIGHT-LEFT rotation (RL case)
 *
 * Shows balance factor updates and rotation mechanics at each step.
 */
export function generateAVLTreeSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // --- Internal AVL node representation ---
  interface AVLNode {
    id: string;
    value: number;
    left: AVLNode | null;
    right: AVLNode | null;
    height: number;
  }

  let root: AVLNode | null = null;
  let nodeCounter = 0;

  function createNode(value: number): AVLNode {
    return { id: `n${nodeCounter++}`, value, left: null, right: null, height: 0 };
  }

  function height(node: AVLNode | null): number {
    return node === null ? -1 : node.height;
  }

  function updateHeight(node: AVLNode): void {
    node.height = 1 + Math.max(height(node.left), height(node.right));
  }

  function balanceFactor(node: AVLNode): number {
    return height(node.left) - height(node.right);
  }

  // --- Convert internal tree to viz types ---
  function toTreeNodes(
    node: AVLNode | null,
    parent: string | null,
    highlights: Record<string, "active" | "comparing" | "completed" | "swapping" | "selected">,
  ): TreeNodeData[] {
    if (!node) return [];
    const children: string[] = [];
    if (node.left) children.push(node.left.id);
    if (node.right) children.push(node.right.id);

    const self: TreeNodeData = {
      id: node.id,
      value: node.value,
      children,
      parent,
      highlight: highlights[node.id],
      balanceFactor: balanceFactor(node),
    };

    return [
      self,
      ...toTreeNodes(node.left, node.id, highlights),
      ...toTreeNodes(node.right, node.id, highlights),
    ];
  }

  function toTreeEdges(
    node: AVLNode | null,
    edgeHighlights: Record<string, "active" | "comparing" | "completed">,
  ): TreeEdgeData[] {
    if (!node) return [];
    const edges: TreeEdgeData[] = [];
    if (node.left) {
      edges.push({
        source: node.id,
        target: node.left.id,
        highlight: edgeHighlights[`${node.id}-${node.left.id}`],
      });
      edges.push(...toTreeEdges(node.left, edgeHighlights));
    }
    if (node.right) {
      edges.push({
        source: node.id,
        target: node.right.id,
        highlight: edgeHighlights[`${node.id}-${node.right.id}`],
      });
      edges.push(...toTreeEdges(node.right, edgeHighlights));
    }
    return edges;
  }

  function snap(
    currentNodeId: string | null,
    operation: string,
    highlights: Record<string, "active" | "comparing" | "completed" | "swapping" | "selected"> = {},
    edgeHighlights: Record<string, "active" | "comparing" | "completed"> = {},
  ): TreeStepData {
    return {
      nodes: toTreeNodes(root, null, highlights),
      edges: toTreeEdges(root, edgeHighlights),
      rootId: root?.id ?? null,
      currentNodeId,
      operation,
    } satisfies TreeStepData;
  }

  // --- AVL rotations (return new subtree root) ---
  function rotateRight(y: AVLNode): AVLNode {
    const x = y.left!;
    const t = x.right;
    x.right = y;
    y.left = t;
    updateHeight(y);
    updateHeight(x);
    return x;
  }

  function rotateLeft(x: AVLNode): AVLNode {
    const y = x.right!;
    const t = y.left;
    y.left = x;
    x.right = t;
    updateHeight(x);
    updateHeight(y);
    return y;
  }

  // ===== Introduction =====
  steps.push({
    id: stepId++,
    description: "AVL Tree: A self-balancing BST where every node's balance factor (height(left) - height(right)) is -1, 0, or +1. We will insert values that trigger rotations.",
    action: "highlight",
    highlights: [],
    data: snap(null, "intro"),
  });

  // ===== INSERT 30 =====
  const n30 = createNode(30);
  root = n30;

  steps.push({
    id: stepId++,
    description: "Insert 30: Tree is empty. Create root node 30. Balance factor = 0 (balanced).",
    action: "insert",
    highlights: [{ indices: [0], color: "active" }],
    data: snap(n30.id, "insert", { [n30.id]: "active" }),
    variables: { insertValue: 30 },
  });

  // ===== INSERT 20 =====
  const n20 = createNode(20);
  n30.left = n20;
  updateHeight(n30);

  steps.push({
    id: stepId++,
    description: "Insert 20: 20 < 30, insert as left child of 30. Balance factor of 30 becomes +1 (left-heavy but still valid).",
    action: "insert",
    highlights: [{ indices: [0], color: "active" }],
    data: snap(n20.id, "insert", { [n20.id]: "active" }),
    variables: { insertValue: 20, bf30: balanceFactor(n30) },
  });

  // ===== INSERT 10 -- triggers RIGHT rotation =====
  const n10 = createNode(10);
  n20.left = n10;
  updateHeight(n20);
  updateHeight(n30);

  // Show the UNBALANCED state first
  steps.push({
    id: stepId++,
    description: "Insert 10: 10 < 30, 10 < 20, insert as left child of 20. Now balance factor of 30 = +2 (VIOLATION!). Tree is left-left heavy.",
    action: "insert",
    highlights: [{ indices: [0], color: "swapping" }],
    data: snap(n10.id, "insert", { [n10.id]: "active", [n30.id]: "swapping" }),
    variables: { insertValue: 10, bf30: balanceFactor(n30), violation: "Left-Left" },
  });

  // Show the rotation
  steps.push({
    id: stepId++,
    description: "LEFT-LEFT case at node 30: Perform a single RIGHT ROTATION. Node 20 becomes the new root, 30 becomes 20's right child.",
    action: "rotate-right",
    highlights: [{ indices: [0], color: "comparing" }],
    data: snap(n30.id, "rotate-right", { [n30.id]: "comparing", [n20.id]: "comparing", [n10.id]: "comparing" }),
    variables: { rotationType: "Right Rotation", pivot: 20 },
  });

  // Perform the actual rotation
  root = rotateRight(n30);

  steps.push({
    id: stepId++,
    description: "After RIGHT ROTATION: Tree is balanced! Root is 20, left child is 10, right child is 30. All balance factors are 0.",
    action: "complete",
    highlights: [],
    data: snap(null, "rotate-right", {
      [root.id]: "completed",
      [root.left!.id]: "completed",
      [root.right!.id]: "completed",
    }),
    variables: { bf20: balanceFactor(root), bf10: balanceFactor(root.left!), bf30: balanceFactor(root.right!) },
  });

  // ===== INSERT 40 =====
  const n40 = createNode(40);
  // 40 > 20 -> right; 40 > 30 -> right child of 30
  root.right!.right = n40;
  updateHeight(root.right!); // node 30
  updateHeight(root); // node 20

  steps.push({
    id: stepId++,
    description: "Insert 40: 40 > 20, 40 > 30, insert as right child of 30. Balance factor of 20 = -1 (right-heavy but still valid).",
    action: "insert",
    highlights: [{ indices: [0], color: "active" }],
    data: snap(n40.id, "insert", { [n40.id]: "active" }),
    variables: { insertValue: 40, bf20: balanceFactor(root), bf30: balanceFactor(root.right!) },
  });

  // ===== INSERT 50 -- triggers LEFT rotation =====
  const n50 = createNode(50);
  n40.right = n50;
  updateHeight(n40);
  updateHeight(root.right!); // node 30
  updateHeight(root); // node 20

  // Show UNBALANCED state
  steps.push({
    id: stepId++,
    description: "Insert 50: 50 > 20, 50 > 30, 50 > 40, insert as right child of 40. Balance factor of 30 = -2 (VIOLATION!). Tree is right-right heavy at node 30.",
    action: "insert",
    highlights: [{ indices: [0], color: "swapping" }],
    data: snap(n50.id, "insert", { [n50.id]: "active", [root.right!.id]: "swapping" }),
    variables: { insertValue: 50, bf30: balanceFactor(root.right!), violation: "Right-Right" },
  });

  // Show the rotation
  const node30Ref = root.right!;
  steps.push({
    id: stepId++,
    description: "RIGHT-RIGHT case at node 30: Perform a single LEFT ROTATION. Node 40 becomes the new subtree root, 30 becomes 40's left child.",
    action: "rotate-left",
    highlights: [{ indices: [0], color: "comparing" }],
    data: snap(node30Ref.id, "rotate-left", {
      [node30Ref.id]: "comparing",
      [n40.id]: "comparing",
      [n50.id]: "comparing",
    }),
    variables: { rotationType: "Left Rotation", pivot: 40 },
  });

  // Perform the rotation on the right subtree
  root.right = rotateLeft(node30Ref);
  updateHeight(root);

  steps.push({
    id: stepId++,
    description: "After LEFT ROTATION: Subtree rooted at 40 is balanced (30 left, 50 right). Full tree: root=20, left=10, right subtree rooted at 40.",
    action: "complete",
    highlights: [],
    data: snap(null, "rotate-left", {
      [root.id]: "completed",
      [root.left!.id]: "completed",
      [root.right!.id]: "completed",
      [root.right!.left!.id]: "completed",
      [root.right!.right!.id]: "completed",
    }),
    variables: {
      bf20: balanceFactor(root),
      bf40: balanceFactor(root.right!),
      bf30: balanceFactor(root.right!.left!),
      bf50: balanceFactor(root.right!.right!),
    },
  });

  // ===== INSERT 35 -- triggers RIGHT-LEFT rotation =====
  const n35 = createNode(35);

  // Navigate: 35 > 20 -> right (40); 35 < 40 -> left (30); 35 > 30 -> right child of 30
  root.right!.left!.right = n35; // 30's right child
  updateHeight(root.right!.left!); // node 30
  updateHeight(root.right!); // node 40
  updateHeight(root); // node 20

  steps.push({
    id: stepId++,
    description: "Insert 35: 35 > 20 -> go right (40), 35 < 40 -> go left (30), 35 > 30 -> insert as right child of 30.",
    action: "insert",
    highlights: [{ indices: [0], color: "active" }],
    data: snap(n35.id, "insert", { [n35.id]: "active" }),
    variables: { insertValue: 35 },
  });

  // Check balance -- node 20 has bf = -2 (right subtree too heavy)
  // node 40 has bf = +1 (left-heavy: left subtree height 1 vs right height 0)
  // This is a Right-Left case at node 20

  steps.push({
    id: stepId++,
    description: `Balance check: node 20 has balance factor = ${balanceFactor(root)} (VIOLATION!). Right child 40 has BF = ${balanceFactor(root.right!)} (left-heavy). This is a RIGHT-LEFT case.`,
    action: "highlight",
    highlights: [{ indices: [0], color: "swapping" }],
    data: snap(root.id, "rebalance", { [root.id]: "swapping", [root.right!.id]: "comparing" }),
    variables: { bf20: balanceFactor(root), bf40: balanceFactor(root.right!), violation: "Right-Left" },
  });

  // Step 1: Right rotation on right child (40)
  steps.push({
    id: stepId++,
    description: "RIGHT-LEFT case: Step 1 -- Perform RIGHT ROTATION on right child (node 40). This converts it to a Right-Right case.",
    action: "rotate-right",
    highlights: [{ indices: [0], color: "comparing" }],
    data: snap(root.right!.id, "rotate-right", {
      [root.right!.id]: "comparing",
      [root.right!.left!.id]: "comparing",
    }),
    variables: { rotationType: "Right Rotation on child", pivot: root.right!.left!.value },
  });

  root.right = rotateRight(root.right!);
  updateHeight(root);

  steps.push({
    id: stepId++,
    description: "After right rotation on subtree: Node 30 is now the right child of 20, with 40 and 35 rearranged. Now it looks like a Right-Right case at node 20.",
    action: "highlight",
    highlights: [],
    data: snap(null, "intermediate", {
      [root.right!.id]: "comparing",
      [root.right!.left!.id]: "comparing",
      [root.right!.right!.id]: "comparing",
    }),
    variables: { bf20: balanceFactor(root) },
  });

  // Step 2: Left rotation on root (20)
  steps.push({
    id: stepId++,
    description: "Step 2 -- Perform LEFT ROTATION on node 20. Node 30 becomes the new root of this subtree.",
    action: "rotate-left",
    highlights: [{ indices: [0], color: "comparing" }],
    data: snap(root.id, "rotate-left", {
      [root.id]: "comparing",
      [root.right!.id]: "comparing",
    }),
    variables: { rotationType: "Left Rotation on root", pivot: root.right!.value },
  });

  root = rotateLeft(root);

  // Show final balanced state
  const allHighlights: Record<string, "completed"> = {};
  function markAllCompleted(node: AVLNode | null) {
    if (!node) return;
    allHighlights[node.id] = "completed";
    markAllCompleted(node.left);
    markAllCompleted(node.right);
  }
  markAllCompleted(root);

  steps.push({
    id: stepId++,
    description: "After RIGHT-LEFT double rotation: Tree is fully balanced! Root is 30, left subtree has [10, 20], right subtree has [35, 40, 50]. All balance factors are -1, 0, or +1.",
    action: "complete",
    highlights: [],
    data: snap(null, "complete", allHighlights),
    variables: {
      bf30: balanceFactor(root),
      bfLeft: root.left ? balanceFactor(root.left) : 0,
      bfRight: root.right ? balanceFactor(root.right) : 0,
    },
  });

  // Final summary
  steps.push({
    id: stepId++,
    description: "AVL Tree complete! Inserted [30, 20, 10, 40, 50, 35] with 3 rotations: 1 right (LL), 1 left (RR), 1 double right-left (RL). The tree height is 2, guaranteeing O(log n) operations.",
    action: "complete",
    highlights: [],
    data: snap(null, "summary", allHighlights),
    variables: { treeHeight: root.height, totalRotations: 3 },
  });

  return steps;
}
