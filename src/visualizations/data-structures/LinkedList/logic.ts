import type { VisualizationStep, LinkedListStepData, LinkedListNodeData } from "@/lib/visualization/types";

/**
 * Generates visualization steps for Singly Linked List operations:
 * 1. Build list [10, 20, 30] by inserting at tail
 * 2. Insert 15 at index 1 (between 10 and 20)
 * 3. Search for value 30
 * 4. Delete node with value 20
 */
export function generateLinkedListSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // --- Helper: snapshot current list state ---
  function snapshot(
    nodes: LinkedListNodeData[],
    headId: string | null,
    tailId: string | null,
    currentId: string | null,
    pointers: Record<string, string>,
  ): LinkedListStepData {
    return {
      nodes: nodes.map((n) => ({ ...n })),
      headId,
      tailId,
      currentId,
      pointers: { ...pointers },
    } satisfies LinkedListStepData;
  }

  // Mutable state
  let nodes: LinkedListNodeData[] = [];
  let headId: string | null = null;
  let tailId: string | null = null;

  // ===== PHASE 1: Build list [10, 20, 30] =====

  steps.push({
    id: stepId++,
    description: "Starting with an empty singly linked list. We will insert 10, 20, and 30.",
    action: "highlight",
    highlights: [],
    data: snapshot([], null, null, null, {}),
  });

  // Insert 10
  const node10: LinkedListNodeData = { id: "n10", value: 10, next: null, highlight: "active" };
  nodes = [node10];
  headId = "n10";
  tailId = "n10";

  steps.push({
    id: stepId++,
    description: "Insert 10: Create a new node with value 10. Since the list is empty, it becomes both head and tail.",
    action: "insert",
    highlights: [{ indices: [0], color: "active" }],
    data: snapshot(nodes, headId, tailId, "n10", { head: "n10", tail: "n10" }),
    variables: { operation: "insertAtTail", value: 10 },
  });

  node10.highlight = undefined;

  // Insert 20
  const node20: LinkedListNodeData = { id: "n20", value: 20, next: null, highlight: "active" };
  node10.next = "n20";
  nodes = [node10, node20];
  tailId = "n20";

  steps.push({
    id: stepId++,
    description: "Insert 20: Create node with value 20. Set tail.next = newNode, update tail pointer.",
    action: "insert",
    highlights: [{ indices: [1], color: "active" }],
    data: snapshot(nodes, headId, tailId, "n20", { head: "n10", tail: "n20" }),
    variables: { operation: "insertAtTail", value: 20 },
  });

  node20.highlight = undefined;

  // Insert 30
  const node30: LinkedListNodeData = { id: "n30", value: 30, next: null, highlight: "active" };
  node20.next = "n30";
  nodes = [node10, node20, node30];
  tailId = "n30";

  steps.push({
    id: stepId++,
    description: "Insert 30: Create node with value 30. Set tail.next = newNode, update tail to new node.",
    action: "insert",
    highlights: [{ indices: [2], color: "active" }],
    data: snapshot(nodes, headId, tailId, "n30", { head: "n10", tail: "n30" }),
    variables: { operation: "insertAtTail", value: 30 },
  });

  node30.highlight = undefined;

  // Show completed list
  node10.highlight = "completed";
  node20.highlight = "completed";
  node30.highlight = "completed";

  steps.push({
    id: stepId++,
    description: "List built: 10 -> 20 -> 30 -> null. Head points to 10, tail points to 30.",
    action: "complete",
    highlights: [{ indices: [0, 1, 2], color: "completed" }],
    data: snapshot(nodes, headId, tailId, null, { head: "n10", tail: "n30" }),
  });

  node10.highlight = undefined;
  node20.highlight = undefined;
  node30.highlight = undefined;

  // ===== PHASE 2: Insert 15 at index 1 =====

  steps.push({
    id: stepId++,
    description: "Insert 15 at index 1: We need to traverse to the node at index 0 (the predecessor).",
    action: "highlight",
    highlights: [],
    data: snapshot(nodes, headId, tailId, null, { head: "n10", tail: "n30" }),
    variables: { operation: "insertAtIndex", value: 15, targetIndex: 1 },
  });

  // Traverse to index 0
  node10.highlight = "comparing";

  steps.push({
    id: stepId++,
    description: "Start at head (index 0). Node 10 is at index 0 -- this is where we need to insert after.",
    action: "visit",
    highlights: [{ indices: [0], color: "comparing" }],
    data: snapshot(nodes, headId, tailId, "n10", { head: "n10", tail: "n30" }),
    variables: { currentIndex: 0, targetIndex: 1 },
  });

  // Create new node and rewire
  const node15: LinkedListNodeData = { id: "n15", value: 15, next: "n20", highlight: "active" };
  node10.next = "n15";
  node10.highlight = undefined;
  nodes = [node10, node15, node20, node30];

  steps.push({
    id: stepId++,
    description: "Create node 15. Set newNode.next = node10.next (which is 20), then set node10.next = newNode.",
    action: "insert",
    highlights: [{ indices: [1], color: "active" }],
    data: snapshot(nodes, headId, tailId, "n15", { head: "n10", tail: "n30" }),
    variables: { operation: "insertAtIndex", value: 15, targetIndex: 1 },
  });

  node15.highlight = "completed";
  node10.highlight = "completed";
  node20.highlight = "completed";
  node30.highlight = "completed";

  steps.push({
    id: stepId++,
    description: "Insert complete! List is now: 10 -> 15 -> 20 -> 30 -> null.",
    action: "complete",
    highlights: [{ indices: [0, 1, 2, 3], color: "completed" }],
    data: snapshot(nodes, headId, tailId, null, { head: "n10", tail: "n30" }),
  });

  node10.highlight = undefined;
  node15.highlight = undefined;
  node20.highlight = undefined;
  node30.highlight = undefined;

  // ===== PHASE 3: Search for value 30 =====

  steps.push({
    id: stepId++,
    description: "Search for value 30: Start at the head and traverse until we find it or reach null.",
    action: "highlight",
    highlights: [],
    data: snapshot(nodes, headId, tailId, null, { head: "n10", tail: "n30" }),
    variables: { operation: "search", target: 30 },
  });

  // Check node 10
  node10.highlight = "comparing";

  steps.push({
    id: stepId++,
    description: "Visit node at index 0: value 10 != 30. Move to the next node.",
    action: "compare",
    highlights: [{ indices: [0], color: "comparing" }],
    data: snapshot(nodes, headId, tailId, "n10", { head: "n10", tail: "n30" }),
    variables: { currentValue: 10, target: 30, index: 0 },
  });

  node10.highlight = undefined;

  // Check node 15
  node15.highlight = "comparing";

  steps.push({
    id: stepId++,
    description: "Visit node at index 1: value 15 != 30. Move to the next node.",
    action: "compare",
    highlights: [{ indices: [1], color: "comparing" }],
    data: snapshot(nodes, headId, tailId, "n15", { head: "n10", tail: "n30" }),
    variables: { currentValue: 15, target: 30, index: 1 },
  });

  node15.highlight = undefined;

  // Check node 20
  node20.highlight = "comparing";

  steps.push({
    id: stepId++,
    description: "Visit node at index 2: value 20 != 30. Move to the next node.",
    action: "compare",
    highlights: [{ indices: [2], color: "comparing" }],
    data: snapshot(nodes, headId, tailId, "n20", { head: "n10", tail: "n30" }),
    variables: { currentValue: 20, target: 30, index: 2 },
  });

  node20.highlight = undefined;

  // Check node 30 -- found!
  node30.highlight = "completed";

  steps.push({
    id: stepId++,
    description: "Visit node at index 3: value 30 == 30. Found! Value 30 exists at index 3.",
    action: "complete",
    highlights: [{ indices: [3], color: "completed" }],
    data: snapshot(nodes, headId, tailId, "n30", { head: "n10", tail: "n30" }),
    variables: { currentValue: 30, target: 30, index: 3, found: true },
  });

  node30.highlight = undefined;

  // ===== PHASE 4: Delete node with value 20 =====

  steps.push({
    id: stepId++,
    description: "Delete value 20: Traverse to find the predecessor of the node containing 20.",
    action: "highlight",
    highlights: [],
    data: snapshot(nodes, headId, tailId, null, { head: "n10", tail: "n30" }),
    variables: { operation: "delete", target: 20 },
  });

  // Check head -- 10 != 20
  node10.highlight = "comparing";

  steps.push({
    id: stepId++,
    description: "Check head node: value 10 != 20. Check if head.next (15) has value 20.",
    action: "compare",
    highlights: [{ indices: [0], color: "comparing" }],
    data: snapshot(nodes, headId, tailId, "n10", { head: "n10", tail: "n30" }),
    variables: { currentValue: 10, target: 20 },
  });

  node10.highlight = undefined;
  node15.highlight = "comparing";

  steps.push({
    id: stepId++,
    description: "At node 15: check if next node (20) has the target value. 20 == 20? Yes!",
    action: "compare",
    highlights: [{ indices: [1], color: "comparing" }],
    data: snapshot(nodes, headId, tailId, "n15", { head: "n10", tail: "n30" }),
    variables: { currentValue: 15, nextValue: 20, target: 20 },
  });

  // Highlight the node being removed
  node15.highlight = undefined;
  node20.highlight = "swapping";

  steps.push({
    id: stepId++,
    description: "Found node 20! Set node15.next = node20.next (which is 30), bypassing node 20.",
    action: "remove",
    highlights: [{ indices: [2], color: "swapping" }],
    data: snapshot(nodes, headId, tailId, "n20", { head: "n10", tail: "n30" }),
    variables: { removedValue: 20 },
  });

  // Remove node 20 from list
  node15.next = "n30";
  nodes = [node10, node15, node30];
  node10.highlight = "completed";
  node15.highlight = "completed";
  node30.highlight = "completed";

  steps.push({
    id: stepId++,
    description: "Node 20 removed! Final list: 10 -> 15 -> 30 -> null.",
    action: "complete",
    highlights: [{ indices: [0, 1, 2], color: "completed" }],
    data: snapshot(nodes, headId, tailId, null, { head: "n10", tail: "n30" }),
  });

  return steps;
}
