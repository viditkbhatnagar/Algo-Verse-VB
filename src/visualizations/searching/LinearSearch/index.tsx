"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { generateLinearSearchSteps } from "./logic";
import { LinearSearchCanvas } from "./Canvas";

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export default function LinearSearchVisualization() {
  const [input, setInput] = useState(() => generateRandomArray(12));
  const [target, setTarget] = useState(() => 42);

  const steps = useMemo(
    () => generateLinearSearchSteps(input, target),
    [input, target]
  );

  const handleRandomize = useCallback(() => {
    const arr = generateRandomArray(12);
    setInput(arr);
    // Pick a random target — 50% chance it's in the array
    const inArray = Math.random() > 0.5;
    setTarget(
      inArray ? arr[Math.floor(Math.random() * arr.length)] : Math.floor(Math.random() * 90) + 10
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
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-16 bg-background border border-border rounded px-2 py-1 text-sm font-mono text-foreground"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <LinearSearchCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
