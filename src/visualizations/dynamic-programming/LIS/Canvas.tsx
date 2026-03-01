"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";
import type { LISStepData } from "./logic";

interface LISCanvasProps {
  step: VisualizationStep;
}

const COLOR_MAP: Record<HighlightColor | "default", string> = {
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

export function LISCanvas({ step }: LISCanvasProps) {
  const data = step.data as LISStepData;
  const { array, dp, arrayHighlights, dpHighlights, subsequenceIndices } = data;
  const n = array.length;

  const cellWidth = Math.min(56, Math.max(36, 500 / n));
  const cellHeight = 40;
  const totalWidth = n * cellWidth + 40;
  const svgHeight = 220;

  // Calculate positions
  const startX = 20;
  const arrY = 30;
  const dpY = arrY + cellHeight + 40;
  const subY = dpY + cellHeight + 40;

  return (
    <div className="flex items-center justify-center p-4 overflow-x-auto">
      <svg
        width={totalWidth}
        height={svgHeight}
        viewBox={`0 0 ${totalWidth} ${svgHeight}`}
        className="mx-auto"
      >
        {/* Labels */}
        <text x={startX - 5} y={arrY + cellHeight / 2 + 5} className="fill-muted-foreground" fontSize={11} textAnchor="end" fontFamily="monospace">
          arr
        </text>
        <text x={startX - 5} y={dpY + cellHeight / 2 + 5} className="fill-muted-foreground" fontSize={11} textAnchor="end" fontFamily="monospace">
          dp
        </text>

        {/* Index labels */}
        {array.map((_, i) => (
          <text
            key={`idx-${i}`}
            x={startX + i * cellWidth + cellWidth / 2}
            y={arrY - 6}
            textAnchor="middle"
            fontSize={9}
            className="fill-muted-foreground"
            fontFamily="monospace"
          >
            {i}
          </text>
        ))}

        {/* Array cells */}
        {array.map((val, i) => {
          const highlight = arrayHighlights[i];
          const bgColor = highlight ? COLOR_MAP[highlight] : "#1e293b";
          const isInSubseq = subsequenceIndices.includes(i);

          return (
            <g key={`arr-${i}`}>
              <motion.rect
                x={startX + i * cellWidth}
                y={arrY}
                width={cellWidth - 2}
                height={cellHeight}
                rx={4}
                initial={false}
                animate={{
                  fill: bgColor,
                  strokeWidth: isInSubseq && !highlight ? 2 : 1,
                  stroke: isInSubseq && !highlight ? "#a78bfa" : "#334155",
                }}
                transition={{ duration: 0.15 }}
              />
              <text
                x={startX + i * cellWidth + (cellWidth - 2) / 2}
                y={arrY + cellHeight / 2 + 5}
                textAnchor="middle"
                fontSize={13}
                fontFamily="monospace"
                className={highlight ? "fill-white font-bold" : "fill-foreground"}
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* DP cells */}
        {dp.map((val, i) => {
          const highlight = dpHighlights[i];
          const bgColor = highlight ? COLOR_MAP[highlight] : "#1e293b";

          return (
            <g key={`dp-${i}`}>
              <motion.rect
                x={startX + i * cellWidth}
                y={dpY}
                width={cellWidth - 2}
                height={cellHeight}
                rx={4}
                initial={false}
                animate={{
                  fill: bgColor,
                  stroke: "#334155",
                }}
                transition={{ duration: 0.15 }}
              />
              <text
                x={startX + i * cellWidth + (cellWidth - 2) / 2}
                y={dpY + cellHeight / 2 + 5}
                textAnchor="middle"
                fontSize={13}
                fontFamily="monospace"
                className={highlight ? "fill-white font-bold" : "fill-foreground"}
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Arrows between current and compare index */}
        {data.currentIndex >= 0 && data.compareIndex >= 0 && (
          <motion.line
            x1={startX + data.compareIndex * cellWidth + (cellWidth - 2) / 2}
            y1={arrY + cellHeight + 2}
            x2={startX + data.currentIndex * cellWidth + (cellWidth - 2) / 2}
            y2={arrY + cellHeight + 2}
            stroke={VIZ_COLORS.comparing}
            strokeWidth={1.5}
            strokeDasharray="4,3"
            opacity={0.6}
            initial={false}
            animate={{ opacity: 0.6 }}
          />
        )}

        {/* Subsequence display */}
        {subsequenceIndices.length > 0 && (
          <>
            <text x={startX - 5} y={subY + cellHeight / 2 + 5} className="fill-muted-foreground" fontSize={11} textAnchor="end" fontFamily="monospace">
              LIS
            </text>
            {data.subsequence.map((val, i) => (
              <g key={`sub-${i}`}>
                <motion.rect
                  x={startX + i * cellWidth}
                  y={subY}
                  width={cellWidth - 2}
                  height={cellHeight}
                  rx={4}
                  fill="#a78bfa"
                  stroke="#7c3aed"
                  strokeWidth={1.5}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.2 }}
                />
                <motion.text
                  x={startX + i * cellWidth + (cellWidth - 2) / 2}
                  y={subY + cellHeight / 2 + 5}
                  textAnchor="middle"
                  fontSize={13}
                  fontFamily="monospace"
                  className="fill-white font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.15 }}
                >
                  {val}
                </motion.text>
              </g>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
