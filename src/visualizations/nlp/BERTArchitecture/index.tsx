"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateBERTArchitectureSteps } from "./logic";
import { BERTArchitectureCanvas } from "./Canvas";

export default function BERTArchitectureVisualization() {
  const steps = useMemo(() => generateBERTArchitectureSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <BERTArchitectureCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
