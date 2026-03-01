"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generatePositionalEncodingSteps } from "./logic";
import { PositionalEncodingCanvas } from "./Canvas";

export default function PositionalEncodingVisualization() {
  const steps = useMemo(() => generatePositionalEncodingSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <PositionalEncodingCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
