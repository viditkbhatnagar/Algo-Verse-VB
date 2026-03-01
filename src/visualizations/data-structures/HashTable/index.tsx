"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateHashTableChainingSteps } from "./logic";
import { HashTableChainingCanvas } from "./Canvas";

export default function HashTableChainingVisualization() {
  const steps = useMemo(() => generateHashTableChainingSteps(), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <span className="text-xs text-muted-foreground font-mono">
          Keys: [15, 25, 35, 10, 20] | Table Size: 7 | h(key) = key % 7
        </span>
      </div>
      <Player steps={steps}>
        {(currentStep) => <HashTableChainingCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
