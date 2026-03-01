"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { DPInputControls } from "@/visualizations/_shared/InputControls";
import { generateKadanesSteps } from "./logic";
import { KadanesCanvas } from "./Canvas";

const DEFAULT_ARRAY = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 21) - 10
  );
}

export default function KadanesVisualization() {
  const [problemSize, setProblemSize] = useState(DEFAULT_ARRAY.length);
  const [input, setInput] = useState(DEFAULT_ARRAY);

  const steps = useMemo(() => generateKadanesSteps(input), [input]);

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
        minSize={5}
        maxSize={15}
      />
      <Player steps={steps}>
        {(currentStep) => <KadanesCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
