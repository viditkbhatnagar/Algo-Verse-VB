"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateNERSteps } from "./logic";
import { NERCanvas } from "./Canvas";

export default function NERVisualization() {
  const steps = useMemo(() => generateNERSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <NERCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
