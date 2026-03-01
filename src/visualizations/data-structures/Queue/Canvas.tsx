"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { QueueStepData } from "./logic";

interface QueueCanvasProps {
  step: VisualizationStep;
}

const BLOCK_WIDTH = 60;
const BLOCK_HEIGHT = 44;
const BLOCK_GAP = 8;
const PADDING = 20;

export function QueueCanvas({ step }: QueueCanvasProps) {
  const data = step.data as QueueStepData;
  const { queue, operation, value, highlights } = data;

  const highlightMap = new Map<number, string>();
  for (const h of highlights) {
    highlightMap.set(h.index, h.color);
  }

  const maxItems = 10;
  const svgWidth = maxItems * (BLOCK_WIDTH + BLOCK_GAP) + PADDING * 2 + 60;
  const svgHeight = BLOCK_HEIGHT + PADDING * 2 + 60;

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
              operation === "enqueue"
                ? VIZ_COLORS.active
                : operation === "dequeue"
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
          Size: {queue.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="select-none mx-auto"
        >
          {/* Dequeue arrow on left */}
          <g transform={`translate(${PADDING - 5}, ${PADDING + BLOCK_HEIGHT / 2})`}>
            <text
              x={-10}
              y={-12}
              textAnchor="middle"
              fill="#64748b"
              className="font-mono"
              fontSize={10}
            >
              dequeue
            </text>
            <polygon
              points="-10,0 0,-5 0,5"
              fill={VIZ_COLORS.swapping}
              opacity={0.6}
            />
          </g>

          {/* Enqueue arrow on right */}
          {queue.length > 0 && (
            <g
              transform={`translate(${
                PADDING + queue.length * (BLOCK_WIDTH + BLOCK_GAP) + 10
              }, ${PADDING + BLOCK_HEIGHT / 2})`}
            >
              <text
                x={15}
                y={-12}
                textAnchor="middle"
                fill="#64748b"
                className="font-mono"
                fontSize={10}
              >
                enqueue
              </text>
              <polygon
                points="5,-5 5,5 15,0"
                fill={VIZ_COLORS.active}
                opacity={0.6}
              />
            </g>
          )}

          {/* Empty label */}
          {queue.length === 0 && (
            <text
              x={svgWidth / 2}
              y={PADDING + BLOCK_HEIGHT / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#64748b"
              className="font-mono"
              fontSize={12}
            >
              empty queue
            </text>
          )}

          {/* Queue blocks */}
          <AnimatePresence>
            {queue.map((val, index) => {
              const x = PADDING + index * (BLOCK_WIDTH + BLOCK_GAP);
              const y = PADDING;
              const color = getBlockColor(index);
              const isFront = index === 0;
              const isRear = index === queue.length - 1;

              return (
                <motion.g
                  key={`${index}-${val}`}
                  initial={{ opacity: 0, x: x + 40 }}
                  animate={{ opacity: 1, x }}
                  exit={{ opacity: 0, x: x - 40 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.rect
                    x={0}
                    y={y}
                    width={BLOCK_WIDTH}
                    height={BLOCK_HEIGHT}
                    rx={6}
                    fill={color}
                    stroke={isFront || isRear ? "#fff" : "#334155"}
                    strokeWidth={isFront || isRear ? 2 : 1.5}
                    initial={false}
                    animate={{ fill: color }}
                    transition={{ duration: 0.2 }}
                  />
                  {/* Value */}
                  <text
                    x={BLOCK_WIDTH / 2}
                    y={y + BLOCK_HEIGHT / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    className="font-mono font-bold"
                    fontSize={14}
                  >
                    {val}
                  </text>
                  {/* Front/Rear labels */}
                  {isFront && (
                    <text
                      x={BLOCK_WIDTH / 2}
                      y={y + BLOCK_HEIGHT + 16}
                      textAnchor="middle"
                      fill={VIZ_COLORS.highlighted}
                      className="font-mono font-bold"
                      fontSize={10}
                    >
                      FRONT
                    </text>
                  )}
                  {isRear && (
                    <text
                      x={BLOCK_WIDTH / 2}
                      y={y + BLOCK_HEIGHT + 16}
                      textAnchor="middle"
                      fill={VIZ_COLORS.active}
                      className="font-mono font-bold"
                      fontSize={10}
                    >
                      REAR
                    </text>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
}
