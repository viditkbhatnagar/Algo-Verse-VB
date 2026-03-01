"use client";

import type { VisualizationStep } from "@/lib/visualization/types";
import { GridCanvas } from "@/visualizations/_shared/GridCanvas";
import type { SieveStepData } from "./logic";

interface SieveCanvasProps {
  step: VisualizationStep;
}

export function SieveCanvas({ step }: SieveCanvasProps) {
  const data = step.data as SieveStepData;
  const { grid, cellHighlights, primes, phase, currentPrime } = data;

  return (
    <div className="flex flex-col items-center gap-4">
      <GridCanvas
        grid={grid}
        cellHighlights={cellHighlights}
        cellRenderer={(value) => {
          if (value === null) return null;
          const num = typeof value === "string" ? parseInt(value, 10) : (value as number);
          const isPrime = primes.includes(num);
          const isCurrentPrime = num === currentPrime;

          return (
            <span
              className={`font-mono text-xs ${
                isCurrentPrime
                  ? "text-white font-bold"
                  : isPrime
                    ? "text-emerald-300 font-semibold"
                    : cellHighlights[`${Math.floor((num - 2) / Math.ceil(Math.sqrt(data.n - 1)))}-${(num - 2) % Math.ceil(Math.sqrt(data.n - 1))}`]
                      ? "text-red-300 line-through"
                      : "text-foreground"
              }`}
            >
              {num}
            </span>
          );
        }}
      />

      {/* Legend */}
      <div className="flex gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span>Prime</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span>Composite</span>
        </div>
        {currentPrime > 0 && phase !== "done" && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#f59e0b" }} />
            <span>Marking (x{currentPrime})</span>
          </div>
        )}
      </div>

      {/* Primes list */}
      {phase === "done" && (
        <div className="text-center">
          <span className="text-xs text-muted-foreground font-mono">
            Primes ({primes.length}): {primes.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}
