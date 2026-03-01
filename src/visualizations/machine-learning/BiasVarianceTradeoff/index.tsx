"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateBiasVarianceSteps } from "./logic";
import { BiasVarianceCanvas } from "./Canvas";

export default function BiasVarianceTradeoffVisualization() {
  const steps = useMemo(() => generateBiasVarianceSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <BiasVarianceCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
