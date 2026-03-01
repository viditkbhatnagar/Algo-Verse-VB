"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { HighlightColor } from "@/lib/visualization/types";

interface GridCanvasProps {
  grid: (number | string | null)[][];
  cellHighlights: Record<string, HighlightColor>;
  currentCell?: [number, number];
  showRowColLabels?: boolean;
  cellRenderer?: (value: number | string | null, row: number, col: number) => React.ReactNode;
  isChessboard?: boolean;
  className?: string;
}

const COLOR_MAP: Record<HighlightColor | "default", string> = {
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

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function GridCanvas({
  grid,
  cellHighlights,
  currentCell,
  showRowColLabels = false,
  cellRenderer,
  isChessboard = false,
  className,
}: GridCanvasProps) {
  if (grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;
  const cellSize = Math.min(52, Math.max(32, 400 / Math.max(rows, cols)));

  return (
    <div className={`overflow-x-auto ${className ?? ""}`}>
      <div className="inline-block">
        <table className="border-collapse">
          {showRowColLabels && (
            <thead>
              <tr>
                <th style={{ width: 24, height: cellSize }} />
                {Array.from({ length: cols }, (_, ci) => (
                  <th
                    key={ci}
                    className="text-center font-mono text-xs text-muted-foreground p-0"
                    style={{ width: cellSize, height: 20 }}
                  >
                    {ci}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {grid.map((row, ri) => (
              <tr key={ri}>
                {showRowColLabels && (
                  <td
                    className="text-right font-mono text-xs text-muted-foreground pr-1 p-0"
                    style={{ width: 24, height: cellSize }}
                  >
                    {ri}
                  </td>
                )}
                {row.map((value, ci) => {
                  const key = cellKey(ri, ci);
                  const highlight = cellHighlights[key];
                  const isCurrent =
                    currentCell && currentCell[0] === ri && currentCell[1] === ci;

                  let bgColor: string;
                  if (isCurrent) {
                    bgColor = VIZ_COLORS.active;
                  } else if (highlight) {
                    bgColor = COLOR_MAP[highlight];
                  } else if (isChessboard) {
                    bgColor = (ri + ci) % 2 === 0 ? "#1e293b" : "#334155";
                  } else {
                    bgColor = "#1e293b";
                  }

                  return (
                    <td key={ci} className="p-0">
                      <motion.div
                        className="flex items-center justify-center border border-border/20"
                        style={{
                          width: cellSize,
                          height: cellSize,
                          minWidth: cellSize,
                        }}
                        initial={false}
                        animate={{
                          backgroundColor: bgColor,
                          scale: isCurrent ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.15 }}
                      >
                        {cellRenderer ? (
                          cellRenderer(value, ri, ci)
                        ) : (
                          <span
                            className={`font-mono text-sm ${
                              isCurrent
                                ? "text-white font-bold"
                                : value !== null
                                  ? "text-foreground"
                                  : ""
                            }`}
                          >
                            {value !== null ? String(value) : ""}
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
  );
}
