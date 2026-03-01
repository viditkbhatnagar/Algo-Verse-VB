"use client";

import type { VisualizationStep, ScatterStepData } from "@/lib/visualization/types";
import { ScatterCanvas } from "@/visualizations/_shared/ScatterCanvas";

interface SVMCanvasProps {
  step: VisualizationStep;
}

export function SVMCanvas({ step }: SVMCanvasProps) {
  const data = step.data as ScatterStepData;

  return (
    <ScatterCanvas
      points={data.points}
      boundaries={data.boundaries}
      supportVectors={data.supportVectors}
      queryPoint={data.queryPoint}
      xLabel={data.xLabel}
      yLabel={data.yLabel}
      xRange={data.xRange}
      yRange={data.yRange}
      className="w-full"
    />
  );
}
