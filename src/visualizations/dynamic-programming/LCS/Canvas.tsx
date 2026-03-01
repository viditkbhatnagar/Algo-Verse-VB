"use client";

import type { VisualizationStep, MatrixStepData } from "@/lib/visualization/types";
import { MatrixCanvas } from "@/visualizations/_shared/MatrixCanvas";

interface LCSCanvasProps {
  step: VisualizationStep;
  str1: string;
  str2: string;
}

export function LCSCanvas({ step, str1, str2 }: LCSCanvasProps) {
  const data = step.data as MatrixStepData;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Formula display */}
      <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-surface border border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Match:</span>
          <code className="text-sm font-mono text-green-400 font-semibold">
            dp[i][j] = dp[i-1][j-1] + 1
          </code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">No match:</span>
          <code className="text-sm font-mono text-yellow-400 font-semibold">
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
          </code>
        </div>
      </div>

      {/* Input strings */}
      <div className="flex items-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">str1 (rows):</span>
          <span className="text-primary font-bold tracking-wider">{str1}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">str2 (cols):</span>
          <span className="text-accent font-bold tracking-wider">{str2}</span>
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
        <span>Diagonal arrow = character match (included in LCS)</span>
        <span>Up/Left arrow = no match (skip character)</span>
      </div>
    </div>
  );
}
