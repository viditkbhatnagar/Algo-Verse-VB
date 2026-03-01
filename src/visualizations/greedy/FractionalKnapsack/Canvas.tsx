"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { FractionalKnapsackStepData, KnapsackItem } from "./logic";

interface FractionalKnapsackCanvasProps {
  step: VisualizationStep;
}

const ITEM_COLORS = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
];

export function FractionalKnapsackCanvas({ step }: FractionalKnapsackCanvasProps) {
  const data = step.data as FractionalKnapsackStepData;
  const { sortedItems, currentIndex, capacity, remainingCapacity, totalValue, selections, phase } = data;

  const selectionMap = new Map(selections.map((s) => [s.itemId, s]));

  const svgWidth = 560;
  const svgHeight = 320;

  // Items section
  const itemBarHeight = 32;
  const itemBarMaxWidth = 180;
  const itemBarGap = 6;
  const itemsX = 20;
  const itemsY = 30;

  // Knapsack section
  const knapsackX = 340;
  const knapsackY = 30;
  const knapsackWidth = 100;
  const knapsackHeight = 220;

  // Scale for item widths based on weight
  const maxWeight = Math.max(...sortedItems.map((item) => item.weight));

  return (
    <div className="overflow-x-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="select-none mx-auto"
      >
        {/* Items section header */}
        <text x={itemsX} y={18} className="fill-muted-foreground font-mono font-bold" fontSize={12}>
          Items (sorted by ratio)
        </text>

        {/* Item bars */}
        {sortedItems.map((item, i) => {
          const y = itemsY + i * (itemBarHeight + itemBarGap);
          const barWidth = (item.weight / maxWeight) * itemBarMaxWidth;
          const color = ITEM_COLORS[item.id % ITEM_COLORS.length];
          const selection = selectionMap.get(item.id);
          const isCurrent = i === currentIndex;

          let opacity = 1;
          if (selection && selection.fraction < 1) {
            opacity = 0.8;
          } else if (phase === "selecting" && i < currentIndex && !selection) {
            opacity = 0.3;
          }

          return (
            <g key={item.id}>
              {/* Item bar */}
              <motion.rect
                x={itemsX}
                y={y}
                width={barWidth}
                height={itemBarHeight}
                rx={4}
                initial={false}
                animate={{
                  fill: isCurrent ? VIZ_COLORS.active : color,
                  opacity,
                  strokeWidth: isCurrent ? 2 : 0,
                }}
                stroke={isCurrent ? "#fff" : "transparent"}
                transition={{ duration: 0.2 }}
              />

              {/* Item label */}
              <text
                x={itemsX + barWidth / 2}
                y={y + itemBarHeight / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                className="font-mono font-bold"
                fontSize={10}
              >
                w={item.weight} v={item.value}
              </text>

              {/* Ratio label */}
              <text
                x={itemsX + barWidth + 8}
                y={y + itemBarHeight / 2 - 6}
                dominantBaseline="central"
                className="font-mono"
                fill="#94a3b8"
                fontSize={9}
              >
                ratio: {item.ratio.toFixed(1)}
              </text>

              {/* Selection status */}
              {selection && (
                <text
                  x={itemsX + barWidth + 8}
                  y={y + itemBarHeight / 2 + 8}
                  dominantBaseline="central"
                  className="font-mono font-bold"
                  fill={VIZ_COLORS.completed}
                  fontSize={9}
                >
                  {selection.fraction === 1
                    ? "100%"
                    : `${(selection.fraction * 100).toFixed(0)}%`}{" "}
                  (+{selection.valueTaken.toFixed(1)})
                </text>
              )}
            </g>
          );
        })}

        {/* Knapsack section header */}
        <text
          x={knapsackX + knapsackWidth / 2}
          y={18}
          textAnchor="middle"
          className="fill-muted-foreground font-mono font-bold"
          fontSize={12}
        >
          Knapsack ({capacity})
        </text>

        {/* Knapsack container */}
        <rect
          x={knapsackX}
          y={knapsackY}
          width={knapsackWidth}
          height={knapsackHeight}
          rx={6}
          fill="#0f172a"
          stroke="#334155"
          strokeWidth={2}
        />

        {/* Knapsack fill */}
        {(() => {
          let yOffset = knapsackY + knapsackHeight;
          const rects: React.ReactNode[] = [];

          for (const selection of selections) {
            const fillHeight = (selection.weightTaken / capacity) * knapsackHeight;
            yOffset -= fillHeight;
            const color = ITEM_COLORS[selection.itemId % ITEM_COLORS.length];

            rects.push(
              <motion.rect
                key={selection.itemId}
                x={knapsackX + 2}
                y={yOffset}
                width={knapsackWidth - 4}
                height={fillHeight}
                rx={selection === selections[selections.length - 1] ? 4 : 0}
                initial={{ height: 0 }}
                animate={{ height: fillHeight, y: yOffset }}
                transition={{ duration: 0.3 }}
                fill={color}
                opacity={selection.fraction < 1 ? 0.7 : 0.9}
              />,
            );

            // Label inside
            if (fillHeight > 14) {
              rects.push(
                <text
                  key={`label-${selection.itemId}`}
                  x={knapsackX + knapsackWidth / 2}
                  y={yOffset + fillHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  className="font-mono font-bold"
                  fontSize={9}
                >
                  #{selection.itemId} ({(selection.fraction * 100).toFixed(0)}%)
                </text>,
              );
            }
          }

          return rects;
        })()}

        {/* Capacity labels */}
        <text
          x={knapsackX + knapsackWidth + 10}
          y={knapsackY + 10}
          className="fill-muted-foreground font-mono"
          fontSize={9}
        >
          0
        </text>
        <text
          x={knapsackX + knapsackWidth + 10}
          y={knapsackY + knapsackHeight}
          className="fill-muted-foreground font-mono"
          fontSize={9}
        >
          {capacity}
        </text>

        {/* Stats */}
        <text
          x={knapsackX + knapsackWidth / 2}
          y={knapsackY + knapsackHeight + 22}
          textAnchor="middle"
          className="font-mono font-bold"
          fill={VIZ_COLORS.highlighted}
          fontSize={11}
        >
          Value: {totalValue.toFixed(1)}
        </text>
        <text
          x={knapsackX + knapsackWidth / 2}
          y={knapsackY + knapsackHeight + 38}
          textAnchor="middle"
          className="font-mono"
          fill="#94a3b8"
          fontSize={10}
        >
          Remaining: {remainingCapacity}
        </text>
      </svg>
    </div>
  );
}
