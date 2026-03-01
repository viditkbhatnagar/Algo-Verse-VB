"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateAdamOptimizerSteps } from "./logic";
import { AdamOptimizerCanvas } from "./Canvas";

export default function AdamOptimizerVisualization() {
  const [learningRate, setLearningRate] = useState(0.1);
  const [beta1, setBeta1] = useState(0.9);
  const [beta2, setBeta2] = useState(0.999);

  const steps = useMemo(
    () => generateAdamOptimizerSteps({ learningRate, beta1, beta2 }),
    [learningRate, beta1, beta2]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "learningRate",
      label: "Learning Rate",
      value: learningRate,
      min: 0.001,
      max: 0.5,
      step: 0.001,
    },
    {
      type: "slider",
      key: "beta1",
      label: "β₁",
      value: beta1,
      min: 0.5,
      max: 0.99,
      step: 0.01,
    },
    {
      type: "slider",
      key: "beta2",
      label: "β₂",
      value: beta2,
      min: 0.9,
      max: 0.9999,
      step: 0.001,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "learningRate") setLearningRate(numValue);
    if (key === "beta1") setBeta1(numValue);
    if (key === "beta2") setBeta2(numValue);
  }, []);

  const handleReset = useCallback(() => {
    setLearningRate(0.1);
    setBeta1(0.9);
    setBeta2(0.999);
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <AdamOptimizerCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
