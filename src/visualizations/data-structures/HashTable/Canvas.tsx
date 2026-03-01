"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep, HashTableStepData, HighlightColor } from "@/lib/visualization/types";

interface HashTableCanvasProps {
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
  "mst-edge": VIZ_COLORS.mstEdge,
  relaxed: VIZ_COLORS.relaxed,
  backtracked: VIZ_COLORS.backtracked,
  window: VIZ_COLORS.window,
};

const BUCKET_WIDTH = 60;
const BUCKET_HEIGHT = 36;
const BUCKET_GAP = 12;
const ITEM_HEIGHT = 32;
const ITEM_GAP = 4;
const TOP_OFFSET = 50;
const LEFT_OFFSET = 40;

export function HashTableChainingCanvas({ step }: HashTableCanvasProps) {
  const data = step.data as HashTableStepData;
  const { buckets, currentBucket, hashComputation, loadFactor } = data;

  const maxChainLength = Math.max(1, ...buckets.map((b) => b.items.length));
  const svgWidth = LEFT_OFFSET + buckets.length * (BUCKET_WIDTH + BUCKET_GAP) + 20;
  const svgHeight = TOP_OFFSET + BUCKET_HEIGHT + maxChainLength * (ITEM_HEIGHT + ITEM_GAP) + 60;

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
            <span className="text-sm font-mono text-amber-400">
              {loadFactor.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* SVG Hash Table */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-2xl mx-auto select-none"
          style={{ minHeight: 200 }}
        >
          {/* Bucket index labels */}
          {buckets.map((bucket, i) => {
            const x = LEFT_OFFSET + i * (BUCKET_WIDTH + BUCKET_GAP);
            return (
              <text
                key={`label-${i}`}
                x={x + BUCKET_WIDTH / 2}
                y={TOP_OFFSET - 10}
                textAnchor="middle"
                fill="#94a3b8"
                className="font-mono"
                fontSize={11}
              >
                [{i}]
              </text>
            );
          })}

          {/* Bucket rectangles */}
          {buckets.map((bucket, i) => {
            const x = LEFT_OFFSET + i * (BUCKET_WIDTH + BUCKET_GAP);
            const isCurrent = currentBucket === i;
            const isEmpty = bucket.items.length === 0;
            const borderColor = isCurrent
              ? VIZ_COLORS.comparing
              : isEmpty
                ? "#334155"
                : "#475569";

            return (
              <motion.rect
                key={`bucket-${i}`}
                x={x}
                y={TOP_OFFSET}
                width={BUCKET_WIDTH}
                height={BUCKET_HEIGHT}
                rx={4}
                fill={isCurrent ? "rgba(245, 158, 11, 0.15)" : "#1e293b"}
                stroke={borderColor}
                strokeWidth={isCurrent ? 2 : 1.5}
                initial={false}
                animate={{
                  fill: isCurrent ? "rgba(245, 158, 11, 0.15)" : "#1e293b",
                  stroke: borderColor,
                }}
                transition={{ duration: 0.2 }}
              />
            );
          })}

          {/* Bucket content: "empty" or chain arrow */}
          {buckets.map((bucket, i) => {
            const x = LEFT_OFFSET + i * (BUCKET_WIDTH + BUCKET_GAP);
            if (bucket.items.length === 0) {
              return (
                <text
                  key={`empty-${i}`}
                  x={x + BUCKET_WIDTH / 2}
                  y={TOP_OFFSET + BUCKET_HEIGHT / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#475569"
                  fontSize={10}
                  className="font-mono"
                >
                  null
                </text>
              );
            }
            // Down arrow from bucket to first chain item
            const arrowStartY = TOP_OFFSET + BUCKET_HEIGHT;
            const arrowEndY = TOP_OFFSET + BUCKET_HEIGHT + ITEM_GAP + 2;
            return (
              <line
                key={`arrow-${i}`}
                x1={x + BUCKET_WIDTH / 2}
                y1={arrowStartY}
                x2={x + BUCKET_WIDTH / 2}
                y2={arrowEndY}
                stroke="#64748b"
                strokeWidth={1.5}
                markerEnd="url(#chain-arrow)"
              />
            );
          })}

          {/* Chain items */}
          {buckets.map((bucket, i) => {
            const x = LEFT_OFFSET + i * (BUCKET_WIDTH + BUCKET_GAP);
            const chainStartY = TOP_OFFSET + BUCKET_HEIGHT + ITEM_GAP + 4;

            return bucket.items.map((item, j) => {
              const itemY = chainStartY + j * (ITEM_HEIGHT + ITEM_GAP);
              const fillColor = item.highlight
                ? COLOR_MAP[item.highlight]
                : "#1e293b";
              const borderColor = item.highlight
                ? COLOR_MAP[item.highlight]
                : "#475569";

              return (
                <g key={`item-${i}-${j}`}>
                  {/* Connector line between chain items */}
                  {j > 0 && (
                    <line
                      x1={x + BUCKET_WIDTH / 2}
                      y1={itemY - ITEM_GAP}
                      x2={x + BUCKET_WIDTH / 2}
                      y2={itemY}
                      stroke="#64748b"
                      strokeWidth={1}
                    />
                  )}
                  <motion.rect
                    x={x + 2}
                    y={itemY}
                    width={BUCKET_WIDTH - 4}
                    height={ITEM_HEIGHT}
                    rx={3}
                    fill={fillColor}
                    stroke={borderColor}
                    strokeWidth={1.5}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, fill: fillColor }}
                    transition={{ duration: 0.25 }}
                  />
                  <text
                    x={x + BUCKET_WIDTH / 2}
                    y={itemY + ITEM_HEIGHT / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={11}
                    className="font-mono font-bold"
                  >
                    {item.key}
                  </text>
                </g>
              );
            });
          })}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="chain-arrow"
              markerWidth="6"
              markerHeight="4"
              refX="5"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 6 2, 0 4" fill="#64748b" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
