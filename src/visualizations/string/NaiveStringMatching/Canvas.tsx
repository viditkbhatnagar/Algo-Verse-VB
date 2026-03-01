"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { NaiveStringMatchStepData } from "./logic";

interface NaiveStringMatchCanvasProps {
  step: VisualizationStep;
}

const CELL_W = 36;
const CELL_H = 40;
const GAP = 8;
const PADDING = 16;

function getCharColor(
  state: "match" | "mismatch" | "comparing" | "idle" | undefined
): string {
  switch (state) {
    case "match":
      return VIZ_COLORS.completed;
    case "mismatch":
      return VIZ_COLORS.swapping;
    case "comparing":
      return VIZ_COLORS.active;
    default:
      return "#334155";
  }
}

export function NaiveStringMatchCanvas({ step }: NaiveStringMatchCanvasProps) {
  const data = step.data as NaiveStringMatchStepData;
  const { text, pattern, offset, charStates, matchedIndices } = data;

  const svgWidth = Math.max(
    (text.length + 1) * CELL_W + PADDING * 2,
    400
  );
  const svgHeight = CELL_H * 2 + GAP + PADDING * 2 + 50;

  const textY = PADDING + 20;
  const patternY = textY + CELL_H + GAP;

  return (
    <div className="overflow-x-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="mx-auto"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        {/* Labels */}
        <text
          x={PADDING}
          y={textY - 6}
          className="fill-muted-foreground"
          fontSize={11}
          fontFamily="monospace"
        >
          Text
        </text>
        <text
          x={PADDING}
          y={patternY - 6}
          className="fill-muted-foreground"
          fontSize={11}
          fontFamily="monospace"
        >
          Pattern
        </text>

        {/* Text character boxes */}
        {text.split("").map((ch, i) => {
          const x = PADDING + i * CELL_W;
          const state = charStates[i];
          const isInPreviousMatch = matchedIndices.some(
            (mi) => i >= mi && i < mi + pattern.length
          );
          const bg =
            state !== undefined
              ? getCharColor(state)
              : isInPreviousMatch
                ? "#1e3a2e"
                : "#1e293b";

          return (
            <g key={`text-${i}`}>
              {/* Index label */}
              <text
                x={x + CELL_W / 2}
                y={textY - 16}
                textAnchor="middle"
                fontSize={9}
                className="fill-muted-foreground"
                fontFamily="monospace"
              >
                {i}
              </text>
              <motion.rect
                x={x}
                y={textY}
                width={CELL_W - 2}
                height={CELL_H}
                rx={4}
                initial={false}
                animate={{ fill: bg }}
                transition={{ duration: 0.15 }}
                stroke="#475569"
                strokeWidth={1}
              />
              <text
                x={x + CELL_W / 2 - 1}
                y={textY + CELL_H / 2 + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight={state ? "bold" : "normal"}
                fill={state ? "#fff" : "#cbd5e1"}
                fontFamily="monospace"
              >
                {ch}
              </text>
            </g>
          );
        })}

        {/* Pattern character boxes (aligned at offset) */}
        {pattern.split("").map((ch, j) => {
          const x = PADDING + (offset + j) * CELL_W;
          const textIdx = offset + j;
          const state = charStates[textIdx];
          const bg =
            state !== undefined ? getCharColor(state) : "#334155";

          return (
            <motion.g
              key={`pat-${j}`}
              initial={false}
              animate={{ x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.rect
                x={x}
                y={patternY}
                width={CELL_W - 2}
                height={CELL_H}
                rx={4}
                initial={false}
                animate={{ fill: bg }}
                transition={{ duration: 0.15 }}
                stroke={VIZ_COLORS.active}
                strokeWidth={1.5}
                strokeOpacity={0.6}
              />
              <text
                x={x + CELL_W / 2 - 1}
                y={patternY + CELL_H / 2 + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight="bold"
                fill="#fff"
                fontFamily="monospace"
              >
                {ch}
              </text>
            </motion.g>
          );
        })}

        {/* Match indicators */}
        {matchedIndices.length > 0 && (
          <text
            x={PADDING}
            y={patternY + CELL_H + 24}
            fontSize={12}
            className="fill-emerald-400"
            fontFamily="monospace"
          >
            Matches found at: [{matchedIndices.join(", ")}]
          </text>
        )}
      </svg>
    </div>
  );
}
