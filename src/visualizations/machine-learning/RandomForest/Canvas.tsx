"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { RandomForestStepData } from "./logic";

interface RandomForestCanvasProps {
  step: VisualizationStep;
}

const STATE_COLORS: Record<string, string> = {
  pending: "#475569",
  building: "#f59e0b",
  built: "#22c55e",
  voting: "#6366f1",
};

interface MiniTreeNodeShape {
  id: string;
  label: string;
  isLeaf: boolean;
  children: MiniTreeNodeShape[];
  prediction?: string;
}

function renderMiniTree(
  node: MiniTreeNodeShape,
  x: number,
  y: number,
  width: number,
  depth: number = 0
): ReactNode[] {
  const elements: ReactNode[] = [];
  const nodeR = 6;
  const levelH = 20;
  const color = node.isLeaf
    ? (node.prediction === "Yes" ? "#22c55e" : "#ef4444")
    : "#6366f1";

  elements.push(
    <circle key={node.id} cx={x} cy={y} r={nodeR} fill={color} opacity={0.8} />
  );

  if (node.children.length > 0) {
    const childWidth = width / node.children.length;
    node.children.forEach((child, i) => {
      const cx = x - width / 2 + childWidth * (i + 0.5);
      const cy = y + levelH;

      elements.push(
        <line
          key={`edge-${node.id}-${child.id}`}
          x1={x}
          y1={y + nodeR}
          x2={cx}
          y2={cy - nodeR}
          stroke="#334155"
          strokeWidth={1}
        />
      );

      elements.push(...renderMiniTree(child, cx, cy, childWidth, depth + 1));
    });
  }

  return elements;
}

export function RandomForestCanvas({ step }: RandomForestCanvasProps) {
  const data = step.data as RandomForestStepData;
  const { trees, currentTreeIndex, phase, predictions, finalPrediction, votes } = data;

  const treeWidth = 120;
  const treeHeight = 130;
  const gap = 16;
  const padding = { top: 40, left: 30, bottom: 80 };
  const totalWidth = Math.max(600, trees.length * (treeWidth + gap) + padding.left * 2);
  const totalHeight = treeHeight + padding.top + padding.bottom + 60;

  return (
    <div className="w-full overflow-x-auto" style={{ minHeight: 280 }}>
      <svg width={totalWidth} height={totalHeight} className="mx-auto select-none">
        {/* Title */}
        <text
          x={totalWidth / 2}
          y={18}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          fontSize={12}
        >
          {phase === "intro" ? "Random Forest Ensemble" :
           phase === "bootstrap" ? "Bootstrap Sampling" :
           phase === "build" ? "Building Trees" :
           phase === "vote" ? "Voting" :
           phase === "complete" ? `Result: "${finalPrediction}"` :
           "Random Forest"}
        </text>

        {/* Trees */}
        {trees.map((tree, i) => {
          const x = padding.left + i * (treeWidth + gap);
          const y = padding.top;
          const isActive = i === currentTreeIndex;
          const stateColor = STATE_COLORS[tree.state] || "#475569";

          return (
            <g key={tree.id}>
              {/* Tree container */}
              <motion.rect
                x={x}
                y={y}
                width={treeWidth}
                height={treeHeight}
                rx={8}
                fill={isActive ? "#1e293b" : "#0f172a"}
                stroke={stateColor}
                strokeWidth={isActive ? 2.5 : 1}
                initial={false}
                animate={{ stroke: stateColor, strokeWidth: isActive ? 2.5 : 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Tree label */}
              <text
                x={x + treeWidth / 2}
                y={y + 14}
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                fontSize={9}
              >
                Tree {i + 1}
              </text>

              {/* Mini tree visualization */}
              {tree.state !== "pending" && (
                <g transform={`translate(${x}, ${y + 20})`}>
                  {renderMiniTree(
                    tree.nodes,
                    treeWidth / 2,
                    8,
                    treeWidth * 0.7
                  )}
                </g>
              )}

              {/* State badge */}
              <rect
                x={x + treeWidth / 2 - 22}
                y={y + treeHeight - 20}
                width={44}
                height={16}
                rx={3}
                fill={stateColor}
                opacity={0.8}
              />
              <text
                x={x + treeWidth / 2}
                y={y + treeHeight - 9}
                textAnchor="middle"
                fill="#fff"
                className="font-mono"
                fontSize={8}
              >
                {tree.state === "pending" ? "Idle" :
                 tree.state === "building" ? "Building" :
                 tree.state === "voting" ? "Voting" : "Ready"}
              </text>

              {/* Prediction label */}
              {tree.prediction && (
                <g>
                  <motion.rect
                    x={x + treeWidth / 2 - 18}
                    y={y + treeHeight + 6}
                    width={36}
                    height={18}
                    rx={4}
                    fill={tree.prediction === "Yes" ? "#22c55e" : "#ef4444"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <text
                    x={x + treeWidth / 2}
                    y={y + treeHeight + 18}
                    textAnchor="middle"
                    fill="#fff"
                    className="font-mono font-bold"
                    fontSize={9}
                  >
                    {tree.prediction}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Vote summary at bottom */}
        {votes && (
          <g transform={`translate(${totalWidth / 2}, ${padding.top + treeHeight + 50})`}>
            <text
              x={0}
              y={0}
              textAnchor="middle"
              className="fill-cyan-400 font-mono font-bold"
              fontSize={13}
            >
              Majority Vote: {Object.entries(votes).map(([k, v]) => `${k}=${v}`).join(" | ")}
              {finalPrediction ? ` => "${finalPrediction}"` : ""}
            </text>
          </g>
        )}

        {/* Query point indicator */}
        {data.queryPoint && phase !== "intro" && phase !== "bootstrap" && phase !== "build" && (
          <text
            x={totalWidth / 2}
            y={padding.top + treeHeight + 32}
            textAnchor="middle"
            className="fill-muted-foreground font-mono"
            fontSize={10}
          >
            Query: {data.queryPoint.features}
          </text>
        )}

        {/* Legend */}
        <g transform={`translate(${totalWidth - 200}, ${totalHeight - 18})`}>
          {[
            { color: "#475569", label: "Pending" },
            { color: "#f59e0b", label: "Building" },
            { color: "#22c55e", label: "Built" },
            { color: "#6366f1", label: "Voting" },
          ].map((item, i) => (
            <g key={item.label} transform={`translate(${i * 50}, 0)`}>
              <rect x={0} y={-5} width={8} height={8} rx={2} fill={item.color} />
              <text x={11} y={3} className="fill-muted-foreground font-mono" fontSize={8}>
                {item.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
