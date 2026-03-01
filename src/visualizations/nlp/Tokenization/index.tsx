"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateTokenizationSteps } from "./logic";
import { TokenizationCanvas } from "./Canvas";

export default function TokenizationVisualization() {
  const steps = useMemo(() => generateTokenizationSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <TokenizationCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
