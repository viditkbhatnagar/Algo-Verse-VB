"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";

interface ConvolutionCanvasProps {
  input: number[][];
  kernel: number[][];
  output: number[][];
  kernelPosition?: [number, number];
  padding?: number;
  stride?: number;
  currentOutputCell?: [number, number];
  computationDetail?: string;
  className?: string;
}

const CELL_SIZE = 36;

export function ConvolutionCanvas({
  input,
  kernel,
  output,
  kernelPosition,
  currentOutputCell,
  computationDetail,
  className,
}: ConvolutionCanvasProps) {
  const inputRows = input.length;
  const inputCols = input[0]?.length ?? 0;
  const kernelRows = kernel.length;
  const kernelCols = kernel[0]?.length ?? 0;
  const outputRows = output.length;
  const outputCols = output[0]?.length ?? 0;

  return (
    <div className={`${className ?? ""} space-y-3`} style={{ minHeight: 200 }}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {/* Input matrix */}
        <div className="space-y-1">
          <div className="text-[10px] text-muted-foreground font-mono text-center">Input</div>
          <div className="relative">
            <table className="border-collapse">
              <tbody>
                {input.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((val, ci) => {
                      const isUnderKernel =
                        kernelPosition &&
                        ri >= kernelPosition[0] &&
                        ri < kernelPosition[0] + kernelRows &&
                        ci >= kernelPosition[1] &&
                        ci < kernelPosition[1] + kernelCols;

                      return (
                        <td key={ci} className="p-0">
                          <motion.div
                            className="flex items-center justify-center font-mono text-xs border"
                            style={{
                              width: CELL_SIZE,
                              height: CELL_SIZE,
                              borderColor: isUnderKernel ? VIZ_COLORS.active : "#334155",
                              backgroundColor: isUnderKernel ? `${VIZ_COLORS.active}30` : "#1a1a2e",
                              color: "#e2e8f0",
                            }}
                            animate={{
                              backgroundColor: isUnderKernel ? `${VIZ_COLORS.active}30` : "#1a1a2e",
                              borderColor: isUnderKernel ? VIZ_COLORS.active : "#334155",
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            {val}
                          </motion.div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Convolution symbol */}
        <div className="flex items-center self-center text-muted-foreground font-mono text-xl">*</div>

        {/* Kernel matrix */}
        <div className="space-y-1">
          <div className="text-[10px] text-muted-foreground font-mono text-center">Kernel</div>
          <table className="border-collapse">
            <tbody>
              {kernel.map((row, ri) => (
                <tr key={ri}>
                  {row.map((val, ci) => (
                    <td key={ci} className="p-0">
                      <div
                        className="flex items-center justify-center font-mono text-xs border"
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          borderColor: VIZ_COLORS.comparing,
                          backgroundColor: `${VIZ_COLORS.comparing}20`,
                          color: "#e2e8f0",
                        }}
                      >
                        {val}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Equals symbol */}
        <div className="flex items-center self-center text-muted-foreground font-mono text-xl">=</div>

        {/* Output matrix */}
        <div className="space-y-1">
          <div className="text-[10px] text-muted-foreground font-mono text-center">Output</div>
          <table className="border-collapse">
            <tbody>
              {output.map((row, ri) => (
                <tr key={ri}>
                  {row.map((val, ci) => {
                    const isCurrent = currentOutputCell?.[0] === ri && currentOutputCell?.[1] === ci;
                    const hasValue = val !== 0 || isCurrent;
                    return (
                      <td key={ci} className="p-0">
                        <motion.div
                          className="flex items-center justify-center font-mono text-xs border"
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            borderColor: isCurrent ? VIZ_COLORS.completed : "#334155",
                            backgroundColor: isCurrent
                              ? `${VIZ_COLORS.completed}30`
                              : hasValue
                                ? "#1e293b"
                                : "#1a1a2e",
                            color: "#e2e8f0",
                          }}
                          animate={{
                            backgroundColor: isCurrent ? `${VIZ_COLORS.completed}30` : hasValue ? "#1e293b" : "#1a1a2e",
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {hasValue ? val : ""}
                        </motion.div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Computation detail */}
      {computationDetail && (
        <motion.div
          className="text-center text-xs font-mono text-muted-foreground bg-surface/50 rounded px-3 py-1.5 mx-auto max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {computationDetail}
        </motion.div>
      )}
    </div>
  );
}
