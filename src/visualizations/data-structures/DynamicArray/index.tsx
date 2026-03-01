"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateDynamicArraySteps } from "./logic";
import { DynamicArrayCanvas } from "./Canvas";

export default function DynamicArrayVisualization() {
  const steps = useMemo(() => generateDynamicArraySteps(), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="text-xs text-muted-foreground font-mono">
          Demo: Start with capacity 4, push elements until resize (4 → 8), continue pushing, pop
        </div>
      </div>
      <Player steps={steps}>
        {(currentStep) => <DynamicArrayCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
