"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateLossFunctionsSteps } from "./logic";
import { LossFunctionsCanvas } from "./Canvas";

export default function LossFunctionsVisualization() {
  const steps = useMemo(() => generateLossFunctionsSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <LossFunctionsCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
