"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { generateMatrixMulSteps } from "./logic";
import { MatrixOperationsCanvas } from "./Canvas";

function randomMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * 9) + 1)
  );
}

const DEFAULT_A: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
];
const DEFAULT_B: number[][] = [
  [7, 8],
  [9, 10],
  [11, 12],
];

export default function MatrixOperationsVisualization() {
  const [matrixA, setMatrixA] = useState(DEFAULT_A);
  const [matrixB, setMatrixB] = useState(DEFAULT_B);

  const steps = useMemo(
    () => generateMatrixMulSteps(matrixA, matrixB),
    [matrixA, matrixB]
  );

  const handleRandomize = useCallback(() => {
    // Random dimensions: rows 2-3, shared 2-4, cols 2-3
    const rows = Math.floor(Math.random() * 2) + 2;
    const shared = Math.floor(Math.random() * 3) + 2;
    const cols = Math.floor(Math.random() * 2) + 2;
    setMatrixA(randomMatrix(rows, shared));
    setMatrixB(randomMatrix(shared, cols));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-mono">
          {matrixA.length}x{matrixA[0].length} * {matrixB.length}x
          {matrixB[0].length}
        </span>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <MatrixOperationsCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
