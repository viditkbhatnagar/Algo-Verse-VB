"use client";

import type { VisualizationStep, WeightedGraphStepData } from "@/lib/visualization/types";
import { WeightedGraphCanvas } from "@/visualizations/_shared/WeightedGraphCanvas";

interface KruskalCanvasProps {
  step: VisualizationStep;
}

export function KruskalCanvas({ step }: KruskalCanvasProps) {
  const data = step.data as WeightedGraphStepData;

  return (
    <WeightedGraphCanvas
      nodes={data.nodes}
      edges={data.edges}
      nodeStates={data.nodeStates}
      currentNode={data.currentNode}
      visitOrder={data.visitOrder}
      mstEdges={data.mstEdges}
      totalWeight={data.totalWeight}
      showDistanceTable={false}
    />
  );
}
