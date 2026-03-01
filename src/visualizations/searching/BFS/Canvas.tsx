"use client";

import type { VisualizationStep, GraphStepData } from "@/lib/visualization/types";
import { GraphCanvas } from "@/visualizations/_shared/GraphCanvas";

interface BFSCanvasProps {
  step: VisualizationStep;
}

export function BFSCanvas({ step }: BFSCanvasProps) {
  const data = step.data as GraphStepData;

  return (
    <GraphCanvas
      nodes={data.nodes}
      edges={data.edges}
      nodeStates={data.nodeStates}
      currentNode={data.currentNode}
      dataStructure={data.dataStructure}
      visitOrder={data.visitOrder}
    />
  );
}
