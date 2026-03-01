"use client";

import type { VisualizationStep, FunctionPlotStepData } from "@/lib/visualization/types";
import { FunctionPlotCanvas } from "@/visualizations/_shared/FunctionPlotCanvas";

interface BiasVarianceCanvasProps {
  step: VisualizationStep;
}

export function BiasVarianceCanvas({ step }: BiasVarianceCanvasProps) {
  const data = step.data as FunctionPlotStepData;

  return (
    <FunctionPlotCanvas
      functions={data.functions}
      currentX={data.currentX}
      xLabel={data.xLabel}
      yLabel={data.yLabel}
      xRange={data.xRange}
      yRange={data.yRange}
      annotations={data.annotations}
      className="w-full"
    />
  );
}
