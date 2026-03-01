"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { LinkedListNodeData, HighlightColor } from "@/lib/visualization/types";

interface LinkedListCanvasProps {
  nodes: LinkedListNodeData[];
  headId: string | null;
  tailId: string | null;
  currentId: string | null;
  pointers: Record<string, string>;
  showPrev?: boolean;
  className?: string;
}

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

const NODE_WIDTH = 60;
const NODE_HEIGHT = 36;
const GAP = 40;
const ARROW_SIZE = 8;

export function LinkedListCanvas({
  nodes,
  headId,
  currentId,
  pointers,
  showPrev = false,
  className,
}: LinkedListCanvasProps) {
  if (nodes.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-[100px] text-muted-foreground text-sm ${className ?? ""}`}>
        Empty list
      </div>
    );
  }

  const themeColors = useThemeColors();

  // Build ordered list from head
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const ordered: LinkedListNodeData[] = [];
  let current = headId;
  const visited = new Set<string>();

  while (current && nodeMap.has(current) && !visited.has(current)) {
    visited.add(current);
    ordered.push(nodeMap.get(current)!);
    current = nodeMap.get(current)!.next;
  }

  // If some nodes weren't reachable from head, add them
  for (const n of nodes) {
    if (!visited.has(n.id)) ordered.push(n);
  }

  const totalWidth = ordered.length * (NODE_WIDTH + GAP) + 30;
  const svgHeight = showPrev ? 120 : 100;

  // Reverse pointer map: nodeId -> labels
  const pointerLabels = new Map<string, string[]>();
  for (const [label, nodeId] of Object.entries(pointers)) {
    const existing = pointerLabels.get(nodeId) ?? [];
    existing.push(label);
    pointerLabels.set(nodeId, existing);
  }

  return (
    <div className={`overflow-x-auto ${className ?? ""}`}>
      <svg
        width={Math.max(totalWidth, 200)}
        height={svgHeight}
        className="select-none mx-auto"
      >
        <defs>
          <marker
            id="ll-arrow"
            markerWidth={ARROW_SIZE}
            markerHeight={ARROW_SIZE}
            refX={ARROW_SIZE}
            refY={ARROW_SIZE / 2}
            orient="auto"
          >
            <polygon
              points={`0 0, ${ARROW_SIZE} ${ARROW_SIZE / 2}, 0 ${ARROW_SIZE}`}
              fill={VIZ_COLORS.highlighted}
            />
          </marker>
          <marker
            id="ll-arrow-back"
            markerWidth={ARROW_SIZE}
            markerHeight={ARROW_SIZE}
            refX={0}
            refY={ARROW_SIZE / 2}
            orient="auto"
          >
            <polygon
              points={`${ARROW_SIZE} 0, 0 ${ARROW_SIZE / 2}, ${ARROW_SIZE} ${ARROW_SIZE}`}
              fill={themeColors.textSecondary}
            />
          </marker>
        </defs>

        <g transform="translate(15, 20)">
          {ordered.map((node, index) => {
            const x = index * (NODE_WIDTH + GAP);
            const y = 10;
            const isCurrent = node.id === currentId;
            const color = isCurrent
              ? VIZ_COLORS.active
              : node.highlight
                ? COLOR_MAP[node.highlight]
                : VIZ_COLORS.default;

            const nextIndex = index + 1;
            const hasNext = nextIndex < ordered.length;
            const labels = pointerLabels.get(node.id);

            return (
              <g key={node.id}>
                {/* Node rect */}
                <motion.rect
                  x={x}
                  y={y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={6}
                  fill={color}
                  stroke={isCurrent ? themeColors.text : themeColors.border}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                  initial={false}
                  animate={{ fill: color }}
                  transition={{ duration: 0.2 }}
                />
                {/* Value text */}
                <text
                  x={x + NODE_WIDTH / 2}
                  y={y + NODE_HEIGHT / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  className="font-mono font-bold"
                  fontSize={13}
                >
                  {node.value}
                </text>

                {/* Forward arrow */}
                {hasNext && (
                  <line
                    x1={x + NODE_WIDTH}
                    y1={y + NODE_HEIGHT / 2}
                    x2={x + NODE_WIDTH + GAP - ARROW_SIZE}
                    y2={y + NODE_HEIGHT / 2}
                    stroke={VIZ_COLORS.highlighted}
                    strokeWidth={2}
                    markerEnd="url(#ll-arrow)"
                  />
                )}

                {/* Backward arrow (doubly linked) */}
                {showPrev && index > 0 && (
                  <line
                    x1={x}
                    y1={y + NODE_HEIGHT / 2 + 8}
                    x2={x - GAP + ARROW_SIZE}
                    y2={y + NODE_HEIGHT / 2 + 8}
                    stroke={themeColors.textSecondary}
                    strokeWidth={1.5}
                    markerEnd="url(#ll-arrow-back)"
                  />
                )}

                {/* Null terminator */}
                {!hasNext && (
                  <g>
                    <line
                      x1={x + NODE_WIDTH}
                      y1={y + NODE_HEIGHT / 2}
                      x2={x + NODE_WIDTH + 16}
                      y2={y + NODE_HEIGHT / 2}
                      stroke={themeColors.textSecondary}
                      strokeWidth={2}
                    />
                    <text
                      x={x + NODE_WIDTH + 22}
                      y={y + NODE_HEIGHT / 2}
                      textAnchor="start"
                      dominantBaseline="central"
                      fill={themeColors.textSecondary}
                      className="font-mono font-bold"
                      fontSize={12}
                    >
                      null
                    </text>
                  </g>
                )}

                {/* Pointer labels below */}
                {labels && (
                  <text
                    x={x + NODE_WIDTH / 2}
                    y={y + NODE_HEIGHT + 18}
                    textAnchor="middle"
                    fill={VIZ_COLORS.highlighted}
                    className="font-mono font-bold"
                    fontSize={10}
                  >
                    {labels.join(", ")}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
