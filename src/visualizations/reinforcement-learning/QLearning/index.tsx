"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateQLearningSteps } from "./logic";
import { QLearningCanvas } from "./Canvas";

export default function QLearningVisualization() {
  const [learningRate, setLearningRate] = useState(0.5);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [epsilon, setEpsilon] = useState(0.3);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateQLearningSteps({ learningRate, discountFactor, epsilon, seed }),
    [learningRate, discountFactor, epsilon, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "learningRate",
      label: "Learning Rate",
      value: learningRate,
      min: 0.1,
      max: 1.0,
      step: 0.1,
    },
    {
      type: "slider",
      key: "discountFactor",
      label: "Discount",
      value: discountFactor,
      min: 0.5,
      max: 0.99,
      step: 0.01,
    },
    {
      type: "slider",
      key: "epsilon",
      label: "Epsilon",
      value: epsilon,
      min: 0.1,
      max: 0.5,
      step: 0.05,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "learningRate") setLearningRate(numValue);
    if (key === "discountFactor") setDiscountFactor(numValue);
    if (key === "epsilon") setEpsilon(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setLearningRate(0.5);
    setDiscountFactor(0.9);
    setEpsilon(0.3);
    setSeed(42);
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onRandomize={handleRandomize}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <QLearningCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
