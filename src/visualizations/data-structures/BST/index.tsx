"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateBSTSteps } from "./logic";
import { BSTCanvas } from "./Canvas";

export default function BSTVisualization() {
  const steps = useMemo(() => generateBSTSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <BSTCanvas step={currentStep} />}
    </Player>
  );
}
