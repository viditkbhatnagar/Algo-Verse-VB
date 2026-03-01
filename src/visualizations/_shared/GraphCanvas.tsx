"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { GraphNode, GraphEdge } from "@/lib/visualization/types";

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeStates: Record<string, "unvisited" | "visiting" | "visited">;
  currentNode: string | null;
  dataStructure?: {
    type: "stack" | "queue";
    items: string[];
  };
  visitOrder?: string[];
  className?: string;
}

const NODE_RADIUS = 22;

function getNodeColor(
  nodeId: string,
  state: "unvisited" | "visiting" | "visited",
  isCurrent: boolean
): string {
  if (isCurrent) return VIZ_COLORS.active;
  switch (state) {
    case "visiting":
      return VIZ_COLORS.comparing;
    case "visited":
      return VIZ_COLORS.completed;
    default:
      return VIZ_COLORS.default;
  }
}

function getEdgeColor(
  source: string,
  target: string,
  nodeStates: Record<string, "unvisited" | "visiting" | "visited">
): string {
  const srcVisited =
    nodeStates[source] === "visited" || nodeStates[source] === "visiting";
  const tgtVisited =
    nodeStates[target] === "visited" || nodeStates[target] === "visiting";
  if (srcVisited && tgtVisited) return VIZ_COLORS.completed;
  if (srcVisited || tgtVisited) return VIZ_COLORS.comparing;
  return "#334155";
}

export function GraphCanvas({
  nodes,
  edges,
  nodeStates,
  currentNode,
  dataStructure,
  visitOrder = [],
  className,
}: GraphCanvasProps) {
  return (
    <div className={`flex gap-4 ${className ?? ""}`}>
      <div className="flex-1 overflow-x-auto">
        <svg viewBox="0 0 400 320" className="w-full max-w-md mx-auto select-none">
          {/* Edges */}
          {edges.map((edge) => {
            const source = nodes.find((n) => n.id === edge.source);
            const target = nodes.find((n) => n.id === edge.target);
            if (!source || !target) return null;
            const color = getEdgeColor(edge.source, edge.target, nodeStates);

            return (
              <motion.line
                key={`${edge.source}-${edge.target}`}
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
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const state = nodeStates[node.id] ?? "unvisited";
            const isCurrent = node.id === currentNode;
            const color = getNodeColor(node.id, state, isCurrent);

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
                  animate={{
                    fill: color,
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  className="font-mono font-bold"
                  fontSize={14}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Side panel: Stack or Queue */}
      {dataStructure && (
        <div className="w-20 shrink-0 space-y-2">
          <p className="text-xs font-mono text-muted-foreground text-center font-bold uppercase">
            {dataStructure.type}
          </p>
          <div className="space-y-1">
            {dataStructure.items.map((item, i) => (
              <motion.div
                key={`${item}-${i}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface border border-border rounded px-2 py-1 text-center text-sm font-mono text-foreground"
              >
                {item}
              </motion.div>
            ))}
            {dataStructure.items.length === 0 && (
              <p className="text-xs text-muted-foreground/40 text-center italic">
                empty
              </p>
            )}
          </div>

          {visitOrder.length > 0 && (
            <>
              <p className="text-xs font-mono text-muted-foreground text-center font-bold uppercase mt-4">
                Visited
              </p>
              <p className="text-xs font-mono text-center text-muted-foreground">
                {visitOrder.join(" → ")}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
