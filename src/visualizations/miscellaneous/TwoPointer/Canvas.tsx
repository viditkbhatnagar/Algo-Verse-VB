"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type {
  VisualizationStep,
  ArrayWithPointersStepData,
  HighlightColor,
} from "@/lib/visualization/types";

interface TwoPointerCanvasProps {
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
const POINTER_OFFSET = 40;

export function TwoPointerCanvas({ step }: TwoPointerCanvasProps) {
  const data = step.data as ArrayWithPointersStepData;
  const { array, pointers, highlights, currentValue } = data;
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
  const svgHeight = 200;
  const startX = (svgWidth - totalWidth) / 2;

  const leftIdx = pointers.left ?? 0;
  const rightIdx = pointers.right ?? n - 1;

  const leftX = startX + leftIdx * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2;
  const rightX = startX + rightIdx * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2;

  const sum = currentValue as number | undefined;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Sum display */}
      <div className="flex items-center gap-4 text-sm font-mono">
        {sum !== undefined && (
          <span className="text-muted-foreground">
            Current Sum:{" "}
            <span
              className="font-bold text-base"
              style={{
                color: data.result
                  ? VIZ_COLORS.completed
                  : VIZ_COLORS.comparing,
              }}
            >
              {sum}
            </span>
          </span>
        )}
        {data.result && (
          <span className="text-sm" style={{ color: VIZ_COLORS.completed }}>
            Pair found: ({String(data.result[0])}, {String(data.result[1])})
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="select-none mx-auto"
        >
          {/* Array cells */}
          {array.map((value, index) => {
            const x = startX + index * (CELL_SIZE + CELL_GAP);
            const y = 50;
            const hColor = highlightMap.get(index);
            const fillColor = hColor ? COLOR_MAP[hColor] : VIZ_COLORS.default;

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

          {/* Left pointer arrow */}
          <motion.g
            initial={false}
            animate={{ x: leftX, y: 50 + CELL_SIZE + POINTER_OFFSET }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Arrow pointing up */}
            <polygon
              points="0,-12 -8,4 8,4"
              fill={VIZ_COLORS.active}
            />
            <text
              x={0}
              y={18}
              textAnchor="middle"
              fill={VIZ_COLORS.active}
              className="font-mono font-bold"
              fontSize={12}
            >
              L
            </text>
          </motion.g>

          {/* Right pointer arrow */}
          <motion.g
            initial={false}
            animate={{ x: rightX, y: 50 + CELL_SIZE + POINTER_OFFSET }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Arrow pointing up */}
            <polygon
              points="0,-12 -8,4 8,4"
              fill={VIZ_COLORS.swapping}
            />
            <text
              x={0}
              y={18}
              textAnchor="middle"
              fill={VIZ_COLORS.swapping}
              className="font-mono font-bold"
              fontSize={12}
            >
              R
            </text>
          </motion.g>

          {/* Target label */}
          <text
            x={svgWidth / 2}
            y={22}
            textAnchor="middle"
            fill="#94a3b8"
            className="font-mono"
            fontSize={12}
          >
            Target: {step.variables?.target as number ?? ""}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: VIZ_COLORS.active }}
          />
          Left pointer
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: VIZ_COLORS.swapping }}
          />
          Right pointer
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: VIZ_COLORS.comparing }}
          />
          Comparing
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: VIZ_COLORS.completed }}
          />
          Found
        </span>
      </div>
    </div>
  );
}
