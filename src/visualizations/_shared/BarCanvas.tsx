"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { VIZ_COLORS } from "@/lib/constants";
import type { HighlightColor } from "@/lib/visualization/types";

interface BarCanvasProps {
  data: number[];
  highlights: Map<number, HighlightColor>;
  labels?: Map<number, string>;
  completedIndices?: Set<number>;
  showValues?: boolean;
  className?: string;
}

const COLOR_MAP: Record<HighlightColor | "default", string> = {
  default: VIZ_COLORS.default,
  active: VIZ_COLORS.active,
  comparing: VIZ_COLORS.comparing,
  swapping: VIZ_COLORS.swapping,
  completed: VIZ_COLORS.completed,
  selected: VIZ_COLORS.highlighted,
  path: "#a78bfa",
};

function getBarColor(
  index: number,
  highlights: Map<number, HighlightColor>,
  completedIndices?: Set<number>
): string {
  const highlight = highlights.get(index);
  if (highlight) return COLOR_MAP[highlight];
  if (completedIndices?.has(index)) return COLOR_MAP.completed;
  return COLOR_MAP.default;
}

export function BarCanvas({
  data,
  highlights,
  labels,
  completedIndices,
  showValues = true,
  className,
}: BarCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(250, entry.contentRect.height),
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const padding = { top: 30, right: 10, bottom: 40, left: 10 };
  const innerWidth = dimensions.width - padding.left - padding.right;
  const innerHeight = dimensions.height - padding.top - padding.bottom;

  const xScale = d3
    .scaleBand()
    .domain(data.map((_, i) => String(i)))
    .range([0, innerWidth])
    .padding(0.15);

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...data, 1)])
    .range([0, innerHeight]);

  const barWidth = xScale.bandwidth();

  return (
    <div ref={containerRef} className={className} style={{ minHeight: 250 }}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="select-none"
      >
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {data.map((value, index) => {
            const x = xScale(String(index)) ?? 0;
            const barHeight = yScale(value);
            const y = innerHeight - barHeight;
            const color = getBarColor(index, highlights, completedIndices);

            return (
              <g key={index}>
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={2}
                  fill={color}
                  initial={false}
                  animate={{ x, y, height: barHeight, fill: color }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                />
                {showValues && barWidth > 16 && (
                  <motion.text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono"
                    fontSize={Math.min(12, barWidth * 0.5)}
                    initial={false}
                    animate={{ x: x + barWidth / 2, y: y - 6 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {value}
                  </motion.text>
                )}
                {/* Index label below bar */}
                <text
                  x={x + barWidth / 2}
                  y={innerHeight + 16}
                  textAnchor="middle"
                  className="fill-muted-foreground/60 font-mono"
                  fontSize={Math.min(10, barWidth * 0.4)}
                >
                  {index}
                </text>
                {/* Pointer label if any */}
                {labels?.has(index) && (
                  <text
                    x={x + barWidth / 2}
                    y={innerHeight + 30}
                    textAnchor="middle"
                    className="fill-primary font-mono font-bold"
                    fontSize={10}
                  >
                    {labels.get(index)}
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
