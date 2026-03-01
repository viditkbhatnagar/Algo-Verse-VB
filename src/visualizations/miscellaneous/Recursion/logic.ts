import type {
  VisualizationStep,
  TreeStepData,
  TreeNodeData,
  TreeEdgeData,
} from "@/lib/visualization/types";

/**
 * Generates visualization steps for factorial(n) recursive call stack.
 *
 * Call tree for factorial(5):
 *   fact(5) -> fact(4) -> fact(3) -> fact(2) -> fact(1)
 *
 * This is a linear chain (each call has one child), showing the call stack
 * building up and then unwinding with return values.
 */
export function generateRecursionSteps(n: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Node IDs: "f5", "f4", "f3", "f2", "f1"
  function nodeId(k: number): string {
    return `f${k}`;
  }

  // Track which nodes exist, their state, and return values
  const nodeStates: Record<string, "calling" | "active" | "returned"> = {};
  const returnValues: Record<string, number> = {};

  function buildNodes(existingIds: string[]): TreeNodeData[] {
    return existingIds.map((id) => {
      const k = parseInt(id.slice(1), 10);
      const childId = k > 1 ? nodeId(k - 1) : null;
      const children =
        childId && existingIds.includes(childId) ? [childId] : [];
      const parentK = k + 1;
      const parentId = nodeId(parentK);
      const parent =
        parentK <= n && existingIds.includes(parentId) ? parentId : null;

      const state = nodeStates[id];
      let highlight: "active" | "comparing" | "completed" | undefined;
      if (state === "active") highlight = "active";
      else if (state === "calling") highlight = "comparing";
      else if (state === "returned") highlight = "completed";

      const label =
        state === "returned" && returnValues[id] !== undefined
          ? `fact(${k})=${returnValues[id]}`
          : `fact(${k})`;

      return {
        id,
        value: label,
        children,
        parent,
        highlight,
      };
    });
  }

  function buildEdges(existingIds: string[]): TreeEdgeData[] {
    const edges: TreeEdgeData[] = [];
    for (const id of existingIds) {
      const k = parseInt(id.slice(1), 10);
      const childId = nodeId(k - 1);
      if (k > 1 && existingIds.includes(childId)) {
        const childState = nodeStates[childId];
        edges.push({
          source: id,
          target: childId,
          highlight:
            childState === "returned"
              ? "completed"
              : childState === "active"
                ? "active"
                : undefined,
        });
      }
    }
    return edges;
  }

  function snapshot(
    existingIds: string[],
    currentId: string | null,
    operation: string
  ): TreeStepData {
    return {
      nodes: buildNodes(existingIds),
      edges: buildEdges(existingIds),
      rootId: existingIds.length > 0 ? nodeId(n) : null,
      currentNodeId: currentId,
      operation,
    } satisfies TreeStepData;
  }

  // ===== PHASE 1: Build the call stack (calling down) =====

  steps.push({
    id: stepId++,
    description: `Recursion visualization: computing factorial(${n}). We will trace how the call stack builds up as each call waits for its recursive sub-call to return.`,
    action: "highlight",
    highlights: [],
    data: snapshot([], null, "initialize"),
  });

  const existingIds: string[] = [];

  // Each call from fact(n) down to fact(1)
  for (let k = n; k >= 1; k--) {
    const id = nodeId(k);
    existingIds.push(id);

    if (k === n) {
      // Initial call
      nodeStates[id] = "active";
      steps.push({
        id: stepId++,
        description: `Call factorial(${k}). This is the initial call. Since ${k} > 1, we need to compute ${k} * factorial(${k - 1}). Push fact(${k}) onto the call stack.`,
        action: "push",
        highlights: [{ indices: [0], color: "active" }],
        data: snapshot(existingIds, id, "call"),
        variables: { callStack: existingIds.map((i) => i), depth: existingIds.length },
      });
    } else if (k === 1) {
      // Base case
      nodeStates[id] = "active";
      // Mark previous as waiting
      const prevId = nodeId(k + 1);
      nodeStates[prevId] = "calling";

      steps.push({
        id: stepId++,
        description: `Call factorial(${k}). BASE CASE reached! factorial(1) = 1. No more recursive calls needed. The stack has ${existingIds.length} frames deep.`,
        action: "push",
        highlights: [{ indices: [existingIds.length - 1], color: "active" }],
        data: snapshot(existingIds, id, "base-case"),
        variables: { callStack: existingIds.map((i) => i), depth: existingIds.length },
      });
    } else {
      // Recursive call
      // Mark previous as waiting
      const prevId = nodeId(k + 1);
      nodeStates[prevId] = "calling";
      nodeStates[id] = "active";

      steps.push({
        id: stepId++,
        description: `Call factorial(${k}). Since ${k} > 1, we need ${k} * factorial(${k - 1}). Push fact(${k}) onto the call stack and recurse deeper.`,
        action: "push",
        highlights: [{ indices: [existingIds.length - 1], color: "active" }],
        data: snapshot(existingIds, id, "call"),
        variables: { callStack: existingIds.map((i) => i), depth: existingIds.length },
      });
    }
  }

  // ===== PHASE 2: Unwind the call stack (returning up) =====

  // Base case returns 1
  const baseId = nodeId(1);
  returnValues[baseId] = 1;
  nodeStates[baseId] = "returned";

  steps.push({
    id: stepId++,
    description: `factorial(1) returns 1. Pop fact(1) off the call stack. Return value 1 propagates up to the caller fact(2).`,
    action: "pop",
    highlights: [{ indices: [existingIds.length - 1], color: "completed" }],
    data: snapshot(existingIds, baseId, "return"),
    variables: { returnValue: 1, depth: existingIds.length },
  });

  // Return values propagate up: fact(2) = 2*1 = 2, fact(3) = 3*2 = 6, etc.
  for (let k = 2; k <= n; k++) {
    const id = nodeId(k);
    const childReturnVal = returnValues[nodeId(k - 1)];
    const result = k * childReturnVal;
    returnValues[id] = result;
    nodeStates[id] = "returned";

    const isLast = k === n;

    steps.push({
      id: stepId++,
      description: `factorial(${k}) receives ${childReturnVal} from factorial(${k - 1}). Computes ${k} * ${childReturnVal} = ${result}. ${isLast ? `Final result: factorial(${n}) = ${result}!` : `Returns ${result} to caller fact(${k + 1}).`}`,
      action: isLast ? "complete" : "pop",
      highlights: [{ indices: [n - k], color: "completed" }],
      data: snapshot(existingIds, id, isLast ? "complete" : "return"),
      variables: { returnValue: result, computation: `${k} * ${childReturnVal} = ${result}` },
    });
  }

  return steps;
}
