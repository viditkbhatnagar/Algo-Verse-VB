"use client";

import type { VisualizationStep, TreeStepData } from "@/lib/visualization/types";
import { TreeCanvas } from "@/visualizations/_shared/TreeCanvas";

interface MinHeapCanvasProps {
  step: VisualizationStep;
}

export function MinHeapCanvas({ step }: MinHeapCanvasProps) {
  const data = step.data as TreeStepData;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2">
        <span className="text-xs font-mono text-muted-foreground">
          Operation: <span className="text-primary">{data.operation}</span>
        </span>
      </div>
      <TreeCanvas
        nodes={data.nodes}
        edges={data.edges}
        currentNodeId={data.currentNodeId}
        rootId={data.rootId}
        showValues
        dualView
        arrayData={data.auxiliaryArray}
        arrayHighlights={data.auxiliaryHighlights}
        className="min-h-[280px]"
      />
    </div>
  );
}
