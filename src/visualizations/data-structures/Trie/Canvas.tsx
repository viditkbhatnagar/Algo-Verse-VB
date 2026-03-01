"use client";

import type { VisualizationStep, TreeStepData } from "@/lib/visualization/types";
import { TreeCanvas } from "@/visualizations/_shared/TreeCanvas";

interface TrieCanvasProps {
  step: VisualizationStep;
}

export function TrieCanvas({ step }: TrieCanvasProps) {
  const data = step.data as TreeStepData;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2">
        <span className="text-xs font-mono text-muted-foreground">
          Operation: <span className="text-primary">{data.operation}</span>
        </span>
        <span className="text-xs text-muted-foreground/60 ml-auto">
          * = end-of-word &middot; edge labels = characters
        </span>
      </div>
      <TreeCanvas
        nodes={data.nodes}
        edges={data.edges}
        currentNodeId={data.currentNodeId}
        rootId={data.rootId}
        showValues
        edgeLabels
        className="min-h-[300px]"
      />
    </div>
  );
}
