"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { ArrayStepData } from "./logic";

interface ArrayCanvasProps {
  step: VisualizationStep;
}

const CELL_SIZE = 50;
const CELL_GAP = 4;
const PADDING = 20;

export function ArrayVisualizationCanvas({ step }: ArrayCanvasProps) {
  const data = step.data as ArrayStepData;
  const { array, capacity, size, operation, value, targetIndex, highlights, shiftingIndices } = data;

  const highlightMap = new Map<number, string>();
  for (const h of highlights) {
    highlightMap.set(h.index, h.color);
  }

  const totalWidth = capacity * (CELL_SIZE + CELL_GAP) + PADDING * 2;
  const svgHeight = CELL_SIZE + PADDING * 2 + 50;

  function getCellColor(index: number): string {
    if (highlightMap.has(index)) return highlightMap.get(index)!;
    if (index >= size) return "#1e293b"; // empty slot
    return VIZ_COLORS.default;
  }

  function getTextColor(index: number): string {
    if (index >= size && array[index] === null) return "#334155";
    return "#e2e8f0";
  }

  const isShifting = shiftingIndices && shiftingIndices.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Operation badge */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-mono text-muted-foreground">Operation:</span>
        <span
          className="px-2 py-0.5 rounded text-xs font-mono font-bold"
          style={{
            backgroundColor:
              operation === "insert"
                ? VIZ_COLORS.active
                : operation === "delete"
                  ? VIZ_COLORS.swapping
                  : operation === "access"
                    ? VIZ_COLORS.comparing
                    : operation === "shift-right" || operation === "shift-left"
                      ? VIZ_COLORS.comparing
                      : operation === "complete"
                        ? VIZ_COLORS.completed
                        : VIZ_COLORS.default,
            color: "#fff",
          }}
        >
          {operation}
          {value !== undefined && targetIndex !== undefined ? `(${targetIndex}, ${value})` : value !== undefined ? `(${value})` : ""}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          Size: {size}/{capacity}
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={Math.max(totalWidth, 200)}
          height={svgHeight}
          className="select-none mx-auto"
        >
          <g transform={`translate(${PADDING}, ${PADDING})`}>
            {array.map((val, index) => {
              const x = index * (CELL_SIZE + CELL_GAP);
              const color = getCellColor(index);
              const textColor = getTextColor(index);
              const isEmpty = index >= size;
              const isTarget = index === targetIndex;
              const isBeingShifted = isShifting && shiftingIndices!.includes(index);

              return (
                <g key={index}>
                  {/* Cell rect */}
                  <motion.rect
                    x={x}
                    y={0}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx={4}
                    fill={color}
                    stroke={isTarget ? "#fff" : isEmpty ? "#1e293b" : "#334155"}
                    strokeWidth={isTarget ? 2.5 : 1.5}
                    strokeDasharray={isEmpty ? "4 2" : undefined}
                    initial={false}
                    animate={{ fill: color }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Value text */}
                  <text
                    x={x + CELL_SIZE / 2}
                    y={CELL_SIZE / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    className="font-mono font-bold"
                    fontSize={13}
                  >
                    {val !== null ? val : ""}
                  </text>

                  {/* Index label below */}
                  <text
                    x={x + CELL_SIZE / 2}
                    y={CELL_SIZE + 14}
                    textAnchor="middle"
                    className="fill-muted-foreground/60 font-mono"
                    fontSize={10}
                  >
                    {index}
                  </text>

                  {/* Shift arrow */}
                  {isBeingShifted && operation === "shift-right" && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <line
                        x1={x + CELL_SIZE / 2}
                        y1={-8}
                        x2={x + CELL_SIZE / 2 + CELL_SIZE / 2 + 2}
                        y2={-8}
                        stroke={VIZ_COLORS.comparing}
                        strokeWidth={1.5}
                        markerEnd="url(#shift-arrow)"
                      />
                    </motion.g>
                  )}
                  {isBeingShifted && operation === "shift-left" && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <line
                        x1={x + CELL_SIZE / 2}
                        y1={-8}
                        x2={x + CELL_SIZE / 2 - CELL_SIZE / 2 - 2}
                        y2={-8}
                        stroke={VIZ_COLORS.comparing}
                        strokeWidth={1.5}
                        markerEnd="url(#shift-arrow)"
                      />
                    </motion.g>
                  )}
                </g>
              );
            })}

            {/* Arrow marker */}
            <defs>
              <marker
                id="shift-arrow"
                markerWidth={6}
                markerHeight={6}
                refX={6}
                refY={3}
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill={VIZ_COLORS.comparing} />
              </marker>
            </defs>

            {/* Size bracket */}
            {size > 0 && (
              <g>
                <line
                  x1={0}
                  y1={CELL_SIZE + 26}
                  x2={size * (CELL_SIZE + CELL_GAP) - CELL_GAP}
                  y2={CELL_SIZE + 26}
                  stroke={VIZ_COLORS.active}
                  strokeWidth={1.5}
                  opacity={0.5}
                />
                <text
                  x={(size * (CELL_SIZE + CELL_GAP) - CELL_GAP) / 2}
                  y={CELL_SIZE + 40}
                  textAnchor="middle"
                  fill={VIZ_COLORS.active}
                  className="font-mono"
                  fontSize={10}
                  opacity={0.7}
                >
                  size = {size}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
