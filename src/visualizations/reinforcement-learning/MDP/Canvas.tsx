"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { MDPStepData } from "./logic";

const HIGHLIGHT_COLORS: Record<string, string> = {
  active: VIZ_COLORS.active,
  comparing: VIZ_COLORS.comparing,
  completed: VIZ_COLORS.completed,
  selected: VIZ_COLORS.highlighted,
};

interface MDPCanvasProps {
  step: VisualizationStep;
}

export function MDPCanvas({ step }: MDPCanvasProps) {
  const data = step.data as MDPStepData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(320, Math.min(450, entry.contentRect.width * 0.55)),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  const padding = 60;

  // Scale state positions to canvas coordinates
  const statePositions = data.states.map((s) => ({
    id: s.id,
    cx: padding + s.x * (width - padding * 2),
    cy: padding + s.y * (height - padding * 2),
  }));

  const getPos = (id: string) => statePositions.find((p) => p.id === id)!;
  const stateRadius = Math.min(32, width * 0.045);

  // Compute arrow endpoints offset from circle edges
  function arrowEndpoints(fromId: string, toId: string, offset = 0) {
    const from = getPos(fromId);
    const to = getPos(toId);
    const dx = to.cx - from.cx;
    const dy = to.cy - from.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return { x1: from.cx, y1: from.cy, x2: to.cx, y2: to.cy };

    const nx = dx / dist;
    const ny = dy / dist;
    // Perpendicular offset for parallel arrows
    const px = -ny * offset;
    const py = nx * offset;

    return {
      x1: from.cx + nx * (stateRadius + 4) + px,
      y1: from.cy + ny * (stateRadius + 4) + py,
      x2: to.cx - nx * (stateRadius + 8) + px,
      y2: to.cy - ny * (stateRadius + 8) + py,
      midX: (from.cx + to.cx) / 2 + px,
      midY: (from.cy + to.cy) / 2 + py,
    };
  }

  // Group transitions by from-to pair for offsetting
  const pairCounts: Record<string, number> = {};
  const pairIndex: Record<string, number> = {};

  for (const t of data.transitions) {
    const key = [t.from, t.to].sort().join("-");
    pairCounts[key] = (pairCounts[key] || 0) + 1;
  }

  return (
    <div ref={containerRef} style={{ minHeight: 320 }}>
      <svg width={width} height={height} className="select-none">
        <defs>
          <marker
            id="mdp-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
          </marker>
          <marker
            id="mdp-arrow-active"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={VIZ_COLORS.active} />
          </marker>
          <marker
            id="mdp-arrow-completed"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={VIZ_COLORS.completed} />
          </marker>
        </defs>

        {/* Transitions (arrows) */}
        {data.transitions.map((t, i) => {
          const sortedKey = [t.from, t.to].sort().join("-");
          if (pairIndex[sortedKey] === undefined) pairIndex[sortedKey] = 0;
          const idx = pairIndex[sortedKey]++;
          const total = pairCounts[sortedKey] || 1;
          const offsetSpread = 12;
          const offset = (idx - (total - 1) / 2) * offsetSpread;

          const pts = arrowEndpoints(t.from, t.to, offset);
          const color = t.highlight
            ? HIGHLIGHT_COLORS[t.highlight] || "#94a3b8"
            : "#475569";
          const markerId = t.highlight === "completed"
            ? "url(#mdp-arrow-completed)"
            : t.highlight === "active"
            ? "url(#mdp-arrow-active)"
            : "url(#mdp-arrow)";

          return (
            <g key={`t-${i}`}>
              <motion.line
                x1={pts.x1}
                y1={pts.y1}
                x2={pts.x2}
                y2={pts.y2}
                stroke={color}
                strokeWidth={t.highlight ? 2.5 : 1.5}
                markerEnd={markerId}
                opacity={t.highlight ? 1 : 0.6}
                initial={false}
                animate={{
                  x1: pts.x1,
                  y1: pts.y1,
                  x2: pts.x2,
                  y2: pts.y2,
                  stroke: color,
                }}
                transition={{ duration: 0.4 }}
              />
              {/* Label: p=X, r=Y */}
              <text
                x={pts.midX!}
                y={pts.midY! - 6}
                textAnchor="middle"
                className="font-mono"
                fontSize={8}
                fill={color}
                opacity={0.9}
              >
                {t.action} p={t.probability}
              </text>
              {t.reward !== 0 && (
                <text
                  x={pts.midX!}
                  y={pts.midY! + 6}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={7}
                  fill={t.reward > 0 ? VIZ_COLORS.rewardPositive : VIZ_COLORS.rewardNegative}
                >
                  r={t.reward > 0 ? "+" : ""}{t.reward}
                </text>
              )}
            </g>
          );
        })}

        {/* States (circles) */}
        {data.states.map((s) => {
          const pos = getPos(s.id);
          const fillColor = s.isTerminal
            ? s.highlight
              ? HIGHLIGHT_COLORS[s.highlight]
              : s.reward > 0
              ? VIZ_COLORS.rewardPositive
              : "#475569"
            : s.highlight
            ? HIGHLIGHT_COLORS[s.highlight]
            : "#1e293b";
          const strokeColor = s.highlight
            ? HIGHLIGHT_COLORS[s.highlight]
            : s.isTerminal
            ? VIZ_COLORS.rewardPositive
            : "#6366f1";

          return (
            <g key={s.id}>
              <motion.circle
                cx={pos.cx}
                cy={pos.cy}
                r={stateRadius}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={data.currentState === s.id ? 3 : 2}
                opacity={0.95}
                initial={false}
                animate={{ cx: pos.cx, cy: pos.cy, fill: fillColor, stroke: strokeColor }}
                transition={{ duration: 0.4 }}
              />
              {s.isTerminal && (
                <circle
                  cx={pos.cx}
                  cy={pos.cy}
                  r={stateRadius - 4}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={1}
                  opacity={0.6}
                />
              )}
              {/* State label */}
              <text
                x={pos.cx}
                y={pos.cy - 4}
                textAnchor="middle"
                className="fill-white font-mono font-bold"
                fontSize={10}
              >
                {s.id}
              </text>
              {/* Value */}
              <text
                x={pos.cx}
                y={pos.cy + 10}
                textAnchor="middle"
                className="font-mono"
                fontSize={9}
                fill="#e2e8f0"
              >
                V={s.value.toFixed(1)}
              </text>
              {/* Reward label outside */}
              {s.isTerminal && (
                <text
                  x={pos.cx}
                  y={pos.cy + stateRadius + 14}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={8}
                  fill={VIZ_COLORS.rewardPositive}
                >
                  R={s.reward}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${width - 140}, 12)`}>
          <text className="fill-muted-foreground font-mono" fontSize={9} y={0}>
            gamma = {data.gamma}
          </text>
          {data.iteration >= 0 && (
            <text className="fill-muted-foreground font-mono" fontSize={9} y={14}>
              Iteration: {data.iteration}
            </text>
          )}
          {data.converged && (
            <text className="font-mono" fontSize={9} y={28} fill={VIZ_COLORS.completed}>
              Converged!
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
