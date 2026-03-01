"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { InputControls } from "@/visualizations/_shared/InputControls";
import { generateCountingSortSteps } from "./logic";
import { CountingSortCanvas } from "./Canvas";

function generateRandomArray(size: number): number[] {
  // Counting sort works best with small value range
  return Array.from({ length: size }, () => Math.floor(Math.random() * 15) + 1);
}

export default function CountingSortVisualization() {
  const [arraySize, setArraySize] = useState(10);
  const [input, setInput] = useState(() => generateRandomArray(10));

  const steps = useMemo(() => generateCountingSortSteps(input), [input]);

  const handleRandomize = useCallback(() => {
    setInput(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleSizeChange = useCallback((size: number) => {
    setArraySize(size);
    setInput(generateRandomArray(size));
  }, []);

  return (
    <div className="space-y-4">
      <InputControls
        arraySize={arraySize}
        onArraySizeChange={handleSizeChange}
        onRandomize={handleRandomize}
        maxSize={20}
      />
      <Player steps={steps}>
        {(currentStep) => <CountingSortCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
