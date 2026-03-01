"use client";

import type { VisualizationStep, TreeStepData } from "@/lib/visualization/types";
import { TreeCanvas } from "@/visualizations/_shared/TreeCanvas";

interface RecursionCanvasProps {
  step: VisualizationStep;
}

export function RecursionCanvas({ step }: RecursionCanvasProps) {
  const data = step.data as TreeStepData;

  return (
    <TreeCanvas
      nodes={data.nodes}
      edges={data.edges}
      currentNodeId={data.currentNodeId}
      rootId={data.rootId}
      showValues
    />
  );
}
