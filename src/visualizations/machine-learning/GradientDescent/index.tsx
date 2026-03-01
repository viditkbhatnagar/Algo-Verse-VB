"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateGradientDescentSteps } from "./logic";
import { GradientDescentCanvas } from "./Canvas";

export default function GradientDescentVisualization() {
  const [learningRate, setLearningRate] = useState(0.1);
  const [startingX, setStartingX] = useState(3.0);

  const steps = useMemo(
    () => generateGradientDescentSteps({ learningRate, startingX }),
    [learningRate, startingX]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "learningRate",
      label: "Learning Rate",
      value: learningRate,
      min: 0.01,
      max: 1.0,
      step: 0.01,
    },
    {
      type: "slider",
      key: "startingX",
      label: "Start X",
      value: startingX,
      min: -4,
      max: 4,
      step: 0.1,
    },
  ];

  const handleControlChange = useCallback(
    (key: string, value: number | string) => {
      if (key === "learningRate") setLearningRate(value as number);
      if (key === "startingX") setStartingX(value as number);
    },
    []
  );

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
      />
      <Player steps={steps}>
        {(currentStep) => <GradientDescentCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
