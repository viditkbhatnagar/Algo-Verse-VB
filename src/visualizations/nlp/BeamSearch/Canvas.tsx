"use client";

import type { VisualizationStep, TreeStepData } from "@/lib/visualization/types";
import { TreeCanvas } from "@/visualizations/_shared/TreeCanvas";

interface BeamSearchCanvasProps {
  step: VisualizationStep;
}

export function BeamSearchCanvas({ step }: BeamSearchCanvasProps) {
  const data = step.data as TreeStepData;

  return (
    <TreeCanvas
      nodes={data.nodes}
      edges={data.edges}
      rootId={data.rootId}
      currentNodeId={data.currentNodeId}
      edgeLabels
    />
  );
}
