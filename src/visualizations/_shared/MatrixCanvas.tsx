"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { HighlightColor } from "@/lib/visualization/types";

interface MatrixCanvasProps {
  matrix: (number | string | null)[][];
  cellHighlights: Record<string, HighlightColor>;
  rowHeaders?: string[];
  colHeaders?: string[];
  currentCell?: [number, number];
  arrows?: { from: [number, number]; to: [number, number]; label?: string }[];
  optimalPath?: [number, number][];
  showZeros?: boolean;
  className?: string;
}

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

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function MatrixCanvas({
  matrix,
  cellHighlights,
  rowHeaders,
  colHeaders,
  currentCell,
  arrows,
  optimalPath,
  showZeros = true,
  className,
}: MatrixCanvasProps) {
  if (matrix.length === 0) return null;

  const rows = matrix.length;
  const cols = matrix[0].length;
  const cellSize = Math.min(44, Math.max(28, 500 / Math.max(rows, cols)));

  const pathSet = new Set(
    (optimalPath ?? []).map(([r, c]) => cellKey(r, c))
  );

  return (
    <div className={`overflow-x-auto ${className ?? ""}`}>
      <div className="relative inline-block">
        <table className="border-collapse">
          {/* Column headers */}
          {colHeaders && (
            <thead>
              <tr>
                {rowHeaders && <th style={{ width: cellSize, height: cellSize }} />}
                {colHeaders.map((header, ci) => (
                  <th
                    key={ci}
                    className="text-center font-mono text-xs text-muted-foreground p-0"
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {matrix.map((row, ri) => (
              <tr key={ri}>
                {/* Row header */}
                {rowHeaders && (
                  <td
                    className="text-right font-mono text-xs text-muted-foreground pr-2 p-0"
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {rowHeaders[ri] ?? ri}
                  </td>
                )}
                {row.map((value, ci) => {
                  const key = cellKey(ri, ci);
                  const highlight = cellHighlights[key];
                  const isCurrent =
                    currentCell && currentCell[0] === ri && currentCell[1] === ci;
                  const isPath = pathSet.has(key);

                  let bgColor = "#1e293b";
                  if (isCurrent) {
                    bgColor = VIZ_COLORS.active;
                  } else if (highlight) {
                    bgColor = COLOR_MAP[highlight];
                  } else if (isPath) {
                    bgColor = COLOR_MAP.path;
                  }

                  const displayValue =
                    value === null
                      ? ""
                      : !showZeros && value === 0
                        ? ""
                        : String(value);

                  return (
                    <td key={ci} className="p-0">
                      <motion.div
                        className="flex items-center justify-center font-mono text-sm border border-border/30"
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
                        <span
                          className={`${
                            isCurrent
                              ? "text-white font-bold"
                              : value !== null
                                ? "text-foreground"
                                : "text-muted-foreground/30"
                          }`}
                        >
                          {displayValue}
                        </span>
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Arrow overlay */}
        {arrows && arrows.length > 0 && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
            style={{ overflow: "visible" }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="4"
                refX="5"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 6 2, 0 4" fill={VIZ_COLORS.highlighted} />
              </marker>
            </defs>
            {arrows.map((arrow, i) => {
              const headerOffsetX = rowHeaders ? cellSize : 0;
              const headerOffsetY = colHeaders ? cellSize : 0;
              const x1 = headerOffsetX + arrow.from[1] * cellSize + cellSize / 2;
              const y1 = headerOffsetY + arrow.from[0] * cellSize + cellSize / 2;
              const x2 = headerOffsetX + arrow.to[1] * cellSize + cellSize / 2;
              const y2 = headerOffsetY + arrow.to[0] * cellSize + cellSize / 2;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={VIZ_COLORS.highlighted}
                  strokeWidth={1.5}
                  markerEnd="url(#arrowhead)"
                  opacity={0.7}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
