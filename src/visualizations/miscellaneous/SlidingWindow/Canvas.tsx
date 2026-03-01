"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type {
  VisualizationStep,
  ArrayWithPointersStepData,
  HighlightColor,
} from "@/lib/visualization/types";

interface SlidingWindowCanvasProps {
  step: VisualizationStep;
}

const COLOR_MAP: Record<string, string> = {
  default: VIZ_COLORS.default,
  active: VIZ_COLORS.active,
  comparing: VIZ_COLORS.comparing,
  swapping: VIZ_COLORS.swapping,
  completed: VIZ_COLORS.completed,
  selected: VIZ_COLORS.highlighted,
  path: "#a78bfa",
  "mst-edge": "#8b5cf6",
  relaxed: VIZ_COLORS.relaxed,
  backtracked: VIZ_COLORS.backtracked,
  window: VIZ_COLORS.window,
};

const CELL_SIZE = 50;
const CELL_GAP = 6;

export function SlidingWindowCanvas({ step }: SlidingWindowCanvasProps) {
  const data = step.data as ArrayWithPointersStepData;
  const { array, windowRange, highlights, currentValue } = data;
  const n = array.length;

  // Build highlight map
  const highlightMap = new Map<number, HighlightColor>();
  for (const h of highlights ?? []) {
    for (const idx of h.indices) {
      highlightMap.set(idx, h.color);
    }
  }

  const totalWidth = n * (CELL_SIZE + CELL_GAP) - CELL_GAP;
  const svgWidth = Math.max(totalWidth + 80, 400);
  const svgHeight = 180;
  const startX = (svgWidth - totalWidth) / 2;
  const cellY = 60;

  // Window bracket positions
  const winStart = windowRange?.[0] ?? 0;
  const winEnd = windowRange?.[1] ?? 0;
  const bracketX1 = startX + winStart * (CELL_SIZE + CELL_GAP) - 4;
  const bracketX2 = startX + winEnd * (CELL_SIZE + CELL_GAP) + CELL_SIZE + 4;
  const bracketY = cellY - 8;
  const bracketHeight = CELL_SIZE + 16;

  const maxSum = step.variables?.maxSum as number | undefined;
  const windowSum = currentValue as number | undefined;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Sum displays */}
      <div className="flex items-center gap-6 text-sm font-mono">
        {windowSum !== undefined && (
          <span className="text-muted-foreground">
            Window Sum:{" "}
            <span
              className="font-bold text-base"
              style={{ color: VIZ_COLORS.window }}
            >
              {windowSum}
            </span>
          </span>
        )}
        {maxSum !== undefined && (
          <span className="text-muted-foreground">
            Max Sum:{" "}
            <span
              className="font-bold text-base"
              style={{ color: VIZ_COLORS.completed }}
            >
              {maxSum}
            </span>
          </span>
        )}
        {data.result && (
          <span className="text-sm" style={{ color: VIZ_COLORS.completed }}>
            Best: [{data.result.join(", ")}]
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="select-none mx-auto"
        >
          {/* Window bracket/highlight */}
          {windowRange && (
            <motion.rect
              x={bracketX1}
              y={bracketY}
              width={bracketX2 - bracketX1}
              height={bracketHeight}
              rx={8}
              fill="none"
              stroke={VIZ_COLORS.window}
              strokeWidth={3}
              strokeDasharray="6 3"
              initial={false}
              animate={{
                x: bracketX1,
                width: bracketX2 - bracketX1,
              }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            />
          )}

          {/* Window background fill */}
          {windowRange && (
            <motion.rect
              x={bracketX1}
              y={bracketY}
              width={bracketX2 - bracketX1}
              height={bracketHeight}
              rx={8}
              fill={VIZ_COLORS.window}
              opacity={0.08}
              initial={false}
              animate={{
                x: bracketX1,
                width: bracketX2 - bracketX1,
              }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            />
          )}

          {/* Array cells */}
          {array.map((value, index) => {
            const x = startX + index * (CELL_SIZE + CELL_GAP);
            const y = cellY;
            const hColor = highlightMap.get(index);
            const isInWindow =
              windowRange &&
              index >= windowRange[0] &&
              index <= windowRange[1];
            const fillColor = hColor
              ? COLOR_MAP[hColor]
              : isInWindow
                ? VIZ_COLORS.window
                : VIZ_COLORS.default;

            return (
              <g key={index}>
                <motion.rect
                  x={x}
                  y={y}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={6}
                  fill={fillColor}
                  stroke="#334155"
                  strokeWidth={2}
                  initial={false}
                  animate={{ fill: fillColor }}
                  transition={{ duration: 0.25 }}
                />
                <text
                  x={x + CELL_SIZE / 2}
                  y={y + CELL_SIZE / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#e2e8f0"
                  className="font-mono font-bold"
                  fontSize={16}
                >
                  {value}
                </text>
                {/* Index label below */}
                <text
                  x={x + CELL_SIZE / 2}
                  y={y + CELL_SIZE + 16}
                  textAnchor="middle"
                  className="fill-muted-foreground/60 font-mono"
                  fontSize={10}
                >
                  {index}
                </text>
              </g>
            );
          })}

          {/* Window label */}
          {windowRange && (
            <motion.text
              x={(bracketX1 + bracketX2) / 2}
              y={bracketY - 8}
              textAnchor="middle"
              fill={VIZ_COLORS.window}
              className="font-mono font-bold"
              fontSize={11}
              initial={false}
              animate={{ x: (bracketX1 + bracketX2) / 2 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            >
              window (k={step.variables?.k as number ?? ""})
            </motion.text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: VIZ_COLORS.window }}
          />
          Window
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: VIZ_COLORS.active }}
          />
          Entering
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: VIZ_COLORS.swapping }}
          />
          Leaving
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: VIZ_COLORS.completed }}
          />
          Max Window
        </span>
      </div>
    </div>
  );
}
