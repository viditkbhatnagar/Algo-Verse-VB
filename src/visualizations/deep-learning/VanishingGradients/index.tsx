"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateVanishingGradientsSteps } from "./logic";
import { VanishingGradientsCanvas } from "./Canvas";

export default function VanishingGradientsVisualization() {
  const steps = useMemo(() => generateVanishingGradientsSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <VanishingGradientsCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
