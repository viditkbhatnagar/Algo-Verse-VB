"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { DPInputControls } from "@/visualizations/_shared/InputControls";
import { generateRecursionSteps } from "./logic";
import { RecursionCanvas } from "./Canvas";

const DEFAULT_N = 5;

export default function RecursionVisualization() {
  const [n, setN] = useState(DEFAULT_N);

  const steps = useMemo(() => generateRecursionSteps(n), [n]);

  const handleSizeChange = useCallback((size: number) => {
    setN(size);
  }, []);

  const handleRandomize = useCallback(() => {
    // Pick a random n between 3 and 7
    setN(Math.floor(Math.random() * 5) + 3);
  }, []);

  return (
    <div className="space-y-4">
      <DPInputControls
        problemSize={n}
        onProblemSizeChange={handleSizeChange}
        onRandomize={handleRandomize}
        label="N"
        minSize={2}
        maxSize={8}
      />
      <Player steps={steps}>
        {(currentStep) => <RecursionCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
