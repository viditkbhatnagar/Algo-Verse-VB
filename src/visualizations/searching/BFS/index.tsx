"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateBFSSteps } from "./logic";
import { BFSCanvas } from "./Canvas";

export default function BFSVisualization() {
  const steps = useMemo(() => generateBFSSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <BFSCanvas step={currentStep} />}
    </Player>
  );
}
