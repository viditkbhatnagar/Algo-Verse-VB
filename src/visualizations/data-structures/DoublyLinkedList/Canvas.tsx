"use client";

import type { VisualizationStep, LinkedListStepData } from "@/lib/visualization/types";
import { LinkedListCanvas } from "@/visualizations/_shared/LinkedListCanvas";

interface DoublyLinkedListCanvasProps {
  step: VisualizationStep;
}

export function DoublyLinkedListCanvas({ step }: DoublyLinkedListCanvasProps) {
  const data = step.data as LinkedListStepData;

  return (
    <LinkedListCanvas
      nodes={data.nodes}
      headId={data.headId}
      tailId={data.tailId}
      currentId={data.currentId}
      pointers={data.pointers}
      showPrev={true}
    />
  );
}
