"use client";

import { useState, useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { GridInputControls } from "@/visualizations/_shared/InputControls";
import { generateNQueensSteps } from "./logic";
import { NQueensCanvas } from "./Canvas";

export default function NQueensVisualization() {
  const [n, setN] = useState(8);

  const steps = useMemo(() => generateNQueensSteps(n), [n]);

  return (
    <div className="space-y-4">
      <GridInputControls
        gridSize={n}
        onGridSizeChange={setN}
        minSize={4}
        maxSize={10}
        label="N"
      />
      <Player steps={steps}>
        {(currentStep) => <NQueensCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
