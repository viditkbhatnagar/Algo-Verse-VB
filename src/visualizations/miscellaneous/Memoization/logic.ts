import type {
  VisualizationStep,
  TreeStepData,
  TreeNodeData,
  TreeEdgeData,
  HighlightColor,
} from "@/lib/visualization/types";

/**
 * Generates visualization steps for Fibonacci(n) with memoization.
 *
 * Builds the recursive call tree, showing which calls are freshly computed
 * and which ones hit the cache. Cached calls are highlighted in green ("completed")
 * with a "CACHED" label, while fresh computations use active/comparing colors.
 *
 * For fib(6), the tree has nodes like:
 *          fib(6)
 *         /      \
 *      fib(5)    fib(4) [CACHED]
 *      /    \
 *   fib(4)  fib(3) [CACHED]
 *   /    \
 * fib(3)  fib(2) [CACHED]
 *  /   \
 * fib(2) fib(1)
 *  /   \
 * fib(1) fib(0)
 */

interface CallNode {
  id: string;
  fibN: number;
  parentId: string | null;
  isCached: boolean;
  returnValue?: number;
  state: "pending" | "computing" | "returned" | "cached";
}

export function generateMemoizationSteps(n: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  let nodeCounter = 0;

  // Track all nodes and edges as we build the tree via DFS
  const allNodes: CallNode[] = [];
  const allEdges: { source: string; target: string }[] = [];
  const cache: Record<number, number> = {};

  // We'll simulate the recursive DFS call by manually building the tree
  // and recording steps along the way.

  function makeNodeId(): string {
    return `n${nodeCounter++}`;
  }

  function buildTreeNodes(): TreeNodeData[] {
    return allNodes.map((cn) => {
      let highlight: HighlightColor | undefined;
      let label: string;

      if (cn.state === "computing") {
        highlight = "comparing";
        label = `fib(${cn.fibN})`;
      } else if (cn.state === "cached") {
        highlight = "completed";
        label = `fib(${cn.fibN})=${cn.returnValue}`;
      } else if (cn.state === "returned") {
        highlight = "completed";
        label = `fib(${cn.fibN})=${cn.returnValue}`;
      } else {
        label = `fib(${cn.fibN})`;
      }

      const children = allEdges
        .filter((e) => e.source === cn.id)
        .map((e) => e.target);

      return {
        id: cn.id,
        value: label,
        children,
        parent: cn.parentId,
        highlight,
      };
    });
  }

  function buildTreeEdges(): TreeEdgeData[] {
    return allEdges.map((e) => {
      const targetNode = allNodes.find((n) => n.id === e.target);
      return {
        source: e.source,
        target: e.target,
        highlight: targetNode?.state === "cached" ? "completed" : targetNode?.state === "returned" ? "completed" : undefined,
        label: targetNode?.isCached ? "CACHED" : undefined,
      };
    });
  }

  function snapshot(
    currentId: string | null,
    operation: string
  ): TreeStepData {
    const rootNode = allNodes.length > 0 ? allNodes[0].id : null;
    return {
      nodes: buildTreeNodes(),
      edges: buildTreeEdges(),
      rootId: rootNode,
      currentNodeId: currentId,
      operation,
    } satisfies TreeStepData;
  }

  // ===== Introduction =====
  steps.push({
    id: stepId++,
    description: `Memoization visualization: computing Fibonacci(${n}) with caching. Each unique fib(k) is computed once and stored. Subsequent calls to the same fib(k) return the cached value immediately (shown in green).`,
    action: "highlight",
    highlights: [],
    data: {
      nodes: [],
      edges: [],
      rootId: null,
      currentNodeId: null,
      operation: "initialize",
    } satisfies TreeStepData,
  });

  // ===== DFS simulation =====
  // We simulate fib(n) with memoization, recording each call as a step.

  function fibDFS(fibN: number, parentId: string | null): number {
    const id = makeNodeId();
    const isCached = fibN in cache;

    const node: CallNode = {
      id,
      fibN,
      parentId,
      isCached,
      state: isCached ? "cached" : "computing",
    };
    allNodes.push(node);

    if (parentId !== null) {
      allEdges.push({ source: parentId, target: id });
    }

    if (isCached) {
      // Cache hit!
      node.returnValue = cache[fibN];
      node.state = "cached";

      steps.push({
        id: stepId++,
        description: `Call fib(${fibN}) -- CACHE HIT! Returning cached value ${cache[fibN]} immediately. No recursive calls needed.`,
        action: "highlight",
        highlights: [{ indices: [allNodes.length - 1], color: "completed" }],
        data: snapshot(id, "cache-hit"),
        variables: { fibN, cached: true, value: cache[fibN] },
      });

      return cache[fibN];
    }

    // Show the new call
    steps.push({
      id: stepId++,
      description: `Call fib(${fibN})${fibN <= 1 ? ` -- BASE CASE: fib(${fibN}) = ${fibN}.` : ` -- computing. Need fib(${fibN - 1}) + fib(${fibN - 2}).`}`,
      action: fibN <= 1 ? "visit" : "push",
      highlights: [{ indices: [allNodes.length - 1], color: "comparing" }],
      data: snapshot(id, fibN <= 1 ? "base-case" : "call"),
      variables: { fibN, cached: false },
    });

    let result: number;

    if (fibN <= 0) {
      result = 0;
    } else if (fibN === 1) {
      result = 1;
    } else {
      // Recursive calls
      const leftResult = fibDFS(fibN - 1, id);
      const rightResult = fibDFS(fibN - 2, id);
      result = leftResult + rightResult;

      steps.push({
        id: stepId++,
        description: `fib(${fibN}) = fib(${fibN - 1}) + fib(${fibN - 2}) = ${leftResult} + ${rightResult} = ${result}. Store result in cache.`,
        action: "pop",
        highlights: [{ indices: [allNodes.indexOf(node)], color: "completed" }],
        data: snapshot(id, "compute"),
        variables: { fibN, result, computation: `${leftResult} + ${rightResult}` },
      });
    }

    // Mark as returned and cache
    node.returnValue = result;
    node.state = "returned";
    cache[fibN] = result;

    if (fibN <= 1) {
      // Show base case return
      steps.push({
        id: stepId++,
        description: `fib(${fibN}) returns ${result}. Store in cache: cache[${fibN}] = ${result}.`,
        action: "pop",
        highlights: [{ indices: [allNodes.indexOf(node)], color: "completed" }],
        data: snapshot(id, "return"),
        variables: { fibN, result },
      });
    }

    return result;
  }

  const finalResult = fibDFS(n, null);

  // ===== Final step =====
  steps.push({
    id: stepId++,
    description: `Memoization complete! Fibonacci(${n}) = ${finalResult}. Total unique computations: ${Object.keys(cache).length}. Without memoization, this would require ${Math.round(Math.pow(1.618, n))}+ recursive calls.`,
    action: "complete",
    highlights: [],
    data: snapshot(allNodes[0]?.id ?? null, "complete"),
    variables: { result: finalResult, cacheSize: Object.keys(cache).length },
  });

  return steps;
}
