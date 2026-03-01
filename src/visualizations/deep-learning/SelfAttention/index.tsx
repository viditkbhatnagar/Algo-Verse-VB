"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateSelfAttentionSteps } from "./logic";
import { SelfAttentionCanvas } from "./Canvas";

export default function SelfAttentionVisualization() {
  const steps = useMemo(() => generateSelfAttentionSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <SelfAttentionCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
