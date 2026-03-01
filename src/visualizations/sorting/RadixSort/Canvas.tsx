"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep, SortingStepData, HighlightColor } from "@/lib/visualization/types";

const COLOR_MAP: Record<HighlightColor | "default", string> = {
  default: VIZ_COLORS.default,
  active: VIZ_COLORS.active,
  comparing: VIZ_COLORS.comparing,
  swapping: VIZ_COLORS.swapping,
  completed: VIZ_COLORS.completed,
  selected: VIZ_COLORS.highlighted,
  path: "#a78bfa",
};

interface RadixSortCanvasProps {
  step: VisualizationStep;
}

export function RadixSortCanvas({ step }: RadixSortCanvasProps) {
  const data = step.data as SortingStepData;
  const buckets = data.buckets;

  const highlights = new Map<number, HighlightColor>();
  for (const h of data.highlights ?? []) {
    for (const idx of h.indices) {
      highlights.set(idx, h.color);
    }
  }

  const cellSize = Math.min(36, 500 / Math.max(data.array.length, 1));

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
                  fontSize={Math.min(11, cellSize * 0.3)}
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Buckets */}
      {buckets && (
        <div>
          <p className="text-xs text-muted-foreground font-mono mb-1">Buckets</p>
          <div className="flex gap-1.5">
            {buckets.map((bucket) => (
              <div
                key={bucket.label}
                className="flex flex-col items-center gap-0.5 min-w-[32px]"
              >
                <div className="text-[10px] font-mono text-muted-foreground/60">
                  {bucket.label}
                </div>
                <div className="flex flex-col-reverse gap-0.5 min-h-[24px] border border-border/30 rounded px-0.5 py-0.5">
                  {bucket.items.map((val, j) => (
                    <motion.div
                      key={`${val}-${j}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-viz-active/80 text-white text-[10px] font-mono rounded px-1 py-0.5 text-center min-w-[24px]"
                    >
                      {val}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
