"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generatePriorityQueueSteps } from "./logic";
import { PriorityQueueCanvas } from "./Canvas";

export default function PriorityQueueVisualization() {
  const steps = useMemo(() => generatePriorityQueueSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <PriorityQueueCanvas step={currentStep} />}
    </Player>
  );
}
