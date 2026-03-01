"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { DPInputControls } from "@/visualizations/_shared/InputControls";
import { generateMemoizationSteps } from "./logic";
import { MemoizationCanvas } from "./Canvas";

const DEFAULT_N = 6;

export default function MemoizationVisualization() {
  const [n, setN] = useState(DEFAULT_N);

  const steps = useMemo(() => generateMemoizationSteps(n), [n]);

  const handleSizeChange = useCallback((size: number) => {
    setN(size);
  }, []);

  const handleRandomize = useCallback(() => {
    // Pick a random n between 4 and 8
    setN(Math.floor(Math.random() * 5) + 4);
  }, []);

  return (
    <div className="space-y-4">
      <DPInputControls
        problemSize={n}
        onProblemSizeChange={handleSizeChange}
        onRandomize={handleRandomize}
        label="N"
        minSize={3}
        maxSize={8}
      />
      <Player steps={steps}>
        {(currentStep) => <MemoizationCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
