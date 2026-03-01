import type {
  VisualizationStep,
  TreeNodeData,
  TreeEdgeData,
  TreeStepData,
} from "@/lib/visualization/types";

export interface HuffmanNode {
  id: string;
  freq: number;
  char: string | null;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

export interface HuffmanStepData extends TreeStepData {
  priorityQueue: { id: string; freq: number; label: string }[];
  codes: Record<string, string>;
  phase: "init" | "building" | "encoding" | "done";
}

export const DEFAULT_FREQUENCIES: Record<string, number> = {
  a: 5,
  b: 9,
  c: 12,
  d: 13,
  e: 16,
  f: 45,
};

let nodeCounter = 0;

function createLeafNode(char: string, freq: number): HuffmanNode {
  return {
    id: `leaf-${char}`,
    freq,
    char,
    left: null,
    right: null,
  };
}

function createInternalNode(
  left: HuffmanNode,
  right: HuffmanNode,
): HuffmanNode {
  nodeCounter++;
  return {
    id: `internal-${nodeCounter}`,
    freq: left.freq + right.freq,
    char: null,
    left,
    right,
  };
}

function huffmanTreeToTreeData(
  root: HuffmanNode | null,
): { nodes: TreeNodeData[]; edges: TreeEdgeData[] } {
  const nodes: TreeNodeData[] = [];
  const edges: TreeEdgeData[] = [];

  if (!root) return { nodes, edges };

  function traverse(node: HuffmanNode, parentId: string | null): void {
    const label = node.char
      ? `${node.char}:${node.freq}`
      : `${node.freq}`;

    nodes.push({
      id: node.id,
      value: label,
      children: [],
      parent: parentId,
    });

    if (parentId) {
      // Determine if this is left or right child for edge label
      const parent = findNode(root!, parentId);
      const isLeft = parent?.left?.id === node.id;

      edges.push({
        source: parentId,
        target: node.id,
        label: isLeft ? "0" : "1",
      });
    }

    // Update parent's children
    if (parentId) {
      const parentNode = nodes.find((n) => n.id === parentId);
      if (parentNode) {
        parentNode.children.push(node.id);
      }
    }

    if (node.left) traverse(node.left, node.id);
    if (node.right) traverse(node.right, node.id);
  }

  traverse(root, null);
  return { nodes, edges };
}

function findNode(root: HuffmanNode, id: string): HuffmanNode | null {
  if (root.id === id) return root;
  if (root.left) {
    const found = findNode(root.left, id);
    if (found) return found;
  }
  if (root.right) {
    const found = findNode(root.right, id);
    if (found) return found;
  }
  return null;
}

function generateCodes(
  node: HuffmanNode,
  prefix: string = "",
): Record<string, string> {
  if (node.char !== null) {
    return { [node.char]: prefix || "0" };
  }

  const codes: Record<string, string> = {};
  if (node.left) {
    Object.assign(codes, generateCodes(node.left, prefix + "0"));
  }
  if (node.right) {
    Object.assign(codes, generateCodes(node.right, prefix + "1"));
  }
  return codes;
}

export function generateHuffmanSteps(
  frequencies: Record<string, number> = DEFAULT_FREQUENCIES,
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  nodeCounter = 0;

  // Create leaf nodes
  const leafNodes: HuffmanNode[] = Object.entries(frequencies)
    .map(([char, freq]) => createLeafNode(char, freq))
    .sort((a, b) => a.freq - b.freq);

  // Priority queue (sorted by frequency)
  const pq: HuffmanNode[] = [...leafNodes];

  // Step 1: Initialize
  const pqDisplay = pq.map((n) => ({
    id: n.id,
    freq: n.freq,
    label: n.char ? `${n.char}:${n.freq}` : `${n.freq}`,
  }));

  steps.push({
    id: stepId++,
    description: `Initialize Huffman coding with ${Object.keys(frequencies).length} characters. Create a leaf node for each character with its frequency: ${Object.entries(frequencies).map(([c, f]) => `'${c}'=${f}`).join(", ")}. Insert all into a min-priority queue.`,
    action: "highlight",
    highlights: [],
    data: {
      nodes: leafNodes.map((n) => ({
        id: n.id,
        value: n.char ? `${n.char}:${n.freq}` : `${n.freq}`,
        children: [],
        parent: null,
      })),
      edges: [],
      rootId: null,
      currentNodeId: null,
      operation: "initialize",
      priorityQueue: [...pqDisplay],
      codes: {},
      phase: "init",
    } satisfies HuffmanStepData,
  });

  // Build the tree
  let currentRoot: HuffmanNode | null = null;

  while (pq.length > 1) {
    // Sort PQ by frequency
    pq.sort((a, b) => a.freq - b.freq);

    // Extract two smallest
    const left = pq.shift()!;
    const right = pq.shift()!;

    const leftLabel = left.char ? `'${left.char}'(${left.freq})` : `(${left.freq})`;
    const rightLabel = right.char ? `'${right.char}'(${right.freq})` : `(${right.freq})`;

    // Merge into new internal node
    const merged = createInternalNode(left, right);

    // Show extraction step
    steps.push({
      id: stepId++,
      description: `Extract the two nodes with lowest frequencies: ${leftLabel} and ${rightLabel}. Merge them into a new internal node with frequency ${left.freq} + ${right.freq} = ${merged.freq}.`,
      action: "merge",
      highlights: [],
      data: (() => {
        // Build current tree state for display
        const tempPQ = [...pq, merged];
        const { nodes, edges } = huffmanTreeToTreeData(merged);
        const pqDisp = tempPQ
          .sort((a, b) => a.freq - b.freq)
          .map((n) => ({
            id: n.id,
            freq: n.freq,
            label: n.char ? `${n.char}:${n.freq}` : `${n.freq}`,
          }));

        return {
          nodes,
          edges,
          rootId: merged.id,
          currentNodeId: merged.id,
          operation: "merge",
          priorityQueue: pqDisp,
          codes: {},
          phase: "building" as const,
        } satisfies HuffmanStepData;
      })(),
    });

    pq.push(merged);
    currentRoot = merged;
  }

  // The final tree
  const finalRoot = pq[0] || currentRoot;

  if (finalRoot) {
    const { nodes: treeNodes, edges: treeEdges } = huffmanTreeToTreeData(finalRoot);

    steps.push({
      id: stepId++,
      description: `Huffman tree is complete! The root has frequency ${finalRoot.freq} (sum of all character frequencies). Now traverse the tree to generate codes: left edge = 0, right edge = 1.`,
      action: "complete",
      highlights: [],
      data: {
        nodes: treeNodes,
        edges: treeEdges,
        rootId: finalRoot.id,
        currentNodeId: finalRoot.id,
        operation: "tree-complete",
        priorityQueue: [],
        codes: {},
        phase: "encoding",
      } satisfies HuffmanStepData,
    });

    // Generate and show codes
    const codes = generateCodes(finalRoot);

    // Highlight each leaf with its code
    const sortedChars = Object.entries(codes).sort(
      (a, b) => a[1].length - b[1].length,
    );

    for (const [char, code] of sortedChars) {
      const leafId = `leaf-${char}`;
      const highlightedNodes = treeNodes.map((n) => ({
        ...n,
        highlight:
          n.id === leafId
            ? ("active" as const)
            : undefined,
      }));

      // Highlight path from root to this leaf
      const pathEdges: string[] = [];
      let currentId = leafId;
      while (currentId) {
        const parentEdge = treeEdges.find((e) => e.target === currentId);
        if (parentEdge) {
          pathEdges.push(`${parentEdge.source}-${parentEdge.target}`);
          currentId = parentEdge.source;
        } else {
          break;
        }
      }

      const highlightedEdges = treeEdges.map((e) => ({
        ...e,
        highlight: pathEdges.includes(`${e.source}-${e.target}`)
          ? ("path" as const)
          : undefined,
      }));

      steps.push({
        id: stepId++,
        description: `Character '${char}' (freq=${frequencies[char]}): code = "${code}" (${code.length} bits). Path from root: ${code.split("").map((b, i) => `${b === "0" ? "left" : "right"}`).join(" -> ")}.`,
        action: "highlight",
        highlights: [],
        data: {
          nodes: highlightedNodes,
          edges: highlightedEdges,
          rootId: finalRoot.id,
          currentNodeId: leafId,
          operation: "show-code",
          priorityQueue: [],
          codes: Object.fromEntries(
            sortedChars.filter(([c]) => c <= char).map(([c, cd]) => [c, cd]),
          ),
          phase: "encoding",
        } satisfies HuffmanStepData,
      });
    }

    // Final summary
    const totalBits = Object.entries(frequencies).reduce(
      (sum, [c, f]) => sum + f * codes[c].length,
      0,
    );
    const fixedBits =
      Object.values(frequencies).reduce((s, f) => s + f, 0) *
      Math.ceil(Math.log2(Object.keys(frequencies).length));

    steps.push({
      id: stepId++,
      description: `Huffman coding complete! All codes: ${sortedChars.map(([c, code]) => `'${c}'="${code}"`).join(", ")}. Total bits: ${totalBits} (vs ${fixedBits} with fixed-length encoding). Compression ratio: ${((1 - totalBits / fixedBits) * 100).toFixed(1)}% savings.`,
      action: "complete",
      highlights: [],
      data: {
        nodes: treeNodes,
        edges: treeEdges,
        rootId: finalRoot.id,
        currentNodeId: null,
        operation: "done",
        priorityQueue: [],
        codes,
        phase: "done",
      } satisfies HuffmanStepData,
    });
  }

  return steps;
}
