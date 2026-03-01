"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateUnionFindSteps } from "./logic";
import { UnionFindCanvas } from "./Canvas";

export default function UnionFindVisualization() {
  const steps = useMemo(() => generateUnionFindSteps(), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <span className="text-xs text-muted-foreground font-mono">
          Elements: {"{0,1,2,3,4,5}"} | Operations: union(0,1), union(2,3), union(0,2), find(3)
        </span>
      </div>
      <Player steps={steps}>
        {(currentStep) => <UnionFindCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
