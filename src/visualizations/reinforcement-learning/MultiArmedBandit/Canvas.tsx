"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VIZ_COLORS, CLUSTER_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { BanditStepData } from "./logic";

const HIGHLIGHT_MAP: Record<string, string> = {
  active: VIZ_COLORS.active,
  comparing: VIZ_COLORS.comparing,
  completed: VIZ_COLORS.completed,
  selected: VIZ_COLORS.highlighted,
};

interface MultiArmedBanditCanvasProps {
  step: VisualizationStep;
}

export function MultiArmedBanditCanvas({ step }: MultiArmedBanditCanvasProps) {
  const data = step.data as BanditStepData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 650, height: 420 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(350, Math.min(480, entry.contentRect.width * 0.65)),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  const padding = { top: 50, right: 30, bottom: 60, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Compute max estimated mean for Y-axis scale
  const maxVal = Math.max(
    10,
    ...data.arms.map((a) => Math.abs(a.estimatedMean) + 2),
    ...data.arms.map((a) => (a.lastReward !== undefined ? Math.abs(a.lastReward) + 2 : 0))
  );

  const barWidth = Math.min(60, (chartWidth / data.numArms) * 0.6);
  const barGap = (chartWidth - barWidth * data.numArms) / (data.numArms + 1);

  const yScale = (val: number) =>
    chartHeight - (val / maxVal) * chartHeight;

  return (
    <div ref={containerRef} style={{ minHeight: 350 }}>
      <svg width={width} height={height} className="select-none">
        {/* Header */}
        <text x={width / 2} y={16} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={10}>
          Pulls: {data.totalPulls} | Total Reward: {data.totalReward.toFixed(1)} | epsilon={data.epsilon}
        </text>
        <text x={width / 2} y={30} textAnchor="middle" className="font-mono" fontSize={9} fill={data.isExploring ? VIZ_COLORS.comparing : VIZ_COLORS.active}>
          {data.totalPulls > 0 ? (data.isExploring ? "EXPLORING (random)" : "EXPLOITING (greedy)") : ""}
        </text>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Y-axis */}
          <line x1={0} x2={0} y1={0} y2={chartHeight} stroke="#475569" />
          {[0, Math.round(maxVal / 4), Math.round(maxVal / 2), Math.round(3 * maxVal / 4), maxVal].map((v) => (
            <g key={`ytick-${v}`}>
              <line x1={-4} x2={0} y1={yScale(v)} y2={yScale(v)} stroke="#475569" />
              <text x={-8} y={yScale(v) + 3} textAnchor="end" className="fill-muted-foreground font-mono" fontSize={8}>
                {v}
              </text>
              <line x1={0} x2={chartWidth} y1={yScale(v)} y2={yScale(v)} stroke="#1e293b" strokeWidth={0.5} />
            </g>
          ))}

          {/* Y-axis label */}
          <text
            x={-36}
            y={chartHeight / 2}
            textAnchor="middle"
            className="fill-muted-foreground font-mono"
            fontSize={10}
            transform={`rotate(-90, -36, ${chartHeight / 2})`}
          >
            Estimated Reward
          </text>

          {/* X-axis */}
          <line x1={0} x2={chartWidth} y1={chartHeight} y2={chartHeight} stroke="#475569" />

          {/* Zero line */}
          <line x1={0} x2={chartWidth} y1={yScale(0)} y2={yScale(0)} stroke="#475569" strokeWidth={0.8} />

          {/* Bars */}
          {data.arms.map((arm, i) => {
            const x = barGap + i * (barWidth + barGap);
            const barColor = arm.highlight
              ? HIGHLIGHT_MAP[arm.highlight]
              : CLUSTER_COLORS[i % CLUSTER_COLORS.length];
            const barH = Math.max(2, (Math.max(0, arm.estimatedMean) / maxVal) * chartHeight);
            const barY = chartHeight - barH;

            return (
              <g key={arm.id}>
                {/* Bar */}
                <motion.rect
                  x={x}
                  y={barY}
                  width={barWidth}
                  height={barH}
                  fill={barColor}
                  opacity={arm.highlight === "active" ? 1 : 0.75}
                  rx={3}
                  initial={false}
                  animate={{ y: barY, height: barH, fill: barColor }}
                  transition={{ duration: 0.4 }}
                />

                {/* Estimated mean value label */}
                <text
                  x={x + barWidth / 2}
                  y={barY - 6}
                  textAnchor="middle"
                  className="font-mono font-bold"
                  fontSize={10}
                  fill={barColor}
                >
                  {arm.estimatedMean.toFixed(2)}
                </text>

                {/* Last reward indicator */}
                {arm.lastReward !== undefined && arm.highlight === "active" && (
                  <motion.circle
                    cx={x + barWidth / 2}
                    cy={yScale(Math.max(0, arm.lastReward))}
                    r={4}
                    fill="#fff"
                    stroke={barColor}
                    strokeWidth={2}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Arm label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono"
                  fontSize={9}
                >
                  {arm.label}
                </text>

                {/* Pull count */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 26}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono"
                  fontSize={8}
                >
                  ({arm.pullCount} pulls)
                </text>

                {/* Selection indicator */}
                {arm.highlight === "active" && (
                  <motion.rect
                    x={x - 2}
                    y={barY - 2}
                    width={barWidth + 4}
                    height={barH + 4}
                    fill="none"
                    stroke={barColor}
                    strokeWidth={2}
                    strokeDasharray="4 2"
                    rx={4}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
