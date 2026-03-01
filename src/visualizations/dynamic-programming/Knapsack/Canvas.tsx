"use client";

import type { VisualizationStep, MatrixStepData } from "@/lib/visualization/types";
import { MatrixCanvas } from "@/visualizations/_shared/MatrixCanvas";

interface KnapsackCanvasProps {
  step: VisualizationStep;
}

export function KnapsackCanvas({ step }: KnapsackCanvasProps) {
  const data = step.data as MatrixStepData;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Formula display */}
      <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-surface border border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Recurrence:</span>
          <code className="text-sm font-mono text-primary font-semibold">
            dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt] + val)
          </code>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          Exclude item i vs. include item i (if it fits)
        </div>
      </div>

      {/* DP Table */}
      <MatrixCanvas
        matrix={data.matrix}
        cellHighlights={data.cellHighlights}
        rowHeaders={data.rowHeaders}
        colHeaders={data.colHeaders}
        currentCell={data.currentCell}
        arrows={data.arrows}
        optimalPath={data.optimalPath}
        showZeros
        className="mx-auto"
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
        <span>Rows = items (cumulative)</span>
        <span>Columns = knapsack capacity</span>
        <span>Values = maximum achievable value</span>
      </div>
    </div>
  );
}
