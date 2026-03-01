"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generatePerceptronSteps } from "./logic";
import { PerceptronCanvas } from "./Canvas";

export default function PerceptronVisualization() {
  const [learningRate, setLearningRate] = useState(0.1);

  const steps = useMemo(
    () => generatePerceptronSteps({ learningRate }),
    [learningRate]
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
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "learningRate") setLearningRate(numValue);
  }, []);

  const handleReset = useCallback(() => {
    setLearningRate(0.1);
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <PerceptronCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
