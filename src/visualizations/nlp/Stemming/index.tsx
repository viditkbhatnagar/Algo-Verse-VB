"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateStemmingSteps } from "./logic";
import { StemmingCanvas } from "./Canvas";

export default function StemmingVisualization() {
  const steps = useMemo(() => generateStemmingSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <StemmingCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
