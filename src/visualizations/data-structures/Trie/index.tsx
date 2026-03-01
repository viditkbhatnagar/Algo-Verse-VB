"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateTrieSteps } from "./logic";
import { TrieCanvas } from "./Canvas";

export default function TrieVisualization() {
  const steps = useMemo(() => generateTrieSteps(), []);

  return (
    <Player steps={steps}>
      {(currentStep) => <TrieCanvas step={currentStep} />}
    </Player>
  );
}
