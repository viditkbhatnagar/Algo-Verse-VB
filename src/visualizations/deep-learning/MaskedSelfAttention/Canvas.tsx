"use client";

import type { VisualizationStep } from "@/lib/visualization/types";
import { TokenCanvas } from "@/visualizations/_shared/TokenCanvas";
import { HeatmapCanvas } from "@/visualizations/_shared/HeatmapCanvas";
import type { MaskedAttentionStepData } from "./logic";
import { motion } from "framer-motion";

interface MaskedSelfAttentionCanvasProps {
  step: VisualizationStep;
}

export function MaskedSelfAttentionCanvas({ step }: MaskedSelfAttentionCanvasProps) {
  const data = step.data as MaskedAttentionStepData;

  return (
    <div className="space-y-4">
      {/* Token display */}
      <TokenCanvas
        tokens={data.tokens}
        showConnections={false}
        className="w-full"
      />

      {/* Causal mask explanation */}
      {data.phase === "mask" && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-2 rounded border border-red-500/30 bg-red-500/5">
            <div className="text-xs text-red-400 font-mono text-center">
              Causal Mask: upper triangle = -inf (future tokens blocked)
            </div>
            <div className="text-[10px] text-muted-foreground font-mono text-center mt-1">
              Token at position i can only attend to positions 0, 1, ..., i
            </div>
          </div>
        </motion.div>
      )}

      {/* Masked scores explanation */}
      {data.phase === "masked-scores" && (
        <motion.div
          className="flex items-center justify-center gap-2 text-sm font-mono"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
            Scores
          </span>
          <span className="text-muted-foreground">+</span>
          <span className="px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400">
            Mask
          </span>
          <span className="text-muted-foreground">=</span>
          <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400">
            Masked Scores
          </span>
        </motion.div>
      )}

      {/* Heatmap */}
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

      {/* Visual indicator of causal pattern */}
      {(data.phase === "softmax" || data.phase === "complete") && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-2 rounded border border-emerald-500/30 bg-emerald-500/5">
            <div className="text-[10px] text-emerald-400 font-mono text-center">
              Lower-triangular pattern: each token attends only to past + self
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
