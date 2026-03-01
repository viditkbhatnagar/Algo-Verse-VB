"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { TreeNodeData, TreeEdgeData, HighlightColor, HighlightInfo } from "@/lib/visualization/types";

interface TreeCanvasProps {
  nodes: TreeNodeData[];
  edges: TreeEdgeData[];
  currentNodeId: string | null;
  rootId: string | null;
  showValues?: boolean;
  showBalanceFactor?: boolean;
  edgeLabels?: boolean;
  dualView?: boolean;
  arrayData?: number[];
  arrayHighlights?: HighlightInfo[];
  className?: string;
}

const NODE_RADIUS = 20;
const LEVEL_HEIGHT = 70;
const MIN_NODE_SPACING = 50;

const COLOR_MAP: Record<string, string> = {
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

interface PositionedNode {
  id: string;
  x: number;
  y: number;
  value: number | string;
  highlight?: HighlightColor;
  balanceFactor?: number;
}

function computeTreeLayout(
  nodes: TreeNodeData[],
  edges: TreeEdgeData[],
  rootId: string | null
): PositionedNode[] {
  if (!rootId || nodes.length === 0) return [];

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const childrenMap = new Map<string, string[]>();

  for (const edge of edges) {
    const existing = childrenMap.get(edge.source) ?? [];
    existing.push(edge.target);
    childrenMap.set(edge.source, existing);
  }

  const positioned: PositionedNode[] = [];
  let minX = 0;

  function layout(nodeId: string, depth: number): { left: number; right: number; x: number } {
    const node = nodeMap.get(nodeId);
    if (!node) return { left: 0, right: 0, x: 0 };

    const children = childrenMap.get(nodeId) ?? [];

    if (children.length === 0) {
      const x = minX;
      minX += MIN_NODE_SPACING;
      positioned.push({
        id: nodeId,
        x,
        y: depth * LEVEL_HEIGHT + NODE_RADIUS + 10,
        value: node.value,
        highlight: node.highlight,
        balanceFactor: node.balanceFactor,
      });
      return { left: x, right: x, x };
    }

    const childResults = children.map((cid) => layout(cid, depth + 1));
    const leftmost = childResults[0].left;
    const rightmost = childResults[childResults.length - 1].right;
    const x = (leftmost + rightmost) / 2;

    positioned.push({
      id: nodeId,
      x,
      y: depth * LEVEL_HEIGHT + NODE_RADIUS + 10,
      value: node.value,
      highlight: node.highlight,
      balanceFactor: node.balanceFactor,
    });

    return { left: leftmost, right: rightmost, x };
  }

  layout(rootId, 0);
  return positioned;
}

export function TreeCanvas({
  nodes,
  edges,
  currentNodeId,
  rootId,
  showValues = true,
  showBalanceFactor = false,
  edgeLabels = false,
  dualView = false,
  arrayData,
  arrayHighlights,
  className,
}: TreeCanvasProps) {
  const positioned = useMemo(
    () => computeTreeLayout(nodes, edges, rootId),
    [nodes, edges, rootId]
  );

  const posMap = useMemo(
    () => new Map(positioned.map((p) => [p.id, p])),
    [positioned]
  );

  if (positioned.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-[200px] text-muted-foreground text-sm ${className ?? ""}`}>
        Empty tree
      </div>
    );
  }

  const xs = positioned.map((p) => p.x);
  const ys = positioned.map((p) => p.y);
  const padding = 40;
  const svgWidth = Math.max(300, Math.max(...xs) - Math.min(...xs) + padding * 2);
  const svgHeight = Math.max(...ys) + NODE_RADIUS + padding;
  const offsetX = -Math.min(...xs) + padding;

  const treeHeight = dualView ? svgHeight : svgHeight;
  const totalHeight = dualView && arrayData ? treeHeight + 80 : treeHeight;

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <svg
          width={Math.max(svgWidth, 300)}
          height={totalHeight}
          className="select-none mx-auto"
        >
          <g transform={`translate(${offsetX}, 0)`}>
            {/* Edges */}
            {edges.map((edge) => {
              const source = posMap.get(edge.source);
              const target = posMap.get(edge.target);
              if (!source || !target) return null;

              const color = edge.highlight
                ? COLOR_MAP[edge.highlight]
                : "#334155";

              return (
                <g key={`${edge.source}-${edge.target}`}>
                  <motion.line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={color}
                    strokeWidth={2}
                    initial={false}
                    animate={{ stroke: color }}
                    transition={{ duration: 0.2 }}
                  />
                  {edgeLabels && edge.label && (
                    <text
                      x={(source.x + target.x) / 2 + 8}
                      y={(source.y + target.y) / 2 - 4}
                      textAnchor="middle"
                      className="fill-muted-foreground font-mono"
                      fontSize={11}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {positioned.map((node) => {
              const isCurrent = node.id === currentNodeId;
              const color = isCurrent
                ? VIZ_COLORS.active
                : node.highlight
                  ? COLOR_MAP[node.highlight]
                  : VIZ_COLORS.default;

              return (
                <g key={node.id}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS}
                    fill={color}
                    stroke={isCurrent ? "#fff" : "#334155"}
                    strokeWidth={isCurrent ? 3 : 2}
                    initial={false}
                    animate={{ fill: color, scale: isCurrent ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  {showValues && (
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      className="font-mono font-bold"
                      fontSize={13}
                    >
                      {node.value}
                    </text>
                  )}
                  {showBalanceFactor && node.balanceFactor !== undefined && (
                    <text
                      x={node.x + NODE_RADIUS + 6}
                      y={node.y - NODE_RADIUS + 4}
                      textAnchor="start"
                      className="font-mono"
                      fill={
                        Math.abs(node.balanceFactor) > 1
                          ? VIZ_COLORS.swapping
                          : VIZ_COLORS.highlighted
                      }
                      fontSize={10}
                    >
                      {node.balanceFactor > 0 ? "+" : ""}
                      {node.balanceFactor}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Dual view: array below tree */}
          {dualView && arrayData && (
            <g transform={`translate(0, ${treeHeight - 10})`}>
              {arrayData.map((value, index) => {
                const cellSize = Math.min(40, Math.max(24, (svgWidth - 40) / arrayData.length));
                const gap = 3;
                const totalArrayWidth = arrayData.length * (cellSize + gap);
                const startX = (svgWidth - totalArrayWidth) / 2;
                const x = startX + index * (cellSize + gap);

                let fillColor: string = VIZ_COLORS.default;
                if (arrayHighlights) {
                  for (const h of arrayHighlights) {
                    if (h.indices.includes(index)) {
                      fillColor = COLOR_MAP[h.color] ?? VIZ_COLORS.active;
                    }
                  }
                }

                return (
                  <g key={index}>
                    <motion.rect
                      x={x}
                      y={0}
                      width={cellSize}
                      height={cellSize}
                      rx={3}
                      fill={fillColor}
                      initial={false}
                      animate={{ fill: fillColor }}
                      transition={{ duration: 0.15 }}
                    />
                    <text
                      x={x + cellSize / 2}
                      y={cellSize / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#e2e8f0"
                      className="font-mono font-bold"
                      fontSize={Math.min(12, cellSize * 0.4)}
                    >
                      {value}
                    </text>
                    <text
                      x={x + cellSize / 2}
                      y={cellSize + 12}
                      textAnchor="middle"
                      className="fill-muted-foreground/60 font-mono"
                      fontSize={9}
                    >
                      {index}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
