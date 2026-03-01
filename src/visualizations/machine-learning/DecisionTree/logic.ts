import type {
  VisualizationStep,
  TreeStepData,
  TreeNodeData,
  TreeEdgeData,
} from "@/lib/visualization/types";

interface DecisionTreeParams {
  maxDepth: number;
  numSamples: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

interface TreeNode {
  id: string;
  feature?: string;
  threshold?: number;
  label?: string;
  left?: TreeNode;
  right?: TreeNode;
  depth: number;
  samples: number;
  gini: number;
}

export function generateDecisionTreeSteps(
  params: DecisionTreeParams
): VisualizationStep[] {
  const { maxDepth, numSamples, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  let nodeCounter = 0;

  // Generate a simple 2D dataset
  const features = ["Age", "Income"];
  const data: { age: number; income: number; label: string }[] = [];
  for (let i = 0; i < numSamples; i++) {
    const age = 20 + rand() * 50;
    const income = 20 + rand() * 80;
    // Simple rule: if age > 40 AND income > 50 -> "Yes", else -> "No"
    const label = age > 40 && income > 50 ? "Yes" : rand() < 0.15 ? "Yes" : "No";
    data.push({ age, income, label });
  }

  // Build a deterministic decision tree
  function giniImpurity(labels: string[]): number {
    if (labels.length === 0) return 0;
    const counts: Record<string, number> = {};
    for (const l of labels) counts[l] = (counts[l] || 0) + 1;
    let impurity = 1;
    for (const c of Object.values(counts)) {
      const p = c / labels.length;
      impurity -= p * p;
    }
    return impurity;
  }

  function majorityClass(labels: string[]): string {
    const counts: Record<string, number> = {};
    for (const l of labels) counts[l] = (counts[l] || 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  function buildTree(
    indices: number[],
    depth: number
  ): TreeNode {
    const labels = indices.map((i) => data[i].label);
    const gini = giniImpurity(labels);
    const nodeId = `n${nodeCounter++}`;

    // Leaf conditions
    if (depth >= maxDepth || gini === 0 || indices.length < 4) {
      return {
        id: nodeId,
        label: majorityClass(labels),
        depth,
        samples: indices.length,
        gini,
      };
    }

    // Try best split
    let bestFeature = "";
    let bestThreshold = 0;
    let bestGain = -1;
    let bestLeftIdx: number[] = [];
    let bestRightIdx: number[] = [];

    for (const feature of ["age", "income"]) {
      const vals = indices.map((i) => feature === "age" ? data[i].age : data[i].income);
      const sorted = Array.from(new Set(vals)).sort((a, b) => a - b);

      for (let t = 0; t < sorted.length - 1; t++) {
        const threshold = (sorted[t] + sorted[t + 1]) / 2;
        const leftIdx = indices.filter((i) =>
          (feature === "age" ? data[i].age : data[i].income) <= threshold
        );
        const rightIdx = indices.filter((i) =>
          (feature === "age" ? data[i].age : data[i].income) > threshold
        );

        if (leftIdx.length === 0 || rightIdx.length === 0) continue;

        const leftGini = giniImpurity(leftIdx.map((i) => data[i].label));
        const rightGini = giniImpurity(rightIdx.map((i) => data[i].label));
        const weightedGini =
          (leftIdx.length * leftGini + rightIdx.length * rightGini) / indices.length;
        const gain = gini - weightedGini;

        if (gain > bestGain) {
          bestGain = gain;
          bestFeature = feature;
          bestThreshold = threshold;
          bestLeftIdx = leftIdx;
          bestRightIdx = rightIdx;
        }
      }
    }

    if (bestGain <= 0) {
      return {
        id: nodeId,
        label: majorityClass(labels),
        depth,
        samples: indices.length,
        gini,
      };
    }

    const featureName = bestFeature === "age" ? "Age" : "Income";

    return {
      id: nodeId,
      feature: featureName,
      threshold: bestThreshold,
      depth,
      samples: indices.length,
      gini,
      left: buildTree(bestLeftIdx, depth + 1),
      right: buildTree(bestRightIdx, depth + 1),
    };
  }

  const allIndices = Array.from({ length: numSamples }, (_, i) => i);
  const tree = buildTree(allIndices, 0);

  // Convert tree to step-by-step visualization
  function collectNodes(node: TreeNode, order: TreeNode[]) {
    order.push(node);
    if (node.left) collectNodes(node.left, order);
    if (node.right) collectNodes(node.right, order);
  }

  const nodeOrder: TreeNode[] = [];
  collectNodes(tree, nodeOrder);

  function toTreeNodes(visibleIds: Set<string>): { nodes: TreeNodeData[]; edges: TreeEdgeData[] } {
    const nodes: TreeNodeData[] = [];
    const edges: TreeEdgeData[] = [];

    function traverse(node: TreeNode, parentId: string | null) {
      if (!visibleIds.has(node.id)) return;

      const displayValue = node.label
        ? node.label
        : `${node.feature} <= ${node.threshold!.toFixed(0)}`;

      nodes.push({
        id: node.id,
        value: displayValue,
        children: [
          ...(node.left && visibleIds.has(node.left.id) ? [node.left.id] : []),
          ...(node.right && visibleIds.has(node.right.id) ? [node.right.id] : []),
        ],
        parent: parentId,
        highlight: node.label ? "completed" : undefined,
      });

      if (parentId) {
        edges.push({
          source: parentId,
          target: node.id,
          label: parentId && node === findLeft(parentId) ? "<=" : ">",
        });
      }

      if (node.left && visibleIds.has(node.left.id)) traverse(node.left, node.id);
      if (node.right && visibleIds.has(node.right.id)) traverse(node.right, node.id);
    }

    function findLeft(parentId: string): TreeNode | undefined {
      function search(n: TreeNode): TreeNode | undefined {
        if (n.id === parentId) return n.left;
        if (n.left) { const r = search(n.left); if (r) return r; }
        if (n.right) { const r = search(n.right); if (r) return r; }
        return undefined;
      }
      return search(tree);
    }

    traverse(tree, null);
    return { nodes, edges };
  }

  // Step 1: Introduction
  steps.push({
    id: stepId++,
    description: `Dataset: ${numSamples} samples with features [Age, Income]. Building a decision tree with max depth ${maxDepth} using Gini impurity.`,
    action: "train",
    highlights: [],
    data: {
      nodes: [],
      edges: [],
      rootId: null,
      currentNodeId: null,
      operation: "Initializing decision tree",
    } as TreeStepData,
  });

  // Steps: Add nodes one by one
  const visibleIds = new Set<string>();

  for (let i = 0; i < nodeOrder.length; i++) {
    const node = nodeOrder[i];
    visibleIds.add(node.id);

    const { nodes, edges } = toTreeNodes(visibleIds);
    const isLeaf = !!node.label;

    const description = isLeaf
      ? `Leaf node: Predicts "${node.label}" (${node.samples} samples, Gini=${node.gini.toFixed(3)}). No further splitting needed.`
      : `Split on ${node.feature} <= ${node.threshold!.toFixed(0)} (${node.samples} samples, Gini=${node.gini.toFixed(3)}). Information gain justifies this split.`;

    steps.push({
      id: stepId++,
      description,
      action: "split-node",
      highlights: [{ indices: [i], color: isLeaf ? "completed" : "active", label: isLeaf ? "Leaf" : "Split" }],
      data: {
        nodes,
        edges,
        rootId: tree.id,
        currentNodeId: node.id,
        operation: isLeaf ? `Leaf: ${node.label}` : `Split: ${node.feature} <= ${node.threshold!.toFixed(0)}`,
      } as TreeStepData,
    });
  }

  // Final step
  const { nodes: finalNodes, edges: finalEdges } = toTreeNodes(visibleIds);
  steps.push({
    id: stepId++,
    description: `Decision tree complete! ${nodeOrder.filter((n) => n.label).length} leaf nodes, max depth ${maxDepth}. The tree splits data using Gini impurity at each node to find the best feature and threshold.`,
    action: "complete",
    highlights: [],
    data: {
      nodes: finalNodes,
      edges: finalEdges,
      rootId: tree.id,
      currentNodeId: null,
      operation: "Decision tree complete",
    } as TreeStepData,
  });

  return steps;
}
