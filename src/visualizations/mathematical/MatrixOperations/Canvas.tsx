"use client";

import type { VisualizationStep } from "@/lib/visualization/types";
import { MatrixCanvas } from "@/visualizations/_shared/MatrixCanvas";
import type { MatrixMulStepData } from "./logic";

interface MatrixOperationsCanvasProps {
  step: VisualizationStep;
}

export function MatrixOperationsCanvas({ step }: MatrixOperationsCanvasProps) {
  const data = step.data as MatrixMulStepData;
  const {
    matrixA,
    matrixB,
    result,
    highlightsA,
    highlightsB,
    highlightsR,
    dotProductTerms,
    runningSum,
    phase,
  } = data;

  // Convert number[][] to (number | string | null)[][] for MatrixCanvas
  const matA: (number | string | null)[][] = matrixA.map((r) =>
    r.map((v) => v)
  );
  const matB: (number | string | null)[][] = matrixB.map((r) =>
    r.map((v) => v)
  );
  const matR: (number | string | null)[][] = result.map((r) =>
    r.map((v) => v)
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Matrix A */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-mono text-muted-foreground font-semibold">
            A ({matrixA.length}x{matrixA[0].length})
          </span>
          <MatrixCanvas
            matrix={matA}
            cellHighlights={highlightsA}
          />
        </div>

        {/* Multiplication sign */}
        <span className="text-xl font-bold text-muted-foreground">x</span>

        {/* Matrix B */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-mono text-muted-foreground font-semibold">
            B ({matrixB.length}x{matrixB[0].length})
          </span>
          <MatrixCanvas
            matrix={matB}
            cellHighlights={highlightsB}
          />
        </div>

        {/* Equals sign */}
        <span className="text-xl font-bold text-muted-foreground">=</span>

        {/* Result matrix */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-mono text-muted-foreground font-semibold">
            C ({matrixA.length}x{matrixB[0].length})
          </span>
          <MatrixCanvas
            matrix={matR}
            cellHighlights={highlightsR}
            showZeros={true}
          />
        </div>
      </div>

      {/* Dot product computation */}
      {(phase === "dot-product" || phase === "select-cell") &&
        dotProductTerms.length > 0 && (
          <div className="text-center font-mono text-sm text-muted-foreground">
            {dotProductTerms.join(" + ")} = {runningSum}
          </div>
        )}
    </div>
  );
}
