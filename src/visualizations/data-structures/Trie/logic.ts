import type { VisualizationStep, TreeStepData, TreeNodeData, TreeEdgeData, HighlightColor } from "@/lib/visualization/types";

/**
 * Internal trie node structure used during step generation.
 */
interface TrieNodeInternal {
  id: string;
  char: string; // the character this node represents ("" for root)
  children: Map<string, TrieNodeInternal>;
  isEnd: boolean;
}

let nodeIdCounter = 0;

function createTrieNode(char: string): TrieNodeInternal {
  return {
    id: `trie-${nodeIdCounter++}`,
    char,
    children: new Map(),
    isEnd: false,
  };
}

/**
 * Convert the internal trie to TreeNodeData[] and TreeEdgeData[].
 * highlightedPath: ordered array of node ids to highlight (the path being traversed)
 * highlightColor: color for the highlighted path
 * newNodeId: id of a newly created node (highlighted differently)
 */
function trieToTreeData(
  root: TrieNodeInternal,
  highlightedPath: Set<string>,
  pathColor: HighlightColor,
  endNodeIds: Set<string>,
  newNodeId?: string
): { nodes: TreeNodeData[]; edges: TreeEdgeData[] } {
  const nodes: TreeNodeData[] = [];
  const edges: TreeEdgeData[] = [];

  function traverse(node: TrieNodeInternal, parentId: string | null) {
    const sortedChildren = Array.from(node.children.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const childIds = sortedChildren.map(([, child]) => child.id);

    let highlight: HighlightColor | undefined;
    if (node.id === newNodeId) {
      highlight = "swapping"; // newly created node
    } else if (highlightedPath.has(node.id)) {
      highlight = pathColor;
    } else if (endNodeIds.has(node.id)) {
      highlight = "completed";
    }

    // Display the character on the node (root shows empty string symbol)
    const displayValue = node.isEnd
      ? (node.char === "" ? "*" : `${node.char}*`)
      : (node.char === "" ? "" : node.char);

    nodes.push({
      id: node.id,
      value: displayValue,
      children: childIds,
      parent: parentId,
      highlight,
    });

    if (parentId !== null) {
      const edgeHighlight = highlightedPath.has(node.id) && highlightedPath.has(parentId)
        ? pathColor
        : undefined;
      edges.push({
        source: parentId,
        target: node.id,
        highlight: edgeHighlight,
        label: node.char,
      });
    }

    for (const [, child] of sortedChildren) {
      traverse(child, node.id);
    }
  }

  traverse(root, null);
  return { nodes, edges };
}

/**
 * Collect all node ids that are end-of-word markers.
 */
function collectEndNodes(root: TrieNodeInternal): Set<string> {
  const endNodes = new Set<string>();
  function traverse(node: TrieNodeInternal) {
    if (node.isEnd) endNodes.add(node.id);
    Array.from(node.children.values()).forEach((child) => {
      traverse(child);
    });
  }
  traverse(root);
  return endNodes;
}

export function generateTrieSteps(): VisualizationStep[] {
  nodeIdCounter = 0;
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const root = createTrieNode("");

  const wordsToInsert = ["cat", "car", "card", "care"];
  const searchWords = [
    { word: "car", expected: true },
    { word: "cap", expected: false },
  ];

  // --- Initial state ---
  const initTree = trieToTreeData(root, new Set(), "active", new Set());
  steps.push({
    id: stepId++,
    description: "Starting Trie visualization. The root node represents the empty string. We will insert words and then search for them.",
    action: "highlight",
    highlights: [],
    data: {
      nodes: initTree.nodes,
      edges: initTree.edges,
      rootId: root.id,
      currentNodeId: root.id,
      operation: "init",
    } satisfies TreeStepData,
  });

  // --- INSERT PHASE ---
  for (const word of wordsToInsert) {
    let currentNode = root;
    const pathIds: string[] = [root.id];

    steps.push({
      id: stepId++,
      description: `Insert "${word}": Start at root and follow/create path for each character`,
      action: "insert",
      highlights: [],
      data: {
        ...trieToTreeData(root, new Set([root.id]), "active", collectEndNodes(root)),
        rootId: root.id,
        currentNodeId: root.id,
        operation: `insert "${word}"`,
      } satisfies TreeStepData,
    });

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const pathSoFar = word.slice(0, i + 1);
      const highlightSet = new Set(pathIds);

      if (currentNode.children.has(char)) {
        // Character already exists — follow the existing edge
        currentNode = currentNode.children.get(char)!;
        pathIds.push(currentNode.id);
        highlightSet.add(currentNode.id);

        const treeData = trieToTreeData(root, highlightSet, "active", collectEndNodes(root));
        steps.push({
          id: stepId++,
          description: `Insert "${word}": Character '${char}' already exists — follow edge to "${pathSoFar}"`,
          action: "visit",
          highlights: [],
          data: {
            nodes: treeData.nodes,
            edges: treeData.edges,
            rootId: root.id,
            currentNodeId: currentNode.id,
            operation: `follow '${char}'`,
          } satisfies TreeStepData,
        });
      } else {
        // Character does not exist — create new node
        const newNode = createTrieNode(char);
        currentNode.children.set(char, newNode);
        currentNode = newNode;
        pathIds.push(currentNode.id);
        highlightSet.add(currentNode.id);

        const treeData = trieToTreeData(root, highlightSet, "active", collectEndNodes(root), currentNode.id);
        steps.push({
          id: stepId++,
          description: `Insert "${word}": Character '${char}' not found — create new node for "${pathSoFar}"`,
          action: "insert",
          highlights: [],
          data: {
            nodes: treeData.nodes,
            edges: treeData.edges,
            rootId: root.id,
            currentNodeId: currentNode.id,
            operation: `create '${char}'`,
          } satisfies TreeStepData,
        });
      }
    }

    // Mark end of word
    currentNode.isEnd = true;
    const finalHighlight = new Set(pathIds);
    const endNodes = collectEndNodes(root);
    const finalTree = trieToTreeData(root, finalHighlight, "completed", endNodes);
    steps.push({
      id: stepId++,
      description: `Insert "${word}": Mark node as end-of-word (shown with *). Word "${word}" is now stored in the trie`,
      action: "complete",
      highlights: [],
      data: {
        nodes: finalTree.nodes,
        edges: finalTree.edges,
        rootId: root.id,
        currentNodeId: currentNode.id,
        operation: `"${word}" inserted`,
      } satisfies TreeStepData,
    });
  }

  // Snapshot after all insertions
  const allInsertedTree = trieToTreeData(root, new Set(), "active", collectEndNodes(root));
  steps.push({
    id: stepId++,
    description: `All ${wordsToInsert.length} words inserted: ${wordsToInsert.map((w) => `"${w}"`).join(", ")}. Nodes marked with * indicate end-of-word. Notice how "cat", "car", "card", "care" share the prefix "ca"`,
    action: "complete",
    highlights: [],
    data: {
      nodes: allInsertedTree.nodes,
      edges: allInsertedTree.edges,
      rootId: root.id,
      currentNodeId: null,
      operation: "all words inserted",
    } satisfies TreeStepData,
  });

  // --- SEARCH PHASE ---
  for (const { word: searchWord, expected } of searchWords) {
    let currentNode: TrieNodeInternal | null = root;
    const pathIds: string[] = [root.id];
    let found = true;

    steps.push({
      id: stepId++,
      description: `Search "${searchWord}": Start at root and follow edges for each character`,
      action: "highlight",
      highlights: [],
      data: {
        ...trieToTreeData(root, new Set([root.id]), "comparing", collectEndNodes(root)),
        rootId: root.id,
        currentNodeId: root.id,
        operation: `search "${searchWord}"`,
      } satisfies TreeStepData,
    });

    for (let i = 0; i < searchWord.length; i++) {
      const char = searchWord[i];
      const pathSoFar = searchWord.slice(0, i + 1);
      const highlightSet = new Set(pathIds);

      if (currentNode!.children.has(char)) {
        currentNode = currentNode!.children.get(char)!;
        pathIds.push(currentNode.id);
        highlightSet.add(currentNode.id);

        const treeData = trieToTreeData(root, highlightSet, "comparing", collectEndNodes(root));
        steps.push({
          id: stepId++,
          description: `Search "${searchWord}": Found '${char}' — follow edge to "${pathSoFar}"`,
          action: "visit",
          highlights: [],
          data: {
            nodes: treeData.nodes,
            edges: treeData.edges,
            rootId: root.id,
            currentNodeId: currentNode.id,
            operation: `found '${char}'`,
          } satisfies TreeStepData,
        });
      } else {
        // Character not found — search fails
        found = false;
        const failTree = trieToTreeData(root, highlightSet, "swapping", collectEndNodes(root));
        steps.push({
          id: stepId++,
          description: `Search "${searchWord}": Character '${char}' NOT found — no edge for '${char}' from current node. Search FAILED`,
          action: "highlight",
          highlights: [],
          data: {
            nodes: failTree.nodes,
            edges: failTree.edges,
            rootId: root.id,
            currentNodeId: pathIds[pathIds.length - 1],
            operation: `'${char}' not found`,
          } satisfies TreeStepData,
        });
        break;
      }
    }

    if (found && currentNode) {
      if (currentNode.isEnd) {
        const successHighlight = new Set(pathIds);
        const successTree = trieToTreeData(root, successHighlight, "completed", collectEndNodes(root));
        steps.push({
          id: stepId++,
          description: `Search "${searchWord}": All characters found and node is marked as end-of-word (*). "${searchWord}" EXISTS in the trie!`,
          action: "complete",
          highlights: [],
          data: {
            nodes: successTree.nodes,
            edges: successTree.edges,
            rootId: root.id,
            currentNodeId: currentNode.id,
            operation: `"${searchWord}" FOUND`,
          } satisfies TreeStepData,
        });
      } else {
        // All characters found but not end of word
        const partialHighlight = new Set(pathIds);
        const partialTree = trieToTreeData(root, partialHighlight, "swapping", collectEndNodes(root));
        steps.push({
          id: stepId++,
          description: `Search "${searchWord}": All characters found but node is NOT marked as end-of-word. "${searchWord}" is only a prefix, NOT a complete word`,
          action: "highlight",
          highlights: [],
          data: {
            nodes: partialTree.nodes,
            edges: partialTree.edges,
            rootId: root.id,
            currentNodeId: currentNode.id,
            operation: `"${searchWord}" is prefix only`,
          } satisfies TreeStepData,
        });
      }
    } else if (!found) {
      const resultTree = trieToTreeData(root, new Set(), "active", collectEndNodes(root));
      steps.push({
        id: stepId++,
        description: `Search "${searchWord}": Result = NOT FOUND. The trie does not contain "${searchWord}"`,
        action: "highlight",
        highlights: [],
        data: {
          nodes: resultTree.nodes,
          edges: resultTree.edges,
          rootId: root.id,
          currentNodeId: null,
          operation: `"${searchWord}" NOT FOUND`,
        } satisfies TreeStepData,
      });
    }
  }

  // Final state
  const finalTree = trieToTreeData(root, new Set(), "active", collectEndNodes(root));
  steps.push({
    id: stepId++,
    description: `Trie visualization complete! Stored words: ${wordsToInsert.map((w) => `"${w}"`).join(", ")}. The trie efficiently shares the common prefix "ca" among all words. Edge labels show the character for each transition.`,
    action: "complete",
    highlights: [],
    data: {
      nodes: finalTree.nodes,
      edges: finalTree.edges,
      rootId: root.id,
      currentNodeId: null,
      operation: "done",
    } satisfies TreeStepData,
  });

  return steps;
}
