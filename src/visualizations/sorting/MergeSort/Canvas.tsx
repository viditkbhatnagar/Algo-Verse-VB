"use client";

import type { VisualizationStep, SortingStepData, HighlightColor } from "@/lib/visualization/types";
import { BarCanvas } from "@/visualizations/_shared/BarCanvas";

interface MergeSortCanvasProps {
  step: VisualizationStep;
}

export function MergeSortCanvas({ step }: MergeSortCanvasProps) {
  const data = step.data as SortingStepData;
  const highlights = new Map<number, HighlightColor>();

  for (const h of data.highlights ?? []) {
    for (const idx of h.indices) {
      highlights.set(idx, h.color);
    }
  }

  return <BarCanvas data={data.array} highlights={highlights} showValues />;
}
