"use client";

import type { VisualizationStep, WeightedGraphStepData } from "@/lib/visualization/types";
import { WeightedGraphCanvas } from "@/visualizations/_shared/WeightedGraphCanvas";

interface PrimCanvasProps {
  step: VisualizationStep;
}

export function PrimCanvas({ step }: PrimCanvasProps) {
  const data = step.data as WeightedGraphStepData;

  return (
    <WeightedGraphCanvas
      nodes={data.nodes}
      edges={data.edges}
      nodeStates={data.nodeStates}
      currentNode={data.currentNode}
      distances={data.distances}
      visitOrder={data.visitOrder}
      mstEdges={data.mstEdges}
      totalWeight={data.totalWeight}
      showDistanceTable={true}
      priorityQueue={data.priorityQueue}
    />
  );
}
