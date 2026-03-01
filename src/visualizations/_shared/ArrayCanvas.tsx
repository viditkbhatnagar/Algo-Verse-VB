"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import { useThemeColors } from "@/hooks/useThemeColors";

interface ArrayCanvasProps {
  data: number[];
  currentIndex: number;
  target?: number;
  checked?: number[];
  eliminated?: number[];
  found?: boolean;
  foundIndex?: number;
  pointers?: Map<string, number>; // "low" -> 2, "mid" -> 5, etc.
  className?: string;
}

const POINTER_COLORS: Record<string, string> = {
  low: VIZ_COLORS.active,
  mid: VIZ_COLORS.comparing,
  high: VIZ_COLORS.swapping,
};

export function ArrayCanvas({
  data,
  currentIndex,
  target,
  checked = [],
  eliminated = [],
  found = false,
  foundIndex,
  pointers,
  className,
}: ArrayCanvasProps) {
  const themeColors = useThemeColors();
  const cellSize = Math.min(56, Math.max(32, 600 / data.length));
  const totalWidth = data.length * (cellSize + 4);

  function getCellColor(index: number): string {
    if (found && index === foundIndex) return VIZ_COLORS.completed;
    if (index === currentIndex) return VIZ_COLORS.active;
    if (eliminated.includes(index)) return themeColors.bgSubtle;
    if (checked.includes(index)) return themeColors.border;
    return VIZ_COLORS.default;
  }

  function getTextColor(index: number): string {
    if (eliminated.includes(index)) return themeColors.textSecondary;
    return themeColors.text;
  }

  return (
    <div className={className}>
      {target !== undefined && (
        <div className="text-sm text-muted-foreground mb-3 font-mono">
          Target: <span className="text-primary font-bold">{target}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <svg
          width={Math.max(totalWidth + 20, 100)}
          height={cellSize + 60}
          className="select-none mx-auto"
        >
          <g transform="translate(10, 10)">
            {data.map((value, index) => {
              const x = index * (cellSize + 4);
              const color = getCellColor(index);
              const textColor = getTextColor(index);

              return (
                <g key={index}>
                  <motion.rect
                    x={x}
                    y={0}
                    width={cellSize}
                    height={cellSize}
                    rx={4}
                    fill={color}
                    initial={false}
                    animate={{ fill: color }}
                    transition={{ duration: 0.15 }}
                  />
                  <text
                    x={x + cellSize / 2}
                    y={cellSize / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    className="font-mono font-bold"
                    fontSize={Math.min(14, cellSize * 0.35)}
                  >
                    {value}
                  </text>
                  <text
                    x={x + cellSize / 2}
                    y={cellSize + 14}
                    textAnchor="middle"
                    className="fill-muted-foreground/60 font-mono"
                    fontSize={10}
                  >
                    {index}
                  </text>
                </g>
              );
            })}

            {/* Pointer labels */}
            {pointers &&
              Array.from(pointers.entries()).map(([label, index]) => {
                if (index < 0 || index >= data.length) return null;
                const x = index * (cellSize + 4) + cellSize / 2;
                const color = POINTER_COLORS[label] ?? VIZ_COLORS.highlighted;
                return (
                  <g key={label}>
                    <text
                      x={x}
                      y={cellSize + 32}
                      textAnchor="middle"
                      fill={color}
                      className="font-mono font-bold"
                      fontSize={11}
                    >
                      {label}
                    </text>
                    <line
                      x1={x}
                      y1={cellSize + 18}
                      x2={x}
                      y2={cellSize + 24}
                      stroke={color}
                      strokeWidth={2}
                    />
                  </g>
                );
              })}
          </g>
        </svg>
      </div>
    </div>
  );
}
