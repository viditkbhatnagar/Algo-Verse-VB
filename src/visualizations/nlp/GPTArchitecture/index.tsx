"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateGPTArchitectureSteps } from "./logic";
import { GPTArchitectureCanvas } from "./Canvas";

export default function GPTArchitectureVisualization() {
  const steps = useMemo(() => generateGPTArchitectureSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <GPTArchitectureCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
