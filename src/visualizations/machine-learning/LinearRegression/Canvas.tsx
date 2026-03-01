"use client";

import type { VisualizationStep, ScatterStepData } from "@/lib/visualization/types";
import { ScatterCanvas } from "@/visualizations/_shared/ScatterCanvas";

interface LinearRegressionCanvasProps {
  step: VisualizationStep;
}

export function LinearRegressionCanvas({ step }: LinearRegressionCanvasProps) {
  const data = step.data as ScatterStepData;

  return (
    <ScatterCanvas
      points={data.points}
      regressionLine={data.regressionLine}
      queryPoint={data.queryPoint}
      xLabel={data.xLabel}
      yLabel={data.yLabel}
      xRange={data.xRange}
      yRange={data.yRange}
      className="w-full"
    />
  );
}
