"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateBeamSearchSteps } from "./logic";
import { BeamSearchCanvas } from "./Canvas";

export default function BeamSearchVisualization() {
  const steps = useMemo(() => generateBeamSearchSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <BeamSearchCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
