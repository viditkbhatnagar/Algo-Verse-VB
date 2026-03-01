"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateTFIDFSteps } from "./logic";
import { TFIDFCanvas } from "./Canvas";

export default function TFIDFVisualization() {
  const steps = useMemo(() => generateTFIDFSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <TFIDFCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
