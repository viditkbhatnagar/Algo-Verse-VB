"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateLemmatizationSteps } from "./logic";
import { LemmatizationCanvas } from "./Canvas";

export default function LemmatizationVisualization() {
  const steps = useMemo(() => generateLemmatizationSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <LemmatizationCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
