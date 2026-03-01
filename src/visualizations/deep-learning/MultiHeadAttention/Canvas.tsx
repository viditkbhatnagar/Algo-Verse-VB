"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { MultiHeadStepData } from "./logic";

interface MultiHeadAttentionCanvasProps {
  step: VisualizationStep;
}

function MiniHeatmap({
  weights,
  tokens,
  label,
  color,
  active,
}: {
  weights: number[][];
  tokens: string[];
  label: string;
  color: string;
  active: boolean;
}) {
  const n = tokens.length;
  const cellSize = 28;
  const scale = useMemo(
    () => d3.scaleSequential(d3.interpolateBlues).domain([0, 1]),
    []
  );

  return (
    <motion.div
      className="p-2 rounded-lg border"
      style={{
        borderColor: active ? color : "#1e293b",
        backgroundColor: active ? `${color}10` : "transparent",
      }}
      animate={{
        borderColor: active ? color : "#1e293b",
        scale: active ? 1.02 : 0.98,
        opacity: active ? 1 : 0.5,
      }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="text-[10px] font-mono text-center mb-1"
        style={{ color }}
      >
        {label}
      </div>
      <table className="border-collapse mx-auto">
        <thead>
          <tr>
            <th style={{ width: cellSize }} />
            {tokens.map((t, i) => (
              <th
                key={i}
                className="text-[7px] text-muted-foreground font-mono px-0.5"
                style={{ width: cellSize }}
              >
                {t.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weights.map((row, ri) => (
            <tr key={ri}>
              <td className="text-[7px] text-muted-foreground font-mono pr-1 text-right">
                {tokens[ri].slice(0, 3)}
              </td>
              {row.map((val, ci) => {
                const bg = scale(val);
                const textBrightness = d3.lab(bg).l;
                return (
                  <td key={ci} className="p-0">
                    <motion.div
                      className="flex items-center justify-center font-mono"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: bg,
                        border: "1px solid #1e293b",
                        borderRadius: 2,
                        color: textBrightness > 55 ? "#0a0a0a" : "#e2e8f0",
                        fontSize: 8,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, backgroundColor: bg }}
                      transition={{ duration: 0.2, delay: (ri * n + ci) * 0.02 }}
                    >
                      {val.toFixed(2)}
                    </motion.div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export function MultiHeadAttentionCanvas({
  step,
}: MultiHeadAttentionCanvasProps) {
  const data = step.data as MultiHeadStepData;

  return (
    <div className="space-y-4" style={{ minHeight: 300 }}>
      {/* Token display */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {data.tokens.map((token, idx) => (
          <motion.div
            key={idx}
            className="px-3 py-1.5 rounded-md border border-indigo-500/40 bg-indigo-500/10 font-mono text-sm text-slate-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {token}
          </motion.div>
        ))}
      </div>

      {/* Mini heatmaps for each head */}
      <div className="flex flex-wrap justify-center gap-3">
        {data.heads.map((head) => (
          <MiniHeatmap
            key={head.id}
            weights={head.weights}
            tokens={data.tokens}
            label={head.label}
            color={head.color}
            active={head.active}
          />
        ))}
      </div>

      {/* Concatenation display */}
      {data.phase === "concat" && data.concatenated && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-2 rounded border border-cyan-500/30 bg-cyan-500/5">
            <div className="text-xs text-cyan-400 font-mono mb-1 text-center">
              Concatenated Output (n x d_model)
            </div>
            <div className="font-mono text-[9px] text-muted-foreground">
              {data.concatenated.map((row, i) => (
                <div key={i} className="flex gap-1">
                  <span className="text-cyan-300 w-10">{data.tokens[i]}</span>
                  [{row.map((v) => v.toFixed(2)).join(", ")}]
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Projected output */}
      {(data.phase === "projection" || data.phase === "complete") &&
        data.projected && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-2 rounded border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-xs text-emerald-400 font-mono mb-1 text-center">
                Projected Output = Concat * W_O
              </div>
              <div className="font-mono text-[9px] text-muted-foreground">
                {data.projected.map((row, i) => (
                  <div key={i} className="flex gap-1">
                    <span className="text-emerald-300 w-10">
                      {data.tokens[i]}
                    </span>
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
