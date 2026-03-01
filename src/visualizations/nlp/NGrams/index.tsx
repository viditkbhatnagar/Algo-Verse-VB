"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateNGramsSteps } from "./logic";
import { NGramsCanvas } from "./Canvas";

export default function NGramsVisualization() {
  const steps = useMemo(() => generateNGramsSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <NGramsCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
