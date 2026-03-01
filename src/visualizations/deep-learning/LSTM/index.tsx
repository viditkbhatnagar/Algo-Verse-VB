"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateLSTMSteps } from "./logic";
import { LSTMCanvas } from "./Canvas";

export default function LSTMVisualization() {
  const steps = useMemo(() => generateLSTMSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <LSTMCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
