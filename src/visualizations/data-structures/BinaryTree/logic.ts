import type {
  VisualizationStep,
  TreeStepData,
  TreeNodeData,
  TreeEdgeData,
} from "@/lib/visualization/types";

/**
 * Generates visualization steps for Binary Tree traversals:
 * 1. Build a sample binary tree
 * 2. In-order traversal  (Left, Root, Right)
 * 3. Pre-order traversal (Root, Left, Right)
 * 4. Post-order traversal (Left, Right, Root)
 *
 * Sample tree:
 *         1
 *        / \
 *       2   3
 *      / \   \
 *     4   5   6
 */
export function generateBinaryTreeSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // --- Define tree structure ---
  // We build the tree incrementally for educational value

  function makeNodes(ids: string[], highlights?: Record<string, "active" | "comparing" | "completed" | "selected">): TreeNodeData[] {
    const allNodeDefs: Record<string, { value: number; children: string[]; parent: string | null }> = {
      n1: { value: 1, children: ["n2", "n3"], parent: null },
      n2: { value: 2, children: ["n4", "n5"], parent: "n1" },
      n3: { value: 3, children: ["n6"], parent: "n1" },
      n4: { value: 4, children: [], parent: "n2" },
      n5: { value: 5, children: [], parent: "n2" },
      n6: { value: 6, children: [], parent: "n3" },
    };

    return ids.map((id) => {
      const def = allNodeDefs[id];
      const childrenInTree = def.children.filter((c) => ids.includes(c));
      return {
        id,
        value: def.value,
        children: childrenInTree,
        parent: def.parent && ids.includes(def.parent) ? def.parent : null,
        highlight: highlights?.[id],
      };
    });
  }

  function makeEdges(nodeIds: string[]): TreeEdgeData[] {
    const parentChild: [string, string][] = [
      ["n1", "n2"], ["n1", "n3"],
      ["n2", "n4"], ["n2", "n5"],
      ["n3", "n6"],
    ];
    return parentChild
      .filter(([s, t]) => nodeIds.includes(s) && nodeIds.includes(t))
      .map(([source, target]) => ({ source, target }));
  }

  function snap(
    nodeIds: string[],
    currentNodeId: string | null,
    operation: string,
    highlights?: Record<string, "active" | "comparing" | "completed" | "selected">,
    edgeHighlights?: Record<string, "active" | "comparing" | "completed">,
  ): TreeStepData {
    const nodes = makeNodes(nodeIds, highlights);
    const edges = makeEdges(nodeIds).map((e) => ({
      ...e,
      highlight: edgeHighlights?.[`${e.source}-${e.target}`],
    }));
    return {
      nodes,
      edges,
      rootId: nodeIds.includes("n1") ? "n1" : null,
      currentNodeId,
      operation,
    } satisfies TreeStepData;
  }

  const allIds = ["n1", "n2", "n3", "n4", "n5", "n6"];

  // ===== PHASE 1: Build the tree =====

  steps.push({
    id: stepId++,
    description: "We will build a binary tree and demonstrate three traversal orders: in-order, pre-order, and post-order.",
    action: "highlight",
    highlights: [],
    data: snap([], null, "build"),
  });

  // Insert root
  steps.push({
    id: stepId++,
    description: "Insert root node with value 1. This is the topmost node of our binary tree.",
    action: "insert",
    highlights: [{ indices: [0], color: "active" }],
    data: snap(["n1"], "n1", "build", { n1: "active" }),
  });

  // Insert node 2 (left child of 1)
  steps.push({
    id: stepId++,
    description: "Insert node 2 as the left child of node 1.",
    action: "insert",
    highlights: [{ indices: [1], color: "active" }],
    data: snap(["n1", "n2"], "n2", "build", { n2: "active" }),
  });

  // Insert node 3 (right child of 1)
  steps.push({
    id: stepId++,
    description: "Insert node 3 as the right child of node 1.",
    action: "insert",
    highlights: [{ indices: [2], color: "active" }],
    data: snap(["n1", "n2", "n3"], "n3", "build", { n3: "active" }),
  });

  // Insert node 4 (left child of 2)
  steps.push({
    id: stepId++,
    description: "Insert node 4 as the left child of node 2.",
    action: "insert",
    highlights: [{ indices: [3], color: "active" }],
    data: snap(["n1", "n2", "n3", "n4"], "n4", "build", { n4: "active" }),
  });

  // Insert node 5 (right child of 2)
  steps.push({
    id: stepId++,
    description: "Insert node 5 as the right child of node 2.",
    action: "insert",
    highlights: [{ indices: [4], color: "active" }],
    data: snap(["n1", "n2", "n3", "n4", "n5"], "n5", "build", { n5: "active" }),
  });

  // Insert node 6 (right child of 3)
  steps.push({
    id: stepId++,
    description: "Insert node 6 as the right child of node 3. Tree construction complete!",
    action: "insert",
    highlights: [{ indices: [5], color: "active" }],
    data: snap(allIds, "n6", "build", { n6: "active" }),
  });

  // Show complete tree
  steps.push({
    id: stepId++,
    description: "Complete binary tree: root=1, with children 2,3. Node 2 has children 4,5. Node 3 has child 6. Height = 2.",
    action: "complete",
    highlights: [],
    data: snap(allIds, null, "build", {
      n1: "completed", n2: "completed", n3: "completed",
      n4: "completed", n5: "completed", n6: "completed",
    }),
  });

  // ===== PHASE 2: In-order Traversal (Left, Root, Right) =====
  // Expected order: 4, 2, 5, 1, 3, 6

  steps.push({
    id: stepId++,
    description: "IN-ORDER TRAVERSAL (Left, Root, Right): Visit left subtree first, then the node itself, then the right subtree.",
    action: "highlight",
    highlights: [],
    data: snap(allIds, null, "in-order"),
  });

  const inorderSequence: { id: string; value: number; desc: string }[] = [
    { id: "n4", value: 4, desc: "Go left from 1, left from 2. Node 4 is a leaf with no left child. Visit 4." },
    { id: "n2", value: 2, desc: "Left subtree of 2 done. Visit node 2 (the root of this subtree)." },
    { id: "n5", value: 5, desc: "Now visit right child of 2. Node 5 is a leaf. Visit 5." },
    { id: "n1", value: 1, desc: "Left subtree of 1 complete (4,2,5). Visit root node 1." },
    { id: "n3", value: 3, desc: "Move to right subtree of 1. Node 3 has no left child. Visit 3." },
    { id: "n6", value: 6, desc: "Visit right child of 3. Node 6 is a leaf. Visit 6. Traversal complete!" },
  ];

  const visitedInorder: string[] = [];

  for (const item of inorderSequence) {
    visitedInorder.push(item.id);
    const highlights: Record<string, "active" | "completed"> = {};
    for (const vid of visitedInorder.slice(0, -1)) {
      highlights[vid] = "completed";
    }
    highlights[item.id] = "active";

    steps.push({
      id: stepId++,
      description: `In-order step ${visitedInorder.length}: ${item.desc} Order so far: [${visitedInorder.map((v) => v.replace("n", "")).join(", ")}]`,
      action: "visit",
      highlights: [{ indices: [visitedInorder.length - 1], color: "active" }],
      data: snap(allIds, item.id, "in-order", highlights),
      variables: { traversalOrder: visitedInorder.map((v) => parseInt(v.replace("n", ""), 10)) },
    });
  }

  // Mark all completed for in-order
  steps.push({
    id: stepId++,
    description: "In-order traversal complete! Result: [4, 2, 5, 1, 3, 6]. For a BST, this would yield sorted order.",
    action: "complete",
    highlights: [],
    data: snap(allIds, null, "in-order", {
      n1: "completed", n2: "completed", n3: "completed",
      n4: "completed", n5: "completed", n6: "completed",
    }),
    variables: { traversalOrder: [4, 2, 5, 1, 3, 6] },
  });

  // ===== PHASE 3: Pre-order Traversal (Root, Left, Right) =====
  // Expected order: 1, 2, 4, 5, 3, 6

  steps.push({
    id: stepId++,
    description: "PRE-ORDER TRAVERSAL (Root, Left, Right): Visit the node first, then its left subtree, then its right subtree.",
    action: "highlight",
    highlights: [],
    data: snap(allIds, null, "pre-order"),
  });

  const preorderSequence: { id: string; value: number; desc: string }[] = [
    { id: "n1", value: 1, desc: "Visit root node 1 first (pre-order visits root before children)." },
    { id: "n2", value: 2, desc: "Move to left child. Visit node 2 before exploring its subtree." },
    { id: "n4", value: 4, desc: "Move to left child of 2. Visit leaf node 4." },
    { id: "n5", value: 5, desc: "Back to 2, visit right child. Visit leaf node 5." },
    { id: "n3", value: 3, desc: "Left subtree of 1 done. Move to right child. Visit node 3." },
    { id: "n6", value: 6, desc: "Visit right child of 3. Visit leaf node 6. Traversal complete!" },
  ];

  const visitedPreorder: string[] = [];

  for (const item of preorderSequence) {
    visitedPreorder.push(item.id);
    const highlights: Record<string, "active" | "completed"> = {};
    for (const vid of visitedPreorder.slice(0, -1)) {
      highlights[vid] = "completed";
    }
    highlights[item.id] = "active";

    steps.push({
      id: stepId++,
      description: `Pre-order step ${visitedPreorder.length}: ${item.desc} Order so far: [${visitedPreorder.map((v) => v.replace("n", "")).join(", ")}]`,
      action: "visit",
      highlights: [{ indices: [visitedPreorder.length - 1], color: "active" }],
      data: snap(allIds, item.id, "pre-order", highlights),
      variables: { traversalOrder: visitedPreorder.map((v) => parseInt(v.replace("n", ""), 10)) },
    });
  }

  steps.push({
    id: stepId++,
    description: "Pre-order traversal complete! Result: [1, 2, 4, 5, 3, 6]. Useful for serializing/copying a tree.",
    action: "complete",
    highlights: [],
    data: snap(allIds, null, "pre-order", {
      n1: "completed", n2: "completed", n3: "completed",
      n4: "completed", n5: "completed", n6: "completed",
    }),
    variables: { traversalOrder: [1, 2, 4, 5, 3, 6] },
  });

  // ===== PHASE 4: Post-order Traversal (Left, Right, Root) =====
  // Expected order: 4, 5, 2, 6, 3, 1

  steps.push({
    id: stepId++,
    description: "POST-ORDER TRAVERSAL (Left, Right, Root): Visit both subtrees first, then the node itself.",
    action: "highlight",
    highlights: [],
    data: snap(allIds, null, "post-order"),
  });

  const postorderSequence: { id: string; value: number; desc: string }[] = [
    { id: "n4", value: 4, desc: "Go left from 1, left from 2. Leaf node 4 has no children. Visit 4." },
    { id: "n5", value: 5, desc: "Right child of 2. Leaf node 5 has no children. Visit 5." },
    { id: "n2", value: 2, desc: "Both children of 2 visited (4,5). Now visit node 2 itself." },
    { id: "n6", value: 6, desc: "Right subtree of 1: node 3's right child. Leaf 6, visit 6." },
    { id: "n3", value: 3, desc: "Node 3's children done (6). Visit node 3." },
    { id: "n1", value: 1, desc: "Both subtrees of root done. Visit root node 1 last. Traversal complete!" },
  ];

  const visitedPostorder: string[] = [];

  for (const item of postorderSequence) {
    visitedPostorder.push(item.id);
    const highlights: Record<string, "active" | "completed"> = {};
    for (const vid of visitedPostorder.slice(0, -1)) {
      highlights[vid] = "completed";
    }
    highlights[item.id] = "active";

    steps.push({
      id: stepId++,
      description: `Post-order step ${visitedPostorder.length}: ${item.desc} Order so far: [${visitedPostorder.map((v) => v.replace("n", "")).join(", ")}]`,
      action: "visit",
      highlights: [{ indices: [visitedPostorder.length - 1], color: "active" }],
      data: snap(allIds, item.id, "post-order", highlights),
      variables: { traversalOrder: visitedPostorder.map((v) => parseInt(v.replace("n", ""), 10)) },
    });
  }

  steps.push({
    id: stepId++,
    description: "Post-order traversal complete! Result: [4, 5, 2, 6, 3, 1]. Useful for deleting a tree (children first) or evaluating expressions.",
    action: "complete",
    highlights: [],
    data: snap(allIds, null, "post-order", {
      n1: "completed", n2: "completed", n3: "completed",
      n4: "completed", n5: "completed", n6: "completed",
    }),
    variables: { traversalOrder: [4, 5, 2, 6, 3, 1] },
  });

  return steps;
}
