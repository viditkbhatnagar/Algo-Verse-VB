"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import { MatrixCanvas } from "@/visualizations/_shared/MatrixCanvas";
import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";
import type { AdjacencyMatrixStepData } from "./logic";

interface AdjacencyMatrixCanvasProps {
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

const NODE_RADIUS = 18;

function getEdgeColor(
  edge: { source: string; target: string },
  currentEdge?: { source: string; target: string }
): string {
  if (
    currentEdge &&
    ((edge.source === currentEdge.source && edge.target === currentEdge.target) ||
      (edge.source === currentEdge.target && edge.target === currentEdge.source))
  ) {
    return VIZ_COLORS.active;
  }
  return VIZ_COLORS.completed;
}

export function AdjacencyMatrixCanvas({ step }: AdjacencyMatrixCanvasProps) {
  const data = step.data as AdjacencyMatrixStepData;
  const {
    matrix,
    cellHighlights,
    rowHeaders,
    colHeaders,
    graph,
    adjacencyList,
    currentEdge,
  } = data;

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Left: Graph SVG */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-mono text-center font-bold uppercase">
            Graph
          </p>
          <div className="overflow-x-auto">
            <svg
              viewBox="0 0 300 270"
              className="w-full max-w-[280px] mx-auto select-none"
              style={{ minHeight: 200 }}
            >
              {/* Edges */}
              {graph.edges.map((edge) => {
                const source = graph.nodes.find((n) => n.id === edge.source);
                const target = graph.nodes.find((n) => n.id === edge.target);
                if (!source || !target) return null;
                const color = getEdgeColor(edge, currentEdge);

                return (
                  <motion.line
                    key={`${edge.source}-${edge.target}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={color}
                    strokeWidth={2}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, stroke: color }}
                    transition={{ duration: 0.3 }}
                  />
                );
              })}

              {/* Current edge highlight */}
              {currentEdge && (() => {
                const source = graph.nodes.find((n) => n.id === currentEdge.source);
                const target = graph.nodes.find((n) => n.id === currentEdge.target);
                if (!source || !target) return null;
                return (
                  <motion.line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={VIZ_COLORS.active}
                    strokeWidth={3}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                );
              })()}

              {/* Nodes */}
              {graph.nodes.map((node) => {
                const isCurrent =
                  currentEdge &&
                  (node.id === currentEdge.source || node.id === currentEdge.target);
                const fillColor = isCurrent ? VIZ_COLORS.active : VIZ_COLORS.default;

                return (
                  <g key={node.id}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={NODE_RADIUS}
                      fill={fillColor}
                      stroke={isCurrent ? "#fff" : "#334155"}
                      strokeWidth={isCurrent ? 2.5 : 1.5}
                      initial={false}
                      animate={{ fill: fillColor }}
                      transition={{ duration: 0.2 }}
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      className="font-mono font-bold"
                      fontSize={13}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Middle: Adjacency Matrix */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-mono text-center font-bold uppercase">
            Adjacency Matrix
          </p>
          <MatrixCanvas
            matrix={matrix}
            cellHighlights={cellHighlights}
            rowHeaders={rowHeaders}
            colHeaders={colHeaders}
            showZeros
          />
        </div>

        {/* Right: Adjacency List */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-mono text-center font-bold uppercase">
            Adjacency List
          </p>
          <div className="space-y-1">
            {Object.entries(adjacencyList).map(([vertex, neighbors]) => {
              const isActive =
                currentEdge &&
                (vertex === currentEdge.source || vertex === currentEdge.target);
              return (
                <motion.div
                  key={vertex}
                  className="flex items-center gap-1"
                  initial={false}
                  animate={{
                    backgroundColor: isActive
                      ? "rgba(99, 102, 241, 0.1)"
                      : "transparent",
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ borderRadius: 4, padding: "2px 6px" }}
                >
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold text-white shrink-0"
                    style={{
                      backgroundColor: isActive
                        ? VIZ_COLORS.active
                        : VIZ_COLORS.default,
                    }}
                  >
                    {vertex}
                  </span>
                  <span className="text-muted-foreground font-mono text-xs mx-1">
                    &rarr;
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {neighbors.length === 0 ? (
                      <span className="text-xs text-muted-foreground/40 font-mono italic">
                        empty
                      </span>
                    ) : (
                      neighbors.map((neighbor, i) => {
                        const isNewNeighbor =
                          currentEdge &&
                          ((vertex === currentEdge.source && neighbor === currentEdge.target) ||
                            (vertex === currentEdge.target && neighbor === currentEdge.source));
                        return (
                          <motion.span
                            key={`${vertex}-${neighbor}-${i}`}
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold"
                            style={{
                              backgroundColor: isNewNeighbor
                                ? VIZ_COLORS.active
                                : "#1e293b",
                              color: "#fff",
                              border: `1px solid ${isNewNeighbor ? VIZ_COLORS.active : "#334155"}`,
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {neighbor}
                          </motion.span>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
