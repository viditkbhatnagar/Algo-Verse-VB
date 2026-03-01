"use client";

import type { VisualizationStep } from "@/lib/visualization/types";
import { TokenCanvas } from "@/visualizations/_shared/TokenCanvas";
import { HeatmapCanvas } from "@/visualizations/_shared/HeatmapCanvas";
import type { SelfAttentionStepData } from "./logic";
import { motion } from "framer-motion";

interface SelfAttentionCanvasProps {
  step: VisualizationStep;
}

export function SelfAttentionCanvas({ step }: SelfAttentionCanvasProps) {
  const data = step.data as SelfAttentionStepData;

  return (
    <div className="space-y-4">
      {/* Token display */}
      <TokenCanvas
        tokens={data.tokens}
        showConnections={false}
        className="w-full"
      />

      {/* QKV matrices display */}
      {data.phase === "qkv" && (
        <div className="flex flex-wrap justify-center gap-4">
          {data.qMatrix && (
            <motion.div
              className="p-2 rounded border border-blue-500/30 bg-blue-500/5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs text-blue-400 font-mono mb-1 text-center">Q (Query)</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {data.qMatrix.map((row, i) => (
                  <div key={i} className="flex gap-1">
                    <span className="text-blue-300 w-10">{["The", "cat", "sat", "down"][i]}</span>
                    [{row.map((v) => v.toFixed(2)).join(", ")}]
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {data.kMatrix && (
            <motion.div
              className="p-2 rounded border border-green-500/30 bg-green-500/5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="text-xs text-green-400 font-mono mb-1 text-center">K (Key)</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {data.kMatrix.map((row, i) => (
                  <div key={i} className="flex gap-1">
                    <span className="text-green-300 w-10">{["The", "cat", "sat", "down"][i]}</span>
                    [{row.map((v) => v.toFixed(2)).join(", ")}]
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {data.vMatrix && (
            <motion.div
              className="p-2 rounded border border-purple-500/30 bg-purple-500/5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="text-xs text-purple-400 font-mono mb-1 text-center">V (Value)</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {data.vMatrix.map((row, i) => (
                  <div key={i} className="flex gap-1">
                    <span className="text-purple-300 w-10">{["The", "cat", "sat", "down"][i]}</span>
                    [{row.map((v) => v.toFixed(2)).join(", ")}]
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
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

      {/* Output vectors display */}
      {data.outputMatrix && data.phase === "output" && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-2 rounded border border-cyan-500/30 bg-cyan-500/5">
            <div className="text-xs text-cyan-400 font-mono mb-1 text-center">Output Vectors</div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {data.outputMatrix.map((row, i) => (
                <div key={i} className="flex gap-1">
                  <span className="text-cyan-300 w-10">{["The", "cat", "sat", "down"][i]}</span>
                  [{row.map((v) => v.toFixed(2)).join(", ")}]
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
