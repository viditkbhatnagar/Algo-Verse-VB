"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateBagOfWordsSteps } from "./logic";
import { BagOfWordsCanvas } from "./Canvas";

export default function BagOfWordsVisualization() {
  const steps = useMemo(() => generateBagOfWordsSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <BagOfWordsCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
