"use client";

import type { VisualizationStep, SortingStepData, HighlightColor } from "@/lib/visualization/types";
import { BarCanvas } from "@/visualizations/_shared/BarCanvas";

interface SelectionSortCanvasProps {
  step: VisualizationStep;
}

export function SelectionSortCanvas({ step }: SelectionSortCanvasProps) {
  const data = step.data as SortingStepData;
  const highlights = new Map<number, HighlightColor>();
  const labels = new Map<number, string>();

  for (const h of data.highlights ?? []) {
    for (const idx of h.indices) {
      highlights.set(idx, h.color);
      if (h.label) labels.set(idx, h.label);
    }
  }

  return <BarCanvas data={data.array} highlights={highlights} labels={labels} showValues />;
}
