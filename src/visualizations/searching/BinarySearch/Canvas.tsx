"use client";

import type { VisualizationStep, SearchStepData } from "@/lib/visualization/types";
import { ArrayCanvas } from "@/visualizations/_shared/ArrayCanvas";

interface BinarySearchCanvasProps {
  step: VisualizationStep;
}

export function BinarySearchCanvas({ step }: BinarySearchCanvasProps) {
  const data = step.data as SearchStepData;

  const pointers = new Map<string, number>();
  if (data.low !== undefined && data.low >= 0) pointers.set("low", data.low);
  if (data.mid !== undefined && data.mid >= 0) pointers.set("mid", data.mid);
  if (data.high !== undefined && data.high >= 0) pointers.set("high", data.high);

  return (
    <ArrayCanvas
      data={data.array}
      currentIndex={data.currentIndex}
      target={data.target}
      checked={data.checked}
      eliminated={data.eliminated}
      found={data.found}
      foundIndex={data.found ? data.currentIndex : undefined}
      pointers={pointers}
    />
  );
}
