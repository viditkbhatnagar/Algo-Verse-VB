"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateForwardPassSteps } from "./logic";
import { ForwardPassCanvas } from "./Canvas";

export default function ForwardPassVisualization() {
  const steps = useMemo(() => generateForwardPassSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <ForwardPassCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
