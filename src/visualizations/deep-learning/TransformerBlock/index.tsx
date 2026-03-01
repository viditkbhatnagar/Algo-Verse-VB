"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateTransformerBlockSteps } from "./logic";
import { TransformerBlockCanvas } from "./Canvas";

export default function TransformerBlockVisualization() {
  const steps = useMemo(() => generateTransformerBlockSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <TransformerBlockCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
