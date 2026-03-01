"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateWord2VecCBOWSteps } from "./logic";
import { Word2VecCBOWCanvas } from "./Canvas";

export default function Word2VecCBOWVisualization() {
  const steps = useMemo(() => generateWord2VecCBOWSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <Word2VecCBOWCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
