"use client";

import type { VisualizationStep, FunctionPlotStepData } from "@/lib/visualization/types";
import { FunctionPlotCanvas } from "@/visualizations/_shared/FunctionPlotCanvas";

interface AdamOptimizerCanvasProps {
  step: VisualizationStep;
}

export function AdamOptimizerCanvas({ step }: AdamOptimizerCanvasProps) {
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
      gradientArrow={data.gradientArrow}
      className="w-full"
    />
  );
}
