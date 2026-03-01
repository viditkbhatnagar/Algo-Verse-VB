"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { GraphNode, WeightedEdge, HighlightColor } from "@/lib/visualization/types";

interface WeightedGraphCanvasProps {
  nodes: GraphNode[];
  edges: WeightedEdge[];
  nodeStates: Record<string, "unvisited" | "visiting" | "visited" | "in-queue">;
  currentNode: string | null;
  distances?: Record<string, number>;
  predecessors?: Record<string, string | null>;
  visitOrder?: string[];
  mstEdges?: { source: string; target: string }[];
  totalWeight?: number;
  showDistanceTable?: boolean;
  priorityQueue?: { node: string; priority: number }[];
  className?: string;
}

const NODE_RADIUS = 22;

const COLOR_MAP: Record<string, string> = {
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

function getNodeColor(
  state: "unvisited" | "visiting" | "visited" | "in-queue",
  isCurrent: boolean
): string {
  if (isCurrent) return VIZ_COLORS.active;
  switch (state) {
    case "visiting":
    case "in-queue":
      return VIZ_COLORS.comparing;
    case "visited":
      return VIZ_COLORS.completed;
    default:
      return VIZ_COLORS.default;
  }
}

function getEdgeColor(edge: WeightedEdge, mstSet: Set<string>, borderColor: string): string {
  if (edge.highlight) return COLOR_MAP[edge.highlight];
  if (edge.inMST || mstSet.has(`${edge.source}-${edge.target}`) || mstSet.has(`${edge.target}-${edge.source}`)) {
    return VIZ_COLORS.mstEdge;
  }
  return borderColor;
}

function getEdgeWidth(edge: WeightedEdge, mstSet: Set<string>): number {
  if (edge.inMST || mstSet.has(`${edge.source}-${edge.target}`) || mstSet.has(`${edge.target}-${edge.source}`)) {
    return 4;
  }
  if (edge.highlight) return 3;
  return 2;
}

export function WeightedGraphCanvas({
  nodes,
  edges,
  nodeStates,
  currentNode,
  distances,
  visitOrder = [],
  mstEdges,
  totalWeight,
  showDistanceTable = true,
  priorityQueue,
  className,
}: WeightedGraphCanvasProps) {
  const mstSet = new Set(
    (mstEdges ?? []).map((e) => `${e.source}-${e.target}`)
  );
  const themeColors = useThemeColors();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 440, height: 340 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const w = entry.contentRect.width;
        setDimensions({
          width: Math.max(300, w),
          height: Math.max(250, w * 0.77),
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`flex gap-4 ${className ?? ""}`}>
      <div ref={containerRef} className="flex-1 min-h-[250px] md:min-h-[300px]">
        <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full select-none">
          <defs>
            <marker
              id="wg-arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill={themeColors.textSecondary} />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge) => {
            const source = nodes.find((n) => n.id === edge.source);
            const target = nodes.find((n) => n.id === edge.target);
            if (!source || !target) return null;

            const color = getEdgeColor(edge, mstSet, themeColors.border);
            const width = getEdgeWidth(edge, mstSet);

            // Shorten line to not overlap nodes
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const offset = NODE_RADIUS + 2;
            const ratio = offset / dist;

            const x1 = source.x + dx * ratio;
            const y1 = source.y + dy * ratio;
            const x2 = target.x - dx * ratio;
            const y2 = target.y - dy * ratio;

            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            return (
              <g key={`${edge.source}-${edge.target}`}>
                <motion.line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={width}
                  initial={false}
                  animate={{ stroke: color, strokeWidth: width }}
                  transition={{ duration: 0.2 }}
                  markerEnd={edge.directed ? "url(#wg-arrowhead)" : undefined}
                />
                {/* Weight label */}
                <rect
                  x={midX - 10}
                  y={midY - 10}
                  width={20}
                  height={16}
                  rx={3}
                  fill={themeColors.bgSubtle}
                  opacity={0.8}
                />
                <text
                  x={midX}
                  y={midY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={themeColors.text}
                  className="font-mono"
                  fontSize={10}
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const state = nodeStates[node.id] ?? "unvisited";
            const isCurrent = node.id === currentNode;
            const color = getNodeColor(state, isCurrent);

            return (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill={color}
                  stroke={isCurrent ? themeColors.text : themeColors.border}
                  strokeWidth={isCurrent ? 3 : 2}
                  initial={false}
                  animate={{ fill: color, scale: isCurrent ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <text
                  x={node.x}
                  y={node.y - 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  className="font-mono font-bold"
                  fontSize={13}
                >
                  {node.label}
                </text>
                {/* Show distance below node */}
                {distances && distances[node.id] !== undefined && (
                  <text
                    x={node.x}
                    y={node.y + NODE_RADIUS + 14}
                    textAnchor="middle"
                    fill={VIZ_COLORS.highlighted}
                    className="font-mono"
                    fontSize={10}
                  >
                    d={distances[node.id] === Infinity ? "\u221E" : distances[node.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Side panel */}
      {showDistanceTable && (distances || priorityQueue) && (
        <div className="w-28 shrink-0 space-y-3 text-xs font-mono">
          {/* Distance table */}
          {distances && (
            <div>
              <p className="text-muted-foreground text-center font-bold uppercase mb-1">
                Distances
              </p>
              <div className="space-y-0.5">
                {Object.entries(distances).map(([node, dist]) => (
                  <div
                    key={node}
                    className={`flex justify-between px-1.5 py-0.5 rounded ${
                      node === currentNode ? "bg-primary/20 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <span>{node}</span>
                    <span>{dist === Infinity ? "\u221E" : dist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority queue */}
          {priorityQueue && priorityQueue.length > 0 && (
            <div>
              <p className="text-muted-foreground text-center font-bold uppercase mb-1">
                PQ
              </p>
              <div className="space-y-0.5">
                {priorityQueue.map((item, i) => (
                  <motion.div
                    key={`${item.node}-${i}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-surface border border-border rounded px-1.5 py-0.5 flex justify-between"
                  >
                    <span className="text-foreground">{item.node}</span>
                    <span className="text-muted-foreground">{item.priority}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Visit order */}
          {visitOrder.length > 0 && (
            <div>
              <p className="text-muted-foreground text-center font-bold uppercase mb-1">
                Visited
              </p>
              <p className="text-muted-foreground text-center">
                {visitOrder.join(" \u2192 ")}
              </p>
            </div>
          )}

          {/* Total weight */}
          {totalWeight !== undefined && (
            <div className="text-center">
              <p className="text-muted-foreground font-bold uppercase">Total</p>
              <p className="text-primary font-bold text-sm">{totalWeight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
