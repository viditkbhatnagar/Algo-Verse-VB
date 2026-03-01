"use client";

import type { VisualizationStep, FunctionPlotStepData } from "@/lib/visualization/types";
import { FunctionPlotCanvas } from "@/visualizations/_shared/FunctionPlotCanvas";

interface ActivationFunctionsCanvasProps {
  step: VisualizationStep;
}

export function ActivationFunctionsCanvas({ step }: ActivationFunctionsCanvasProps) {
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
