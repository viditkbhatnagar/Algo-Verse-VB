"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateBackpropagationSteps } from "./logic";
import { BackpropagationCanvas } from "./Canvas";

export default function BackpropagationVisualization() {
  const steps = useMemo(() => generateBackpropagationSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <BackpropagationCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
