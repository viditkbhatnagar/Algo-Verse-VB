"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateVanillaRNNSteps } from "./logic";
import { VanillaRNNCanvas } from "./Canvas";

export default function VanillaRNNVisualization() {
  const steps = useMemo(() => generateVanillaRNNSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <VanillaRNNCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
