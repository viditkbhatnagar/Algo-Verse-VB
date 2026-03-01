"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateDFSSteps } from "./logic";
import { DFSCanvas } from "./Canvas";

export default function DFSVisualization() {
  const steps = useMemo(() => generateDFSSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <DFSCanvas step={currentStep} />}
    </Player>
  );
}
