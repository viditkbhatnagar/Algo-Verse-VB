"use client";

import type { VisualizationStep } from "@/lib/visualization/types";
import { TokenCanvas } from "@/visualizations/_shared/TokenCanvas";
import { HeatmapCanvas } from "@/visualizations/_shared/HeatmapCanvas";
import type { PositionalEncodingStepData } from "./logic";
import { motion } from "framer-motion";

interface PositionalEncodingCanvasProps {
  step: VisualizationStep;
}

export function PositionalEncodingCanvas({ step }: PositionalEncodingCanvasProps) {
  const data = step.data as PositionalEncodingStepData;

  return (
    <div className="space-y-4">
      {/* Token display with positions */}
      <TokenCanvas
        tokens={data.tokens}
        showConnections={false}
        className="w-full"
      />

      {/* Formula display for sin/cos phases */}
      {(data.phase === "sin-pattern" || data.phase === "cos-pattern") && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-2 rounded border border-purple-500/30 bg-purple-500/5">
            <div className="text-xs text-purple-400 font-mono text-center">
              {data.phase === "sin-pattern"
                ? "PE(pos, 2i) = sin(pos / 10000^(2i/d_model))"
                : "PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))"}
            </div>
          </div>
        </motion.div>
      )}

      {/* Addition illustration */}
      {data.phase === "added" && (
        <motion.div
          className="flex items-center justify-center gap-2 text-sm font-mono"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
            Embedding
          </span>
          <span className="text-muted-foreground">+</span>
          <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400">
            PE
          </span>
          <span className="text-muted-foreground">=</span>
          <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Input
          </span>
        </motion.div>
      )}

      {/* Heatmap of PE matrix */}
      <HeatmapCanvas
        cells={data.heatmap.cells}
        rows={data.heatmap.rows}
        cols={data.heatmap.cols}
        rowLabels={data.heatmap.rowLabels}
        colLabels={data.heatmap.colLabels}
        colorScale={data.heatmap.colorScale}
        currentCell={data.heatmap.currentCell}
        title={data.heatmap.title}
        showValues
        className="w-full"
      />

      {/* PE vector for highlighted position */}
      {data.peMatrix && data.currentPos !== undefined && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-2 rounded border border-indigo-500/30 bg-indigo-500/5">
            <div className="text-[10px] text-indigo-400 font-mono text-center">
              PE[{data.currentPos}] = [{data.peMatrix[data.currentPos].map((v) => v.toFixed(2)).join(", ")}]
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
