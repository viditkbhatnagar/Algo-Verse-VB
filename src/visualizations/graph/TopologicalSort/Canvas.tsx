"use client";

import type { VisualizationStep, WeightedGraphStepData } from "@/lib/visualization/types";
import { WeightedGraphCanvas } from "@/visualizations/_shared/WeightedGraphCanvas";

interface TopologicalSortCanvasProps {
  step: VisualizationStep;
}

export function TopologicalSortCanvas({ step }: TopologicalSortCanvasProps) {
  const data = step.data as WeightedGraphStepData;

  return (
    <WeightedGraphCanvas
      nodes={data.nodes}
      edges={data.edges}
      nodeStates={data.nodeStates}
      currentNode={data.currentNode}
      distances={data.distances}
      visitOrder={data.visitOrder}
      showDistanceTable={true}
      priorityQueue={data.priorityQueue}
    />
  );
}
