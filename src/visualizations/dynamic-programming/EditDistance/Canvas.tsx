"use client";

import type { VisualizationStep, MatrixStepData } from "@/lib/visualization/types";
import { MatrixCanvas } from "@/visualizations/_shared/MatrixCanvas";

interface EditDistanceCanvasProps {
  step: VisualizationStep;
}

export function EditDistanceCanvas({ step }: EditDistanceCanvasProps) {
  const data = step.data as MatrixStepData;

  return (
    <div className="flex items-center justify-center p-4">
      <MatrixCanvas
        matrix={data.matrix}
        cellHighlights={data.cellHighlights}
        rowHeaders={data.rowHeaders}
        colHeaders={data.colHeaders}
        currentCell={data.currentCell}
        arrows={data.arrows}
        optimalPath={data.optimalPath}
      />
    </div>
  );
}
