"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateWordEmbeddingsSteps } from "./logic";
import { WordEmbeddingsCanvas } from "./Canvas";

export default function WordEmbeddingsVisualization() {
  const steps = useMemo(() => generateWordEmbeddingsSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <WordEmbeddingsCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
