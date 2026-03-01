"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { generateBinarySearchSteps } from "./logic";
import { BinarySearchCanvas } from "./Canvas";

function generateSortedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => (i + 1) * Math.floor(Math.random() * 3 + 2))
    .sort((a, b) => a - b);
}

export default function BinarySearchVisualization() {
  const [input, setInput] = useState(() => generateSortedArray(12));
  const [target, setTarget] = useState(() => 14);

  const steps = useMemo(
    () => generateBinarySearchSteps(input, target),
    [input, target]
  );

  const handleRandomize = useCallback(() => {
    const arr = generateSortedArray(12);
    setInput(arr);
    // 50% chance target is in array
    const inArray = Math.random() > 0.5;
    setTarget(
      inArray ? arr[Math.floor(Math.random() * arr.length)] : Math.floor(Math.random() * 50) + 1
    );
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Target:</span>
          <input
            type="number"
            value={target}
            onChange={(e) => {
              const v = e.target.valueAsNumber;
              if (!Number.isNaN(v)) setTarget(v);
            }}
            className="w-16 bg-background border border-border rounded px-2 py-1 text-sm font-mono text-foreground"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <BinarySearchCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
