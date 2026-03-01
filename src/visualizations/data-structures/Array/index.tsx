"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateArraySteps } from "./logic";
import { ArrayVisualizationCanvas } from "./Canvas";

export default function ArrayVisualization() {
  const steps = useMemo(() => generateArraySteps(), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="text-xs text-muted-foreground font-mono">
          Demo: O(1) access, insert at middle (shift right), delete at middle (shift left)
        </div>
      </div>
      <Player steps={steps}>
        {(currentStep) => <ArrayVisualizationCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
