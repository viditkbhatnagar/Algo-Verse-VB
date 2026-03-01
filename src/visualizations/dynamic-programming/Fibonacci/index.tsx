"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { DPInputControls } from "@/visualizations/_shared/InputControls";
import { generateFibonacciSteps } from "./logic";
import { FibonacciCanvas } from "./Canvas";

export default function FibonacciVisualization() {
  const [problemSize, setProblemSize] = useState(10);

  const steps = useMemo(() => generateFibonacciSteps(problemSize), [problemSize]);

  const handleRandomize = useCallback(() => {
    const randomN = Math.floor(Math.random() * 13) + 3; // 3..15
    setProblemSize(randomN);
  }, []);

  const handleSizeChange = useCallback((size: number) => {
    setProblemSize(size);
  }, []);

  return (
    <div className="space-y-4">
      <DPInputControls
        problemSize={problemSize}
        onProblemSizeChange={handleSizeChange}
        onRandomize={handleRandomize}
        label="N"
        minSize={3}
        maxSize={15}
      />
      <Player steps={steps}>
        {(currentStep) => <FibonacciCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
