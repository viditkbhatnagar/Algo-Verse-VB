"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateMaskedSelfAttentionSteps } from "./logic";
import { MaskedSelfAttentionCanvas } from "./Canvas";

export default function MaskedSelfAttentionVisualization() {
  const steps = useMemo(() => generateMaskedSelfAttentionSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <MaskedSelfAttentionCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
