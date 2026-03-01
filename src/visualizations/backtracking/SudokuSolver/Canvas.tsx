"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep, BacktrackingStepData, HighlightColor } from "@/lib/visualization/types";

interface SudokuCanvasProps {
  step: VisualizationStep;
}

const CELL_SIZE = 44;

const COLOR_MAP: Record<string, string> = {
  default: "transparent",
  active: VIZ_COLORS.active,
  comparing: VIZ_COLORS.comparing,
  swapping: VIZ_COLORS.swapping,
  completed: VIZ_COLORS.completed,
  selected: VIZ_COLORS.highlighted,
  path: "#a78bfa",
  "mst-edge": VIZ_COLORS.mstEdge,
  relaxed: VIZ_COLORS.relaxed,
  backtracked: VIZ_COLORS.backtracked,
  window: VIZ_COLORS.window,
};

// The given cells from the default puzzle (hardcoded set for bold rendering)
function isGivenCell(grid: (number | string | null)[][], row: number, col: number, givenSet: Set<string>): boolean {
  return givenSet.has(`${row}-${col}`);
}

export function SudokuCanvas({ step }: SudokuCanvasProps) {
  const data = step.data as BacktrackingStepData;
  const { grid, cellHighlights, currentCell, solutionFound } = data;

  // Determine given cells (non-null in the first step)
  // We track given cells by checking if a cell was present from the start
  // For simplicity, use the initial puzzle detection: given cells never have highlights
  const givenSet = new Set<string>();
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const key = `${i}-${j}`;
      if (grid[i][j] !== null && !cellHighlights[key]) {
        givenSet.add(key);
      }
    }
  }

  const totalSize = 9 * CELL_SIZE;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="overflow-x-auto">
        <div className="inline-block relative" style={{ width: totalSize + 4, height: totalSize + 4 }}>
          {/* 3x3 sub-grid borders */}
          <svg
            className="absolute inset-0 pointer-events-none z-10"
            width={totalSize + 4}
            height={totalSize + 4}
          >
            {/* Outer border */}
            <rect
              x={1}
              y={1}
              width={totalSize + 2}
              height={totalSize + 2}
              fill="none"
              stroke="#6366f1"
              strokeWidth={3}
              rx={2}
            />
            {/* Vertical thick lines */}
            <line x1={3 * CELL_SIZE + 2} y1={1} x2={3 * CELL_SIZE + 2} y2={totalSize + 3} stroke="#6366f1" strokeWidth={2} />
            <line x1={6 * CELL_SIZE + 2} y1={1} x2={6 * CELL_SIZE + 2} y2={totalSize + 3} stroke="#6366f1" strokeWidth={2} />
            {/* Horizontal thick lines */}
            <line x1={1} y1={3 * CELL_SIZE + 2} x2={totalSize + 3} y2={3 * CELL_SIZE + 2} stroke="#6366f1" strokeWidth={2} />
            <line x1={1} y1={6 * CELL_SIZE + 2} x2={totalSize + 3} y2={6 * CELL_SIZE + 2} stroke="#6366f1" strokeWidth={2} />
          </svg>

          {/* Grid cells */}
          <table className="border-collapse" style={{ marginLeft: 2, marginTop: 2 }}>
            <tbody>
              {grid.map((row, ri) => (
                <tr key={ri}>
                  {row.map((value, ci) => {
                    const key = `${ri}-${ci}`;
                    const highlight = cellHighlights[key];
                    const isCurrent =
                      currentCell &&
                      currentCell[0] === ri &&
                      currentCell[1] === ci;
                    const isGiven = givenSet.has(key);

                    let bgColor: string;
                    if (isCurrent) {
                      bgColor = VIZ_COLORS.active;
                    } else if (highlight) {
                      bgColor = COLOR_MAP[highlight];
                    } else {
                      bgColor = "#1e293b";
                    }

                    return (
                      <td key={ci} className="p-0">
                        <motion.div
                          className="flex items-center justify-center border border-border/20"
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            minWidth: CELL_SIZE,
                          }}
                          initial={false}
                          animate={{
                            backgroundColor: bgColor,
                            scale: isCurrent ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.15 }}
                        >
                          {value !== null && (
                            <span
                              className={`font-mono text-base ${
                                isCurrent
                                  ? "text-white font-bold"
                                  : isGiven
                                    ? "text-slate-200 font-bold"
                                    : highlight === "completed"
                                      ? "text-emerald-300 font-medium"
                                      : highlight === "backtracked"
                                        ? "text-red-300"
                                        : "text-cyan-300 font-medium"
                              }`}
                            >
                              {String(value)}
                            </span>
                          )}
                        </motion.div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-200">5</span>
          <span>Given</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-emerald-300">3</span>
          <span>Solved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: VIZ_COLORS.active }} />
          <span>Trying</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: VIZ_COLORS.backtracked }} />
          <span>Backtrack</span>
        </div>
        {solutionFound && (
          <span className="text-emerald-400 font-semibold">Solved!</span>
        )}
      </div>
    </div>
  );
}
