"use client";

import type { VisualizationStep } from "@/lib/visualization/types";
import { GridCanvas } from "@/visualizations/_shared/GridCanvas";
import type { UniquePathsStepData } from "./logic";

interface UniquePathsCanvasProps {
  step: VisualizationStep;
}

export function UniquePathsCanvas({ step }: UniquePathsCanvasProps) {
  const data = step.data as UniquePathsStepData;

  return (
    <div className="flex items-center justify-center p-4">
      <GridCanvas
        grid={data.grid}
        cellHighlights={data.cellHighlights}
        currentCell={data.currentCell}
        showRowColLabels
      />
    </div>
  );
}
