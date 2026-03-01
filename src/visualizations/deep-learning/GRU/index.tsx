"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateGRUSteps } from "./logic";
import { GRUCanvas } from "./Canvas";

export default function GRUVisualization() {
  const steps = useMemo(() => generateGRUSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <GRUCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
