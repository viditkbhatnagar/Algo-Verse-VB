"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import type { HeatmapCell } from "@/lib/visualization/types";
import { useThemeColors } from "@/hooks/useThemeColors";

interface HeatmapCanvasProps {
  cells: HeatmapCell[];
  rows: number;
  cols: number;
  rowLabels: string[];
  colLabels: string[];
  colorScale?: "attention" | "confusion" | "tfidf" | "generic";
  currentCell?: [number, number];
  title?: string;
  showValues?: boolean;
  className?: string;
}

const SCALE_CONFIGS: Record<string, { interpolator: (t: number) => string }> = {
  attention: { interpolator: d3.interpolateBlues },
  confusion: { interpolator: d3.interpolateRdYlGn },
  tfidf: { interpolator: d3.interpolateOranges },
  generic: { interpolator: d3.interpolatePurples },
};

export function HeatmapCanvas({
  cells,
  rows,
  cols,
  rowLabels,
  colLabels,
  colorScale = "generic",
  currentCell,
  title,
  showValues = true,
  className,
}: HeatmapCanvasProps) {
  const themeColors = useThemeColors();
  const values = cells.map((c) => c.value);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 1);

  const scale = useMemo(() => {
    const config = SCALE_CONFIGS[colorScale] ?? SCALE_CONFIGS.generic;
    return d3.scaleSequential(config.interpolator).domain([minVal, maxVal]);
  }, [colorScale, minVal, maxVal]);

  // Build a 2D lookup
  const grid = useMemo(() => {
    const g: (HeatmapCell | null)[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );
    for (const cell of cells) {
      if (cell.row < rows && cell.col < cols) {
        g[cell.row][cell.col] = cell;
      }
    }
    return g;
  }, [cells, rows, cols]);

  const cellSize = Math.min(48, Math.max(28, 400 / Math.max(rows, cols)));

  return (
    <div className={`${className ?? ""} space-y-2`} style={{ minHeight: 200 }}>
      {title && (
        <div className="text-center text-sm text-muted-foreground font-mono">{title}</div>
      )}
      <div className="overflow-x-auto flex justify-center">
        <table className="border-collapse">
          <thead>
            <tr>
              <th style={{ width: cellSize }} />
              {colLabels.map((label, ci) => (
                <th
                  key={ci}
                  className="text-[9px] text-muted-foreground font-mono font-normal px-1 pb-1 text-center"
                  style={{ width: cellSize, maxWidth: cellSize }}
                >
                  <span className="truncate block">{label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, ri) => (
              <tr key={ri}>
                <td className="text-[9px] text-muted-foreground font-mono pr-2 text-right whitespace-nowrap">
                  {rowLabels[ri] ?? ri}
                </td>
                {Array.from({ length: cols }).map((_, ci) => {
                  const cell = grid[ri]?.[ci];
                  const value = cell?.value ?? 0;
                  const bgColor = scale(value);
                  const isCurrent = currentCell?.[0] === ri && currentCell?.[1] === ci;
                  const textBrightness = d3.lab(bgColor).l;
                  const textColor = textBrightness > 55 ? "#0a0a0a" : "#e2e8f0";

                  return (
                    <td key={ci} className="p-0">
                      <motion.div
                        className="flex items-center justify-center font-mono"
                        style={{
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: bgColor,
                          border: isCurrent ? `2px solid ${themeColors.text}` : `1px solid ${themeColors.bgSubtle}`,
                          borderRadius: 2,
                          color: textColor,
                          fontSize: Math.min(10, cellSize * 0.28),
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, backgroundColor: bgColor }}
                        transition={{ duration: 0.2, delay: (ri * cols + ci) * 0.01 }}
                      >
                        {showValues ? value.toFixed(value >= 10 ? 0 : 2) : ""}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="text-[9px] text-muted-foreground font-mono">{minVal.toFixed(1)}</span>
        <div
          className="h-3 rounded"
          style={{
            width: 120,
            background: `linear-gradient(to right, ${scale(minVal)}, ${scale((minVal + maxVal) / 2)}, ${scale(maxVal)})`,
          }}
        />
        <span className="text-[9px] text-muted-foreground font-mono">{maxVal.toFixed(1)}</span>
      </div>
    </div>
  );
}
