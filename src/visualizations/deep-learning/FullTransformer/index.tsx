"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateFullTransformerSteps } from "./logic";
import { FullTransformerCanvas } from "./Canvas";

export default function FullTransformerVisualization() {
  const steps = useMemo(() => generateFullTransformerSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <FullTransformerCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
