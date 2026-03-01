"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateBPESteps } from "./logic";
import { BPECanvas } from "./Canvas";

export default function BPEVisualization() {
  const steps = useMemo(() => generateBPESteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <BPECanvas step={currentStep} />}
      </Player>
    </div>
  );
}
