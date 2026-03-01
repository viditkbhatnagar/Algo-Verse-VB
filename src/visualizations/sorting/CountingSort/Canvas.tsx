"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep, SortingStepData, HighlightColor } from "@/lib/visualization/types";

const COLOR_MAP: Record<string, string> = {
  default: VIZ_COLORS.default,
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

interface CountingSortCanvasProps {
  step: VisualizationStep;
}

export function CountingSortCanvas({ step }: CountingSortCanvasProps) {
  const data = step.data as SortingStepData;
  const auxiliary = data.auxiliaryArrays?.[0];

  const highlights = new Map<number, HighlightColor>();
  for (const h of data.highlights ?? []) {
    for (const idx of h.indices) {
      highlights.set(idx, h.color);
    }
  }

  const maxVal = Math.max(...data.array, 1);
  const cellSize = Math.min(40, 500 / Math.max(data.array.length, 1));

  return (
    <div className="space-y-4 overflow-x-auto">
      {/* Main array */}
      <div>
        <p className="text-xs text-muted-foreground font-mono mb-1">Array</p>
        <svg
          width={Math.max(data.array.length * (cellSize + 2) + 10, 100)}
          height={cellSize + 4}
          className="select-none"
        >
          {data.array.map((val, i) => {
            const color = highlights.get(i)
              ? COLOR_MAP[highlights.get(i)!]
              : COLOR_MAP.default;
            return (
              <g key={i}>
                <motion.rect
                  x={i * (cellSize + 2)}
                  y={0}
                  width={cellSize}
                  height={cellSize}
                  rx={3}
                  fill={color}
                  initial={false}
                  animate={{ fill: color }}
                  transition={{ duration: 0.15 }}
                />
                <text
                  x={i * (cellSize + 2) + cellSize / 2}
                  y={cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  className="font-mono font-bold"
                  fontSize={Math.min(12, cellSize * 0.35)}
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Auxiliary (count) array */}
      {auxiliary && (
        <div>
          <p className="text-xs text-muted-foreground font-mono mb-1">
            {auxiliary.label}
          </p>
          <svg
            width={Math.max(auxiliary.data.length * (cellSize + 2) + 10, 100)}
            height={cellSize + 18}
            className="select-none"
          >
            {auxiliary.data.map((val, i) => {
              const hasValue = val > 0;
              return (
                <g key={i}>
                  <rect
                    x={i * (cellSize + 2)}
                    y={0}
                    width={cellSize}
                    height={cellSize}
                    rx={3}
                    fill={hasValue ? VIZ_COLORS.active + "80" : "#1e293b"}
                    stroke="#334155"
                    strokeWidth={1}
                  />
                  <text
                    x={i * (cellSize + 2) + cellSize / 2}
                    y={cellSize / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={hasValue ? "#fff" : "#475569"}
                    className="font-mono"
                    fontSize={Math.min(11, cellSize * 0.3)}
                  >
                    {val}
                  </text>
                  <text
                    x={i * (cellSize + 2) + cellSize / 2}
                    y={cellSize + 12}
                    textAnchor="middle"
                    className="fill-muted-foreground/60 font-mono"
                    fontSize={8}
                  >
                    {i}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
