"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { InputControls } from "@/visualizations/_shared/InputControls";
import { generateHeapSortSteps } from "./logic";
import { HeapSortCanvas } from "./Canvas";

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export default function HeapSortVisualization() {
  const [arraySize, setArraySize] = useState(8);
  const [input, setInput] = useState(() => generateRandomArray(8));

  const steps = useMemo(() => generateHeapSortSteps(input), [input]);

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
        maxSize={15}
      />
      <Player steps={steps}>
        {(currentStep) => <HeapSortCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
