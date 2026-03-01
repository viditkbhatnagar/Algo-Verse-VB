import type { VisualizationStep, TreeStepData, TreeNodeData, TreeEdgeData, HighlightInfo } from "@/lib/visualization/types";

/**
 * Build the tree nodes and edges from the heap array.
 * Node ids are string indices: "0", "1", "2", ...
 */
function buildTreeFromArray(
  heap: number[],
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
      value: heap[i],
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

export function generateMinHeapSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const heap: number[] = [];
  const insertValues = [40, 20, 30, 10, 15, 25, 5];

  // --- Initial state ---
  steps.push({
    id: stepId++,
    description: "Starting Min-Heap visualization. We will insert values one by one and then extract the minimum twice.",
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

  // --- INSERT PHASE ---
  for (const val of insertValues) {
    // Step: add value at end
    heap.push(val);
    const insertIdx = heap.length - 1;
    const hl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
    hl.set(insertIdx, "active");
    const { nodes, edges } = buildTreeFromArray(heap, insertIdx, hl);

    steps.push({
      id: stepId++,
      description: `Insert ${val}: Place at index ${insertIdx} (end of array)`,
      action: "insert",
      highlights: [{ indices: [insertIdx], color: "active" }],
      data: {
        nodes,
        edges,
        rootId: "0",
        currentNodeId: String(insertIdx),
        operation: `insert ${val}`,
        auxiliaryArray: [...heap],
        auxiliaryHighlights: buildArrayHighlights(hl),
      } satisfies TreeStepData,
    });

    // Bubble up
    let current = insertIdx;
    while (current > 0) {
      const parentIdx = Math.floor((current - 1) / 2);

      // Compare with parent
      const cmpHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
      cmpHl.set(current, "active");
      cmpHl.set(parentIdx, "comparing");
      const cmpTree = buildTreeFromArray(heap, current, cmpHl);

      steps.push({
        id: stepId++,
        description: `Bubble up: Compare ${heap[current]} (index ${current}) with parent ${heap[parentIdx]} (index ${parentIdx})`,
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
          operation: `compare ${heap[current]} < ${heap[parentIdx]}?`,
          auxiliaryArray: [...heap],
          auxiliaryHighlights: buildArrayHighlights(cmpHl),
        } satisfies TreeStepData,
      });

      if (heap[current] < heap[parentIdx]) {
        // Swap
        const swapHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
        swapHl.set(current, "swapping");
        swapHl.set(parentIdx, "swapping");

        [heap[current], heap[parentIdx]] = [heap[parentIdx], heap[current]];

        const swapTree = buildTreeFromArray(heap, parentIdx, swapHl);
        steps.push({
          id: stepId++,
          description: `Swap ${heap[parentIdx]} and ${heap[current]}: ${heap[parentIdx]} moves up to index ${parentIdx}`,
          action: "swap",
          highlights: [{ indices: [current, parentIdx], color: "swapping" }],
          data: {
            nodes: swapTree.nodes,
            edges: swapTree.edges,
            rootId: "0",
            currentNodeId: String(parentIdx),
            operation: "swap",
            auxiliaryArray: [...heap],
            auxiliaryHighlights: buildArrayHighlights(swapHl),
          } satisfies TreeStepData,
        });

        current = parentIdx;
      } else {
        // No swap needed
        steps.push({
          id: stepId++,
          description: `${heap[current]} >= ${heap[parentIdx]} — heap property satisfied, stop bubbling up`,
          action: "complete",
          highlights: [{ indices: [current], color: "completed" }],
          data: {
            nodes: buildTreeFromArray(heap, null, new Map()).nodes,
            edges: buildTreeFromArray(heap, null, new Map()).edges,
            rootId: "0",
            currentNodeId: null,
            operation: "heap property ok",
            auxiliaryArray: [...heap],
            auxiliaryHighlights: [],
          } satisfies TreeStepData,
        });
        break;
      }
    }

    if (current === 0) {
      // Reached root
      const doneHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
      doneHl.set(0, "completed");
      const doneTree = buildTreeFromArray(heap, null, doneHl);
      steps.push({
        id: stepId++,
        description: `${heap[0]} is now at the root — insertion of ${val} complete. Heap: [${heap.join(", ")}]`,
        action: "complete",
        highlights: [{ indices: [0], color: "completed" }],
        data: {
          nodes: doneTree.nodes,
          edges: doneTree.edges,
          rootId: "0",
          currentNodeId: "0",
          operation: "insert complete",
          auxiliaryArray: [...heap],
          auxiliaryHighlights: buildArrayHighlights(doneHl),
        } satisfies TreeStepData,
      });
    }
  }

  // Snapshot after all inserts
  const allInsertedTree = buildTreeFromArray(heap, null, new Map());
  steps.push({
    id: stepId++,
    description: `All ${insertValues.length} values inserted. Min-Heap root = ${heap[0]} (minimum). Array: [${heap.join(", ")}]`,
    action: "complete",
    highlights: [],
    data: {
      nodes: allInsertedTree.nodes,
      edges: allInsertedTree.edges,
      rootId: "0",
      currentNodeId: "0",
      operation: "all inserted",
      auxiliaryArray: [...heap],
      auxiliaryHighlights: [{ indices: [0], color: "completed" }],
    } satisfies TreeStepData,
  });

  // --- EXTRACT-MIN PHASE (twice) ---
  for (let extraction = 1; extraction <= 2; extraction++) {
    const minVal = heap[0];
    const lastIdx = heap.length - 1;
    const lastVal = heap[lastIdx];

    // Show the min to extract
    const extractHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
    extractHl.set(0, "active");
    extractHl.set(lastIdx, "comparing");
    const extractTree = buildTreeFromArray(heap, 0, extractHl);

    steps.push({
      id: stepId++,
      description: `Extract-Min #${extraction}: Remove root ${minVal} (minimum). Swap with last element ${lastVal}`,
      action: "remove",
      highlights: [
        { indices: [0], color: "active" },
        { indices: [lastIdx], color: "comparing" },
      ],
      data: {
        nodes: extractTree.nodes,
        edges: extractTree.edges,
        rootId: "0",
        currentNodeId: "0",
        operation: `extract-min: ${minVal}`,
        auxiliaryArray: [...heap],
        auxiliaryHighlights: buildArrayHighlights(extractHl),
      } satisfies TreeStepData,
    });

    // Swap root with last
    [heap[0], heap[lastIdx]] = [heap[lastIdx], heap[0]];
    heap.pop();

    if (heap.length === 0) {
      steps.push({
        id: stepId++,
        description: `Extracted ${minVal}. Heap is now empty.`,
        action: "complete",
        highlights: [],
        data: {
          nodes: [],
          edges: [],
          rootId: null,
          currentNodeId: null,
          operation: "heap empty",
          auxiliaryArray: [],
          auxiliaryHighlights: [],
        } satisfies TreeStepData,
      });
      break;
    }

    const afterSwapHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
    afterSwapHl.set(0, "swapping");
    const afterSwapTree = buildTreeFromArray(heap, 0, afterSwapHl);

    steps.push({
      id: stepId++,
      description: `Moved ${heap[0]} to root. Removed last position. Now bubble down to restore heap property`,
      action: "swap",
      highlights: [{ indices: [0], color: "swapping" }],
      data: {
        nodes: afterSwapTree.nodes,
        edges: afterSwapTree.edges,
        rootId: "0",
        currentNodeId: "0",
        operation: "bubble down start",
        auxiliaryArray: [...heap],
        auxiliaryHighlights: buildArrayHighlights(afterSwapHl),
      } satisfies TreeStepData,
    });

    // Bubble down
    let current = 0;
    while (true) {
      let smallest = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      // Compare with children
      if (left < heap.length) {
        const cmpHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
        cmpHl.set(current, "active");
        cmpHl.set(left, "comparing");
        if (right < heap.length) cmpHl.set(right, "comparing");
        const cmpTree = buildTreeFromArray(heap, current, cmpHl);

        steps.push({
          id: stepId++,
          description: `Bubble down: Compare ${heap[current]} (index ${current}) with children${left < heap.length ? ` ${heap[left]}` : ""}${right < heap.length ? ` and ${heap[right]}` : ""}`,
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
            operation: "compare with children",
            auxiliaryArray: [...heap],
            auxiliaryHighlights: buildArrayHighlights(cmpHl),
          } satisfies TreeStepData,
        });

        if (heap[left] < heap[smallest]) smallest = left;
      }
      if (right < heap.length && heap[right] < heap[smallest]) {
        smallest = right;
      }

      if (smallest !== current) {
        const swapHl = new Map<number, "active" | "comparing" | "swapping" | "completed" | "selected">();
        swapHl.set(current, "swapping");
        swapHl.set(smallest, "swapping");

        [heap[current], heap[smallest]] = [heap[smallest], heap[current]];

        const swapTree = buildTreeFromArray(heap, smallest, swapHl);
        steps.push({
          id: stepId++,
          description: `Swap ${heap[smallest]} and ${heap[current]}: smaller child ${heap[current]} moves up`,
          action: "swap",
          highlights: [{ indices: [current, smallest], color: "swapping" }],
          data: {
            nodes: swapTree.nodes,
            edges: swapTree.edges,
            rootId: "0",
            currentNodeId: String(smallest),
            operation: "swap down",
            auxiliaryArray: [...heap],
            auxiliaryHighlights: buildArrayHighlights(swapHl),
          } satisfies TreeStepData,
        });

        current = smallest;
      } else {
        // Heap property restored
        steps.push({
          id: stepId++,
          description: `${heap[current]} is smaller than both children — heap property restored. Extracted ${minVal}`,
          action: "complete",
          highlights: [{ indices: [current], color: "completed" }],
          data: {
            nodes: buildTreeFromArray(heap, null, new Map()).nodes,
            edges: buildTreeFromArray(heap, null, new Map()).edges,
            rootId: "0",
            currentNodeId: null,
            operation: `extracted ${minVal}`,
            auxiliaryArray: [...heap],
            auxiliaryHighlights: [{ indices: [0], color: "completed" }],
          } satisfies TreeStepData,
        });
        break;
      }
    }
  }

  // Final state
  const finalTree = buildTreeFromArray(heap, null, new Map());
  const allIndices = heap.map((_, i) => i);
  steps.push({
    id: stepId++,
    description: `Min-Heap visualization complete! Final heap: [${heap.join(", ")}] with root = ${heap[0]}`,
    action: "complete",
    highlights: [{ indices: allIndices, color: "completed" }],
    data: {
      nodes: finalTree.nodes,
      edges: finalTree.edges,
      rootId: heap.length > 0 ? "0" : null,
      currentNodeId: null,
      operation: "done",
      auxiliaryArray: [...heap],
      auxiliaryHighlights: [{ indices: allIndices, color: "completed" }],
    } satisfies TreeStepData,
  });

  return steps;
}
