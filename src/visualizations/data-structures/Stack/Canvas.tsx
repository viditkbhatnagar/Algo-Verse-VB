"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { StackStepData } from "./logic";

interface StackCanvasProps {
  step: VisualizationStep;
}

const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 40;
const BLOCK_GAP = 6;
const PADDING = 20;

export function StackCanvas({ step }: StackCanvasProps) {
  const data = step.data as StackStepData;
  const { stack, operation, value, highlights } = data;

  const highlightMap = new Map<number, string>();
  for (const h of highlights) {
    highlightMap.set(h.index, h.color);
  }

  // Stack grows upward: index 0 is at bottom, last index at top
  const maxItems = 8;
  const svgHeight = maxItems * (BLOCK_HEIGHT + BLOCK_GAP) + PADDING * 2 + 40;
  const svgWidth = BLOCK_WIDTH + PADDING * 2 + 80;

  const baseY = svgHeight - PADDING - 20;

  function getBlockColor(index: number): string {
    if (highlightMap.has(index)) return highlightMap.get(index)!;
    return VIZ_COLORS.default;
  }

  return (
    <div className="flex flex-col items-center">
      {/* Operation badge */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-mono text-muted-foreground">Operation:</span>
        <span
          className="px-2 py-0.5 rounded text-xs font-mono font-bold"
          style={{
            backgroundColor:
              operation === "push"
                ? VIZ_COLORS.active
                : operation === "pop"
                  ? VIZ_COLORS.swapping
                  : operation === "peek"
                    ? VIZ_COLORS.comparing
                    : operation === "complete"
                      ? VIZ_COLORS.completed
                      : VIZ_COLORS.default,
            color: "#fff",
          }}
        >
          {operation}
          {value !== undefined ? `(${value})` : ""}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          Size: {stack.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="select-none mx-auto"
        >
          {/* Stack container walls */}
          <line
            x1={PADDING}
            y1={PADDING}
            x2={PADDING}
            y2={baseY}
            stroke="#334155"
            strokeWidth={2}
          />
          <line
            x1={PADDING + BLOCK_WIDTH}
            y1={PADDING}
            x2={PADDING + BLOCK_WIDTH}
            y2={baseY}
            stroke="#334155"
            strokeWidth={2}
          />
          <line
            x1={PADDING}
            y1={baseY}
            x2={PADDING + BLOCK_WIDTH}
            y2={baseY}
            stroke="#334155"
            strokeWidth={2}
          />

          {/* "TOP" label */}
          {stack.length > 0 && (
            <motion.g
              key={`top-label-${stack.length}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <text
                x={PADDING + BLOCK_WIDTH + 10}
                y={
                  baseY -
                  (stack.length - 1) * (BLOCK_HEIGHT + BLOCK_GAP) -
                  BLOCK_HEIGHT / 2
                }
                textAnchor="start"
                dominantBaseline="central"
                fill={VIZ_COLORS.highlighted}
                className="font-mono font-bold"
                fontSize={11}
              >
                TOP
              </text>
              <line
                x1={PADDING + BLOCK_WIDTH + 4}
                y1={
                  baseY -
                  (stack.length - 1) * (BLOCK_HEIGHT + BLOCK_GAP) -
                  BLOCK_HEIGHT / 2
                }
                x2={PADDING + BLOCK_WIDTH + 8}
                y2={
                  baseY -
                  (stack.length - 1) * (BLOCK_HEIGHT + BLOCK_GAP) -
                  BLOCK_HEIGHT / 2
                }
                stroke={VIZ_COLORS.highlighted}
                strokeWidth={2}
              />
            </motion.g>
          )}

          {/* Empty label */}
          {stack.length === 0 && (
            <text
              x={PADDING + BLOCK_WIDTH / 2}
              y={baseY - 20}
              textAnchor="middle"
              fill="#64748b"
              className="font-mono"
              fontSize={12}
            >
              empty
            </text>
          )}

          {/* Stack blocks */}
          <AnimatePresence>
            {stack.map((val, index) => {
              const x = PADDING;
              const y =
                baseY - (index + 1) * (BLOCK_HEIGHT + BLOCK_GAP) + BLOCK_GAP;
              const color = getBlockColor(index);
              const isTop = index === stack.length - 1;

              return (
                <motion.g
                  key={`${index}-${val}`}
                  initial={{ opacity: 0, y: y - 30 }}
                  animate={{ opacity: 1, y }}
                  exit={{ opacity: 0, y: y - 30 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.rect
                    x={x}
                    y={0}
                    width={BLOCK_WIDTH}
                    height={BLOCK_HEIGHT}
                    rx={4}
                    fill={color}
                    stroke={isTop ? "#fff" : "#334155"}
                    strokeWidth={isTop ? 2 : 1}
                    initial={false}
                    animate={{ fill: color }}
                    transition={{ duration: 0.2 }}
                  />
                  <text
                    x={x + BLOCK_WIDTH / 2}
                    y={BLOCK_HEIGHT / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    className="font-mono font-bold"
                    fontSize={14}
                  >
                    {val}
                  </text>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
}
