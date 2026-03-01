"use client";

import { useState, useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { GridInputControls } from "@/visualizations/_shared/InputControls";
import { generateSieveSteps } from "./logic";
import { SieveCanvas } from "./Canvas";

export default function SieveOfEratosthenesVisualization() {
  const [n, setN] = useState(50);

  const steps = useMemo(() => generateSieveSteps(n), [n]);

  return (
    <div className="space-y-4">
      <GridInputControls
        gridSize={n}
        onGridSizeChange={setN}
        minSize={10}
        maxSize={100}
        label="n"
      />
      <Player steps={steps}>
        {(currentStep) => <SieveCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
