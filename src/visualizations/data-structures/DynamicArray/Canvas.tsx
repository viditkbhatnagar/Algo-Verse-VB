"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { DynamicArrayStepData } from "./logic";

interface DynamicArrayCanvasProps {
  step: VisualizationStep;
}

const CELL_SIZE = 44;
const CELL_GAP = 4;
const PADDING = 20;

export function DynamicArrayCanvas({ step }: DynamicArrayCanvasProps) {
  const data = step.data as DynamicArrayStepData;
  const { array, size, capacity, operation, value, highlights, oldArray, oldCapacity, isResizing } = data;

  const highlightMap = new Map<number, string>();
  for (const h of highlights) {
    highlightMap.set(h.index, h.color);
  }

  const maxCells = Math.max(capacity, oldCapacity ?? 0);
  const totalWidth = maxCells * (CELL_SIZE + CELL_GAP) + PADDING * 2 + 20;
  const svgHeight = isResizing ? 200 : 120;

  function getCellColor(index: number, isOld: boolean = false): string {
    if (isOld) return "#334155";
    if (highlightMap.has(index)) return highlightMap.get(index)!;
    if (index >= size) return "#1e293b";
    return VIZ_COLORS.default;
  }

  return (
    <div className="flex flex-col items-center">
      {/* Operation + metrics */}
      <div className="mb-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono text-muted-foreground">Operation:</span>
        <span
          className="px-2 py-0.5 rounded text-xs font-mono font-bold"
          style={{
            backgroundColor:
              operation === "push"
                ? VIZ_COLORS.active
                : operation === "pop"
                  ? VIZ_COLORS.swapping
                  : operation === "resize-start" || operation === "resize-copy"
                    ? VIZ_COLORS.comparing
                    : operation === "complete"
                      ? VIZ_COLORS.completed
                      : VIZ_COLORS.default,
            color: "#fff",
          }}
        >
          {operation}
          {value !== undefined && !operation.startsWith("resize") ? `(${value})` : ""}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          Size: {size}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          Capacity: {capacity}
        </span>
        {size === capacity && operation !== "complete" && (
          <span className="px-1.5 py-0.5 rounded text-xs font-mono font-bold bg-red-900/50 text-red-400">
            FULL
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg
          width={Math.max(totalWidth, 200)}
          height={svgHeight}
          className="select-none mx-auto"
        >
          {/* During resize: show old array on top */}
          {isResizing && oldArray && oldCapacity && (
            <g transform={`translate(${PADDING}, 10)`}>
              <text
                x={0}
                y={-2}
                fill="#64748b"
                className="font-mono"
                fontSize={10}
              >
                Old array (capacity {oldCapacity}):
              </text>
              {oldArray.map((val, index) => {
                const x = index * (CELL_SIZE + CELL_GAP);
                const isEmpty = val === null;
                return (
                  <g key={`old-${index}`}>
                    <rect
                      x={x}
                      y={8}
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      rx={4}
                      fill={isEmpty ? "#1e293b" : "#334155"}
                      stroke="#1e293b"
                      strokeWidth={1}
                      opacity={0.6}
                    />
                    <text
                      x={x + CELL_SIZE / 2}
                      y={8 + CELL_SIZE / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#94a3b8"
                      className="font-mono"
                      fontSize={12}
                      opacity={0.6}
                    >
                      {val !== null ? val : ""}
                    </text>
                  </g>
                );
              })}

              {/* Copy arrows */}
              {operation === "resize-copy" &&
                oldArray.slice(0, size).map((_, index) => {
                  const x = index * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2;
                  return (
                    <motion.line
                      key={`arrow-${index}`}
                      x1={x}
                      y1={8 + CELL_SIZE + 4}
                      x2={x}
                      y2={8 + CELL_SIZE + 24}
                      stroke={VIZ_COLORS.highlighted}
                      strokeWidth={1.5}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      markerEnd="url(#copy-arrow)"
                    />
                  );
                })}
            </g>
          )}

          {/* Main (new) array */}
          <g
            transform={`translate(${PADDING}, ${isResizing ? 100 : PADDING})`}
          >
            {isResizing && (
              <text
                x={0}
                y={-2}
                fill={VIZ_COLORS.highlighted}
                className="font-mono font-bold"
                fontSize={10}
              >
                New array (capacity {capacity}):
              </text>
            )}
            {array.map((val, index) => {
              const x = index * (CELL_SIZE + CELL_GAP);
              const color = getCellColor(index);
              const isEmpty = index >= size;

              return (
                <g key={`new-${index}`}>
                  <motion.rect
                    x={x}
                    y={8}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx={4}
                    fill={color}
                    stroke={isEmpty ? "#1e293b" : "#334155"}
                    strokeWidth={1.5}
                    strokeDasharray={isEmpty ? "4 2" : undefined}
                    initial={false}
                    animate={{ fill: color }}
                    transition={{ duration: 0.2 }}
                  />
                  <text
                    x={x + CELL_SIZE / 2}
                    y={8 + CELL_SIZE / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isEmpty ? "#334155" : "#e2e8f0"}
                    className="font-mono font-bold"
                    fontSize={12}
                  >
                    {val !== null ? val : ""}
                  </text>
                  {/* Index labels */}
                  <text
                    x={x + CELL_SIZE / 2}
                    y={8 + CELL_SIZE + 14}
                    textAnchor="middle"
                    className="fill-muted-foreground/60 font-mono"
                    fontSize={9}
                  >
                    {index}
                  </text>
                </g>
              );
            })}

            {/* Capacity bar */}
            <line
              x1={0}
              y1={8 + CELL_SIZE + 26}
              x2={capacity * (CELL_SIZE + CELL_GAP) - CELL_GAP}
              y2={8 + CELL_SIZE + 26}
              stroke="#334155"
              strokeWidth={1}
              strokeDasharray="3 2"
            />
            <text
              x={(capacity * (CELL_SIZE + CELL_GAP) - CELL_GAP) / 2}
              y={8 + CELL_SIZE + 38}
              textAnchor="middle"
              fill="#64748b"
              className="font-mono"
              fontSize={9}
            >
              capacity = {capacity}
            </text>

            {/* Size bar */}
            {size > 0 && (
              <>
                <line
                  x1={0}
                  y1={8 + CELL_SIZE + 26}
                  x2={size * (CELL_SIZE + CELL_GAP) - CELL_GAP}
                  y2={8 + CELL_SIZE + 26}
                  stroke={VIZ_COLORS.active}
                  strokeWidth={2}
                />
                <text
                  x={(size * (CELL_SIZE + CELL_GAP) - CELL_GAP) / 2}
                  y={8 + CELL_SIZE + 48}
                  textAnchor="middle"
                  fill={VIZ_COLORS.active}
                  className="font-mono"
                  fontSize={9}
                >
                  size = {size}
                </text>
              </>
            )}
          </g>

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="copy-arrow"
              markerWidth={6}
              markerHeight={6}
              refX={3}
              refY={3}
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill={VIZ_COLORS.highlighted} />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
