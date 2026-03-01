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

interface HeapSortCanvasProps {
  step: VisualizationStep;
}

export function HeapSortCanvas({ step }: HeapSortCanvasProps) {
  const data = step.data as SortingStepData;
  const heapSize = data.heapSize ?? data.array.length;

  const highlights = new Map<number, HighlightColor>();
  for (const h of data.highlights ?? []) {
    for (const idx of h.indices) {
      highlights.set(idx, h.color);
    }
  }

  function getColor(idx: number): string {
    const h = highlights.get(idx);
    if (h) return COLOR_MAP[h];
    if (idx >= heapSize) return COLOR_MAP.completed;
    return COLOR_MAP.default;
  }

  // Tree layout
  const treeWidth = 380;
  const treeHeight = 160;
  const levels = Math.ceil(Math.log2(heapSize + 1));

  function getNodePos(index: number) {
    const level = Math.floor(Math.log2(index + 1));
    const posInLevel = index - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const spacing = treeWidth / (nodesInLevel + 1);
    return {
      x: spacing * (posInLevel + 1),
      y: 25 + level * (treeHeight / Math.max(levels, 1)),
    };
  }

  // Bar chart dimensions
  const barWidth = 380;
  const barHeight = 100;
  const maxVal = Math.max(...data.array, 1);

  return (
    <div className="space-y-2">
      {/* Tree view */}
      <svg width="100%" viewBox={`0 0 ${treeWidth} ${treeHeight + 10}`} className="select-none">
        {/* Edges */}
        {data.array.slice(0, heapSize).map((_, i) => {
          if (i === 0) return null;
          const parentIdx = Math.floor((i - 1) / 2);
          const parent = getNodePos(parentIdx);
          const child = getNodePos(i);
          return (
            <line
              key={`edge-${i}`}
              x1={parent.x}
              y1={parent.y}
              x2={child.x}
              y2={child.y}
              stroke="#334155"
              strokeWidth={1.5}
            />
          );
        })}
        {/* Nodes */}
        {data.array.slice(0, heapSize).map((val, i) => {
          const pos = getNodePos(i);
          const color = getColor(i);
          return (
            <g key={`node-${i}`}>
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={16}
                fill={color}
                stroke="#1e293b"
                strokeWidth={2}
                initial={false}
                animate={{ fill: color }}
                transition={{ duration: 0.15 }}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                className="font-mono font-bold"
                fontSize={11}
              >
                {val}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Separator */}
      <div className="border-t border-border/30" />

      {/* Bar chart */}
      <svg width="100%" viewBox={`0 0 ${barWidth} ${barHeight}`} className="select-none">
        {data.array.map((val, i) => {
          const bw = (barWidth - 20) / data.array.length;
          const x = 10 + i * bw;
          const h = (val / maxVal) * (barHeight - 20);
          const y = barHeight - 10 - h;
          const color = getColor(i);

          return (
            <g key={i}>
              <motion.rect
                x={x + 1}
                y={y}
                width={Math.max(bw - 2, 1)}
                height={h}
                rx={1}
                fill={color}
                initial={false}
                animate={{ y, height: h, fill: color }}
                transition={{ duration: 0.15 }}
              />
              {bw > 14 && (
                <text
                  x={x + bw / 2}
                  y={y - 3}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono"
                  fontSize={Math.min(9, bw * 0.4)}
                >
                  {val}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
