"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { KMPStepData } from "./logic";

interface KMPCanvasProps {
  step: VisualizationStep;
}

const CELL_W = 32;
const CELL_H = 36;
const GAP = 8;
const PAD = 16;

function charColor(
  state: "match" | "mismatch" | "comparing" | "skip" | undefined
): string {
  switch (state) {
    case "match":
      return VIZ_COLORS.completed;
    case "mismatch":
      return VIZ_COLORS.swapping;
    case "comparing":
      return VIZ_COLORS.active;
    case "skip":
      return VIZ_COLORS.highlighted;
    default:
      return "#334155";
  }
}

export function KMPCanvas({ step }: KMPCanvasProps) {
  const data = step.data as KMPStepData;
  const { text, pattern, lps, lpsBuilt, offset, charStates, matchedIndices, lpsI } = data;

  const maxLen = Math.max(text.length, pattern.length + 4);
  const svgWidth = Math.max(maxLen * CELL_W + PAD * 2 + 40, 500);

  const lpsTableY = PAD;
  const textY = lpsBuilt ? PAD + 20 : PAD + CELL_H + 50;
  const patternY = textY + CELL_H + GAP;
  const svgHeight = patternY + CELL_H + 50;

  return (
    <div className="overflow-x-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="mx-auto"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        {/* LPS Table */}
        <text
          x={PAD}
          y={lpsTableY}
          fontSize={11}
          fontFamily="monospace"
          className="fill-muted-foreground"
        >
          LPS Table:
        </text>

        {pattern.split("").map((ch, j) => {
          const x = PAD + 80 + j * CELL_W;
          const isCurrentLPS = !lpsBuilt && lpsI === j;

          return (
            <g key={`lps-${j}`}>
              {/* Pattern char */}
              <text
                x={x + CELL_W / 2}
                y={lpsTableY}
                textAnchor="middle"
                fontSize={11}
                fontFamily="monospace"
                fill="#94a3b8"
              >
                {ch}
              </text>
              {/* LPS value */}
              <motion.rect
                x={x + 2}
                y={lpsTableY + 4}
                width={CELL_W - 4}
                height={20}
                rx={3}
                initial={false}
                animate={{
                  fill: isCurrentLPS ? VIZ_COLORS.active : "#1e293b",
                }}
                transition={{ duration: 0.15 }}
                stroke="#475569"
                strokeWidth={0.5}
              />
              <text
                x={x + CELL_W / 2}
                y={lpsTableY + 18}
                textAnchor="middle"
                fontSize={11}
                fontWeight={isCurrentLPS ? "bold" : "normal"}
                fontFamily="monospace"
                fill={isCurrentLPS ? "#fff" : "#cbd5e1"}
              >
                {lps[j] !== undefined ? lps[j] : "-"}
              </text>
            </g>
          );
        })}

        {/* Only show text/pattern rows when lpsBuilt or during matching */}
        {lpsBuilt && (
          <>
            {/* Index labels */}
            {text.split("").map((_, i) => (
              <text
                key={`idx-${i}`}
                x={PAD + i * CELL_W + CELL_W / 2}
                y={textY - 6}
                textAnchor="middle"
                fontSize={8}
                fontFamily="monospace"
                className="fill-muted-foreground"
              >
                {i}
              </text>
            ))}

            {/* Text row */}
            {text.split("").map((ch, i) => {
              const x = PAD + i * CELL_W;
              const state = charStates[i];
              const isInMatch = matchedIndices.some(
                (mi) => i >= mi && i < mi + pattern.length
              );
              const bg = state
                ? charColor(state)
                : isInMatch
                  ? "#1e3a2e"
                  : "#1e293b";

              return (
                <g key={`t-${i}`}>
                  <motion.rect
                    x={x}
                    y={textY}
                    width={CELL_W - 2}
                    height={CELL_H}
                    rx={3}
                    initial={false}
                    animate={{ fill: bg }}
                    transition={{ duration: 0.15 }}
                    stroke="#475569"
                    strokeWidth={0.5}
                  />
                  <text
                    x={x + CELL_W / 2 - 1}
                    y={textY + CELL_H / 2 + 5}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={state ? "bold" : "normal"}
                    fontFamily="monospace"
                    fill={state ? "#fff" : "#cbd5e1"}
                  >
                    {ch}
                  </text>
                </g>
              );
            })}

            {/* Pattern row (aligned at offset) */}
            {pattern.split("").map((ch, j) => {
              const x = PAD + (offset + j) * CELL_W;
              const textIdx = offset + j;
              const state = charStates[textIdx];
              const bg = state ? charColor(state) : "#334155";

              return (
                <g key={`p-${j}`}>
                  <motion.rect
                    x={x}
                    y={patternY}
                    width={CELL_W - 2}
                    height={CELL_H}
                    rx={3}
                    initial={false}
                    animate={{ fill: bg }}
                    transition={{ duration: 0.15 }}
                    stroke={VIZ_COLORS.active}
                    strokeWidth={1}
                    strokeOpacity={0.5}
                  />
                  <text
                    x={x + CELL_W / 2 - 1}
                    y={patternY + CELL_H / 2 + 5}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight="bold"
                    fontFamily="monospace"
                    fill="#fff"
                  >
                    {ch}
                  </text>
                </g>
              );
            })}

            {/* Match indicators */}
            {matchedIndices.length > 0 && (
              <text
                x={PAD}
                y={patternY + CELL_H + 20}
                fontSize={11}
                fontFamily="monospace"
                className="fill-emerald-400"
              >
                Matches: [{matchedIndices.join(", ")}]
              </text>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
