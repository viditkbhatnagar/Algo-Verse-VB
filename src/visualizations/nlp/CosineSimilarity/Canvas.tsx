"use client";

import type { VisualizationStep, ScatterStepData } from "@/lib/visualization/types";
import { ScatterCanvas } from "@/visualizations/_shared/ScatterCanvas";

interface CosineSimilarityCanvasProps {
  step: VisualizationStep;
}

export function CosineSimilarityCanvas({ step }: CosineSimilarityCanvasProps) {
  const data = step.data as ScatterStepData;

  return (
    <ScatterCanvas
      points={data.points}
      boundaries={data.boundaries}
      xLabel={data.xLabel}
      yLabel={data.yLabel}
      xRange={data.xRange}
      yRange={data.yRange}
    />
  );
}
