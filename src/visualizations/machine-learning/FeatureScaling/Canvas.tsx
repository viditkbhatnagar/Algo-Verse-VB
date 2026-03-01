"use client";

import type { VisualizationStep, ScatterStepData } from "@/lib/visualization/types";
import { ScatterCanvas } from "@/visualizations/_shared/ScatterCanvas";

interface FeatureScalingCanvasProps {
  step: VisualizationStep;
}

export function FeatureScalingCanvas({ step }: FeatureScalingCanvasProps) {
  const data = step.data as ScatterStepData;

  return (
    <ScatterCanvas
      points={data.points}
      xLabel={data.xLabel}
      yLabel={data.yLabel}
      xRange={data.xRange}
      yRange={data.yRange}
      className="w-full"
    />
  );
}
