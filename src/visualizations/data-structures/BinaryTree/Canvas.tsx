"use client";

import type { VisualizationStep, TreeStepData } from "@/lib/visualization/types";
import { TreeCanvas } from "@/visualizations/_shared/TreeCanvas";

interface BinaryTreeCanvasProps {
  step: VisualizationStep;
}

export function BinaryTreeCanvas({ step }: BinaryTreeCanvasProps) {
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
