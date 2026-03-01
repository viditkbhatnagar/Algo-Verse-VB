"use client";

import type { VisualizationStep, FunctionPlotStepData } from "@/lib/visualization/types";
import { FunctionPlotCanvas } from "@/visualizations/_shared/FunctionPlotCanvas";

interface LossFunctionsCanvasProps {
  step: VisualizationStep;
}

export function LossFunctionsCanvas({ step }: LossFunctionsCanvasProps) {
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
