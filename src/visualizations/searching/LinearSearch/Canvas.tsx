"use client";

import type { VisualizationStep, SearchStepData } from "@/lib/visualization/types";
import { ArrayCanvas } from "@/visualizations/_shared/ArrayCanvas";

interface LinearSearchCanvasProps {
  step: VisualizationStep;
}

export function LinearSearchCanvas({ step }: LinearSearchCanvasProps) {
  const data = step.data as SearchStepData;

  return (
    <ArrayCanvas
      data={data.array}
      currentIndex={data.currentIndex}
      target={data.target}
      checked={data.checked}
      found={data.found}
      foundIndex={data.found ? data.currentIndex : undefined}
    />
  );
}
