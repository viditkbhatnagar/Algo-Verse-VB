"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { DPInputControls } from "@/visualizations/_shared/InputControls";
import { generateClimbingStairsSteps } from "./logic";
import { ClimbingStairsCanvas } from "./Canvas";

export default function ClimbingStairsVisualization() {
  const [problemSize, setProblemSize] = useState(8);

  const steps = useMemo(() => generateClimbingStairsSteps(problemSize), [problemSize]);

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
        label="Stairs"
        minSize={3}
        maxSize={15}
      />
      <Player steps={steps}>
        {(currentStep) => <ClimbingStairsCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
