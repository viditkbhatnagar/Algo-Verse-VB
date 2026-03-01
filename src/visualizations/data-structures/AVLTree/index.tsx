"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateAVLTreeSteps } from "./logic";
import { AVLTreeCanvas } from "./Canvas";

export default function AVLTreeVisualization() {
  const steps = useMemo(() => generateAVLTreeSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <AVLTreeCanvas step={currentStep} />}
    </Player>
  );
}
