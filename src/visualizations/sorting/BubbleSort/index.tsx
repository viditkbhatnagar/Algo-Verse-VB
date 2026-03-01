"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { InputControls } from "@/visualizations/_shared/InputControls";
import { generateBubbleSortSteps } from "./logic";
import { BubbleSortCanvas } from "./Canvas";

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export default function BubbleSortVisualization() {
  const [arraySize, setArraySize] = useState(10);
  const [input, setInput] = useState(() => generateRandomArray(10));

  const steps = useMemo(() => generateBubbleSortSteps(input), [input]);

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
      />
      <Player steps={steps}>
        {(currentStep) => <BubbleSortCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
