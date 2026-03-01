"use client";

import { motion } from "framer-motion";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { CrossValidationStepData } from "./logic";

interface CrossValidationCanvasProps {
  step: VisualizationStep;
}

const COLORS = {
  train: "#22c55e",
  test: "#ef4444",
  idle: "#475569",
};

export function CrossValidationCanvas({ step }: CrossValidationCanvasProps) {
  const data = step.data as CrossValidationStepData;
  const { folds, foldSize, currentRound, accuracies, averageAccuracy } = data;

  const barHeight = 40;
  const barGap = 6;
  const padding = { top: 30, left: 80, right: 30, bottom: 60 };
  const totalWidth = 600;
  const foldWidth = (totalWidth - padding.left - padding.right) / folds.length;

  const svgHeight = padding.top + barHeight + barGap + (accuracies.length > 0 ? accuracies.length * 28 + 60 : 0) + padding.bottom;

  return (
    <div className="w-full overflow-x-auto" style={{ minHeight: 280 }}>
      <svg width={totalWidth} height={svgHeight} className="mx-auto select-none">
        {/* Title */}
        <text
          x={totalWidth / 2}
          y={18}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          fontSize={12}
        >
          {currentRound >= 0 && currentRound < folds.length
            ? `Round ${currentRound + 1} / ${folds.length}`
            : averageAccuracy !== null
              ? "Cross-Validation Complete"
              : `${folds.length}-Fold Cross-Validation`}
        </text>

        {/* Fold bars */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {folds.map((fold, i) => {
            const x = i * foldWidth;
            const color = COLORS[fold.role];

            return (
              <g key={fold.id}>
                <motion.rect
                  x={x + 2}
                  y={0}
                  width={foldWidth - 4}
                  height={barHeight}
                  rx={4}
                  fill={color}
                  initial={false}
                  animate={{ fill: color }}
                  transition={{ duration: 0.3 }}
                />
                <text
                  x={x + foldWidth / 2}
                  y={barHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  className="font-mono font-bold"
                  fontSize={11}
                >
                  Fold {i + 1}
                </text>
                <text
                  x={x + foldWidth / 2}
                  y={barHeight + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono"
                  fontSize={9}
                >
                  {fold.role === "test" ? "TEST" : fold.role === "train" ? "TRAIN" : ""}
                </text>
                <text
                  x={x + foldWidth / 2}
                  y={barHeight + 26}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono"
                  fontSize={8}
                >
                  ~{foldSize} samples
                </text>
              </g>
            );
          })}
        </g>

        {/* Label */}
        <text
          x={padding.left - 8}
          y={padding.top + barHeight / 2}
          textAnchor="end"
          dominantBaseline="central"
          className="fill-muted-foreground font-mono"
          fontSize={10}
        >
          Data
        </text>

        {/* Accuracy results */}
        {accuracies.length > 0 && (
          <g transform={`translate(${padding.left}, ${padding.top + barHeight + 40})`}>
            <text
              x={0}
              y={-8}
              className="fill-muted-foreground font-mono"
              fontSize={11}
            >
              Results:
            </text>
            {accuracies.map((acc, i) => {
              const barMaxWidth = totalWidth - padding.left - padding.right - 120;
              const accBarWidth = acc.accuracy * barMaxWidth;

              return (
                <g key={i} transform={`translate(0, ${i * 28})`}>
                  <text
                    x={0}
                    y={18}
                    className="fill-muted-foreground font-mono"
                    fontSize={10}
                  >
                    Fold {acc.fold + 1}:
                  </text>
                  <motion.rect
                    x={55}
                    y={6}
                    width={accBarWidth}
                    height={16}
                    rx={3}
                    fill={i === accuracies.length - 1 && currentRound < folds.length ? "#6366f1" : "#22c55e"}
                    initial={{ width: 0 }}
                    animate={{ width: accBarWidth }}
                    transition={{ duration: 0.5 }}
                  />
                  <text
                    x={55 + accBarWidth + 6}
                    y={18}
                    className="fill-white font-mono font-bold"
                    fontSize={10}
                  >
                    {(acc.accuracy * 100).toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Average line */}
            {averageAccuracy !== null && (
              <g transform={`translate(0, ${accuracies.length * 28 + 8})`}>
                <line
                  x1={0}
                  x2={totalWidth - padding.left - padding.right}
                  y1={0}
                  y2={0}
                  stroke="#475569"
                  strokeDasharray="4 2"
                />
                <text
                  x={0}
                  y={20}
                  className="fill-cyan-400 font-mono font-bold"
                  fontSize={12}
                >
                  Average: {(averageAccuracy * 100).toFixed(1)}%
                </text>
              </g>
            )}
          </g>
        )}

        {/* Legend */}
        <g transform={`translate(${totalWidth - 180}, ${svgHeight - 20})`}>
          <rect x={0} y={-6} width={10} height={10} rx={2} fill={COLORS.train} />
          <text x={14} y={3} className="fill-muted-foreground font-mono" fontSize={9}>Training</text>
          <rect x={70} y={-6} width={10} height={10} rx={2} fill={COLORS.test} />
          <text x={84} y={3} className="fill-muted-foreground font-mono" fontSize={9}>Test</text>
        </g>
      </svg>
    </div>
  );
}
