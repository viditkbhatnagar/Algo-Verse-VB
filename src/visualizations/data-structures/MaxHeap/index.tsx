"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateMaxHeapSteps } from "./logic";
import { MaxHeapCanvas } from "./Canvas";

export default function MaxHeapVisualization() {
  const steps = useMemo(() => generateMaxHeapSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <MaxHeapCanvas step={currentStep} />}
    </Player>
  );
}
