"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateAttentionVisualizationSteps } from "./logic";
import { AttentionVisualizationCanvas } from "./Canvas";

export default function AttentionVisualizationViz() {
  const steps = useMemo(() => generateAttentionVisualizationSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <AttentionVisualizationCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
