"use client";

import type { VisualizationStep, MatrixStepData } from "@/lib/visualization/types";
import { MatrixCanvas } from "@/visualizations/_shared/MatrixCanvas";

interface ClimbingStairsCanvasProps {
  step: VisualizationStep;
}

export function ClimbingStairsCanvas({ step }: ClimbingStairsCanvasProps) {
  const data = step.data as MatrixStepData;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Formula display */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border/50">
        <span className="text-xs text-muted-foreground font-mono">Recurrence:</span>
        <code className="text-sm font-mono text-primary font-semibold">
          dp[i] = dp[i-1] + dp[i-2]
        </code>
      </div>

      {/* Explanation */}
      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <span>dp[0] = 1 (ground)</span>
        <span>dp[1] = 1 (one step)</span>
        <span className="text-primary">Take 1 or 2 steps at a time</span>
      </div>

      {/* DP Table */}
      <MatrixCanvas
        matrix={data.matrix}
        cellHighlights={data.cellHighlights}
        colHeaders={data.colHeaders}
        currentCell={data.currentCell}
        arrows={data.arrows}
        showZeros
        className="mx-auto"
      />

      {/* Label */}
      <div className="text-xs text-muted-foreground font-mono">
        Step number (i) in column headers &mdash; values are number of distinct ways to reach step i
      </div>
    </div>
  );
}
