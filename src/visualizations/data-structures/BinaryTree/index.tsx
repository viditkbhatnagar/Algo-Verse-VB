"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateBinaryTreeSteps } from "./logic";
import { BinaryTreeCanvas } from "./Canvas";

export default function BinaryTreeVisualization() {
  const steps = useMemo(() => generateBinaryTreeSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <BinaryTreeCanvas step={currentStep} />}
    </Player>
  );
}
