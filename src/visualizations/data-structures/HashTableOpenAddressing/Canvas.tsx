"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep, HashTableStepData, HighlightColor } from "@/lib/visualization/types";

interface HashTableOACanvasProps {
  step: VisualizationStep;
}

const COLOR_MAP: Record<HighlightColor | "default", string> = {
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

const SLOT_WIDTH = 72;
const SLOT_HEIGHT = 50;
const SLOT_GAP = 6;
const TOP_OFFSET = 50;
const LEFT_OFFSET = 20;

export function HashTableOACanvas({ step }: HashTableOACanvasProps) {
  const data = step.data as HashTableStepData;
  const { buckets, probeSequence = [], currentBucket, hashComputation, loadFactor } = data;

  const probeSet = new Set(probeSequence);
  const svgWidth = LEFT_OFFSET + buckets.length * (SLOT_WIDTH + SLOT_GAP) + 20;
  const svgHeight = TOP_OFFSET + SLOT_HEIGHT + 80;

  return (
    <div className="space-y-3">
      {/* Hash computation and load factor */}
      <div className="flex flex-wrap items-center gap-4 px-2">
        {hashComputation && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">Hash:</span>
            <motion.span
              key={hashComputation}
              className="text-sm font-mono text-cyan-400 bg-surface px-2 py-0.5 rounded border border-border/50"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {hashComputation}
            </motion.span>
          </div>
        )}
        {loadFactor !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">Load Factor:</span>
            <span className={`text-sm font-mono ${loadFactor > 0.7 ? "text-red-400" : "text-amber-400"}`}>
              {loadFactor.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* SVG Linear Array */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-2xl mx-auto select-none"
          style={{ minHeight: 180 }}
        >
          {/* Probe sequence arrows */}
          {probeSequence.length > 1 && probeSequence.map((slotIdx, i) => {
            if (i === 0) return null;
            const prevIdx = probeSequence[i - 1];
            const x1 = LEFT_OFFSET + prevIdx * (SLOT_WIDTH + SLOT_GAP) + SLOT_WIDTH / 2;
            const x2 = LEFT_OFFSET + slotIdx * (SLOT_WIDTH + SLOT_GAP) + SLOT_WIDTH / 2;
            const y = TOP_OFFSET - 14;

            // Calculate curve for the arrow
            const midX = (x1 + x2) / 2;
            const curveY = y - Math.min(20, Math.abs(x2 - x1) * 0.15);

            return (
              <g key={`probe-${i}`}>
                <motion.path
                  d={`M ${x1} ${y} Q ${midX} ${curveY} ${x2} ${y}`}
                  fill="none"
                  stroke={VIZ_COLORS.comparing}
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  markerEnd="url(#probe-arrow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                />
              </g>
            );
          })}

          {/* Slot index labels */}
          {buckets.map((bucket, i) => {
            const x = LEFT_OFFSET + i * (SLOT_WIDTH + SLOT_GAP);
            return (
              <text
                key={`label-${i}`}
                x={x + SLOT_WIDTH / 2}
                y={TOP_OFFSET - 2}
                textAnchor="middle"
                fill="#94a3b8"
                className="font-mono"
                fontSize={11}
              >
                [{i}]
              </text>
            );
          })}

          {/* Slot rectangles */}
          {buckets.map((bucket, i) => {
            const x = LEFT_OFFSET + i * (SLOT_WIDTH + SLOT_GAP);
            const isCurrent = currentBucket === i;
            const isInProbe = probeSet.has(i) && !isCurrent;
            const hasItem = bucket.items.length > 0;
            const itemHighlight = hasItem ? bucket.items[0].highlight : undefined;

            let fillColor = "#1e293b";
            let borderColor = "#334155";

            if (isCurrent && hasItem && itemHighlight) {
              fillColor = COLOR_MAP[itemHighlight] + "33";
              borderColor = COLOR_MAP[itemHighlight];
            } else if (isCurrent) {
              fillColor = "rgba(99, 102, 241, 0.2)";
              borderColor = VIZ_COLORS.active;
            } else if (itemHighlight) {
              fillColor = COLOR_MAP[itemHighlight] + "22";
              borderColor = COLOR_MAP[itemHighlight];
            } else if (isInProbe) {
              fillColor = "rgba(245, 158, 11, 0.1)";
              borderColor = VIZ_COLORS.comparing;
            }

            return (
              <g key={`slot-${i}`}>
                <motion.rect
                  x={x}
                  y={TOP_OFFSET + 10}
                  width={SLOT_WIDTH}
                  height={SLOT_HEIGHT}
                  rx={5}
                  fill={fillColor}
                  stroke={borderColor}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                  initial={false}
                  animate={{ fill: fillColor, stroke: borderColor }}
                  transition={{ duration: 0.2 }}
                />
                {hasItem ? (
                  <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <text
                      x={x + SLOT_WIDTH / 2}
                      y={TOP_OFFSET + 10 + SLOT_HEIGHT / 2 - 6}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      className="font-mono font-bold"
                      fontSize={14}
                    >
                      {bucket.items[0].key}
                    </text>
                    <text
                      x={x + SLOT_WIDTH / 2}
                      y={TOP_OFFSET + 10 + SLOT_HEIGHT / 2 + 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#94a3b8"
                      className="font-mono"
                      fontSize={10}
                    >
                      {bucket.items[0].value}
                    </text>
                  </motion.g>
                ) : (
                  <text
                    x={x + SLOT_WIDTH / 2}
                    y={TOP_OFFSET + 10 + SLOT_HEIGHT / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#475569"
                    className="font-mono"
                    fontSize={10}
                  >
                    empty
                  </text>
                )}
              </g>
            );
          })}

          {/* Probe sequence legend */}
          {probeSequence.length > 1 && (
            <text
              x={svgWidth / 2}
              y={TOP_OFFSET + SLOT_HEIGHT + 35}
              textAnchor="middle"
              fill="#94a3b8"
              className="font-mono"
              fontSize={11}
            >
              Probe sequence: [{probeSequence.join(" → ")}]
            </text>
          )}

          {/* Arrow marker definitions */}
          <defs>
            <marker
              id="probe-arrow"
              markerWidth="6"
              markerHeight="4"
              refX="5"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 6 2, 0 4" fill={VIZ_COLORS.comparing} />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
