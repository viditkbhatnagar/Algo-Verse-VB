"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateCosineSimilaritySteps } from "./logic";
import { CosineSimilarityCanvas } from "./Canvas";

export default function CosineSimilarityVisualization() {
  const steps = useMemo(() => generateCosineSimilaritySteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <CosineSimilarityCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
