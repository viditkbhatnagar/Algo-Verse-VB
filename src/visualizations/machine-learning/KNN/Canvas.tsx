"use client";

import type { VisualizationStep, ScatterStepData } from "@/lib/visualization/types";
import { ScatterCanvas } from "@/visualizations/_shared/ScatterCanvas";

interface KNNCanvasProps {
  step: VisualizationStep;
}

export function KNNCanvas({ step }: KNNCanvasProps) {
  const data = step.data as ScatterStepData;

  return (
    <ScatterCanvas
      points={data.points}
      queryPoint={data.queryPoint}
      kNearest={data.kNearest}
      boundaries={data.boundaries}
      xLabel={data.xLabel}
      yLabel={data.yLabel}
      xRange={data.xRange}
      yRange={data.yRange}
      className="w-full"
    />
  );
}
