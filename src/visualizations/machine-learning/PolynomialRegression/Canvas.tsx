"use client";

import type { VisualizationStep, ScatterStepData } from "@/lib/visualization/types";
import { ScatterCanvas } from "@/visualizations/_shared/ScatterCanvas";

interface PolynomialRegressionCanvasProps {
  step: VisualizationStep;
}

export function PolynomialRegressionCanvas({ step }: PolynomialRegressionCanvasProps) {
  const data = step.data as ScatterStepData;

  return (
    <ScatterCanvas
      points={data.points}
      boundaries={data.boundaries}
      queryPoint={data.queryPoint}
      xLabel={data.xLabel}
      yLabel={data.yLabel}
      xRange={data.xRange}
      yRange={data.yRange}
      className="w-full"
    />
  );
}
