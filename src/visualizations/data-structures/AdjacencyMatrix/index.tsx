"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateAdjacencyMatrixSteps } from "./logic";
import { AdjacencyMatrixCanvas } from "./Canvas";

export default function AdjacencyMatrixVisualization() {
  const steps = useMemo(() => generateAdjacencyMatrixSteps(), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <span className="text-xs text-muted-foreground font-mono">
          5 Vertices (A-E) | 6 Undirected Edges | Dual View: Matrix + Adjacency List
        </span>
      </div>
      <Player steps={steps}>
        {(currentStep) => <AdjacencyMatrixCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
