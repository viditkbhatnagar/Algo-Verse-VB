import type { VisualizationStep, TreeStepData, TreeNodeData, TreeEdgeData, HighlightInfo } from "@/lib/visualization/types";

interface PQItem {
  value: string;
  priority: number;
}

/**
 * Build the tree representation from the priority queue heap array.
 * Each node displays "priority: value" as its label.
 */
function buildTreeFromHeap(
  heap: PQItem[],
  currentIdx: number | null,
  highlightIndices: Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">
): { nodes: TreeNodeData[]; edges: TreeEdgeData[] } {
  const nodes: TreeNodeData[] = [];
  const edges: TreeEdgeData[] = [];

  for (let i = 0; i < heap.length; i++) {
    const parentIdx = i > 0 ? Math.floor((i - 1) / 2) : null;
    const leftChild = 2 * i + 1 < heap.length ? String(2 * i + 1) : null;
    const rightChild = 2 * i + 2 < heap.length ? String(2 * i + 2) : null;
    const children: string[] = [];
    if (leftChild) children.push(leftChild);
    if (rightChild) children.push(rightChild);

    nodes.push({
      id: String(i),
      value: heap[i].priority,
      children,
      parent: parentIdx !== null ? String(parentIdx) : null,
      highlight: highlightIndices.get(i),
    });

    if (parentIdx !== null) {
      const edgeHighlight = highlightIndices.has(i) && highlightIndices.has(parentIdx)
        ? highlightIndices.get(i)
        : undefined;
      edges.push({
        source: String(parentIdx),
        target: String(i),
        highlight: edgeHighlight,
      });
    }
  }

  return { nodes, edges };
}

function buildArrayHighlights(
  highlightIndices: Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">
): HighlightInfo[] {
  const groups = new Map<string, number[]>();
  Array.from(highlightIndices.entries()).forEach(([idx, color]) => {
    const existing = groups.get(color) ?? [];
    existing.push(idx);
    groups.set(color, existing);
  });
  const result: HighlightInfo[] = [];
  Array.from(groups.entries()).forEach(([color, indices]) => {
    result.push({ indices, color: color as HighlightInfo["color"] });
  });
  return result;
}

function heapPriorities(heap: PQItem[]): number[] {
  return heap.map((item) => item.priority);
}

export function generatePriorityQueueSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const heap: PQItem[] = [];

  // Items to enqueue: (value, priority) — lower priority number = higher priority
  const enqueueItems: PQItem[] = [
    { value: "Send email", priority: 5 },
    { value: "Fix critical bug", priority: 1 },
    { value: "Code review", priority: 3 },
    { value: "Deploy hotfix", priority: 2 },
    { value: "Update docs", priority: 7 },
    { value: "Write tests", priority: 4 },
    { value: "Security patch", priority: 1 },
  ];

  // --- Initial state ---
  steps.push({
    id: stepId++,
    description: "Starting Priority Queue visualization. Lower priority number = higher priority (served first). We will enqueue tasks then dequeue the highest-priority ones.",
    action: "highlight",
    highlights: [],
    data: {
      nodes: [],
      edges: [],
      rootId: null,
      currentNodeId: null,
      operation: "init",
      auxiliaryArray: [],
      auxiliaryHighlights: [],
    } satisfies TreeStepData,
  });

  // --- ENQUEUE PHASE ---
  for (const item of enqueueItems) {
    heap.push(item);
    const insertIdx = heap.length - 1;
    const hl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
    hl.set(insertIdx, "active");
    const { nodes, edges } = buildTreeFromHeap(heap, insertIdx, hl);

    steps.push({
      id: stepId++,
      description: `Enqueue "${item.value}" with priority ${item.priority}: Place at index ${insertIdx}`,
      action: "enqueue",
      highlights: [{ indices: [insertIdx], color: "active" }],
      data: {
        nodes,
        edges,
        rootId: "0",
        currentNodeId: String(insertIdx),
        operation: `enqueue: "${item.value}" (p=${item.priority})`,
        auxiliaryArray: heapPriorities(heap),
        auxiliaryHighlights: buildArrayHighlights(hl),
      } satisfies TreeStepData,
    });

    // Bubble up by priority
    let current = insertIdx;
    while (current > 0) {
      const parentIdx = Math.floor((current - 1) / 2);

      const cmpHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
      cmpHl.set(current, "active");
      cmpHl.set(parentIdx, "comparing");
      const cmpTree = buildTreeFromHeap(heap, current, cmpHl);

      steps.push({
        id: stepId++,
        description: `Bubble up: Compare priority ${heap[current].priority} ("${heap[current].value}") with parent priority ${heap[parentIdx].priority} ("${heap[parentIdx].value}")`,
        action: "compare",
        highlights: [
          { indices: [current], color: "active" },
          { indices: [parentIdx], color: "comparing" },
        ],
        data: {
          nodes: cmpTree.nodes,
          edges: cmpTree.edges,
          rootId: "0",
          currentNodeId: String(current),
          operation: `p=${heap[current].priority} < p=${heap[parentIdx].priority}?`,
          auxiliaryArray: heapPriorities(heap),
          auxiliaryHighlights: buildArrayHighlights(cmpHl),
        } satisfies TreeStepData,
      });

      if (heap[current].priority < heap[parentIdx].priority) {
        const swapHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
        swapHl.set(current, "swapping");
        swapHl.set(parentIdx, "swapping");

        [heap[current], heap[parentIdx]] = [heap[parentIdx], heap[current]];

        const swapTree = buildTreeFromHeap(heap, parentIdx, swapHl);
        steps.push({
          id: stepId++,
          description: `Swap: "${heap[parentIdx].value}" (p=${heap[parentIdx].priority}) moves up, "${heap[current].value}" (p=${heap[current].priority}) moves down`,
          action: "swap",
          highlights: [{ indices: [current, parentIdx], color: "swapping" }],
          data: {
            nodes: swapTree.nodes,
            edges: swapTree.edges,
            rootId: "0",
            currentNodeId: String(parentIdx),
            operation: "swap",
            auxiliaryArray: heapPriorities(heap),
            auxiliaryHighlights: buildArrayHighlights(swapHl),
          } satisfies TreeStepData,
        });

        current = parentIdx;
      } else {
        steps.push({
          id: stepId++,
          description: `Priority ${heap[current].priority} >= ${heap[parentIdx].priority} — heap property satisfied`,
          action: "complete",
          highlights: [{ indices: [current], color: "completed" }],
          data: {
            nodes: buildTreeFromHeap(heap, null, new Map()).nodes,
            edges: buildTreeFromHeap(heap, null, new Map()).edges,
            rootId: "0",
            currentNodeId: null,
            operation: "heap property ok",
            auxiliaryArray: heapPriorities(heap),
            auxiliaryHighlights: [],
          } satisfies TreeStepData,
        });
        break;
      }
    }

    if (current === 0) {
      const doneHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
      doneHl.set(0, "completed");
      const doneTree = buildTreeFromHeap(heap, null, doneHl);
      steps.push({
        id: stepId++,
        description: `"${heap[0].value}" (p=${heap[0].priority}) is now at root — enqueue complete`,
        action: "complete",
        highlights: [{ indices: [0], color: "completed" }],
        data: {
          nodes: doneTree.nodes,
          edges: doneTree.edges,
          rootId: "0",
          currentNodeId: "0",
          operation: "enqueue complete",
          auxiliaryArray: heapPriorities(heap),
          auxiliaryHighlights: buildArrayHighlights(doneHl),
        } satisfies TreeStepData,
      });
    }
  }

  // Snapshot after all enqueues
  const allEnqueuedTree = buildTreeFromHeap(heap, null, new Map());
  steps.push({
    id: stepId++,
    description: `All ${enqueueItems.length} tasks enqueued. Highest priority at root: "${heap[0].value}" (p=${heap[0].priority}). Priorities: [${heapPriorities(heap).join(", ")}]`,
    action: "complete",
    highlights: [],
    data: {
      nodes: allEnqueuedTree.nodes,
      edges: allEnqueuedTree.edges,
      rootId: "0",
      currentNodeId: "0",
      operation: "all enqueued",
      auxiliaryArray: heapPriorities(heap),
      auxiliaryHighlights: [{ indices: [0], color: "completed" }],
    } satisfies TreeStepData,
  });

  // --- DEQUEUE PHASE (3 times) ---
  for (let dq = 1; dq <= 3; dq++) {
    const topItem = heap[0];
    const lastIdx = heap.length - 1;

    const extractHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
    extractHl.set(0, "active");
    if (lastIdx > 0) extractHl.set(lastIdx, "comparing");
    const extractTree = buildTreeFromHeap(heap, 0, extractHl);

    steps.push({
      id: stepId++,
      description: `Dequeue #${dq}: Remove "${topItem.value}" (priority ${topItem.priority}) — the highest-priority task`,
      action: "dequeue",
      highlights: [
        { indices: [0], color: "active" },
        ...(lastIdx > 0 ? [{ indices: [lastIdx], color: "comparing" as const }] : []),
      ],
      data: {
        nodes: extractTree.nodes,
        edges: extractTree.edges,
        rootId: "0",
        currentNodeId: "0",
        operation: `dequeue: "${topItem.value}" (p=${topItem.priority})`,
        auxiliaryArray: heapPriorities(heap),
        auxiliaryHighlights: buildArrayHighlights(extractHl),
      } satisfies TreeStepData,
    });

    // Swap root with last
    [heap[0], heap[lastIdx]] = [heap[lastIdx], heap[0]];
    heap.pop();

    if (heap.length === 0) {
      steps.push({
        id: stepId++,
        description: `Dequeued "${topItem.value}". Priority queue is now empty.`,
        action: "complete",
        highlights: [],
        data: {
          nodes: [],
          edges: [],
          rootId: null,
          currentNodeId: null,
          operation: "queue empty",
          auxiliaryArray: [],
          auxiliaryHighlights: [],
        } satisfies TreeStepData,
      });
      break;
    }

    const afterSwapHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
    afterSwapHl.set(0, "swapping");
    const afterSwapTree = buildTreeFromHeap(heap, 0, afterSwapHl);

    steps.push({
      id: stepId++,
      description: `Moved "${heap[0].value}" (p=${heap[0].priority}) to root. Bubble down to restore heap order`,
      action: "swap",
      highlights: [{ indices: [0], color: "swapping" }],
      data: {
        nodes: afterSwapTree.nodes,
        edges: afterSwapTree.edges,
        rootId: "0",
        currentNodeId: "0",
        operation: "bubble down start",
        auxiliaryArray: heapPriorities(heap),
        auxiliaryHighlights: buildArrayHighlights(afterSwapHl),
      } satisfies TreeStepData,
    });

    // Bubble down
    let current = 0;
    while (true) {
      let smallest = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      if (left < heap.length) {
        const cmpHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
        cmpHl.set(current, "active");
        cmpHl.set(left, "comparing");
        if (right < heap.length) cmpHl.set(right, "comparing");
        const cmpTree = buildTreeFromHeap(heap, current, cmpHl);

        steps.push({
          id: stepId++,
          description: `Bubble down: Compare p=${heap[current].priority} with children${left < heap.length ? ` p=${heap[left].priority}` : ""}${right < heap.length ? ` and p=${heap[right].priority}` : ""}`,
          action: "compare",
          highlights: [
            { indices: [current], color: "active" },
            { indices: [left, ...(right < heap.length ? [right] : [])], color: "comparing" },
          ],
          data: {
            nodes: cmpTree.nodes,
            edges: cmpTree.edges,
            rootId: "0",
            currentNodeId: String(current),
            operation: "compare priorities",
            auxiliaryArray: heapPriorities(heap),
            auxiliaryHighlights: buildArrayHighlights(cmpHl),
          } satisfies TreeStepData,
        });

        if (heap[left].priority < heap[smallest].priority) smallest = left;
      }
      if (right < heap.length && heap[right].priority < heap[smallest].priority) {
        smallest = right;
      }

      if (smallest !== current) {
        const swapHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
        swapHl.set(current, "swapping");
        swapHl.set(smallest, "swapping");

        [heap[current], heap[smallest]] = [heap[smallest], heap[current]];

        const swapTree = buildTreeFromHeap(heap, smallest, swapHl);
        steps.push({
          id: stepId++,
          description: `Swap: "${heap[current].value}" (p=${heap[current].priority}) moves up, "${heap[smallest].value}" (p=${heap[smallest].priority}) moves down`,
          action: "swap",
          highlights: [{ indices: [current, smallest], color: "swapping" }],
          data: {
            nodes: swapTree.nodes,
            edges: swapTree.edges,
            rootId: "0",
            currentNodeId: String(smallest),
            operation: "swap down",
            auxiliaryArray: heapPriorities(heap),
            auxiliaryHighlights: buildArrayHighlights(swapHl),
          } satisfies TreeStepData,
        });

        current = smallest;
      } else {
        steps.push({
          id: stepId++,
          description: `Priority ${heap[current].priority} is smaller than children — heap property restored. Dequeued "${topItem.value}"`,
          action: "complete",
          highlights: [{ indices: [current], color: "completed" }],
          data: {
            nodes: buildTreeFromHeap(heap, null, new Map()).nodes,
            edges: buildTreeFromHeap(heap, null, new Map()).edges,
            rootId: "0",
            currentNodeId: null,
            operation: `dequeued "${topItem.value}"`,
            auxiliaryArray: heapPriorities(heap),
            auxiliaryHighlights: [{ indices: [0], color: "completed" }],
          } satisfies TreeStepData,
        });
        break;
      }
    }
  }

  // Final state
  if (heap.length > 0) {
    const finalTree = buildTreeFromHeap(heap, null, new Map());
    const allIndices = heap.map((_, i) => i);
    steps.push({
      id: stepId++,
      description: `Priority Queue visualization complete! Remaining ${heap.length} tasks. Next to serve: "${heap[0].value}" (p=${heap[0].priority})`,
      action: "complete",
      highlights: [{ indices: allIndices, color: "completed" }],
      data: {
        nodes: finalTree.nodes,
        edges: finalTree.edges,
        rootId: "0",
        currentNodeId: null,
        operation: "done",
        auxiliaryArray: heapPriorities(heap),
        auxiliaryHighlights: [{ indices: allIndices, color: "completed" }],
      } satisfies TreeStepData,
    });
  }

  return steps;
}
