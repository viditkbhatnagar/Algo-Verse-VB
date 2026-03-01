"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateMDPSteps } from "./logic";
import { MDPCanvas } from "./Canvas";

export default function MDPVisualization() {
  const steps = useMemo(() => generateMDPSteps({ gamma: 0.9 }), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <MDPCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
