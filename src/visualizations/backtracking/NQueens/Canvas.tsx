"use client";

import type { VisualizationStep, BacktrackingStepData, HighlightColor } from "@/lib/visualization/types";
import { GridCanvas } from "@/visualizations/_shared/GridCanvas";
import { VIZ_COLORS } from "@/lib/constants";

interface NQueensCanvasProps {
  step: VisualizationStep;
}

const QUEEN_COLORS: Record<string, string> = {
  completed: VIZ_COLORS.completed,
  active: VIZ_COLORS.active,
  backtracked: VIZ_COLORS.backtracked,
};

export function NQueensCanvas({ step }: NQueensCanvasProps) {
  const data = step.data as BacktrackingStepData;
  const { grid, cellHighlights, isBacktracking, solutionFound } = data;

  return (
    <div className="flex flex-col items-center gap-4">
      <GridCanvas
        grid={grid}
        cellHighlights={cellHighlights}
        currentCell={data.currentCell}
        isChessboard={true}
        showRowColLabels={true}
        cellRenderer={(value, row, col) => {
          const key = `${row}-${col}`;
          const highlight = cellHighlights[key];

          if (value === 1) {
            // Queen
            return (
              <span
                className="text-lg"
                style={{
                  color:
                    highlight && QUEEN_COLORS[highlight]
                      ? QUEEN_COLORS[highlight]
                      : "#fff",
                  textShadow: "0 0 6px rgba(99,102,241,0.5)",
                }}
              >
                {"\u265B"}
              </span>
            );
          }

          // Show attack markers
          if (highlight === "window") {
            return (
              <span className="text-[10px] text-red-400 opacity-40">
                x
              </span>
            );
          }

          if (highlight === "swapping") {
            return (
              <span className="text-sm text-red-400 font-bold">
                {"\u2715"}
              </span>
            );
          }

          return null;
        }}
      />

      {/* Legend */}
      <div className="flex gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{"\u265B"}</span>
          <span>Queen</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm opacity-40" style={{ backgroundColor: VIZ_COLORS.window }} />
          <span>Attacked</span>
        </div>
        {isBacktracking && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: VIZ_COLORS.backtracked }} />
            <span>Backtracking</span>
          </div>
        )}
        {solutionFound && (
          <span className="text-emerald-400 font-semibold">Solution Found!</span>
        )}
      </div>
    </div>
  );
}
