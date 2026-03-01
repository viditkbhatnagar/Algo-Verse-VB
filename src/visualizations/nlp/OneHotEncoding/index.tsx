"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateOneHotEncodingSteps } from "./logic";
import { OneHotEncodingCanvas } from "./Canvas";

export default function OneHotEncodingVisualization() {
  const steps = useMemo(() => generateOneHotEncodingSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <OneHotEncodingCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
