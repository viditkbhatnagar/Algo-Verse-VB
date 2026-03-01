"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { generateTwoPointerSteps } from "./logic";
import { TwoPointerCanvas } from "./Canvas";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Shuffle } from "lucide-react";

const DEFAULT_ARRAY = [1, 2, 4, 6, 8, 9, 14, 15];
const DEFAULT_TARGET = 13;

function generateSortedArray(size: number): number[] {
  const arr: number[] = [];
  let val = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < size; i++) {
    arr.push(val);
    val += Math.floor(Math.random() * 4) + 1;
  }
  return arr;
}

function pickTarget(arr: number[]): number {
  // Pick a valid target (sum of two elements)
  if (arr.length < 2) return arr[0] ?? 10;
  const i = Math.floor(Math.random() * arr.length);
  let j = Math.floor(Math.random() * arr.length);
  while (j === i) j = Math.floor(Math.random() * arr.length);
  return arr[i] + arr[j];
}

export default function TwoPointerVisualization() {
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY.length);
  const [input, setInput] = useState<number[]>(DEFAULT_ARRAY);
  const [target, setTarget] = useState(DEFAULT_TARGET);

  const steps = useMemo(
    () => generateTwoPointerSteps(input, target),
    [input, target]
  );

  const handleRandomize = useCallback(() => {
    const arr = generateSortedArray(arraySize);
    const t = pickTarget(arr);
    setInput(arr);
    setTarget(t);
  }, [arraySize]);

  const handleSizeChange = useCallback((size: number) => {
    setArraySize(size);
    const arr = generateSortedArray(size);
    const t = pickTarget(arr);
    setInput(arr);
    setTarget(t);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Size:</span>
          <Slider
            className="w-24"
            min={4}
            max={12}
            step={1}
            value={[arraySize]}
            onValueChange={([val]) => handleSizeChange(val)}
          />
          <span className="text-xs text-muted-foreground font-mono w-6">
            {arraySize}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
        <span className="text-xs text-muted-foreground font-mono">
          Target: {target}
        </span>
      </div>
      <Player steps={steps}>
        {(currentStep) => <TwoPointerCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
