"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateLinkedListSteps } from "./logic";
import { LinkedListVizCanvas } from "./Canvas";

export default function LinkedListVisualization() {
  const steps = useMemo(() => generateLinkedListSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <LinkedListVizCanvas step={currentStep} />}
    </Player>
  );
}
