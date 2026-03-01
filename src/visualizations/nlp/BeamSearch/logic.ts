import type { VisualizationStep, TreeStepData, TreeNodeData, TreeEdgeData } from "@/lib/visualization/types";

export function generateBeamSearchSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const beamWidth = 2;

  // Simulated beam search for text generation
  // Each node: { id, token, logProb, cumProb }
  interface Candidate {
    id: string;
    token: string;
    logProb: number;
    cumLogProb: number;
    parentId: string | null;
    depth: number;
  }

  const allCandidates: Candidate[] = [
    { id: "root", token: "<start>", logProb: 0, cumLogProb: 0, parentId: null, depth: 0 },
    // Depth 1 expansions
    { id: "d1-the", token: "The", logProb: -0.5, cumLogProb: -0.5, parentId: "root", depth: 1 },
    { id: "d1-a", token: "A", logProb: -0.8, cumLogProb: -0.8, parentId: "root", depth: 1 },
    { id: "d1-it", token: "It", logProb: -1.2, cumLogProb: -1.2, parentId: "root", depth: 1 },
    // Depth 2 expansions from "The" (beam 1)
    { id: "d2-the-cat", token: "cat", logProb: -0.4, cumLogProb: -0.9, parentId: "d1-the", depth: 2 },
    { id: "d2-the-dog", token: "dog", logProb: -0.6, cumLogProb: -1.1, parentId: "d1-the", depth: 2 },
    // Depth 2 expansions from "A" (beam 2)
    { id: "d2-a-small", token: "small", logProb: -0.3, cumLogProb: -1.1, parentId: "d1-a", depth: 2 },
    { id: "d2-a-big", token: "big", logProb: -0.7, cumLogProb: -1.5, parentId: "d1-a", depth: 2 },
    // Depth 3 expansions from "cat" (beam 1)
    { id: "d3-sat", token: "sat", logProb: -0.3, cumLogProb: -1.2, parentId: "d2-the-cat", depth: 3 },
    { id: "d3-ate", token: "ate", logProb: -0.5, cumLogProb: -1.4, parentId: "d2-the-cat", depth: 3 },
    // Depth 3 from "dog" or "small"
    { id: "d3-ran", token: "ran", logProb: -0.4, cumLogProb: -1.5, parentId: "d2-the-dog", depth: 3 },
    { id: "d3-cat2", token: "cat", logProb: -0.3, cumLogProb: -1.4, parentId: "d2-a-small", depth: 3 },
  ];

  function buildTreeData(
    visibleIds: Set<string>,
    keptIds: Set<string>,
    currentIds: Set<string>,
    prunedIds: Set<string>,
  ): TreeStepData {
    const nodes: TreeNodeData[] = [];
    const edges: TreeEdgeData[] = [];

    for (const cand of allCandidates) {
      if (!visibleIds.has(cand.id)) continue;
      const label = `${cand.token} (${cand.cumLogProb.toFixed(1)})`;
      let highlight: TreeNodeData["highlight"];
      if (currentIds.has(cand.id)) highlight = "active";
      else if (prunedIds.has(cand.id)) highlight = "backtracked";
      else if (keptIds.has(cand.id)) highlight = "completed";

      nodes.push({
        id: cand.id,
        value: label,
        children: allCandidates.filter(c => c.parentId === cand.id && visibleIds.has(c.id)).map(c => c.id),
        parent: cand.parentId,
        highlight,
      });

      if (cand.parentId && visibleIds.has(cand.parentId)) {
        edges.push({
          source: cand.parentId,
          target: cand.id,
          highlight: currentIds.has(cand.id) ? "active" : keptIds.has(cand.id) ? "completed" : prunedIds.has(cand.id) ? "backtracked" : undefined,
        });
      }
    }

    return {
      nodes,
      edges,
      rootId: "root",
      currentNodeId: null,
      operation: "beam-search",
    };
  }

  // Step 0: Overview
  steps.push({
    id: stepId++,
    description: `Beam Search explores multiple candidate sequences simultaneously, keeping the top-k (beam width = ${beamWidth}) at each step. Unlike greedy search (k=1), it considers more possibilities without the exponential cost of exhaustive search.`,
    action: "predict",
    highlights: [],
    data: buildTreeData(new Set(["root"]), new Set(), new Set(["root"]), new Set()),
  });

  // Step 1: Expand root
  steps.push({
    id: stepId++,
    description: `Step 1: Expand <start>. Generate top candidates: "The" (log P = -0.5), "A" (log P = -0.8), "It" (log P = -1.2). Keep top ${beamWidth} beams: "The" and "A". Prune "It".`,
    action: "predict",
    highlights: [],
    data: buildTreeData(
      new Set(["root", "d1-the", "d1-a", "d1-it"]),
      new Set(["root", "d1-the", "d1-a"]),
      new Set(["d1-the", "d1-a", "d1-it"]),
      new Set(["d1-it"]),
    ),
  });

  // Step 2: After pruning depth 1
  steps.push({
    id: stepId++,
    description: `Beams after step 1: ["The" (cumP=-0.5), "A" (cumP=-0.8)]. The pruned candidate "It" is discarded. Each surviving beam will be expanded independently in the next step.`,
    action: "predict",
    highlights: [],
    data: buildTreeData(
      new Set(["root", "d1-the", "d1-a"]),
      new Set(["root", "d1-the", "d1-a"]),
      new Set(),
      new Set(),
    ),
  });

  // Step 3: Expand depth 2
  steps.push({
    id: stepId++,
    description: `Step 2: Expand both beams. "The" -> ["cat" (cum=-0.9), "dog" (cum=-1.1)]. "A" -> ["small" (cum=-1.1), "big" (cum=-1.5)]. Keep top ${beamWidth} overall: "The cat" (-0.9) and "The dog" or "A small" (-1.1).`,
    action: "predict",
    highlights: [],
    data: buildTreeData(
      new Set(["root", "d1-the", "d1-a", "d2-the-cat", "d2-the-dog", "d2-a-small", "d2-a-big"]),
      new Set(["root", "d1-the", "d2-the-cat", "d2-the-dog"]),
      new Set(["d2-the-cat", "d2-the-dog", "d2-a-small", "d2-a-big"]),
      new Set(["d2-a-big"]),
    ),
  });

  // Step 4: Expand depth 3
  steps.push({
    id: stepId++,
    description: `Step 3: Expand surviving beams. "The cat" -> ["sat" (cum=-1.2), "ate" (cum=-1.4)]. Select best ${beamWidth} sequences. "The cat sat" (cum=-1.2) is the top candidate. Beam search continues until <end> token or max length.`,
    action: "predict",
    highlights: [],
    data: buildTreeData(
      new Set(["root", "d1-the", "d2-the-cat", "d2-the-dog", "d3-sat", "d3-ate", "d3-ran"]),
      new Set(["root", "d1-the", "d2-the-cat", "d3-sat"]),
      new Set(["d3-sat", "d3-ate", "d3-ran"]),
      new Set(["d3-ate", "d3-ran"]),
    ),
  });

  // Step 5: Summary
  steps.push({
    id: stepId++,
    description: `Beam Search complete! Best sequence: "The cat sat" (cumulative log probability = -1.2). Beam width ${beamWidth} provides a good balance between quality and computation. Used in machine translation (Google Translate), speech recognition, and text generation. Length normalization often applied to avoid bias toward shorter sequences.`,
    action: "complete",
    highlights: [],
    data: buildTreeData(
      new Set(["root", "d1-the", "d2-the-cat", "d3-sat"]),
      new Set(["root", "d1-the", "d2-the-cat", "d3-sat"]),
      new Set(),
      new Set(),
    ),
  });

  return steps;
}
