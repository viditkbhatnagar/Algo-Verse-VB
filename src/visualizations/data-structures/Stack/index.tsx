"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateStackSteps } from "./logic";
import { StackCanvas } from "./Canvas";

export default function StackVisualization() {
  const steps = useMemo(() => generateStackSteps(), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="text-xs text-muted-foreground font-mono">
          Demo: push(10), push(20), push(30), push(40), pop(), peek(), pop(), push(50), pop()
        </div>
      </div>
      <Player steps={steps}>
        {(currentStep) => <StackCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
