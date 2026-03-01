"use client";

import type { VisualizationStep, MatrixStepData } from "@/lib/visualization/types";
import { MatrixCanvas } from "@/visualizations/_shared/MatrixCanvas";

interface CoinChangeCanvasProps {
  step: VisualizationStep;
  coins: number[];
}

export function CoinChangeCanvas({ step, coins }: CoinChangeCanvasProps) {
  const data = step.data as MatrixStepData;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Formula display */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border/50">
        <span className="text-xs text-muted-foreground font-mono">Recurrence:</span>
        <code className="text-sm font-mono text-primary font-semibold">
          dp[i] = min(dp[i - coin] + 1) for each coin
        </code>
      </div>

      {/* Coins legend */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-mono">Coins:</span>
        {coins.map((coin) => (
          <span
            key={coin}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary/50 text-xs font-mono font-bold text-primary"
          >
            {coin}
          </span>
        ))}
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
        Amount (i) in column headers &mdash; values are minimum coins needed
      </div>
    </div>
  );
}
