import type {
  VisualizationStep,
  LinkedListNodeData,
  LinkedListStepData,
} from "@/lib/visualization/types";

let nodeCounter = 0;

function makeNode(
  value: number,
  next: string | null = null,
  prev: string | null = null
): LinkedListNodeData {
  return {
    id: `node-${nodeCounter++}`,
    value,
    next,
    prev,
  };
}

function cloneNodes(nodes: LinkedListNodeData[]): LinkedListNodeData[] {
  return nodes.map((n) => ({ ...n }));
}

export function generateDoublyLinkedListSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  nodeCounter = 0;

  let nodes: LinkedListNodeData[] = [];
  let headId: string | null = null;
  let tailId: string | null = null;

  // Helper to build pointer map
  function pointers(): Record<string, string> {
    const p: Record<string, string> = {};
    if (headId) p["head"] = headId;
    if (tailId) p["tail"] = tailId;
    return p;
  }

  // Initial state
  steps.push({
    id: stepId++,
    description: "Starting with an empty doubly linked list. Each node will have both next and prev pointers.",
    action: "highlight",
    highlights: [],
    data: {
      nodes: [],
      headId: null,
      tailId: null,
      currentId: null,
      pointers: {},
    } satisfies LinkedListStepData,
    variables: { size: 0 },
  });

  // Insert 20 at head
  const n20 = makeNode(20);
  nodes = [n20];
  headId = n20.id;
  tailId = n20.id;
  steps.push({
    id: stepId++,
    description: "insertAtHead(20) — First node created. It becomes both head and tail. prev and next are null.",
    action: "insert",
    highlights: [{ indices: [0], color: "active" }],
    data: {
      nodes: cloneNodes(nodes),
      headId,
      tailId,
      currentId: n20.id,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, head: 20, tail: 20 },
  });

  // Insert 10 at head
  const n10 = makeNode(10, n20.id);
  n20.prev = n10.id;
  nodes = [n10, n20];
  headId = n10.id;
  steps.push({
    id: stepId++,
    description: "insertAtHead(10) — New node 10 becomes the head. 10.next → 20, 20.prev → 10. Bidirectional link established.",
    action: "insert",
    highlights: [{ indices: [0], color: "active" }],
    data: {
      nodes: cloneNodes(nodes),
      headId,
      tailId,
      currentId: n10.id,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, head: 10, tail: 20 },
  });

  // Insert 30 at tail
  const n30 = makeNode(30, null, n20.id);
  n20.next = n30.id;
  nodes = [n10, n20, n30];
  tailId = n30.id;
  steps.push({
    id: stepId++,
    description: "insertAtTail(30) — Node 30 appended at the tail. 20.next → 30, 30.prev → 20. List: 10 <-> 20 <-> 30.",
    action: "insert",
    highlights: [{ indices: [2], color: "active" }],
    data: {
      nodes: cloneNodes(nodes),
      headId,
      tailId,
      currentId: n30.id,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, head: 10, tail: 30 },
  });

  // Insert 40 at tail
  const n40 = makeNode(40, null, n30.id);
  n30.next = n40.id;
  nodes = [n10, n20, n30, n40];
  tailId = n40.id;
  steps.push({
    id: stepId++,
    description: "insertAtTail(40) — Node 40 appended. 30.next → 40, 40.prev → 30. List: 10 <-> 20 <-> 30 <-> 40.",
    action: "insert",
    highlights: [{ indices: [3], color: "active" }],
    data: {
      nodes: cloneNodes(nodes),
      headId,
      tailId,
      currentId: n40.id,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, head: 10, tail: 40 },
  });

  // Insert 25 in the middle (after 20, before 30)
  const n25 = makeNode(25, n30.id, n20.id);
  n20.next = n25.id;
  n30.prev = n25.id;
  nodes = [n10, n20, n25, n30, n40];
  steps.push({
    id: stepId++,
    description: "insertAfter(20, 25) — Node 25 inserted between 20 and 30. Update: 20.next → 25, 25.prev → 20, 25.next → 30, 30.prev → 25. Four pointer updates total.",
    action: "insert",
    highlights: [{ indices: [2], color: "active" }],
    data: {
      nodes: cloneNodes(nodes),
      headId,
      tailId,
      currentId: n25.id,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, head: 10, tail: 40 },
  });

  // Search for 30
  // Step through: check 10, check 20, check 25, found 30
  steps.push({
    id: stepId++,
    description: "search(30) — Start at head (10). Traverse forward using next pointers.",
    action: "visit",
    highlights: [{ indices: [0], color: "comparing" }],
    data: {
      nodes: cloneNodes(nodes).map((n) => ({
        ...n,
        highlight: n.id === n10.id ? "comparing" as const : undefined,
      })),
      headId,
      tailId,
      currentId: n10.id,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, searching: 30, checking: 10 },
  });

  steps.push({
    id: stepId++,
    description: "search(30) — 10 != 30, move to next node (20).",
    action: "visit",
    highlights: [{ indices: [1], color: "comparing" }],
    data: {
      nodes: cloneNodes(nodes).map((n) => ({
        ...n,
        highlight: n.id === n20.id ? "comparing" as const : undefined,
      })),
      headId,
      tailId,
      currentId: n20.id,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, searching: 30, checking: 20 },
  });

  steps.push({
    id: stepId++,
    description: "search(30) — 20 != 30, move to next node (25).",
    action: "visit",
    highlights: [{ indices: [2], color: "comparing" }],
    data: {
      nodes: cloneNodes(nodes).map((n) => ({
        ...n,
        highlight: n.id === n25.id ? "comparing" as const : undefined,
      })),
      headId,
      tailId,
      currentId: n25.id,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, searching: 30, checking: 25 },
  });

  steps.push({
    id: stepId++,
    description: "search(30) — 25 != 30, move to next node (30). Found! Search required 4 comparisons — O(n) traversal.",
    action: "visit",
    highlights: [{ indices: [3], color: "completed" }],
    data: {
      nodes: cloneNodes(nodes).map((n) => ({
        ...n,
        highlight: n.id === n30.id ? "completed" as const : undefined,
      })),
      headId,
      tailId,
      currentId: n30.id,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, searching: 30, found: true },
  });

  // Delete node 25 (middle deletion)
  n20.next = n30.id;
  n30.prev = n20.id;
  nodes = [n10, n20, n30, n40];
  steps.push({
    id: stepId++,
    description: "delete(25) — Remove node 25 from the middle. Update: 20.next → 30, 30.prev → 20. With doubly linked list, this is O(1) given a reference to the node.",
    action: "remove",
    highlights: [],
    data: {
      nodes: cloneNodes(nodes),
      headId,
      tailId,
      currentId: null,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, deleted: 25, head: 10, tail: 40 },
  });

  // Delete head (10)
  headId = n20.id;
  n20.prev = null;
  nodes = [n20, n30, n40];
  steps.push({
    id: stepId++,
    description: "deleteHead() — Remove node 10. Update: head → 20, 20.prev → null. Head deletion is O(1).",
    action: "remove",
    highlights: [],
    data: {
      nodes: cloneNodes(nodes),
      headId,
      tailId,
      currentId: headId,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, deleted: 10, head: 20, tail: 40 },
  });

  // Delete tail (40)
  tailId = n30.id;
  n30.next = null;
  nodes = [n20, n30];
  steps.push({
    id: stepId++,
    description: "deleteTail() — Remove node 40. Update: tail → 30, 30.next → null. Tail deletion is also O(1) thanks to prev pointer.",
    action: "remove",
    highlights: [],
    data: {
      nodes: cloneNodes(nodes),
      headId,
      tailId,
      currentId: tailId,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length, deleted: 40, head: 20, tail: 30 },
  });

  // Final state
  steps.push({
    id: stepId++,
    description: `Doubly linked list operations complete. Final list: 20 <-> 30. Key advantages: O(1) deletion with node reference, bidirectional traversal, and O(1) head/tail operations.`,
    action: "complete",
    highlights: [{ indices: [0, 1], color: "completed" }],
    data: {
      nodes: cloneNodes(nodes).map((n) => ({
        ...n,
        highlight: "completed" as const,
      })),
      headId,
      tailId,
      currentId: null,
      pointers: pointers(),
    } satisfies LinkedListStepData,
    variables: { size: nodes.length },
  });

  return steps;
}
