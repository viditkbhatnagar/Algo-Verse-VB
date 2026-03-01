"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { BellmanStepData } from "./logic";

const HIGHLIGHT_COLORS: Record<string, string> = {
  active: VIZ_COLORS.active,
  comparing: VIZ_COLORS.comparing,
  completed: VIZ_COLORS.completed,
  selected: VIZ_COLORS.highlighted,
};

const ARROW_OFFSETS: Record<string, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

interface BellmanCanvasProps {
  step: VisualizationStep;
}

export function BellmanCanvas({ step }: BellmanCanvasProps) {
  const data = step.data as BellmanStepData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 450 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const w = entry.contentRect.width;
        setDimensions({
          width: w,
          height: Math.max(380, Math.min(500, w * 0.75)),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  const padding = { top: 50, right: 30, bottom: 40, left: 30 };
  const gridArea = Math.min(
    width - padding.left - padding.right,
    height - padding.top - padding.bottom
  );
  const cellSize = gridArea / data.gridSize;
  const gridX = padding.left + (width - padding.left - padding.right - gridArea) / 2;
  const gridY = padding.top;

  function getValueColor(value: number): string {
    if (value > 5) return VIZ_COLORS.rewardPositive;
    if (value > 1) return "#4ade80";
    if (value > 0) return "#86efac";
    if (value < -0.5) return VIZ_COLORS.rewardNegative;
    return "#94a3b8";
  }

  return (
    <div ref={containerRef} style={{ minHeight: 380 }}>
      <svg width={width} height={height} className="select-none">
        <defs>
          <marker id="bellman-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={VIZ_COLORS.completed} />
          </marker>
        </defs>

        {/* Header */}
        <text x={width / 2} y={16} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={10}>
          gamma={data.gamma} | Iteration: {data.iteration >= 0 ? data.iteration : "final"} | Max Delta: {data.maxDelta.toFixed(4)}
        </text>
        {data.converged && (
          <text x={width / 2} y={32} textAnchor="middle" className="font-mono font-bold" fontSize={10} fill={VIZ_COLORS.completed}>
            Converged -- Bellman Optimality Satisfied
          </text>
        )}

        {/* Grid cells */}
        {data.grid.flat().map((cell) => {
          const x = gridX + cell.col * cellSize;
          const y = gridY + cell.row * cellSize;
          const center = { x: x + cellSize / 2, y: y + cellSize / 2 };

          let bg = "#1a1a2e";
          if (cell.type === "wall") bg = "#0f172a";
          else if (cell.type === "goal") bg = "rgba(34,197,94,0.2)";
          else if (cell.highlight) bg = HIGHLIGHT_COLORS[cell.highlight] + "20";

          const borderColor = cell.highlight
            ? HIGHLIGHT_COLORS[cell.highlight]
            : cell.type === "goal"
            ? VIZ_COLORS.completed
            : "#334155";

          return (
            <g key={`cell-${cell.row}-${cell.col}`}>
              <motion.rect
                x={x + 1}
                y={y + 1}
                width={cellSize - 2}
                height={cellSize - 2}
                fill={bg}
                stroke={borderColor}
                strokeWidth={cell.isUpdating ? 3 : cell.highlight ? 2 : 1}
                rx={4}
                initial={false}
                animate={{ fill: bg, stroke: borderColor }}
                transition={{ duration: 0.3 }}
              />

              {/* Wall marker */}
              {cell.type === "wall" && (
                <text x={center.x} y={center.y + 5} textAnchor="middle" className="font-mono font-bold" fontSize={cellSize * 0.25} fill="#475569">
                  WALL
                </text>
              )}

              {/* Goal marker */}
              {cell.type === "goal" && (
                <>
                  <text x={center.x} y={center.y - 8} textAnchor="middle" className="font-bold" fontSize={cellSize * 0.18} fill={VIZ_COLORS.completed}>
                    GOAL
                  </text>
                  <text x={center.x} y={center.y + 10} textAnchor="middle" className="font-mono font-bold" fontSize={cellSize * 0.22} fill="#e2e8f0">
                    V={cell.value.toFixed(1)}
                  </text>
                  <text x={center.x} y={center.y + 26} textAnchor="middle" className="font-mono" fontSize={cellSize * 0.12} fill={VIZ_COLORS.rewardPositive}>
                    R=+{cell.reward}
                  </text>
                </>
              )}

              {/* Empty cell value */}
              {cell.type === "empty" && (
                <>
                  <text x={center.x} y={center.y - 6} textAnchor="middle" className="font-mono" fontSize={cellSize * 0.1} fill="#94a3b8">
                    ({cell.row},{cell.col})
                  </text>
                  <motion.text
                    x={center.x}
                    y={center.y + 12}
                    textAnchor="middle"
                    className="font-mono font-bold"
                    fontSize={cellSize * 0.2}
                    fill={getValueColor(cell.value)}
                    initial={false}
                    animate={{ fill: getValueColor(cell.value) }}
                    transition={{ duration: 0.3 }}
                  >
                    {cell.value.toFixed(2)}
                  </motion.text>
                  <text x={center.x} y={center.y + 28} textAnchor="middle" className="font-mono" fontSize={cellSize * 0.1} fill="#64748b">
                    V(s)
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Policy arrows */}
        {data.policyArrows?.map((arrow, i) => {
          const fromX = gridX + arrow.col * cellSize + cellSize / 2;
          const fromY = gridY + arrow.row * cellSize + cellSize / 2;
          const offset = ARROW_OFFSETS[arrow.direction] || { dx: 0, dy: 0 };
          const arrowLen = cellSize * 0.3;
          const toX = fromX + offset.dx * arrowLen;
          const toY = fromY + offset.dy * arrowLen;

          return (
            <motion.line
              key={`arrow-${i}`}
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke={VIZ_COLORS.completed}
              strokeWidth={3}
              markerEnd="url(#bellman-arrow)"
              opacity={0.9}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            />
          );
        })}

        {/* Sweep cell indicator */}
        {data.sweepCell && (
          <motion.rect
            x={gridX + data.sweepCell.col * cellSize - 2}
            y={gridY + data.sweepCell.row * cellSize - 2}
            width={cellSize + 4}
            height={cellSize + 4}
            fill="none"
            stroke={VIZ_COLORS.active}
            strokeWidth={3}
            strokeDasharray="6 3"
            rx={6}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </svg>
    </div>
  );
}
