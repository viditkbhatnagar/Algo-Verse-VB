import type {
  VisualizationStep,
  TreeStepData,
  TreeNodeData,
  TreeEdgeData,
} from "@/lib/visualization/types";

/**
 * Generates visualization steps for BST operations:
 * 1. Insert values [50, 30, 70, 20, 40, 60, 80] one by one, showing BST property
 * 2. Search for value 40
 *
 * Each insert shows the traversal from root, comparison at each node,
 * and final placement as a leaf.
 */
export function generateBSTSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Internal BST representation
  interface BSTNode {
    id: string;
    value: number;
    left: BSTNode | null;
    right: BSTNode | null;
  }

  let root: BSTNode | null = null;
  let nodeCounter = 0;

  function createNode(value: number): BSTNode {
    return { id: `n${nodeCounter++}`, value, left: null, right: null };
  }

  // Convert internal BST to visualization types
  function toTreeNodes(node: BSTNode | null, parent: string | null, highlights: Record<string, "active" | "comparing" | "completed" | "selected">): TreeNodeData[] {
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
    };

    return [
      self,
      ...toTreeNodes(node.left, node.id, highlights),
      ...toTreeNodes(node.right, node.id, highlights),
    ];
  }

  function toTreeEdges(node: BSTNode | null, edgeHighlights: Record<string, "active" | "comparing" | "completed">): TreeEdgeData[] {
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
    highlights: Record<string, "active" | "comparing" | "completed" | "selected"> = {},
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

  // ===== Introduction =====
  steps.push({
    id: stepId++,
    description: "Binary Search Tree: We will insert values [50, 30, 70, 20, 40, 60, 80] one by one, maintaining the BST property: left < parent < right.",
    action: "highlight",
    highlights: [],
    data: snap(null, "intro"),
  });

  // ===== Insert values one by one =====
  const valuesToInsert = [50, 30, 70, 20, 40, 60, 80];

  for (const value of valuesToInsert) {
    const newNode = createNode(value);

    if (root === null) {
      // First insertion -- root
      root = newNode;

      steps.push({
        id: stepId++,
        description: `Insert ${value}: Tree is empty. Create root node with value ${value}.`,
        action: "insert",
        highlights: [{ indices: [0], color: "active" }],
        data: snap(newNode.id, "insert", { [newNode.id]: "active" }),
        variables: { insertValue: value },
      });

      steps.push({
        id: stepId++,
        description: `Node ${value} is now the root of the BST.`,
        action: "complete",
        highlights: [{ indices: [0], color: "completed" }],
        data: snap(null, "insert", { [newNode.id]: "completed" }),
        variables: { insertValue: value },
      });

      continue;
    }

    // Traverse to find insertion point
    steps.push({
      id: stepId++,
      description: `Insert ${value}: Start at root to find the correct position.`,
      action: "highlight",
      highlights: [],
      data: snap(null, "insert"),
      variables: { insertValue: value },
    });

    let current: BSTNode = root;
    const path: BSTNode[] = [];

    while (true) {
      path.push(current);

      // Show comparison
      const pathHighlights: Record<string, "active" | "comparing" | "completed"> = {};
      for (const p of path.slice(0, -1)) {
        pathHighlights[p.id] = "completed";
      }
      pathHighlights[current.id] = "comparing";

      steps.push({
        id: stepId++,
        description: `Compare ${value} with node ${current.value}: ${value < current.value ? `${value} < ${current.value}, go LEFT` : `${value} > ${current.value}, go RIGHT`}.`,
        action: "compare",
        highlights: [{ indices: [path.length - 1], color: "comparing" }],
        data: snap(current.id, "insert", pathHighlights),
        variables: { insertValue: value, compareWith: current.value, direction: value < current.value ? "left" : "right" },
      });

      if (value < current.value) {
        if (current.left === null) {
          // Insert here
          current.left = newNode;

          const insertHighlights: Record<string, "active" | "completed"> = {};
          for (const p of path) {
            insertHighlights[p.id] = "completed";
          }
          insertHighlights[newNode.id] = "active";

          steps.push({
            id: stepId++,
            description: `Left child of ${current.value} is empty. Insert ${value} as the left child.`,
            action: "insert",
            highlights: [{ indices: [0], color: "active" }],
            data: snap(newNode.id, "insert", insertHighlights, { [`${current.id}-${newNode.id}`]: "active" }),
            variables: { insertValue: value, parent: current.value, side: "left" },
          });

          break;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          // Insert here
          current.right = newNode;

          const insertHighlights: Record<string, "active" | "completed"> = {};
          for (const p of path) {
            insertHighlights[p.id] = "completed";
          }
          insertHighlights[newNode.id] = "active";

          steps.push({
            id: stepId++,
            description: `Right child of ${current.value} is empty. Insert ${value} as the right child.`,
            action: "insert",
            highlights: [{ indices: [0], color: "active" }],
            data: snap(newNode.id, "insert", insertHighlights, { [`${current.id}-${newNode.id}`]: "active" }),
            variables: { insertValue: value, parent: current.value, side: "right" },
          });

          break;
        }
        current = current.right;
      }
    }

    // Show tree after insertion
    steps.push({
      id: stepId++,
      description: `Node ${value} inserted successfully. BST property maintained: all left descendants < parent < all right descendants.`,
      action: "complete",
      highlights: [],
      data: snap(null, "insert", { [newNode.id]: "completed" }),
      variables: { insertValue: value },
    });
  }

  // Show final tree
  const allCompleted: Record<string, "completed"> = {};
  function markAll(node: BSTNode | null) {
    if (!node) return;
    allCompleted[node.id] = "completed";
    markAll(node.left);
    markAll(node.right);
  }
  markAll(root);

  steps.push({
    id: stepId++,
    description: "All 7 values inserted! The BST is complete: [50, 30, 70, 20, 40, 60, 80]. In-order traversal would yield sorted order: [20, 30, 40, 50, 60, 70, 80].",
    action: "complete",
    highlights: [],
    data: snap(null, "complete", allCompleted),
  });

  // ===== Search for value 40 =====

  steps.push({
    id: stepId++,
    description: "SEARCH for value 40: Start at the root and use BST property to navigate.",
    action: "highlight",
    highlights: [],
    data: snap(null, "search"),
    variables: { searchTarget: 40 },
  });

  // Search traversal: 50 -> 30 -> 40 (found)
  const searchPath: { node: BSTNode; desc: string }[] = [];

  // At root (50)
  searchPath.push({
    node: root!,
    desc: `Compare 40 with root (50): 40 < 50, go LEFT.`,
  });

  // At node 30
  searchPath.push({
    node: root!.left!,
    desc: `Compare 40 with node 30: 40 > 30, go RIGHT.`,
  });

  // At node 40 -- found!
  searchPath.push({
    node: root!.left!.right!,
    desc: `Compare 40 with node 40: 40 == 40. FOUND!`,
  });

  const visited: string[] = [];
  for (let i = 0; i < searchPath.length; i++) {
    const { node, desc } = searchPath[i];
    visited.push(node.id);
    const isFound = i === searchPath.length - 1;

    const searchHighlights: Record<string, "active" | "comparing" | "completed"> = {};
    for (const vid of visited.slice(0, -1)) {
      searchHighlights[vid] = "completed";
    }
    searchHighlights[node.id] = isFound ? "active" : "comparing";

    steps.push({
      id: stepId++,
      description: desc,
      action: isFound ? "complete" : "compare",
      highlights: [{ indices: [i], color: isFound ? "active" : "comparing" }],
      data: snap(node.id, "search", searchHighlights),
      variables: { searchTarget: 40, currentValue: node.value, found: isFound },
    });
  }

  // Final search result
  steps.push({
    id: stepId++,
    description: "Search complete! Found value 40 in 3 comparisons (O(log n) where n=7). BST search is efficient because we eliminate half the tree at each step.",
    action: "complete",
    highlights: [],
    data: snap(root!.left!.right!.id, "search", { [root!.left!.right!.id]: "completed" }),
    variables: { searchTarget: 40, found: true, comparisons: 3 },
  });

  return steps;
}
