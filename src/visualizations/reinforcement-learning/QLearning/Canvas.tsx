"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { QLearningStepData, QLearningCell } from "./logic";

const CELL_HIGHLIGHT_COLORS: Record<string, string> = {
  active: VIZ_COLORS.active,
  comparing: VIZ_COLORS.comparing,
  completed: VIZ_COLORS.completed,
  selected: VIZ_COLORS.highlighted,
  path: VIZ_COLORS.mstEdge,
};

interface QLearningCanvasProps {
  step: VisualizationStep;
}

export function QLearningCanvas({ step }: QLearningCanvasProps) {
  const data = step.data as QLearningStepData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const w = entry.contentRect.width;
        setDimensions({
          width: w,
          height: Math.max(400, Math.min(550, w * 0.8)),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  const padding = { top: 40, right: 20, bottom: 30, left: 20 };
  const gridArea = Math.min(
    width - padding.left - padding.right,
    height - padding.top - padding.bottom
  );
  const cellSize = gridArea / data.gridSize;
  const gridX = padding.left + (width - padding.left - padding.right - gridArea) / 2;
  const gridY = padding.top;

  function renderCell(cell: QLearningCell) {
    const x = gridX + cell.col * cellSize;
    const y = gridY + cell.row * cellSize;
    const isObs = cell.type === "obstacle";
    const isGoal = cell.type === "goal";
    const isAgent = cell.type === "agent";

    let bg = "#1a1a2e";
    if (isObs) bg = "#0f172a";
    else if (isGoal) bg = "rgba(34,197,94,0.15)";
    else if (cell.highlight) bg = CELL_HIGHLIGHT_COLORS[cell.highlight] + "22";

    const borderColor = cell.highlight
      ? CELL_HIGHLIGHT_COLORS[cell.highlight]
      : "#334155";

    // Q-value display: small triangles in each direction
    const q = cell.qValues;
    const center = { x: x + cellSize / 2, y: y + cellSize / 2 };
    const qFontSize = Math.max(7, cellSize * 0.09);
    const inset = cellSize * 0.18;

    return (
      <g key={`cell-${cell.row}-${cell.col}`}>
        {/* Cell background */}
        <motion.rect
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          fill={bg}
          stroke={borderColor}
          strokeWidth={cell.highlight ? 2 : 1}
          rx={3}
          initial={false}
          animate={{ fill: bg, stroke: borderColor }}
          transition={{ duration: 0.3 }}
        />

        {/* Obstacle X */}
        {isObs && (
          <>
            <line
              x1={x + cellSize * 0.3}
              y1={y + cellSize * 0.3}
              x2={x + cellSize * 0.7}
              y2={y + cellSize * 0.7}
              stroke="#ef4444"
              strokeWidth={2}
              opacity={0.7}
            />
            <line
              x1={x + cellSize * 0.7}
              y1={y + cellSize * 0.3}
              x2={x + cellSize * 0.3}
              y2={y + cellSize * 0.7}
              stroke="#ef4444"
              strokeWidth={2}
              opacity={0.7}
            />
          </>
        )}

        {/* Goal marker */}
        {isGoal && (
          <text
            x={center.x}
            y={center.y + 3}
            textAnchor="middle"
            className="font-bold"
            fontSize={cellSize * 0.3}
            fill={VIZ_COLORS.completed}
          >
            G
          </text>
        )}

        {/* Q-values (only for non-obstacle, non-goal cells) */}
        {!isObs && !isGoal && (
          <>
            {/* Up */}
            <text
              x={center.x}
              y={y + inset}
              textAnchor="middle"
              className="font-mono"
              fontSize={qFontSize}
              fill={q.up > 0 ? VIZ_COLORS.rewardPositive : q.up < 0 ? VIZ_COLORS.rewardNegative : "#64748b"}
            >
              {q.up.toFixed(1)}
            </text>
            {/* Down */}
            <text
              x={center.x}
              y={y + cellSize - inset + qFontSize * 0.4}
              textAnchor="middle"
              className="font-mono"
              fontSize={qFontSize}
              fill={q.down > 0 ? VIZ_COLORS.rewardPositive : q.down < 0 ? VIZ_COLORS.rewardNegative : "#64748b"}
            >
              {q.down.toFixed(1)}
            </text>
            {/* Left */}
            <text
              x={x + inset}
              y={center.y + qFontSize * 0.3}
              textAnchor="middle"
              className="font-mono"
              fontSize={qFontSize}
              fill={q.left > 0 ? VIZ_COLORS.rewardPositive : q.left < 0 ? VIZ_COLORS.rewardNegative : "#64748b"}
            >
              {q.left.toFixed(1)}
            </text>
            {/* Right */}
            <text
              x={x + cellSize - inset}
              y={center.y + qFontSize * 0.3}
              textAnchor="middle"
              className="font-mono"
              fontSize={qFontSize}
              fill={q.right > 0 ? VIZ_COLORS.rewardPositive : q.right < 0 ? VIZ_COLORS.rewardNegative : "#64748b"}
            >
              {q.right.toFixed(1)}
            </text>
            {/* Divider lines */}
            <line x1={x} y1={y} x2={x + cellSize} y2={y + cellSize} stroke="#1e293b" strokeWidth={0.5} opacity={0.3} />
            <line x1={x + cellSize} y1={y} x2={x} y2={y + cellSize} stroke="#1e293b" strokeWidth={0.5} opacity={0.3} />
          </>
        )}

        {/* Agent circle */}
        {isAgent && (
          <motion.circle
            cx={center.x}
            cy={center.y}
            r={cellSize * 0.18}
            fill={VIZ_COLORS.active}
            stroke="#fff"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={{ scale: 1, cx: center.x, cy: center.y }}
            transition={{ duration: 0.3 }}
          />
        )}
      </g>
    );
  }

  return (
    <div ref={containerRef} style={{ minHeight: 400 }}>
      <svg width={width} height={height} className="select-none">
        {/* Header info */}
        <text x={width / 2} y={18} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={10}>
          Episode: {data.episode} | Step: {data.stepInEpisode >= 0 ? data.stepInEpisode : "done"} | Reward: {data.totalReward.toFixed(2)}
        </text>
        <text x={width / 2} y={32} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={9}>
          alpha={data.alpha} | gamma={data.gamma} | epsilon={data.epsilon}
          {data.lastAction ? ` | action=${data.lastAction}` : ""}
        </text>

        {/* Grid cells */}
        {data.grid.flat().map((cell) => renderCell(cell))}

        {/* Optimal path arrows */}
        {data.optimalPath && data.optimalPath.length > 1 && (
          <>
            <defs>
              <marker id="ql-path-arrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill={VIZ_COLORS.mstEdge} />
              </marker>
            </defs>
            {data.optimalPath.slice(0, -1).map((p, i) => {
              const next = data.optimalPath![i + 1];
              const fromX = gridX + p.col * cellSize + cellSize / 2;
              const fromY = gridY + p.row * cellSize + cellSize / 2;
              const toX = gridX + next.col * cellSize + cellSize / 2;
              const toY = gridY + next.row * cellSize + cellSize / 2;
              return (
                <motion.line
                  key={`path-${i}`}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={VIZ_COLORS.mstEdge}
                  strokeWidth={3}
                  markerEnd="url(#ql-path-arrow)"
                  opacity={0.8}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                />
              );
            })}
          </>
        )}

        {/* Converged badge */}
        {data.converged && (
          <text
            x={width / 2}
            y={gridY + gridArea + 20}
            textAnchor="middle"
            className="font-mono font-bold"
            fontSize={11}
            fill={VIZ_COLORS.completed}
          >
            Optimal Path Learned
          </text>
        )}
      </svg>
    </div>
  );
}
