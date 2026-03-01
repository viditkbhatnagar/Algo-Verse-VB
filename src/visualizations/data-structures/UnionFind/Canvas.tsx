"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";
import type { UnionFindStepData } from "./logic";

interface UnionFindCanvasProps {
  step: VisualizationStep;
}

const COLOR_MAP: Record<HighlightColor | "default", string> = {
  default: VIZ_COLORS.default,
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

const NODE_RADIUS = 22;
const TREE_H_SPACING = 70;
const TREE_V_SPACING = 60;

/**
 * Build a tree layout from the parent array.
 * Returns positions for each node as { x, y }.
 */
function computeForestLayout(
  elements: UnionFindStepData["elements"]
): Record<string, { x: number; y: number }> {
  // Group by root
  const children: Record<string, string[]> = {};
  const roots: string[] = [];

  for (const el of elements) {
    if (el.parent === el.id) {
      roots.push(el.id);
    }
    if (!children[el.parent]) children[el.parent] = [];
    if (el.parent !== el.id) {
      children[el.parent].push(el.id);
    }
  }

  // BFS to compute subtree sizes
  function subtreeSize(nodeId: string): number {
    const kids = children[nodeId] || [];
    return 1 + kids.reduce((s, c) => s + subtreeSize(c), 0);
  }

  const positions: Record<string, { x: number; y: number }> = {};

  const layoutSubtree = (nodeId: string, x: number, y: number, widthBudget: number) => {
    positions[nodeId] = { x, y };
    const kids = children[nodeId] || [];
    if (kids.length === 0) return;

    const childWidth = widthBudget / kids.length;
    let startX = x - widthBudget / 2 + childWidth / 2;

    for (const child of kids) {
      layoutSubtree(child, startX, y + TREE_V_SPACING, childWidth);
      startX += childWidth;
    }
  };

  let treeOffsetX = 50;

  for (const root of roots) {
    const treeWidth = subtreeSize(root) * TREE_H_SPACING;
    layoutSubtree(root, treeOffsetX + treeWidth / 2, 40, treeWidth);
    treeOffsetX += treeWidth + 30;
  }

  return positions;
}

export function UnionFindCanvas({ step }: UnionFindCanvasProps) {
  const data = step.data as UnionFindStepData;
  const { elements, sets, currentOperation } = data;

  const positions = computeForestLayout(elements);

  // Compute SVG dimensions from positions
  const allX = Object.values(positions).map((p) => p.x);
  const allY = Object.values(positions).map((p) => p.y);
  const minX = Math.min(...allX) - 40;
  const maxX = Math.max(...allX) + 40;
  const maxY = Math.max(...allY) + 40;
  const svgWidth = Math.max(400, maxX - minX + 40);
  const svgHeight = maxY + 40;

  // Build a map for quick access
  const elementMap = new Map(elements.map((el) => [el.id, el]));

  return (
    <div className="space-y-3">
      {/* Current operation */}
      {currentOperation && (
        <div className="flex items-center gap-2 px-2">
          <span className="text-xs text-muted-foreground font-mono">Operation:</span>
          <motion.span
            key={currentOperation}
            className="text-sm font-mono text-cyan-400 bg-surface px-2 py-0.5 rounded border border-border/50"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentOperation}
          </motion.span>
        </div>
      )}

      {/* Forest SVG */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`${minX} 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-2xl mx-auto select-none"
          style={{ minHeight: 180 }}
        >
          {/* Edges (parent pointers) */}
          {elements.map((el) => {
            if (el.parent === el.id) return null; // root
            const childPos = positions[el.id];
            const parentPos = positions[el.parent];
            if (!childPos || !parentPos) return null;

            const childHighlight = el.highlight;
            const parentEl = elementMap.get(el.parent);
            const parentHighlight = parentEl?.highlight;

            let edgeColor = "#334155";
            if (childHighlight && parentHighlight) {
              edgeColor = COLOR_MAP[childHighlight];
            } else if (childHighlight) {
              edgeColor = COLOR_MAP[childHighlight] + "88";
            }

            return (
              <motion.line
                key={`edge-${el.id}-${el.parent}`}
                x1={childPos.x}
                y1={childPos.y - NODE_RADIUS}
                x2={parentPos.x}
                y2={parentPos.y + NODE_RADIUS}
                stroke={edgeColor}
                strokeWidth={2}
                initial={false}
                animate={{ stroke: edgeColor }}
                transition={{ duration: 0.25 }}
              />
            );
          })}

          {/* Nodes */}
          {elements.map((el) => {
            const pos = positions[el.id];
            if (!pos) return null;

            const fillColor = el.highlight
              ? COLOR_MAP[el.highlight]
              : VIZ_COLORS.default;
            const isRoot = el.parent === el.id;

            return (
              <g key={`node-${el.id}`}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_RADIUS}
                  fill={fillColor}
                  stroke={isRoot ? "#fff" : "#334155"}
                  strokeWidth={isRoot ? 2.5 : 1.5}
                  initial={false}
                  animate={{ fill: fillColor }}
                  transition={{ duration: 0.25 }}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  className="font-mono font-bold"
                  fontSize={14}
                >
                  {el.id}
                </text>
                {/* Rank label below node for roots */}
                {isRoot && (
                  <text
                    x={pos.x}
                    y={pos.y + NODE_RADIUS + 14}
                    textAnchor="middle"
                    fill="#94a3b8"
                    className="font-mono"
                    fontSize={10}
                  >
                    r={el.rank}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Parent and Rank arrays */}
      <div className="flex flex-wrap gap-6 px-2 justify-center">
        {/* Parent array */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-mono text-center font-bold uppercase">
            Parent[]
          </p>
          <div className="flex gap-1">
            {elements.map((el) => (
              <div key={`parent-${el.id}`} className="text-center">
                <div className="text-[10px] text-muted-foreground font-mono">{el.id}</div>
                <motion.div
                  className="w-8 h-8 flex items-center justify-center rounded border text-sm font-mono font-bold"
                  style={{
                    borderColor: el.highlight ? COLOR_MAP[el.highlight] : "#334155",
                  }}
                  initial={false}
                  animate={{
                    backgroundColor: el.highlight
                      ? COLOR_MAP[el.highlight] + "22"
                      : "#1e293b",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {el.parent}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Rank array */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-mono text-center font-bold uppercase">
            Rank[]
          </p>
          <div className="flex gap-1">
            {elements.map((el) => (
              <div key={`rank-${el.id}`} className="text-center">
                <div className="text-[10px] text-muted-foreground font-mono">{el.id}</div>
                <div className="w-8 h-8 flex items-center justify-center rounded border border-border/40 bg-[#1e293b] text-sm font-mono text-muted-foreground">
                  {el.rank}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sets display */}
      <div className="flex flex-wrap items-center gap-2 px-2 justify-center">
        <span className="text-xs text-muted-foreground font-mono">Sets:</span>
        {sets.map((set, i) => (
          <motion.span
            key={`set-${i}-${set.join(",")}`}
            className="text-xs font-mono bg-surface px-2 py-0.5 rounded border border-border/50 text-foreground"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {`{${set.join(", ")}}`}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
