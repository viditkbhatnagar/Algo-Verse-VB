"use client";

import type { VisualizationStep, ScatterStepData } from "@/lib/visualization/types";
import { ScatterCanvas } from "@/visualizations/_shared/ScatterCanvas";

interface WordEmbeddingsCanvasProps {
  step: VisualizationStep;
}

export function WordEmbeddingsCanvas({ step }: WordEmbeddingsCanvasProps) {
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
