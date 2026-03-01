"use client";

import type { VisualizationStep, ScatterStepData } from "@/lib/visualization/types";
import { ScatterCanvas } from "@/visualizations/_shared/ScatterCanvas";

interface DBSCANCanvasProps {
  step: VisualizationStep;
}

export function DBSCANCanvas({ step }: DBSCANCanvasProps) {
  const data = step.data as ScatterStepData;

  return (
    <ScatterCanvas
      points={data.points}
      centroids={data.centroids}
      boundaries={data.boundaries}
      xLabel={data.xLabel}
      yLabel={data.yLabel}
      xRange={data.xRange}
      yRange={data.yRange}
      className="w-full"
    />
  );
}
