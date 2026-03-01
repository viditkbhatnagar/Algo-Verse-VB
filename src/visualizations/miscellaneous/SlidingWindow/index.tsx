"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { generateSlidingWindowSteps } from "./logic";
import { SlidingWindowCanvas } from "./Canvas";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Shuffle } from "lucide-react";

const DEFAULT_ARRAY = [2, 1, 5, 1, 3, 2, 8, 1, 3];
const DEFAULT_K = 3;

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 9) + 1);
}

export default function SlidingWindowVisualization() {
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY.length);
  const [k, setK] = useState(DEFAULT_K);
  const [input, setInput] = useState<number[]>(DEFAULT_ARRAY);

  const steps = useMemo(
    () => generateSlidingWindowSteps(input, k),
    [input, k]
  );

  const handleRandomize = useCallback(() => {
    setInput(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleSizeChange = useCallback(
    (size: number) => {
      setArraySize(size);
      setInput(generateRandomArray(size));
      // Ensure k doesn't exceed array size
      if (k > size) setK(Math.max(2, Math.floor(size / 2)));
    },
    [k]
  );

  const handleKChange = useCallback((newK: number) => {
    setK(newK);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            Size:
          </span>
          <Slider
            className="w-24"
            min={5}
            max={15}
            step={1}
            value={[arraySize]}
            onValueChange={([val]) => handleSizeChange(val)}
          />
          <span className="text-xs text-muted-foreground font-mono w-6">
            {arraySize}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">k:</span>
          <Slider
            className="w-20"
            min={2}
            max={Math.min(arraySize, 6)}
            step={1}
            value={[k]}
            onValueChange={([val]) => handleKChange(val)}
          />
          <span className="text-xs text-muted-foreground font-mono w-6">
            {k}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <SlidingWindowCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
