"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateWord2VecSkipGramSteps } from "./logic";
import { Word2VecSkipGramCanvas } from "./Canvas";

export default function Word2VecSkipGramVisualization() {
  const steps = useMemo(() => generateWord2VecSkipGramSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <Word2VecSkipGramCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
