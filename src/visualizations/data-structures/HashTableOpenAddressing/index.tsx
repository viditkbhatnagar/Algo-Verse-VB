"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateHashTableOpenAddressingSteps } from "./logic";
import { HashTableOACanvas } from "./Canvas";

export default function HashTableOpenAddressingVisualization() {
  const steps = useMemo(() => generateHashTableOpenAddressingSteps(), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <span className="text-xs text-muted-foreground font-mono">
          Keys: [15, 25, 35, 10, 20] | Table Size: 7 | Linear Probing: h(key, i) = (key % 7 + i) % 7
        </span>
      </div>
      <Player steps={steps}>
        {(currentStep) => <HashTableOACanvas step={currentStep} />}
      </Player>
    </div>
  );
}
