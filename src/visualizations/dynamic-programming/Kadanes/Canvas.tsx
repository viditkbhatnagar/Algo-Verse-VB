"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";
import type { KadanesStepData } from "./logic";

interface KadanesCanvasProps {
  step: VisualizationStep;
}

const COLOR_MAP: Record<string, string> = {
  default: "#475569",
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

export function KadanesCanvas({ step }: KadanesCanvasProps) {
  const data = step.data as KadanesStepData;
  const { array, currentSum, maxSum, arrayHighlights, bestStart, bestEnd } = data;
  const n = array.length;

  // Calculate dimensions
  const barWidth = Math.min(48, Math.max(28, 500 / n));
  const padding = 40;
  const totalWidth = n * barWidth + padding * 2;

  // Find min/max for scaling bars
  const maxVal = Math.max(...array.map(Math.abs), 1);
  const barAreaHeight = 140;
  const zeroY = 80; // Y position of the zero line
  const scale = (barAreaHeight / 2) / maxVal;

  const svgHeight = 280;

  return (
    <div className="flex items-center justify-center p-4 overflow-x-auto">
      <svg
        width={totalWidth}
        height={svgHeight}
        viewBox={`0 0 ${totalWidth} ${svgHeight}`}
        className="mx-auto"
      >
        {/* Zero line */}
        <line
          x1={padding - 10}
          y1={zeroY}
          x2={totalWidth - padding + 10}
          y2={zeroY}
          stroke="#475569"
          strokeWidth={1}
          strokeDasharray="4,4"
          opacity={0.5}
        />
        <text
          x={padding - 14}
          y={zeroY + 4}
          textAnchor="end"
          fontSize={9}
          className="fill-muted-foreground"
          fontFamily="monospace"
        >
          0
        </text>

        {/* Index labels */}
        {array.map((_, i) => (
          <text
            key={`idx-${i}`}
            x={padding + i * barWidth + barWidth / 2}
            y={zeroY + barAreaHeight / 2 + 22}
            textAnchor="middle"
            fontSize={9}
            className="fill-muted-foreground"
            fontFamily="monospace"
          >
            {i}
          </text>
        ))}

        {/* Array bars */}
        {array.map((val, i) => {
          const highlight = arrayHighlights[i];
          const barColor = highlight ? COLOR_MAP[highlight] : "#1e293b";
          const barHeight = Math.abs(val) * scale;
          const barY = val >= 0 ? zeroY - barHeight : zeroY;

          return (
            <g key={`bar-${i}`}>
              <motion.rect
                x={padding + i * barWidth + 2}
                y={barY}
                width={barWidth - 4}
                height={Math.max(barHeight, 2)}
                rx={3}
                initial={false}
                animate={{
                  fill: barColor,
                  opacity: 1,
                }}
                transition={{ duration: 0.15 }}
              />
              {/* Value label */}
              <text
                x={padding + i * barWidth + barWidth / 2}
                y={val >= 0 ? barY - 5 : barY + barHeight + 13}
                textAnchor="middle"
                fontSize={11}
                fontFamily="monospace"
                className={highlight ? "fill-white font-bold" : "fill-foreground"}
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Current subarray bracket */}
        {data.subarrayStart >= 0 && data.subarrayEnd >= 0 && data.currentIndex >= 0 && (
          <>
            <line
              x1={padding + data.subarrayStart * barWidth + 2}
              y1={zeroY + barAreaHeight / 2 + 30}
              x2={padding + (data.subarrayEnd + 1) * barWidth - 2}
              y2={zeroY + barAreaHeight / 2 + 30}
              stroke={VIZ_COLORS.window}
              strokeWidth={2}
              opacity={0.8}
            />
            <text
              x={padding + (data.subarrayStart + data.subarrayEnd + 1) * barWidth / 2}
              y={zeroY + barAreaHeight / 2 + 44}
              textAnchor="middle"
              fontSize={10}
              fontFamily="monospace"
              fill={VIZ_COLORS.window}
            >
              curr: {currentSum}
            </text>
          </>
        )}

        {/* Stats panel */}
        <g>
          <rect
            x={padding}
            y={svgHeight - 50}
            width={totalWidth - padding * 2}
            height={40}
            rx={6}
            fill="#1e293b"
            stroke="#334155"
            strokeWidth={1}
          />
          <text
            x={padding + 12}
            y={svgHeight - 26}
            fontSize={12}
            fontFamily="monospace"
            fill={VIZ_COLORS.highlighted}
          >
            currentSum: {currentSum}
          </text>
          <text
            x={totalWidth / 2}
            y={svgHeight - 26}
            fontSize={12}
            fontFamily="monospace"
            fill={VIZ_COLORS.completed}
          >
            maxSum: {maxSum}
          </text>
          <text
            x={totalWidth - padding - 12}
            y={svgHeight - 26}
            textAnchor="end"
            fontSize={12}
            fontFamily="monospace"
            fill="#a78bfa"
          >
            best: [{bestStart}..{bestEnd}]
          </text>
        </g>
      </svg>
    </div>
  );
}
