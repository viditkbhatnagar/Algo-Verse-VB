"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { GCDStepData } from "./logic";

interface EuclideanGCDCanvasProps {
  step: VisualizationStep;
}

export function EuclideanGCDCanvas({ step }: EuclideanGCDCanvasProps) {
  const data = step.data as GCDStepData;
  const { stepRows, currentRow, phase, result } = data;

  const headers = ["Step", "a", "b", "a / b", "a % b"];
  const colWidths = [60, 80, 80, 80, 80];
  const totalWidth = colWidths.reduce((s, w) => s + w, 0);
  const rowHeight = 40;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="overflow-x-auto">
        <table className="border-collapse font-mono text-sm">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className="text-center text-xs text-muted-foreground font-semibold px-3 py-2 border-b border-border/30"
                  style={{ width: colWidths[i], minWidth: colWidths[i] }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stepRows.map((row, idx) => {
              const isCurrent = idx === currentRow;
              const isPast = idx < currentRow;

              return (
                <tr key={idx}>
                  {[
                    idx + 1,
                    row.a,
                    row.b,
                    row.quotient,
                    row.remainder,
                  ].map((val, ci) => (
                    <td key={ci} className="p-0">
                      <motion.div
                        className="flex items-center justify-center border-b border-border/10"
                        style={{
                          width: colWidths[ci],
                          height: rowHeight,
                          minWidth: colWidths[ci],
                        }}
                        initial={false}
                        animate={{
                          backgroundColor: isCurrent
                            ? VIZ_COLORS.active
                            : isPast
                              ? "#1e3a2e"
                              : "#1e293b",
                          scale: isCurrent ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span
                          className={`${
                            isCurrent
                              ? "text-white font-bold"
                              : isPast
                                ? "text-emerald-300"
                                : "text-foreground"
                          }`}
                        >
                          {val}
                        </span>
                      </motion.div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Result */}
      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-xs text-muted-foreground font-mono">
            Result:{" "}
          </span>
          <span
            className="text-lg font-bold font-mono"
            style={{ color: VIZ_COLORS.completed }}
          >
            GCD = {result}
          </span>
        </motion.div>
      )}

      {/* Current equation */}
      {phase === "compute" && currentRow >= 0 && (
        <div className="text-center font-mono text-sm text-muted-foreground">
          gcd({stepRows[currentRow].a}, {stepRows[currentRow].b}) = gcd(
          {stepRows[currentRow].b}, {stepRows[currentRow].remainder})
        </div>
      )}
    </div>
  );
}
