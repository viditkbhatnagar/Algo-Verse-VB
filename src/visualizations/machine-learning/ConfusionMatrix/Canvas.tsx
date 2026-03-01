"use client";

import type { VisualizationStep, HeatmapStepData } from "@/lib/visualization/types";
import { HeatmapCanvas } from "@/visualizations/_shared/HeatmapCanvas";

interface ConfusionMatrixCanvasProps {
  step: VisualizationStep;
}

export function ConfusionMatrixCanvas({ step }: ConfusionMatrixCanvasProps) {
  const data = step.data as HeatmapStepData;

  return (
    <HeatmapCanvas
      cells={data.cells}
      rows={data.rows}
      cols={data.cols}
      rowLabels={data.rowLabels}
      colLabels={data.colLabels}
      colorScale={data.colorScale}
      currentCell={data.currentCell}
      title={data.title}
      showValues={true}
      className="w-full"
    />
  );
}
