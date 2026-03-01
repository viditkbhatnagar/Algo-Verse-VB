"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { ActivitySelectionStepData } from "./logic";

interface ActivitySelectionCanvasProps {
  step: VisualizationStep;
}

export function ActivitySelectionCanvas({ step }: ActivitySelectionCanvasProps) {
  const data = step.data as ActivitySelectionStepData;
  const { sortedActivities, currentIndex, selectedIds, skippedIds, lastFinishTime, phase } = data;

  const selectedSet = new Set(selectedIds);
  const skippedSet = new Set(skippedIds);

  // Find the time range
  const maxFinish = Math.max(...sortedActivities.map((a) => a.finish));
  const barHeight = 24;
  const barGap = 4;
  const labelWidth = 60;
  const timeWidth = 480;
  const padding = 20;

  const svgWidth = labelWidth + timeWidth + padding * 2;
  const svgHeight = sortedActivities.length * (barHeight + barGap) + padding * 2 + 30;

  const xScale = (time: number) =>
    labelWidth + padding + (time / maxFinish) * (timeWidth - padding);

  return (
    <div className="overflow-x-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="select-none mx-auto"
      >
        {/* Time axis */}
        <line
          x1={labelWidth + padding}
          y1={svgHeight - 20}
          x2={labelWidth + timeWidth + padding}
          y2={svgHeight - 20}
          stroke="#334155"
          strokeWidth={1}
        />
        {/* Time labels */}
        {Array.from({ length: maxFinish + 1 }, (_, i) => i)
          .filter((t) => t % 2 === 0)
          .map((t) => (
            <g key={t}>
              <line
                x1={xScale(t)}
                y1={svgHeight - 24}
                x2={xScale(t)}
                y2={svgHeight - 16}
                stroke="#475569"
                strokeWidth={1}
              />
              <text
                x={xScale(t)}
                y={svgHeight - 6}
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                fontSize={9}
              >
                {t}
              </text>
            </g>
          ))}

        {/* Last finish time line */}
        {lastFinishTime >= 0 && phase !== "unsorted" && (
          <motion.line
            x1={xScale(lastFinishTime)}
            y1={padding - 5}
            x2={xScale(lastFinishTime)}
            y2={svgHeight - 25}
            stroke={VIZ_COLORS.active}
            strokeWidth={2}
            strokeDasharray="4 2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          />
        )}

        {/* Activity bars */}
        {sortedActivities.map((activity, i) => {
          const y = padding + i * (barHeight + barGap);
          const x1 = xScale(activity.start);
          const x2 = xScale(activity.finish);
          const width = x2 - x1;

          const isSelected = selectedSet.has(activity.id);
          const isSkipped = skippedSet.has(activity.id);
          const isCurrent = i === currentIndex;

          let fillColor: string;
          if (isCurrent) {
            fillColor = VIZ_COLORS.active;
          } else if (isSelected) {
            fillColor = VIZ_COLORS.completed;
          } else if (isSkipped) {
            fillColor = VIZ_COLORS.swapping;
          } else {
            fillColor = VIZ_COLORS.default;
          }

          const opacity = isSkipped ? 0.4 : 1;

          return (
            <g key={activity.id}>
              {/* Activity label */}
              <text
                x={labelWidth + padding - 8}
                y={y + barHeight / 2}
                textAnchor="end"
                dominantBaseline="central"
                className="font-mono"
                fontSize={10}
                fill={isCurrent ? VIZ_COLORS.active : "#94a3b8"}
              >
                ({activity.start},{activity.finish})
              </text>

              {/* Activity bar */}
              <motion.rect
                x={x1}
                y={y}
                width={Math.max(width, 2)}
                height={barHeight}
                rx={4}
                initial={false}
                animate={{
                  fill: fillColor,
                  opacity,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Time range label inside bar */}
              {width > 30 && (
                <text
                  x={x1 + width / 2}
                  y={y + barHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  className="font-mono font-bold"
                  fontSize={10}
                >
                  {activity.start}-{activity.finish}
                </text>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <text
                  x={x2 + 6}
                  y={y + barHeight / 2}
                  dominantBaseline="central"
                  fill={VIZ_COLORS.completed}
                  className="font-mono font-bold"
                  fontSize={11}
                >
                  &#10003;
                </text>
              )}
              {isSkipped && (
                <text
                  x={x2 + 6}
                  y={y + barHeight / 2}
                  dominantBaseline="central"
                  fill={VIZ_COLORS.swapping}
                  className="font-mono"
                  fontSize={11}
                >
                  &#10007;
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Summary */}
      <div className="flex justify-center gap-6 mt-2 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: VIZ_COLORS.completed }} />
          <span className="text-muted-foreground">Selected ({selectedIds.length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm opacity-40" style={{ backgroundColor: VIZ_COLORS.swapping }} />
          <span className="text-muted-foreground">Skipped ({skippedIds.length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: VIZ_COLORS.active }} />
          <span className="text-muted-foreground">Current</span>
        </div>
      </div>
    </div>
  );
}
