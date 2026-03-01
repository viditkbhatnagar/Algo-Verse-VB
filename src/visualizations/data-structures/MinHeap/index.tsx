"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateMinHeapSteps } from "./logic";
import { MinHeapCanvas } from "./Canvas";

export default function MinHeapVisualization() {
  const steps = useMemo(() => generateMinHeapSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <MinHeapCanvas step={currentStep} />}
    </Player>
  );
}
