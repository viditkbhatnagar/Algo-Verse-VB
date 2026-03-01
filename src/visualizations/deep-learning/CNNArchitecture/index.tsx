"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateCNNArchitectureSteps } from "./logic";
import { CNNArchitectureCanvas } from "./Canvas";

export default function CNNArchitectureVisualization() {
  const steps = useMemo(() => generateCNNArchitectureSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <CNNArchitectureCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
