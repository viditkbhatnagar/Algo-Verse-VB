"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { DPInputControls } from "@/visualizations/_shared/InputControls";
import { generateLISSteps } from "./logic";
import { LISCanvas } from "./Canvas";

const DEFAULT_ARRAY = [10, 9, 2, 5, 3, 7, 101, 18];

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
}

export default function LISVisualization() {
  const [problemSize, setProblemSize] = useState(DEFAULT_ARRAY.length);
  const [input, setInput] = useState(DEFAULT_ARRAY);

  const steps = useMemo(() => generateLISSteps(input), [input]);

  const handleRandomize = useCallback(() => {
    setInput(generateRandomArray(problemSize));
  }, [problemSize]);

  const handleSizeChange = useCallback((size: number) => {
    setProblemSize(size);
    setInput(generateRandomArray(size));
  }, []);

  return (
    <div className="space-y-4">
      <DPInputControls
        problemSize={problemSize}
        onProblemSizeChange={handleSizeChange}
        onRandomize={handleRandomize}
        label="Array Size"
        minSize={4}
        maxSize={12}
      />
      <Player steps={steps}>
        {(currentStep) => <LISCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
