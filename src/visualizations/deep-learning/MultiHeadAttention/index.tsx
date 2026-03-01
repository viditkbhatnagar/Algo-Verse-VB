"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateMultiHeadAttentionSteps } from "./logic";
import { MultiHeadAttentionCanvas } from "./Canvas";

export default function MultiHeadAttentionVisualization() {
  const steps = useMemo(() => generateMultiHeadAttentionSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <MultiHeadAttentionCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
