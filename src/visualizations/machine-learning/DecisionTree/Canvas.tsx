"use client";

import type { VisualizationStep, TreeStepData } from "@/lib/visualization/types";
import { TreeCanvas } from "@/visualizations/_shared/TreeCanvas";

interface DecisionTreeCanvasProps {
  step: VisualizationStep;
}

export function DecisionTreeCanvas({ step }: DecisionTreeCanvasProps) {
  const data = step.data as TreeStepData;

  return (
    <TreeCanvas
      nodes={data.nodes}
      edges={data.edges}
      rootId={data.rootId}
      currentNodeId={data.currentNodeId}
      showValues={true}
      edgeLabels={true}
      className="w-full"
    />
  );
}
