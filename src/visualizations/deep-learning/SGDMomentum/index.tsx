"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateSGDMomentumSteps } from "./logic";
import { SGDMomentumCanvas } from "./Canvas";

export default function SGDMomentumVisualization() {
  const [momentum, setMomentum] = useState(0.9);
  const [learningRate, setLearningRate] = useState(0.02);

  const steps = useMemo(
    () => generateSGDMomentumSteps({ momentum, learningRate }),
    [momentum, learningRate]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "momentum",
      label: "Momentum (β)",
      value: momentum,
      min: 0.0,
      max: 0.99,
      step: 0.01,
    },
    {
      type: "slider",
      key: "learningRate",
      label: "Learning Rate",
      value: learningRate,
      min: 0.001,
      max: 0.1,
      step: 0.001,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "momentum") setMomentum(numValue);
    if (key === "learningRate") setLearningRate(numValue);
  }, []);

  const handleReset = useCallback(() => {
    setMomentum(0.9);
    setLearningRate(0.02);
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <SGDMomentumCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
