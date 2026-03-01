"use client";

import type { VisualizationStep, MatrixStepData } from "@/lib/visualization/types";
import { MatrixCanvas } from "@/visualizations/_shared/MatrixCanvas";

interface FibonacciCanvasProps {
  step: VisualizationStep;
}

export function FibonacciCanvas({ step }: FibonacciCanvasProps) {
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

      {/* Base cases legend */}
      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <span>dp[0] = 0</span>
        <span>dp[1] = 1</span>
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

      {/* Row label */}
      <div className="text-xs text-muted-foreground font-mono">
        Index (i) shown in column headers &mdash; values are Fibonacci numbers
      </div>
    </div>
  );
}
