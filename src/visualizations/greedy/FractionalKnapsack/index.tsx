"use client";

import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { Player } from "@/components/visualization/Player";
import { generateFractionalKnapsackSteps, DEFAULT_INPUT } from "./logic";
import type { DefaultInput } from "./logic";
import { FractionalKnapsackCanvas } from "./Canvas";

function generateRandomInput(): DefaultInput {
  const numItems = Math.floor(Math.random() * 3) + 3; // 3-5 items
  const items: { weight: number; value: number }[] = [];
  for (let i = 0; i < numItems; i++) {
    const weight = Math.floor(Math.random() * 25) + 5;
    const value = Math.floor(Math.random() * 100) + 20;
    items.push({ weight, value });
  }
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const capacity = Math.floor(totalWeight * 0.5) + Math.floor(Math.random() * 10);
  return { items, capacity };
}

export default function FractionalKnapsackVisualization() {
  const [input, setInput] = useState<DefaultInput>(DEFAULT_INPUT);

  const steps = useMemo(
    () => generateFractionalKnapsackSteps(input),
    [input],
  );

  const handleRandomize = useCallback(() => {
    setInput(generateRandomInput());
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground font-mono">
          {input.items.length} items, capacity {input.capacity}
        </span>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <FractionalKnapsackCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
