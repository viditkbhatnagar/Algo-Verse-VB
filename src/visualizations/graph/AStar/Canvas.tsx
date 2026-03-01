"use client";

import type { VisualizationStep } from "@/lib/visualization/types";
import { GridCanvas } from "@/visualizations/_shared/GridCanvas";
import type { AStarStepData } from "./logic";

interface AStarCanvasProps {
  step: VisualizationStep;
}

export function AStarCanvas({ step }: AStarCanvasProps) {
  const data = step.data as AStarStepData;

  const cellRenderer = (
    value: number | string | null,
    row: number,
    col: number,
  ) => {
    if (value === "X") {
      return (
        <span className="font-mono text-xs text-red-300 font-bold">X</span>
      );
    }

    // Show S for start, G for goal
    const isStart = row === data.start[0] && col === data.start[1];
    const isGoal = row === data.goal[0] && col === data.goal[1];

    if (isStart) {
      return (
        <span className="font-mono text-xs text-white font-bold">S</span>
      );
    }
    if (isGoal) {
      return (
        <span className="font-mono text-xs text-white font-bold">G</span>
      );
    }

    if (value !== null && value !== undefined) {
      return (
        <span className="font-mono text-[10px] text-foreground/80">
          {value}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <GridCanvas
          grid={data.grid}
          cellHighlights={data.cellHighlights}
          currentCell={data.currentCell}
          cellRenderer={cellRenderer}
          showRowColLabels
        />
      </div>

      {/* Side panel with stats */}
      <div className="w-32 shrink-0 space-y-3 text-xs font-mono">
        <div>
          <p className="text-muted-foreground text-center font-bold uppercase mb-1">
            Open Set
          </p>
          <p className="text-center text-comparing">
            {data.openSet.length} nodes
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-center font-bold uppercase mb-1">
            Closed Set
          </p>
          <p className="text-center text-completed">
            {data.closedSet.length} nodes
          </p>
        </div>

        {data.path.length > 0 && (
          <div>
            <p className="text-muted-foreground text-center font-bold uppercase mb-1">
              Path
            </p>
            <p className="text-center text-primary">
              {data.path.length} cells
            </p>
          </div>
        )}

        <div className="mt-2 space-y-1">
          <p className="text-muted-foreground text-center font-bold uppercase mb-1">
            Legend
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#6366f1]" />
            <span className="text-muted-foreground">Start</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#22d3ee]" />
            <span className="text-muted-foreground">Goal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#f59e0b]" />
            <span className="text-muted-foreground">Open</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#22c55e]" />
            <span className="text-muted-foreground">Closed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#a78bfa]" />
            <span className="text-muted-foreground">Path</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#ef4444]" />
            <span className="text-muted-foreground">Obstacle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
